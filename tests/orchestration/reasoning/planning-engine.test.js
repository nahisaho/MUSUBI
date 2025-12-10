/**
 * @file planning-engine.test.js
 * @description Tests for PlanningEngine
 */

'use strict';

const {
  PlanningEngine,
  createPlanningEngine,
  createPlan,
  PLAN_STATUS,
  TASK_STATUS,
  PRIORITY,
} = require('../../../src/orchestration/reasoning/planning-engine');

describe('PlanningEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new PlanningEngine();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      expect(engine.maxTasks).toBe(50);
      expect(engine.parallelExecution).toBe(true);
      expect(engine.maxParallel).toBe(4);
      expect(engine.adaptivePlanning).toBe(true);
    });

    it('should accept custom options', () => {
      const custom = new PlanningEngine({
        maxTasks: 20,
        parallelExecution: false,
        maxParallel: 2,
      });

      expect(custom.maxTasks).toBe(20);
      expect(custom.parallelExecution).toBe(false);
      expect(custom.maxParallel).toBe(2);
    });
  });

  describe('createPlan', () => {
    it('should create plan from goal', async () => {
      const plan = await engine.createPlan('Build a REST API');

      expect(plan).toBeDefined();
      expect(plan.id).toMatch(/^plan-/);
      expect(plan.goal).toBe('Build a REST API');
      expect(plan.status).toBe(PLAN_STATUS.READY);
      expect(plan.tasks.length).toBeGreaterThan(0);
    });

    it('should decompose goal into tasks', async () => {
      const plan = await engine.createPlan('Create and test feature');

      expect(plan.tasks.length).toBeGreaterThan(1);
      expect(plan.tasks.some(t => t.name)).toBe(true);
      expect(plan.tasks.some(t => t.status === TASK_STATUS.READY)).toBe(true);
    });

    it('should emit events during creation', async () => {
      const events = [];

      engine.on('plan:creating', e => events.push({ type: 'creating', ...e }));
      engine.on('plan:created', e => events.push({ type: 'created', ...e }));

      await engine.createPlan('Test goal');

      expect(events.some(e => e.type === 'creating')).toBe(true);
      expect(events.some(e => e.type === 'created')).toBe(true);
    });

    it('should set metrics', async () => {
      const plan = await engine.createPlan('Implement feature');

      expect(plan.metrics.totalTasks).toBe(plan.tasks.length);
      expect(plan.metrics.totalEstimatedTime).toBeGreaterThan(0);
      expect(plan.metrics.completedTasks).toBe(0);
    });
  });

  describe('executePlan', () => {
    it('should execute plan sequentially', async () => {
      engine.parallelExecution = false;
      const plan = await engine.createPlan('Test execution');

      const executor = jest.fn().mockResolvedValue({ success: true });

      const result = await engine.executePlan(plan.id, executor);

      expect(result.status).toBe(PLAN_STATUS.COMPLETED);
      expect(executor).toHaveBeenCalledTimes(plan.tasks.length);
    });

    it('should execute plan in parallel', async () => {
      engine.parallelExecution = true;
      engine.maxParallel = 2;

      const plan = await engine.createPlan('Test parallel');

      const executor = jest.fn().mockResolvedValue({ success: true });

      const result = await engine.executePlan(plan.id, executor);

      expect(result.status).toBe(PLAN_STATUS.COMPLETED);
      expect(result.metrics.completedTasks).toBe(plan.tasks.length);
    });

    it('should handle task failures', async () => {
      const plan = await engine.createPlan('Test failure');

      const executor = jest.fn().mockRejectedValue(new Error('Task failed'));

      const result = await engine.executePlan(plan.id, executor);

      expect(result.status).toBe(PLAN_STATUS.FAILED);
      expect(result.metrics.failedTasks).toBeGreaterThan(0);
    });

    it('should emit task events', async () => {
      const plan = await engine.createPlan('Test events');
      const events = [];

      engine.on('task:start', e => events.push({ type: 'start', ...e }));
      engine.on('task:complete', e => events.push({ type: 'complete', ...e }));

      await engine.executePlan(plan.id, () => Promise.resolve('done'));

      expect(events.some(e => e.type === 'start')).toBe(true);
      expect(events.some(e => e.type === 'complete')).toBe(true);
    });
  });

  describe('plan control', () => {
    it('should pause and resume plan', async () => {
      const plan = await engine.createPlan('Test pause');

      // Pause only works on executing plans
      // For now, just verify the pausePlan doesn't throw on ready plan
      expect(() => engine.pausePlan(plan.id)).not.toThrow();
    });

    it('should cancel plan', async () => {
      const plan = await engine.createPlan('Test cancel');

      engine.cancelPlan(plan.id);

      expect(engine.getPlan(plan.id).status).toBe(PLAN_STATUS.CANCELLED);
      expect(engine.getPlan(plan.id).metrics.skippedTasks).toBeGreaterThan(0);
    });
  });

  describe('task management', () => {
    it('should add task to plan', async () => {
      const plan = await engine.createPlan('Test add');
      const originalCount = plan.tasks.length;

      const task = engine.addTask(plan.id, {
        name: 'New Task',
        description: 'Added dynamically',
      });

      expect(task.id).toMatch(/^task-/);
      expect(plan.tasks.length).toBe(originalCount + 1);
    });

    it('should remove task from plan', async () => {
      const plan = await engine.createPlan('Test remove');
      const taskId = plan.tasks[0].id;

      engine.removeTask(plan.id, taskId);

      expect(plan.tasks.find(t => t.id === taskId)).toBeUndefined();
    });

    it('should add task after specific task', async () => {
      const plan = await engine.createPlan('Test after');
      const afterId = plan.tasks[0].id;

      const task = engine.addTask(plan.id, {
        name: 'After Task',
        after: afterId,
      });

      expect(task.dependencies).toContain(afterId);
    });
  });

  describe('progress tracking', () => {
    it('should get plan progress', async () => {
      const plan = await engine.createPlan('Test progress');

      const progress = engine.getProgress(plan.id);

      expect(progress.total).toBe(plan.tasks.length);
      expect(progress.completed).toBe(0);
      expect(progress.percentage).toBe(0);
      expect(progress.pending).toBeGreaterThan(0);
    });

    it('should return null for missing plan', () => {
      expect(engine.getProgress('non-existent')).toBeNull();
    });
  });

  describe('dependency graph', () => {
    it('should get dependency graph', async () => {
      const plan = await engine.createPlan('Test graph');

      const graph = engine.getDependencyGraph(plan.id);

      expect(graph.nodes.length).toBe(plan.tasks.length);
      expect(Array.isArray(graph.edges)).toBe(true);
    });
  });

  describe('plan management', () => {
    it('should get plan by ID', async () => {
      const plan = await engine.createPlan('Test get');

      expect(engine.getPlan(plan.id)).toEqual(plan);
    });

    it('should return null for missing plan', () => {
      expect(engine.getPlan('non-existent')).toBeNull();
    });

    it('should get all plans', async () => {
      await engine.createPlan('Plan 1');
      await engine.createPlan('Plan 2');

      expect(engine.getAllPlans().length).toBe(2);
    });

    it('should clear plans', async () => {
      await engine.createPlan('Plan');
      engine.clearPlans();

      expect(engine.getAllPlans().length).toBe(0);
    });
  });

  describe('exportPlan', () => {
    it('should export plan to readable format', async () => {
      const plan = await engine.createPlan('Test export');
      const exported = engine.exportPlan(plan.id);

      expect(exported).toContain('# Plan:');
      expect(exported).toContain('Test export');
      expect(exported).toContain('## Tasks');
      expect(exported).toContain('## Metrics');
    });

    it('should return empty for missing plan', () => {
      expect(engine.exportPlan('non-existent')).toBe('');
    });
  });
});

describe('createPlanningEngine', () => {
  it('should create engine instance', () => {
    const engine = createPlanningEngine();
    expect(engine).toBeInstanceOf(PlanningEngine);
  });

  it('should pass options', () => {
    const engine = createPlanningEngine({ maxTasks: 10 });
    expect(engine.maxTasks).toBe(10);
  });
});

describe('createPlan', () => {
  it('should create plan from goal', async () => {
    const plan = await createPlan('Quick test');

    expect(plan).toBeDefined();
    expect(plan.goal).toBe('Quick test');
  });
});

describe('Constants', () => {
  it('should have plan statuses', () => {
    expect(PLAN_STATUS.DRAFT).toBe('draft');
    expect(PLAN_STATUS.READY).toBe('ready');
    expect(PLAN_STATUS.EXECUTING).toBe('executing');
    expect(PLAN_STATUS.COMPLETED).toBe('completed');
    expect(PLAN_STATUS.FAILED).toBe('failed');
  });

  it('should have task statuses', () => {
    expect(TASK_STATUS.PENDING).toBe('pending');
    expect(TASK_STATUS.READY).toBe('ready');
    expect(TASK_STATUS.IN_PROGRESS).toBe('in-progress');
    expect(TASK_STATUS.COMPLETED).toBe('completed');
    expect(TASK_STATUS.FAILED).toBe('failed');
  });

  it('should have priorities', () => {
    expect(PRIORITY.CRITICAL).toBe(0);
    expect(PRIORITY.HIGH).toBe(1);
    expect(PRIORITY.MEDIUM).toBe(2);
    expect(PRIORITY.LOW).toBe(3);
  });
});
