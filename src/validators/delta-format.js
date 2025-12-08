/**
 * Delta Format Validator
 * Validates delta specification format compliance
 * 
 * @module validators/delta-format
 */

const fs = require('fs');
const path = require('path');
const { DeltaType } = require('../managers/delta-spec');

/**
 * Validation rules for delta specifications
 */
const ValidationRules = {
  // ID format: PREFIX-IDENTIFIER (e.g., DELTA-AUTH-001, CHG-UI-002)
  ID_PATTERN: /^[A-Z]+-[A-Z0-9]+-\d{3}$/,
  
  // Delta marker in markdown: [TYPE] ID: Description
  MARKER_PATTERN: /^\[([A-Z]+)\]\s+([A-Z]+-[A-Z0-9]+-\d{3}):\s+(.+)$/,
  
  // Requirement reference: REQ-xxx-nnn
  REQ_PATTERN: /REQ-[A-Z]+-\d{3}/g,
  
  // Valid statuses
  VALID_STATUSES: ['proposed', 'approved', 'rejected', 'implemented', 'archived'],
  
  // Maximum description length
  MAX_DESCRIPTION_LENGTH: 200,
  
  // Required sections in delta markdown
  REQUIRED_SECTIONS: ['Description']
};

class DeltaFormatValidator {
  constructor(options = {}) {
    this.strict = options.strict || false;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a delta specification object
   * @param {Object} delta - Delta spec to validate
   * @returns {Object} Validation result
   */
  validate(delta) {
    this.errors = [];
    this.warnings = [];

    this.validateId(delta.id);
    this.validateType(delta.type);
    this.validateTarget(delta.target);
    this.validateDescription(delta.description);
    this.validateStatus(delta.status);
    this.validateStateTransitions(delta);
    this.validateImpactedAreas(delta.impactedAreas);
    this.validateTimestamps(delta);

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      delta
    };
  }

  /**
   * Validate delta ID format
   * @param {string} id - Delta ID
   */
  validateId(id) {
    if (!id) {
      this.errors.push({
        rule: 'required-id',
        message: 'Delta ID is required'
      });
      return;
    }

    if (!ValidationRules.ID_PATTERN.test(id)) {
      this.errors.push({
        rule: 'id-format',
        message: `Invalid ID format: "${id}". Expected: PREFIX-IDENTIFIER-NNN (e.g., DELTA-AUTH-001)`,
        value: id
      });
    }
  }

  /**
   * Validate delta type
   * @param {string} type - Delta type
   */
  validateType(type) {
    if (!type) {
      this.errors.push({
        rule: 'required-type',
        message: 'Delta type is required'
      });
      return;
    }

    if (!Object.values(DeltaType).includes(type)) {
      this.errors.push({
        rule: 'invalid-type',
        message: `Invalid delta type: "${type}". Must be one of: ${Object.values(DeltaType).join(', ')}`,
        value: type
      });
    }
  }

  /**
   * Validate target reference
   * @param {string} target - Target requirement/component
   */
  validateTarget(target) {
    if (!target) {
      this.errors.push({
        rule: 'required-target',
        message: 'Target is required'
      });
      return;
    }

    // Check if target looks like a requirement ID
    if (!ValidationRules.REQ_PATTERN.test(target) && !target.includes('/')) {
      this.warnings.push({
        rule: 'target-format',
        message: `Target "${target}" doesn't match requirement ID format (REQ-XXX-NNN) or path format`,
        value: target
      });
    }
  }

  /**
   * Validate description
   * @param {string} description - Delta description
   */
  validateDescription(description) {
    if (!description) {
      this.errors.push({
        rule: 'required-description',
        message: 'Description is required'
      });
      return;
    }

    if (description.length > ValidationRules.MAX_DESCRIPTION_LENGTH) {
      this.warnings.push({
        rule: 'description-length',
        message: `Description exceeds ${ValidationRules.MAX_DESCRIPTION_LENGTH} characters`,
        value: description.length
      });
    }

    // Check for vague language
    const vagueTerms = ['should', 'might', 'could', 'maybe', 'possibly'];
    const foundVague = vagueTerms.filter(term => 
      description.toLowerCase().includes(term)
    );
    
    if (foundVague.length > 0) {
      this.warnings.push({
        rule: 'vague-language',
        message: `Description contains vague terms: ${foundVague.join(', ')}. Use definitive language.`,
        value: foundVague
      });
    }
  }

  /**
   * Validate status
   * @param {string} status - Delta status
   */
  validateStatus(status) {
    if (!status) {
      this.warnings.push({
        rule: 'missing-status',
        message: 'Status not specified, defaulting to "proposed"'
      });
      return;
    }

    if (!ValidationRules.VALID_STATUSES.includes(status)) {
      this.errors.push({
        rule: 'invalid-status',
        message: `Invalid status: "${status}". Must be one of: ${ValidationRules.VALID_STATUSES.join(', ')}`,
        value: status
      });
    }
  }

  /**
   * Validate state transitions based on delta type
   * @param {Object} delta - Delta spec
   */
  validateStateTransitions(delta) {
    const { type, before, after } = delta;

    switch (type) {
      case DeltaType.ADDED:
        if (before) {
          this.warnings.push({
            rule: 'added-has-before',
            message: 'ADDED delta should not have a "before" state'
          });
        }
        if (!after && this.strict) {
          this.errors.push({
            rule: 'added-missing-after',
            message: 'ADDED delta should specify the new state in "after"'
          });
        }
        break;

      case DeltaType.MODIFIED:
        if (!before) {
          this.warnings.push({
            rule: 'modified-missing-before',
            message: 'MODIFIED delta should have a "before" state for comparison'
          });
        }
        if (!after) {
          this.warnings.push({
            rule: 'modified-missing-after',
            message: 'MODIFIED delta should have an "after" state'
          });
        }
        break;

      case DeltaType.REMOVED:
        if (!before && this.strict) {
          this.warnings.push({
            rule: 'removed-missing-before',
            message: 'REMOVED delta should document the removed state in "before"'
          });
        }
        if (after) {
          this.warnings.push({
            rule: 'removed-has-after',
            message: 'REMOVED delta should not have an "after" state'
          });
        }
        break;

      case DeltaType.RENAMED:
        if (!before) {
          this.errors.push({
            rule: 'renamed-missing-before',
            message: 'RENAMED delta requires "before" state (original name)'
          });
        }
        if (!after) {
          this.errors.push({
            rule: 'renamed-missing-after',
            message: 'RENAMED delta requires "after" state (new name)'
          });
        }
        break;
    }
  }

  /**
   * Validate impacted areas
   * @param {string[]} impactedAreas - List of impacted areas
   */
  validateImpactedAreas(impactedAreas) {
    if (!impactedAreas || impactedAreas.length === 0) {
      this.warnings.push({
        rule: 'missing-impact',
        message: 'Impacted areas should be specified for change tracking'
      });
      return;
    }

    // Known impact categories
    const knownCategories = [
      'api', 'database', 'ui', 'backend', 'frontend',
      'security', 'performance', 'testing', 'documentation',
      'infrastructure', 'configuration'
    ];

    const unknown = impactedAreas.filter(area => 
      !knownCategories.includes(area.toLowerCase())
    );

    if (unknown.length > 0 && this.strict) {
      this.warnings.push({
        rule: 'unknown-impact-area',
        message: `Unknown impact areas: ${unknown.join(', ')}. Consider using: ${knownCategories.join(', ')}`,
        value: unknown
      });
    }
  }

  /**
   * Validate timestamps
   * @param {Object} delta - Delta spec
   */
  validateTimestamps(delta) {
    if (delta.createdAt) {
      if (isNaN(Date.parse(delta.createdAt))) {
        this.errors.push({
          rule: 'invalid-created-timestamp',
          message: 'Invalid createdAt timestamp format',
          value: delta.createdAt
        });
      }
    }

    if (delta.updatedAt) {
      if (isNaN(Date.parse(delta.updatedAt))) {
        this.errors.push({
          rule: 'invalid-updated-timestamp',
          message: 'Invalid updatedAt timestamp format',
          value: delta.updatedAt
        });
      }

      if (delta.createdAt && new Date(delta.updatedAt) < new Date(delta.createdAt)) {
        this.warnings.push({
          rule: 'timestamp-order',
          message: 'updatedAt is before createdAt'
        });
      }
    }
  }

  /**
   * Validate markdown content for delta markers
   * @param {string} content - Markdown content
   * @returns {Object} Validation result
   */
  validateMarkdown(content) {
    this.errors = [];
    this.warnings = [];

    const lines = content.split('\n');
    const deltas = [];

    lines.forEach((line, index) => {
      const match = line.match(ValidationRules.MARKER_PATTERN);
      if (match) {
        const [, type, id, description] = match;
        
        const delta = {
          type,
          id,
          description,
          line: index + 1
        };

        // Validate each found delta marker
        this.validateType(type);
        this.validateId(id);
        this.validateDescription(description);

        if (this.errors.length === 0) {
          deltas.push(delta);
        }
      }
    });

    // Check for duplicate IDs
    const ids = deltas.map(d => d.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      this.errors.push({
        rule: 'duplicate-id',
        message: `Duplicate delta IDs found: ${[...new Set(duplicates)].join(', ')}`,
        value: duplicates
      });
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      deltas
    };
  }

  /**
   * Validate a delta file
   * @param {string} filePath - Path to delta file
   * @returns {Object} Validation result
   */
  validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        errors: [{ rule: 'file-not-found', message: `File not found: ${filePath}` }],
        warnings: []
      };
    }

    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    if (ext === '.json') {
      try {
        const delta = JSON.parse(content);
        return this.validate(delta);
      } catch (e) {
        return {
          valid: false,
          errors: [{ rule: 'invalid-json', message: `Invalid JSON: ${e.message}` }],
          warnings: []
        };
      }
    } else if (ext === '.md') {
      return this.validateMarkdown(content);
    } else {
      return {
        valid: false,
        errors: [{ rule: 'unsupported-format', message: `Unsupported file format: ${ext}` }],
        warnings: []
      };
    }
  }

  /**
   * Validate all deltas in a directory
   * @param {string} dirPath - Path to changes directory
   * @returns {Object} Validation results
   */
  validateDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return {
        valid: true,
        results: [],
        summary: { total: 0, valid: 0, invalid: 0 }
      };
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const results = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const jsonPath = path.join(dirPath, entry.name, 'delta.json');
        if (fs.existsSync(jsonPath)) {
          const result = this.validateFile(jsonPath);
          result.id = entry.name;
          results.push(result);
          
          if (result.valid) {
            validCount++;
          } else {
            invalidCount++;
          }
        }
      }
    }

    return {
      valid: invalidCount === 0,
      results,
      summary: {
        total: results.length,
        valid: validCount,
        invalid: invalidCount
      }
    };
  }
}

module.exports = {
  DeltaFormatValidator,
  ValidationRules
};
