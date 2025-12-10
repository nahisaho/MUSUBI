/**
 * Tests for Release Manager
 * @trace REQ-P5-003
 * @requirement REQ-P5-003 Release Automation
 */

const {
  Release,
  FeatureFlag,
  ReleaseManager,
  ReleaseState,
  ReleaseType,
  FeatureFlagStatus,
  createReleaseManager
} = require('../../src/monitoring/release-manager');

describe('Release Manager', () => {
  describe('Release', () => {
    let release;

    beforeEach(() => {
      release = new Release({
        version: '1.0.0',
        type: ReleaseType.MAJOR,
        name: 'Initial Release',
        description: 'First major release'
      });
    });

    test('should create release with default values', () => {
      expect(release.version).toBe('1.0.0');
      expect(release.type).toBe(ReleaseType.MAJOR);
      expect(release.name).toBe('Initial Release');
      expect(release.state).toBe(ReleaseState.PLANNING);
      expect(release.features).toEqual([]);
      expect(release.bugFixes).toEqual([]);
      expect(release.id).toBeDefined();
    });

    test('should transition through valid states', () => {
      release.transitionTo(ReleaseState.DEVELOPMENT);
      expect(release.state).toBe(ReleaseState.DEVELOPMENT);

      release.transitionTo(ReleaseState.TESTING);
      expect(release.state).toBe(ReleaseState.TESTING);

      release.transitionTo(ReleaseState.STAGING);
      expect(release.state).toBe(ReleaseState.STAGING);

      release.transitionTo(ReleaseState.PRODUCTION);
      expect(release.state).toBe(ReleaseState.PRODUCTION);

      release.transitionTo(ReleaseState.COMPLETED);
      expect(release.state).toBe(ReleaseState.COMPLETED);
      expect(release.completedAt).toBeDefined();
    });

    test('should reject invalid state transitions', () => {
      expect(() => {
        release.transitionTo(ReleaseState.PRODUCTION);
      }).toThrow('Invalid transition');
    });

    test('should add features to release', () => {
      release.addFeature({
        title: 'New Feature',
        description: 'Feature description',
        jiraId: 'PROJ-123'
      });

      expect(release.features).toHaveLength(1);
      expect(release.features[0].title).toBe('New Feature');
      expect(release.features[0].jiraId).toBe('PROJ-123');
    });

    test('should add bug fixes to release', () => {
      release.addBugFix({
        title: 'Fix issue',
        jiraId: 'BUG-456',
        severity: 'high'
      });

      expect(release.bugFixes).toHaveLength(1);
      expect(release.bugFixes[0].severity).toBe('high');
    });

    test('should track history', () => {
      release.transitionTo(ReleaseState.DEVELOPMENT);
      release.addFeature({ title: 'Feature 1' });

      expect(release.history.length).toBeGreaterThan(1);
      expect(release.history.some(h => h.action === 'transition')).toBe(true);
      expect(release.history.some(h => h.action === 'featureAdded')).toBe(true);
    });

    test('should generate markdown release notes', () => {
      release.addFeature({
        title: 'New Dashboard',
        description: 'Redesigned dashboard UI',
        jiraId: 'PROJ-100'
      });
      release.addBugFix({
        title: 'Fixed login issue',
        jiraId: 'BUG-200'
      });
      release.breakingChanges.push({
        title: 'API v1 deprecated',
        description: 'Use API v2 instead'
      });

      const notes = release.generateReleaseNotes('markdown');

      expect(notes).toContain('# Initial Release');
      expect(notes).toContain('**Version:** 1.0.0');
      expect(notes).toContain('## ✨ New Features');
      expect(notes).toContain('**New Dashboard**');
      expect(notes).toContain('## 🐛 Bug Fixes');
      expect(notes).toContain('Fixed login issue');
      expect(notes).toContain('## ⚠️ Breaking Changes');
      expect(notes).toContain('API v1 deprecated');
    });

    test('should generate JSON release notes', () => {
      release.addFeature({ title: 'Feature 1' });
      const notes = JSON.parse(release.generateReleaseNotes('json'));

      expect(notes.version).toBe('1.0.0');
      expect(notes.features).toHaveLength(1);
    });

    test('should serialize to JSON', () => {
      const json = release.toJSON();

      expect(json.id).toBe(release.id);
      expect(json.version).toBe('1.0.0');
      expect(json.type).toBe(ReleaseType.MAJOR);
      expect(json.state).toBe(ReleaseState.PLANNING);
    });

    test('should support rollback from production', () => {
      release.transitionTo(ReleaseState.DEVELOPMENT);
      release.transitionTo(ReleaseState.TESTING);
      release.transitionTo(ReleaseState.STAGING);
      release.transitionTo(ReleaseState.PRODUCTION);
      release.transitionTo(ReleaseState.ROLLBACK);

      expect(release.state).toBe(ReleaseState.ROLLBACK);
    });

    test('should support canary deployment', () => {
      release.transitionTo(ReleaseState.DEVELOPMENT);
      release.transitionTo(ReleaseState.TESTING);
      release.transitionTo(ReleaseState.STAGING);
      release.transitionTo(ReleaseState.CANARY);
      release.transitionTo(ReleaseState.PRODUCTION);

      expect(release.state).toBe(ReleaseState.PRODUCTION);
    });
  });

  describe('FeatureFlag', () => {
    let flag;

    beforeEach(() => {
      flag = new FeatureFlag({
        key: 'new-feature',
        name: 'New Feature',
        description: 'A new experimental feature'
      });
    });

    test('should create feature flag with default values', () => {
      expect(flag.key).toBe('new-feature');
      expect(flag.name).toBe('New Feature');
      expect(flag.status).toBe(FeatureFlagStatus.DISABLED);
      expect(flag.percentage).toBe(0);
    });

    test('should enable feature flag', () => {
      flag.enable();

      expect(flag.status).toBe(FeatureFlagStatus.ENABLED);
      expect(flag.percentage).toBe(100);
    });

    test('should disable feature flag', () => {
      flag.enable();
      flag.disable();

      expect(flag.status).toBe(FeatureFlagStatus.DISABLED);
      expect(flag.percentage).toBe(0);
    });

    test('should set percentage rollout', () => {
      flag.setPercentage(25);

      expect(flag.status).toBe(FeatureFlagStatus.PERCENTAGE);
      expect(flag.percentage).toBe(25);
    });

    test('should reject invalid percentage', () => {
      expect(() => flag.setPercentage(-1)).toThrow('Percentage must be between');
      expect(() => flag.setPercentage(101)).toThrow('Percentage must be between');
    });

    test('should check if enabled for user when flag is enabled', () => {
      flag.enable();

      expect(flag.isEnabledFor('user-1')).toBe(true);
      expect(flag.isEnabledFor('user-2')).toBe(true);
    });

    test('should check if enabled for user when flag is disabled', () => {
      expect(flag.isEnabledFor('user-1')).toBe(false);
    });

    test('should check if enabled for user in user list', () => {
      flag.status = FeatureFlagStatus.USER_LIST;
      flag.userList = ['user-1', 'user-3'];

      expect(flag.isEnabledFor('user-1')).toBe(true);
      expect(flag.isEnabledFor('user-2')).toBe(false);
      expect(flag.isEnabledFor('user-3')).toBe(true);
    });

    test('should provide consistent percentage rollout per user', () => {
      flag.setPercentage(50);

      // Same user should always get the same result
      const result1 = flag.isEnabledFor('consistent-user');
      const result2 = flag.isEnabledFor('consistent-user');
      expect(result1).toBe(result2);
    });

    test('should serialize to JSON', () => {
      const json = flag.toJSON();

      expect(json.key).toBe('new-feature');
      expect(json.name).toBe('New Feature');
      expect(json.status).toBe(FeatureFlagStatus.DISABLED);
    });
  });

  describe('ReleaseManager', () => {
    let manager;

    beforeEach(() => {
      manager = createReleaseManager();
    });

    test('should create release manager', () => {
      expect(manager).toBeInstanceOf(ReleaseManager);
    });

    test('should create and get release', () => {
      const release = manager.createRelease({
        version: '1.0.0',
        type: ReleaseType.MAJOR
      });

      expect(release.version).toBe('1.0.0');
      expect(manager.getRelease(release.id)).toBe(release);
    });

    test('should get release by version', () => {
      manager.createRelease({ version: '1.0.0' });
      manager.createRelease({ version: '2.0.0' });

      const release = manager.getReleaseByVersion('2.0.0');
      expect(release.version).toBe('2.0.0');
    });

    test('should list releases', () => {
      manager.createRelease({ version: '1.0.0', type: ReleaseType.MAJOR });
      manager.createRelease({ version: '1.1.0', type: ReleaseType.MINOR });
      manager.createRelease({ version: '1.1.1', type: ReleaseType.PATCH });

      const all = manager.listReleases();
      expect(all).toHaveLength(3);

      const minorOnly = manager.listReleases({ type: ReleaseType.MINOR });
      expect(minorOnly).toHaveLength(1);
    });

    test('should transition release', () => {
      const release = manager.createRelease({ version: '1.0.0' });
      
      manager.transitionRelease(release.id, ReleaseState.DEVELOPMENT);
      expect(release.state).toBe(ReleaseState.DEVELOPMENT);
    });

    test('should emit events on release creation', (done) => {
      manager.on('releaseCreated', (release) => {
        expect(release.version).toBe('1.0.0');
        done();
      });

      manager.createRelease({ version: '1.0.0' });
    });

    test('should emit events on release transition', (done) => {
      const release = manager.createRelease({ version: '1.0.0' });

      manager.on('releaseTransitioned', ({ release: r, newState }) => {
        expect(r.id).toBe(release.id);
        expect(newState).toBe(ReleaseState.DEVELOPMENT);
        done();
      });

      manager.transitionRelease(release.id, ReleaseState.DEVELOPMENT);
    });

    test('should create and get feature flag', () => {
      const flag = manager.createFeatureFlag({
        key: 'test-flag',
        name: 'Test Flag'
      });

      expect(flag.key).toBe('test-flag');
      expect(manager.getFeatureFlag('test-flag')).toBe(flag);
    });

    test('should list feature flags', () => {
      manager.createFeatureFlag({ key: 'flag-1' });
      manager.createFeatureFlag({ key: 'flag-2' });

      const flags = manager.listFeatureFlags();
      expect(flags).toHaveLength(2);
    });

    test('should check if feature is enabled', () => {
      manager.createFeatureFlag({ key: 'test-feature' });

      expect(manager.isFeatureEnabled('test-feature')).toBe(false);

      manager.enableFeatureFlag('test-feature');
      expect(manager.isFeatureEnabled('test-feature')).toBe(true);
    });

    test('should check if feature is enabled for specific user', () => {
      const flag = manager.createFeatureFlag({ key: 'user-feature' });
      flag.status = FeatureFlagStatus.USER_LIST;
      flag.userList = ['user-1'];

      expect(manager.isFeatureEnabled('user-feature', 'user-1')).toBe(true);
      expect(manager.isFeatureEnabled('user-feature', 'user-2')).toBe(false);
    });

    test('should enable feature flag', () => {
      manager.createFeatureFlag({ key: 'my-flag' });
      manager.enableFeatureFlag('my-flag');

      const flag = manager.getFeatureFlag('my-flag');
      expect(flag.status).toBe(FeatureFlagStatus.ENABLED);
    });

    test('should disable feature flag', () => {
      manager.createFeatureFlag({ key: 'my-flag' });
      manager.enableFeatureFlag('my-flag');
      manager.disableFeatureFlag('my-flag');

      const flag = manager.getFeatureFlag('my-flag');
      expect(flag.status).toBe(FeatureFlagStatus.DISABLED);
    });

    test('should set feature flag percentage', () => {
      manager.createFeatureFlag({ key: 'gradual-flag' });
      manager.setFeatureFlagPercentage('gradual-flag', 50);

      const flag = manager.getFeatureFlag('gradual-flag');
      expect(flag.status).toBe(FeatureFlagStatus.PERCENTAGE);
      expect(flag.percentage).toBe(50);
    });

    test('should emit events for feature flags', (done) => {
      let eventCount = 0;

      manager.on('featureFlagCreated', () => eventCount++);
      manager.on('featureFlagEnabled', () => eventCount++);
      manager.on('featureFlagDisabled', () => {
        expect(eventCount).toBe(2);
        done();
      });

      manager.createFeatureFlag({ key: 'event-flag' });
      manager.enableFeatureFlag('event-flag');
      manager.disableFeatureFlag('event-flag');
    });

    test('should generate rollback procedure', () => {
      const release = manager.createRelease({ version: '2.0.0' });

      const procedure = manager.generateRollbackProcedure(release.id);

      expect(procedure.releaseId).toBe(release.id);
      expect(procedure.version).toBe('2.0.0');
      expect(procedure.steps).toHaveLength(6);
      expect(procedure.steps[0].action).toBe('notify');
      expect(procedure.steps[3].action).toBe('traffic-shift');
      expect(procedure.automaticTriggers).toBeDefined();
    });

    test('should get summary statistics', () => {
      manager.createRelease({ version: '1.0.0', type: ReleaseType.MAJOR });
      manager.createRelease({ version: '1.1.0', type: ReleaseType.MINOR });

      const release = manager.createRelease({ version: '1.1.1', type: ReleaseType.PATCH });
      manager.transitionRelease(release.id, ReleaseState.DEVELOPMENT);

      manager.createFeatureFlag({ key: 'enabled-flag' });
      manager.enableFeatureFlag('enabled-flag');
      manager.createFeatureFlag({ key: 'disabled-flag' });
      manager.createFeatureFlag({ key: 'pct-flag' });
      manager.setFeatureFlagPercentage('pct-flag', 25);

      const summary = manager.getSummary();

      expect(summary.totalReleases).toBe(3);
      expect(summary.releasesByType[ReleaseType.MAJOR]).toBe(1);
      expect(summary.releasesByType[ReleaseType.MINOR]).toBe(1);
      expect(summary.releasesByState[ReleaseState.PLANNING]).toBe(2);
      expect(summary.releasesByState[ReleaseState.DEVELOPMENT]).toBe(1);
      expect(summary.totalFeatureFlags).toBe(3);
      expect(summary.enabledFlags).toBe(1);
      expect(summary.disabledFlags).toBe(1);
      expect(summary.percentageFlags).toBe(1);
    });

    test('should throw when release not found', () => {
      expect(() => {
        manager.transitionRelease('non-existent', ReleaseState.DEVELOPMENT);
      }).toThrow('Release not found');

      expect(() => {
        manager.generateRollbackProcedure('non-existent');
      }).toThrow('Release not found');
    });

    test('should throw when feature flag not found', () => {
      expect(() => {
        manager.enableFeatureFlag('non-existent');
      }).toThrow('Feature flag not found');

      expect(() => {
        manager.disableFeatureFlag('non-existent');
      }).toThrow('Feature flag not found');

      expect(() => {
        manager.setFeatureFlagPercentage('non-existent', 50);
      }).toThrow('Feature flag not found');
    });
  });

  describe('Constants', () => {
    test('should export ReleaseState constants', () => {
      expect(ReleaseState.PLANNING).toBe('planning');
      expect(ReleaseState.DEVELOPMENT).toBe('development');
      expect(ReleaseState.TESTING).toBe('testing');
      expect(ReleaseState.STAGING).toBe('staging');
      expect(ReleaseState.CANARY).toBe('canary');
      expect(ReleaseState.PRODUCTION).toBe('production');
      expect(ReleaseState.ROLLBACK).toBe('rollback');
      expect(ReleaseState.COMPLETED).toBe('completed');
      expect(ReleaseState.CANCELLED).toBe('cancelled');
    });

    test('should export ReleaseType constants', () => {
      expect(ReleaseType.MAJOR).toBe('major');
      expect(ReleaseType.MINOR).toBe('minor');
      expect(ReleaseType.PATCH).toBe('patch');
      expect(ReleaseType.HOTFIX).toBe('hotfix');
      expect(ReleaseType.CANARY).toBe('canary');
    });

    test('should export FeatureFlagStatus constants', () => {
      expect(FeatureFlagStatus.ENABLED).toBe('enabled');
      expect(FeatureFlagStatus.DISABLED).toBe('disabled');
      expect(FeatureFlagStatus.PERCENTAGE).toBe('percentage');
      expect(FeatureFlagStatus.USER_LIST).toBe('user-list');
    });
  });
});
