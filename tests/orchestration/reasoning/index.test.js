/**
 * @file index.test.js
 * @description Tests for reasoning module exports
 */

'use strict';

const reasoning = require('../../../src/orchestration/reasoning');

describe('Reasoning Module Exports', () => {
  describe('ReasoningEngine exports', () => {
    it('should export ReasoningEngine class', () => {
      expect(reasoning.ReasoningEngine).toBeDefined();
      expect(typeof reasoning.ReasoningEngine).toBe('function');
    });
    
    it('should export createReasoningEngine', () => {
      expect(typeof reasoning.createReasoningEngine).toBe('function');
    });
    
    it('should export reason function', () => {
      expect(typeof reasoning.reason).toBe('function');
    });
    
    it('should export STRATEGY constants', () => {
      expect(reasoning.STRATEGY).toBeDefined();
      expect(reasoning.STRATEGY.CHAIN_OF_THOUGHT).toBe('chain-of-thought');
    });
    
    it('should export STEP_TYPE constants', () => {
      expect(reasoning.STEP_TYPE).toBeDefined();
      expect(reasoning.STEP_TYPE.THINK).toBe('think');
    });
  });
  
  describe('PlanningEngine exports', () => {
    it('should export PlanningEngine class', () => {
      expect(reasoning.PlanningEngine).toBeDefined();
      expect(typeof reasoning.PlanningEngine).toBe('function');
    });
    
    it('should export createPlanningEngine', () => {
      expect(typeof reasoning.createPlanningEngine).toBe('function');
    });
    
    it('should export createPlan function', () => {
      expect(typeof reasoning.createPlan).toBe('function');
    });
    
    it('should export PLAN_STATUS constants', () => {
      expect(reasoning.PLAN_STATUS).toBeDefined();
      expect(reasoning.PLAN_STATUS.READY).toBe('ready');
    });
    
    it('should export TASK_STATUS constants', () => {
      expect(reasoning.TASK_STATUS).toBeDefined();
      expect(reasoning.TASK_STATUS.COMPLETED).toBe('completed');
    });
    
    it('should export PRIORITY constants', () => {
      expect(reasoning.PRIORITY).toBeDefined();
      expect(reasoning.PRIORITY.HIGH).toBe(1);
    });
  });
  
  describe('SelfCorrection exports', () => {
    it('should export SelfCorrection class', () => {
      expect(reasoning.SelfCorrection).toBeDefined();
      expect(typeof reasoning.SelfCorrection).toBe('function');
    });
    
    it('should export createSelfCorrection', () => {
      expect(typeof reasoning.createSelfCorrection).toBe('function');
    });
    
    it('should export correctError function', () => {
      expect(typeof reasoning.correctError).toBe('function');
    });
    
    it('should export SEVERITY constants', () => {
      expect(reasoning.SEVERITY).toBeDefined();
      expect(reasoning.SEVERITY.ERROR).toBe('error');
    });
    
    it('should export CORRECTION_STRATEGY constants', () => {
      expect(reasoning.CORRECTION_STRATEGY).toBeDefined();
      expect(reasoning.CORRECTION_STRATEGY.RETRY).toBe('retry');
    });
    
    it('should export DEFAULT_PATTERNS', () => {
      expect(reasoning.DEFAULT_PATTERNS).toBeDefined();
      expect(Array.isArray(reasoning.DEFAULT_PATTERNS)).toBe(true);
    });
  });
  
  describe('Integration', () => {
    it('should create instances from exports', () => {
      const engine = new reasoning.ReasoningEngine();
      expect(engine).toBeInstanceOf(reasoning.ReasoningEngine);
      
      const planner = new reasoning.PlanningEngine();
      expect(planner).toBeInstanceOf(reasoning.PlanningEngine);
      
      const corrector = new reasoning.SelfCorrection();
      expect(corrector).toBeInstanceOf(reasoning.SelfCorrection);
    });
  });
});
