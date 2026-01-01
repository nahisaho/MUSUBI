/**
 * Coverage Reporter Tests
 */

const path = require('path');
const fs = require('fs-extra');
const { CoverageReporter, ReportFormat } = require('../../src/reporters/coverage-report.js');

describe('CoverageReporter', () => {
  let testDir;

  beforeAll(async () => {
    testDir = path.join(__dirname, '../test-output/coverage-reporter');
    await fs.ensureDir(testDir);

    // Create minimal test structure
    await fs.ensureDir(path.join(testDir, 'storage/specs'));
    await fs.ensureDir(path.join(testDir, 'storage/design'));
    await fs.ensureDir(path.join(testDir, 'storage/tasks'));
    await fs.ensureDir(path.join(testDir, 'src'));
    await fs.ensureDir(path.join(testDir, 'tests'));
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  describe('constructor', () => {
    it('should create reporter with default options', () => {
      const reporter = new CoverageReporter('/test');
      expect(reporter.workspaceRoot).toBe('/test');
      expect(reporter.options.format).toBe(ReportFormat.MARKDOWN);
      expect(reporter.options.includeDetails).toBe(true);
      expect(reporter.options.includeGaps).toBe(true);
    });

    it('should accept custom options', () => {
      const reporter = new CoverageReporter('/test', {
        format: ReportFormat.HTML,
        includeDetails: false,
      });
      expect(reporter.options.format).toBe(ReportFormat.HTML);
      expect(reporter.options.includeDetails).toBe(false);
    });
  });

  describe('generate', () => {
    it('should generate markdown report by default', async () => {
      const reporter = new CoverageReporter(testDir);
      const report = await reporter.generate();

      expect(typeof report).toBe('string');
      expect(report).toContain('# Traceability Coverage Report');
    });

    it('should generate JSON report', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.JSON });
      const report = await reporter.generate();

      const parsed = JSON.parse(report);
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.coverage).toBeDefined();
    });

    it('should generate HTML report', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.HTML });
      const report = await reporter.generate();

      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('Traceability Coverage Report');
    });

    it('should generate text report', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.TEXT });
      const report = await reporter.generate();

      expect(report).toContain('TRACEABILITY COVERAGE REPORT');
      expect(report).toContain('COVERAGE SUMMARY');
    });
  });

  describe('formatBar', () => {
    it('should format progress bar', () => {
      const reporter = new CoverageReporter('/test');

      expect(reporter.formatBar(100, 10)).toBe('[██████████]');
      expect(reporter.formatBar(50, 10)).toBe('[█████░░░░░]');
      expect(reporter.formatBar(0, 10)).toBe('[░░░░░░░░░░]');
    });
  });

  describe('formatProgressBar', () => {
    it('should return green for high coverage', () => {
      const reporter = new CoverageReporter('/test');
      expect(reporter.formatProgressBar(80)).toBe('🟢');
      expect(reporter.formatProgressBar(100)).toBe('🟢');
    });

    it('should return yellow for medium coverage', () => {
      const reporter = new CoverageReporter('/test');
      expect(reporter.formatProgressBar(60)).toBe('🟡');
      expect(reporter.formatProgressBar(79)).toBe('🟡');
    });

    it('should return red for low coverage', () => {
      const reporter = new CoverageReporter('/test');
      expect(reporter.formatProgressBar(59)).toBe('🔴');
      expect(reporter.formatProgressBar(0)).toBe('🔴');
    });
  });

  describe('formatMarkdown', () => {
    it('should include coverage table', async () => {
      const reporter = new CoverageReporter(testDir);
      const report = await reporter.generate();

      expect(report).toContain('## Coverage Summary');
      expect(report).toContain('| Category | Covered | Total | Coverage |');
    });

    it('should include gaps analysis when enabled', async () => {
      const reporter = new CoverageReporter(testDir, { includeGaps: true });
      const report = await reporter.generate();

      expect(report).toContain('## Gaps Analysis');
    });

    it('should include recommendations', async () => {
      const reporter = new CoverageReporter(testDir);
      const report = await reporter.generate();

      expect(report).toContain('## Recommendations');
    });
  });

  describe('formatHTML', () => {
    it('should include proper HTML structure', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.HTML });
      const report = await reporter.generate();

      expect(report).toContain('<html');
      expect(report).toContain('<head>');
      expect(report).toContain('<body>');
      expect(report).toContain('</html>');
    });

    it('should include CSS styles', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.HTML });
      const report = await reporter.generate();

      expect(report).toContain('<style>');
      expect(report).toContain('.progress');
    });

    it('should include progress bars', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.HTML });
      const report = await reporter.generate();

      expect(report).toContain('progress-bar');
    });
  });

  describe('formatText', () => {
    it('should include coverage summary', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.TEXT });
      const report = await reporter.generate();

      expect(report).toContain('Design Coverage:');
      expect(report).toContain('Test Coverage:');
    });

    it('should include statistics', async () => {
      const reporter = new CoverageReporter(testDir, { format: ReportFormat.TEXT });
      const report = await reporter.generate();

      expect(report).toContain('STATISTICS');
    });
  });

  describe('saveReport', () => {
    it('should save report to file', async () => {
      const reporter = new CoverageReporter(testDir);
      const outputPath = path.join(testDir, 'output', 'report.md');

      await reporter.saveReport(outputPath);

      expect(await fs.pathExists(outputPath)).toBe(true);

      const content = await fs.readFile(outputPath, 'utf-8');
      expect(content).toContain('# Traceability Coverage Report');
    });

    it('should create output directory if not exists', async () => {
      const reporter = new CoverageReporter(testDir);
      const outputPath = path.join(testDir, 'new-output-dir', 'report.md');

      await reporter.saveReport(outputPath);

      expect(await fs.pathExists(outputPath)).toBe(true);
    });
  });
});

describe('ReportFormat', () => {
  it('should have all expected formats', () => {
    expect(ReportFormat.TEXT).toBe('text');
    expect(ReportFormat.JSON).toBe('json');
    expect(ReportFormat.MARKDOWN).toBe('markdown');
    expect(ReportFormat.HTML).toBe('html');
  });
});
