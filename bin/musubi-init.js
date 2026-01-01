#!/usr/bin/env node

/**
 * MUSUBI Initialization Script
 *
 * Initializes a new project with MUSUBI SDD tools for various AI coding agents:
 * - Claude Code: .claude/skills/ (25 skills) + .claude/commands/
 * - GitHub Copilot: .github/prompts/
 * - Cursor: .cursor/commands/
 * - Gemini CLI: .gemini/commands/
 * - Codex CLI: .codex/prompts/
 * - Qwen Code: .qwen/commands/
 * - Windsurf: .windsurf/workflows/
 *
 * All agents get:
 * - steering/ directory with project memory
 * - templates/ for documents
 * - Constitutional governance
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Import helpers from separate modules to reduce file size
const {
  fetchExternalSpec,
  fetchGitHubRepos,
  analyzeReposForImprovements,
  saveReferenceRepos,
  saveSpecReference,
  recommendLanguages,
} = require('../src/cli/init-helpers');

const { generateDependencyFiles, generateTechMd } = require('../src/cli/init-generators');

const TEMPLATE_DIR = path.join(__dirname, '..', 'src', 'templates');
const SHARED_TEMPLATE_DIR = path.join(TEMPLATE_DIR, 'shared');
const AGENTS_TEMPLATE_DIR = path.join(TEMPLATE_DIR, 'agents');

/**
 * Main initialization function
 * @param {object} agent - Agent definition from registry
 * @param {string} agentKey - Agent key (e.g., 'claude-code', 'cursor')
 * @param {object} options - Command options (spec, workspace, etc.)
 */
async function main(agent, agentKey, options = {}) {
  // Dynamic import for inquirer (ESM module)
  const inquirer = await import('inquirer');

  // If called directly without agent parameter, default to Claude Code
  if (!agent) {
    const { getAgentDefinition } = require('../src/agents/registry');
    agent = getAgentDefinition('claude-code');
    agentKey = 'claude-code';
  }

  console.log(chalk.blue.bold('\n🎯 MUSUBI - Ultimate Specification Driven Development\n'));
  console.log(chalk.white(`Initializing for: ${chalk.bold(agent.label)}\n`));

  // Handle external specification reference
  let externalSpec = null;
  if (options.spec) {
    console.log(chalk.cyan('📄 Fetching external specification...'));
    externalSpec = await fetchExternalSpec(options.spec);
    if (externalSpec.error) {
      console.log(chalk.yellow(`⚠️  Warning: ${externalSpec.error}`));
    } else {
      console.log(
        chalk.green(
          `✓ Loaded specification: ${externalSpec.metadata.summary?.title || externalSpec.source}`
        )
      );
      console.log(
        chalk.gray(`  Format: ${externalSpec.metadata.format}, Type: ${externalSpec.type}\n`)
      );
    }
  }

  // Handle GitHub repository references
  let referenceRepos = null;
  let repoAnalysis = null;
  if (options.references && options.references.length > 0) {
    console.log(chalk.cyan(`\n📚 Fetching ${options.references.length} GitHub reference(s)...`));
    referenceRepos = await fetchGitHubRepos(options.references);

    // Analyze repositories for improvements
    const validRepos = referenceRepos.filter(r => !r.error);
    if (validRepos.length > 0) {
      console.log(chalk.cyan('\n🔍 Analyzing repositories for patterns and improvements...'));
      repoAnalysis = analyzeReposForImprovements(validRepos);

      if (repoAnalysis.suggestions.length > 0) {
        console.log(
          chalk.green(`\n💡 Found ${repoAnalysis.suggestions.length} improvement suggestion(s):`)
        );
        for (const suggestion of repoAnalysis.suggestions.slice(0, 5)) {
          if (suggestion.type === 'architecture') {
            console.log(
              chalk.white(`  • ${suggestion.suggestion} (from ${suggestion.repos.join(', ')})`)
            );
          } else if (suggestion.type === 'technology') {
            console.log(
              chalk.white(`  • ${suggestion.suggestion} (used by ${suggestion.count} repo(s))`)
            );
          } else {
            console.log(chalk.white(`  • ${suggestion.suggestion}`));
          }
        }
      }
      console.log('');
    }
  }

  // Check if already initialized for this agent
  const agentDir = agent.layout.agentDir;
  if (fs.existsSync(agentDir)) {
    const { overwrite } = await inquirer.default.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `MUSUBI for ${agent.label} is already initialized. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      process.exit(0);
    }
  }

  // Collect project information
  const prompts = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: path.basename(process.cwd()),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A software project using MUSUBI SDD',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Documentation language:',
      choices: [
        { name: 'English', value: 'en' },
        { name: '日本語 (Japanese)', value: 'ja' },
        { name: '中文 (Chinese)', value: 'zh' },
        { name: '한국어 (Korean)', value: 'ko' },
        { name: 'Bahasa Indonesia (Indonesian)', value: 'id' },
        { name: 'Español (Spanish)', value: 'es' },
        { name: 'Deutsch (German)', value: 'de' },
        { name: 'Français (French)', value: 'fr' },
      ],
      default: 'en',
    },
    {
      type: 'list',
      name: 'projectStructure',
      message: 'Project structure:',
      choices: [
        { name: 'Single package', value: 'single' },
        { name: 'Workspace / Monorepo', value: 'workspace' },
        { name: 'Microservices', value: 'microservices' },
      ],
      default: options.workspace ? 'workspace' : 'single',
    },
    {
      type: 'list',
      name: 'projectType',
      message: 'Project type:',
      choices: ['Greenfield (0→1)', 'Brownfield (1→n)', 'Both'],
    },
    {
      type: 'list',
      name: 'techStackApproach',
      message: 'Technology stack approach:',
      choices: [
        { name: 'Single language', value: 'single' },
        { name: 'Multiple languages', value: 'multiple' },
        { name: 'Undecided (decide later)', value: 'undecided' },
        { name: 'Help me decide (recommend based on requirements)', value: 'recommend' },
      ],
      default: 'single',
    },
  ];

  // Template selection if project structure is workspace or microservices
  const templatePrompts = [
    {
      type: 'list',
      name: 'archTemplate',
      message: 'Select architecture template:',
      choices: answers => {
        if (answers.projectStructure === 'workspace') {
          return [
            { name: 'Basic Workspace (packages/)', value: 'workspace-basic' },
            { name: 'Layered (core/, api/, web/)', value: 'workspace-layered' },
            { name: 'Domain-Driven (domains/, shared/)', value: 'workspace-ddd' },
            { name: 'Full Stack (frontend/, backend/, shared/)', value: 'workspace-fullstack' },
          ];
        } else if (answers.projectStructure === 'microservices') {
          return [
            { name: 'Basic Services (services/)', value: 'microservices-basic' },
            { name: 'Gateway + Services', value: 'microservices-gateway' },
            { name: 'Event-Driven (services/, events/)', value: 'microservices-event' },
          ];
        }
        return [{ name: 'Standard', value: 'standard' }];
      },
      when: answers =>
        answers.projectStructure === 'workspace' || answers.projectStructure === 'microservices',
    },
  ];

  // Language selection based on approach
  const languageChoices = [
    { name: 'JavaScript/TypeScript', value: 'javascript' },
    { name: 'Python', value: 'python' },
    { name: 'Rust', value: 'rust' },
    { name: 'Go', value: 'go' },
    { name: 'Java/Kotlin', value: 'java' },
    { name: 'C#/.NET', value: 'csharp' },
    { name: 'C/C++', value: 'cpp' },
    { name: 'Swift', value: 'swift' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'PHP', value: 'php' },
    { name: 'Other', value: 'other' },
  ];

  // Recommendation questions for 'Help me decide' mode
  const recommendationPrompts = [
    {
      type: 'checkbox',
      name: 'appTypes',
      message: 'What type of application(s) are you building?',
      choices: [
        { name: 'Web Frontend (SPA, SSR)', value: 'web-frontend' },
        { name: 'Web Backend / API', value: 'web-backend' },
        { name: 'CLI Tool', value: 'cli' },
        { name: 'Desktop Application', value: 'desktop' },
        { name: 'Mobile App', value: 'mobile' },
        { name: 'Data Pipeline / ETL', value: 'data' },
        { name: 'AI/ML Application', value: 'ml' },
        { name: 'Embedded / IoT', value: 'embedded' },
        { name: 'Game Development', value: 'game' },
        { name: 'Systems / Infrastructure', value: 'systems' },
      ],
    },
    {
      type: 'list',
      name: 'performanceNeeds',
      message: 'Performance requirements:',
      choices: [
        { name: 'High performance / Low latency critical', value: 'high' },
        { name: 'Moderate (typical web app)', value: 'moderate' },
        { name: 'Rapid development prioritized', value: 'rapid' },
      ],
    },
    {
      type: 'checkbox',
      name: 'teamExpertise',
      message: 'Team expertise (select all that apply):',
      choices: languageChoices.filter(c => c.value !== 'other'),
    },
  ];

  // Get initial answers to determine language prompts
  const initialAnswers = await inquirer.default.prompt(prompts);
  let answers = { ...initialAnswers };

  // Handle tech stack approach
  if (answers.techStackApproach === 'single') {
    const langAnswer = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'primaryLanguage',
        message: 'Select primary language:',
        choices: languageChoices,
      },
    ]);
    answers.languages = [langAnswer.primaryLanguage];
  } else if (answers.techStackApproach === 'multiple') {
    const langAnswer = await inquirer.default.prompt([
      {
        type: 'checkbox',
        name: 'languages',
        message: 'Select languages (check all that apply):',
        choices: languageChoices,
        validate: input => (input.length > 0 ? true : 'Select at least one language'),
      },
    ]);
    answers.languages = langAnswer.languages;
  } else if (answers.techStackApproach === 'recommend') {
    // Ask recommendation questions
    const recAnswers = await inquirer.default.prompt(recommendationPrompts);
    const recommended = recommendLanguages(recAnswers);

    console.log(chalk.cyan('\n📊 Recommended languages based on your requirements:\n'));
    for (const rec of recommended) {
      console.log(chalk.white(`  ${rec.emoji} ${chalk.bold(rec.name)}: ${rec.reason}`));
    }
    console.log('');

    const confirmAnswer = await inquirer.default.prompt([
      {
        type: 'checkbox',
        name: 'languages',
        message: 'Confirm languages to use:',
        choices: recommended.map(r => ({ name: r.name, value: r.value, checked: true })),
      },
    ]);
    answers.languages = confirmAnswer.languages;
    answers.recommendationContext = recAnswers;
  } else {
    // undecided
    answers.languages = ['undecided'];
  }

  // Ask template questions if workspace or microservices
  if (answers.projectStructure === 'workspace' || answers.projectStructure === 'microservices') {
    const templateAnswer = await inquirer.default.prompt(templatePrompts);
    answers = { ...answers, ...templateAnswer };
  }

  // Continue with remaining prompts
  const remainingPrompts = [];
  if (agentKey === 'claude-code' && agent.layout.skillsDir) {
    remainingPrompts.push({
      type: 'checkbox',
      name: 'skills',
      message: 'Select skills to install (all recommended):',
      choices: [
        {
          name: 'Core (orchestrator, steering, constitution-enforcer)',
          value: 'core',
          checked: true,
        },
        {
          name: 'Requirements & Planning (requirements-analyst, project-manager, change-impact-analyzer)',
          value: 'requirements',
          checked: true,
        },
        {
          name: 'Architecture & Design (system-architect, api-designer, database-schema-designer, ui-ux-designer)',
          value: 'architecture',
          checked: true,
        },
        { name: 'Development (software-developer)', value: 'development', checked: true },
        {
          name: 'Quality & Review (test-engineer, code-reviewer, bug-hunter, quality-assurance, traceability-auditor)',
          value: 'quality',
          checked: true,
        },
        {
          name: 'Security & Performance (security-auditor, performance-optimizer)',
          value: 'security',
          checked: true,
        },
        {
          name: 'Infrastructure (devops-engineer, cloud-architect, database-administrator, site-reliability-engineer, release-coordinator)',
          value: 'infrastructure',
          checked: true,
        },
        {
          name: 'Documentation (technical-writer, ai-ml-engineer)',
          value: 'documentation',
          checked: true,
        },
      ],
    });
  }

  remainingPrompts.push(
    {
      type: 'confirm',
      name: 'createSteering',
      message: 'Generate initial steering context?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'createConstitution',
      message: 'Create constitutional governance?',
      default: true,
    }
  );

  const finalAnswers = await inquirer.default.prompt(remainingPrompts);
  answers = { ...answers, ...finalAnswers };

  console.log(chalk.green('\n✨ Initializing MUSUBI...\n'));

  // Create directory structure (agent-specific + shared)
  const dirs = [
    'steering',
    'steering/rules',
    'templates',
    'storage/specs',
    'storage/changes',
    'storage/archive',
  ];

  // Add agent-specific directories
  if (agent.layout.skillsDir) {
    dirs.unshift(agent.layout.skillsDir);
  }
  if (agent.layout.commandsDir) {
    dirs.unshift(agent.layout.commandsDir);
  }
  if (agent.layout.agentDir && !dirs.includes(agent.layout.agentDir)) {
    dirs.unshift(agent.layout.agentDir);
  }

  for (const dir of dirs) {
    await fs.ensureDir(dir);
    console.log(chalk.gray(`  Created ${dir}/`));
  }

  // Install skills (Claude Code only - Skills API)
  if (agentKey === 'claude-code' && agent.layout.skillsDir && answers.skills) {
    const skillGroups = {
      core: ['orchestrator', 'steering', 'constitution-enforcer'],
      requirements: ['requirements-analyst', 'project-manager', 'change-impact-analyzer'],
      architecture: [
        'system-architect',
        'api-designer',
        'database-schema-designer',
        'ui-ux-designer',
      ],
      development: ['software-developer'],
      quality: [
        'test-engineer',
        'code-reviewer',
        'bug-hunter',
        'quality-assurance',
        'traceability-auditor',
      ],
      security: ['security-auditor', 'performance-optimizer'],
      infrastructure: [
        'devops-engineer',
        'cloud-architect',
        'database-administrator',
        'site-reliability-engineer',
        'release-coordinator',
      ],
      documentation: ['technical-writer', 'ai-ml-engineer'],
    };

    let skillCount = 0;
    for (const group of answers.skills) {
      for (const skill of skillGroups[group]) {
        await copySkill(skill, agent);
        skillCount++;
      }
    }

    console.log(chalk.green(`\n  Installed ${skillCount} skills`));
  }

  // Install commands/prompts/workflows
  if (agent.features.hasCommands) {
    await copyCommands(agent, agentKey);
    const commandType =
      agentKey === 'github-copilot' || agentKey === 'codex'
        ? 'prompts'
        : agentKey === 'windsurf'
          ? 'workflows'
          : 'commands';
    console.log(chalk.green(`  Installed ${commandType}`));
  }

  // Install AGENTS.md (all platforms get 25 agent definitions)
  if (agent.layout.agentsFile) {
    await copyAgentsFile(agent);
    console.log(chalk.green('  Installed 25 agent definitions (AGENTS.md)'));
  }

  // Generate steering context
  if (answers.createSteering) {
    await generateSteering(answers, externalSpec);
    console.log(chalk.green('  Generated steering context'));
  }

  // Save external specification reference
  if (externalSpec && !externalSpec.error) {
    const specFilename = await saveSpecReference(externalSpec, process.cwd());
    console.log(chalk.green(`  Saved specification reference: steering/specs/${specFilename}`));
  }

  // Save GitHub repository references and analysis
  if (referenceRepos && referenceRepos.length > 0 && repoAnalysis) {
    const refFilename = await saveReferenceRepos(referenceRepos, repoAnalysis, process.cwd());
    console.log(chalk.green(`  Saved GitHub references: steering/references/${refFilename}`));
  }

  // Create constitution
  if (answers.createConstitution) {
    await createConstitution();
    console.log(chalk.green('  Created constitutional governance'));
  }

  // Generate language-specific dependency files (for single-package projects)
  if (answers.projectStructure !== 'workspace' && answers.projectStructure !== 'microservices') {
    const primaryLang =
      answers.languages && answers.languages[0] !== 'undecided' ? answers.languages[0] : null;
    if (primaryLang) {
      await generateDependencyFiles(primaryLang, answers);
      console.log(chalk.green(`  Generated ${primaryLang} project files`));
    }
  }

  // Generate reference architecture template if specified
  if (options.template) {
    await generateArchitectureTemplate(options.template, answers);
    console.log(chalk.green(`  Applied ${options.template} architecture template`));
  }

  // Create README
  await createReadme(answers, agent, agentKey);
  console.log(chalk.green(`  Created ${agent.layout.docFile || 'MUSUBI.md'} guide`));

  // Success message
  console.log(chalk.blue.bold(`\n✅ MUSUBI initialization complete for ${agent.label}!\n`));
  console.log(chalk.white('Next steps:'));
  console.log(chalk.gray('  1. Review steering/ context files'));
  console.log(chalk.gray('  2. Review steering/rules/constitution.md'));

  if (agent.features.hasSkills) {
    console.log(chalk.gray(`  3. Start using ${agent.label} with MUSUBI skills`));
  } else {
    console.log(chalk.gray(`  3. Start using ${agent.label} with MUSUBI`));
  }

  const cmdExample = agent.commands.requirements.replace(' <feature>', ' authentication');
  console.log(chalk.gray(`  4. Try commands: ${cmdExample}\n`));
  console.log(chalk.cyan('Learn more: https://github.com/nahisaho/MUSUBI\n'));
}

async function copySkill(skillName, agent) {
  // Only Claude Code has skillsDir (Skills API)
  if (!agent.layout.skillsDir) {
    return; // Skip for agents without Skills API support
  }

  const srcDir = path.join(AGENTS_TEMPLATE_DIR, 'claude-code', 'skills', skillName);
  const destDir = path.join(agent.layout.skillsDir, skillName);
  await fs.copy(srcDir, destDir);
}

async function copyCommands(agent, agentKey) {
  const srcDir = path.join(AGENTS_TEMPLATE_DIR, agentKey, 'commands');
  const destDir = agent.layout.commandsDir;

  // If agent-specific templates don't exist yet, fall back to Claude Code templates
  if (!fs.existsSync(srcDir)) {
    const fallbackSrc = path.join(AGENTS_TEMPLATE_DIR, 'claude-code', 'commands');
    await fs.copy(fallbackSrc, destDir);
  } else {
    await fs.copy(srcDir, destDir);
  }
}

async function copyAgentsFile(agent) {
  const sharedAgentsFile = path.join(AGENTS_TEMPLATE_DIR, 'shared', 'AGENTS.md');
  const destFile = agent.layout.agentsFile;

  // For Gemini CLI, AGENTS.md is embedded in GEMINI.md
  if (destFile === 'GEMINI.md') {
    // Read shared AGENTS.md
    const agentsContent = await fs.readFile(sharedAgentsFile, 'utf8');

    // Read existing GEMINI.md template if exists
    const geminiTemplate = path.join(AGENTS_TEMPLATE_DIR, 'gemini-cli', 'GEMINI.md');
    let geminiContent = '';
    if (fs.existsSync(geminiTemplate)) {
      geminiContent = await fs.readFile(geminiTemplate, 'utf8');
    } else {
      geminiContent =
        '# Gemini CLI - MUSUBI Configuration\n\n' +
        'This file configures Gemini CLI for MUSUBI SDD.\n\n' +
        '---\n\n';
    }

    // Append AGENTS.md content
    geminiContent += agentsContent;
    await fs.writeFile(destFile, geminiContent);
  } else {
    // For other platforms, copy AGENTS.md as-is
    await fs.copy(sharedAgentsFile, destFile);
  }
}

async function generateSteering(answers, externalSpec = null) {
  const steeringTemplates = path.join(SHARED_TEMPLATE_DIR, 'steering');
  const locale = answers.locale || 'en';
  const languages = answers.languages || ['undecided'];

  // Copy and customize steering files
  const files = ['structure.md', 'product.md'];
  for (const file of files) {
    // Try locale-specific file first (e.g., structure.ja.md)
    let templatePath = path.join(steeringTemplates, file.replace('.md', `.${locale}.md`));
    if (locale === 'en' || !fs.existsSync(templatePath)) {
      // Fall back to default (English)
      templatePath = path.join(steeringTemplates, file);
    }

    // Determine output filename (locale suffix for non-English)
    const outputFile = locale !== 'en' ? file.replace('.md', `.${locale}.md`) : file;

    if (!fs.existsSync(templatePath)) {
      // If template doesn't exist, skip (don't fail)
      continue;
    }

    let content = await fs.readFile(templatePath, 'utf8');

    // Replace placeholders
    content = content.replace(/\{\{PROJECT_NAME\}\}/g, answers.projectName);
    content = content.replace(/\{\{DESCRIPTION\}\}/g, answers.description);
    content = content.replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0]);
    content = content.replace(/\{\{LOCALE\}\}/g, locale);

    await fs.writeFile(path.join('steering', outputFile), content);
  }

  // Generate tech.md based on selected languages
  const techContent = generateTechMd(languages, answers, locale);
  const techFile = locale !== 'en' ? `tech.${locale}.md` : 'tech.md';
  await fs.writeFile(path.join('steering', techFile), techContent);

  // Build external specification section for project.yml
  let externalSpecYml = '';
  if (externalSpec && !externalSpec.error) {
    externalSpecYml = `
# External Specification Reference
external_specs:
  - source: "${externalSpec.source}"
    type: ${externalSpec.type}
    format: ${externalSpec.metadata.format || 'unknown'}
    title: "${externalSpec.metadata.summary?.title || 'External Specification'}"
    fetched_at: ${externalSpec.metadata.fetchedAt || externalSpec.metadata.readAt || 'N/A'}
`;
  }

  // Create project.yml with locale, language settings, and external spec
  const projectYml = `# MUSUBI Project Configuration
name: ${answers.projectName}
description: ${answers.description}
locale: ${locale}
version: "0.1.0"
created: ${new Date().toISOString().split('T')[0]}

# Technology Stack
tech_stack:
  approach: ${answers.techStackApproach}
  languages:
${languages[0] === 'undecided' ? '    - undecided  # To be determined' : languages.map(l => `    - ${l}`).join('\n')}
${externalSpecYml}`;
  await fs.writeFile(path.join('steering', 'project.yml'), projectYml);

  // Generate workspace structure if applicable
  if (answers.projectStructure === 'workspace' || answers.projectStructure === 'microservices') {
    await generateWorkspaceStructure(answers);
  }
}

/**
 * Generate workspace/monorepo structure based on template
 */
async function generateWorkspaceStructure(answers) {
  const template = answers.archTemplate || 'workspace-basic';
  const languages = answers.languages || ['javascript'];
  const primaryLang = languages[0];

  const structures = {
    'workspace-basic': {
      dirs: ['packages/', 'packages/core/', 'packages/cli/', 'packages/web/'],
      files: {
        'packages/README.md': '# Packages\n\nThis workspace contains multiple packages.\n',
      },
    },
    'workspace-layered': {
      dirs: ['core/', 'api/', 'web/', 'shared/', 'tools/'],
      files: {
        'core/README.md': '# Core\n\nBusiness logic and domain models.\n',
        'api/README.md': '# API\n\nREST/GraphQL API layer.\n',
        'web/README.md': '# Web\n\nFrontend application.\n',
        'shared/README.md': '# Shared\n\nShared utilities and types.\n',
      },
    },
    'workspace-ddd': {
      dirs: [
        'domains/',
        'domains/identity/',
        'domains/catalog/',
        'shared/',
        'shared/kernel/',
        'infrastructure/',
      ],
      files: {
        'domains/README.md': '# Domains\n\nDomain-driven design bounded contexts.\n',
        'shared/kernel/README.md': '# Shared Kernel\n\nCore abstractions shared across domains.\n',
        'infrastructure/README.md': '# Infrastructure\n\nCross-cutting infrastructure concerns.\n',
      },
    },
    'workspace-fullstack': {
      dirs: ['frontend/', 'backend/', 'shared/', 'e2e/', 'docs/'],
      files: {
        'frontend/README.md': '# Frontend\n\nClient-side application.\n',
        'backend/README.md': '# Backend\n\nServer-side application.\n',
        'shared/README.md': '# Shared\n\nShared types and utilities.\n',
        'e2e/README.md': '# E2E Tests\n\nEnd-to-end test suite.\n',
      },
    },
    'microservices-basic': {
      dirs: ['services/', 'services/auth/', 'services/api/', 'services/worker/', 'libs/'],
      files: {
        'services/README.md': '# Services\n\nMicroservices directory.\n',
        'libs/README.md': '# Libraries\n\nShared libraries across services.\n',
      },
    },
    'microservices-gateway': {
      dirs: ['gateway/', 'services/', 'services/users/', 'services/products/', 'shared/'],
      files: {
        'gateway/README.md': '# API Gateway\n\nEntry point for all API requests.\n',
        'services/README.md': '# Services\n\nBackend microservices.\n',
      },
    },
    'microservices-event': {
      dirs: [
        'services/',
        'services/order/',
        'services/inventory/',
        'events/',
        'events/schemas/',
        'infrastructure/',
      ],
      files: {
        'services/README.md': '# Services\n\nEvent-driven microservices.\n',
        'events/README.md': '# Events\n\nEvent schemas and contracts.\n',
        'events/schemas/README.md': '# Event Schemas\n\nAsyncAPI/CloudEvents schemas.\n',
      },
    },
  };

  const structure = structures[template] || structures['workspace-basic'];

  // Create directories
  for (const dir of structure.dirs) {
    await fs.ensureDir(dir);
  }

  // Create files
  for (const [file, content] of Object.entries(structure.files)) {
    await fs.writeFile(file, content);
  }

  // Generate language-specific workspace config
  await generateWorkspaceConfig(primaryLang, template, answers);
}

/**
 * Generate language-specific workspace configuration files
 */
async function generateWorkspaceConfig(primaryLang, template, answers) {
  const projectName = answers.projectName || 'my-project';

  if (primaryLang === 'javascript') {
    // Generate pnpm-workspace.yaml or npm workspaces in package.json
    const workspaceConfig =
      template.startsWith('workspace') || template.startsWith('microservices')
        ? `packages:
  - 'packages/*'
  - 'services/*'
  - 'shared'
  - 'libs/*'
`
        : '';
    if (workspaceConfig) {
      await fs.writeFile('pnpm-workspace.yaml', workspaceConfig);
    }

    // Root package.json with workspaces
    const rootPackageJson = {
      name: projectName,
      version: '0.0.0',
      private: true,
      workspaces: ['packages/*', 'services/*', 'shared', 'libs/*'],
      scripts: {
        build: 'pnpm -r build',
        test: 'pnpm -r test',
        lint: 'pnpm -r lint',
      },
      devDependencies: {
        typescript: '^5.0.0',
      },
    };
    await fs.writeFile('package.json', JSON.stringify(rootPackageJson, null, 2) + '\n');
  } else if (primaryLang === 'rust') {
    // Generate Cargo workspace
    const members =
      template === 'workspace-basic'
        ? ['packages/*']
        : template === 'workspace-layered'
          ? ['core', 'api', 'shared']
          : template === 'microservices-basic'
            ? ['services/*', 'libs/*']
            : ['crates/*'];

    const cargoToml = `[workspace]
resolver = "2"
members = [
${members.map(m => `    "${m}"`).join(',\n')}
]

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["${projectName} Team"]
license = "MIT"

[workspace.dependencies]
# Add shared dependencies here
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
`;
    await fs.writeFile('Cargo.toml', cargoToml);
  } else if (primaryLang === 'python') {
    // Generate pyproject.toml for monorepo
    const pyprojectToml = `[project]
name = "${projectName}"
version = "0.1.0"
description = "${answers.description || ''}"
requires-python = ">=3.11"

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
`;
    await fs.writeFile('pyproject.toml', pyprojectToml);
  } else if (primaryLang === 'go') {
    // Generate go.work for Go workspaces
    const goWork = `go 1.21

use (
    ./cmd
    ./internal
    ./pkg
)
`;
    await fs.writeFile('go.work', goWork);
  }
}

/**
 * Generate reference architecture template structure
 */
async function generateArchitectureTemplate(templateName, answers) {
  const ARCH_TEMPLATE_DIR = path.join(__dirname, '..', 'src', 'templates', 'architectures');
  const languages = answers.languages || ['javascript'];
  const primaryLang = languages[0];

  const architectures = {
    'clean-architecture': {
      dirs: [
        'src/domain/entities/',
        'src/domain/value-objects/',
        'src/domain/services/',
        'src/domain/errors/',
        'src/application/use-cases/',
        'src/application/ports/input/',
        'src/application/ports/output/',
        'src/application/dtos/',
        'src/infrastructure/persistence/repositories/',
        'src/infrastructure/persistence/mappers/',
        'src/infrastructure/external/',
        'src/interface/controllers/',
        'src/interface/presenters/',
        'src/interface/cli/',
      ],
      readme: 'clean-architecture/README.md',
    },
    hexagonal: {
      dirs: [
        'src/core/domain/models/',
        'src/core/domain/events/',
        'src/core/domain/services/',
        'src/core/ports/inbound/',
        'src/core/ports/outbound/',
        'src/core/application/commands/',
        'src/core/application/queries/',
        'src/adapters/inbound/http/',
        'src/adapters/inbound/cli/',
        'src/adapters/outbound/persistence/',
        'src/adapters/outbound/messaging/',
      ],
      readme: 'hexagonal/README.md',
    },
    'event-driven': {
      dirs: [
        'src/domain/events/',
        'src/domain/aggregates/',
        'src/domain/commands/',
        'src/application/command-handlers/',
        'src/application/event-handlers/',
        'src/application/sagas/',
        'src/application/projections/',
        'src/infrastructure/messaging/',
        'src/infrastructure/event-store/',
        'src/interface/api/',
        'src/interface/consumers/',
        'src/interface/publishers/',
      ],
      readme: 'event-driven/README.md',
    },
    layered: {
      dirs: [
        'src/presentation/controllers/',
        'src/presentation/views/',
        'src/business/services/',
        'src/business/models/',
        'src/data/repositories/',
        'src/data/entities/',
      ],
      readme: null,
    },
    'modular-monolith': {
      dirs: [
        'src/modules/users/',
        'src/modules/users/domain/',
        'src/modules/users/application/',
        'src/modules/users/infrastructure/',
        'src/modules/orders/',
        'src/modules/orders/domain/',
        'src/modules/orders/application/',
        'src/modules/orders/infrastructure/',
        'src/shared/kernel/',
        'src/shared/infrastructure/',
      ],
      readme: null,
    },
  };

  const arch = architectures[templateName];
  if (!arch) {
    console.log(chalk.yellow(`  Unknown architecture template: ${templateName}`));
    return;
  }

  // Create directories
  for (const dir of arch.dirs) {
    await fs.ensureDir(dir);
    // Create .gitkeep to preserve empty directories
    await fs.writeFile(path.join(dir, '.gitkeep'), '');
  }

  // Copy architecture README if available
  if (arch.readme) {
    const readmePath = path.join(ARCH_TEMPLATE_DIR, arch.readme);
    if (await fs.pathExists(readmePath)) {
      const destPath = path.join('docs', 'architecture', 'README.md');
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(readmePath, destPath);
    }
  }

  // Generate language-specific entry files
  await generateArchitectureEntryFiles(templateName, primaryLang, answers);
}

/**
 * Generate entry files for architecture template
 */
async function generateArchitectureEntryFiles(templateName, primaryLang, answers) {
  const projectName = answers.projectName || 'my-project';

  // Create a basic entry file based on language
  if (primaryLang === 'javascript' || primaryLang === 'typescript') {
    const entryFile = `// ${projectName} - ${templateName}
// Entry point for the application

export function main(): void {
  console.log('Hello from ${projectName}!');
}

main();
`;
    await fs.ensureDir('src');
    await fs.writeFile('src/index.ts', entryFile);
  } else if (primaryLang === 'rust') {
    const mainRs = `//! ${projectName} - ${templateName}
//! 
//! Entry point for the application

fn main() {
    println!("Hello from ${projectName}!");
}
`;
    await fs.ensureDir('src');
    await fs.writeFile('src/main.rs', mainRs);
  } else if (primaryLang === 'python') {
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const mainPy = `"""${projectName} - ${templateName}

Entry point for the application
"""


def main() -> None:
    print(f"Hello from ${projectName}!")


if __name__ == "__main__":
    main()
`;
    const srcDir = `src/${safeName}`;
    await fs.ensureDir(srcDir);
    await fs.writeFile(`${srcDir}/__main__.py`, mainPy);
  }
}

async function createConstitution() {
  const constitutionTemplate = path.join(SHARED_TEMPLATE_DIR, 'constitution', 'constitution.md');
  await fs.copy(constitutionTemplate, 'steering/rules/constitution.md');
}

async function createReadme(answers, agent, agentKey) {
  const skillsSection =
    agent.features.hasSkills && answers.skills
      ? `This project uses **MUSUBI** (Ultimate Specification Driven Development) with ${answers.skills.length} skill groups.

### Available Skills

Check \`${agent.layout.skillsDir}/\` directory for all installed skills.

`
      : `This project uses **MUSUBI** (Ultimate Specification Driven Development).

`;

  const commandType =
    agentKey === 'github-copilot' || agentKey === 'codex'
      ? 'Prompts'
      : agentKey === 'windsurf'
        ? 'Workflows'
        : 'Commands';

  const readme = `# MUSUBI - ${answers.projectName}

${answers.description}

## Initialized with MUSUBI SDD for ${agent.label}

${skillsSection}
### ${commandType}

- \`${agent.commands.steering}\` - Generate/update project memory
- \`${agent.commands.requirements}\` - Create EARS requirements
- \`${agent.commands.design}\` - Generate C4 + ADR design
- \`${agent.commands.tasks}\` - Break down into tasks
- \`${agent.commands.implement}\` - Execute implementation
- \`${agent.commands.validate}\` - Validate constitutional compliance

### Project Memory

- \`steering/structure.md\` - Architecture patterns
- \`steering/tech.md\` - Technology stack
- \`steering/product.md\` - Product context
- \`steering/rules/constitution.md\` - 9 Constitutional Articles

### Learn More

- [MUSUBI Documentation](https://github.com/nahisaho/MUSUBI)
- [Constitutional Governance](steering/rules/constitution.md)
- [8-Stage SDD Workflow](steering/rules/workflow.md)

---

**Agent**: ${agent.label}
**Initialized**: ${new Date().toISOString().split('T')[0]}
**MUSUBI Version**: 0.1.0
`;

  const filename = agent.layout.docFile || 'MUSUBI.md';
  await fs.writeFile(filename, readme);
}

// Export for use from musubi.js
module.exports = main;

// Allow direct execution for backward compatibility
if (require.main === module) {
  main().catch(err => {
    console.error(chalk.red('\n❌ Initialization failed:'), err.message);
    process.exit(1);
  });
}
