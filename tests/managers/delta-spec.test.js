/**
 * Delta Specification Manager Tests
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { DeltaSpecManager, DeltaType } = require('../../src/managers/delta-spec');
const { DeltaFormatValidator } = require('../../src/validators/delta-format');

describe('DeltaSpecManager', () => {
  let tempDir;
  let manager;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'musubi-delta-test-'));
    manager = new DeltaSpecManager(tempDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('create', () => {
    it('should create a valid ADDED delta', () => {
      const delta = manager.create({
        id: 'DELTA-AUTH-001',
        type: DeltaType.ADDED,
        target: 'REQ-AUTH-005',
        description: 'Add OAuth2 support',
        rationale: 'User requested social login',
        impactedAreas: ['api', 'backend']
      });

      expect(delta.id).toBe('DELTA-AUTH-001');
      expect(delta.type).toBe('ADDED');
      expect(delta.status).toBe('proposed');
      expect(delta.createdAt).toBeDefined();
    });

    it('should save delta to files', () => {
      manager.create({
        id: 'DELTA-TEST-001',
        type: DeltaType.ADDED,
        target: 'REQ-TEST-001',
        description: 'Test delta'
      });

      const jsonPath = path.join(tempDir, 'storage', 'changes', 'DELTA-TEST-001', 'delta.json');
      const mdPath = path.join(tempDir, 'storage', 'changes', 'DELTA-TEST-001', 'delta.md');
      
      expect(fs.existsSync(jsonPath)).toBe(true);
      expect(fs.existsSync(mdPath)).toBe(true);
    });

    it('should throw error for missing required fields', () => {
      expect(() => manager.create({ type: DeltaType.ADDED }))
        .toThrow('Delta ID is required');
    });

    it('should throw error for invalid type', () => {
      expect(() => manager.create({
        id: 'DELTA-TEST-001',
        type: 'INVALID',
        target: 'REQ-TEST-001',
        description: 'Test'
      })).toThrow(/Invalid delta type/);
    });
  });

  describe('load', () => {
    it('should load existing delta', () => {
      manager.create({
        id: 'DELTA-LOAD-001',
        type: DeltaType.ADDED,
        target: 'REQ-TEST-001',
        description: 'Test delta'
      });

      const loaded = manager.load('DELTA-LOAD-001');
      expect(loaded).toBeDefined();
      expect(loaded.id).toBe('DELTA-LOAD-001');
    });

    it('should return null for non-existent delta', () => {
      const loaded = manager.load('DELTA-NONEXISTENT');
      expect(loaded).toBeNull();
    });
  });

  describe('list', () => {
    it('should list all deltas', () => {
      manager.create({ id: 'DELTA-A-001', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      manager.create({ id: 'DELTA-B-001', type: DeltaType.MODIFIED, target: 'REQ-B', description: 'B', before: 'old' });
      
      const list = manager.list();
      expect(list.length).toBe(2);
    });

    it('should filter by type', () => {
      manager.create({ id: 'DELTA-A-001', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      manager.create({ id: 'DELTA-B-001', type: DeltaType.MODIFIED, target: 'REQ-B', description: 'B', before: 'old' });
      
      const added = manager.list({ type: DeltaType.ADDED });
      expect(added.length).toBe(1);
      expect(added[0].type).toBe('ADDED');
    });
  });

  describe('updateStatus', () => {
    it('should update status', () => {
      manager.create({ id: 'DELTA-STATUS-001', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      
      const updated = manager.updateStatus('DELTA-STATUS-001', 'approved');
      expect(updated.status).toBe('approved');
    });

    it('should throw for invalid status', () => {
      manager.create({ id: 'DELTA-STATUS-002', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      
      expect(() => manager.updateStatus('DELTA-STATUS-002', 'invalid'))
        .toThrow(/Invalid status/);
    });
  });

  describe('archive', () => {
    it('should archive implemented delta', () => {
      manager.create({ id: 'DELTA-ARCH-001', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      manager.updateStatus('DELTA-ARCH-001', 'implemented');
      
      const result = manager.archive('DELTA-ARCH-001');
      expect(result.archived).toBe(true);
      
      // Should be removed from changes
      expect(manager.load('DELTA-ARCH-001')).toBeNull();
      
      // Should exist in archive
      const archivePath = path.join(tempDir, 'storage', 'archive', 'DELTA-ARCH-001.json');
      expect(fs.existsSync(archivePath)).toBe(true);
    });

    it('should throw for non-implemented delta', () => {
      manager.create({ id: 'DELTA-ARCH-002', type: DeltaType.ADDED, target: 'REQ-A', description: 'A' });
      
      expect(() => manager.archive('DELTA-ARCH-002'))
        .toThrow('Only implemented deltas can be archived');
    });
  });

  describe('parseDeltas', () => {
    it('should parse delta markers from markdown', () => {
      const content = `
# Requirements

[ADDED] REQ-AUTH-001: Add OAuth support
[MODIFIED] REQ-AUTH-002: Update password policy
[REMOVED] REQ-LEGACY-001: Remove deprecated feature
      `;

      const deltas = manager.parseDeltas(content);
      expect(deltas.length).toBe(3);
      expect(deltas[0].type).toBe('ADDED');
      expect(deltas[1].type).toBe('MODIFIED');
      expect(deltas[2].type).toBe('REMOVED');
    });
  });

  describe('validate', () => {
    it('should validate delta spec', () => {
      const delta = {
        id: 'DELTA-VAL-001',
        type: DeltaType.ADDED,
        target: 'REQ-AUTH-001',
        description: 'Add feature'
      };

      const result = manager.validate(delta);
      expect(result.valid).toBe(true);
    });

    it('should catch validation errors', () => {
      const delta = {
        id: 'invalid-id',
        type: 'INVALID',
        target: '',
        description: ''
      };

      const result = manager.validate(delta);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('DeltaFormatValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new DeltaFormatValidator();
  });

  describe('validate', () => {
    it('should validate correct delta', () => {
      const delta = {
        id: 'DELTA-AUTH-001',
        type: 'ADDED',
        target: 'REQ-AUTH-001',
        description: 'Add OAuth2 support',
        status: 'proposed',
        impactedAreas: ['api', 'backend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = validator.validate(delta);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect missing fields', () => {
      const delta = {};
      const result = validator.validate(delta);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'required-id')).toBe(true);
      expect(result.errors.some(e => e.rule === 'required-type')).toBe(true);
    });

    it('should detect invalid ID format', () => {
      const delta = {
        id: 'invalid',
        type: 'ADDED',
        target: 'REQ-TEST-001',
        description: 'Test'
      };

      const result = validator.validate(delta);
      expect(result.errors.some(e => e.rule === 'id-format')).toBe(true);
    });

    it('should warn about vague language', () => {
      const delta = {
        id: 'DELTA-TEST-001',
        type: 'ADDED',
        target: 'REQ-TEST-001',
        description: 'This should maybe work'
      };

      const result = validator.validate(delta);
      expect(result.warnings.some(w => w.rule === 'vague-language')).toBe(true);
    });

    it('should validate MODIFIED requires before/after', () => {
      const delta = {
        id: 'DELTA-MOD-001',
        type: 'MODIFIED',
        target: 'REQ-TEST-001',
        description: 'Modified test'
      };

      const result = validator.validate(delta);
      expect(result.warnings.some(w => w.rule === 'modified-missing-before')).toBe(true);
    });

    it('should validate RENAMED requires before and after', () => {
      const delta = {
        id: 'DELTA-REN-001',
        type: 'RENAMED',
        target: 'REQ-TEST-001',
        description: 'Renamed test'
      };

      const result = validator.validate(delta);
      expect(result.errors.some(e => e.rule === 'renamed-missing-before')).toBe(true);
      expect(result.errors.some(e => e.rule === 'renamed-missing-after')).toBe(true);
    });
  });

  describe('validateMarkdown', () => {
    it('should parse and validate delta markers', () => {
      const content = `
# Changes

[ADDED] DELTA-AUTH-001: Add OAuth2 support
[MODIFIED] DELTA-AUTH-002: Update password policy
      `;

      const result = validator.validateMarkdown(content);
      expect(result.valid).toBe(true);
      expect(result.deltas.length).toBe(2);
    });

    it('should detect duplicate IDs', () => {
      const content = `
[ADDED] DELTA-DUP-001: First
[ADDED] DELTA-DUP-001: Duplicate
      `;

      const result = validator.validateMarkdown(content);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.rule === 'duplicate-id')).toBe(true);
    });
  });

  describe('strict mode', () => {
    it('should enforce stricter validation in strict mode', () => {
      const strictValidator = new DeltaFormatValidator({ strict: true });
      
      const delta = {
        id: 'DELTA-STR-001',
        type: 'ADDED',
        target: 'REQ-TEST-001',
        description: 'Test',
        impactedAreas: ['custom-area']
      };

      const result = strictValidator.validate(delta);
      expect(result.warnings.some(w => w.rule === 'unknown-impact-area')).toBe(true);
    });
  });
});
