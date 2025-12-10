/**
 * Spec Kit Writer
 *
 * Writes Intermediate Representation (IR) to Spec Kit project structure
 *
 * Spec Kit structure:
 * .specify/
 * ├── memory/
 * │   └── constitution.md
 * ├── specs/
 * │   └── ###-feature/
 * │       ├── spec.md
 * │       ├── plan.md
 * │       ├── tasks.md
 * │       ├── research.md
 * │       ├── data-model.md
 * │       ├── contracts/
 * │       └── quickstart.md
 * └── templates/
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const { requirementToUserScenario } = require('../ir/types');

/**
 * Write Project IR to Spec Kit format
 * @param {import('../ir/types').ProjectIR} ir - Project IR
 * @param {string} outputPath - Output directory
 * @param {Object} options - Writer options
 * @returns {Promise<{filesWritten: number, warnings: string[]}>}
 */
async function writeSpeckitProject(ir, outputPath, options = {}) {
  const { dryRun = false, force = false, preserveRaw = false, verbose = false } = options;
  const warnings = [];
  let filesWritten = 0;

  const specifyPath = path.join(outputPath, '.specify');

  // Create base directories
  const dirs = [
    path.join(specifyPath, 'memory'),
    path.join(specifyPath, 'specs'),
    path.join(specifyPath, 'templates'),
  ];

  if (!dryRun) {
    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  // Write constitution
  const constitutionPath = path.join(specifyPath, 'memory', 'constitution.md');
  const constitution = generateConstitution(ir.constitution, preserveRaw);
  if (!dryRun) {
    await writeFile(constitutionPath, constitution, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${constitutionPath}`);

  // Write features
  for (let i = 0; i < ir.features.length; i++) {
    const feature = ir.features[i];
    const featureId = formatFeatureId(i + 1, feature.id);
    const featurePath = path.join(specifyPath, 'specs', featureId);
    const result = await writeFeature(feature, featurePath, {
      dryRun,
      force,
      preserveRaw,
      verbose,
    });
    filesWritten += result.filesWritten;
    warnings.push(...result.warnings);
  }

  // Write templates
  for (const template of ir.templates) {
    const templatePath = path.join(specifyPath, 'templates', `${template.name}.md`);
    if (!dryRun) {
      await writeFile(templatePath, template.content, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${templatePath}`);
  }

  return { filesWritten, warnings };
}

/**
 * Write file with optional force overwrite
 * @param {string} filePath
 * @param {string} content
 * @param {boolean} force
 */
async function writeFile(filePath, content, force = false) {
  if ((await fs.pathExists(filePath)) && !force) {
    throw new Error(`File exists: ${filePath} (use --force to overwrite)`);
  }
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Format feature ID with leading zeros (e.g., "001-photo-albums")
 * @param {number} index
 * @param {string} originalId
 * @returns {string}
 */
function formatFeatureId(index, originalId) {
  // If already in ###-format, return as is
  if (/^\d{3}-/.test(originalId)) {
    return originalId;
  }

  // Convert to kebab-case
  const kebabName = originalId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${String(index).padStart(3, '0')}-${kebabName}`;
}

/**
 * Generate constitution.md content (Spec Kit format)
 * @param {import('../ir/types').ConstitutionIR} constitution
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateConstitution(constitution, preserveRaw = false) {
  const lines = [];

  lines.push('# Project Constitution');
  lines.push('');
  lines.push('The core principles and guidelines that govern this project.');
  lines.push('');

  // Write Core Principles (converted from MUSUBI articles)
  lines.push('## Core Principles');
  lines.push('');

  // Map articles to principles
  if (constitution.articles && constitution.articles.length > 0) {
    for (const article of constitution.articles) {
      lines.push(`### ${article.name}`);
      lines.push('');

      if (article.description) {
        lines.push(article.description);
        lines.push('');
      }

      if (article.rules && article.rules.length > 0) {
        for (const rule of article.rules) {
          lines.push(`- ${rule}`);
        }
        lines.push('');
      }
    }
  } else if (constitution.corePrinciples && constitution.corePrinciples.length > 0) {
    // Use original principles if articles not available
    for (const principle of constitution.corePrinciples) {
      lines.push(`### ${principle.name}`);
      lines.push('');
      lines.push(principle.description);
      lines.push('');
    }
  }

  // Write Governance
  if (constitution.governance) {
    lines.push('## Governance');
    lines.push('');
    lines.push(`**Version**: ${constitution.governance.version}`);
    lines.push('');

    if (constitution.governance.rules && constitution.governance.rules.length > 0) {
      for (const rule of constitution.governance.rules) {
        lines.push(`- ${rule}`);
      }
      lines.push('');
    }
  }

  // Preserve raw content if requested
  if (preserveRaw && constitution.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(constitution.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * Write a feature to Spec Kit format
 * @param {import('../ir/types').FeatureIR} feature
 * @param {string} featurePath
 * @param {Object} options
 * @returns {Promise<{filesWritten: number, warnings: string[]}>}
 */
async function writeFeature(feature, featurePath, options = {}) {
  const { dryRun = false, force = false, preserveRaw = false, verbose = false } = options;
  const warnings = [];
  let filesWritten = 0;

  if (!dryRun) {
    await fs.ensureDir(featurePath);
  }

  // Write spec.md
  const specPath = path.join(featurePath, 'spec.md');
  const specContent = generateSpec(feature, preserveRaw);
  if (!dryRun) {
    await writeFile(specPath, specContent, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${specPath}`);

  // Write plan.md
  if (feature.plan) {
    const planPath = path.join(featurePath, 'plan.md');
    const planContent = generatePlan(feature.plan, preserveRaw);
    if (!dryRun) {
      await writeFile(planPath, planContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${planPath}`);
  }

  // Write tasks.md
  if (feature.tasks && feature.tasks.length > 0) {
    const tasksPath = path.join(featurePath, 'tasks.md');
    const tasksContent = generateTasks(feature.tasks);
    if (!dryRun) {
      await writeFile(tasksPath, tasksContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${tasksPath}`);
  }

  // Write research.md
  if (feature.research) {
    const researchPath = path.join(featurePath, 'research.md');
    const researchContent = generateResearch(feature.research, preserveRaw);
    if (!dryRun) {
      await writeFile(researchPath, researchContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${researchPath}`);
  }

  // Write data-model.md
  if (feature.dataModel) {
    const dataModelPath = path.join(featurePath, 'data-model.md');
    const dataModelContent = generateDataModel(feature.dataModel, preserveRaw);
    if (!dryRun) {
      await writeFile(dataModelPath, dataModelContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${dataModelPath}`);
  }

  // Write contracts
  if (feature.contracts && feature.contracts.length > 0) {
    const contractsPath = path.join(featurePath, 'contracts');
    if (!dryRun) {
      await fs.ensureDir(contractsPath);
    }

    for (const contract of feature.contracts) {
      const contractFile = path.join(contractsPath, `${contract.name}.md`);
      const contractContent = contract.rawContent || generateContract(contract);
      if (!dryRun) {
        await writeFile(contractFile, contractContent, force);
        filesWritten++;
      }
      if (verbose) console.log(`  Writing: ${contractFile}`);
    }
  }

  // Write quickstart.md
  if (feature.quickstart) {
    const quickstartPath = path.join(featurePath, 'quickstart.md');
    const quickstartContent = generateQuickstart(feature.quickstart, preserveRaw);
    if (!dryRun) {
      await writeFile(quickstartPath, quickstartContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${quickstartPath}`);
  }

  return { filesWritten, warnings };
}

/**
 * Generate spec.md content (Spec Kit format with User Scenarios)
 * @param {import('../ir/types').FeatureIR} feature
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateSpec(feature, preserveRaw = false) {
  const lines = [];
  const spec = feature.specification;

  lines.push(`# ${spec.title || feature.name}`);
  lines.push('');

  if (spec.description) {
    lines.push(spec.description);
    lines.push('');
  }

  // Convert EARS requirements to User Scenarios
  if (spec.requirements && spec.requirements.length > 0) {
    lines.push('## User Scenarios');
    lines.push('');

    let storyIndex = 1;
    for (const req of spec.requirements) {
      // Convert requirement to user scenario if needed
      const storyId = `US${storyIndex++}`;
      const scenario =
        spec.userScenarios?.find(s => s.id === storyId) || requirementToUserScenario(req, storyId);

      lines.push(`### ${scenario.title || req.title || `User Story ${storyIndex}`}`);
      lines.push('');
      lines.push(
        `As a ${scenario.actor}, I want to ${scenario.action} so that ${scenario.benefit}.`
      );
      lines.push('');
      lines.push(`**Priority**: ${scenario.priority || req.priority}`);
      lines.push('');

      if (scenario.acceptanceCriteria && scenario.acceptanceCriteria.length > 0) {
        lines.push('**Acceptance Criteria**:');
        for (const ac of scenario.acceptanceCriteria) {
          lines.push(`- ${ac.description}`);
        }
        lines.push('');
      }

      // Add original EARS statement as note
      if (req.statement && !req.mappedFromUserStory) {
        lines.push(`> Original EARS: ${req.statement}`);
        lines.push('');
      }
    }
  } else if (spec.userScenarios && spec.userScenarios.length > 0) {
    // Use original user scenarios
    lines.push('## User Scenarios');
    lines.push('');

    for (const scenario of spec.userScenarios) {
      lines.push(`### ${scenario.title}`);
      lines.push('');
      lines.push(
        `As a ${scenario.actor}, I want to ${scenario.action} so that ${scenario.benefit}.`
      );
      lines.push('');
      lines.push(`**Priority**: ${scenario.priority}`);
      lines.push('');

      if (scenario.acceptanceCriteria && scenario.acceptanceCriteria.length > 0) {
        lines.push('**Acceptance Criteria**:');
        for (const ac of scenario.acceptanceCriteria) {
          lines.push(`- ${ac.description}`);
        }
        lines.push('');
      }
    }
  }

  // Write success criteria
  if (spec.successCriteria && spec.successCriteria.length > 0) {
    lines.push('## Success Criteria');
    lines.push('');
    for (const criterion of spec.successCriteria) {
      lines.push(`- ${criterion}`);
    }
    lines.push('');
  }

  // Preserve raw content if requested
  if (preserveRaw && spec.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(spec.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * Generate plan.md content
 * @param {import('../ir/types').PlanIR} plan
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generatePlan(plan, preserveRaw = false) {
  const lines = [];

  lines.push('# Implementation Plan');
  lines.push('');

  if (plan.summary) {
    lines.push(plan.summary);
    lines.push('');
  }

  // Technical Stack
  const tech = plan.technicalContext;
  if (tech && (tech.language || tech.framework)) {
    lines.push('## Technical Stack');
    lines.push('');

    if (tech.language) {
      lines.push(`- **Language**: ${tech.language}${tech.version ? ` ${tech.version}` : ''}`);
    }
    if (tech.framework) {
      lines.push(`- **Framework**: ${tech.framework}`);
    }
    if (tech.testing) {
      lines.push(`- **Testing**: ${tech.testing}`);
    }
    if (tech.targetPlatform) {
      lines.push(`- **Platform**: ${tech.targetPlatform}`);
    }
    lines.push('');
  }

  // Implementation Phases
  if (plan.phases && plan.phases.length > 0) {
    lines.push('## Implementation Phases');
    lines.push('');

    for (const phase of plan.phases) {
      lines.push(`### Phase ${phase.number}: ${phase.name}`);
      lines.push('');

      if (phase.purpose) {
        lines.push(phase.purpose);
        lines.push('');
      }

      if (phase.outputs && phase.outputs.length > 0) {
        lines.push('**Outputs**:');
        for (const output of phase.outputs) {
          lines.push(`- ${output}`);
        }
        lines.push('');
      }
    }
  }

  // Preserve raw content if requested
  if (preserveRaw && plan.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(plan.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * Generate tasks.md content (Spec Kit format)
 * @param {import('../ir/types').TaskIR[]} tasks
 * @returns {string}
 */
function generateTasks(tasks) {
  const lines = [];

  lines.push('# Tasks');
  lines.push('');

  // Group by phase
  const phases = {};
  for (const task of tasks) {
    const phase = task.phase || 1;
    if (!phases[phase]) {
      phases[phase] = [];
    }
    phases[phase].push(task);
  }

  for (const [phaseNum, phaseTasks] of Object.entries(phases)) {
    lines.push(`## Phase ${phaseNum}`);
    lines.push('');

    for (const task of phaseTasks) {
      const checkbox = task.completed ? '[x]' : '[ ]';
      const parallelMarker = task.parallel ? '[P] ' : '';
      const storyMarker = task.userStory ? `[${task.userStory}] ` : '';
      const pathSuffix = task.filePath ? ` at ${task.filePath}` : '';

      // Spec Kit format: - [ ] T001 [P] [US1] Description at path/
      lines.push(
        `- ${checkbox} ${task.id} ${parallelMarker}${storyMarker}${task.description}${pathSuffix}`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate research.md content
 * @param {import('../ir/types').ResearchIR} research
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateResearch(research, preserveRaw = false) {
  const lines = [];

  lines.push('# Research');
  lines.push('');

  // Decisions
  if (research.decisions && research.decisions.length > 0) {
    lines.push('## Decisions');
    lines.push('');

    for (const decision of research.decisions) {
      lines.push(`### ${decision.topic}`);
      lines.push('');
      lines.push(`**Decision**: ${decision.decision}`);
      if (decision.rationale) {
        lines.push(`**Rationale**: ${decision.rationale}`);
      }
      lines.push('');
    }
  }

  // Alternatives Considered
  if (research.alternatives && research.alternatives.length > 0) {
    lines.push('## Alternatives Considered');
    lines.push('');

    for (const alt of research.alternatives) {
      lines.push(`### ${alt.name}`);
      lines.push('');

      if (alt.pros && alt.pros.length > 0) {
        lines.push('**Pros**:');
        for (const pro of alt.pros) {
          lines.push(`- ${pro}`);
        }
        lines.push('');
      }

      if (alt.cons && alt.cons.length > 0) {
        lines.push('**Cons**:');
        for (const con of alt.cons) {
          lines.push(`- ${con}`);
        }
        lines.push('');
      }

      if (alt.rejected) {
        lines.push(`**Status**: Rejected`);
        if (alt.reason) {
          lines.push(`**Reason**: ${alt.reason}`);
        }
        lines.push('');
      }
    }
  }

  // Preserve raw content if requested
  if (preserveRaw && research.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(research.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * Generate data-model.md content
 * @param {import('../ir/types').DataModelIR} dataModel
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateDataModel(dataModel, preserveRaw = false) {
  const lines = [];

  lines.push('# Data Model');
  lines.push('');

  // Entities
  if (dataModel.entities && dataModel.entities.length > 0) {
    lines.push('## Entities');
    lines.push('');

    for (const entity of dataModel.entities) {
      lines.push(`### Entity: ${entity.name}`);
      lines.push('');

      if (entity.description) {
        lines.push(entity.description);
        lines.push('');
      }

      if (entity.fields && entity.fields.length > 0) {
        for (const field of entity.fields) {
          let fieldLine = `- ${field.name}: ${field.type}`;
          if (field.required) fieldLine += '*';
          lines.push(fieldLine);
        }
        lines.push('');
      }
    }
  }

  // Relationships
  if (dataModel.relationships && dataModel.relationships.length > 0) {
    lines.push('## Relationships');
    lines.push('');

    for (const rel of dataModel.relationships) {
      const relType = rel.type === 'one-to-many' ? 'has many' : 'has one';
      lines.push(`- ${rel.from} ${relType} ${rel.to}`);
    }
    lines.push('');
  }

  // Preserve raw content if requested
  if (preserveRaw && dataModel.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(dataModel.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * Generate contract content
 * @param {import('../ir/types').ContractIR} contract
 * @returns {string}
 */
function generateContract(contract) {
  const lines = [];

  lines.push(`# ${contract.name}`);
  lines.push('');
  lines.push(`**Type**: ${contract.type.toUpperCase()}`);
  lines.push('');

  if (contract.rawContent) {
    lines.push(contract.rawContent);
  } else {
    lines.push('> Contract details to be defined.');
  }

  return lines.join('\n');
}

/**
 * Generate quickstart.md content
 * @param {import('../ir/types').QuickstartIR} quickstart
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateQuickstart(quickstart, preserveRaw = false) {
  const lines = [];

  lines.push('# Quickstart');
  lines.push('');

  if (quickstart.steps && quickstart.steps.length > 0) {
    for (let i = 0; i < quickstart.steps.length; i++) {
      const step = quickstart.steps[i];
      lines.push(`${i + 1}. ${step.step || step}`);
    }
    lines.push('');
  }

  // Preserve raw content if requested
  if (preserveRaw && quickstart.rawContent) {
    lines.push('---');
    lines.push('');
    lines.push('## Original Content');
    lines.push('');
    lines.push('```markdown');
    lines.push(quickstart.rawContent);
    lines.push('```');
  }

  return lines.join('\n');
}

module.exports = {
  writeSpeckitProject,
  writeFeature,
  generateConstitution,
  generateSpec,
  generatePlan,
  generateTasks,
  generateResearch,
  generateDataModel,
  generateContract,
  generateQuickstart,
};
