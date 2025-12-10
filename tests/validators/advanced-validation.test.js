/**
 * Advanced Validation Tests
 */

const {
  AdvancedValidation,
  createAdvancedValidation,
  VALIDATION_TYPE,
  ARTIFACT_TYPE,
  GAP_SEVERITY,
} = require('../../src/validators/advanced-validation');

describe('AdvancedValidation', () => {
  describe('constructor', () => {
    test('should create with default options', () => {
      const av = new AdvancedValidation();
      expect(av.strict).toBe(false);
      expect(av.artifacts.size).toBe(0);
    });

    test('should accept custom options', () => {
      const av = new AdvancedValidation({ strict: true });
      expect(av.strict).toBe(true);
    });

    test('should load custom rules', () => {
      const av = new AdvancedValidation({
        rules: {
          custom: { validate: () => ({ valid: true }) },
        },
      });
      expect(av.customRules.has('custom')).toBe(true);
    });
  });

  describe('registerArtifact()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
    });

    test('should register an artifact', () => {
      av.registerArtifact('req-1', {
        type: ARTIFACT_TYPE.REQUIREMENT,
        name: 'Requirement 1',
      });
      expect(av.artifacts.has('req-1')).toBe(true);
    });

    test('should throw on invalid type', () => {
      expect(() => av.registerArtifact('invalid', { type: 'invalid' })).toThrow(
        'Invalid artifact type'
      );
    });

    test('should emit event', () => {
      const handler = jest.fn();
      av.on('artifact-registered', handler);

      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('unregisterArtifact()', () => {
    test('should remove artifact', () => {
      const av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.unregisterArtifact('req-1');
      expect(av.artifacts.has('req-1')).toBe(false);
    });
  });

  describe('addTraceLink()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
    });

    test('should add a trace link', () => {
      av.addTraceLink('req-1', 'design-1', 'implements');
      expect(av.traceabilityMatrix.has('req-1')).toBe(true);
    });

    test('should throw for unknown source', () => {
      expect(() => av.addTraceLink('unknown', 'design-1')).toThrow('Source artifact not found');
    });

    test('should throw for unknown target', () => {
      expect(() => av.addTraceLink('req-1', 'unknown')).toThrow('Target artifact not found');
    });
  });

  describe('validateCrossArtifact()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
    });

    test('should validate with no artifacts', () => {
      const result = av.validateCrossArtifact();
      expect(result.valid).toBe(true);
      expect(result.issues.length).toBe(0);
    });

    test('should detect orphaned artifacts', () => {
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });

      const result = av.validateCrossArtifact();
      expect(result.issues.some(i => i.type === 'orphaned')).toBe(true);
    });

    test('should not flag requirements as orphaned', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });

      const result = av.validateCrossArtifact();
      expect(result.issues.some(i => i.artifactId === 'req-1' && i.type === 'orphaned')).toBe(
        false
      );
    });

    test('should detect broken links', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1');

      // Remove target
      av.artifacts.delete('design-1');

      const result = av.validateCrossArtifact();
      expect(result.issues.some(i => i.type === 'broken-link')).toBe(true);
    });

    test('should emit validated event', () => {
      const handler = jest.fn();
      av.on('validated', handler);

      av.validateCrossArtifact();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('detectGaps()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
    });

    test('should detect missing design', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });

      const result = av.detectGaps();
      expect(result.gaps.some(g => g.type === 'missing-design')).toBe(true);
    });

    test('should detect missing implementation', () => {
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });

      const result = av.detectGaps();
      expect(result.gaps.some(g => g.type === 'missing-implementation')).toBe(true);
    });

    test('should detect missing tests', () => {
      av.registerArtifact('impl-1', { type: ARTIFACT_TYPE.IMPLEMENTATION });

      const result = av.detectGaps();
      expect(result.gaps.some(g => g.type === 'missing-test')).toBe(true);
    });

    test('should return completeness info', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });

      const result = av.detectGaps();
      expect(result.completeness.requirements).toBe(1);
      expect(result.completeness.designs).toBe(1);
    });

    test('should emit gaps-detected event', () => {
      const handler = jest.fn();
      av.on('gaps-detected', handler);

      av.detectGaps();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('validateTraceability()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
    });

    test('should calculate coverage', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1');

      const result = av.validateTraceability();
      expect(result.coverage).toBeGreaterThan(0);
    });

    test('should build matrix', () => {
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1', 'implements');

      const result = av.validateTraceability();
      expect(result.matrix).toBeDefined();
    });

    test('should detect unidirectional links in strict mode', () => {
      av = new AdvancedValidation({ strict: true });
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1');

      const result = av.validateTraceability();
      expect(result.issues.some(i => i.type === 'unidirectional')).toBe(true);
    });
  });

  describe('addRule()', () => {
    test('should add a custom rule', () => {
      const av = new AdvancedValidation();
      av.addRule('custom', {
        validate: () => ({ valid: true }),
      });
      expect(av.customRules.has('custom')).toBe(true);
    });

    test('should throw on invalid rule', () => {
      const av = new AdvancedValidation();
      expect(() => av.addRule('bad', {})).toThrow('Rule must have a validate function');
    });
  });

  describe('runAllValidations()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1');
    });

    test('should run all validations', () => {
      const result = av.runAllValidations();
      expect(result.crossArtifact).toBeDefined();
      expect(result.gaps).toBeDefined();
      expect(result.traceability).toBeDefined();
    });

    test('should include summary', () => {
      const result = av.runAllValidations();
      expect(result.summary).toBeDefined();
      expect(result.totalIssues).toBeDefined();
    });

    test('should run custom rules', () => {
      av.addRule('custom', {
        validate: () => ({ valid: true, checked: 1 }),
      });

      const result = av.runAllValidations();
      expect(result.customRules.length).toBe(1);
    });
  });

  describe('getHistory()', () => {
    let av;

    beforeEach(() => {
      av = new AdvancedValidation();
      av.validateCrossArtifact();
      av.detectGaps();
    });

    test('should return all history', () => {
      expect(av.getHistory().length).toBe(2);
    });

    test('should filter by type', () => {
      const history = av.getHistory({ type: VALIDATION_TYPE.CROSS_ARTIFACT });
      expect(history.length).toBe(1);
    });

    test('should limit results', () => {
      const history = av.getHistory({ limit: 1 });
      expect(history.length).toBe(1);
    });
  });

  describe('exportMatrix()', () => {
    test('should export as markdown', () => {
      const av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.registerArtifact('design-1', { type: ARTIFACT_TYPE.DESIGN });
      av.addTraceLink('req-1', 'design-1', 'implements');

      const md = av.exportMatrix();
      expect(md).toContain('# Traceability Matrix');
      expect(md).toContain('req-1');
      expect(md).toContain('implements');
      expect(md).toContain('Coverage:');
    });
  });

  describe('getStats()', () => {
    test('should return statistics', () => {
      const av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });

      const stats = av.getStats();
      expect(stats.artifactCount).toBe(1);
      expect(stats.linkCount).toBe(0);
    });
  });

  describe('clear()', () => {
    test('should clear all data', () => {
      const av = new AdvancedValidation();
      av.registerArtifact('req-1', { type: ARTIFACT_TYPE.REQUIREMENT });
      av.validateCrossArtifact();
      av.clear();

      expect(av.artifacts.size).toBe(0);
      expect(av.validationHistory.length).toBe(0);
    });

    test('should emit cleared event', () => {
      const av = new AdvancedValidation();
      const handler = jest.fn();
      av.on('cleared', handler);
      av.clear();
      expect(handler).toHaveBeenCalled();
    });
  });
});

describe('createAdvancedValidation()', () => {
  test('should create instance', () => {
    const av = createAdvancedValidation();
    expect(av).toBeInstanceOf(AdvancedValidation);
  });

  test('should accept options', () => {
    const av = createAdvancedValidation({ strict: true });
    expect(av.strict).toBe(true);
  });
});

describe('VALIDATION_TYPE', () => {
  test('should have all types', () => {
    expect(VALIDATION_TYPE.CROSS_ARTIFACT).toBe('cross-artifact');
    expect(VALIDATION_TYPE.GAP_DETECTION).toBe('gap-detection');
    expect(VALIDATION_TYPE.TRACEABILITY).toBe('traceability');
    expect(VALIDATION_TYPE.CONSISTENCY).toBe('consistency');
    expect(VALIDATION_TYPE.COMPLETENESS).toBe('completeness');
  });
});

describe('ARTIFACT_TYPE', () => {
  test('should have all types', () => {
    expect(ARTIFACT_TYPE.REQUIREMENT).toBe('requirement');
    expect(ARTIFACT_TYPE.DESIGN).toBe('design');
    expect(ARTIFACT_TYPE.IMPLEMENTATION).toBe('implementation');
    expect(ARTIFACT_TYPE.TEST).toBe('test');
    expect(ARTIFACT_TYPE.STEERING).toBe('steering');
    expect(ARTIFACT_TYPE.DOCUMENTATION).toBe('documentation');
  });
});

describe('GAP_SEVERITY', () => {
  test('should have all severity levels', () => {
    expect(GAP_SEVERITY.CRITICAL).toBe('critical');
    expect(GAP_SEVERITY.MAJOR).toBe('major');
    expect(GAP_SEVERITY.MINOR).toBe('minor');
    expect(GAP_SEVERITY.INFO).toBe('info');
  });
});
