/**
 * MUSUBI Writer
 *
 * Writes Intermediate Representation (IR) to MUSUBI project structure
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Write Project IR to MUSUBI format
 * @param {import('../ir/types').ProjectIR} ir - Project IR
 * @param {string} outputPath - Output directory
 * @param {Object} options - Writer options
 * @returns {Promise<{filesWritten: number, warnings: string[]}>}
 */
async function writeMusubiProject(ir, outputPath, options = {}) {
  const { dryRun = false, force = false, preserveRaw = false, verbose = false } = options;
  const warnings = [];
  let filesWritten = 0;

  // Create base directories
  const dirs = [
    path.join(outputPath, 'steering'),
    path.join(outputPath, 'steering', 'rules'),
    path.join(outputPath, 'steering', 'templates'),
    path.join(outputPath, 'steering', 'memories'),
    path.join(outputPath, 'storage', 'specs'),
  ];

  if (!dryRun) {
    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  // Write project.yml
  const projectYmlPath = path.join(outputPath, 'steering', 'project.yml');
  const projectYml = generateProjectYml(ir);
  if (!dryRun) {
    await writeFile(projectYmlPath, projectYml, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${projectYmlPath}`);

  // Write constitution
  const constitutionPath = path.join(outputPath, 'steering', 'rules', 'constitution.md');
  const constitution = generateConstitution(ir.constitution, preserveRaw);
  if (!dryRun) {
    await writeFile(constitutionPath, constitution, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${constitutionPath}`);

  // Write product.md
  const productPath = path.join(outputPath, 'steering', 'product.md');
  const product = generateProduct(ir);
  if (!dryRun) {
    await writeFile(productPath, product, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${productPath}`);

  // Write structure.md
  const structurePath = path.join(outputPath, 'steering', 'structure.md');
  const structure = generateStructure(ir);
  if (!dryRun) {
    await writeFile(structurePath, structure, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${structurePath}`);

  // Write tech.md
  const techPath = path.join(outputPath, 'steering', 'tech.md');
  const tech = generateTech(ir);
  if (!dryRun) {
    await writeFile(techPath, tech, force);
    filesWritten++;
  }
  if (verbose) console.log(`  Writing: ${techPath}`);

  // Write features
  for (const feature of ir.features) {
    const featurePath = path.join(outputPath, 'storage', 'specs', feature.id);
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
    const templatePath = path.join(outputPath, 'steering', 'templates', `${template.name}.md`);
    if (!dryRun) {
      await writeFile(templatePath, template.content, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${templatePath}`);
  }

  // Write memories
  for (const memory of ir.memories) {
    const memoryPath = path.join(outputPath, 'steering', 'memories', `${memory.category}.md`);
    const memoryContent = memory.entries.map(e => e.content).join('\n\n---\n\n');
    if (!dryRun) {
      await writeFile(memoryPath, memoryContent, force);
      filesWritten++;
    }
    if (verbose) console.log(`  Writing: ${memoryPath}`);
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
 * Generate project.yml content
 * @param {import('../ir/types').ProjectIR} ir
 * @returns {string}
 */
function generateProjectYml(ir) {
  const projectData = {
    project: {
      name: ir.metadata.name,
      version: ir.metadata.version,
      description: `Converted from ${ir.metadata.sourceFormat}`,
    },
    conversion: {
      sourceFormat: ir.metadata.sourceFormat,
      sourceVersion: ir.metadata.sourceVersion,
      convertedAt: ir.metadata.convertedAt.toISOString(),
    },
    features: ir.features.map(f => ({
      id: f.id,
      name: f.name,
      status: f.status,
    })),
  };

  return yaml.dump(projectData, { lineWidth: 100 });
}

/**
 * Generate constitution.md content
 * @param {import('../ir/types').ConstitutionIR} constitution
 * @param {boolean} preserveRaw
 * @returns {string}
 */
function generateConstitution(constitution, preserveRaw = false) {
  const lines = [];

  lines.push('# MUSUBI Constitution');
  lines.push('');
  lines.push('The fundamental principles governing this project.');
  lines.push('');

  // Write articles
  for (const article of constitution.articles) {
    lines.push(`## Article ${article.number}: ${article.name}`);
    lines.push('');

    if (article.description) {
      lines.push(article.description);
      lines.push('');
    }

    if (article.rules && article.rules.length > 0) {
      lines.push('### Rules');
      lines.push('');
      for (const rule of article.rules) {
        lines.push(`- ${rule}`);
      }
      lines.push('');
    }

    if (article.mappedFrom) {
      lines.push(`> Mapped from: ${article.mappedFrom}`);
      lines.push('');
    }
  }

  // Write governance
  if (constitution.governance) {
    lines.push('## Governance');
    lines.push('');
    lines.push(`Version: ${constitution.governance.version}`);
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
 * Generate product.md content
 * @param {import('../ir/types').ProjectIR} ir
 * @returns {string}
 */
function generateProduct(ir) {
  const lines = [];

  lines.push(`# ${ir.metadata.name}`);
  lines.push('');
  lines.push('## Overview');
  lines.push('');
  lines.push(`Project converted from ${ir.metadata.sourceFormat} format.`);
  lines.push('');
  lines.push('## Features');
  lines.push('');

  for (const feature of ir.features) {
    lines.push(`- **${feature.name}** (${feature.id}) - ${feature.status}`);
  }
  lines.push('');

  lines.push('## Version History');
  lines.push('');
  lines.push(`- ${ir.metadata.version} - Initial conversion from ${ir.metadata.sourceFormat}`);

  return lines.join('\n');
}

/**
 * Generate structure.md content
 * @param {import('../ir/types').ProjectIR} ir
 * @returns {string}
 */
function generateStructure(ir) {
  const lines = [];

  lines.push('# Project Structure');
  lines.push('');
  lines.push('## Directory Layout');
  lines.push('');
  lines.push('```');
  lines.push('steering/');
  lines.push('├── product.md          # Product overview');
  lines.push('├── structure.md        # This file');
  lines.push('├── tech.md             # Technology stack');
  lines.push('├── project.yml         # Project configuration');
  lines.push('├── rules/');
  lines.push('│   └── constitution.md # Project constitution');
  lines.push('├── templates/          # Document templates');
  lines.push('└── memories/           # Agent memories');
  lines.push('');
  lines.push('storage/');
  lines.push('└── specs/');

  for (const feature of ir.features) {
    lines.push(`    └── ${feature.id}/`);
    lines.push('        ├── spec.md');
    lines.push('        ├── plan.md');
    lines.push('        └── tasks.md');
  }

  lines.push('```');

  return lines.join('\n');
}

/**
 * Generate tech.md content
 * @param {import('../ir/types').ProjectIR} ir
 * @returns {string}
 */
function generateTech(ir) {
  const lines = [];

  lines.push('# Technology Stack');
  lines.push('');

  // Extract technical context from first feature with a plan
  const featureWithPlan = ir.features.find(f => f.plan);

  if (featureWithPlan && featureWithPlan.plan) {
    const tech = featureWithPlan.plan.technicalContext;

    lines.push('## Core Technologies');
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

    if (tech.dependencies && tech.dependencies.length > 0) {
      lines.push('');
      lines.push('## Dependencies');
      lines.push('');
      for (const dep of tech.dependencies) {
        lines.push(`- ${dep}`);
      }
    }
  } else {
    lines.push('## Core Technologies');
    lines.push('');
    lines.push('> Technology stack to be defined based on project requirements.');
  }

  return lines.join('\n');
}

/**
 * Write a feature to MUSUBI format
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

  return { filesWritten, warnings };
}

/**
 * Generate spec.md content (MUSUBI format with EARS)
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

  // Write requirements (EARS format)
  if (spec.requirements && spec.requirements.length > 0) {
    lines.push('## Requirements');
    lines.push('');

    for (const req of spec.requirements) {
      lines.push(`### ${req.id}: ${req.title || 'Requirement'}`);
      lines.push('');
      lines.push(`**Pattern**: ${req.pattern}`);
      lines.push(`**Priority**: ${req.priority}`);
      lines.push('');
      lines.push(`**Statement**: ${req.statement}`);
      lines.push('');

      if (req.acceptanceCriteria && req.acceptanceCriteria.length > 0) {
        lines.push('**Acceptance Criteria**:');
        for (const ac of req.acceptanceCriteria) {
          lines.push(`- ${ac.description}`);
        }
        lines.push('');
      }

      if (req.mappedFromUserStory) {
        lines.push(`> Converted from User Story: ${req.mappedFromUserStory}`);
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

  // Technical Context
  const tech = plan.technicalContext;
  if (tech && (tech.language || tech.framework)) {
    lines.push('## Technical Context');
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

  // Phases
  if (plan.phases && plan.phases.length > 0) {
    lines.push('## Phases');
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
 * Generate tasks.md content (MUSUBI format)
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
      let taskLine = `- ${checkbox} ${task.id}: ${task.description}`;

      lines.push(taskLine);

      // Add metadata as sub-items
      if (task.filePath) {
        lines.push(`  - Path: ${task.filePath}`);
      }
      if (task.userStory) {
        lines.push(`  - User Story: ${task.userStory}`);
      }
      if (task.parallel) {
        lines.push('  - Parallel: Yes');
      }
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

  // Alternatives
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
      lines.push(`### ${entity.name}`);
      lines.push('');

      if (entity.description) {
        lines.push(entity.description);
        lines.push('');
      }

      if (entity.fields && entity.fields.length > 0) {
        lines.push('**Fields**:');
        for (const field of entity.fields) {
          let fieldLine = `- ${field.name}: ${field.type}`;
          const modifiers = [];
          if (field.required) modifiers.push('required');
          if (field.unique) modifiers.push('unique');
          if (modifiers.length > 0) {
            fieldLine += ` (${modifiers.join(', ')})`;
          }
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
      lines.push(`- ${rel.from} → ${rel.to} (${rel.type})`);
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
  lines.push(`**Type**: ${contract.type}`);
  lines.push('');

  if (contract.rawContent) {
    lines.push(contract.rawContent);
  } else {
    lines.push('> Contract details to be defined.');
  }

  return lines.join('\n');
}

module.exports = {
  writeMusubiProject,
  writeFeature,
  generateProjectYml,
  generateConstitution,
  generateProduct,
  generateStructure,
  generateTech,
  generateSpec,
  generatePlan,
  generateTasks,
  generateResearch,
  generateDataModel,
  generateContract,
};
