/**
 * @fileoverview Checkpoint Manager for MUSUBI
 * @module managers/checkpoint-manager
 * @version 1.0.0
 * @description Manage development checkpoints with state snapshots
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');

/**
 * Checkpoint states
 */
const CheckpointState = {
  CREATED: 'created',
  ACTIVE: 'active',
  RESTORED: 'restored',
  ARCHIVED: 'archived',
};

/**
 * Default checkpoint configuration
 */
const DEFAULT_CONFIG = {
  maxCheckpoints: 50,
  storageDir: '.musubi/checkpoints',
  autoCheckpoint: true,
  autoCheckpointInterval: 30 * 60 * 1000, // 30 minutes
  compressionEnabled: false,
  includePatterns: ['**/*'],
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '*.log',
    '.musubi/checkpoints/**',
  ],
};

/**
 * Checkpoint metadata
 * @typedef {Object} CheckpointMeta
 * @property {string} id - Unique checkpoint ID
 * @property {string} name - Human-readable name
 * @property {string} description - Checkpoint description
 * @property {string} timestamp - ISO timestamp
 * @property {string} state - Current state
 * @property {Object} context - Development context
 * @property {Object} stats - File statistics
 * @property {string[]} tags - Tags for categorization
 */

/**
 * Checkpoint Manager
 * Manages development state checkpoints
 */
class CheckpointManager extends EventEmitter {
  /**
   * Create a CheckpointManager instance
   * @param {Object} options - Configuration options
   * @param {string} options.workspaceDir - Workspace directory
   * @param {string} [options.storageDir] - Checkpoint storage directory
   * @param {number} [options.maxCheckpoints=50] - Maximum checkpoints to keep
   * @param {boolean} [options.autoCheckpoint=true] - Enable auto-checkpointing
   */
  constructor(options = {}) {
    super();
    this.workspaceDir = options.workspaceDir || process.cwd();
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.storageDir = path.isAbsolute(this.config.storageDir)
      ? this.config.storageDir
      : path.join(this.workspaceDir, this.config.storageDir);
    this.checkpoints = new Map();
    this.currentCheckpoint = null;
    this.autoCheckpointTimer = null;
  }

  /**
   * Initialize the checkpoint manager
   * @returns {Promise<void>}
   */
  async initialize() {
    await fs.ensureDir(this.storageDir);
    await this._loadCheckpoints();

    if (this.config.autoCheckpoint) {
      this._startAutoCheckpoint();
    }

    this.emit('initialized', { checkpointCount: this.checkpoints.size });
  }

  /**
   * Create a new checkpoint
   * @param {Object} options - Checkpoint options
   * @param {string} [options.name] - Checkpoint name
   * @param {string} [options.description] - Description
   * @param {string[]} [options.tags] - Tags
   * @param {Object} [options.context] - Additional context
   * @returns {Promise<CheckpointMeta>} Created checkpoint
   */
  async create(options = {}) {
    const id = this._generateId();
    const timestamp = new Date().toISOString();
    const name = options.name || `checkpoint-${timestamp.split('T')[0]}`;

    const checkpoint = {
      id,
      name,
      description: options.description || '',
      timestamp,
      state: CheckpointState.CREATED,
      context: options.context || {},
      tags: options.tags || [],
      stats: {
        filesCount: 0,
        totalSize: 0,
      },
    };

    // Create checkpoint directory
    const checkpointDir = path.join(this.storageDir, id);
    await fs.ensureDir(checkpointDir);

    // Snapshot files
    await this._snapshotFiles(checkpointDir, checkpoint);

    // Save metadata
    await this._saveCheckpointMeta(id, checkpoint);

    // Add to map
    this.checkpoints.set(id, checkpoint);
    this.currentCheckpoint = id;

    // Cleanup old checkpoints
    await this._cleanupOldCheckpoints();

    this.emit('created', checkpoint);
    return checkpoint;
  }

  /**
   * Restore a checkpoint
   * @param {string} checkpointId - Checkpoint ID to restore
   * @param {Object} [options] - Restore options
   * @param {boolean} [options.backup=true] - Create backup before restoring
   * @returns {Promise<CheckpointMeta>} Restored checkpoint
   */
  async restore(checkpointId, options = {}) {
    const { backup = true } = options;

    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    // Create backup if requested
    if (backup) {
      await this.create({
        name: `backup-before-restore-${checkpoint.name}`,
        description: `Auto-backup before restoring checkpoint ${checkpoint.name}`,
        tags: ['backup', 'auto'],
      });
    }

    // Restore files
    const checkpointDir = path.join(this.storageDir, checkpointId, 'files');
    await this._restoreFiles(checkpointDir);

    // Update checkpoint state
    checkpoint.state = CheckpointState.RESTORED;
    await this._saveCheckpointMeta(checkpointId, checkpoint);

    this.currentCheckpoint = checkpointId;
    this.emit('restored', checkpoint);

    return checkpoint;
  }

  /**
   * List all checkpoints
   * @param {Object} [options] - List options
   * @param {string[]} [options.tags] - Filter by tags
   * @param {string} [options.state] - Filter by state
   * @param {number} [options.limit] - Maximum results
   * @returns {CheckpointMeta[]} List of checkpoints
   */
  list(options = {}) {
    let checkpoints = Array.from(this.checkpoints.values());

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      checkpoints = checkpoints.filter(cp =>
        options.tags.some(tag => cp.tags.includes(tag))
      );
    }

    // Filter by state
    if (options.state) {
      checkpoints = checkpoints.filter(cp => cp.state === options.state);
    }

    // Sort by timestamp (newest first)
    checkpoints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit
    if (options.limit) {
      checkpoints = checkpoints.slice(0, options.limit);
    }

    return checkpoints;
  }

  /**
   * Get a specific checkpoint
   * @param {string} checkpointId - Checkpoint ID
   * @returns {CheckpointMeta|null} Checkpoint or null
   */
  get(checkpointId) {
    return this.checkpoints.get(checkpointId) || null;
  }

  /**
   * Delete a checkpoint
   * @param {string} checkpointId - Checkpoint ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(checkpointId) {
    if (!this.checkpoints.has(checkpointId)) {
      return false;
    }

    const checkpointDir = path.join(this.storageDir, checkpointId);
    await fs.remove(checkpointDir);

    this.checkpoints.delete(checkpointId);

    if (this.currentCheckpoint === checkpointId) {
      this.currentCheckpoint = null;
    }

    this.emit('deleted', { id: checkpointId });
    return true;
  }

  /**
   * Archive a checkpoint
   * @param {string} checkpointId - Checkpoint ID
   * @returns {Promise<CheckpointMeta>} Updated checkpoint
   */
  async archive(checkpointId) {
    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    checkpoint.state = CheckpointState.ARCHIVED;
    await this._saveCheckpointMeta(checkpointId, checkpoint);

    this.emit('archived', checkpoint);
    return checkpoint;
  }

  /**
   * Compare two checkpoints
   * @param {string} checkpointId1 - First checkpoint ID
   * @param {string} checkpointId2 - Second checkpoint ID
   * @returns {Promise<Object>} Comparison result
   */
  async compare(checkpointId1, checkpointId2) {
    const cp1 = this.checkpoints.get(checkpointId1);
    const cp2 = this.checkpoints.get(checkpointId2);

    if (!cp1 || !cp2) {
      throw new Error('One or both checkpoints not found');
    }

    const files1 = await this._getFileList(checkpointId1);
    const files2 = await this._getFileList(checkpointId2);

    const added = files2.filter(f => !files1.includes(f));
    const removed = files1.filter(f => !files2.includes(f));
    const common = files1.filter(f => files2.includes(f));

    // Check for modified files
    const modified = [];
    for (const file of common) {
      const hash1 = await this._getFileHash(checkpointId1, file);
      const hash2 = await this._getFileHash(checkpointId2, file);
      if (hash1 !== hash2) {
        modified.push(file);
      }
    }

    return {
      checkpoint1: { id: checkpointId1, name: cp1.name, timestamp: cp1.timestamp },
      checkpoint2: { id: checkpointId2, name: cp2.name, timestamp: cp2.timestamp },
      changes: {
        added: added.length,
        removed: removed.length,
        modified: modified.length,
        unchanged: common.length - modified.length,
      },
      files: {
        added,
        removed,
        modified,
      },
    };
  }

  /**
   * Get the current checkpoint
   * @returns {CheckpointMeta|null} Current checkpoint or null
   */
  getCurrent() {
    if (!this.currentCheckpoint) return null;
    return this.checkpoints.get(this.currentCheckpoint) || null;
  }

  /**
   * Add tags to a checkpoint
   * @param {string} checkpointId - Checkpoint ID
   * @param {string[]} tags - Tags to add
   * @returns {Promise<CheckpointMeta>} Updated checkpoint
   */
  async addTags(checkpointId, tags) {
    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    checkpoint.tags = [...new Set([...checkpoint.tags, ...tags])];
    await this._saveCheckpointMeta(checkpointId, checkpoint);

    return checkpoint;
  }

  /**
   * Stop auto-checkpointing
   */
  stopAutoCheckpoint() {
    if (this.autoCheckpointTimer) {
      clearInterval(this.autoCheckpointTimer);
      this.autoCheckpointTimer = null;
    }
  }

  /**
   * Generate a unique checkpoint ID
   * @private
   */
  _generateId() {
    return `cp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Load existing checkpoints from storage
   * @private
   */
  async _loadCheckpoints() {
    try {
      const entries = await fs.readdir(this.storageDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith('cp-')) {
          const metaPath = path.join(this.storageDir, entry.name, 'meta.json');
          if (await fs.pathExists(metaPath)) {
            const meta = await fs.readJSON(metaPath);
            this.checkpoints.set(entry.name, meta);
          }
        }
      }
    } catch (error) {
      // Ignore errors, start fresh
    }
  }

  /**
   * Save checkpoint metadata
   * @private
   */
  async _saveCheckpointMeta(id, checkpoint) {
    const metaPath = path.join(this.storageDir, id, 'meta.json');
    await fs.writeJSON(metaPath, checkpoint, { spaces: 2 });
  }

  /**
   * Snapshot workspace files
   * @private
   */
  async _snapshotFiles(checkpointDir, checkpoint) {
    const filesDir = path.join(checkpointDir, 'files');
    await fs.ensureDir(filesDir);

    const files = await this._getWorkspaceFiles();
    let totalSize = 0;

    for (const file of files) {
      const srcPath = path.join(this.workspaceDir, file);
      const destPath = path.join(filesDir, file);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath);

      const stats = await fs.stat(srcPath);
      totalSize += stats.size;
    }

    checkpoint.stats = {
      filesCount: files.length,
      totalSize,
    };
  }

  /**
   * Restore files from checkpoint
   * @private
   */
  async _restoreFiles(checkpointDir) {
    const files = await this._getFilesInDir(checkpointDir);

    for (const file of files) {
      const srcPath = path.join(checkpointDir, file);
      const destPath = path.join(this.workspaceDir, file);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath, { overwrite: true });
    }
  }

  /**
   * Get workspace files matching patterns
   * @private
   */
  async _getWorkspaceFiles() {
    const { glob } = require('glob');

    // Get all files matching include patterns
    let allFiles = [];
    for (const pattern of this.config.includePatterns) {
      const matches = await glob(pattern, {
        cwd: this.workspaceDir,
        nodir: true,
        ignore: this.config.excludePatterns,
        dot: true,
      });
      allFiles.push(...matches);
    }

    return [...new Set(allFiles)];
  }

  /**
   * Get files in a directory recursively
   * @private
   */
  async _getFilesInDir(dir) {
    const results = [];

    async function walk(currentDir, basePath = '') {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath, relativePath);
        } else {
          results.push(relativePath);
        }
      }
    }

    await walk(dir);
    return results;
  }

  /**
   * Get file list from checkpoint
   * @private
   */
  async _getFileList(checkpointId) {
    const filesDir = path.join(this.storageDir, checkpointId, 'files');
    if (!await fs.pathExists(filesDir)) {
      return [];
    }
    return this._getFilesInDir(filesDir);
  }

  /**
   * Get file hash
   * @private
   */
  async _getFileHash(checkpointId, file) {
    const filePath = path.join(this.storageDir, checkpointId, 'files', file);
    if (!await fs.pathExists(filePath)) {
      return null;
    }

    const content = await fs.readFile(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Cleanup old checkpoints
   * @private
   */
  async _cleanupOldCheckpoints() {
    const checkpoints = this.list();

    // Keep archived checkpoints separate
    const activeCheckpoints = checkpoints.filter(
      cp => cp.state !== CheckpointState.ARCHIVED
    );

    if (activeCheckpoints.length > this.config.maxCheckpoints) {
      const toDelete = activeCheckpoints.slice(this.config.maxCheckpoints);
      for (const cp of toDelete) {
        await this.delete(cp.id);
      }
    }
  }

  /**
   * Start auto-checkpointing
   * @private
   */
  _startAutoCheckpoint() {
    this.autoCheckpointTimer = setInterval(async () => {
      try {
        await this.create({
          name: 'auto-checkpoint',
          description: 'Automatic checkpoint',
          tags: ['auto'],
        });
        this.emit('auto-checkpoint');
      } catch (error) {
        this.emit('error', error);
      }
    }, this.config.autoCheckpointInterval);
  }
}

module.exports = {
  CheckpointManager,
  CheckpointState,
  DEFAULT_CONFIG,
};
