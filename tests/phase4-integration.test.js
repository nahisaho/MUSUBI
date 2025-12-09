/**
 * @file phase4-integration.test.js
 * @description Tests for Phase 4 Advanced Integrations
 */

'use strict';

const phase4Integration = require('../src/phase4-integration');

describe('Phase 4 Integration', () => {
  describe('Module Exports', () => {
    it('should export phase4 object', () => {
      expect(phase4Integration.phase4).toBeDefined();
      expect(phase4Integration.phase4.version).toBe('4.0.0');
      expect(phase4Integration.phase4.phase).toBe(4);
    });
    
    it('should export codebase intelligence modules', () => {
      expect(phase4Integration.RepositoryMap).toBeDefined();
      expect(phase4Integration.ASTExtractor).toBeDefined();
      expect(phase4Integration.ContextOptimizer).toBeDefined();
      expect(phase4Integration.createRepositoryMap).toBeDefined();
      expect(phase4Integration.createASTExtractor).toBeDefined();
      expect(phase4Integration.createContextOptimizer).toBeDefined();
    });
    
    it('should export agentic reasoning modules', () => {
      expect(phase4Integration.ReasoningEngine).toBeDefined();
      expect(phase4Integration.PlanningEngine).toBeDefined();
      expect(phase4Integration.SelfCorrection).toBeDefined();
      expect(phase4Integration.createReasoningEngine).toBeDefined();
      expect(phase4Integration.createPlanningEngine).toBeDefined();
      expect(phase4Integration.createSelfCorrection).toBeDefined();
    });
    
    it('should export agentic features modules', () => {
      expect(phase4Integration.CodeGenerator).toBeDefined();
      expect(phase4Integration.CodeReviewer).toBeDefined();
      expect(phase4Integration.createCodeGenerator).toBeDefined();
      expect(phase4Integration.createCodeReviewer).toBeDefined();
      expect(phase4Integration.generateCode).toBeDefined();
      expect(phase4Integration.reviewCode).toBeDefined();
    });
    
    it('should export enums', () => {
      expect(phase4Integration.STRATEGY).toBeDefined();
      expect(phase4Integration.STEP_TYPE).toBeDefined();
      expect(phase4Integration.TASK_STATUS).toBeDefined();
      expect(phase4Integration.PLAN_STATUS).toBeDefined();
      expect(phase4Integration.PRIORITY).toBeDefined();
      expect(phase4Integration.GEN_MODE).toBeDefined();
      expect(phase4Integration.LANGUAGE).toBeDefined();
      expect(phase4Integration.SEVERITY).toBeDefined();
      expect(phase4Integration.CATEGORY).toBeDefined();
    });
  });
  
  describe('createIntegratedAgent()', () => {
    let agent;
    
    beforeEach(() => {
      agent = phase4Integration.createIntegratedAgent();
    });
    
    it('should create an integrated agent', () => {
      expect(agent).toBeDefined();
    });
    
    it('should have codebase intelligence components', () => {
      expect(agent.repositoryMap).toBeDefined();
      expect(agent.astExtractor).toBeDefined();
      expect(agent.contextOptimizer).toBeDefined();
    });
    
    it('should have agentic reasoning components', () => {
      expect(agent.reasoningEngine).toBeDefined();
      expect(agent.planningEngine).toBeDefined();
      expect(agent.selfCorrection).toBeDefined();
    });
    
    it('should have agentic features components', () => {
      expect(agent.codeGenerator).toBeDefined();
      expect(agent.codeReviewer).toBeDefined();
    });
    
    it('should have analyzeRepository method', () => {
      expect(typeof agent.analyzeRepository).toBe('function');
    });
    
    it('should have generateWithReasoning method', () => {
      expect(typeof agent.generateWithReasoning).toBe('function');
    });
    
    it('should have getStats method', () => {
      expect(typeof agent.getStats).toBe('function');
    });
    
    it('should generate code with reasoning', async () => {
      const result = await agent.generateWithReasoning('A utility function');
      
      expect(result).toBeDefined();
      expect(result.generated).toBeDefined();
      expect(result.review).toBeDefined();
      // plan may be undefined depending on planningEngine.createPlan return
      expect(typeof result.needsImprovement).toBe('boolean');
    });
  });
  
  describe('Phase 4 Submodules', () => {
    it('should have mcp integration', () => {
      expect(phase4Integration.phase4.mcp).toBeDefined();
    });
    
    it('should have codebase submodule', () => {
      expect(phase4Integration.phase4.codebase).toBeDefined();
      expect(phase4Integration.phase4.codebase.RepositoryMap).toBeDefined();
      expect(phase4Integration.phase4.codebase.ASTExtractor).toBeDefined();
      expect(phase4Integration.phase4.codebase.ContextOptimizer).toBeDefined();
    });
    
    it('should have reasoning submodule', () => {
      expect(phase4Integration.phase4.reasoning).toBeDefined();
      expect(phase4Integration.phase4.reasoning.ReasoningEngine).toBeDefined();
      expect(phase4Integration.phase4.reasoning.PlanningEngine).toBeDefined();
      expect(phase4Integration.phase4.reasoning.SelfCorrection).toBeDefined();
    });
    
    it('should have agentic submodule', () => {
      expect(phase4Integration.phase4.agentic).toBeDefined();
      expect(phase4Integration.phase4.agentic.CodeGenerator).toBeDefined();
      expect(phase4Integration.phase4.agentic.CodeReviewer).toBeDefined();
    });
  });
  
  describe('Cross-Module Integration', () => {
    it('should use reasoning with code generation', async () => {
      const reasoningEngine = phase4Integration.createReasoningEngine();
      const codeGenerator = phase4Integration.createCodeGenerator();
      
      // Reason about the task
      const reasoning = reasoningEngine.reason('How to create a sum function', {
        strategy: phase4Integration.STRATEGY.CHAIN_OF_THOUGHT
      });
      
      expect(reasoning).toBeDefined();
      
      // Generate based on reasoning
      const generated = await codeGenerator.generate({
        description: 'A function that sums two numbers',
        language: phase4Integration.LANGUAGE.JAVASCRIPT
      });
      
      expect(generated.code).toBeDefined();
    });
    
    it('should use planning with self-correction', () => {
      const planningEngine = phase4Integration.createPlanningEngine();
      const selfCorrection = phase4Integration.createSelfCorrection();
      
      // Create a plan
      const plan = planningEngine.createPlan('Build a feature');
      expect(plan).toBeDefined();
      
      // Simulate an error and analyze
      const analysis = selfCorrection.analyzeError({
        error: new Error('Test error'),
        context: { planId: plan.id }
      });
      
      expect(analysis).toBeDefined();
    });
    
    it('should review generated code', async () => {
      const generated = await phase4Integration.generateCode('A helper function');
      const review = phase4Integration.reviewCode(generated.code, {
        language: 'javascript'
      });
      
      expect(review.score).toBeDefined();
      expect(review.issues).toBeInstanceOf(Array);
    });
  });
});
