/**
 * @file steering-auto-update.js
 * @description Automatic steering file update engine
 * @version 1.0.0
 * 
 * Part of MUSUBI v5.0.0 - Phase 5 Advanced Features
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * Update trigger types
 * @enum {string}
 */
const TRIGGER = {
  AGENT_WORK: 'agent-work',
  CODE_CHANGE: 'code-change',
  DEPENDENCY_UPDATE: 'dependency-update',
  CONFIG_CHANGE: 'config-change',
  MANUAL: 'manual',
  SCHEDULED: 'scheduled'
};

/**
 * Steering file types
 * @enum {string}
 */
const STEERING_TYPE = {
  STRUCTURE: 'structure',
  TECH: 'tech',
  PRODUCT: 'product',
  RULES: 'rules',
  CUSTOM: 'custom'
};

/**
 * @typedef {Object} UpdateRule
 * @property {string} id - Rule identifier
 * @property {string} name - Rule name
 * @property {string} trigger - What triggers this update
 * @property {string} target - Target steering file
 * @property {Function} condition - Condition to check
 * @property {Function} update - Update function
 * @property {number} [priority=0] - Rule priority
 */

/**
 * @typedef {Object} UpdateResult
 * @property {string} id - Update identifier
 * @property {boolean} success - Whether update succeeded
 * @property {string} file - Updated file path
 * @property {string} trigger - What triggered the update
 * @property {string[]} changes - List of changes made
 * @property {number} timestamp - Update timestamp
 */

/**
 * @typedef {Object} SteeringAutoUpdateOptions
 * @property {string} [steeringPath='steering'] - Path to steering directory
 * @property {boolean} [autoSave=true] - Auto-save changes
 * @property {boolean} [backup=true] - Create backups before updates
 * @property {Object} [rules={}] - Custom update rules
 */

/**
 * Default update rules
 */
const DEFAULT_RULES = [
  {
    id: 'tech-deps-update',
    name: 'Update tech.md on dependency changes',
    trigger: TRIGGER.DEPENDENCY_UPDATE,
    target: STEERING_TYPE.TECH,
    priority: 10,
    condition: (context) => context.packageJsonChanged,
    update: async (steering, context) => {
      const changes = [];
      
      if (context.newDependencies?.length > 0) {
        changes.push(`Added dependencies: ${context.newDependencies.join(', ')}`);
      }
      if (context.removedDependencies?.length > 0) {
        changes.push(`Removed dependencies: ${context.removedDependencies.join(', ')}`);
      }
      if (context.updatedDependencies?.length > 0) {
        changes.push(`Updated dependencies: ${context.updatedDependencies.join(', ')}`);
      }
      
      return { section: 'dependencies', changes };
    }
  },
  {
    id: 'structure-dirs-update',
    name: 'Update structure.md on new directories',
    trigger: TRIGGER.CODE_CHANGE,
    target: STEERING_TYPE.STRUCTURE,
    priority: 5,
    condition: (context) => context.newDirectories?.length > 0,
    update: async (steering, context) => {
      const changes = context.newDirectories.map(dir => `Added directory: ${dir}`);
      return { section: 'directories', changes };
    }
  },
  {
    id: 'structure-files-update',
    name: 'Update structure.md on significant file changes',
    trigger: TRIGGER.CODE_CHANGE,
    target: STEERING_TYPE.STRUCTURE,
    priority: 4,
    condition: (context) => context.significantFileChanges,
    update: async (steering, context) => {
      const changes = [];
      if (context.newEntryPoints?.length > 0) {
        changes.push(`New entry points: ${context.newEntryPoints.join(', ')}`);
      }
      if (context.newModules?.length > 0) {
        changes.push(`New modules: ${context.newModules.join(', ')}`);
      }
      return { section: 'files', changes };
    }
  },
  {
    id: 'product-features-update',
    name: 'Update product.md on feature completion',
    trigger: TRIGGER.AGENT_WORK,
    target: STEERING_TYPE.PRODUCT,
    priority: 8,
    condition: (context) => context.featureCompleted,
    update: async (steering, context) => {
      const changes = [`Completed feature: ${context.featureName}`];
      if (context.featureDescription) {
        changes.push(`Description: ${context.featureDescription}`);
      }
      return { section: 'features', changes };
    }
  },
  {
    id: 'rules-patterns-update',
    name: 'Update rules when new patterns detected',
    trigger: TRIGGER.AGENT_WORK,
    target: STEERING_TYPE.RULES,
    priority: 3,
    condition: (context) => context.newPatterns?.length > 0,
    update: async (steering, context) => {
      const changes = context.newPatterns.map(p => `New pattern: ${p}`);
      return { section: 'patterns', changes };
    }
  }
];

/**
 * Steering Auto-Update Engine
 * @extends EventEmitter
 */
class SteeringAutoUpdate extends EventEmitter {
  /**
   * Create steering auto-update engine
   * @param {SteeringAutoUpdateOptions} [options={}] - Options
   */
  constructor(options = {}) {
    super();
    
    this.steeringPath = options.steeringPath || 'steering';
    this.autoSave = options.autoSave !== false;
    this.backup = options.backup !== false;
    this.rules = [...DEFAULT_RULES, ...(options.rules || [])];
    
    // Sort rules by priority
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    // State
    this.updates = new Map();
    this.updateCounter = 0;
    this.steering = new Map();
    this.pendingChanges = new Map();
  }
  
  /**
   * Load steering files
   * @param {string} [basePath='.'] - Base path
   * @returns {Promise<Map>} Loaded steering files
   */
  async loadSteering(basePath = '.') {
    const steeringDir = path.join(basePath, this.steeringPath);
    
    const files = {
      [STEERING_TYPE.STRUCTURE]: 'structure.md',
      [STEERING_TYPE.TECH]: 'tech.md',
      [STEERING_TYPE.PRODUCT]: 'product.md',
      [STEERING_TYPE.RULES]: 'rules/constitution.md'
    };
    
    for (const [type, file] of Object.entries(files)) {
      const filePath = path.join(steeringDir, file);
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          this.steering.set(type, {
            path: filePath,
            content,
            parsed: this.parseMarkdown(content),
            lastModified: fs.statSync(filePath).mtime
          });
        }
      } catch (error) {
        this.emit('error', { type, file, error });
      }
    }
    
    // Load custom steering files
    const customDir = path.join(steeringDir, 'custom');
    if (fs.existsSync(customDir)) {
      const customFiles = fs.readdirSync(customDir).filter(f => f.endsWith('.md'));
      for (const file of customFiles) {
        const filePath = path.join(customDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        this.steering.set(`custom:${file}`, {
          path: filePath,
          content,
          parsed: this.parseMarkdown(content),
          lastModified: fs.statSync(filePath).mtime
        });
      }
    }
    
    this.emit('steering:loaded', { count: this.steering.size });
    return this.steering;
  }
  
  /**
   * Parse markdown into sections
   * @private
   */
  parseMarkdown(content) {
    const sections = new Map();
    const lines = content.split('\n');
    let currentSection = 'header';
    let currentContent = [];
    
    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        // Save previous section
        if (currentContent.length > 0) {
          sections.set(currentSection, currentContent.join('\n'));
        }
        currentSection = headerMatch[2].toLowerCase().replace(/\s+/g, '-');
        currentContent = [line];
      } else {
        currentContent.push(line);
      }
    }
    
    // Save last section
    if (currentContent.length > 0) {
      sections.set(currentSection, currentContent.join('\n'));
    }
    
    return sections;
  }
  
  /**
   * Process an update trigger
   * @param {string} trigger - Trigger type
   * @param {Object} context - Trigger context
   * @returns {Promise<UpdateResult[]>} Update results
   */
  async processTrigger(trigger, context = {}) {
    const id = this.generateId();
    this.emit('trigger:received', { id, trigger, context });
    
    const results = [];
    
    // Find applicable rules
    const applicableRules = this.rules.filter(rule => {
      if (rule.trigger !== trigger) return false;
      try {
        return rule.condition(context);
      } catch (error) {
        this.emit('rule:error', { rule: rule.id, error });
        return false;
      }
    });
    
    // Apply each rule
    for (const rule of applicableRules) {
      try {
        this.emit('rule:applying', { rule: rule.id, target: rule.target });
        
        const steering = this.steering.get(rule.target);
        if (!steering) {
          this.emit('rule:skipped', { rule: rule.id, reason: 'target not found' });
          continue;
        }
        
        const updateResult = await rule.update(steering, context);
        
        if (updateResult && updateResult.changes?.length > 0) {
          // Queue changes
          if (!this.pendingChanges.has(rule.target)) {
            this.pendingChanges.set(rule.target, []);
          }
          this.pendingChanges.get(rule.target).push({
            rule: rule.id,
            section: updateResult.section,
            changes: updateResult.changes,
            timestamp: Date.now()
          });
          
          const result = {
            id: `update-${++this.updateCounter}`,
            success: true,
            file: steering.path,
            trigger,
            rule: rule.id,
            changes: updateResult.changes,
            timestamp: Date.now()
          };
          
          results.push(result);
          this.updates.set(result.id, result);
          
          this.emit('rule:applied', { rule: rule.id, changes: updateResult.changes });
        }
      } catch (error) {
        const result = {
          id: `update-${++this.updateCounter}`,
          success: false,
          file: rule.target,
          trigger,
          rule: rule.id,
          error: error.message,
          timestamp: Date.now()
        };
        
        results.push(result);
        this.emit('rule:failed', { rule: rule.id, error });
      }
    }
    
    // Auto-save if enabled
    if (this.autoSave && results.some(r => r.success)) {
      await this.applyPendingChanges();
    }
    
    this.emit('trigger:processed', { id, results });
    return results;
  }
  
  /**
   * Apply pending changes to files
   * @returns {Promise<Object>} Apply result
   */
  async applyPendingChanges() {
    const applied = [];
    
    for (const [target, changes] of this.pendingChanges.entries()) {
      const steering = this.steering.get(target);
      if (!steering) continue;
      
      try {
        // Create backup
        if (this.backup) {
          const backupPath = `${steering.path}.backup`;
          fs.writeFileSync(backupPath, steering.content);
        }
        
        // Generate changelog section
        const changelog = this.generateChangelog(changes);
        
        // Update content
        let newContent = steering.content;
        
        // Add or update changelog section
        if (newContent.includes('## Changelog')) {
          newContent = newContent.replace(
            /## Changelog\n/,
            `## Changelog\n\n${changelog}\n`
          );
        } else {
          newContent += `\n\n## Changelog\n\n${changelog}`;
        }
        
        // Write file
        fs.writeFileSync(steering.path, newContent);
        
        // Update in-memory state
        steering.content = newContent;
        steering.parsed = this.parseMarkdown(newContent);
        steering.lastModified = new Date();
        
        applied.push({ target, changesCount: changes.length });
        
        this.emit('changes:applied', { target, changes });
      } catch (error) {
        this.emit('changes:failed', { target, error });
      }
    }
    
    this.pendingChanges.clear();
    return { applied };
  }
  
  /**
   * Generate changelog entry
   * @private
   */
  generateChangelog(changes) {
    const date = new Date().toISOString().split('T')[0];
    const entries = [];
    
    for (const change of changes) {
      for (const item of change.changes) {
        entries.push(`- ${item}`);
      }
    }
    
    return `### ${date}\n${entries.join('\n')}`;
  }
  
  /**
   * Add custom rule
   * @param {UpdateRule} rule - Rule to add
   */
  addRule(rule) {
    if (!rule.id || !rule.trigger || !rule.target) {
      throw new Error('Rule must have id, trigger, and target');
    }
    
    this.rules.push(rule);
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    this.emit('rule:added', { ruleId: rule.id });
  }
  
  /**
   * Remove rule
   * @param {string} ruleId - Rule ID to remove
   */
  removeRule(ruleId) {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      this.emit('rule:removed', { ruleId });
    }
  }
  
  /**
   * Get update history
   * @param {Object} [filter={}] - Filter options
   * @returns {UpdateResult[]}
   */
  getHistory(filter = {}) {
    let results = Array.from(this.updates.values());
    
    if (filter.trigger) {
      results = results.filter(r => r.trigger === filter.trigger);
    }
    if (filter.file) {
      results = results.filter(r => r.file === filter.file);
    }
    if (filter.success !== undefined) {
      results = results.filter(r => r.success === filter.success);
    }
    
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  /**
   * Get statistics
   * @returns {Object}
   */
  getStats() {
    const updates = Array.from(this.updates.values());
    
    return {
      totalUpdates: updates.length,
      successful: updates.filter(u => u.success).length,
      failed: updates.filter(u => !u.success).length,
      byTrigger: updates.reduce((acc, u) => {
        acc[u.trigger] = (acc[u.trigger] || 0) + 1;
        return acc;
      }, {}),
      rulesCount: this.rules.length,
      steeringFilesLoaded: this.steering.size,
      pendingChanges: this.pendingChanges.size
    };
  }
  
  /**
   * Generate unique ID
   * @private
   */
  generateId() {
    return `trigger-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 6)}`;
  }
  
  /**
   * Clear history
   */
  clearHistory() {
    this.updates.clear();
  }
  
  /**
   * Validate steering consistency
   * @returns {Object} Validation result
   */
  validateConsistency() {
    const issues = [];
    
    // Check cross-file references
    const structure = this.steering.get(STEERING_TYPE.STRUCTURE);
    const tech = this.steering.get(STEERING_TYPE.TECH);
    
    if (structure && tech) {
      // Check if tech references match structure
      const structureDirs = this.extractDirectories(structure.content);
      const techDirs = this.extractDirectories(tech.content);
      
      for (const dir of techDirs) {
        if (!structureDirs.includes(dir)) {
          issues.push({
            type: 'mismatch',
            file: STEERING_TYPE.TECH,
            message: `Directory "${dir}" referenced in tech.md but not in structure.md`
          });
        }
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
  
  /**
   * Extract directories from content
   * @private
   */
  extractDirectories(content) {
    const dirs = [];
    const regex = /`([^`]+\/)`/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      dirs.push(match[1]);
    }
    return dirs;
  }
}

/**
 * Create steering auto-update instance
 * @param {SteeringAutoUpdateOptions} [options={}] - Options
 * @returns {SteeringAutoUpdate}
 */
function createSteeringAutoUpdate(options = {}) {
  return new SteeringAutoUpdate(options);
}

module.exports = {
  SteeringAutoUpdate,
  createSteeringAutoUpdate,
  TRIGGER,
  STEERING_TYPE,
  DEFAULT_RULES
};
