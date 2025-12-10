#!/usr/bin/env node

/**
 * Constitutional Validator
 *
 * Validates compliance with the 9 Constitutional Articles.
 * Part of MUSUBI SDD governance system.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ConstitutionalValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.violations = [];
    this.warnings = [];
    this.passes = [];
  }

  /**
   * Run all constitutional validations
   */
  async validateAll() {
    console.log('🏛️  Constitutional Validation Starting...\n');

    await this.validateArticleI(); // Library-First
    await this.validateArticleII(); // CLI Interface
    await this.validateArticleIII(); // Test-First
    await this.validateArticleIV(); // EARS Format
    await this.validateArticleV(); // Traceability
    await this.validateArticleVI(); // Project Memory
    await this.validateArticleVII(); // Simplicity Gate
    await this.validateArticleVIII(); // Anti-Abstraction
    await this.validateArticleIX(); // Integration-First

    return this.generateReport();
  }

  /**
   * Article I: Library-First Principle
   */
  async validateArticleI() {
    const article = 'Article I: Library-First';

    // Check for lib/ or packages/ directory
    const libDirs = ['lib', 'packages', 'libs'].filter(dir =>
      fs.existsSync(path.join(this.projectRoot, dir))
    );

    if (libDirs.length === 0) {
      this.warnings.push({
        article,
        message: 'No library directory found (lib/, packages/, libs/)',
        recommendation: 'Create a lib/ directory for reusable components',
      });
    } else {
      this.passes.push({
        article,
        message: `Library directory found: ${libDirs.join(', ')}`,
      });
    }

    // Check if features have test suites
    const libPath = path.join(this.projectRoot, libDirs[0] || 'lib');
    if (fs.existsSync(libPath)) {
      const subDirs = fs
        .readdirSync(libPath)
        .filter(f => fs.statSync(path.join(libPath, f)).isDirectory());

      for (const lib of subDirs) {
        const testPath = path.join(libPath, lib, 'tests');
        const testFile = glob.sync(path.join(libPath, lib, '*.test.{js,ts}'));

        if (!fs.existsSync(testPath) && testFile.length === 0) {
          this.warnings.push({
            article,
            message: `Library '${lib}' has no test suite`,
            recommendation: `Add tests to ${libPath}/${lib}/`,
          });
        }
      }
    }
  }

  /**
   * Article II: CLI Interface Mandate
   */
  async validateArticleII() {
    const article = 'Article II: CLI Interface';

    // Check for bin/ directory
    const binPath = path.join(this.projectRoot, 'bin');
    const packageJson = this.readPackageJson();

    if (fs.existsSync(binPath)) {
      const cliFiles = fs.readdirSync(binPath);
      this.passes.push({
        article,
        message: `CLI interfaces found in bin/: ${cliFiles.length} file(s)`,
      });
    } else if (packageJson?.bin) {
      this.passes.push({
        article,
        message: `CLI entry points defined in package.json`,
      });
    } else {
      this.warnings.push({
        article,
        message: 'No CLI interface found',
        recommendation: 'Add bin/ directory or define "bin" in package.json',
      });
    }
  }

  /**
   * Article III: Test-First Imperative
   */
  async validateArticleIII() {
    const article = 'Article III: Test-First';

    // Check for test directory
    const testDirs = ['tests', 'test', '__tests__', 'spec'].filter(dir =>
      fs.existsSync(path.join(this.projectRoot, dir))
    );

    if (testDirs.length === 0) {
      this.violations.push({
        article,
        message: 'No test directory found',
        severity: 'critical',
        recommendation: 'Create tests/ directory with test files',
      });
      return;
    }

    // Check test coverage configuration
    const jestConfig = fs.existsSync(path.join(this.projectRoot, 'jest.config.js'));
    const coverageDir = fs.existsSync(path.join(this.projectRoot, 'coverage'));

    if (!jestConfig && !coverageDir) {
      this.warnings.push({
        article,
        message: 'No test coverage configuration found',
        recommendation: 'Configure test coverage (80% threshold required)',
      });
    } else {
      this.passes.push({
        article,
        message: `Test infrastructure found: ${testDirs.join(', ')}`,
      });
    }
  }

  /**
   * Article IV: EARS Requirements Format
   */
  async validateArticleIV() {
    const article = 'Article IV: EARS Format';

    // Find requirements files
    const reqFiles = glob.sync(path.join(this.projectRoot, '**/*requirements*.md'), {
      ignore: ['**/node_modules/**', '**/templates/**'],
    });

    if (reqFiles.length === 0) {
      this.warnings.push({
        article,
        message: 'No requirements files found',
        recommendation: 'Create requirements using EARS format',
      });
      return;
    }

    for (const file of reqFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const hasEARS = /\b(WHEN|WHILE|IF|WHERE|SHALL)\b/g.test(content);
      const hasAmbiguous = /\b(should|may|might|could)\b/gi.test(content);

      if (!hasEARS) {
        this.violations.push({
          article,
          message: `${path.basename(file)} not in EARS format`,
          severity: 'high',
          recommendation: 'Use EARS patterns: WHEN/WHILE/IF/WHERE + SHALL',
        });
      } else if (hasAmbiguous) {
        this.warnings.push({
          article,
          message: `${path.basename(file)} contains ambiguous keywords`,
          recommendation: 'Replace should/may with SHALL/MUST',
        });
      } else {
        this.passes.push({
          article,
          message: `${path.basename(file)} uses EARS format`,
        });
      }
    }
  }

  /**
   * Article V: Traceability Mandate
   */
  async validateArticleV() {
    const article = 'Article V: Traceability';

    // Check for traceability matrix
    const traceFiles = glob.sync(path.join(this.projectRoot, '**/*{trace,coverage-matrix}*.md'), {
      ignore: ['**/node_modules/**'],
    });

    if (traceFiles.length === 0) {
      this.warnings.push({
        article,
        message: 'No traceability matrix found',
        recommendation: 'Create coverage-matrix.md linking REQ → Design → Test',
      });
    } else {
      this.passes.push({
        article,
        message: `Traceability files found: ${traceFiles.length}`,
      });
    }

    // Check for REQ-XXX patterns in test files
    const testFiles = glob.sync(path.join(this.projectRoot, '**/*.test.{js,ts}'), {
      ignore: ['**/node_modules/**'],
    });

    let testsWithReqs = 0;
    for (const file of testFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/REQ-\w+-\d+/g.test(content)) {
        testsWithReqs++;
      }
    }

    if (testFiles.length > 0 && testsWithReqs === 0) {
      this.warnings.push({
        article,
        message: 'Test files do not reference requirement IDs',
        recommendation: 'Add REQ-XXX-NNN references to test descriptions',
      });
    }
  }

  /**
   * Article VI: Project Memory (Steering)
   */
  async validateArticleVI() {
    const article = 'Article VI: Project Memory';

    const steeringPath = path.join(this.projectRoot, 'steering');
    const requiredFiles = ['structure.md', 'tech.md', 'product.md'];

    if (!fs.existsSync(steeringPath)) {
      this.violations.push({
        article,
        message: 'No steering/ directory found',
        severity: 'critical',
        recommendation: 'Run "musubi init" to create steering files',
      });
      return;
    }

    for (const file of requiredFiles) {
      const filePath = path.join(steeringPath, file);
      if (!fs.existsSync(filePath)) {
        this.violations.push({
          article,
          message: `Missing steering file: ${file}`,
          severity: 'high',
          recommendation: `Create steering/${file}`,
        });
      } else {
        this.passes.push({
          article,
          message: `Found steering/${file}`,
        });
      }
    }
  }

  /**
   * Article VII: Simplicity Gate
   */
  async validateArticleVII() {
    const article = 'Article VII: Simplicity Gate';

    // Count top-level directories that look like projects
    const projectIndicators = ['package.json', 'Cargo.toml', 'pyproject.toml', 'go.mod'];
    let projectCount = 0;

    // Check root
    for (const indicator of projectIndicators) {
      if (fs.existsSync(path.join(this.projectRoot, indicator))) {
        projectCount++;
        break;
      }
    }

    // Check packages/
    const packagesPath = path.join(this.projectRoot, 'packages');
    if (fs.existsSync(packagesPath)) {
      const subProjects = fs.readdirSync(packagesPath).filter(f => {
        const subPath = path.join(packagesPath, f);
        if (!fs.statSync(subPath).isDirectory()) return false;
        return projectIndicators.some(ind => fs.existsSync(path.join(subPath, ind)));
      });
      projectCount += subProjects.length;
    }

    if (projectCount > 3) {
      const complexityPath = path.join(this.projectRoot, 'steering/complexity-tracking.md');
      if (!fs.existsSync(complexityPath)) {
        this.violations.push({
          article,
          message: `${projectCount} projects detected (> 3 limit)`,
          severity: 'high',
          recommendation: 'Document justification in steering/complexity-tracking.md',
        });
      } else {
        this.warnings.push({
          article,
          message: `${projectCount} projects (complexity justified)`,
          recommendation: 'Review complexity-tracking.md periodically',
        });
      }
    } else {
      this.passes.push({
        article,
        message: `${projectCount} project(s) - within limit`,
      });
    }
  }

  /**
   * Article VIII: Anti-Abstraction Gate
   */
  async validateArticleVIII() {
    const article = 'Article VIII: Anti-Abstraction';

    // Check for common wrapper patterns
    const wrapperPatterns = [
      '**/BaseRepository.{js,ts}',
      '**/BaseService.{js,ts}',
      '**/AbstractFactory.{js,ts}',
      '**/wrapper/*.{js,ts}',
      '**/adapters/*.{js,ts}',
    ];

    const potentialWrappers = [];
    for (const pattern of wrapperPatterns) {
      const matches = glob.sync(path.join(this.projectRoot, pattern), {
        ignore: ['**/node_modules/**', '**/templates/**'],
      });
      potentialWrappers.push(...matches);
    }

    if (potentialWrappers.length > 0) {
      this.warnings.push({
        article,
        message: `Potential wrapper abstractions detected: ${potentialWrappers.length} file(s)`,
        recommendation: 'Verify abstractions are justified per Phase -1 Gate',
      });
    } else {
      this.passes.push({
        article,
        message: 'No unnecessary abstraction layers detected',
      });
    }
  }

  /**
   * Article IX: Integration-First Testing
   */
  async validateArticleIX() {
    const article = 'Article IX: Integration-First';

    // Check for docker-compose for test infrastructure
    const hasDockerCompose =
      fs.existsSync(path.join(this.projectRoot, 'docker-compose.yml')) ||
      fs.existsSync(path.join(this.projectRoot, 'docker-compose.test.yml'));

    // Check for mock usage
    const testFiles = glob.sync(path.join(this.projectRoot, '**/*.test.{js,ts}'), {
      ignore: ['**/node_modules/**'],
    });

    let mockCount = 0;
    for (const file of testFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const mocks = (content.match(/\b(jest\.mock|sinon\.stub|vi\.mock|mock\()/g) || []).length;
      mockCount += mocks;
    }

    if (!hasDockerCompose && testFiles.length > 0) {
      this.warnings.push({
        article,
        message: 'No docker-compose for test infrastructure',
        recommendation: 'Add docker-compose.yml for real service testing',
      });
    } else if (hasDockerCompose) {
      this.passes.push({
        article,
        message: 'Docker Compose available for integration tests',
      });
    }

    if (mockCount > 10) {
      this.warnings.push({
        article,
        message: `High mock usage detected (${mockCount} mocks)`,
        recommendation: 'Prefer real services; document mock justifications',
      });
    }
  }

  /**
   * Utility: Read package.json
   */
  readPackageJson() {
    const pkgPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    }
    return null;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      summary: {
        passes: this.passes.length,
        warnings: this.warnings.length,
        violations: this.violations.length,
        status: this.violations.length === 0 ? 'COMPLIANT' : 'NON-COMPLIANT',
      },
      passes: this.passes,
      warnings: this.warnings,
      violations: this.violations,
    };

    console.log('\n' + '='.repeat(60));
    console.log('📜 CONSTITUTIONAL VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`Status: ${report.summary.status}`);
    console.log(
      `Passes: ${report.summary.passes} | Warnings: ${report.summary.warnings} | Violations: ${report.summary.violations}`
    );

    if (this.violations.length > 0) {
      console.log('\n❌ VIOLATIONS:');
      this.violations.forEach(v => {
        console.log(`  [${v.severity.toUpperCase()}] ${v.article}: ${v.message}`);
        console.log(`           → ${v.recommendation}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(w => {
        console.log(`  ${w.article}: ${w.message}`);
        console.log(`           → ${w.recommendation}`);
      });
    }

    console.log('\n✅ PASSES: ' + this.passes.length);
    console.log('='.repeat(60));

    return report;
  }
}

// CLI execution
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  const validator = new ConstitutionalValidator(projectRoot);

  validator
    .validateAll()
    .then(report => {
      const exitCode = report.summary.violations > 0 ? 1 : 0;
      process.exit(exitCode);
    })
    .catch(err => {
      console.error('Validation error:', err);
      process.exit(1);
    });
}

module.exports = { ConstitutionalValidator };
