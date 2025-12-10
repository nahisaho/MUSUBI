/**
 * Delta Specification Manager
 * Handles ADDED/MODIFIED/REMOVED/RENAMED delta specifications for brownfield projects
 *
 * @module managers/delta-spec
 */

const fs = require('fs');
const path = require('path');

/**
 * Delta operation types
 */
const DeltaType = {
  ADDED: 'ADDED',
  MODIFIED: 'MODIFIED',
  REMOVED: 'REMOVED',
  RENAMED: 'RENAMED',
};

/**
 * Delta specification structure
 * @typedef {Object} DeltaSpec
 * @property {string} id - Unique delta ID (e.g., DELTA-AUTH-001)
 * @property {string} type - Delta type (ADDED, MODIFIED, REMOVED, RENAMED)
 * @property {string} target - Target requirement/component ID
 * @property {string} description - Change description
 * @property {string} rationale - Reason for change
 * @property {string[]} impactedAreas - Areas affected by change
 * @property {Object} before - Previous state (for MODIFIED/RENAMED)
 * @property {Object} after - New state (for ADDED/MODIFIED/RENAMED)
 * @property {string} status - Status (proposed, approved, implemented, archived)
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

class DeltaSpecManager {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.changesDir = path.join(projectRoot, 'storage', 'changes');
    this.specsDir = path.join(projectRoot, 'storage', 'specs');
    this.archiveDir = path.join(projectRoot, 'storage', 'archive');
  }

  /**
   * Initialize delta spec directories
   */
  init() {
    const dirs = [this.changesDir, this.specsDir, this.archiveDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Create a new delta specification
   * @param {Object} options - Delta spec options
   * @returns {DeltaSpec} Created delta spec
   */
  create(options) {
    const {
      id,
      type,
      target,
      description,
      rationale,
      impactedAreas = [],
      before = null,
      after = null,
    } = options;

    // Validate required fields
    if (!id) throw new Error('Delta ID is required');
    if (!type || !Object.values(DeltaType).includes(type)) {
      throw new Error(`Invalid delta type. Must be one of: ${Object.values(DeltaType).join(', ')}`);
    }
    if (!target) throw new Error('Target is required');
    if (!description) throw new Error('Description is required');

    // Validate type-specific requirements
    if (type === DeltaType.MODIFIED && !before) {
      throw new Error('MODIFIED delta requires "before" state');
    }
    if (type === DeltaType.RENAMED && (!before || !after)) {
      throw new Error('RENAMED delta requires both "before" and "after" states');
    }

    const now = new Date().toISOString();
    const deltaSpec = {
      id,
      type,
      target,
      description,
      rationale: rationale || '',
      impactedAreas,
      before,
      after,
      status: 'proposed',
      createdAt: now,
      updatedAt: now,
    };

    // Save delta spec
    this.save(deltaSpec);

    return deltaSpec;
  }

  /**
   * Save delta spec to file
   * @param {DeltaSpec} deltaSpec - Delta spec to save
   */
  save(deltaSpec) {
    this.init();

    const changeDir = path.join(this.changesDir, deltaSpec.id);
    if (!fs.existsSync(changeDir)) {
      fs.mkdirSync(changeDir, { recursive: true });
    }

    const content = this.formatDeltaSpec(deltaSpec);
    const filePath = path.join(changeDir, 'delta.md');
    fs.writeFileSync(filePath, content, 'utf-8');

    // Also save as JSON for programmatic access
    const jsonPath = path.join(changeDir, 'delta.json');
    fs.writeFileSync(jsonPath, JSON.stringify(deltaSpec, null, 2), 'utf-8');
  }

  /**
   * Format delta spec as markdown
   * @param {DeltaSpec} deltaSpec - Delta spec to format
   * @returns {string} Markdown content
   */
  formatDeltaSpec(deltaSpec) {
    const lines = [
      `# Delta Specification: ${deltaSpec.id}`,
      '',
      `**Type**: ${deltaSpec.type}`,
      `**Target**: ${deltaSpec.target}`,
      `**Status**: ${deltaSpec.status}`,
      `**Created**: ${deltaSpec.createdAt}`,
      `**Updated**: ${deltaSpec.updatedAt}`,
      '',
      '## Description',
      '',
      deltaSpec.description,
      '',
    ];

    if (deltaSpec.rationale) {
      lines.push('## Rationale', '', deltaSpec.rationale, '');
    }

    if (deltaSpec.impactedAreas.length > 0) {
      lines.push('## Impacted Areas', '');
      deltaSpec.impactedAreas.forEach(area => {
        lines.push(`- ${area}`);
      });
      lines.push('');
    }

    if (deltaSpec.before) {
      lines.push('## Before State', '', '```');
      if (typeof deltaSpec.before === 'object') {
        lines.push(JSON.stringify(deltaSpec.before, null, 2));
      } else {
        lines.push(String(deltaSpec.before));
      }
      lines.push('```', '');
    }

    if (deltaSpec.after) {
      lines.push('## After State', '', '```');
      if (typeof deltaSpec.after === 'object') {
        lines.push(JSON.stringify(deltaSpec.after, null, 2));
      } else {
        lines.push(String(deltaSpec.after));
      }
      lines.push('```', '');
    }

    return lines.join('\n');
  }

  /**
   * Load delta spec from file
   * @param {string} id - Delta ID
   * @returns {DeltaSpec|null} Loaded delta spec or null
   */
  load(id) {
    const jsonPath = path.join(this.changesDir, id, 'delta.json');
    if (!fs.existsSync(jsonPath)) {
      return null;
    }
    const content = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * List all delta specs
   * @param {Object} options - Filter options
   * @returns {DeltaSpec[]} List of delta specs
   */
  list(options = {}) {
    const { status, type } = options;

    if (!fs.existsSync(this.changesDir)) {
      return [];
    }

    const entries = fs.readdirSync(this.changesDir, { withFileTypes: true });
    const deltas = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const delta = this.load(entry.name);
        if (delta) {
          // Apply filters
          if (status && delta.status !== status) continue;
          if (type && delta.type !== type) continue;
          deltas.push(delta);
        }
      }
    }

    return deltas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Update delta spec status
   * @param {string} id - Delta ID
   * @param {string} status - New status
   * @returns {DeltaSpec} Updated delta spec
   */
  updateStatus(id, status) {
    const validStatuses = ['proposed', 'approved', 'rejected', 'implemented', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const delta = this.load(id);
    if (!delta) {
      throw new Error(`Delta not found: ${id}`);
    }

    delta.status = status;
    delta.updatedAt = new Date().toISOString();
    this.save(delta);

    return delta;
  }

  /**
   * Archive a completed delta spec
   * Merges delta into specs and moves to archive
   * @param {string} id - Delta ID
   * @returns {Object} Archive result
   */
  archive(id) {
    const delta = this.load(id);
    if (!delta) {
      throw new Error(`Delta not found: ${id}`);
    }

    if (delta.status !== 'implemented') {
      throw new Error('Only implemented deltas can be archived');
    }

    // Create archive entry
    this.init();
    const archiveFile = path.join(this.archiveDir, `${id}.json`);
    delta.status = 'archived';
    delta.archivedAt = new Date().toISOString();
    fs.writeFileSync(archiveFile, JSON.stringify(delta, null, 2), 'utf-8');

    // Remove from active changes
    const changeDir = path.join(this.changesDir, id);
    if (fs.existsSync(changeDir)) {
      fs.rmSync(changeDir, { recursive: true });
    }

    return {
      archived: true,
      id,
      archivePath: archiveFile,
    };
  }

  /**
   * Parse delta markers from markdown content
   * @param {string} content - Markdown content
   * @returns {Object[]} Parsed delta markers
   */
  parseDeltas(content) {
    const deltaPattern = /\[([A-Z]+)\]\s*([A-Z]+-[A-Z0-9-]+):\s*(.+)/g;
    const deltas = [];
    let match;

    while ((match = deltaPattern.exec(content)) !== null) {
      const [, type, id, description] = match;
      if (Object.values(DeltaType).includes(type)) {
        deltas.push({
          type,
          id,
          description: description.trim(),
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }

    return deltas;
  }

  /**
   * Validate delta spec format
   * @param {DeltaSpec} deltaSpec - Delta spec to validate
   * @returns {Object} Validation result
   */
  validate(deltaSpec) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!deltaSpec.id) errors.push('Missing delta ID');
    if (!deltaSpec.type) errors.push('Missing delta type');
    if (!deltaSpec.target) errors.push('Missing target');
    if (!deltaSpec.description) errors.push('Missing description');

    // ID format
    if (deltaSpec.id && !/^[A-Z]+-[A-Z0-9-]+$/.test(deltaSpec.id)) {
      errors.push('Invalid ID format. Expected: PREFIX-IDENTIFIER (e.g., DELTA-AUTH-001)');
    }

    // Type validation
    if (deltaSpec.type && !Object.values(DeltaType).includes(deltaSpec.type)) {
      errors.push(`Invalid type: ${deltaSpec.type}`);
    }

    // Type-specific validation
    if (deltaSpec.type === DeltaType.MODIFIED) {
      if (!deltaSpec.before) warnings.push('MODIFIED delta should have "before" state');
      if (!deltaSpec.after) warnings.push('MODIFIED delta should have "after" state');
    }

    if (deltaSpec.type === DeltaType.RENAMED) {
      if (!deltaSpec.before) errors.push('RENAMED delta requires "before" state');
      if (!deltaSpec.after) errors.push('RENAMED delta requires "after" state');
    }

    // Rationale recommended
    if (!deltaSpec.rationale) {
      warnings.push('Rationale is recommended for traceability');
    }

    // Impacted areas recommended
    if (!deltaSpec.impactedAreas || deltaSpec.impactedAreas.length === 0) {
      warnings.push('Impacted areas should be specified');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate impact report for a delta
   * @param {string} id - Delta ID
   * @returns {Object} Impact report
   */
  generateImpactReport(id) {
    const delta = this.load(id);
    if (!delta) {
      throw new Error(`Delta not found: ${id}`);
    }

    return {
      id: delta.id,
      type: delta.type,
      target: delta.target,
      description: delta.description,
      impactedAreas: delta.impactedAreas,
      status: delta.status,
      affectedFiles: this.findAffectedFiles(delta),
      recommendations: this.generateRecommendations(delta),
    };
  }

  /**
   * Find files affected by a delta
   * @param {DeltaSpec} delta - Delta spec
   * @returns {string[]} List of affected files
   */
  findAffectedFiles(delta) {
    // This would scan the codebase for references to the target
    // Simplified implementation for now
    const affected = [];
    const targetPattern = new RegExp(delta.target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    const scanDir = dir => {
      if (!fs.existsSync(dir)) return;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip node_modules and hidden directories
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(js|ts|md|json)$/.test(entry.name)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (targetPattern.test(content)) {
              affected.push(path.relative(this.projectRoot, fullPath));
            }
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    };

    scanDir(path.join(this.projectRoot, 'src'));
    scanDir(path.join(this.projectRoot, 'storage'));

    return affected;
  }

  /**
   * Generate recommendations for a delta
   * @param {DeltaSpec} delta - Delta spec
   * @returns {string[]} Recommendations
   */
  generateRecommendations(delta) {
    const recommendations = [];

    switch (delta.type) {
      case DeltaType.ADDED:
        recommendations.push('Create new requirement document');
        recommendations.push('Update traceability matrix');
        recommendations.push('Add test cases for new functionality');
        break;

      case DeltaType.MODIFIED:
        recommendations.push('Review existing tests for compatibility');
        recommendations.push('Update design documents if architecture affected');
        recommendations.push('Check for breaking changes in APIs');
        break;

      case DeltaType.REMOVED:
        recommendations.push('Remove obsolete test cases');
        recommendations.push('Update documentation to reflect removal');
        recommendations.push('Check for orphaned code dependencies');
        break;

      case DeltaType.RENAMED:
        recommendations.push('Update all references to renamed entity');
        recommendations.push('Update import statements');
        recommendations.push('Update documentation and comments');
        break;
    }

    if (delta.impactedAreas.includes('api')) {
      recommendations.push('Consider API versioning for backward compatibility');
    }

    if (delta.impactedAreas.includes('database')) {
      recommendations.push('Create database migration script');
    }

    return recommendations;
  }
}

module.exports = {
  DeltaSpecManager,
  DeltaType,
};
