#!/usr/bin/env node

/**
 * @fileoverview E2E Test for Enterprise Scale Modules (v5.5.0+)
 * @description End-to-end integration test for large project analysis modules
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Import modules
const {
  LargeProjectAnalyzer,
  LARGE_PROJECT_THRESHOLDS,
} = require('../../src/analyzers/large-project-analyzer');
const {
  ComplexityAnalyzer,
  COMPLEXITY_THRESHOLDS,
} = require('../../src/analyzers/complexity-analyzer');
const {
  RustMigrationGenerator,
  UNSAFE_PATTERNS,
} = require('../../src/generators/rust-migration-generator');
const { HierarchicalReporter } = require('../../src/reporters/hierarchical-reporter');

// Test workspace
let testWorkspace;

async function setup() {
  testWorkspace = path.join(os.tmpdir(), `musubi-e2e-${Date.now()}`);
  await fs.ensureDir(testWorkspace);

  // Create test files
  await fs.ensureDir(path.join(testWorkspace, 'src'));
  await fs.ensureDir(path.join(testWorkspace, 'lib'));

  // JavaScript file with various complexity levels
  await fs.writeFile(
    path.join(testWorkspace, 'src/main.js'),
    `
// Main application entry point
function main() {
  console.log('Hello World');
  processData();
}

function processData() {
  const data = fetchData();
  if (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].active) {
        if (data[i].type === 'A') {
          handleTypeA(data[i]);
        } else if (data[i].type === 'B') {
          handleTypeB(data[i]);
        } else {
          handleDefault(data[i]);
        }
      }
    }
  }
  return data;
}

function fetchData() {
  return [
    { id: 1, active: true, type: 'A' },
    { id: 2, active: false, type: 'B' },
  ];
}

function handleTypeA(item) { console.log('Type A:', item); }
function handleTypeB(item) { console.log('Type B:', item); }
function handleDefault(item) { console.log('Default:', item); }

main();
`
  );

  // C file with unsafe patterns
  await fs.writeFile(
    path.join(testWorkspace, 'src/buffer.c'),
    `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void process_input(char *input) {
    char buffer[256];
    strcpy(buffer, input);  // Unsafe: buffer overflow
    printf("Processed: %s\\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <input>\\n", argv[0]);
        return 1;
    }
    
    char *data = malloc(1024);  // Manual memory management
    if (data == NULL) {
        return 1;
    }
    
    sprintf(data, "Input: %s", argv[1]);  // Unsafe: potential overflow
    process_input(data);
    
    free(data);
    return 0;
}
`
  );

  // TypeScript file
  await fs.writeFile(
    path.join(testWorkspace, 'src/app.ts'),
    `
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  findUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}

export { UserService, User };
`
  );

  // Python file
  await fs.writeFile(
    path.join(testWorkspace, 'lib/utils.py'),
    `
def calculate_fibonacci(n):
    """Calculate fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

def process_items(items):
    """Process a list of items."""
    results = []
    for item in items:
        if item.get('active'):
            if item.get('priority') == 'high':
                results.append(handle_high_priority(item))
            elif item.get('priority') == 'medium':
                results.append(handle_medium_priority(item))
            else:
                results.append(handle_low_priority(item))
    return results

def handle_high_priority(item):
    return {'status': 'processed', 'item': item}

def handle_medium_priority(item):
    return {'status': 'queued', 'item': item}

def handle_low_priority(item):
    return {'status': 'deferred', 'item': item}
`
  );

  console.log(`📁 Test workspace created: ${testWorkspace}`);
}

async function cleanup() {
  if (testWorkspace) {
    await fs.remove(testWorkspace);
    console.log('🧹 Cleaned up test workspace');
  }
}

async function runE2ETests() {
  console.log('🧪 Enterprise Scale Modules E2E Test (v5.5.0+)\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  async function test(name, fn) {
    process.stdout.write(`  ${name}... `);
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      console.log(`✅ (${duration}ms)`);
      results.passed++;
      results.tests.push({ name, status: 'passed', duration });
    } catch (error) {
      const duration = Date.now() - start;
      console.log(`❌ (${duration}ms)`);
      console.log(`    Error: ${error.message}`);
      results.failed++;
      results.tests.push({
        name,
        status: 'failed',
        duration,
        error: error.message,
      });
    }
  }

  // =========================================================================
  // LargeProjectAnalyzer Tests
  // =========================================================================
  console.log('\n📊 LargeProjectAnalyzer Tests:');

  await test('Create analyzer instance', async () => {
    const analyzer = new LargeProjectAnalyzer(testWorkspace);
    if (!analyzer) throw new Error('Failed to create analyzer');
  });

  await test('Detect project scale', async () => {
    const analyzer = new LargeProjectAnalyzer(testWorkspace);
    const scale = await analyzer.detectProjectScale();
    if (!['small', 'medium', 'large', 'massive'].includes(scale)) {
      throw new Error(`Invalid scale: ${scale}`);
    }
    console.log(`\n    Scale: ${scale}`);
  });

  await test('Scan files', async () => {
    const analyzer = new LargeProjectAnalyzer(testWorkspace);
    const files = await analyzer.scanFiles();
    if (!Array.isArray(files)) {
      throw new Error('scanFiles should return array');
    }
    console.log(`\n    Files found: ${files.length}`);
  });

  await test('Analyze project', async () => {
    const analyzer = new LargeProjectAnalyzer(testWorkspace);
    const result = await analyzer.analyze();
    if (!result) throw new Error('No analysis result');
    if (typeof result.totalFiles !== 'number') {
      throw new Error('Missing totalFiles');
    }
    console.log(`\n    Total files: ${result.totalFiles}`);
    console.log(`    Languages: ${Object.keys(result.byLanguage || {}).join(', ')}`);
  });

  await test('Thresholds are defined', async () => {
    if (!LARGE_PROJECT_THRESHOLDS) {
      throw new Error('Thresholds not exported');
    }
    if (!LARGE_PROJECT_THRESHOLDS.SMALL) {
      throw new Error('SMALL threshold missing');
    }
  });

  // =========================================================================
  // ComplexityAnalyzer Tests
  // =========================================================================
  console.log('\n🧠 ComplexityAnalyzer Tests:');

  await test('Create complexity analyzer', async () => {
    const analyzer = new ComplexityAnalyzer();
    if (!analyzer) throw new Error('Failed to create analyzer');
  });

  await test('Calculate cyclomatic complexity', async () => {
    const analyzer = new ComplexityAnalyzer();
    const code = `
      function test(a, b) {
        if (a > 0) {
          if (b > 0) {
            return a + b;
          } else {
            return a - b;
          }
        }
        return 0;
      }
    `;
    const complexity = analyzer.calculateCyclomaticComplexity(code, 'javascript');
    if (typeof complexity !== 'number' || complexity < 1) {
      throw new Error(`Invalid complexity: ${complexity}`);
    }
    console.log(`\n    Cyclomatic complexity: ${complexity}`);
  });

  await test('Calculate cognitive complexity', async () => {
    const analyzer = new ComplexityAnalyzer();
    const code = `
      function process(items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].active) {
            if (items[i].type === 'A') {
              console.log('A');
            } else {
              console.log('Other');
            }
          }
        }
      }
    `;
    const complexity = analyzer.calculateCognitiveComplexity(code, 'javascript');
    if (typeof complexity !== 'number') {
      throw new Error(`Invalid cognitive complexity: ${complexity}`);
    }
    console.log(`\n    Cognitive complexity: ${complexity}`);
  });

  await test('Analyze file complexity', async () => {
    const analyzer = new ComplexityAnalyzer();
    const result = await analyzer.analyzeFile(path.join(testWorkspace, 'src/main.js'));
    if (!result) throw new Error('No result');
    if (typeof result.cyclomatic !== 'number') {
      throw new Error('Missing cyclomatic');
    }
    console.log(
      `\n    File complexity - Cyclomatic: ${result.cyclomatic}, Cognitive: ${result.cognitive}`
    );
  });

  await test('Thresholds are defined', async () => {
    if (!COMPLEXITY_THRESHOLDS) {
      throw new Error('Thresholds not exported');
    }
    if (!COMPLEXITY_THRESHOLDS.CYCLOMATIC) {
      throw new Error('CYCLOMATIC threshold missing');
    }
  });

  // =========================================================================
  // RustMigrationGenerator Tests
  // =========================================================================
  console.log('\n🦀 RustMigrationGenerator Tests:');

  await test('Create Rust migration generator', async () => {
    const generator = new RustMigrationGenerator(testWorkspace);
    if (!generator) throw new Error('Failed to create generator');
  });

  await test('Detect unsafe patterns in C code', async () => {
    const generator = new RustMigrationGenerator(testWorkspace);
    const cFile = path.join(testWorkspace, 'src/buffer.c');
    const patterns = await generator.detectUnsafePatterns(cFile);
    if (!Array.isArray(patterns)) {
      throw new Error('Should return array');
    }
    console.log(`\n    Unsafe patterns found: ${patterns.length}`);
    if (patterns.length > 0) {
      console.log(`    Types: ${[...new Set(patterns.map(p => p.type))].join(', ')}`);
    }
  });

  await test('Calculate risk score', async () => {
    const generator = new RustMigrationGenerator(testWorkspace);
    const cFile = path.join(testWorkspace, 'src/buffer.c');
    const analysis = await generator.analyzeFile(cFile);
    if (typeof analysis.riskScore !== 'number') {
      throw new Error('Missing risk score');
    }
    console.log(`\n    Risk score: ${analysis.riskScore}`);
  });

  await test('UNSAFE_PATTERNS constant exported', async () => {
    if (!UNSAFE_PATTERNS) {
      throw new Error('UNSAFE_PATTERNS not exported');
    }
    if (!Array.isArray(UNSAFE_PATTERNS)) {
      throw new Error('Should be array');
    }
    console.log(`\n    Pattern categories: ${UNSAFE_PATTERNS.length}`);
  });

  // =========================================================================
  // HierarchicalReporter Tests
  // =========================================================================
  console.log('\n📋 HierarchicalReporter Tests:');

  await test('Create hierarchical reporter', async () => {
    const reporter = new HierarchicalReporter();
    if (!reporter) throw new Error('Failed to create reporter');
  });

  await test('Generate markdown report', async () => {
    const reporter = new HierarchicalReporter();
    const report = await reporter.generateReport(testWorkspace, {
      format: 'markdown',
    });
    if (!report) throw new Error('No report generated');
    if (typeof report.content !== 'string') {
      throw new Error('Report should have content string');
    }
    console.log(`\n    Report length: ${report.content.length} chars`);
  });

  await test('Generate JSON report', async () => {
    const reporter = new HierarchicalReporter();
    const report = await reporter.generateReport(testWorkspace, {
      format: 'json',
    });
    if (!report) throw new Error('No report generated');
    console.log(`\n    Report format: ${report.format}`);
  });

  await test('Build hierarchy', async () => {
    const reporter = new HierarchicalReporter();
    const hierarchy = await reporter.buildHierarchy(testWorkspace);
    if (!hierarchy) throw new Error('No hierarchy');
    if (!hierarchy.name) throw new Error('Hierarchy should have name');
    console.log(`\n    Root: ${hierarchy.name}, Children: ${(hierarchy.children || []).length}`);
  });

  // =========================================================================
  // Integration Test
  // =========================================================================
  console.log('\n🔗 Integration Tests:');

  await test('Full analysis pipeline', async () => {
    // Step 1: Analyze project scale
    const projectAnalyzer = new LargeProjectAnalyzer(testWorkspace);
    const projectResult = await projectAnalyzer.analyze();

    // Step 2: Analyze complexity of JS files
    const complexityAnalyzer = new ComplexityAnalyzer();
    const complexityResults = [];
    for (const file of projectResult.files || []) {
      if (file.endsWith('.js')) {
        const result = await complexityAnalyzer.analyzeFile(file);
        complexityResults.push(result);
      }
    }

    // Step 3: Check for unsafe C patterns
    const rustGenerator = new RustMigrationGenerator(testWorkspace);
    const cFiles = (projectResult.files || []).filter(f => f.endsWith('.c'));
    let totalRisk = 0;
    for (const cFile of cFiles) {
      const analysis = await rustGenerator.analyzeFile(cFile);
      totalRisk += analysis.riskScore || 0;
    }

    // Step 4: Generate report
    const reporter = new HierarchicalReporter();
    const report = await reporter.generateReport(testWorkspace, {
      format: 'markdown',
      includeHotspots: true,
    });

    console.log(`\n    Files analyzed: ${projectResult.totalFiles}`);
    console.log(`    JS complexity results: ${complexityResults.length}`);
    console.log(`    C files risk score: ${totalRisk}`);
    console.log(`    Report generated: ${report.content.length} chars`);
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`  ✅ Passed: ${results.passed}`);
  console.log(`  ❌ Failed: ${results.failed}`);
  console.log(`  📈 Total: ${results.passed + results.failed}`);
  console.log('='.repeat(60));

  return results;
}

// Jest test wrapper
describe('Enterprise Scale E2E Tests', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await cleanup();
  });

  test('LargeProjectAnalyzer works correctly', async () => {
    const analyzer = new LargeProjectAnalyzer(testWorkspace);
    const result = await analyzer.analyze();
    expect(result).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(typeof result.stats.totalFiles).toBe('number');
  });

  test('ComplexityAnalyzer calculates complexity', async () => {
    const analyzer = new ComplexityAnalyzer();
    const code = 'function test() { if (true) { return 1; } return 0; }';
    const complexity = analyzer.calculateCyclomaticComplexity(code, 'javascript');
    expect(typeof complexity).toBe('number');
    expect(complexity).toBeGreaterThan(0);
  });

  test('RustMigrationGenerator analyzes unsafe patterns', async () => {
    const generator = new RustMigrationGenerator(testWorkspace);
    const cFile = path.join(testWorkspace, 'src/buffer.c');
    const analysis = await generator.analyzeFile(cFile);
    expect(analysis).toBeDefined();
    expect(Array.isArray(analysis.unsafePatterns)).toBe(true);
    expect(analysis.unsafePatterns.length).toBeGreaterThan(0);
  });

  test('HierarchicalReporter generates report', async () => {
    const reporter = new HierarchicalReporter();
    const report = reporter.generateReport(
      { files: [], projectPath: testWorkspace },
      { format: 'markdown' }
    );
    expect(report).toBeDefined();
    expect(report.summary).toBeDefined();
    expect(report.generatedAt).toBeDefined();
  });

  test('Full integration pipeline works', async () => {
    const projectAnalyzer = new LargeProjectAnalyzer(testWorkspace);
    const projectResult = await projectAnalyzer.analyze();
    expect(projectResult.stats.totalFiles).toBeGreaterThan(0);

    const reporter = new HierarchicalReporter();
    const report = reporter.generateReport(
      { files: [], projectPath: testWorkspace },
      { format: 'json' }
    );
    expect(report).toBeDefined();
  });
});

// CLI runner
if (require.main === module) {
  (async () => {
    try {
      await setup();
      const results = await runE2ETests();
      await cleanup();
      process.exit(results.failed > 0 ? 1 : 0);
    } catch (error) {
      console.error('❌ E2E Test failed:', error);
      await cleanup();
      process.exit(1);
    }
  })();
}

module.exports = { runE2ETests };
