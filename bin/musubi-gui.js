#!/usr/bin/env node

/**
 * @fileoverview MUSUBI Web GUI CLI
 * @description Command-line interface for the Web GUI Dashboard
 * @module bin/musubi-gui
 */

const { Command } = require('commander');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('musubi-gui')
  .description('MUSUBI Web GUI Dashboard - Visual interface for SDD workflow')
  .version('0.1.0');

/**
 * Start command - Launch the GUI server
 */
program
  .command('start')
  .description('Start the Web GUI server')
  .option('-p, --port <port>', 'Server port', '3000')
  .option('-d, --dir <directory>', 'Project directory', process.cwd())
  .option('--no-open', 'Do not open browser automatically')
  .action(async (options) => {
    try {
      const Server = require('../src/gui/server');
      const projectPath = path.resolve(options.dir);
      
      console.log(chalk.blue('🔮 MUSUBI Web GUI'));
      console.log(chalk.gray(`Project: ${projectPath}`));
      
      const server = new Server(projectPath, {
        port: parseInt(options.port, 10),
      });
      
      await server.start();
      
      console.log(chalk.green(`\n✓ Server running at http://localhost:${options.port}`));
      console.log(chalk.gray('Press Ctrl+C to stop\n'));
      
      // Open browser if requested
      if (options.open !== false) {
        const open = await import('open');
        await open.default(`http://localhost:${options.port}`);
      }
      
      // Handle shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\nShutting down...'));
        await server.stop();
        process.exit(0);
      });
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Build command - Build the frontend
 */
program
  .command('build')
  .description('Build the frontend for production')
  .option('-o, --outdir <directory>', 'Output directory', 'dist')
  .action(async (options) => {
    try {
      const { execSync } = require('child_process');
      const guiDir = path.join(__dirname, '..', 'src', 'gui', 'client');
      
      console.log(chalk.blue('Building frontend...'));
      
      // Check if client directory exists
      const fs = require('fs');
      if (!fs.existsSync(guiDir)) {
        console.log(chalk.yellow('Frontend client not found. Creating minimal build...'));
        return;
      }
      
      execSync('npm run build', {
        cwd: guiDir,
        stdio: 'inherit',
      });
      
      console.log(chalk.green(`✓ Frontend built to ${options.outdir}`));
    } catch (error) {
      console.error(chalk.red(`Build failed: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Dev command - Start development mode with hot reload
 */
program
  .command('dev')
  .description('Start in development mode with hot reload')
  .option('-p, --port <port>', 'Server port', '3000')
  .option('-d, --dir <directory>', 'Project directory', process.cwd())
  .action(async (options) => {
    try {
      const Server = require('../src/gui/server');
      const projectPath = path.resolve(options.dir);
      
      console.log(chalk.blue('🔮 MUSUBI Web GUI (Development Mode)'));
      console.log(chalk.gray(`Project: ${projectPath}`));
      
      const server = new Server(projectPath, {
        port: parseInt(options.port, 10),
        dev: true,
      });
      
      await server.start();
      
      console.log(chalk.green(`\n✓ Server running at http://localhost:${options.port}`));
      console.log(chalk.cyan('Hot reload enabled'));
      console.log(chalk.gray('Press Ctrl+C to stop\n'));
      
      // Handle shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\nShutting down...'));
        await server.stop();
        process.exit(0);
      });
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Status command - Show project status
 */
program
  .command('status')
  .description('Show project status summary')
  .option('-d, --dir <directory>', 'Project directory', process.cwd())
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const ProjectScanner = require('../src/gui/services/project-scanner');
      const projectPath = path.resolve(options.dir);
      
      const scanner = new ProjectScanner(projectPath);
      const project = await scanner.scan();
      
      if (options.json) {
        console.log(JSON.stringify(project, null, 2));
        return;
      }
      
      console.log(chalk.blue('\n🔮 MUSUBI Project Status\n'));
      console.log(chalk.white(`Project: ${chalk.bold(project.name)}`));
      console.log(chalk.white(`Path: ${project.path}`));
      console.log('');
      
      if (project.hasSteering) {
        console.log(chalk.green('✓ Steering directory found'));
        if (project.constitution) {
          console.log(chalk.green(`  ✓ Constitution: ${project.constitution.articles.length} articles`));
        }
        if (project.steering) {
          const docs = ['product', 'structure', 'tech'].filter(d => project.steering[d]);
          console.log(chalk.green(`  ✓ Documents: ${docs.join(', ')}`));
        }
      } else {
        console.log(chalk.yellow('⚠ No steering directory (run musubi init)'));
      }
      
      if (project.hasSpecs) {
        console.log(chalk.green(`✓ Specs: ${project.specs.length} specification files`));
        
        let totalReqs = 0;
        let totalTasks = 0;
        let completedTasks = 0;
        
        for (const spec of project.specs) {
          totalReqs += spec.requirements.length;
          totalTasks += spec.tasks.length;
          completedTasks += spec.tasks.filter(t => t.completed).length;
        }
        
        console.log(chalk.white(`  • Requirements: ${totalReqs}`));
        console.log(chalk.white(`  • Tasks: ${completedTasks}/${totalTasks} completed`));
      } else {
        console.log(chalk.gray('○ No specs yet'));
      }
      
      console.log('');
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Matrix command - Show traceability matrix
 */
program
  .command('matrix')
  .description('Display traceability matrix')
  .option('-d, --dir <directory>', 'Project directory', process.cwd())
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const TraceabilityService = require('../src/gui/services/traceability-service');
      const projectPath = path.resolve(options.dir);
      
      const service = new TraceabilityService(projectPath);
      const matrix = await service.buildMatrix();
      
      if (options.json) {
        console.log(JSON.stringify(matrix, null, 2));
        return;
      }
      
      console.log(chalk.blue('\n🔮 Traceability Matrix\n'));
      
      const coverage = await service.getCoverage();
      console.log(chalk.white('Coverage:'));
      console.log(chalk.white(`  Total Requirements: ${coverage.total}`));
      console.log(chalk.white(`  Linked: ${coverage.linked} (${coverage.linkedPercent}%)`));
      console.log(chalk.white(`  Implemented: ${coverage.implemented} (${coverage.implementedPercent}%)`));
      console.log('');
      
      if (matrix.requirements.length === 0) {
        console.log(chalk.gray('No requirements found.'));
        return;
      }
      
      console.log(chalk.white('Requirements:'));
      for (const req of matrix.requirements) {
        const statusColor = req.status === 'implemented' ? 'green' : 
                           req.status === 'tasked' ? 'yellow' : 
                           req.status === 'designed' ? 'cyan' : 'gray';
        console.log(chalk[statusColor](`  ${req.id}: ${req.title} [${req.status}]`));
        
        if (req.links.designs.length > 0) {
          console.log(chalk.gray(`    → Designs: ${req.links.designs.map(d => d.id).join(', ')}`));
        }
        if (req.links.tasks.length > 0) {
          console.log(chalk.gray(`    → Tasks: ${req.links.tasks.map(t => t.id).join(', ')}`));
        }
      }
      
      console.log('');
      
      const gaps = await service.findGaps();
      if (gaps.length > 0) {
        console.log(chalk.yellow('Gaps:'));
        for (const gap of gaps) {
          console.log(chalk.yellow(`  ⚠ ${gap.message}`));
        }
        console.log('');
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
