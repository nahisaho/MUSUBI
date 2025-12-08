/**
 * Traceability Validator Tests
 */

const path = require('path');
const fs = require('fs-extra');
const {
  TraceabilityValidator,
  Severity,
  RuleType,
  defaultConfig,
} = require('../../src/validators/traceability-validator.js');

describe('TraceabilityValidator', () => {
  let testDir;

  beforeAll(async () => {
    testDir = path.join(__dirname, '../test-output/traceability-validator');
    await fs.ensureDir(testDir);

    // Create minimal test structure
    await fs.ensureDir(path.join(testDir, 'docs/requirements'));
    await fs.ensureDir(path.join(testDir, 'docs/design'));
    await fs.ensureDir(path.join(testDir, 'docs/tasks'));
    await fs.ensureDir(path.join(testDir, 'src'));
    await fs.ensureDir(path.join(testDir, 'tests'));
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  describe('constructor', () => {
    it('should create validator with default config', () => {
      const validator = new TraceabilityValidator('/test');
      expect(validator.workspaceRoot).toBe('/test');
      expect(validator.config).toBeDefined();
      expect(validator.config.strictness).toBe('standard');
    });

    it('should merge custom config with defaults', () => {
      const validator = new TraceabilityValidator('/test', {
        strictness: 'strict',
        thresholds: { design: 90 },
      });
      expect(validator.config.strictness).toBe('strict');
      expect(validator.config.thresholds.design).toBe(90);
      expect(validator.config.thresholds.code).toBe(80); // default
    });
  });

  describe('applyStrictness', () => {
    it('should apply strict settings', () => {
      const validator = new TraceabilityValidator('/test');
      validator.applyStrictness('strict');

      expect(validator.config.thresholds.overall).toBe(100);
      Object.values(validator.config.rules).forEach(rule => {
        expect(rule.enabled).toBe(true);
        expect(rule.severity).toBe(Severity.ERROR);
      });
    });

    it('should apply relaxed settings', () => {
      const validator = new TraceabilityValidator('/test');
      validator.applyStrictness('relaxed');

      expect(validator.config.thresholds.overall).toBe(60);
      Object.values(validator.config.rules).forEach(rule => {
        expect(rule.severity).toBe(Severity.WARNING);
      });
    });

    it('should keep standard as default', () => {
      const validator = new TraceabilityValidator('/test');
      validator.applyStrictness('standard');

      expect(validator.config.thresholds.overall).toBe(80);
    });
  });

  describe('validate', () => {
    it('should return validation result object', async () => {
      const validator = new TraceabilityValidator(testDir);
      const result = await validator.validate();

      expect(result).toBeDefined();
      expect(result.valid).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.violations).toBeInstanceOf(Array);
      expect(result.warnings).toBeInstanceOf(Array);
      expect(result.infos).toBeInstanceOf(Array);
      expect(result.summary).toBeDefined();
    });

    it('should include coverage data', async () => {
      const validator = new TraceabilityValidator(testDir);
      const result = await validator.validate();

      expect(result.coverage).toBeDefined();
    });

    it('should include gaps data', async () => {
      const validator = new TraceabilityValidator(testDir);
      const result = await validator.validate();

      expect(result.gaps).toBeDefined();
    });
  });

  describe('isRuleEnabled', () => {
    it('should check if rule is enabled', () => {
      const validator = new TraceabilityValidator('/test');
      expect(validator.isRuleEnabled(RuleType.REQUIREMENT_HAS_CODE)).toBe(true);
    });

    it('should return false for non-existent rule', () => {
      const validator = new TraceabilityValidator('/test');
      expect(validator.isRuleEnabled('non-existent-rule')).toBeFalsy();
    });
  });

  describe('getRuleSeverity', () => {
    it('should get rule severity', () => {
      const validator = new TraceabilityValidator('/test');
      validator.applyStrictness('strict');
      expect(validator.getRuleSeverity(RuleType.REQUIREMENT_HAS_CODE)).toBe(Severity.ERROR);
    });

    it('should return WARNING for unknown rule', () => {
      const validator = new TraceabilityValidator('/test');
      expect(validator.getRuleSeverity('unknown')).toBe(Severity.WARNING);
    });
  });

  describe('addViolation', () => {
    it('should add error to violations', () => {
      const validator = new TraceabilityValidator('/test');
      const result = { violations: [], warnings: [], infos: [] };

      validator.addViolation(result, {
        rule: 'test',
        severity: Severity.ERROR,
        message: 'Test error',
      });

      expect(result.violations.length).toBe(1);
      expect(result.warnings.length).toBe(0);
    });

    it('should add warning to warnings', () => {
      const validator = new TraceabilityValidator('/test');
      const result = { violations: [], warnings: [], infos: [] };

      validator.addViolation(result, {
        rule: 'test',
        severity: Severity.WARNING,
        message: 'Test warning',
      });

      expect(result.warnings.length).toBe(1);
      expect(result.violations.length).toBe(0);
    });

    it('should add info to infos', () => {
      const validator = new TraceabilityValidator('/test');
      const result = { violations: [], warnings: [], infos: [] };

      validator.addViolation(result, {
        rule: 'test',
        severity: Severity.INFO,
        message: 'Test info',
      });

      expect(result.infos.length).toBe(1);
    });
  });

  describe('checkCoverageThresholds', () => {
    it('should add violation when below threshold', () => {
      const validator = new TraceabilityValidator('/test');
      validator.applyStrictness('strict');
      const result = { violations: [], warnings: [], infos: [] };

      const coverage = {
        designCoverage: 50,
        tasksCoverage: 50,
        codeCoverage: 50,
        testsCoverage: 50,
        overall: 50,
      };

      validator.checkCoverageThresholds(result, coverage);

      // Should have violations for all categories below 100% (strict mode)
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should not add violation when meeting threshold', () => {
      const validator = new TraceabilityValidator('/test', {
        thresholds: {
          design: 50,
          tasks: 50,
          code: 50,
          tests: 50,
          overall: 50,
        },
      });
      const result = { violations: [], warnings: [], infos: [] };

      const coverage = {
        designCoverage: 60,
        tasksCoverage: 60,
        codeCoverage: 60,
        testsCoverage: 60,
        overall: 60,
      };

      validator.checkCoverageThresholds(result, coverage);

      expect(result.violations.length).toBe(0);
    });
  });

  describe('checkOrphanedItems', () => {
    it('should add violation for orphaned requirements', () => {
      const validator = new TraceabilityValidator('/test');
      const result = { violations: [], warnings: [], infos: [] };

      const gaps = {
        orphanedRequirements: [{ id: 'REQ-001' }, { id: 'REQ-002' }],
      };

      validator.checkOrphanedItems(result, gaps);

      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].message).toContain('2 orphaned requirements');
    });

    it('should not add violation when no orphans', () => {
      const validator = new TraceabilityValidator('/test');
      const result = { violations: [], warnings: [], infos: [] };

      const gaps = {
        orphanedRequirements: [],
      };

      validator.checkOrphanedItems(result, gaps);

      expect(result.warnings.length).toBe(0);
    });
  });

  describe('generateReport', () => {
    it('should generate markdown report', async () => {
      const validator = new TraceabilityValidator(testDir);
      const validationResult = await validator.validate();
      const report = validator.generateReport(validationResult);

      expect(report).toContain('# Traceability Validation Report');
      expect(report).toContain('**Generated**:');
      expect(report).toContain('## Summary');
    });

    it('should include coverage in report', async () => {
      const validator = new TraceabilityValidator(testDir);
      const validationResult = await validator.validate();
      const report = validator.generateReport(validationResult);

      expect(report).toContain('## Coverage');
      expect(report).toContain('Design');
    });
  });
});

describe('Severity', () => {
  it('should have all expected levels', () => {
    expect(Severity.ERROR).toBe('error');
    expect(Severity.WARNING).toBe('warning');
    expect(Severity.INFO).toBe('info');
  });
});

describe('RuleType', () => {
  it('should have all expected rule types', () => {
    expect(RuleType.REQUIREMENT_HAS_DESIGN).toBe('requirement-has-design');
    expect(RuleType.REQUIREMENT_HAS_TESTS).toBe('requirement-has-tests');
    expect(RuleType.MINIMUM_COVERAGE).toBe('minimum-coverage');
    expect(RuleType.BIDIRECTIONAL_LINKS).toBe('bidirectional-links');
  });
});

describe('defaultConfig', () => {
  it('should have expected structure', () => {
    expect(defaultConfig.strictness).toBe('standard');
    expect(defaultConfig.thresholds).toBeDefined();
    expect(defaultConfig.thresholds.overall).toBe(80);
    expect(defaultConfig.rules).toBeDefined();
    expect(defaultConfig.paths).toBeDefined();
  });
});
