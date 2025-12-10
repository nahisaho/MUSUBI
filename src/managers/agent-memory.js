/**
 * Agent Memory Manager
 *
 * Inspired by OpenHands skills/agent_memory.md
 * Extracts and persists learnings from agent sessions
 *
 * REQ-P0-B008: Agent Memory & Learning
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Learning item categories
 */
const LearningCategory = {
  STRUCTURE: 'structure', // Project structure knowledge
  COMMANDS: 'commands', // Useful commands
  PRACTICES: 'practices', // Best practices
  ERRORS: 'errors', // Error solutions
  PATTERNS: 'patterns', // Code patterns
  DEPENDENCIES: 'dependencies', // Dependency information
};

/**
 * Extraction patterns for different categories
 */
const EXTRACTION_PATTERNS = {
  commands: [
    {
      pattern: /(?:run|execute|use)\s+`([^`]+)`/gi,
      extract: match => match[1],
      confidence: 0.8,
    },
    {
      pattern: /npm\s+(?:run\s+)?([a-z][a-z0-9:-]*)/gi,
      extract: match => `npm run ${match[1]}`,
      confidence: 0.9,
    },
    {
      pattern: /(?:command|cmd):\s*`([^`]+)`/gi,
      extract: match => match[1],
      confidence: 0.85,
    },
  ],
  practices: [
    {
      pattern: /(?:always|should|must|convention|rule):\s*([^.]+\.)/gi,
      extract: match => match[1].trim(),
      confidence: 0.7,
    },
    {
      pattern: /(?:best practice|recommended):\s*([^.]+\.)/gi,
      extract: match => match[1].trim(),
      confidence: 0.8,
    },
    {
      pattern: /use\s+(\w+)\s+(?:format|style|convention)/gi,
      extract: match => `Use ${match[1]} format/style`,
      confidence: 0.75,
    },
  ],
  errors: [
    {
      pattern: /(?:error|issue|problem):\s*([^.]+)\.\s*(?:fix|solution|resolve):\s*([^.]+\.)/gi,
      extract: match => ({ error: match[1], solution: match[2] }),
      confidence: 0.85,
    },
    {
      pattern: /(?:fixed|resolved|solved)\s+(?:by|with)\s+([^.]+\.)/gi,
      extract: match => match[1].trim(),
      confidence: 0.8,
    },
  ],
  structure: [
    {
      pattern: /(?:located|found)\s+(?:in|at)\s+`([^`]+)`/gi,
      extract: match => match[1],
      confidence: 0.75,
    },
    {
      pattern: /(?:directory|folder|file)\s+`([^`]+)`\s+(?:contains|has)/gi,
      extract: match => match[1],
      confidence: 0.8,
    },
  ],
};

/**
 * Represents a learning item extracted from a session
 */
class LearningItem {
  /**
   * @param {Object} params
   * @param {string} params.category - Learning category
   * @param {string} params.title - Short title
   * @param {string} params.content - Detailed content
   * @param {number} params.confidence - Confidence score (0-1)
   * @param {string} params.source - Source session/event
   * @param {Object} [params.metadata] - Additional metadata
   */
  constructor({ category, title, content, confidence, source, metadata = {} }) {
    this.id = `learn-${crypto.randomBytes(4).toString('hex')}`;
    this.category = category;
    this.title = title;
    this.content = content;
    this.confidence = Math.min(1, Math.max(0, confidence));
    this.source = source;
    this.metadata = metadata;
    this.timestamp = new Date();
    this.confirmed = false;
  }

  /**
   * Mark as confirmed by user
   */
  confirm() {
    this.confirmed = true;
    this.confidence = Math.min(1, this.confidence + 0.1);
    return this;
  }

  /**
   * Check if this learning is similar to another
   * @param {LearningItem} other
   * @returns {boolean}
   */
  isSimilarTo(other) {
    if (this.category !== other.category) return false;

    // Compare content similarity (simple approach)
    const thisWords = new Set(this.content.toLowerCase().split(/\s+/));
    const otherWords = new Set(other.content.toLowerCase().split(/\s+/));

    let intersection = 0;
    for (const word of thisWords) {
      if (otherWords.has(word)) intersection++;
    }

    const similarity = (2 * intersection) / (thisWords.size + otherWords.size);
    return similarity > 0.7;
  }

  toJSON() {
    return {
      id: this.id,
      category: this.category,
      title: this.title,
      content: this.content,
      confidence: this.confidence,
      source: this.source,
      metadata: this.metadata,
      timestamp: this.timestamp.toISOString(),
      confirmed: this.confirmed,
    };
  }

  /**
   * Create from JSON
   * @param {Object} json
   */
  static fromJSON(json) {
    const item = new LearningItem({
      category: json.category,
      title: json.title,
      content: json.content,
      confidence: json.confidence,
      source: json.source,
      metadata: json.metadata || {},
    });
    item.id = json.id;
    item.timestamp = new Date(json.timestamp);
    item.confirmed = json.confirmed || false;
    return item;
  }
}

/**
 * Memory storage format
 */
class MemoryStore {
  constructor() {
    this.learnings = [];
    this.sessions = [];
    this.lastUpdated = new Date();
  }

  /**
   * Add a learning item
   * @param {LearningItem} item
   */
  addLearning(item) {
    // Check for duplicates
    const existing = this.learnings.find(l => l.isSimilarTo(item));
    if (existing) {
      // Boost confidence of existing
      existing.confidence = Math.min(1, existing.confidence + 0.05);
      return existing;
    }

    this.learnings.push(item);
    this.lastUpdated = new Date();
    return item;
  }

  /**
   * Get learnings by category
   * @param {string} category
   */
  getByCategory(category) {
    return this.learnings.filter(l => l.category === category);
  }

  /**
   * Get high-confidence learnings
   * @param {number} threshold
   */
  getHighConfidence(threshold = 0.8) {
    return this.learnings.filter(l => l.confidence >= threshold);
  }

  /**
   * Record a session
   * @param {string} sessionId
   */
  recordSession(sessionId) {
    this.sessions.push({
      id: sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  toJSON() {
    return {
      learnings: this.learnings.map(l => l.toJSON()),
      sessions: this.sessions,
      lastUpdated: this.lastUpdated.toISOString(),
    };
  }

  /**
   * Create from JSON
   * @param {Object} json
   */
  static fromJSON(json) {
    const store = new MemoryStore();
    store.learnings = (json.learnings || []).map(l => LearningItem.fromJSON(l));
    store.sessions = json.sessions || [];
    store.lastUpdated = new Date(json.lastUpdated);
    return store;
  }
}

/**
 * Agent Memory Manager
 * Manages learning extraction and persistence
 */
class AgentMemoryManager {
  /**
   * @param {Object} options
   * @param {string} [options.memoriesDir='steering/memories'] - Directory to store memories
   * @param {boolean} [options.autoSave=false] - Auto-save without confirmation
   * @param {number} [options.minConfidence=0.6] - Minimum confidence to save
   * @param {string} [options.workspaceRoot='.'] - Workspace root directory
   */
  constructor(options = {}) {
    this.memoriesDir = options.memoriesDir || 'steering/memories';
    this.autoSave = options.autoSave || false;
    this.minConfidence = options.minConfidence || 0.6;
    this.workspaceRoot = options.workspaceRoot || '.';
    this.store = null;
  }

  /**
   * Get full path to memories directory
   */
  getMemoriesPath() {
    return path.join(this.workspaceRoot, this.memoriesDir);
  }

  /**
   * Get path to memory file
   */
  getMemoryFilePath() {
    return path.join(this.getMemoriesPath(), 'agent-memory.json');
  }

  /**
   * Initialize or load memory store
   */
  async initialize() {
    const filePath = this.getMemoryFilePath();

    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        this.store = MemoryStore.fromJSON(JSON.parse(content));
      } else {
        this.store = new MemoryStore();
      }
    } catch (error) {
      console.warn('Failed to load memory store, creating new:', error.message);
      this.store = new MemoryStore();
    }

    return this.store;
  }

  /**
   * Ensure store is initialized
   */
  async ensureInitialized() {
    if (!this.store) {
      await this.initialize();
    }
    return this.store;
  }

  /**
   * Extract learnings from session events
   * @param {Object[]} sessionEvents - Array of session events
   * @param {string} [sessionId] - Session identifier
   * @returns {LearningItem[]}
   */
  extractLearnings(sessionEvents, sessionId = null) {
    const source = sessionId || `session-${Date.now()}`;
    const learnings = [];

    for (const event of sessionEvents) {
      const content = this.getEventContent(event);
      if (!content) continue;

      // Extract from each category
      learnings.push(...this.extractStructureKnowledge(content, source));
      learnings.push(...this.extractCommandPatterns(content, source));
      learnings.push(...this.extractBestPractices(content, source));
      learnings.push(...this.extractErrorSolutions(content, source));
    }

    // Filter by minimum confidence
    return learnings.filter(l => l.confidence >= this.minConfidence);
  }

  /**
   * Get content from an event
   * @param {Object} event
   */
  getEventContent(event) {
    if (typeof event === 'string') return event;
    return event.content || event.message || event.text || event.data || null;
  }

  /**
   * Extract structure knowledge
   * @param {string} content
   * @param {string} source
   */
  extractStructureKnowledge(content, source) {
    const learnings = [];

    for (const pattern of EXTRACTION_PATTERNS.structure) {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match;

      while ((match = regex.exec(content)) !== null) {
        const extracted = pattern.extract(match);
        if (extracted) {
          learnings.push(
            new LearningItem({
              category: LearningCategory.STRUCTURE,
              title: `Structure: ${this.truncate(extracted, 30)}`,
              content: extracted,
              confidence: pattern.confidence,
              source,
            })
          );
        }
      }
    }

    return learnings;
  }

  /**
   * Extract command patterns
   * @param {string} content
   * @param {string} source
   */
  extractCommandPatterns(content, source) {
    const learnings = [];

    for (const pattern of EXTRACTION_PATTERNS.commands) {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match;

      while ((match = regex.exec(content)) !== null) {
        const extracted = pattern.extract(match);
        if (extracted && extracted.length > 2) {
          learnings.push(
            new LearningItem({
              category: LearningCategory.COMMANDS,
              title: `Command: ${this.truncate(extracted, 30)}`,
              content: extracted,
              confidence: pattern.confidence,
              source,
            })
          );
        }
      }
    }

    return learnings;
  }

  /**
   * Extract best practices
   * @param {string} content
   * @param {string} source
   */
  extractBestPractices(content, source) {
    const learnings = [];

    for (const pattern of EXTRACTION_PATTERNS.practices) {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match;

      while ((match = regex.exec(content)) !== null) {
        const extracted = pattern.extract(match);
        if (extracted && extracted.length > 5) {
          learnings.push(
            new LearningItem({
              category: LearningCategory.PRACTICES,
              title: `Practice: ${this.truncate(extracted, 30)}`,
              content: extracted,
              confidence: pattern.confidence,
              source,
            })
          );
        }
      }
    }

    return learnings;
  }

  /**
   * Extract error solutions
   * @param {string} content
   * @param {string} source
   */
  extractErrorSolutions(content, source) {
    const learnings = [];

    for (const pattern of EXTRACTION_PATTERNS.errors) {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match;

      while ((match = regex.exec(content)) !== null) {
        const extracted = pattern.extract(match);
        if (extracted) {
          const isComplex = typeof extracted === 'object';
          const content_ = isComplex
            ? `Error: ${extracted.error}\nSolution: ${extracted.solution}`
            : extracted;

          learnings.push(
            new LearningItem({
              category: LearningCategory.ERRORS,
              title: `Solution: ${this.truncate(isComplex ? extracted.error : extracted, 30)}`,
              content: content_,
              confidence: pattern.confidence,
              source,
              metadata: isComplex ? { error: extracted.error, solution: extracted.solution } : {},
            })
          );
        }
      }
    }

    return learnings;
  }

  /**
   * Save learnings to memory store
   * @param {LearningItem[]} items
   * @param {boolean} [confirmed=false] - User confirmed
   * @returns {Object}
   */
  async saveLearnings(items, confirmed = false) {
    await this.ensureInitialized();

    if (!confirmed && !this.autoSave) {
      return {
        status: 'pending',
        message: 'Learnings require confirmation before saving',
        items: items.map(i => i.toJSON()),
      };
    }

    const saved = [];
    for (const item of items) {
      if (confirmed) item.confirm();
      const result = this.store.addLearning(item);
      saved.push(result);
    }

    // Persist to file
    await this.persist();

    return {
      status: 'saved',
      message: `Saved ${saved.length} learnings`,
      items: saved.map(i => i.toJSON()),
    };
  }

  /**
   * Persist memory store to file
   */
  async persist() {
    const dirPath = this.getMemoriesPath();
    const filePath = this.getMemoryFilePath();

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(this.store.toJSON(), null, 2), 'utf8');
  }

  /**
   * Load all memories
   */
  async loadMemories() {
    await this.ensureInitialized();
    return this.store;
  }

  /**
   * Get learnings for a specific category
   * @param {string} category
   */
  async getLearningsByCategory(category) {
    await this.ensureInitialized();
    return this.store.getByCategory(category);
  }

  /**
   * Get high-confidence learnings
   * @param {number} [threshold=0.8]
   */
  async getHighConfidenceLearnings(threshold = 0.8) {
    await this.ensureInitialized();
    return this.store.getHighConfidence(threshold);
  }

  /**
   * Search learnings
   * @param {string} query
   */
  async searchLearnings(query) {
    await this.ensureInitialized();
    const queryLower = query.toLowerCase();

    return this.store.learnings.filter(
      l =>
        l.title.toLowerCase().includes(queryLower) || l.content.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Delete a learning
   * @param {string} id
   */
  async deleteLearning(id) {
    await this.ensureInitialized();
    const index = this.store.learnings.findIndex(l => l.id === id);

    if (index === -1) {
      return { success: false, message: `Learning ${id} not found` };
    }

    this.store.learnings.splice(index, 1);
    await this.persist();

    return { success: true, message: `Deleted learning ${id}` };
  }

  /**
   * Export memories to markdown format
   */
  async exportToMarkdown() {
    await this.ensureInitialized();

    const lines = [
      '# Agent Memory',
      '',
      `Last Updated: ${this.store.lastUpdated.toISOString()}`,
      '',
    ];

    // Group by category
    for (const category of Object.values(LearningCategory)) {
      const items = this.store.getByCategory(category);
      if (items.length === 0) continue;

      lines.push(`## ${this.formatCategory(category)}`, '');

      for (const item of items) {
        lines.push(`### ${item.title}`);
        lines.push('');
        lines.push(item.content);
        lines.push('');
        lines.push(`- Confidence: ${(item.confidence * 100).toFixed(0)}%`);
        lines.push(`- Source: ${item.source}`);
        if (item.confirmed) lines.push('- Status: ✓ Confirmed');
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Format category name for display
   * @param {string} category
   */
  formatCategory(category) {
    const names = {
      [LearningCategory.STRUCTURE]: 'Project Structure',
      [LearningCategory.COMMANDS]: 'Useful Commands',
      [LearningCategory.PRACTICES]: 'Best Practices',
      [LearningCategory.ERRORS]: 'Error Solutions',
      [LearningCategory.PATTERNS]: 'Code Patterns',
      [LearningCategory.DEPENDENCIES]: 'Dependencies',
    };
    return names[category] || category;
  }

  /**
   * Truncate string
   * @param {string} str
   * @param {number} maxLen
   */
  truncate(str, maxLen) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 3) + '...';
  }

  /**
   * Get statistics
   */
  async getStats() {
    await this.ensureInitialized();

    const stats = {
      totalLearnings: this.store.learnings.length,
      byCategory: {},
      confirmedCount: 0,
      averageConfidence: 0,
      sessionCount: this.store.sessions.length,
    };

    for (const category of Object.values(LearningCategory)) {
      stats.byCategory[category] = this.store.getByCategory(category).length;
    }

    if (this.store.learnings.length > 0) {
      stats.confirmedCount = this.store.learnings.filter(l => l.confirmed).length;
      stats.averageConfidence =
        this.store.learnings.reduce((sum, l) => sum + l.confidence, 0) /
        this.store.learnings.length;
    }

    return stats;
  }

  /**
   * Clear all memories
   */
  async clearMemories() {
    this.store = new MemoryStore();
    await this.persist();
    return { success: true, message: 'All memories cleared' };
  }

  /**
   * Create from project config
   * @param {Object} projectConfig
   * @param {string} workspaceRoot
   */
  static fromProjectConfig(projectConfig, workspaceRoot = '.') {
    const memoryConfig = projectConfig.memory || projectConfig.agent_memory || {};
    return new AgentMemoryManager({
      memoriesDir: memoryConfig.memories_dir || 'steering/memories',
      autoSave: memoryConfig.auto_save || false,
      minConfidence: memoryConfig.min_confidence || 0.6,
      workspaceRoot,
    });
  }
}

module.exports = {
  AgentMemoryManager,
  LearningItem,
  MemoryStore,
  LearningCategory,
  EXTRACTION_PATTERNS,
};
