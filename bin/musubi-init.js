#!/usr/bin/env node

/**
 * MUSUBI Initialization Script
 *
 * Initializes a new project with MUSUBI SDD tools:
 * - Creates .claude/skills/ with 25 specialized skills
 * - Creates .claude/commands/ with slash commands
 * - Creates steering/ directory with project memory
 * - Creates templates/ for documents
 * - Sets up constitutional governance
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

const TEMPLATE_DIR = path.join(__dirname, '..', 'src', 'templates');

async function main() {
  console.log(chalk.blue.bold('\n🎯 MUSUBI - Ultimate Specification Driven Development\n'));

  // Check if already initialized
  if (fs.existsSync('.claude/skills')) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'MUSUBI is already initialized. Overwrite?',
        default: false
      }
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      process.exit(0);
    }
  }

  // Collect project information
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A software project using MUSUBI SDD'
    },
    {
      type: 'list',
      name: 'projectType',
      message: 'Project type:',
      choices: ['Greenfield (0→1)', 'Brownfield (1→n)', 'Both']
    },
    {
      type: 'checkbox',
      name: 'skills',
      message: 'Select skills to install (all recommended):',
      choices: [
        { name: 'Core (orchestrator, steering, constitution-enforcer)', value: 'core', checked: true },
        { name: 'Requirements & Planning (requirements-analyst, project-manager, change-impact-analyzer)', value: 'requirements', checked: true },
        { name: 'Architecture & Design (system-architect, api-designer, database-schema-designer, ui-ux-designer)', value: 'architecture', checked: true },
        { name: 'Development (software-developer)', value: 'development', checked: true },
        { name: 'Quality & Review (test-engineer, code-reviewer, bug-hunter, quality-assurance, traceability-auditor)', value: 'quality', checked: true },
        { name: 'Security & Performance (security-auditor, performance-optimizer)', value: 'security', checked: true },
        { name: 'Infrastructure (devops-engineer, cloud-architect, database-administrator, site-reliability-engineer, release-coordinator)', value: 'infrastructure', checked: true },
        { name: 'Documentation (technical-writer, ai-ml-engineer)', value: 'documentation', checked: true }
      ]
    },
    {
      type: 'confirm',
      name: 'createSteering',
      message: 'Generate initial steering context?',
      default: true
    },
    {
      type: 'confirm',
      name: 'createConstitution',
      message: 'Create constitutional governance?',
      default: true
    }
  ]);

  console.log(chalk.green('\n✨ Initializing MUSUBI...\n'));

  // Create directory structure
  const dirs = [
    '.claude/skills',
    '.claude/commands',
    'steering',
    'steering/rules',
    'templates',
    'storage/specs',
    'storage/changes',
    'storage/features'
  ];

  for (const dir of dirs) {
    await fs.ensureDir(dir);
    console.log(chalk.gray(`  Created ${dir}/`));
  }

  // Copy skills based on selection
  const skillGroups = {
    core: ['orchestrator', 'steering', 'constitution-enforcer'],
    requirements: ['requirements-analyst', 'project-manager', 'change-impact-analyzer'],
    architecture: ['system-architect', 'api-designer', 'database-schema-designer', 'ui-ux-designer'],
    development: ['software-developer'],
    quality: ['test-engineer', 'code-reviewer', 'bug-hunter', 'quality-assurance', 'traceability-auditor'],
    security: ['security-auditor', 'performance-optimizer'],
    infrastructure: ['devops-engineer', 'cloud-architect', 'database-administrator', 'site-reliability-engineer', 'release-coordinator'],
    documentation: ['technical-writer', 'ai-ml-engineer']
  };

  let skillCount = 0;
  for (const group of answers.skills) {
    for (const skill of skillGroups[group]) {
      await copySkill(skill);
      skillCount++;
    }
  }

  console.log(chalk.green(`\n  Installed ${skillCount} skills`));

  // Copy slash commands
  await copyCommands();
  console.log(chalk.green('  Installed slash commands'));

  // Generate steering context
  if (answers.createSteering) {
    await generateSteering(answers);
    console.log(chalk.green('  Generated steering context'));
  }

  // Create constitution
  if (answers.createConstitution) {
    await createConstitution();
    console.log(chalk.green('  Created constitutional governance'));
  }

  // Create README
  await createReadme(answers);
  console.log(chalk.green('  Created MUSUBI.md guide'));

  // Success message
  console.log(chalk.blue.bold('\n✅ MUSUBI initialization complete!\n'));
  console.log(chalk.white('Next steps:'));
  console.log(chalk.gray('  1. Review steering/ context files'));
  console.log(chalk.gray('  2. Review steering/rules/constitution.md'));
  console.log(chalk.gray('  3. Start using Claude Code with MUSUBI skills'));
  console.log(chalk.gray('  4. Try slash commands: /sdd-requirements, /sdd-design\n'));
  console.log(chalk.cyan('Learn more: https://github.com/your-org/musubi\n'));
}

async function copySkill(skillName) {
  const srcDir = path.join(TEMPLATE_DIR, 'skills', skillName);
  const destDir = path.join('.claude', 'skills', skillName);
  await fs.copy(srcDir, destDir);
}

async function copyCommands() {
  const srcDir = path.join(TEMPLATE_DIR, 'commands');
  const destDir = path.join('.claude', 'commands');
  await fs.copy(srcDir, destDir);
}

async function generateSteering(answers) {
  const steeringTemplates = path.join(TEMPLATE_DIR, 'steering');

  // Copy and customize steering files
  const files = ['structure.md', 'tech.md', 'product.md'];
  for (const file of files) {
    let content = await fs.readFile(path.join(steeringTemplates, file), 'utf8');

    // Replace placeholders
    content = content.replace(/\{\{PROJECT_NAME\}\}/g, answers.projectName);
    content = content.replace(/\{\{DESCRIPTION\}\}/g, answers.description);
    content = content.replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0]);

    await fs.writeFile(path.join('steering', file), content);
  }
}

async function createConstitution() {
  const constitutionTemplate = path.join(TEMPLATE_DIR, 'constitution', 'constitution.md');
  await fs.copy(constitutionTemplate, 'steering/rules/constitution.md');
}

async function createReadme(answers) {
  const readme = `# MUSUBI - ${answers.projectName}

${answers.description}

## Initialized with MUSUBI SDD

This project uses **MUSUBI** (Ultimate Specification Driven Development) with ${answers.skills.length} skill groups.

### Available Skills

Check \`.claude/skills/\` directory for all installed skills.

### Slash Commands

- \`/sdd-steering\` - Generate/update project memory
- \`/sdd-requirements\` - Create EARS requirements
- \`/sdd-design\` - Generate C4 + ADR design
- \`/sdd-tasks\` - Break down into tasks
- \`/sdd-implement\` - Execute implementation
- \`/sdd-validate\` - Validate constitutional compliance

### Project Memory

- \`steering/structure.md\` - Architecture patterns
- \`steering/tech.md\` - Technology stack
- \`steering/product.md\` - Product context
- \`steering/rules/constitution.md\` - 9 Constitutional Articles

### Learn More

- [MUSUBI Documentation](https://github.com/your-org/musubi)
- [Constitutional Governance](steering/rules/constitution.md)
- [8-Stage SDD Workflow](steering/rules/workflow.md)

---

**Initialized**: ${new Date().toISOString().split('T')[0]}
**MUSUBI Version**: 0.1.0
`;

  await fs.writeFile('MUSUBI.md', readme);
}

main().catch(err => {
  console.error(chalk.red('\n❌ Initialization failed:'), err.message);
  process.exit(1);
});
