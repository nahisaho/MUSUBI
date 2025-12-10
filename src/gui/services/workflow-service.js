/**
 * @fileoverview Workflow Service
 * @module gui/services/workflow-service
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

/**
 * Workflow Service - Manages SDD workflow state and transitions
 */
class WorkflowService {
  /**
   * Create a new WorkflowService instance
   * @param {string} projectPath - Project path
   */
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.stages = [
      'steering',
      'requirements',
      'design',
      'tasks',
      'implementation',
      'review',
      'validation',
      'completion',
    ];
  }

  /**
   * Get workflow state for a feature
   * @param {string} featureId - Feature ID
   * @returns {Promise<Object>} Workflow state
   */
  async getWorkflowState(featureId) {
    const state = {
      featureId,
      currentStage: 'steering',
      completedStages: [],
      artifacts: {},
      progress: 0,
    };

    // Check steering
    const steeringPath = path.join(this.projectPath, 'steering');
    const constitutionPath = path.join(steeringPath, 'rules', 'constitution.md');

    try {
      await fs.access(constitutionPath);
      state.completedStages.push('steering');
      state.artifacts.steering = {
        constitution: true,
        product: await this.fileExists(path.join(steeringPath, 'product.md')),
        structure: await this.fileExists(path.join(steeringPath, 'structure.md')),
        tech: await this.fileExists(path.join(steeringPath, 'tech.md')),
      };
    } catch {
      return state;
    }

    // Check requirements
    const requirementsPath = path.join(
      this.projectPath,
      'storage',
      'specs',
      `${featureId}-requirements.md`
    );
    if (await this.fileExists(requirementsPath)) {
      state.completedStages.push('requirements');
      state.currentStage = 'design';
      state.artifacts.requirements = await this.parseSpecFile(requirementsPath);
    }

    // Check design
    const designPath = path.join(this.projectPath, 'storage', 'specs', `${featureId}-design.md`);
    if (await this.fileExists(designPath)) {
      state.completedStages.push('design');
      state.currentStage = 'tasks';
      state.artifacts.design = await this.parseSpecFile(designPath);
    }

    // Check tasks
    const tasksPath = path.join(this.projectPath, 'storage', 'specs', `${featureId}-tasks.md`);
    if (await this.fileExists(tasksPath)) {
      state.completedStages.push('tasks');
      state.currentStage = 'implementation';
      state.artifacts.tasks = await this.parseSpecFile(tasksPath);
    }

    // Calculate progress
    state.progress = Math.round((state.completedStages.length / this.stages.length) * 100);

    return state;
  }

  /**
   * Get all workflows
   * @returns {Promise<Array<Object>>} Array of workflow states
   */
  async getAllWorkflows() {
    const specsPath = path.join(this.projectPath, 'storage', 'specs');
    const workflows = new Map();

    try {
      const files = await fs.readdir(specsPath);

      for (const file of files) {
        const match = file.match(/^(.+)-(requirements|design|tasks)\.md$/);
        if (match) {
          const featureId = match[1];
          if (!workflows.has(featureId)) {
            workflows.set(featureId, await this.getWorkflowState(featureId));
          }
        }
      }
    } catch {
      // Specs directory doesn't exist
    }

    return Array.from(workflows.values());
  }

  /**
   * Transition workflow to next stage
   * @param {string} featureId - Feature ID
   * @param {string} targetStage - Target stage
   * @returns {Promise<Object>} Updated workflow state
   */
  async transitionTo(featureId, targetStage) {
    const currentState = await this.getWorkflowState(featureId);
    const currentIndex = this.stages.indexOf(currentState.currentStage);
    const targetIndex = this.stages.indexOf(targetStage);

    if (targetIndex < 0) {
      throw new Error(`Unknown stage: ${targetStage}`);
    }

    if (targetIndex > currentIndex + 1) {
      throw new Error(
        `Cannot skip stages. Current: ${currentState.currentStage}, Target: ${targetStage}`
      );
    }

    // The actual transition is done by creating the artifact
    // Return what the expected state would be
    return {
      ...currentState,
      currentStage: targetStage,
    };
  }

  /**
   * Validate workflow artifacts
   * @param {string} featureId - Feature ID
   * @returns {Promise<Object>} Validation result
   */
  async validateWorkflow(featureId) {
    const state = await this.getWorkflowState(featureId);
    const issues = [];

    // Check for missing stages
    for (let i = 0; i < state.completedStages.length; i++) {
      const expectedStage = this.stages[i];
      if (state.completedStages[i] !== expectedStage) {
        issues.push({
          type: 'warning',
          message: `Stage ${expectedStage} may be incomplete`,
          stage: expectedStage,
        });
      }
    }

    // Check artifact quality
    if (state.artifacts.requirements) {
      const reqCount = state.artifacts.requirements.sections?.length || 0;
      if (reqCount === 0) {
        issues.push({
          type: 'error',
          message: 'No requirements defined',
          stage: 'requirements',
        });
      }
    }

    if (state.artifacts.tasks) {
      const taskCount = state.artifacts.tasks.sections?.length || 0;
      if (taskCount === 0) {
        issues.push({
          type: 'error',
          message: 'No tasks defined',
          stage: 'tasks',
        });
      }
    }

    return {
      featureId,
      valid: issues.filter(i => i.type === 'error').length === 0,
      issues,
      state,
    };
  }

  /**
   * Check if file exists
   * @param {string} filePath - File path
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse a spec file
   * @param {string} filePath - File path
   * @returns {Promise<Object>}
   */
  async parseSpecFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content: body } = matter(content);

      const sections = [];
      const sectionRegex = /^##\s+(.+)$/gm;
      let match;

      while ((match = sectionRegex.exec(body)) !== null) {
        sections.push(match[1]);
      }

      return {
        frontmatter,
        sections,
        path: filePath,
      };
    } catch {
      return { frontmatter: {}, sections: [], path: filePath };
    }
  }
}

module.exports = WorkflowService;
