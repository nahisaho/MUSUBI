/**
 * @file reasoning-engine.test.js
 * @description Tests for ReasoningEngine
 */

'use strict';

const { 
  ReasoningEngine, 
  createReasoningEngine, 
  reason,
  STRATEGY,
  STEP_TYPE
} = require('../../../src/orchestration/reasoning/reasoning-engine');

describe('ReasoningEngine', () => {
  let engine;
  
  beforeEach(() => {
    engine = new ReasoningEngine();
  });
  
  describe('constructor', () => {
    it('should create with default options', () => {
      expect(engine.strategy).toBe(STRATEGY.CHAIN_OF_THOUGHT);
      expect(engine.maxSteps).toBe(20);
      expect(engine.minConfidence).toBe(0.6);
      expect(engine.enableReflection).toBe(true);
      expect(engine.enableBacktracking).toBe(true);
    });
    
    it('should accept custom options', () => {
      const custom = new ReasoningEngine({
        strategy: STRATEGY.TREE_OF_THOUGHT,
        maxSteps: 10,
        minConfidence: 0.8,
        enableReflection: false
      });
      
      expect(custom.strategy).toBe(STRATEGY.TREE_OF_THOUGHT);
      expect(custom.maxSteps).toBe(10);
      expect(custom.minConfidence).toBe(0.8);
      expect(custom.enableReflection).toBe(false);
    });
  });
  
  describe('reason', () => {
    it('should reason about a problem', async () => {
      const trace = await engine.reason('How to implement a sort algorithm');
      
      expect(trace).toBeDefined();
      expect(trace.id).toMatch(/^trace-/);
      expect(trace.problem).toBe('How to implement a sort algorithm');
      expect(trace.strategy).toBe(STRATEGY.CHAIN_OF_THOUGHT);
      expect(trace.steps.length).toBeGreaterThan(0);
      expect(trace.totalTime).toBeGreaterThanOrEqual(0);
    });
    
    it('should emit events during reasoning', async () => {
      const events = [];
      
      engine.on('reasoning:start', (e) => events.push({ type: 'start', ...e }));
      engine.on('reasoning:step', (e) => events.push({ type: 'step', ...e }));
      engine.on('reasoning:complete', (e) => events.push({ type: 'complete', ...e }));
      
      await engine.reason('Test problem');
      
      expect(events.some(e => e.type === 'start')).toBe(true);
      expect(events.some(e => e.type === 'step')).toBe(true);
      expect(events.some(e => e.type === 'complete')).toBe(true);
    });
    
    it('should decompose compound problems', async () => {
      const trace = await engine.reason('Create a file and then validate it');
      
      expect(trace.steps.length).toBeGreaterThan(2);
      expect(trace.steps.some(s => s.type === STEP_TYPE.THINK)).toBe(true);
    });
  });
  
  describe('strategies', () => {
    it('should use chain of thought strategy', async () => {
      engine.strategy = STRATEGY.CHAIN_OF_THOUGHT;
      const trace = await engine.reason('Test problem');
      
      expect(trace.strategy).toBe(STRATEGY.CHAIN_OF_THOUGHT);
      expect(trace.steps.some(s => s.type === STEP_TYPE.OBSERVE)).toBe(true);
    });
    
    it('should use tree of thought strategy', async () => {
      engine.strategy = STRATEGY.TREE_OF_THOUGHT;
      const trace = await engine.reason('Explore multiple solutions');
      
      expect(trace.strategy).toBe(STRATEGY.TREE_OF_THOUGHT);
      expect(trace.steps.some(s => s.type === STEP_TYPE.PLAN)).toBe(true);
    });
    
    it('should use reflective reasoning strategy', async () => {
      engine.strategy = STRATEGY.REFLECTION;
      const trace = await engine.reason('Iterate on solution');
      
      expect(trace.strategy).toBe(STRATEGY.REFLECTION);
      // Reflective reasoning may use THINK or REFINE steps
      expect(trace.steps.some(s => s.type === STEP_TYPE.THINK || s.type === STEP_TYPE.REFINE)).toBe(true);
    });
    
    it('should use decomposition strategy', async () => {
      engine.strategy = STRATEGY.DECOMPOSITION;
      const trace = await engine.reason('Complex multi-part problem');
      
      expect(trace.strategy).toBe(STRATEGY.DECOMPOSITION);
      expect(trace.steps.some(s => s.type === STEP_TYPE.PLAN)).toBe(true);
    });
    
    it('should fall back for analogy strategy without analogies', async () => {
      engine.strategy = STRATEGY.ANALOGY;
      const trace = await engine.reason('Find similar case');
      
      expect(trace.strategy).toBe(STRATEGY.ANALOGY);
      // Should fall back to chain of thought
      expect(trace.steps.some(s => s.type === STEP_TYPE.REFLECT)).toBe(true);
    });
  });
  
  describe('trace management', () => {
    it('should store traces', async () => {
      const trace = await engine.reason('Test');
      
      const retrieved = engine.getTrace(trace.id);
      expect(retrieved).toEqual(trace);
    });
    
    it('should return null for missing trace', () => {
      expect(engine.getTrace('non-existent')).toBeNull();
    });
    
    it('should get all traces', async () => {
      await engine.reason('Problem 1');
      await engine.reason('Problem 2');
      
      const traces = engine.getAllTraces();
      expect(traces.length).toBe(2);
    });
    
    it('should clear traces', async () => {
      await engine.reason('Problem');
      engine.clearTraces();
      
      expect(engine.getAllTraces().length).toBe(0);
    });
  });
  
  describe('statistics', () => {
    it('should return stats', async () => {
      await engine.reason('Problem 1');
      await engine.reason('Problem 2');
      
      const stats = engine.getStats();
      
      expect(stats.totalTraces).toBe(2);
      expect(stats.successfulTraces).toBeGreaterThanOrEqual(0);
      expect(stats.totalSteps).toBeGreaterThan(0);
      expect(stats.averageStepsPerTrace).toBeGreaterThan(0);
    });
    
    it('should return zeros for empty engine', () => {
      const stats = engine.getStats();
      
      expect(stats.totalTraces).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.averageTime).toBe(0);
    });
  });
  
  describe('exportTrace', () => {
    it('should export trace to readable format', async () => {
      const trace = await engine.reason('Test problem');
      const exported = engine.exportTrace(trace.id);
      
      expect(exported).toContain('# Reasoning Trace');
      expect(exported).toContain('Test problem');
      expect(exported).toContain('## Steps');
      expect(exported).toContain('## Conclusion');
    });
    
    it('should return empty for missing trace', () => {
      expect(engine.exportTrace('non-existent')).toBe('');
    });
  });
});

describe('createReasoningEngine', () => {
  it('should create engine instance', () => {
    const engine = createReasoningEngine();
    expect(engine).toBeInstanceOf(ReasoningEngine);
  });
  
  it('should pass options', () => {
    const engine = createReasoningEngine({ maxSteps: 5 });
    expect(engine.maxSteps).toBe(5);
  });
});

describe('reason', () => {
  it('should reason about problem', async () => {
    const trace = await reason('Quick test');
    
    expect(trace).toBeDefined();
    expect(trace.problem).toBe('Quick test');
    expect(trace.steps.length).toBeGreaterThan(0);
  });
});

describe('Constants', () => {
  it('should have strategy types', () => {
    expect(STRATEGY.CHAIN_OF_THOUGHT).toBe('chain-of-thought');
    expect(STRATEGY.TREE_OF_THOUGHT).toBe('tree-of-thought');
    expect(STRATEGY.REFLECTION).toBe('reflection');
    expect(STRATEGY.DECOMPOSITION).toBe('decomposition');
    expect(STRATEGY.ANALOGY).toBe('analogy');
  });
  
  it('should have step types', () => {
    expect(STEP_TYPE.OBSERVE).toBe('observe');
    expect(STEP_TYPE.THINK).toBe('think');
    expect(STEP_TYPE.PLAN).toBe('plan');
    expect(STEP_TYPE.ACT).toBe('act');
    expect(STEP_TYPE.REFLECT).toBe('reflect');
    expect(STEP_TYPE.REFINE).toBe('refine');
  });
});
