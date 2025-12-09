/**
 * @file steering-validator.js
 * @description Steering file validation and consistency checks
 * @version 1.0.0
 * 
 * Part of MUSUBI v5.0.0 - Phase 5 Advanced Features
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * Validation severity levels
 * @enum {string}
 */
const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * Validation rule types
 * @enum {string}
 */
const RULE_TYPE = {
  REQUIRED: 'required',
  FORMAT: 'format',
  CONSISTENCY: 'consistency',
  REFERENCE: 'reference',
  COMPLETENESS: 'completeness'
};

/**
 * @typedef {Object} ValidationIssue
 * @property {string} id - Issue identifier
 * @property {string} file - File with issue
 * @property {string} type - Issue type
 * @property {string} severity - Issue severity
 * @property {string} message - Issue message
 * @property {number} [line] - Line number
 * @property {string} [suggestion] - Fix suggestion
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Overall validity
 * @property {number} score - Validation score (0-100)
 * @property {ValidationIssue[]} issues - Found issues
 * @property {Object} summary - Validation summary
 * @property {number} timestamp - Validation timestamp
 */

/**
 * Default validation rules
 */
const DEFAULT_VALIDATION_RULES = [
  // Structure.md rules
  {
    id: 'structure-has-overview',
    file: 'structure.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.ERROR,
    check: (content) => content.includes('## Overview') || content.includes('# '),
    message: 'structure.md must have an Overview section'
  },
  {
    id: 'structure-has-directories',
    file: 'structure.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.WARNING,
    check: (content) => content.includes('src/') || content.includes('lib/'),
    message: 'structure.md should document directory structure'
  },
  
  // Tech.md rules
  {
    id: 'tech-has-stack',
    file: 'tech.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.ERROR,
    check: (content) => content.includes('stack') || content.includes('technologies'),
    message: 'tech.md must document the technology stack',
    suggestion: 'Add a "Technology Stack" section'
  },
  {
    id: 'tech-has-dependencies',
    file: 'tech.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.WARNING,
    check: (content) => content.includes('dependencies') || content.includes('package'),
    message: 'tech.md should document dependencies'
  },
  
  // Product.md rules
  {
    id: 'product-has-vision',
    file: 'product.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.ERROR,
    check: (content) => content.includes('vision') || content.includes('purpose') || content.includes('goal'),
    message: 'product.md must have a vision/purpose section'
  },
  {
    id: 'product-has-features',
    file: 'product.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.WARNING,
    check: (content) => content.includes('feature') || content.includes('capability'),
    message: 'product.md should list features or capabilities'
  },
  
  // Constitution rules
  {
    id: 'constitution-has-articles',
    file: 'rules/constitution.md',
    type: RULE_TYPE.REQUIRED,
    severity: SEVERITY.ERROR,
    check: (content) => content.includes('Article') || content.includes('Rule'),
    message: 'constitution.md must define governance articles'
  },
  
  // Format rules
  {
    id: 'format-valid-markdown',
    file: '*',
    type: RULE_TYPE.FORMAT,
    severity: SEVERITY.WARNING,
    check: (content) => {
      // Check for broken links format
      const brokenLinks = content.match(/\[([^\]]*)\]\(\s*\)/g);
      return !brokenLinks || brokenLinks.length === 0;
    },
    message: 'File contains empty markdown links'
  },
  {
    id: 'format-no-todo-in-production',
    file: '*',
    type: RULE_TYPE.COMPLETENESS,
    severity: SEVERITY.INFO,
    check: (content) => !content.includes('[TODO]') && !content.includes('[TBD]'),
    message: 'File contains TODO or TBD markers'
  }
];

/**
 * Steering Validator class
 * @extends EventEmitter
 */
class SteeringValidator extends EventEmitter {
  /**
   * Create steering validator
   * @param {Object} [options={}] - Options
   */
  constructor(options = {}) {
    super();
    
    this.steeringPath = options.steeringPath || 'steering';
    this.rules = [...DEFAULT_VALIDATION_RULES, ...(options.rules || [])];
    this.strictMode = options.strictMode ?? false;
    
    // State
    this.validations = new Map();
    this.validationCounter = 0;
  }
  
  /**
   * Validate all steering files
   * @param {string} [basePath='.'] - Base path
   * @returns {Promise<ValidationResult>}
   */
  async validate(basePath = '.') {
    const id = `validation-${++this.validationCounter}`;
    this.emit('validation:start', { id, basePath });
    
    const steeringDir = path.join(basePath, this.steeringPath);
    const issues = [];
    
    // Define files to check
    const files = [
      'structure.md',
      'tech.md',
      'product.md',
      'rules/constitution.md'
    ];
    
    // Check each file
    for (const file of files) {
      const filePath = path.join(steeringDir, file);
      
      if (!fs.existsSync(filePath)) {
        issues.push({
          id: `issue-${issues.length + 1}`,
          file,
          type: RULE_TYPE.REQUIRED,
          severity: SEVERITY.ERROR,
          message: `Required steering file "${file}" not found`,
          suggestion: `Create ${file} with appropriate content`
        });
        continue;
      }
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileIssues = await this.validateFile(file, content);
        issues.push(...fileIssues);
      } catch (error) {
        issues.push({
          id: `issue-${issues.length + 1}`,
          file,
          type: RULE_TYPE.FORMAT,
          severity: SEVERITY.ERROR,
          message: `Error reading file: ${error.message}`
        });
      }
    }
    
    // Check custom steering files
    const customDir = path.join(steeringDir, 'custom');
    if (fs.existsSync(customDir)) {
      const customFiles = fs.readdirSync(customDir).filter(f => f.endsWith('.md'));
      for (const file of customFiles) {
        const filePath = path.join(customDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const fileIssues = await this.validateFile(`custom/${file}`, content);
        issues.push(...fileIssues);
      }
    }
    
    // Cross-file consistency checks
    const consistencyIssues = await this.checkConsistency(basePath);
    issues.push(...consistencyIssues);
    
    // Calculate score
    const score = this.calculateScore(issues);
    
    // Create result
    const result = {
      id,
      valid: issues.filter(i => i.severity === SEVERITY.ERROR || i.severity === SEVERITY.CRITICAL).length === 0,
      score,
      issues,
      summary: this.createSummary(issues),
      timestamp: Date.now()
    };
    
    this.validations.set(id, result);
    this.emit('validation:complete', { result });
    
    return result;
  }
  
  /**
   * Validate a single file
   * @param {string} file - File name
   * @param {string} content - File content
   * @returns {ValidationIssue[]}
   */
  async validateFile(file, content) {
    const issues = [];
    
    // Get applicable rules
    const applicableRules = this.rules.filter(rule => 
      rule.file === file || rule.file === '*'
    );
    
    for (const rule of applicableRules) {
      try {
        const passes = rule.check(content);
        
        if (!passes) {
          issues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            file,
            rule: rule.id,
            type: rule.type,
            severity: rule.severity,
            message: rule.message,
            suggestion: rule.suggestion
          });
        }
      } catch (error) {
        this.emit('rule:error', { rule: rule.id, error });
      }
    }
    
    return issues;
  }
  
  /**
   * Check cross-file consistency
   * @param {string} basePath - Base path
   * @returns {Promise<ValidationIssue[]>}
   */
  async checkConsistency(basePath) {
    const issues = [];
    const steeringDir = path.join(basePath, this.steeringPath);
    
    try {
      // Load files
      const structurePath = path.join(steeringDir, 'structure.md');
      const techPath = path.join(steeringDir, 'tech.md');
      const productPath = path.join(steeringDir, 'product.md');
      
      const files = {};
      if (fs.existsSync(structurePath)) {
        files.structure = fs.readFileSync(structurePath, 'utf8');
      }
      if (fs.existsSync(techPath)) {
        files.tech = fs.readFileSync(techPath, 'utf8');
      }
      if (fs.existsSync(productPath)) {
        files.product = fs.readFileSync(productPath, 'utf8');
      }
      
      // Check project name consistency
      const projectNames = this.extractProjectNames(files);
      if (projectNames.size > 1) {
        issues.push({
          id: `consistency-project-name`,
          file: 'multiple',
          type: RULE_TYPE.CONSISTENCY,
          severity: SEVERITY.WARNING,
          message: `Inconsistent project names found: ${Array.from(projectNames).join(', ')}`,
          suggestion: 'Use consistent project name across all steering files'
        });
      }
      
      // Check language consistency
      if (files.structure && files.tech) {
        const structureLangs = this.extractLanguages(files.structure);
        const techLangs = this.extractLanguages(files.tech);
        
        const missingInTech = structureLangs.filter(l => !techLangs.includes(l));
        if (missingInTech.length > 0) {
          issues.push({
            id: `consistency-languages`,
            file: 'tech.md',
            type: RULE_TYPE.CONSISTENCY,
            severity: SEVERITY.INFO,
            message: `Languages in structure.md not documented in tech.md: ${missingInTech.join(', ')}`
          });
        }
      }
      
    } catch (error) {
      this.emit('consistency:error', { error });
    }
    
    return issues;
  }
  
  /**
   * Extract project names from files
   * @private
   */
  extractProjectNames(files) {
    const names = new Set();
    
    for (const [, content] of Object.entries(files)) {
      // Look for project name patterns
      const matches = content.match(/^#\s+([^\n]+)/m);
      if (matches) {
        names.add(matches[1].trim());
      }
    }
    
    return names;
  }
  
  /**
   * Extract languages from content
   * @private
   */
  extractLanguages(content) {
    const langs = [];
    const patterns = [
      /javascript/gi,
      /typescript/gi,
      /python/gi,
      /java(?!script)/gi,
      /go(?:lang)?/gi,
      /rust/gi,
      /ruby/gi
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        langs.push(pattern.source.replace(/[^\w]/g, '').toLowerCase());
      }
    }
    
    return [...new Set(langs)];
  }
  
  /**
   * Calculate validation score
   * @private
   */
  calculateScore(issues) {
    let score = 100;
    
    const penalties = {
      [SEVERITY.INFO]: 1,
      [SEVERITY.WARNING]: 5,
      [SEVERITY.ERROR]: 15,
      [SEVERITY.CRITICAL]: 30
    };
    
    for (const issue of issues) {
      score -= penalties[issue.severity] || 0;
    }
    
    return Math.max(0, score);
  }
  
  /**
   * Create validation summary
   * @private
   */
  createSummary(issues) {
    const bySeverity = {};
    const byType = {};
    const byFile = {};
    
    for (const issue of issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
      byType[issue.type] = (byType[issue.type] || 0) + 1;
      byFile[issue.file] = (byFile[issue.file] || 0) + 1;
    }
    
    return {
      totalIssues: issues.length,
      bySeverity,
      byType,
      byFile
    };
  }
  
  /**
   * Add custom rule
   * @param {Object} rule - Validation rule
   */
  addRule(rule) {
    if (!rule.id || !rule.file || !rule.check) {
      throw new Error('Rule must have id, file, and check function');
    }
    
    this.rules.push({
      type: RULE_TYPE.COMPLETENESS,
      severity: SEVERITY.WARNING,
      ...rule
    });
  }
  
  /**
   * Get validation history
   * @returns {ValidationResult[]}
   */
  getHistory() {
    return Array.from(this.validations.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }
  
  /**
   * Get statistics
   * @returns {Object}
   */
  getStats() {
    const validations = Array.from(this.validations.values());
    const scores = validations.map(v => v.score);
    
    return {
      totalValidations: validations.length,
      averageScore: scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0,
      passed: validations.filter(v => v.valid).length,
      failed: validations.filter(v => !v.valid).length,
      rulesCount: this.rules.length
    };
  }
  
  /**
   * Export validation report
   * @param {string} validationId - Validation ID
   * @returns {string} Markdown report
   */
  exportReport(validationId) {
    const validation = this.validations.get(validationId);
    if (!validation) return '';
    
    let md = `# Steering Validation Report\n\n`;
    md += `**Status:** ${validation.valid ? '✅ Valid' : '❌ Invalid'}\n`;
    md += `**Score:** ${validation.score}/100\n`;
    md += `**Date:** ${new Date(validation.timestamp).toISOString()}\n\n`;
    
    md += `## Summary\n\n`;
    md += `- Total Issues: ${validation.issues.length}\n`;
    for (const [severity, count] of Object.entries(validation.summary.bySeverity)) {
      md += `- ${severity}: ${count}\n`;
    }
    
    if (validation.issues.length > 0) {
      md += `\n## Issues\n\n`;
      
      for (const issue of validation.issues) {
        const icon = {
          [SEVERITY.INFO]: 'ℹ️',
          [SEVERITY.WARNING]: '⚠️',
          [SEVERITY.ERROR]: '❌',
          [SEVERITY.CRITICAL]: '🚨'
        }[issue.severity];
        
        md += `### ${icon} ${issue.message}\n\n`;
        md += `- **File:** ${issue.file}\n`;
        md += `- **Type:** ${issue.type}\n`;
        md += `- **Severity:** ${issue.severity}\n`;
        if (issue.suggestion) md += `- **Suggestion:** ${issue.suggestion}\n`;
        md += `\n`;
      }
    }
    
    return md;
  }
}

/**
 * Create steering validator
 * @param {Object} [options={}] - Options
 * @returns {SteeringValidator}
 */
function createSteeringValidator(options = {}) {
  return new SteeringValidator(options);
}

module.exports = {
  SteeringValidator,
  createSteeringValidator,
  SEVERITY,
  RULE_TYPE,
  DEFAULT_VALIDATION_RULES
};
