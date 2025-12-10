/**
 * @file Phase 4 Advanced Integrations - Index
 * @description Export all Phase 4 advanced integration modules
 * @version 1.0.0
 */

'use strict';

// Sprint 4.1: MCP Integration Enhancement
const mcpIntegration = require('./integrations/mcp');

// Sprint 4.2: Codebase Intelligence
const {
  RepositoryMap,
  createRepositoryMap,
  generateRepositoryMap,
} = require('./analyzers/repository-map');
const { ASTExtractor, createASTExtractor } = require('./analyzers/ast-extractor');
const {
  ContextOptimizer,
  createContextOptimizer,
  optimizeContext,
} = require('./analyzers/context-optimizer');

// Sprint 4.3: Agentic Reasoning
const {
  ReasoningEngine,
  PlanningEngine,
  SelfCorrection,
  createReasoningEngine,
  createPlanningEngine,
  createSelfCorrection,
  STRATEGY,
  STEP_TYPE,
  TASK_STATUS,
  PLAN_STATUS,
  PRIORITY,
} = require('./orchestration/reasoning');

// Sprint 4.4: Agentic Features
const {
  CodeGenerator,
  CodeReviewer,
  createCodeGenerator,
  createCodeReviewer,
  generateCode,
  reviewCode,
  GEN_MODE,
  LANGUAGE,
  TEMPLATES,
  SEVERITY,
  CATEGORY,
  DEFAULT_RULES,
} = require('./agents/agentic');

/**
 * Phase 4 Advanced Integrations
 * Complete integration of all advanced features
 */
const phase4 = {
  // Version
  version: '4.0.0',
  phase: 4,

  // Sprint 4.1: MCP Integration
  mcp: mcpIntegration,

  // Sprint 4.2: Codebase Intelligence
  codebase: {
    RepositoryMap,
    createRepositoryMap,
    generateRepositoryMap,
    ASTExtractor,
    createASTExtractor,
    ContextOptimizer,
    createContextOptimizer,
    optimizeContext,
  },

  // Sprint 4.3: Agentic Reasoning
  reasoning: {
    ReasoningEngine,
    PlanningEngine,
    SelfCorrection,
    createReasoningEngine,
    createPlanningEngine,
    createSelfCorrection,
    STRATEGY,
    STEP_TYPE,
    TASK_STATUS,
    PLAN_STATUS,
    PRIORITY,
  },

  // Sprint 4.4: Agentic Features
  agentic: {
    CodeGenerator,
    CodeReviewer,
    createCodeGenerator,
    createCodeReviewer,
    generateCode,
    reviewCode,
    GEN_MODE,
    LANGUAGE,
    TEMPLATES,
    SEVERITY,
    CATEGORY,
    DEFAULT_RULES,
  },
};

/**
 * Create integrated agent with all Phase 4 capabilities
 * @param {Object} options - Agent options
 * @returns {Object} Integrated agent
 */
function createIntegratedAgent(options = {}) {
  return {
    // Codebase Intelligence
    repositoryMap: createRepositoryMap(options.repositoryMap),
    astExtractor: createASTExtractor(options.astExtractor),
    contextOptimizer: createContextOptimizer(options.contextOptimizer),

    // Agentic Reasoning
    reasoningEngine: createReasoningEngine(options.reasoning),
    planningEngine: createPlanningEngine(options.planning),
    selfCorrection: createSelfCorrection(options.selfCorrection),

    // Agentic Features
    codeGenerator: createCodeGenerator(options.codeGenerator),
    codeReviewer: createCodeReviewer(options.codeReviewer),

    /**
     * Analyze repository and generate context
     * @param {string} rootPath - Repository root path
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeRepository(rootPath) {
      const map = await this.repositoryMap.generate(rootPath);
      return {
        map,
        stats: this.repositoryMap.getStats(),
      };
    },

    /**
     * Generate code with reasoning
     * @param {string} description - What to generate
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generated code with reasoning
     */
    async generateWithReasoning(description, options = {}) {
      // Plan the generation
      const plan = this.planningEngine.createPlan(`Generate: ${description}`, {
        strategy: 'incremental',
      });

      // Reason about the implementation
      const reasoning = this.reasoningEngine.reason(`How to implement: ${description}`, {
        type: 'decomposition',
      });

      // Generate the code
      const generated = await this.codeGenerator.generate({
        description,
        ...options,
      });

      // Review the generated code
      const review = this.codeReviewer.review(generated.code, options);

      // Self-correct if needed
      if (review.score < 70) {
        const correction = this.selfCorrection.analyzeError({
          error: new Error('Code quality below threshold'),
          context: { review, generated },
        });

        return {
          generated,
          review,
          correction,
          reasoning: reasoning.result,
          plan: plan.id,
          needsImprovement: true,
        };
      }

      return {
        generated,
        review,
        reasoning: reasoning.result,
        plan: plan.id,
        needsImprovement: false,
      };
    },

    /**
     * Get agent statistics
     * @returns {Object} Agent statistics
     */
    getStats() {
      return {
        repositoryMap: this.repositoryMap.getStats(),
        reasoning: this.reasoningEngine.getStats(),
        planning: this.planningEngine.getStats(),
        codeGenerator: this.codeGenerator.getStats(),
        codeReviewer: this.codeReviewer.getStats(),
      };
    },
  };
}

module.exports = {
  ...phase4,
  phase4,
  createIntegratedAgent,

  // Direct exports for convenience
  RepositoryMap,
  ASTExtractor,
  ContextOptimizer,
  ReasoningEngine,
  PlanningEngine,
  SelfCorrection,
  CodeGenerator,
  CodeReviewer,

  // Factory functions
  createRepositoryMap,
  createASTExtractor,
  createContextOptimizer,
  createReasoningEngine,
  createPlanningEngine,
  createSelfCorrection,
  createCodeGenerator,
  createCodeReviewer,

  // Helper functions
  generateRepositoryMap,
  optimizeContext,
  generateCode,
  reviewCode,

  // Enums
  STRATEGY,
  STEP_TYPE,
  TASK_STATUS,
  PLAN_STATUS,
  PRIORITY,
  GEN_MODE,
  LANGUAGE,
  SEVERITY,
  CATEGORY,
};
