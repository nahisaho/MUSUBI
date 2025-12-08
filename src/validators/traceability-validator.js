/**
 * MUSUBI Traceability Validator
 *
 * Validates complete traceability chain from requirements to tests
 * Implements Constitutional Article V: Complete Traceability
 * Designed for CI/CD integration with configurable strictness
 */

const fs = require('fs-extra');
const path = require('path');
const TraceabilityAnalyzer = require('../analyzers/traceability.js');

/**
 * Validation severity levels
 */
const Severity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Validation rule types
 */
const RuleType = {
  REQUIREMENT_HAS_DESIGN: 'requirement-has-design',
  REQUIREMENT_HAS_TASKS: 'requirement-has-tasks',
  REQUIREMENT_HAS_CODE: 'requirement-has-code',
  REQUIREMENT_HAS_TESTS: 'requirement-has-tests',
  DESIGN_HAS_REQUIREMENT: 'design-has-requirement',
  TASK_HAS_REQUIREMENT: 'task-has-requirement',
  CODE_HAS_TESTS: 'code-has-tests',
  NO_ORPHANED_ITEMS: 'no-orphaned-items',
  MINIMUM_COVERAGE: 'minimum-coverage',
  BIDIRECTIONAL_LINKS: 'bidirectional-links',
};

/**
 * Default validation configuration
 */
const defaultConfig = {
  // Strictness level: 'strict', 'standard', 'relaxed'
  strictness: 'standard',
  
  // Minimum coverage thresholds
  thresholds: {
    design: 80,
    tasks: 80,
    code: 80,
    tests: 80,
    overall: 80,
  },
  
  // Rules to enforce
  rules: {
    [RuleType.REQUIREMENT_HAS_DESIGN]: { enabled: true, severity: Severity.WARNING },
    [RuleType.REQUIREMENT_HAS_TASKS]: { enabled: true, severity: Severity.WARNING },
    [RuleType.REQUIREMENT_HAS_CODE]: { enabled: true, severity: Severity.ERROR },
    [RuleType.REQUIREMENT_HAS_TESTS]: { enabled: true, severity: Severity.ERROR },
    [RuleType.DESIGN_HAS_REQUIREMENT]: { enabled: true, severity: Severity.WARNING },
    [RuleType.TASK_HAS_REQUIREMENT]: { enabled: true, severity: Severity.WARNING },
    [RuleType.CODE_HAS_TESTS]: { enabled: true, severity: Severity.WARNING },
    [RuleType.NO_ORPHANED_ITEMS]: { enabled: true, severity: Severity.WARNING },
    [RuleType.MINIMUM_COVERAGE]: { enabled: true, severity: Severity.ERROR },
    [RuleType.BIDIRECTIONAL_LINKS]: { enabled: false, severity: Severity.INFO },
  },
  
  // Paths configuration
  paths: {
    requirements: 'docs/requirements',
    design: 'docs/design',
    tasks: 'docs/tasks',
    code: 'src',
    tests: 'tests',
  },
  
  // File patterns to exclude
  exclude: [
    '**/node_modules/**',
    '**/.git/**',
    '**/coverage/**',
  ],
};

/**
 * TraceabilityValidator - Validates traceability chain
 */
class TraceabilityValidator {
  constructor(workspaceRoot, config = {}) {
    this.workspaceRoot = workspaceRoot;
    this.config = this.mergeConfig(defaultConfig, config);
    this.analyzer = new TraceabilityAnalyzer(workspaceRoot);
  }

  /**
   * Merge configuration with defaults
   */
  mergeConfig(defaults, overrides) {
    // Deep copy rules to avoid mutating defaults
    const mergedRules = {};
    Object.keys(defaults.rules).forEach(key => {
      mergedRules[key] = { ...defaults.rules[key] };
    });
    if (overrides.rules) {
      Object.keys(overrides.rules).forEach(key => {
        mergedRules[key] = { ...mergedRules[key], ...overrides.rules[key] };
      });
    }

    return {
      ...defaults,
      ...overrides,
      thresholds: { ...defaults.thresholds, ...overrides.thresholds },
      rules: mergedRules,
      paths: { ...defaults.paths, ...overrides.paths },
    };
  }

  /**
   * Apply strictness preset
   */
  applyStrictness(level) {
    switch (level) {
      case 'strict':
        // All rules enabled with ERROR severity
        Object.keys(this.config.rules).forEach(rule => {
          this.config.rules[rule].enabled = true;
          this.config.rules[rule].severity = Severity.ERROR;
        });
        this.config.thresholds = {
          design: 100,
          tasks: 100,
          code: 100,
          tests: 100,
          overall: 100,
        };
        break;

      case 'relaxed':
        // Minimum rules with WARNING severity
        Object.keys(this.config.rules).forEach(rule => {
          this.config.rules[rule].severity = Severity.WARNING;
        });
        this.config.rules[RuleType.BIDIRECTIONAL_LINKS].enabled = false;
        this.config.thresholds = {
          design: 50,
          tasks: 50,
          code: 60,
          tests: 60,
          overall: 60,
        };
        break;

      default: // 'standard'
        // Keep defaults
        break;
    }
  }

  /**
   * Validate traceability chain
   * @returns {Object} Validation result with violations
   */
  async validate() {
    // Apply strictness if specified
    if (this.config.strictness) {
      this.applyStrictness(this.config.strictness);
    }

    const result = {
      valid: true,
      timestamp: new Date().toISOString(),
      strictness: this.config.strictness,
      violations: [],
      warnings: [],
      infos: [],
      summary: {
        total: 0,
        errors: 0,
        warnings: 0,
        infos: 0,
      },
      coverage: null,
      gaps: null,
    };

    try {
      // Get coverage and gaps from analyzer
      const coverage = await this.analyzer.calculateCoverage(this.config.paths);
      const gaps = await this.analyzer.detectGaps(this.config.paths);

      result.coverage = coverage;
      result.gaps = gaps;

      // Run all enabled rules
      await this.runRules(result, coverage, gaps);

      // Update summary
      result.summary.total = result.violations.length + result.warnings.length + result.infos.length;
      result.summary.errors = result.violations.length;
      result.summary.warnings = result.warnings.length;
      result.summary.infos = result.infos.length;

      // Determine overall validity
      result.valid = result.violations.length === 0;

    } catch (error) {
      result.valid = false;
      result.violations.push({
        rule: 'validation-error',
        severity: Severity.ERROR,
        message: `Validation failed: ${error.message}`,
        location: null,
      });
      result.summary.errors = 1;
      result.summary.total = 1;
    }

    return result;
  }

  /**
   * Run all enabled validation rules
   */
  async runRules(result, coverage, gaps) {
    // Check minimum coverage thresholds
    if (this.isRuleEnabled(RuleType.MINIMUM_COVERAGE)) {
      this.checkCoverageThresholds(result, coverage);
    }

    // Check for orphaned requirements
    if (this.isRuleEnabled(RuleType.NO_ORPHANED_ITEMS)) {
      this.checkOrphanedItems(result, gaps);
    }

    // Check requirement coverage
    if (this.isRuleEnabled(RuleType.REQUIREMENT_HAS_DESIGN)) {
      this.checkRequirementCoverage(result, coverage, 'design', 'withDesign');
    }

    if (this.isRuleEnabled(RuleType.REQUIREMENT_HAS_TASKS)) {
      this.checkRequirementCoverage(result, coverage, 'tasks', 'withTasks');
    }

    if (this.isRuleEnabled(RuleType.REQUIREMENT_HAS_CODE)) {
      this.checkRequirementCoverage(result, coverage, 'code', 'withCode');
    }

    if (this.isRuleEnabled(RuleType.REQUIREMENT_HAS_TESTS)) {
      this.checkRequirementCoverage(result, coverage, 'tests', 'withTests');
    }

    // Check code has tests
    if (this.isRuleEnabled(RuleType.CODE_HAS_TESTS)) {
      this.checkUntestedCode(result, gaps);
    }

    // Check for specific orphans
    if (this.isRuleEnabled(RuleType.DESIGN_HAS_REQUIREMENT)) {
      this.checkOrphanedDesign(result, gaps);
    }

    if (this.isRuleEnabled(RuleType.TASK_HAS_REQUIREMENT)) {
      this.checkOrphanedTasks(result, gaps);
    }
  }

  /**
   * Check if a rule is enabled
   */
  isRuleEnabled(ruleType) {
    const rule = this.config.rules[ruleType];
    return rule && rule.enabled;
  }

  /**
   * Get rule severity
   */
  getRuleSeverity(ruleType) {
    const rule = this.config.rules[ruleType];
    return rule ? rule.severity : Severity.WARNING;
  }

  /**
   * Add violation based on severity
   */
  addViolation(result, violation) {
    switch (violation.severity) {
      case Severity.ERROR:
        result.violations.push(violation);
        break;
      case Severity.WARNING:
        result.warnings.push(violation);
        break;
      case Severity.INFO:
        result.infos.push(violation);
        break;
    }
  }

  /**
   * Check coverage thresholds
   */
  checkCoverageThresholds(result, coverage) {
    const severity = this.getRuleSeverity(RuleType.MINIMUM_COVERAGE);

    const checks = [
      { name: 'design', value: coverage.designCoverage, threshold: this.config.thresholds.design },
      { name: 'tasks', value: coverage.tasksCoverage, threshold: this.config.thresholds.tasks },
      { name: 'code', value: coverage.codeCoverage, threshold: this.config.thresholds.code },
      { name: 'tests', value: coverage.testsCoverage, threshold: this.config.thresholds.tests },
      { name: 'overall', value: coverage.overall, threshold: this.config.thresholds.overall },
    ];

    for (const check of checks) {
      if (check.value < check.threshold) {
        this.addViolation(result, {
          rule: RuleType.MINIMUM_COVERAGE,
          severity,
          message: `${check.name} coverage (${check.value}%) is below threshold (${check.threshold}%)`,
          location: null,
          details: {
            category: check.name,
            actual: check.value,
            expected: check.threshold,
          },
        });
      }
    }
  }

  /**
   * Check for orphaned items
   */
  checkOrphanedItems(result, gaps) {
    const severity = this.getRuleSeverity(RuleType.NO_ORPHANED_ITEMS);

    if (gaps.orphanedRequirements.length > 0) {
      this.addViolation(result, {
        rule: RuleType.NO_ORPHANED_ITEMS,
        severity,
        message: `${gaps.orphanedRequirements.length} orphaned requirements found`,
        location: null,
        details: {
          type: 'requirements',
          items: gaps.orphanedRequirements.map(r => r.id || r.file),
        },
      });
    }
  }

  /**
   * Check requirement coverage for a specific category
   */
  checkRequirementCoverage(result, coverage, category, coverageKey) {
    const ruleType = `requirement-has-${category}`;
    const severity = this.getRuleSeverity(ruleType);
    const threshold = this.config.thresholds[category];

    if (coverage[coverageKey] < coverage.totalRequirements) {
      const missing = coverage.totalRequirements - coverage[coverageKey];
      const percentage = Math.round((coverage[coverageKey] / coverage.totalRequirements) * 100);

      if (percentage < threshold) {
        this.addViolation(result, {
          rule: ruleType,
          severity,
          message: `${missing} requirements missing ${category} links (${percentage}% covered)`,
          location: null,
          details: {
            category,
            total: coverage.totalRequirements,
            covered: coverage[coverageKey],
            missing,
            percentage,
          },
        });
      }
    }
  }

  /**
   * Check for untested code
   */
  checkUntestedCode(result, gaps) {
    const severity = this.getRuleSeverity(RuleType.CODE_HAS_TESTS);

    if (gaps.untestedCode.length > 0) {
      this.addViolation(result, {
        rule: RuleType.CODE_HAS_TESTS,
        severity,
        message: `${gaps.untestedCode.length} code files without tests`,
        location: null,
        details: {
          files: gaps.untestedCode.slice(0, 10).map(c => c.file || c),
          total: gaps.untestedCode.length,
        },
      });
    }
  }

  /**
   * Check for orphaned design documents
   */
  checkOrphanedDesign(result, gaps) {
    const severity = this.getRuleSeverity(RuleType.DESIGN_HAS_REQUIREMENT);

    if (gaps.orphanedDesign.length > 0) {
      this.addViolation(result, {
        rule: RuleType.DESIGN_HAS_REQUIREMENT,
        severity,
        message: `${gaps.orphanedDesign.length} design documents not linked to requirements`,
        location: null,
        details: {
          files: gaps.orphanedDesign.map(d => d.file || d),
        },
      });
    }
  }

  /**
   * Check for orphaned tasks
   */
  checkOrphanedTasks(result, gaps) {
    const severity = this.getRuleSeverity(RuleType.TASK_HAS_REQUIREMENT);

    if (gaps.orphanedTasks.length > 0) {
      this.addViolation(result, {
        rule: RuleType.TASK_HAS_REQUIREMENT,
        severity,
        message: `${gaps.orphanedTasks.length} tasks not linked to requirements`,
        location: null,
        details: {
          files: gaps.orphanedTasks.map(t => t.file || t),
        },
      });
    }
  }

  /**
   * Generate validation report
   */
  generateReport(result) {
    const lines = [];

    lines.push('# Traceability Validation Report');
    lines.push('');
    lines.push(`**Generated**: ${result.timestamp}`);
    lines.push(`**Strictness**: ${result.strictness}`);
    lines.push(`**Status**: ${result.valid ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');

    // Summary
    lines.push('## Summary');
    lines.push('');
    lines.push(`| Metric | Value |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Total Issues | ${result.summary.total} |`);
    lines.push(`| Errors | ${result.summary.errors} |`);
    lines.push(`| Warnings | ${result.summary.warnings} |`);
    lines.push(`| Infos | ${result.summary.infos} |`);
    lines.push('');

    // Coverage
    if (result.coverage) {
      lines.push('## Coverage');
      lines.push('');
      lines.push(`| Category | Coverage |`);
      lines.push(`|----------|----------|`);
      lines.push(`| Design | ${result.coverage.designCoverage}% |`);
      lines.push(`| Tasks | ${result.coverage.tasksCoverage}% |`);
      lines.push(`| Code | ${result.coverage.codeCoverage}% |`);
      lines.push(`| Tests | ${result.coverage.testsCoverage}% |`);
      lines.push(`| **Overall** | **${result.coverage.overall}%** |`);
      lines.push('');
    }

    // Errors
    if (result.violations.length > 0) {
      lines.push('## Errors');
      lines.push('');
      result.violations.forEach(v => {
        lines.push(`- 🔴 **${v.rule}**: ${v.message}`);
      });
      lines.push('');
    }

    // Warnings
    if (result.warnings.length > 0) {
      lines.push('## Warnings');
      lines.push('');
      result.warnings.forEach(v => {
        lines.push(`- ⚠️ **${v.rule}**: ${v.message}`);
      });
      lines.push('');
    }

    // Infos
    if (result.infos.length > 0) {
      lines.push('## Information');
      lines.push('');
      result.infos.forEach(v => {
        lines.push(`- ℹ️ **${v.rule}**: ${v.message}`);
      });
      lines.push('');
    }

    // Gaps detail
    if (result.gaps) {
      lines.push('## Gaps Detail');
      lines.push('');

      if (result.gaps.orphanedRequirements.length > 0) {
        lines.push('### Orphaned Requirements');
        result.gaps.orphanedRequirements.slice(0, 10).forEach(r => {
          lines.push(`- ${r.id || r.file}`);
        });
        if (result.gaps.orphanedRequirements.length > 10) {
          lines.push(`- ... and ${result.gaps.orphanedRequirements.length - 10} more`);
        }
        lines.push('');
      }

      if (result.gaps.missingTests.length > 0) {
        lines.push('### Requirements Missing Tests');
        result.gaps.missingTests.slice(0, 10).forEach(r => {
          lines.push(`- ${r.id || r.file}`);
        });
        if (result.gaps.missingTests.length > 10) {
          lines.push(`- ... and ${result.gaps.missingTests.length - 10} more`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Validate and save report
   */
  async validateAndSaveReport(outputPath) {
    const result = await this.validate();
    const report = this.generateReport(result);

    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, report, 'utf-8');

    return {
      result,
      reportPath: outputPath,
    };
  }
}

module.exports = {
  TraceabilityValidator,
  Severity,
  RuleType,
  defaultConfig,
};
