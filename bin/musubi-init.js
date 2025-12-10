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

const TEMPLATE_DIR = path.join(__dirname, '..', 'src', 'templates');
const SHARED_TEMPLATE_DIR = path.join(TEMPLATE_DIR, 'shared');
const AGENTS_TEMPLATE_DIR = path.join(TEMPLATE_DIR, 'agents');

/**
 * Language recommendation engine
 * @param {object} requirements - User's answers about app types, performance, expertise
 * @returns {Array} Recommended languages with reasons
 */
function recommendLanguages(requirements) {
  const { appTypes, performanceNeeds, teamExpertise } = requirements;
  const scores = {};
  const reasons = {};

  // Initialize scores
  const allLangs = [
    'javascript',
    'python',
    'rust',
    'go',
    'java',
    'csharp',
    'cpp',
    'swift',
    'ruby',
    'php',
  ];
  for (const lang of allLangs) {
    scores[lang] = 0;
    reasons[lang] = [];
  }

  // Score by application type
  const appTypeScores = {
    'web-frontend': { javascript: 10, reason: 'Best ecosystem for web frontend' },
    'web-backend': {
      javascript: 6,
      python: 7,
      go: 8,
      rust: 7,
      java: 7,
      csharp: 6,
      ruby: 5,
      php: 5,
      reason: 'Strong backend frameworks',
    },
    cli: { rust: 9, go: 9, python: 6, reason: 'Fast startup, single binary' },
    desktop: { rust: 7, csharp: 8, cpp: 7, swift: 6, java: 6, reason: 'Native GUI support' },
    mobile: { swift: 9, java: 8, javascript: 6, reason: 'Mobile platform support' },
    data: { python: 10, rust: 6, reason: 'Rich data science ecosystem' },
    ml: { python: 10, rust: 5, cpp: 5, reason: 'ML/AI libraries and frameworks' },
    embedded: { rust: 10, cpp: 9, reason: 'Memory safety, no runtime' },
    game: { cpp: 9, csharp: 8, rust: 6, reason: 'Game engine support' },
    systems: { rust: 10, go: 8, cpp: 9, reason: 'Systems programming' },
  };

  for (const appType of appTypes || []) {
    const typeScores = appTypeScores[appType];
    if (typeScores) {
      for (const [lang, score] of Object.entries(typeScores)) {
        if (typeof score === 'number') {
          scores[lang] += score;
          if (!reasons[lang].includes(typeScores.reason)) {
            reasons[lang].push(typeScores.reason);
          }
        }
      }
    }
  }

  // Score by performance needs
  if (performanceNeeds === 'high') {
    scores.rust += 8;
    scores.go += 6;
    scores.cpp += 7;
    reasons.rust.push('High performance, zero-cost abstractions');
    reasons.go.push('Fast compilation, efficient runtime');
  } else if (performanceNeeds === 'rapid') {
    scores.python += 5;
    scores.javascript += 5;
    scores.ruby += 4;
    reasons.python.push('Rapid development, extensive libraries');
    reasons.javascript.push('Fast iteration, universal runtime');
  }

  // Boost by team expertise
  for (const lang of teamExpertise || []) {
    scores[lang] += 5;
    reasons[lang].push('Team has expertise');
  }

  // Sort and return top recommendations
  const sorted = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const langInfo = {
    javascript: { name: 'JavaScript/TypeScript', emoji: '🟨' },
    python: { name: 'Python', emoji: '🐍' },
    rust: { name: 'Rust', emoji: '🦀' },
    go: { name: 'Go', emoji: '🐹' },
    java: { name: 'Java/Kotlin', emoji: '☕' },
    csharp: { name: 'C#/.NET', emoji: '💜' },
    cpp: { name: 'C/C++', emoji: '⚙️' },
    swift: { name: 'Swift', emoji: '🍎' },
    ruby: { name: 'Ruby', emoji: '💎' },
    php: { name: 'PHP', emoji: '🐘' },
  };

  return sorted.map(([lang]) => ({
    value: lang,
    name: langInfo[lang].name,
    emoji: langInfo[lang].emoji,
    reason: reasons[lang].slice(0, 2).join('; ') || 'General purpose',
    score: scores[lang],
  }));
}

/**
 * Main initialization function
 * @param {object} agent - Agent definition from registry
 * @param {string} agentKey - Agent key (e.g., 'claude-code', 'cursor')
 */
async function main(agent, agentKey) {
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
        { name: 'Español (Spanish)', value: 'es' },
        { name: 'Deutsch (German)', value: 'de' },
        { name: 'Français (French)', value: 'fr' },
      ],
      default: 'en',
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
    'storage/features',
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
    await generateSteering(answers);
    console.log(chalk.green('  Generated steering context'));
  }

  // Create constitution
  if (answers.createConstitution) {
    await createConstitution();
    console.log(chalk.green('  Created constitutional governance'));
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
  console.log(chalk.cyan('Learn more: https://github.com/your-org/musubi\n'));
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

async function generateSteering(answers) {
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

  // Create project.yml with locale and language settings
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
`;
  await fs.writeFile(path.join('steering', 'project.yml'), projectYml);
}

/**
 * Generate language-specific tech.md content
 */
function generateTechMd(languages, answers, _locale) {
  const langInfo = {
    javascript: {
      name: 'JavaScript/TypeScript',
      version: 'ES2022+ / TypeScript 5.0+',
      runtime: 'Node.js 20+ LTS, Bun, Deno',
      packageManager: 'npm, pnpm, yarn',
      frameworks: 'React, Vue, Next.js, Express, Fastify',
      testing: 'Jest, Vitest, Playwright',
    },
    python: {
      name: 'Python',
      version: '3.11+',
      runtime: 'CPython, PyPy',
      packageManager: 'pip, poetry, uv',
      frameworks: 'FastAPI, Django, Flask',
      testing: 'pytest, unittest',
    },
    rust: {
      name: 'Rust',
      version: '1.75+ stable',
      runtime: 'Native binary',
      packageManager: 'Cargo',
      frameworks: 'Axum, Actix-web, Tokio',
      testing: 'cargo test, criterion',
    },
    go: {
      name: 'Go',
      version: '1.21+',
      runtime: 'Native binary',
      packageManager: 'Go modules',
      frameworks: 'Gin, Echo, Chi',
      testing: 'go test, testify',
    },
    java: {
      name: 'Java/Kotlin',
      version: 'Java 21 LTS / Kotlin 1.9+',
      runtime: 'JVM, GraalVM',
      packageManager: 'Maven, Gradle',
      frameworks: 'Spring Boot, Quarkus, Ktor',
      testing: 'JUnit 5, Kotest',
    },
    csharp: {
      name: 'C#/.NET',
      version: '.NET 8+',
      runtime: '.NET Runtime',
      packageManager: 'NuGet',
      frameworks: 'ASP.NET Core, MAUI',
      testing: 'xUnit, NUnit',
    },
    cpp: {
      name: 'C/C++',
      version: 'C++20',
      runtime: 'Native binary',
      packageManager: 'vcpkg, Conan',
      frameworks: 'Qt, Boost',
      testing: 'GoogleTest, Catch2',
    },
    swift: {
      name: 'Swift',
      version: '5.9+',
      runtime: 'Native binary',
      packageManager: 'Swift Package Manager',
      frameworks: 'SwiftUI, Vapor',
      testing: 'XCTest',
    },
    ruby: {
      name: 'Ruby',
      version: '3.2+',
      runtime: 'CRuby, JRuby',
      packageManager: 'Bundler, RubyGems',
      frameworks: 'Rails, Sinatra',
      testing: 'RSpec, Minitest',
    },
    php: {
      name: 'PHP',
      version: '8.2+',
      runtime: 'PHP-FPM, Swoole',
      packageManager: 'Composer',
      frameworks: 'Laravel, Symfony',
      testing: 'PHPUnit, Pest',
    },
  };

  const isUndecided = languages[0] === 'undecided';
  const date = new Date().toISOString().split('T')[0];

  if (isUndecided) {
    return `# Technology Stack

**Project**: ${answers.projectName}
**Last Updated**: ${date}
**Status**: Technology stack to be determined

---

## Overview

The technology stack for this project has not yet been decided. This document will be updated once the technical decisions are made.

## Decision Criteria

When selecting technologies, consider:

1. **Application Type**: What type of application is being built?
2. **Performance Requirements**: What are the performance constraints?
3. **Team Expertise**: What technologies is the team familiar with?
4. **Ecosystem**: What libraries and tools are available?
5. **Long-term Maintainability**: How well-supported is the technology?

## Candidates Under Consideration

| Aspect | Options | Decision |
|--------|---------|----------|
| Primary Language | TBD | ⏳ Pending |
| Web Framework | TBD | ⏳ Pending |
| Database | TBD | ⏳ Pending |
| Hosting | TBD | ⏳ Pending |

## Next Steps

1. [ ] Define functional requirements
2. [ ] Identify performance constraints
3. [ ] Evaluate team skills
4. [ ] Create proof-of-concept
5. [ ] Make final decision and update this document

---

*Run \`musubi steering\` to update this document after decisions are made.*
`;
  }

  // Generate tech.md for selected languages
  const primaryLang = languages[0];
  const primary = langInfo[primaryLang] || { name: primaryLang, version: 'Latest' };

  let languageTable = `### Programming Languages

| Language | Version | Role | Notes |
|----------|---------|------|-------|
`;

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    const info = langInfo[lang] || { name: lang, version: 'Latest' };
    const role = i === 0 ? 'Primary' : 'Secondary';
    languageTable += `| ${info.name} | ${info.version} | ${role} | ${info.runtime || ''} |\n`;
  }

  let frameworksSection = '';
  for (const lang of languages) {
    const info = langInfo[lang];
    if (info && info.frameworks) {
      frameworksSection += `
### ${info.name} Ecosystem

- **Package Manager**: ${info.packageManager}
- **Frameworks**: ${info.frameworks}
- **Testing**: ${info.testing}
`;
    }
  }

  return `# Technology Stack

**Project**: ${answers.projectName}
**Last Updated**: ${date}
**Version**: 0.1.0

---

## Overview

${answers.description}

---

## Primary Technologies

${languageTable}
${frameworksSection}

---

## Development Environment

### Required Tools

- Primary language runtime (see above)
- Git 2.40+
- IDE: VS Code / JetBrains / Neovim

### Recommended Extensions

- Language-specific LSP
- Linter/Formatter integration
- Test runner integration

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary Language | ${primary.name} | Selected during project initialization |
| Package Manager | ${primary.packageManager || 'TBD'} | Standard for ${primary.name} |

---

## Dependencies

### Production Dependencies

*To be documented as dependencies are added.*

### Development Dependencies

*To be documented as dependencies are added.*

---

*Generated by MUSUBI SDD - Update with \`musubi steering\`*
`;
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

- [MUSUBI Documentation](https://github.com/your-org/musubi)
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
