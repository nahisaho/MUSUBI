/**
 * @file steering-validator.test.js
 * @description Tests for SteeringValidator
 */

'use strict';

const {
  SteeringValidator,
  createSteeringValidator,
  SEVERITY,
  RULE_TYPE,
  DEFAULT_VALIDATION_RULES,
} = require('../../src/steering/steering-validator');

describe('SteeringValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new SteeringValidator();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      expect(validator).toBeDefined();
      expect(validator.rules).toBeInstanceOf(Array);
      expect(validator.strictMode).toBe(false);
    });

    it('should accept custom options', () => {
      const custom = new SteeringValidator({
        steeringPath: 'custom/steering',
        strictMode: true,
      });
      expect(custom.steeringPath).toBe('custom/steering');
      expect(custom.strictMode).toBe(true);
    });

    it('should merge custom rules', () => {
      const customRule = {
        id: 'custom-rule',
        file: 'test.md',
        check: () => true,
        message: 'Test rule',
      };

      const custom = new SteeringValidator({ rules: [customRule] });
      expect(custom.rules.find(r => r.id === 'custom-rule')).toBeDefined();
    });
  });

  describe('validateFile()', () => {
    it('should validate content against rules', async () => {
      const content = `# Structure

## Overview

Project structure documentation.

## src/ directory

Source code here.`;

      const issues = await validator.validateFile('structure.md', content);
      expect(issues).toBeInstanceOf(Array);
    });

    it('should catch missing sections', async () => {
      const content = `# Empty file`;

      const issues = await validator.validateFile('tech.md', content);
      // Should have issues for missing stack/dependencies
      expect(issues.length).toBeGreaterThan(0);
    });

    it('should validate markdown format', async () => {
      const content = `# Test

[broken link]()

Some content`;

      const issues = await validator.validateFile('test.md', content);
      const formatIssue = issues.find(i => i.type === RULE_TYPE.FORMAT);
      expect(formatIssue).toBeDefined();
    });

    it('should detect TODO markers', async () => {
      const content = `# Test

[TODO] Complete this section

[TBD] Figure out later`;

      const issues = await validator.validateFile('test.md', content);
      const todoIssue = issues.find(i => i.message.includes('TODO'));
      expect(todoIssue).toBeDefined();
    });
  });

  describe('addRule()', () => {
    it('should add a custom rule', () => {
      const initialCount = validator.rules.length;

      validator.addRule({
        id: 'custom-check',
        file: 'structure.md',
        check: content => content.includes('## Dependencies'),
        message: 'Should have dependencies section',
      });

      expect(validator.rules.length).toBe(initialCount + 1);
    });

    it('should throw on invalid rule', () => {
      expect(() => validator.addRule({})).toThrow();
    });

    it('should set default values', () => {
      validator.addRule({
        id: 'minimal-rule',
        file: 'test.md',
        check: () => true,
        message: 'Test',
      });

      const rule = validator.rules.find(r => r.id === 'minimal-rule');
      expect(rule.type).toBe(RULE_TYPE.COMPLETENESS);
      expect(rule.severity).toBe(SEVERITY.WARNING);
    });
  });

  describe('getHistory()', () => {
    it('should return validation history', () => {
      validator.validations.set('v1', {
        id: 'v1',
        valid: true,
        timestamp: Date.now(),
      });

      const history = validator.getHistory();
      expect(history.length).toBe(1);
    });

    it('should sort by timestamp descending', () => {
      validator.validations.set('v1', {
        id: 'v1',
        timestamp: 1000,
      });
      validator.validations.set('v2', {
        id: 'v2',
        timestamp: 2000,
      });

      const history = validator.getHistory();
      expect(history[0].id).toBe('v2');
    });
  });

  describe('getStats()', () => {
    it('should return statistics', () => {
      const stats = validator.getStats();

      expect(stats.totalValidations).toBeDefined();
      expect(stats.averageScore).toBeDefined();
      expect(stats.passed).toBeDefined();
      expect(stats.failed).toBeDefined();
      expect(stats.rulesCount).toBeDefined();
    });

    it('should calculate average score', () => {
      validator.validations.set('v1', { valid: true, score: 80 });
      validator.validations.set('v2', { valid: true, score: 100 });

      const stats = validator.getStats();
      expect(stats.averageScore).toBe(90);
    });
  });

  describe('exportReport()', () => {
    it('should export markdown report', () => {
      const validationId = 'test-validation';
      validator.validations.set(validationId, {
        id: validationId,
        valid: true,
        score: 85,
        issues: [
          {
            file: 'test.md',
            severity: SEVERITY.WARNING,
            message: 'Test issue',
            type: RULE_TYPE.COMPLETENESS,
          },
        ],
        summary: {
          totalIssues: 1,
          bySeverity: { warning: 1 },
          byType: { completeness: 1 },
          byFile: { 'test.md': 1 },
        },
        timestamp: Date.now(),
      });

      const report = validator.exportReport(validationId);
      expect(report).toContain('# Steering Validation Report');
      expect(report).toContain('Score');
      expect(report).toContain('Test issue');
    });

    it('should return empty for unknown id', () => {
      const report = validator.exportReport('unknown');
      expect(report).toBe('');
    });
  });

  describe('calculateScore()', () => {
    it('should start at 100', () => {
      const score = validator.calculateScore([]);
      expect(score).toBe(100);
    });

    it('should penalize by severity', () => {
      const issues = [
        { severity: SEVERITY.INFO },
        { severity: SEVERITY.WARNING },
        { severity: SEVERITY.ERROR },
      ];

      const score = validator.calculateScore(issues);
      expect(score).toBeLessThan(100);
      expect(score).toBe(100 - 1 - 5 - 15); // 79
    });

    it('should not go below 0', () => {
      const issues = Array(20).fill({ severity: SEVERITY.CRITICAL });
      const score = validator.calculateScore(issues);
      expect(score).toBe(0);
    });
  });
});

describe('createSteeringValidator()', () => {
  it('should create instance', () => {
    const instance = createSteeringValidator();
    expect(instance).toBeInstanceOf(SteeringValidator);
  });

  it('should accept options', () => {
    const instance = createSteeringValidator({ strictMode: true });
    expect(instance.strictMode).toBe(true);
  });
});

describe('SEVERITY enum', () => {
  it('should have all severity levels', () => {
    expect(SEVERITY.INFO).toBe('info');
    expect(SEVERITY.WARNING).toBe('warning');
    expect(SEVERITY.ERROR).toBe('error');
    expect(SEVERITY.CRITICAL).toBe('critical');
  });
});

describe('RULE_TYPE enum', () => {
  it('should have all rule types', () => {
    expect(RULE_TYPE.REQUIRED).toBe('required');
    expect(RULE_TYPE.FORMAT).toBe('format');
    expect(RULE_TYPE.CONSISTENCY).toBe('consistency');
    expect(RULE_TYPE.REFERENCE).toBe('reference');
    expect(RULE_TYPE.COMPLETENESS).toBe('completeness');
  });
});

describe('DEFAULT_VALIDATION_RULES', () => {
  it('should have default rules', () => {
    expect(DEFAULT_VALIDATION_RULES).toBeInstanceOf(Array);
    expect(DEFAULT_VALIDATION_RULES.length).toBeGreaterThan(0);
  });

  it('should have required rule properties', () => {
    for (const rule of DEFAULT_VALIDATION_RULES) {
      expect(rule.id).toBeDefined();
      expect(rule.file).toBeDefined();
      expect(typeof rule.check).toBe('function');
      expect(rule.message).toBeDefined();
    }
  });

  it('should have structure.md rules', () => {
    const structureRules = DEFAULT_VALIDATION_RULES.filter(r => r.file === 'structure.md');
    expect(structureRules.length).toBeGreaterThan(0);
  });

  it('should have tech.md rules', () => {
    const techRules = DEFAULT_VALIDATION_RULES.filter(r => r.file === 'tech.md');
    expect(techRules.length).toBeGreaterThan(0);
  });
});
