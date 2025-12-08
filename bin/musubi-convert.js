#!/usr/bin/env node

/**
 * MUSUBI Convert CLI
 * 
 * Convert between MUSUBI and Spec Kit formats
 * 
 * Usage:
 *   musubi-convert from-speckit <path> [--output <dir>]
 *   musubi-convert to-speckit [--output <dir>]
 *   musubi-convert validate <format> [path]
 *   musubi-convert roundtrip <path>
 */

'use strict';

const { program } = require('commander');
const { 
  convertFromSpeckit, 
  convertToSpeckit, 
  validateFormat, 
  testRoundtrip,
  convertFromOpenAPI,
} = require('../src/converters');
const packageJson = require('../package.json');

program
  .name('musubi-convert')
  .description('Convert between MUSUBI and Spec Kit formats')
  .version(packageJson.version);

program
  .command('from-speckit <path>')
  .description('Convert Spec Kit project to MUSUBI format')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--dry-run', 'Preview changes without writing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Overwrite existing files')
  .option('--preserve-raw', 'Keep original content in comments')
  .action(async (sourcePath, options) => {
    try {
      console.log('🔄 Converting Spec Kit → MUSUBI...\n');
      
      const result = await convertFromSpeckit(sourcePath, {
        output: options.output,
        dryRun: options.dryRun,
        force: options.force,
        verbose: options.verbose,
        preserveRaw: options.preserveRaw,
      });
      
      console.log(`\n✅ Conversion complete!`);
      console.log(`   Files written: ${result.filesConverted}`);
      console.log(`   Output: ${result.outputPath}`);
      
      if (result.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
        result.warnings.forEach(w => console.log(`   - ${w}`));
      }
    } catch (error) {
      console.error(`\n❌ Conversion failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('to-speckit')
  .description('Convert current MUSUBI project to Spec Kit format')
  .option('-s, --source <dir>', 'Source directory', '.')
  .option('-o, --output <dir>', 'Output directory (will create .specify inside)', '.')
  .option('--dry-run', 'Preview changes without writing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Overwrite existing files')
  .option('--preserve-raw', 'Keep original content in comments')
  .action(async (options) => {
    try {
      console.log('🔄 Converting MUSUBI → Spec Kit...\n');
      
      const result = await convertToSpeckit({
        source: options.source,
        output: options.output,
        dryRun: options.dryRun,
        force: options.force,
        verbose: options.verbose,
        preserveRaw: options.preserveRaw,
      });
      
      console.log(`\n✅ Conversion complete!`);
      console.log(`   Files written: ${result.filesConverted}`);
      console.log(`   Output: ${result.outputPath}`);
      
      if (result.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
        result.warnings.forEach(w => console.log(`   - ${w}`));
      }
    } catch (error) {
      console.error(`\n❌ Conversion failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('validate <format> [path]')
  .description('Validate project format (speckit or musubi)')
  .option('-v, --verbose', 'Verbose output')
  .action(async (format, projectPath, options) => {
    try {
      const path = projectPath || '.';
      console.log(`🔍 Validating ${format} project at ${path}...\n`);
      
      const result = await validateFormat(format, path);
      
      if (result.valid) {
        console.log(`✅ Valid ${format} project`);
      } else {
        console.log(`❌ Invalid ${format} project`);
        console.log('\nErrors:');
        result.errors.forEach(e => console.log(`  - ${e}`));
        process.exit(1);
      }
      
      if (result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach(w => console.log(`  - ${w}`));
      }
    } catch (error) {
      console.error(`\n❌ Validation failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('from-openapi <specPath>')
  .description('Convert OpenAPI/Swagger specification to MUSUBI requirements')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--dry-run', 'Preview changes without writing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Overwrite existing files')
  .option('--feature <name>', 'Create as single feature with given name')
  .action(async (specPath, options) => {
    try {
      console.log('🔄 Converting OpenAPI → MUSUBI...\n');
      
      const result = await convertFromOpenAPI(specPath, {
        output: options.output,
        dryRun: options.dryRun,
        force: options.force,
        verbose: options.verbose,
        featureName: options.feature,
      });
      
      console.log(`\n✅ Conversion complete!`);
      console.log(`   Features created: ${result.featuresCreated}`);
      console.log(`   Requirements: ${result.requirementsCreated}`);
      console.log(`   Output: ${result.outputPath}`);
      
      if (result.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
        result.warnings.forEach(w => console.log(`   - ${w}`));
      }
    } catch (error) {
      console.error(`\n❌ Conversion failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('roundtrip <path>')
  .description('Test roundtrip conversion (A → B → A\')')
  .option('-v, --verbose', 'Show detailed diff')
  .action(async (projectPath, options) => {
    try {
      console.log(`🔄 Testing roundtrip conversion at ${projectPath}...\n`);
      
      const result = await testRoundtrip(projectPath, {
        verbose: options.verbose,
      });
      
      if (result.passed) {
        console.log(`✅ Roundtrip test PASSED`);
      } else {
        console.log(`❌ Roundtrip test FAILED`);
      }
      
      console.log(`   Similarity: ${result.similarity}%`);
      
      if (!result.passed || options.verbose) {
        if (result.differences.length > 0) {
          console.log('\n📋 Differences:');
          result.differences.forEach(d => console.log(`   - ${d}`));
        }
      }
      
      if (!result.passed) {
        process.exit(1);
      }
    } catch (error) {
      console.error(`\n❌ Roundtrip test failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
