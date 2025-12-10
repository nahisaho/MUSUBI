/**
 * @file steering-auto-update.test.js
 * @description Tests for SteeringAutoUpdate
 */

'use strict';

const {
  SteeringAutoUpdate,
  createSteeringAutoUpdate,
  TRIGGER,
  STEERING_TYPE,
  DEFAULT_RULES,
} = require('../../src/steering/steering-auto-update');

describe('SteeringAutoUpdate', () => {
  let autoUpdate;

  beforeEach(() => {
    autoUpdate = new SteeringAutoUpdate();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      expect(autoUpdate).toBeDefined();
      expect(autoUpdate.rules).toBeInstanceOf(Array);
      expect(autoUpdate.autoSave).toBe(true);
      expect(autoUpdate.backup).toBe(true);
    });

    it('should accept custom options', () => {
      const custom = new SteeringAutoUpdate({
        steeringPath: 'custom/steering',
        autoSave: false,
        backup: false,
      });
      expect(custom.steeringPath).toBe('custom/steering');
      expect(custom.autoSave).toBe(false);
      expect(custom.backup).toBe(false);
    });

    it('should merge custom rules', () => {
      const customRule = {
        id: 'custom-rule',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.CUSTOM,
        condition: () => true,
        update: async () => ({ changes: ['test'] }),
      };

      const custom = new SteeringAutoUpdate({ rules: [customRule] });
      expect(custom.rules.find(r => r.id === 'custom-rule')).toBeDefined();
    });
  });

  describe('processTrigger()', () => {
    it('should process trigger without matching rules', async () => {
      const results = await autoUpdate.processTrigger(TRIGGER.MANUAL, {});
      expect(results).toBeInstanceOf(Array);
    });

    it('should process trigger with matching rules', async () => {
      // Add a simple rule
      autoUpdate.addRule({
        id: 'test-rule',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.STRUCTURE,
        priority: 100,
        condition: ctx => ctx.testFlag === true,
        update: async () => ({ section: 'test', changes: ['Test change'] }),
      });

      // Set up mock steering
      autoUpdate.steering.set(STEERING_TYPE.STRUCTURE, {
        path: 'steering/structure.md',
        content: '# Structure',
        parsed: new Map(),
      });

      const results = await autoUpdate.processTrigger(TRIGGER.MANUAL, { testFlag: true });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].success).toBe(true);
      expect(results[0].changes).toContain('Test change');
    });

    it('should emit trigger events', async () => {
      const events = [];
      autoUpdate.on('trigger:received', e => events.push(['received', e]));
      autoUpdate.on('trigger:processed', e => events.push(['processed', e]));

      await autoUpdate.processTrigger(TRIGGER.MANUAL, {});

      expect(events.find(e => e[0] === 'received')).toBeDefined();
      expect(events.find(e => e[0] === 'processed')).toBeDefined();
    });

    it('should handle rule errors gracefully', async () => {
      autoUpdate.addRule({
        id: 'error-rule',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.STRUCTURE,
        condition: () => {
          throw new Error('Condition error');
        },
        update: async () => ({ changes: [] }),
      });

      // Should not throw
      const results = await autoUpdate.processTrigger(TRIGGER.MANUAL, {});
      expect(results).toBeInstanceOf(Array);
    });
  });

  describe('addRule()', () => {
    it('should add a rule', () => {
      const initialCount = autoUpdate.rules.length;

      autoUpdate.addRule({
        id: 'new-rule',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.TECH,
        condition: () => true,
        update: async () => ({ changes: [] }),
      });

      expect(autoUpdate.rules.length).toBe(initialCount + 1);
    });

    it('should throw on invalid rule', () => {
      expect(() => autoUpdate.addRule({})).toThrow();
    });

    it('should sort rules by priority', () => {
      autoUpdate.addRule({
        id: 'high-priority',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.TECH,
        priority: 100,
        condition: () => true,
        update: async () => ({ changes: [] }),
      });

      autoUpdate.addRule({
        id: 'low-priority',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.TECH,
        priority: 1,
        condition: () => true,
        update: async () => ({ changes: [] }),
      });

      const highIndex = autoUpdate.rules.findIndex(r => r.id === 'high-priority');
      const lowIndex = autoUpdate.rules.findIndex(r => r.id === 'low-priority');

      expect(highIndex).toBeLessThan(lowIndex);
    });
  });

  describe('removeRule()', () => {
    it('should remove a rule', () => {
      autoUpdate.addRule({
        id: 'removable',
        trigger: TRIGGER.MANUAL,
        target: STEERING_TYPE.TECH,
        condition: () => true,
        update: async () => ({ changes: [] }),
      });

      const initialCount = autoUpdate.rules.length;
      autoUpdate.removeRule('removable');

      expect(autoUpdate.rules.length).toBe(initialCount - 1);
      expect(autoUpdate.rules.find(r => r.id === 'removable')).toBeUndefined();
    });
  });

  describe('getHistory()', () => {
    it('should return update history', async () => {
      // Manually add some updates
      autoUpdate.updates.set('update-1', {
        id: 'update-1',
        success: true,
        trigger: TRIGGER.MANUAL,
        timestamp: Date.now(),
      });

      const history = autoUpdate.getHistory();
      expect(history.length).toBe(1);
    });

    it('should filter by trigger', () => {
      autoUpdate.updates.set('update-1', {
        id: 'update-1',
        trigger: TRIGGER.MANUAL,
        timestamp: Date.now(),
      });
      autoUpdate.updates.set('update-2', {
        id: 'update-2',
        trigger: TRIGGER.CODE_CHANGE,
        timestamp: Date.now(),
      });

      const manualHistory = autoUpdate.getHistory({ trigger: TRIGGER.MANUAL });
      expect(manualHistory.length).toBe(1);
      expect(manualHistory[0].trigger).toBe(TRIGGER.MANUAL);
    });
  });

  describe('getStats()', () => {
    it('should return statistics', () => {
      const stats = autoUpdate.getStats();

      expect(stats.totalUpdates).toBeDefined();
      expect(stats.successful).toBeDefined();
      expect(stats.failed).toBeDefined();
      expect(stats.rulesCount).toBeDefined();
      expect(stats.steeringFilesLoaded).toBeDefined();
    });
  });

  describe('clearHistory()', () => {
    it('should clear history', () => {
      autoUpdate.updates.set('test', { id: 'test' });
      autoUpdate.clearHistory();

      expect(autoUpdate.updates.size).toBe(0);
    });
  });

  describe('validateConsistency()', () => {
    it('should validate with empty steering', () => {
      const result = autoUpdate.validateConsistency();
      expect(result.valid).toBe(true);
      expect(result.issues).toBeInstanceOf(Array);
    });
  });

  describe('parseMarkdown()', () => {
    it('should parse markdown into sections', () => {
      const content = `# Header

Some content

## Section 1

Section 1 content

## Section 2

Section 2 content`;

      const parsed = autoUpdate.parseMarkdown(content);
      expect(parsed.size).toBeGreaterThan(0);
    });
  });
});

describe('createSteeringAutoUpdate()', () => {
  it('should create instance', () => {
    const instance = createSteeringAutoUpdate();
    expect(instance).toBeInstanceOf(SteeringAutoUpdate);
  });

  it('should accept options', () => {
    const instance = createSteeringAutoUpdate({ autoSave: false });
    expect(instance.autoSave).toBe(false);
  });
});

describe('TRIGGER enum', () => {
  it('should have all trigger types', () => {
    expect(TRIGGER.AGENT_WORK).toBe('agent-work');
    expect(TRIGGER.CODE_CHANGE).toBe('code-change');
    expect(TRIGGER.DEPENDENCY_UPDATE).toBe('dependency-update');
    expect(TRIGGER.CONFIG_CHANGE).toBe('config-change');
    expect(TRIGGER.MANUAL).toBe('manual');
    expect(TRIGGER.SCHEDULED).toBe('scheduled');
  });
});

describe('STEERING_TYPE enum', () => {
  it('should have all steering types', () => {
    expect(STEERING_TYPE.STRUCTURE).toBe('structure');
    expect(STEERING_TYPE.TECH).toBe('tech');
    expect(STEERING_TYPE.PRODUCT).toBe('product');
    expect(STEERING_TYPE.RULES).toBe('rules');
    expect(STEERING_TYPE.CUSTOM).toBe('custom');
  });
});

describe('DEFAULT_RULES', () => {
  it('should have default rules', () => {
    expect(DEFAULT_RULES).toBeInstanceOf(Array);
    expect(DEFAULT_RULES.length).toBeGreaterThan(0);
  });

  it('should have required rule properties', () => {
    for (const rule of DEFAULT_RULES) {
      expect(rule.id).toBeDefined();
      expect(rule.trigger).toBeDefined();
      expect(rule.target).toBeDefined();
      expect(typeof rule.condition).toBe('function');
      expect(typeof rule.update).toBe('function');
    }
  });
});
