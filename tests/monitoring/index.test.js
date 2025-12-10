/**
 * Tests for Monitoring Module (index.js)
 */

const monitoring = require('../../src/monitoring');

describe('Monitoring Module', () => {
  describe('Core Classes', () => {
    test('should export SLI class', () => {
      const sli = new monitoring.SLI({
        name: 'test-sli',
        type: monitoring.SLOType.AVAILABILITY,
      });
      expect(sli.name).toBe('test-sli');
    });

    test('should export SLO class', () => {
      const sli = new monitoring.SLI({ name: 'test-sli' });
      const slo = new monitoring.SLO({
        name: 'test-slo',
        sli,
        target: 0.99,
      });
      expect(slo.name).toBe('test-slo');
      expect(slo.target).toBe(0.99);
    });

    test('should export AlertRule class', () => {
      const rule = new monitoring.AlertRule({
        name: 'test-alert',
        expr: 'up == 0',
        severity: monitoring.AlertSeverity.CRITICAL,
      });
      expect(rule.name).toBe('test-alert');
    });

    test('should export HealthCheck class', () => {
      const check = new monitoring.HealthCheck({
        name: 'test-health',
        endpoint: '/health',
      });
      expect(check.name).toBe('test-health');
    });

    test('should export MonitoringConfig class', () => {
      const config = new monitoring.MonitoringConfig({
        serviceName: 'test-service',
      });
      expect(config.serviceName).toBe('test-service');
    });
  });

  describe('Constants', () => {
    test('should export SLOType constants', () => {
      expect(monitoring.SLOType.AVAILABILITY).toBe('availability');
      expect(monitoring.SLOType.LATENCY).toBe('latency');
      expect(monitoring.SLOType.THROUGHPUT).toBe('throughput');
      expect(monitoring.SLOType.ERROR_RATE).toBe('error-rate');
    });

    test('should export AlertSeverity constants', () => {
      expect(monitoring.AlertSeverity.CRITICAL).toBe('critical');
      expect(monitoring.AlertSeverity.WARNING).toBe('warning');
      expect(monitoring.AlertSeverity.INFO).toBe('info');
    });

    test('should export MetricType constants', () => {
      expect(monitoring.MetricType.COUNTER).toBe('counter');
      expect(monitoring.MetricType.GAUGE).toBe('gauge');
      expect(monitoring.MetricType.HISTOGRAM).toBe('histogram');
    });
  });

  describe('Templates', () => {
    test('should export SLOTemplates', () => {
      expect(monitoring.SLOTemplates).toBeDefined();
      expect(typeof monitoring.SLOTemplates.API_AVAILABILITY).toBe('function');
      expect(typeof monitoring.SLOTemplates.API_LATENCY).toBe('function');
    });

    test('should export AlertTemplates', () => {
      expect(monitoring.AlertTemplates).toBeDefined();
      expect(typeof monitoring.AlertTemplates.HIGH_ERROR_RATE).toBe('function');
      expect(typeof monitoring.AlertTemplates.HIGH_LATENCY).toBe('function');
      expect(typeof monitoring.AlertTemplates.HIGH_MEMORY).toBe('function');
    });
  });

  describe('Factory Functions', () => {
    test('should export createMonitoringConfig', () => {
      const config = monitoring.createMonitoringConfig({
        serviceName: 'my-service',
      });
      expect(config).toBeInstanceOf(monitoring.MonitoringConfig);
    });
  });

  describe('Release Manager Integration', () => {
    test('should export Release class', () => {
      const release = new monitoring.Release({
        version: '1.0.0',
      });
      expect(release.version).toBe('1.0.0');
    });

    test('should export FeatureFlag class', () => {
      const flag = new monitoring.FeatureFlag({
        key: 'test-flag',
      });
      expect(flag.key).toBe('test-flag');
    });

    test('should export ReleaseManager class', () => {
      const manager = new monitoring.ReleaseManager();
      expect(manager).toBeInstanceOf(monitoring.ReleaseManager);
    });

    test('should export createReleaseManager factory', () => {
      const manager = monitoring.createReleaseManager();
      expect(manager).toBeInstanceOf(monitoring.ReleaseManager);
    });

    test('should export ReleaseState constants', () => {
      expect(monitoring.ReleaseState.PLANNING).toBe('planning');
      expect(monitoring.ReleaseState.PRODUCTION).toBe('production');
    });

    test('should export ReleaseType constants', () => {
      expect(monitoring.ReleaseType.MAJOR).toBe('major');
      expect(monitoring.ReleaseType.MINOR).toBe('minor');
    });

    test('should export FeatureFlagStatus constants', () => {
      expect(monitoring.FeatureFlagStatus.ENABLED).toBe('enabled');
      expect(monitoring.FeatureFlagStatus.DISABLED).toBe('disabled');
    });
  });

  describe('Incident Manager Integration', () => {
    test('should export Incident class', () => {
      const incident = new monitoring.Incident({
        title: 'Test Incident',
      });
      expect(incident.title).toBe('Test Incident');
    });

    test('should export Runbook class', () => {
      const runbook = new monitoring.Runbook({
        name: 'Test Runbook',
      });
      expect(runbook.name).toBe('Test Runbook');
    });

    test('should export RunbookExecution class', () => {
      const runbook = new monitoring.Runbook({ name: 'Test', steps: [] });
      const execution = new monitoring.RunbookExecution(runbook);
      expect(execution.status).toBe('running');
    });

    test('should export PostMortem class', () => {
      const incident = new monitoring.Incident({ title: 'Test' });
      const pm = new monitoring.PostMortem(incident);
      expect(pm.incidentId).toBe(incident.id);
    });

    test('should export IncidentManager class', () => {
      const manager = new monitoring.IncidentManager();
      expect(manager).toBeInstanceOf(monitoring.IncidentManager);
    });

    test('should export createIncidentManager factory', () => {
      const manager = monitoring.createIncidentManager();
      expect(manager).toBeInstanceOf(monitoring.IncidentManager);
    });

    test('should export IncidentSeverity constants', () => {
      expect(monitoring.IncidentSeverity.SEV1).toBe('sev1');
      expect(monitoring.IncidentSeverity.SEV2).toBe('sev2');
    });

    test('should export IncidentStatus constants', () => {
      expect(monitoring.IncidentStatus.DETECTED).toBe('detected');
      expect(monitoring.IncidentStatus.RESOLVED).toBe('resolved');
    });

    test('should export StepStatus constants', () => {
      expect(monitoring.StepStatus.PENDING).toBe('pending');
      expect(monitoring.StepStatus.COMPLETED).toBe('completed');
    });
  });

  describe('Integration Scenarios', () => {
    test('should create monitoring config with SLOs', () => {
      const config = monitoring.createMonitoringConfig({
        serviceName: 'api-gateway',
      });

      const slo = monitoring.SLOTemplates.API_AVAILABILITY(0.999);
      config.defineSLO(slo);

      expect(config.slos.size).toBe(1);
    });

    test('should create release with feature flags', () => {
      const manager = monitoring.createReleaseManager();

      const release = manager.createRelease({
        version: '2.0.0',
        type: monitoring.ReleaseType.MAJOR,
      });

      const flag = manager.createFeatureFlag({
        key: 'new-ui',
      });

      expect(release.version).toBe('2.0.0');
      expect(flag.key).toBe('new-ui');
    });

    test('should manage incident lifecycle', () => {
      const incidentManager = monitoring.createIncidentManager();

      const incident = incidentManager.createIncident({
        title: 'Service Down',
        severity: monitoring.IncidentSeverity.SEV1,
      });

      incidentManager.acknowledgeIncident(incident.id, 'alice');
      incidentManager.resolveIncident(incident.id, 'Restarted service');

      expect(incident.status).toBe(monitoring.IncidentStatus.RESOLVED);
    });

    test('should create post-mortem from incident', () => {
      const manager = monitoring.createIncidentManager();

      const incident = manager.createIncident({
        title: 'Database Outage',
        severity: monitoring.IncidentSeverity.SEV1,
      });
      incident.acknowledge('alice');
      incident.setResolution('Increased connection pool');

      const pm = manager.createPostMortem(incident.id);
      pm.addActionItem({ title: 'Add monitoring' });

      expect(pm.actionItems).toHaveLength(1);
    });
  });
});
