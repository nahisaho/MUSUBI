/**
 * Quality Dashboard Tests
 */

const {
  QualityDashboard,
  createQualityDashboard,
  METRIC_CATEGORY,
  HEALTH_STATUS,
  CONSTITUTIONAL_ARTICLES
} = require('../../src/monitoring/quality-dashboard');

describe('QualityDashboard', () => {
  describe('constructor', () => {
    test('should create with default options', () => {
      const dashboard = new QualityDashboard();
      expect(dashboard.thresholds).toBeDefined();
      expect(dashboard.autoCollect).toBe(false);
      expect(dashboard.collectors.size).toBeGreaterThan(0);
    });

    test('should accept custom thresholds', () => {
      const dashboard = new QualityDashboard({
        thresholds: {
          coverage: { healthy: 90, warning: 60, critical: 30 }
        }
      });
      expect(dashboard.thresholds.coverage.healthy).toBe(90);
    });

    test('should not auto-collect by default', () => {
      const dashboard = new QualityDashboard();
      expect(dashboard.intervalId).toBeNull();
    });
  });

  describe('registerCollector()', () => {
    test('should register a collector', () => {
      const dashboard = new QualityDashboard();
      dashboard.registerCollector('custom', async () => ({ value: 100 }));
      expect(dashboard.collectors.has('custom')).toBe(true);
    });

    test('should throw on non-function collector', () => {
      const dashboard = new QualityDashboard();
      expect(() => dashboard.registerCollector('bad', 'not a function'))
        .toThrow('Collector must be a function');
    });
  });

  describe('unregisterCollector()', () => {
    test('should unregister a collector', () => {
      const dashboard = new QualityDashboard();
      dashboard.registerCollector('custom', async () => ({}));
      dashboard.unregisterCollector('custom');
      expect(dashboard.collectors.has('custom')).toBe(false);
    });
  });

  describe('collect()', () => {
    test('should collect metrics from all collectors', async () => {
      const dashboard = new QualityDashboard();
      const context = {
        coverage: { lines: 85, branches: 70, functions: 90, statements: 80 },
        quality: { complexity: 75, maintainability: 80, documentation: 60, testQuality: 85 }
      };

      const results = await dashboard.collect(context);
      expect(results.coverage).toBeDefined();
      expect(results.quality).toBeDefined();
    });

    test('should emit collected event', async () => {
      const dashboard = new QualityDashboard();
      const handler = jest.fn();
      dashboard.on('collected', handler);

      await dashboard.collect({});
      expect(handler).toHaveBeenCalled();
    });

    test('should store in history', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({});
      expect(dashboard.history.length).toBe(1);
    });

    test('should handle collector errors', async () => {
      const dashboard = new QualityDashboard();
      dashboard.registerCollector('failing', async () => {
        throw new Error('Test error');
      });

      const results = await dashboard.collect({});
      expect(results.failing.error).toBe('Test error');
    });
  });

  describe('getMetric()', () => {
    test('should return collected metric', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({
        coverage: { lines: 85, branches: 70, functions: 90, statements: 80 }
      });

      const metric = dashboard.getMetric('coverage');
      expect(metric).toBeDefined();
      expect(metric.lines).toBe(85);
    });

    test('should return null for unknown metric', () => {
      const dashboard = new QualityDashboard();
      expect(dashboard.getMetric('unknown')).toBeNull();
    });
  });

  describe('getAllMetrics()', () => {
    test('should return all metrics', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({ coverage: { lines: 80 } });

      const all = dashboard.getAllMetrics();
      expect(Object.keys(all).length).toBeGreaterThan(0);
    });
  });

  describe('calculateStatus()', () => {
    let dashboard;

    beforeEach(() => {
      dashboard = new QualityDashboard();
    });

    test('should return healthy for high scores', () => {
      expect(dashboard.calculateStatus(90)).toBe(HEALTH_STATUS.HEALTHY);
    });

    test('should return warning for medium scores', () => {
      expect(dashboard.calculateStatus(65)).toBe(HEALTH_STATUS.WARNING);
    });

    test('should return critical for low scores', () => {
      expect(dashboard.calculateStatus(45)).toBe(HEALTH_STATUS.CRITICAL);
    });

    test('should return failing for very low scores', () => {
      expect(dashboard.calculateStatus(10)).toBe(HEALTH_STATUS.FAILING);
    });
  });

  describe('getHealthSummary()', () => {
    test('should return health summary', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({
        coverage: { lines: 85, branches: 70, functions: 90, statements: 80, overall: 81 },
        quality: { complexity: 75, maintainability: 80, documentation: 60, testQuality: 85, overall: 75 }
      });

      const summary = dashboard.getHealthSummary();
      expect(summary.status).toBeDefined();
      expect(summary.breakdown.coverage).toBeDefined();
      expect(summary.breakdown.constitutional).toBeDefined();
      expect(summary.breakdown.quality).toBeDefined();
    });

    test('should handle empty metrics', () => {
      const dashboard = new QualityDashboard();
      const summary = dashboard.getHealthSummary();
      expect(summary.status).toBe(HEALTH_STATUS.FAILING);
      expect(summary.overall).toBe(0);
    });
  });

  describe('getTrend()', () => {
    test('should return trend data', async () => {
      const dashboard = new QualityDashboard();

      // Collect multiple times
      await dashboard.collect({ coverage: { overall: 60 } });
      await dashboard.collect({ coverage: { overall: 70 } });
      await dashboard.collect({ coverage: { overall: 80 } });

      const trend = dashboard.getTrend('coverage');
      expect(trend.data.length).toBe(3);
      expect(trend.trend).toBe('improving');
      expect(trend.change).toBeGreaterThan(0);
    });

    test('should detect declining trend', async () => {
      const dashboard = new QualityDashboard();

      await dashboard.collect({ coverage: { overall: 80 } });
      await dashboard.collect({ coverage: { overall: 70 } });
      await dashboard.collect({ coverage: { overall: 60 } });

      const trend = dashboard.getTrend('coverage');
      expect(trend.trend).toBe('declining');
    });

    test('should detect stable trend', async () => {
      const dashboard = new QualityDashboard();

      await dashboard.collect({ coverage: { overall: 75 } });
      await dashboard.collect({ coverage: { overall: 76 } });

      const trend = dashboard.getTrend('coverage');
      expect(trend.trend).toBe('stable');
    });

    test('should return stable for insufficient data', () => {
      const dashboard = new QualityDashboard();
      const trend = dashboard.getTrend('coverage');
      expect(trend.trend).toBe('stable');
      expect(trend.data.length).toBe(0);
    });
  });

  describe('getHistory()', () => {
    test('should return all history', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({});
      await dashboard.collect({});

      expect(dashboard.getHistory().length).toBe(2);
    });

    test('should filter by limit', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({});
      await dashboard.collect({});
      await dashboard.collect({});

      const history = dashboard.getHistory({ limit: 2 });
      expect(history.length).toBe(2);
    });
  });

  describe('exportReport()', () => {
    test('should generate markdown report', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({
        coverage: { lines: 85, branches: 70, functions: 90, statements: 80, overall: 81 },
        quality: { complexity: 75, maintainability: 80, documentation: 60, testQuality: 85, overall: 75 }
      });

      const report = dashboard.exportReport();
      expect(report).toContain('# Quality Dashboard Report');
      expect(report).toContain('Overall Health');
      expect(report).toContain('Coverage');
      expect(report).toContain('Quality');
    });

    test('should include coverage details', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({
        coverage: { lines: 85, branches: 70, functions: 90, statements: 80 }
      });

      const report = dashboard.exportReport();
      expect(report).toContain('Lines');
      expect(report).toContain('Branches');
    });
  });

  describe('auto-collection', () => {
    test('should start auto-collection', () => {
      const dashboard = new QualityDashboard();
      dashboard.startAutoCollection();
      expect(dashboard.intervalId).not.toBeNull();
      dashboard.stopAutoCollection();
    });

    test('should stop auto-collection', () => {
      const dashboard = new QualityDashboard();
      dashboard.startAutoCollection();
      dashboard.stopAutoCollection();
      expect(dashboard.intervalId).toBeNull();
    });

    test('should not start twice', () => {
      const dashboard = new QualityDashboard();
      dashboard.startAutoCollection();
      const id = dashboard.intervalId;
      dashboard.startAutoCollection();
      expect(dashboard.intervalId).toBe(id);
      dashboard.stopAutoCollection();
    });
  });

  describe('clear()', () => {
    test('should clear all data', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({});
      dashboard.clear();

      expect(dashboard.metrics.size).toBe(0);
      expect(dashboard.history.length).toBe(0);
    });

    test('should emit cleared event', () => {
      const dashboard = new QualityDashboard();
      const handler = jest.fn();
      dashboard.on('cleared', handler);
      dashboard.clear();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('setThresholds()', () => {
    test('should update thresholds', () => {
      const dashboard = new QualityDashboard();
      dashboard.setThresholds('coverage', { healthy: 95 });
      expect(dashboard.thresholds.coverage.healthy).toBe(95);
    });

    test('should merge with existing thresholds', () => {
      const dashboard = new QualityDashboard();
      const originalWarning = dashboard.thresholds.coverage.warning;
      dashboard.setThresholds('coverage', { healthy: 95 });
      expect(dashboard.thresholds.coverage.warning).toBe(originalWarning);
    });
  });

  describe('getStats()', () => {
    test('should return statistics', async () => {
      const dashboard = new QualityDashboard();
      await dashboard.collect({});

      const stats = dashboard.getStats();
      expect(stats.metricsCount).toBeGreaterThan(0);
      expect(stats.collectorsCount).toBeGreaterThan(0);
      expect(stats.historyCount).toBe(1);
      expect(stats.autoCollecting).toBe(false);
    });
  });
});

describe('createQualityDashboard()', () => {
  test('should create instance', () => {
    const dashboard = createQualityDashboard();
    expect(dashboard).toBeInstanceOf(QualityDashboard);
  });

  test('should accept options', () => {
    const dashboard = createQualityDashboard({
      thresholds: { coverage: { healthy: 90 } }
    });
    expect(dashboard.thresholds.coverage.healthy).toBe(90);
  });
});

describe('METRIC_CATEGORY', () => {
  test('should have all categories', () => {
    expect(METRIC_CATEGORY.COVERAGE).toBe('coverage');
    expect(METRIC_CATEGORY.CONSTITUTIONAL).toBe('constitutional');
    expect(METRIC_CATEGORY.QUALITY).toBe('quality');
    expect(METRIC_CATEGORY.HEALTH).toBe('health');
    expect(METRIC_CATEGORY.PERFORMANCE).toBe('performance');
    expect(METRIC_CATEGORY.CUSTOM).toBe('custom');
  });
});

describe('HEALTH_STATUS', () => {
  test('should have all status levels', () => {
    expect(HEALTH_STATUS.HEALTHY).toBe('healthy');
    expect(HEALTH_STATUS.WARNING).toBe('warning');
    expect(HEALTH_STATUS.CRITICAL).toBe('critical');
    expect(HEALTH_STATUS.FAILING).toBe('failing');
  });
});

describe('CONSTITUTIONAL_ARTICLES', () => {
  test('should have all 9 articles', () => {
    expect(Object.keys(CONSTITUTIONAL_ARTICLES).length).toBe(9);
    expect(CONSTITUTIONAL_ARTICLES.SINGLE_SOURCE_OF_TRUTH).toBe('article-1');
    expect(CONSTITUTIONAL_ARTICLES.GOVERNANCE).toBe('article-9');
  });
});
