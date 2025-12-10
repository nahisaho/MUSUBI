/**
 * @fileoverview Tests for CheckpointManager
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const {
  CheckpointManager,
  CheckpointState,
  DEFAULT_CONFIG,
} = require('../../src/managers/checkpoint-manager');

describe('CheckpointManager', () => {
  const testDir = path.join(__dirname, '../test-output/checkpoint-test');
  const storageDir = path.join(testDir, '.musubi/checkpoints');
  const sourceDir = path.join(testDir, 'workspace');
  let manager;

  beforeAll(async () => {
    // Create test workspace with sample files
    await fs.ensureDir(sourceDir);
    await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(sourceDir, 'file2.txt'), 'content2');
    await fs.ensureDir(path.join(sourceDir, 'subdir'));
    await fs.writeFile(path.join(sourceDir, 'subdir/file3.txt'), 'content3');
  });

  beforeEach(async () => {
    // Clean storage before each test
    await fs.remove(storageDir);
    manager = new CheckpointManager({
      workspaceDir: sourceDir,
      storageDir,
      autoCheckpoint: false,
    });
    await manager.initialize();
  });

  afterEach(async () => {
    if (manager) {
      manager.stopAutoCheckpoint();
    }
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  describe('constructor', () => {
    test('should create manager with default config', () => {
      const mgr = new CheckpointManager();
      expect(mgr.workspaceDir).toBe(process.cwd());
      expect(mgr.config.maxCheckpoints).toBe(DEFAULT_CONFIG.maxCheckpoints);
      mgr.stopAutoCheckpoint();
    });

    test('should create manager with custom config', () => {
      const mgr = new CheckpointManager({
        workspaceDir: '/custom/dir',
        maxCheckpoints: 10,
      });
      expect(mgr.workspaceDir).toBe('/custom/dir');
      expect(mgr.config.maxCheckpoints).toBe(10);
      mgr.stopAutoCheckpoint();
    });
  });

  describe('initialize', () => {
    test('should create storage directory', async () => {
      expect(await fs.pathExists(storageDir)).toBe(true);
    });

    test('should emit initialized event', async () => {
      const newManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'init-test'),
        autoCheckpoint: false,
      });

      const initPromise = new Promise(resolve => {
        newManager.on('initialized', resolve);
      });

      await newManager.initialize();
      const event = await initPromise;

      expect(event).toHaveProperty('checkpointCount');
      newManager.stopAutoCheckpoint();
    });
  });

  describe('create', () => {
    test('should create checkpoint with auto-generated name', async () => {
      const checkpoint = await manager.create();

      expect(checkpoint.id).toMatch(/^cp-\d+-[a-f0-9]+$/);
      expect(checkpoint.name).toMatch(/^checkpoint-\d{4}-\d{2}-\d{2}$/);
      expect(checkpoint.state).toBe(CheckpointState.CREATED);
    });

    test('should create checkpoint with custom name', async () => {
      const checkpoint = await manager.create({
        name: 'my-checkpoint',
        description: 'Test checkpoint',
        tags: ['test', 'feature'],
      });

      expect(checkpoint.name).toBe('my-checkpoint');
      expect(checkpoint.description).toBe('Test checkpoint');
      expect(checkpoint.tags).toEqual(['test', 'feature']);
    });

    test('should snapshot files', async () => {
      const checkpoint = await manager.create({ name: 'snapshot-test' });

      expect(checkpoint.stats.filesCount).toBeGreaterThan(0);
      expect(checkpoint.stats.totalSize).toBeGreaterThan(0);

      // Verify files are copied
      const snapshotDir = path.join(storageDir, checkpoint.id, 'files');
      expect(await fs.pathExists(path.join(snapshotDir, 'file1.txt'))).toBe(true);
      expect(await fs.pathExists(path.join(snapshotDir, 'subdir/file3.txt'))).toBe(true);
    });

    test('should emit created event', async () => {
      const createPromise = new Promise(resolve => {
        manager.on('created', resolve);
      });

      await manager.create({ name: 'event-test' });
      const checkpoint = await createPromise;

      expect(checkpoint.name).toBe('event-test');
    });

    test('should save metadata', async () => {
      const checkpoint = await manager.create({ name: 'meta-test' });

      const metaPath = path.join(storageDir, checkpoint.id, 'meta.json');
      expect(await fs.pathExists(metaPath)).toBe(true);

      const meta = await fs.readJSON(metaPath);
      expect(meta.name).toBe('meta-test');
    });

    test('should set current checkpoint', async () => {
      const checkpoint = await manager.create({ name: 'current-test' });
      expect(manager.currentCheckpoint).toBe(checkpoint.id);
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      await manager.create({ name: 'cp1', tags: ['feature'] });
      await manager.create({ name: 'cp2', tags: ['bugfix'] });
      await manager.create({ name: 'cp3', tags: ['feature', 'test'] });
    });

    test('should list all checkpoints', () => {
      const checkpoints = manager.list();
      expect(checkpoints.length).toBe(3);
    });

    test('should filter by tags', () => {
      const checkpoints = manager.list({ tags: ['feature'] });
      expect(checkpoints.length).toBe(2);
    });

    test('should filter by state', async () => {
      const list = manager.list();
      await manager.archive(list[0].id);

      const archived = manager.list({ state: CheckpointState.ARCHIVED });
      expect(archived.length).toBe(1);
    });

    test('should apply limit', () => {
      const checkpoints = manager.list({ limit: 2 });
      expect(checkpoints.length).toBe(2);
    });

    test('should sort by timestamp (newest first)', () => {
      const checkpoints = manager.list();
      expect(checkpoints[0].name).toBe('cp3');
      expect(checkpoints[2].name).toBe('cp1');
    });
  });

  describe('get', () => {
    test('should return checkpoint by ID', async () => {
      const created = await manager.create({ name: 'get-test' });
      const retrieved = manager.get(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved.name).toBe('get-test');
    });

    test('should return null for non-existent checkpoint', () => {
      const result = manager.get('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    test('should delete checkpoint', async () => {
      const checkpoint = await manager.create({ name: 'delete-test' });
      const result = await manager.delete(checkpoint.id);

      expect(result).toBe(true);
      expect(manager.get(checkpoint.id)).toBeNull();
      expect(await fs.pathExists(path.join(storageDir, checkpoint.id))).toBe(false);
    });

    test('should return false for non-existent checkpoint', async () => {
      const result = await manager.delete('non-existent-id');
      expect(result).toBe(false);
    });

    test('should emit deleted event', async () => {
      const checkpoint = await manager.create({ name: 'delete-event' });

      const deletePromise = new Promise(resolve => {
        manager.on('deleted', resolve);
      });

      await manager.delete(checkpoint.id);
      const event = await deletePromise;

      expect(event.id).toBe(checkpoint.id);
    });

    test('should clear current checkpoint if deleted', async () => {
      const checkpoint = await manager.create({ name: 'current-delete' });
      expect(manager.currentCheckpoint).toBe(checkpoint.id);

      await manager.delete(checkpoint.id);
      expect(manager.currentCheckpoint).toBeNull();
    });
  });

  describe('archive', () => {
    test('should archive checkpoint', async () => {
      const checkpoint = await manager.create({ name: 'archive-test' });
      const archived = await manager.archive(checkpoint.id);

      expect(archived.state).toBe(CheckpointState.ARCHIVED);
    });

    test('should throw for non-existent checkpoint', async () => {
      await expect(manager.archive('non-existent')).rejects.toThrow('Checkpoint not found');
    });

    test('should emit archived event', async () => {
      const checkpoint = await manager.create({ name: 'archive-event' });

      const archivePromise = new Promise(resolve => {
        manager.on('archived', resolve);
      });

      await manager.archive(checkpoint.id);
      const event = await archivePromise;

      expect(event.name).toBe('archive-event');
    });
  });

  describe('restore', () => {
    test('should restore checkpoint', async () => {
      // Create initial checkpoint
      const checkpoint = await manager.create({ name: 'restore-test' });

      // Modify a file
      await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'modified content');

      // Restore checkpoint
      const restored = await manager.restore(checkpoint.id);

      expect(restored.state).toBe(CheckpointState.RESTORED);

      // Verify file is restored
      const content = await fs.readFile(path.join(sourceDir, 'file1.txt'), 'utf8');
      expect(content).toBe('content1');
    });

    test('should create backup before restore by default', async () => {
      const checkpoint = await manager.create({ name: 'backup-test' });

      // Get checkpoint count before restore
      const countBefore = manager.list().length;

      await manager.restore(checkpoint.id);

      // Should have one more checkpoint (backup)
      const countAfter = manager.list().length;
      expect(countAfter).toBe(countBefore + 1);
    });

    test('should skip backup when option is false', async () => {
      const checkpoint = await manager.create({ name: 'no-backup' });

      const countBefore = manager.list().length;

      await manager.restore(checkpoint.id, { backup: false });

      const countAfter = manager.list().length;
      expect(countAfter).toBe(countBefore);
    });

    test('should throw for non-existent checkpoint', async () => {
      await expect(manager.restore('non-existent')).rejects.toThrow('Checkpoint not found');
    });

    test('should emit restored event', async () => {
      const checkpoint = await manager.create({ name: 'restore-event' });

      const restorePromise = new Promise(resolve => {
        manager.on('restored', resolve);
      });

      await manager.restore(checkpoint.id, { backup: false });
      const event = await restorePromise;

      expect(event.name).toBe('restore-event');
    });

    test('should set current checkpoint', async () => {
      const cp1 = await manager.create({ name: 'cp1' });
      await manager.create({ name: 'cp2' });

      await manager.restore(cp1.id, { backup: false });
      expect(manager.currentCheckpoint).toBe(cp1.id);
    });
  });

  describe('compare', () => {
    test('should compare two checkpoints', async () => {
      // Create first checkpoint
      const cp1 = await manager.create({ name: 'compare-1' });

      // Modify files
      await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'modified');
      await fs.writeFile(path.join(sourceDir, 'newfile.txt'), 'new content');

      // Create second checkpoint
      const cp2 = await manager.create({ name: 'compare-2' });

      // Compare
      const comparison = await manager.compare(cp1.id, cp2.id);

      expect(comparison.checkpoint1.name).toBe('compare-1');
      expect(comparison.checkpoint2.name).toBe('compare-2');
      expect(comparison.changes.added).toBeGreaterThan(0);
      expect(comparison.changes.modified).toBeGreaterThanOrEqual(0);
      expect(comparison.files).toHaveProperty('added');
      expect(comparison.files).toHaveProperty('removed');
      expect(comparison.files).toHaveProperty('modified');
    });

    test('should throw if checkpoint not found', async () => {
      const cp1 = await manager.create({ name: 'compare-exists' });

      await expect(manager.compare(cp1.id, 'non-existent')).rejects.toThrow(
        'One or both checkpoints not found'
      );
    });
  });

  describe('getCurrent', () => {
    test('should return null when no checkpoint', () => {
      const newManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'no-current'),
        autoCheckpoint: false,
      });

      expect(newManager.getCurrent()).toBeNull();
    });

    test('should return current checkpoint', async () => {
      const checkpoint = await manager.create({ name: 'current-test' });
      const current = manager.getCurrent();

      expect(current).not.toBeNull();
      expect(current.id).toBe(checkpoint.id);
    });
  });

  describe('addTags', () => {
    test('should add tags to checkpoint', async () => {
      const checkpoint = await manager.create({ name: 'tag-test', tags: ['initial'] });
      const updated = await manager.addTags(checkpoint.id, ['new-tag', 'another']);

      expect(updated.tags).toContain('initial');
      expect(updated.tags).toContain('new-tag');
      expect(updated.tags).toContain('another');
    });

    test('should not duplicate tags', async () => {
      const checkpoint = await manager.create({ name: 'dup-test', tags: ['tag1'] });
      const updated = await manager.addTags(checkpoint.id, ['tag1', 'tag2']);

      const tag1Count = updated.tags.filter(t => t === 'tag1').length;
      expect(tag1Count).toBe(1);
    });

    test('should throw for non-existent checkpoint', async () => {
      await expect(manager.addTags('non-existent', ['tag'])).rejects.toThrow(
        'Checkpoint not found'
      );
    });
  });

  describe('auto-checkpoint', () => {
    test('should start auto-checkpoint when enabled', async () => {
      const autoManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'auto-test'),
        autoCheckpoint: true,
        autoCheckpointInterval: 100, // 100ms for testing
      });

      await autoManager.initialize();

      expect(autoManager.autoCheckpointTimer).not.toBeNull();
      autoManager.stopAutoCheckpoint();
    });

    test('should stop auto-checkpoint', async () => {
      const autoManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'stop-auto'),
        autoCheckpoint: true,
        autoCheckpointInterval: 100,
      });

      await autoManager.initialize();
      autoManager.stopAutoCheckpoint();

      expect(autoManager.autoCheckpointTimer).toBeNull();
    });
  });

  describe('cleanup', () => {
    test('should cleanup old checkpoints when max is reached', async () => {
      const limitedManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'cleanup-test'),
        autoCheckpoint: false,
        maxCheckpoints: 3,
      });
      await limitedManager.initialize();

      // Create 5 checkpoints
      for (let i = 1; i <= 5; i++) {
        await limitedManager.create({ name: `cp-${i}` });
      }

      const checkpoints = limitedManager.list();
      expect(checkpoints.length).toBeLessThanOrEqual(3);

      limitedManager.stopAutoCheckpoint();
    });

    test('should not delete archived checkpoints during cleanup', async () => {
      const limitedManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir: path.join(testDir, 'archive-cleanup'),
        autoCheckpoint: false,
        maxCheckpoints: 2,
      });
      await limitedManager.initialize();

      // Create and archive first checkpoint
      const archived = await limitedManager.create({ name: 'archived-cp' });
      await limitedManager.archive(archived.id);

      // Create more checkpoints
      await limitedManager.create({ name: 'cp-2' });
      await limitedManager.create({ name: 'cp-3' });
      await limitedManager.create({ name: 'cp-4' });

      // Archived checkpoint should still exist
      expect(limitedManager.get(archived.id)).not.toBeNull();

      limitedManager.stopAutoCheckpoint();
    });
  });

  describe('persistence', () => {
    test('should load checkpoints from disk on initialize', async () => {
      // Create checkpoint
      const checkpoint = await manager.create({ name: 'persist-test' });

      // Create new manager with same storage
      const newManager = new CheckpointManager({
        workspaceDir: sourceDir,
        storageDir,
        autoCheckpoint: false,
      });
      await newManager.initialize();

      const loaded = newManager.get(checkpoint.id);
      expect(loaded).not.toBeNull();
      expect(loaded.name).toBe('persist-test');

      newManager.stopAutoCheckpoint();
    });
  });
});

describe('CheckpointState', () => {
  test('should have correct state values', () => {
    expect(CheckpointState.CREATED).toBe('created');
    expect(CheckpointState.ACTIVE).toBe('active');
    expect(CheckpointState.RESTORED).toBe('restored');
    expect(CheckpointState.ARCHIVED).toBe('archived');
  });
});

describe('DEFAULT_CONFIG', () => {
  test('should have expected default values', () => {
    expect(DEFAULT_CONFIG.maxCheckpoints).toBe(50);
    expect(DEFAULT_CONFIG.autoCheckpoint).toBe(true);
    expect(DEFAULT_CONFIG.storageDir).toBe('.musubi/checkpoints');
    expect(DEFAULT_CONFIG.excludePatterns).toContain('node_modules/**');
    expect(DEFAULT_CONFIG.excludePatterns).toContain('.git/**');
  });
});
