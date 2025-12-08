#!/usr/bin/env node

/**
 * MUSUBI Constitutional Validator CLI
 *
 * Validates project compliance with 9 Constitutional Articles
 * Enforces Phase -1 Gates and SDD governance rules
 *
 * Usage:
 *   musubi-validate constitution    # Validate all 9 articles
 *   musubi-validate article <1-9>   # Validate specific article
 *   musubi-validate gates           # Validate Phase -1 Gates
 *   musubi-validate complexity      # Validate complexity limits
 *   musubi-validate all             # Run all validations
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ConstitutionValidator = require('../src/validators/constitution');

const program = new Command();

program
  .name('musubi-validate')
  .description('Constitutional Governance Validator - Enforce 9 Immutable Articles')
  .version('0.7.0');

// Main validation command
program
  .command('constitution')
  .description('Validate all 9 Constitutional Articles')
  .option('-v, --verbose', 'Show detailed validation results')
  .option('-f, --format <type>', 'Output format (console|json|markdown)', 'console')
  .action(async options => {
    try {
      const validator = new ConstitutionValidator(process.cwd());
      const results = await validator.validateAll();

      displayResults('Constitutional Validation', results, options);
      process.exit(results.passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Validation error:'), error.message);
      process.exit(1);
    }
  });

// Article-specific validation
program
  .command('article <number>')
  .description('Validate specific Constitutional Article (1-9)')
  .option('-v, --verbose', 'Show detailed validation results')
  .option('-f, --format <type>', 'Output format (console|json|markdown)', 'console')
  .action(async (number, options) => {
    try {
      const articleNum = parseInt(number);
      if (articleNum < 1 || articleNum > 9) {
        console.error(chalk.red('✗ Article number must be between 1 and 9'));
        process.exit(1);
      }

      const validator = new ConstitutionValidator(process.cwd());
      const result = await validator.validateArticle(articleNum);

      displayResults(`Article ${articleNum} Validation`, result, options);
      process.exit(result.passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Validation error:'), error.message);
      process.exit(1);
    }
  });

// Phase -1 Gates validation
program
  .command('gates')
  .description('Validate Phase -1 Gates (Simplicity, Anti-Abstraction)')
  .option('-v, --verbose', 'Show detailed validation results')
  .option('-f, --format <type>', 'Output format (console|json|markdown)', 'console')
  .action(async options => {
    try {
      const validator = new ConstitutionValidator(process.cwd());
      const results = await validator.validateGates();

      displayResults('Phase -1 Gates Validation', results, options);
      process.exit(results.passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Validation error:'), error.message);
      process.exit(1);
    }
  });

// Complexity validation
program
  .command('complexity')
  .description('Validate complexity limits (modules ≤1500 lines, functions ≤50 lines)')
  .option('-v, --verbose', 'Show detailed validation results')
  .option('-f, --format <type>', 'Output format (console|json|markdown)', 'console')
  .action(async options => {
    try {
      const validator = new ConstitutionValidator(process.cwd());
      const results = await validator.validateComplexity();

      displayResults('Complexity Validation', results, options);
      process.exit(results.passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Validation error:'), error.message);
      process.exit(1);
    }
  });

// Score validation (numeric score output for CI/CD)
program
  .command('score')
  .description('Calculate constitutional compliance score (0-100)')
  .option('-f, --format <type>', 'Output format (console|json)', 'console')
  .option('--threshold <number>', 'Minimum passing score (default: 70)', '70')
  .action(async options => {
    try {
      const validator = new ConstitutionValidator(process.cwd());
      
      console.log(chalk.dim('📊 Calculating constitutional compliance score...\n'));

      const [constitutionResults, gatesResults, complexityResults] = await Promise.all([
        validator.validateAll(),
        validator.validateGates(),
        validator.validateComplexity(),
      ]);

      // Calculate weighted score
      const constitutionScore = constitutionResults.passed ? 100 : 
        Math.max(0, 100 - (constitutionResults.violations?.length || 0) * 10);
      const gatesScore = gatesResults.passed ? 100 : 
        Math.max(0, 100 - (gatesResults.violations?.length || 0) * 15);
      const complexityScore = complexityResults.passed ? 100 : 
        Math.max(0, 100 - (complexityResults.violations?.length || 0) * 5);

      // Weighted average: Constitution 50%, Gates 30%, Complexity 20%
      const overallScore = Math.round(
        constitutionScore * 0.5 + gatesScore * 0.3 + complexityScore * 0.2
      );

      const threshold = parseInt(options.threshold) || 70;
      const passed = overallScore >= threshold;

      const result = {
        score: overallScore,
        pass: passed,
        threshold,
        breakdown: {
          constitution: { score: constitutionScore, weight: '50%' },
          gates: { score: gatesScore, weight: '30%' },
          complexity: { score: complexityScore, weight: '20%' }
        },
        timestamp: new Date().toISOString()
      };

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const scoreBar = '█'.repeat(Math.floor(overallScore / 10)) + 
                        '░'.repeat(10 - Math.floor(overallScore / 10));
        
        console.log(chalk.bold('Constitutional Compliance Score\n'));
        console.log(chalk.bold('━'.repeat(50)));
        console.log(`\n${scoreBar} ${chalk.bold(overallScore)}%\n`);
        
        console.log(chalk.dim('Breakdown:'));
        console.log(`  Constitution (50%): ${constitutionScore}%`);
        console.log(`  Gates (30%):        ${gatesScore}%`);
        console.log(`  Complexity (20%):   ${complexityScore}%`);
        
        console.log('\n' + chalk.bold('━'.repeat(50)));
        
        if (passed) {
          console.log(chalk.bold.green(`\n✓ PASSED (threshold: ${threshold}%)\n`));
        } else {
          console.log(chalk.bold.red(`\n✗ FAILED (threshold: ${threshold}%, got: ${overallScore}%)\n`));
        }
      }

      process.exit(passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Score calculation error:'), error.message);
      process.exit(1);
    }
  });

// All validations
program
  .command('all')
  .description('Run all validations (constitution + gates + complexity)')
  .option('-v, --verbose', 'Show detailed validation results')
  .option('-f, --format <type>', 'Output format (console|json|markdown)', 'console')
  .action(async options => {
    try {
      const validator = new ConstitutionValidator(process.cwd());

      console.log(chalk.bold('\n🔍 Running comprehensive constitutional validation...\n'));

      const [constitutionResults, gatesResults, complexityResults] = await Promise.all([
        validator.validateAll(),
        validator.validateGates(),
        validator.validateComplexity(),
      ]);

      const allResults = {
        constitution: constitutionResults,
        gates: gatesResults,
        complexity: complexityResults,
        passed: constitutionResults.passed && gatesResults.passed && complexityResults.passed,
      };

      displayAllResults(allResults, options);
      process.exit(allResults.passed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('✗ Validation error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Display validation results
 */
function displayResults(title, results, options) {
  if (options.format === 'json') {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (options.format === 'markdown') {
    displayMarkdown(title, results);
    return;
  }

  // Console format (default)
  console.log(chalk.bold(`\n📋 ${title}\n`));

  if (results.passed) {
    console.log(chalk.green('✓ All checks passed\n'));
  } else {
    console.log(chalk.red('✗ Validation failed\n'));
  }

  if (options.verbose && results.details) {
    console.log(chalk.bold('Details:'));
    results.details.forEach(detail => {
      const icon = detail.passed ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${icon} ${detail.message}`);
    });
    console.log();
  }

  if (results.violations && results.violations.length > 0) {
    console.log(chalk.bold.red('Violations:'));
    results.violations.forEach(violation => {
      console.log(chalk.red(`  • ${violation}`));
    });
    console.log();
  }

  if (results.warnings && results.warnings.length > 0) {
    console.log(chalk.bold.yellow('Warnings:'));
    results.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ⚠ ${warning}`));
    });
    console.log();
  }

  if (results.summary) {
    console.log(chalk.bold('Summary:'));
    console.log(chalk.dim(results.summary));
    console.log();
  }
}

/**
 * Display all validation results
 */
function displayAllResults(allResults, options) {
  if (options.format === 'json') {
    console.log(JSON.stringify(allResults, null, 2));
    return;
  }

  console.log(chalk.bold('\n📊 Comprehensive Validation Results\n'));
  console.log(chalk.bold('━'.repeat(60)));

  // Constitution
  const constitutionIcon = allResults.constitution.passed ? chalk.green('✓') : chalk.red('✗');
  console.log(
    `\n${constitutionIcon} ${chalk.bold('Constitutional Articles')}: ${allResults.constitution.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`
  );

  // Gates
  const gatesIcon = allResults.gates.passed ? chalk.green('✓') : chalk.red('✗');
  console.log(
    `${gatesIcon} ${chalk.bold('Phase -1 Gates')}: ${allResults.gates.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`
  );

  // Complexity
  const complexityIcon = allResults.complexity.passed ? chalk.green('✓') : chalk.red('✗');
  console.log(
    `${complexityIcon} ${chalk.bold('Complexity Limits')}: ${allResults.complexity.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`
  );

  console.log('\n' + chalk.bold('━'.repeat(60)));

  if (allResults.passed) {
    console.log(chalk.bold.green('\n✓ ALL VALIDATIONS PASSED\n'));
    console.log(chalk.dim('Your project complies with all 9 Constitutional Articles.'));
  } else {
    console.log(chalk.bold.red('\n✗ VALIDATION FAILURES DETECTED\n'));
    console.log(chalk.dim('Please address the violations above before proceeding.'));
  }

  console.log();
}

/**
 * Display results in Markdown format
 */
function displayMarkdown(title, results) {
  console.log(`# ${title}\n`);
  console.log(`**Status**: ${results.passed ? '✓ PASSED' : '✗ FAILED'}\n`);

  if (results.violations && results.violations.length > 0) {
    console.log('## Violations\n');
    results.violations.forEach(violation => {
      console.log(`- ${violation}`);
    });
    console.log();
  }

  if (results.warnings && results.warnings.length > 0) {
    console.log('## Warnings\n');
    results.warnings.forEach(warning => {
      console.log(`- ${warning}`);
    });
    console.log();
  }

  if (results.summary) {
    console.log('## Summary\n');
    console.log(results.summary);
    console.log();
  }
}

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
