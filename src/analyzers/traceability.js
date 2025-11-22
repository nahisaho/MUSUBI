/**
 * MUSUBI Traceability Analyzer
 * 
 * Provides end-to-end traceability from requirements to code to tests
 * Implements Constitutional Article V: Complete Traceability
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class TraceabilityAnalyzer {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Generate full traceability matrix
   */
  async generateMatrix(options = {}) {
    const requirements = await this.findRequirements(options.requirements || 'docs/requirements');
    const design = await this.findDesign(options.design || 'docs/design');
    const tasks = await this.findTasks(options.tasks || 'docs/tasks');
    const code = await this.findCode(options.code || 'src');
    const tests = await this.findTests(options.tests || 'tests');

    const matrix = [];

    for (const req of requirements) {
      const relatedDesign = design.filter(d => this.linksToRequirement(d, req.id));
      const relatedTasks = tasks.filter(t => this.linksToRequirement(t, req.id));
      const relatedCode = code.filter(c => this.linksToRequirement(c, req.id));
      const relatedTests = tests.filter(t => this.linksToRequirement(t, req.id));

      matrix.push({
        requirement: req,
        design: relatedDesign,
        tasks: relatedTasks,
        code: relatedCode,
        tests: relatedTests,
        coverage: {
          design: relatedDesign.length > 0,
          tasks: relatedTasks.length > 0,
          code: relatedCode.length > 0,
          tests: relatedTests.length > 0
        }
      });
    }

    const summary = this.calculateMatrixSummary(matrix);

    return { matrix, summary };
  }

  /**
   * Calculate coverage statistics
   */
  async calculateCoverage(options = {}) {
    const { matrix, summary } = await this.generateMatrix(options);

    const overall = Math.round(
      (summary.designCoverage + summary.tasksCoverage + summary.codeCoverage + summary.testsCoverage) / 4
    );

    return {
      totalRequirements: summary.totalRequirements,
      withDesign: summary.withDesign,
      withTasks: summary.withTasks,
      withCode: summary.withCode,
      withTests: summary.withTests,
      designCoverage: summary.designCoverage,
      tasksCoverage: summary.tasksCoverage,
      codeCoverage: summary.codeCoverage,
      testsCoverage: summary.testsCoverage,
      overall
    };
  }

  /**
   * Detect gaps in traceability
   */
  async detectGaps(options = {}) {
    const requirements = await this.findRequirements(options.requirements || 'docs/requirements');
    const design = await this.findDesign(options.design || 'docs/design');
    const tasks = await this.findTasks(options.tasks || 'docs/tasks');
    const code = await this.findCode(options.code || 'src');
    const tests = await this.findTests(options.tests || 'tests');

    const orphanedRequirements = [];
    const orphanedDesign = [];
    const orphanedTasks = [];
    const untestedCode = [];
    const missingTests = [];

    // Find orphaned requirements (no design or tasks)
    for (const req of requirements) {
      const hasDesign = design.some(d => this.linksToRequirement(d, req.id));
      const hasTasks = tasks.some(t => this.linksToRequirement(t, req.id));
      
      if (!hasDesign && !hasTasks) {
        orphanedRequirements.push(req);
      }
      
      // Check for missing tests
      const hasTests = tests.some(t => this.linksToRequirement(t, req.id));
      if (!hasTests) {
        missingTests.push(req);
      }
    }

    // Find orphaned design (no requirements)
    for (const d of design) {
      const hasRequirement = requirements.some(r => this.linksToRequirement(d, r.id));
      if (!hasRequirement) {
        orphanedDesign.push(d);
      }
    }

    // Find orphaned tasks (no requirements)
    for (const t of tasks) {
      const hasRequirement = requirements.some(r => this.linksToRequirement(t, r.id));
      if (!hasRequirement) {
        orphanedTasks.push(t);
      }
    }

    // Find untested code
    for (const c of code) {
      const hasTest = tests.some(t => this.testCoversCode(t, c));
      if (!hasTest) {
        untestedCode.push(c);
      }
    }

    return {
      orphanedRequirements,
      orphanedDesign,
      orphanedTasks,
      untestedCode,
      missingTests
    };
  }

  /**
   * Trace specific requirement
   */
  async traceRequirement(requirementId, options = {}) {
    const requirements = await this.findRequirements(options.requirements || 'docs/requirements');
    const design = await this.findDesign(options.design || 'docs/design');
    const tasks = await this.findTasks(options.tasks || 'docs/tasks');
    const code = await this.findCode(options.code || 'src');
    const tests = await this.findTests(options.tests || 'tests');

    const requirement = requirements.find(r => r.id === requirementId);
    if (!requirement) {
      return { requirement: null, design: [], tasks: [], code: [], tests: [] };
    }

    const relatedDesign = design.filter(d => this.linksToRequirement(d, requirementId));
    const relatedTasks = tasks.filter(t => this.linksToRequirement(t, requirementId));
    const relatedCode = code.filter(c => this.linksToRequirement(c, requirementId));
    const relatedTests = tests.filter(t => this.linksToRequirement(t, requirementId));

    return {
      requirement,
      design: relatedDesign,
      tasks: relatedTasks,
      code: relatedCode,
      tests: relatedTests
    };
  }

  /**
   * Validate 100% traceability coverage
   */
  async validate(options = {}) {
    const coverage = await this.calculateCoverage(options);
    const gaps = await this.detectGaps(options);

    const passed = coverage.overall === 100 && 
                   gaps.orphanedRequirements.length === 0 &&
                   gaps.untestedCode.length === 0 &&
                   gaps.missingTests.length === 0;

    return {
      passed,
      coverage,
      gaps
    };
  }

  /**
   * Format matrix for output
   */
  formatMatrix(matrixData, format = 'table') {
    const { matrix, summary } = matrixData;

    if (format === 'json') {
      return JSON.stringify(matrixData, null, 2);
    }

    if (format === 'html') {
      return this.formatMatrixHTML(matrix, summary);
    }

    if (format === 'markdown') {
      return this.formatMatrixMarkdown(matrix, summary);
    }

    // Default: table format
    return this.formatMatrixTable(matrix, summary);
  }

  /**
   * Format matrix as table
   */
  formatMatrixTable(matrix, _summary) {
    const chalk = require('chalk');
    let output = '';

    output += chalk.bold('Requirement Traceability Matrix\n\n');
    output += chalk.dim('REQ ID'.padEnd(20) + 'Design'.padEnd(10) + 'Tasks'.padEnd(10) + 'Code'.padEnd(10) + 'Tests'.padEnd(10)) + '\n';
    output += chalk.dim('-'.repeat(60)) + '\n';

    matrix.forEach(row => {
      const designIcon = row.coverage.design ? chalk.green('✓') : chalk.red('✗');
      const tasksIcon = row.coverage.tasks ? chalk.green('✓') : chalk.red('✗');
      const codeIcon = row.coverage.code ? chalk.green('✓') : chalk.red('✗');
      const testsIcon = row.coverage.tests ? chalk.green('✓') : chalk.red('✗');

      output += `${row.requirement.id.padEnd(20)}${designIcon.padEnd(10)}${tasksIcon.padEnd(10)}${codeIcon.padEnd(10)}${testsIcon.padEnd(10)}\n`;
    });

    return output;
  }

  /**
   * Format matrix as markdown
   */
  formatMatrixMarkdown(matrix, summary) {
    let output = '# Requirement Traceability Matrix\n\n';
    output += `Generated: ${new Date().toISOString()}\n\n`;
    output += '## Summary\n\n';
    output += `- Total Requirements: ${summary.totalRequirements}\n`;
    output += `- Design Coverage: ${summary.designCoverage}%\n`;
    output += `- Tasks Coverage: ${summary.tasksCoverage}%\n`;
    output += `- Code Coverage: ${summary.codeCoverage}%\n`;
    output += `- Test Coverage: ${summary.testsCoverage}%\n\n`;
    output += '## Matrix\n\n';
    output += '| Requirement ID | Title | Design | Tasks | Code | Tests |\n';
    output += '|---------------|-------|--------|-------|------|-------|\n';

    matrix.forEach(row => {
      const designIcon = row.coverage.design ? '✓' : '✗';
      const tasksIcon = row.coverage.tasks ? '✓' : '✗';
      const codeIcon = row.coverage.code ? '✓' : '✗';
      const testsIcon = row.coverage.tests ? '✓' : '✗';

      output += `| ${row.requirement.id} | ${row.requirement.title} | ${designIcon} | ${tasksIcon} | ${codeIcon} | ${testsIcon} |\n`;
    });

    return output;
  }

  /**
   * Format matrix as HTML
   */
  formatMatrixHTML(matrix, summary) {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n';
    html += '<title>Requirement Traceability Matrix</title>\n';
    html += '<style>\n';
    html += 'body { font-family: Arial, sans-serif; margin: 20px; }\n';
    html += 'table { border-collapse: collapse; width: 100%; }\n';
    html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n';
    html += 'th { background-color: #4CAF50; color: white; }\n';
    html += '.pass { color: green; }\n';
    html += '.fail { color: red; }\n';
    html += '</style>\n</head>\n<body>\n';
    html += '<h1>Requirement Traceability Matrix</h1>\n';
    html += `<p>Generated: ${new Date().toISOString()}</p>\n`;
    html += '<h2>Summary</h2>\n<ul>\n';
    html += `<li>Total Requirements: ${summary.totalRequirements}</li>\n`;
    html += `<li>Design Coverage: ${summary.designCoverage}%</li>\n`;
    html += `<li>Tasks Coverage: ${summary.tasksCoverage}%</li>\n`;
    html += `<li>Code Coverage: ${summary.codeCoverage}%</li>\n`;
    html += `<li>Test Coverage: ${summary.testsCoverage}%</li>\n`;
    html += '</ul>\n<h2>Matrix</h2>\n';
    html += '<table>\n<tr><th>Requirement ID</th><th>Title</th><th>Design</th><th>Tasks</th><th>Code</th><th>Tests</th></tr>\n';

    matrix.forEach(row => {
      const designClass = row.coverage.design ? 'pass' : 'fail';
      const tasksClass = row.coverage.tasks ? 'pass' : 'fail';
      const codeClass = row.coverage.code ? 'pass' : 'fail';
      const testsClass = row.coverage.tests ? 'pass' : 'fail';

      html += `<tr><td>${row.requirement.id}</td><td>${row.requirement.title}</td>`;
      html += `<td class="${designClass}">${row.coverage.design ? '✓' : '✗'}</td>`;
      html += `<td class="${tasksClass}">${row.coverage.tasks ? '✓' : '✗'}</td>`;
      html += `<td class="${codeClass}">${row.coverage.code ? '✓' : '✗'}</td>`;
      html += `<td class="${testsClass}">${row.coverage.tests ? '✓' : '✗'}</td></tr>\n`;
    });

    html += '</table>\n</body>\n</html>';
    return html;
  }

  /**
   * Calculate matrix summary statistics
   */
  calculateMatrixSummary(matrix) {
    const totalRequirements = matrix.length;
    const withDesign = matrix.filter(r => r.coverage.design).length;
    const withTasks = matrix.filter(r => r.coverage.tasks).length;
    const withCode = matrix.filter(r => r.coverage.code).length;
    const withTests = matrix.filter(r => r.coverage.tests).length;

    return {
      totalRequirements,
      withDesign,
      withTasks,
      withCode,
      withTests,
      designCoverage: totalRequirements > 0 ? Math.round((withDesign / totalRequirements) * 100) : 0,
      tasksCoverage: totalRequirements > 0 ? Math.round((withTasks / totalRequirements) * 100) : 0,
      codeCoverage: totalRequirements > 0 ? Math.round((withCode / totalRequirements) * 100) : 0,
      testsCoverage: totalRequirements > 0 ? Math.round((withTests / totalRequirements) * 100) : 0
    };
  }

  /**
   * Find all requirements
   */
  async findRequirements(reqDir) {
    const reqPath = path.join(this.workspaceRoot, reqDir);
    if (!await fs.pathExists(reqPath)) {
      return [];
    }

    const files = glob.sync('**/*.md', { cwd: reqPath, absolute: true });
    const requirements = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const reqMatches = content.matchAll(/### (REQ-[A-Z0-9]+-\d{3}): (.+)/g);

      for (const match of reqMatches) {
        requirements.push({
          id: match[1],
          title: match[2],
          file: path.relative(this.workspaceRoot, file),
          content
        });
      }
    }

    return requirements;
  }

  /**
   * Find all design documents
   */
  async findDesign(designDir) {
    const designPath = path.join(this.workspaceRoot, designDir);
    if (!await fs.pathExists(designPath)) {
      return [];
    }

    const files = glob.sync('**/*.md', { cwd: designPath, absolute: true });
    const designs = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Extract C4 diagrams and ADRs
      const c4Matches = content.matchAll(/### (Level \d: .+)/g);
      const adrMatches = content.matchAll(/### (ADR-\d{3}): (.+)/g);

      for (const match of c4Matches) {
        designs.push({
          id: match[1],
          title: match[1],
          type: 'C4',
          file: path.relative(this.workspaceRoot, file),
          content
        });
      }

      for (const match of adrMatches) {
        designs.push({
          id: match[1],
          title: match[2],
          type: 'ADR',
          file: path.relative(this.workspaceRoot, file),
          content
        });
      }
    }

    return designs;
  }

  /**
   * Find all tasks
   */
  async findTasks(tasksDir) {
    const tasksPath = path.join(this.workspaceRoot, tasksDir);
    if (!await fs.pathExists(tasksPath)) {
      return [];
    }

    const files = glob.sync('**/*.md', { cwd: tasksPath, absolute: true });
    const tasks = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const taskMatches = content.matchAll(/### (TASK-\d{3}): (.+)/g);

      for (const match of taskMatches) {
        // Extract status - look for **Status**: pattern after task heading
        const taskSection = content.substring(match.index);
        const statusMatch = taskSection.match(/\*\*Status\*\*:\s*(\w+)/);
        
        tasks.push({
          id: match[1],
          title: match[2],
          status: statusMatch ? statusMatch[1] : 'Unknown',
          file: path.relative(this.workspaceRoot, file),
          content
        });
      }
    }

    return tasks;
  }

  /**
   * Find all code files
   */
  async findCode(codeDir) {
    const codePath = path.join(this.workspaceRoot, codeDir);
    if (!await fs.pathExists(codePath)) {
      return [];
    }

    const files = glob.sync('**/*.{js,ts,jsx,tsx,py,java,go,rs}', { cwd: codePath, absolute: true });
    const code = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Extract functions and classes with REQ references
      const functionMatches = content.matchAll(/(?:function|const|let|var)\s+(\w+)|class\s+(\w+)/g);
      
      for (const match of functionMatches) {
        code.push({
          file: path.relative(this.workspaceRoot, file),
          function: match[1],
          class: match[2],
          lines: this.getLineNumber(content, match.index),
          content
        });
      }
    }

    return code;
  }

  /**
   * Find all test files
   */
  async findTests(testsDir) {
    const testsPath = path.join(this.workspaceRoot, testsDir);
    if (!await fs.pathExists(testsPath)) {
      return [];
    }

    const files = glob.sync('**/*.{test,spec}.{js,ts,jsx,tsx,py,java,go,rs}', { cwd: testsPath, absolute: true });
    const tests = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Extract test cases
      const testMatches = content.matchAll(/(?:test|it|describe)\(['"](.+?)['"]/g);
      
      for (const match of testMatches) {
        tests.push({
          file: path.relative(this.workspaceRoot, file),
          test: match[1],
          content
        });
      }
    }

    return tests;
  }

  /**
   * Check if document links to requirement
   */
  linksToRequirement(doc, requirementId) {
    return doc.content.includes(requirementId);
  }

  /**
   * Check if test covers code
   */
  testCoversCode(test, code) {
    // Simple heuristic: test file path matches code file path
    const testBase = path.basename(test.file, path.extname(test.file)).replace(/\.(test|spec)$/, '');
    const codeBase = path.basename(code.file, path.extname(code.file));
    
    return testBase === codeBase || test.content.includes(code.function) || test.content.includes(code.class);
  }

  /**
   * Get line number from content index
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = TraceabilityAnalyzer;
