/**
 * Agent Memory Manager Tests
 *
 * Tests for REQ-P0-B008: Agent Memory & Learning
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { AgentMemoryManager, LearningItem, MemoryStore, LearningCategory, EXTRACTION_PATTERNS } = require('../../src/managers/agent-memory');

describe('AgentMemoryManager', () => {
  let manager;
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'musubi-test-'));
    manager = new AgentMemoryManager({
      workspaceRoot: tempDir,
      memoriesDir: 'memories',
      autoSave: false,
      minConfidence: 0.5,
    });
  });

  afterEach(() => {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('constructor', () => {
    test('should create with default options', () => {
      const m = new AgentMemoryManager();
      expect(m.memoriesDir).toBe('steering/memories');
      expect(m.autoSave).toBe(false);
      expect(m.minConfidence).toBe(0.6);
    });

    test('should accept custom options', () => {
      expect(manager.memoriesDir).toBe('memories');
      expect(manager.workspaceRoot).toBe(tempDir);
      expect(manager.minConfidence).toBe(0.5);
    });
  });

  describe('initialize', () => {
    test('should create new store if no file exists', async () => {
      const store = await manager.initialize();
      expect(store).toBeInstanceOf(MemoryStore);
      expect(store.learnings.length).toBe(0);
    });

    test('should load existing store', async () => {
      // Create initial store
      const dirPath = path.join(tempDir, 'memories');
      fs.mkdirSync(dirPath, { recursive: true });

      const existingData = {
        learnings: [
          {
            id: 'learn-001',
            category: 'commands',
            title: 'Test Command',
            content: 'npm test',
            confidence: 0.8,
            source: 'test-session',
            timestamp: new Date().toISOString(),
            confirmed: true,
          },
        ],
        sessions: [],
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(path.join(dirPath, 'agent-memory.json'), JSON.stringify(existingData), 'utf8');

      const store = await manager.initialize();
      expect(store.learnings.length).toBe(1);
      expect(store.learnings[0].title).toBe('Test Command');
    });
  });

  describe('extractLearnings', () => {
    test('should extract command patterns', () => {
      const events = [{ content: 'Run `npm run test:unit` to execute unit tests.' }, { content: 'Use `npm run build` to create production build.' }];

      const learnings = manager.extractLearnings(events, 'test-session');
      expect(learnings.length).toBeGreaterThan(0);
      expect(learnings.some((l) => l.category === LearningCategory.COMMANDS)).toBe(true);
    });

    test('should extract best practices', () => {
      const events = [{ content: 'Best practice: always use TypeScript for type safety.' }, { content: 'Convention: Use camelCase for variable names.' }];

      const learnings = manager.extractLearnings(events, 'test-session');
      expect(learnings.some((l) => l.category === LearningCategory.PRACTICES)).toBe(true);
    });

    test('should extract error solutions', () => {
      const events = [{ content: 'Error: Module not found. Fix: Run npm install to restore dependencies.' }];

      const learnings = manager.extractLearnings(events, 'test-session');
      expect(learnings.some((l) => l.category === LearningCategory.ERRORS)).toBe(true);
    });

    test('should extract structure knowledge', () => {
      const events = [{ content: 'Configuration is located in `config/app.json`.' }, { content: 'Directory `src/components` contains React components.' }];

      const learnings = manager.extractLearnings(events, 'test-session');
      expect(learnings.some((l) => l.category === LearningCategory.STRUCTURE)).toBe(true);
    });

    test('should filter by minimum confidence', () => {
      const highConfidenceManager = new AgentMemoryManager({
        workspaceRoot: tempDir,
        minConfidence: 0.95,
      });

      const events = [{ content: 'Some vague information that might be useful.' }];

      const learnings = highConfidenceManager.extractLearnings(events);
      expect(learnings.length).toBe(0); // All should be filtered out
    });

    test('should handle string events', () => {
      const events = ['Execute `npm start` to run the server.', 'Use `npm test` for testing.'];

      const learnings = manager.extractLearnings(events, 'test-session');
      expect(learnings.length).toBeGreaterThan(0);
    });

    test('should handle empty events', () => {
      const learnings = manager.extractLearnings([]);
      expect(learnings.length).toBe(0);
    });
  });

  describe('saveLearnings', () => {
    test('should save learnings when confirmed', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Test Command',
          content: 'npm test',
          confidence: 0.8,
          source: 'test-session',
        }),
      ];

      const result = await manager.saveLearnings(items, true);
      expect(result.status).toBe('saved');
      expect(result.items.length).toBe(1);

      // Check file was created
      const filePath = path.join(tempDir, 'memories', 'agent-memory.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('should return pending status when not confirmed', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Test Command',
          content: 'npm test',
          confidence: 0.8,
          source: 'test-session',
        }),
      ];

      const result = await manager.saveLearnings(items, false);
      expect(result.status).toBe('pending');
    });

    test('should auto-save when autoSave is true', async () => {
      const autoManager = new AgentMemoryManager({
        workspaceRoot: tempDir,
        memoriesDir: 'memories',
        autoSave: true,
      });
      await autoManager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Auto Save Command',
          content: 'npm auto',
          confidence: 0.8,
          source: 'test-session',
        }),
      ];

      const result = await autoManager.saveLearnings(items, false);
      expect(result.status).toBe('saved');
    });

    test('should merge with existing learnings', async () => {
      await manager.initialize();

      const items1 = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'First Command',
          content: 'npm first',
          confidence: 0.8,
          source: 'session-1',
        }),
      ];
      await manager.saveLearnings(items1, true);

      const items2 = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Second Command',
          content: 'npm second',
          confidence: 0.8,
          source: 'session-2',
        }),
      ];
      await manager.saveLearnings(items2, true);

      const store = await manager.loadMemories();
      expect(store.learnings.length).toBe(2);
    });
  });

  describe('getLearningsByCategory', () => {
    test('should filter by category', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Command 1',
          content: 'npm cmd1',
          confidence: 0.8,
          source: 'test',
        }),
        new LearningItem({
          category: LearningCategory.PRACTICES,
          title: 'Practice 1',
          content: 'Best practice',
          confidence: 0.8,
          source: 'test',
        }),
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Command 2',
          content: 'npm cmd2',
          confidence: 0.8,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const commands = await manager.getLearningsByCategory(LearningCategory.COMMANDS);
      expect(commands.length).toBe(2);
    });
  });

  describe('getHighConfidenceLearnings', () => {
    test('should filter by confidence threshold', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'High Confidence',
          content: 'npm high',
          confidence: 0.9,
          source: 'test',
        }),
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Low Confidence',
          content: 'npm low',
          confidence: 0.6,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const highConf = await manager.getHighConfidenceLearnings(0.8);
      expect(highConf.length).toBe(1);
      expect(highConf[0].title).toBe('High Confidence');
    });
  });

  describe('searchLearnings', () => {
    test('should search by title', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Build Command',
          content: 'npm run build',
          confidence: 0.8,
          source: 'test',
        }),
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Test Command',
          content: 'npm test',
          confidence: 0.8,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const results = await manager.searchLearnings('build');
      expect(results.length).toBe(1);
      expect(results[0].title).toContain('Build');
    });

    test('should search by content', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.ERRORS,
          title: 'Error Fix',
          content: 'Fix for ENOENT error in Node.js',
          confidence: 0.8,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const results = await manager.searchLearnings('ENOENT');
      expect(results.length).toBe(1);
    });
  });

  describe('deleteLearning', () => {
    test('should delete learning by id', async () => {
      await manager.initialize();

      const item = new LearningItem({
        category: LearningCategory.COMMANDS,
        title: 'To Delete',
        content: 'npm delete',
        confidence: 0.8,
        source: 'test',
      });
      await manager.saveLearnings([item], true);

      const store = await manager.loadMemories();
      const id = store.learnings[0].id;

      const result = await manager.deleteLearning(id);
      expect(result.success).toBe(true);

      const updatedStore = await manager.loadMemories();
      expect(updatedStore.learnings.length).toBe(0);
    });

    test('should return error for non-existent id', async () => {
      await manager.initialize();

      const result = await manager.deleteLearning('non-existent-id');
      expect(result.success).toBe(false);
    });
  });

  describe('exportToMarkdown', () => {
    test('should generate markdown format', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Test Command',
          content: 'npm test',
          confidence: 0.8,
          source: 'test-session',
        }),
      ];
      await manager.saveLearnings(items, true);

      const markdown = await manager.exportToMarkdown();
      expect(markdown).toContain('# Agent Memory');
      expect(markdown).toContain('## Useful Commands');
      expect(markdown).toContain('npm test');
    });
  });

  describe('getStats', () => {
    test('should return statistics', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'Cmd 1',
          content: 'npm cmd1',
          confidence: 0.8,
          source: 'test',
        }),
        new LearningItem({
          category: LearningCategory.PRACTICES,
          title: 'Practice 1',
          content: 'Best practice',
          confidence: 0.9,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const stats = await manager.getStats();
      expect(stats.totalLearnings).toBe(2);
      expect(stats.byCategory.commands).toBe(1);
      expect(stats.byCategory.practices).toBe(1);
      expect(stats.averageConfidence).toBeGreaterThan(0.8);
    });
  });

  describe('clearMemories', () => {
    test('should clear all memories', async () => {
      await manager.initialize();

      const items = [
        new LearningItem({
          category: LearningCategory.COMMANDS,
          title: 'To Clear',
          content: 'npm clear',
          confidence: 0.8,
          source: 'test',
        }),
      ];
      await manager.saveLearnings(items, true);

      const result = await manager.clearMemories();
      expect(result.success).toBe(true);

      const store = await manager.loadMemories();
      expect(store.learnings.length).toBe(0);
    });
  });

  describe('fromProjectConfig', () => {
    test('should create from project config', () => {
      const config = {
        memory: {
          memories_dir: 'custom/memories',
          auto_save: true,
          min_confidence: 0.7,
        },
      };
      const m = AgentMemoryManager.fromProjectConfig(config, tempDir);
      expect(m.memoriesDir).toBe('custom/memories');
      expect(m.autoSave).toBe(true);
      expect(m.minConfidence).toBe(0.7);
    });

    test('should handle agent_memory key', () => {
      const config = {
        agent_memory: {
          auto_save: true,
        },
      };
      const m = AgentMemoryManager.fromProjectConfig(config);
      expect(m.autoSave).toBe(true);
    });
  });
});

describe('LearningItem', () => {
  test('should create with all properties', () => {
    const item = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test Title',
      content: 'Test Content',
      confidence: 0.85,
      source: 'test-session',
      metadata: { key: 'value' },
    });

    expect(item.id).toMatch(/^learn-/);
    expect(item.category).toBe(LearningCategory.COMMANDS);
    expect(item.title).toBe('Test Title');
    expect(item.content).toBe('Test Content');
    expect(item.confidence).toBe(0.85);
    expect(item.confirmed).toBe(false);
    expect(item.metadata.key).toBe('value');
  });

  test('should clamp confidence to 0-1', () => {
    const low = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Low',
      content: 'Low',
      confidence: -0.5,
      source: 'test',
    });
    const high = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'High',
      content: 'High',
      confidence: 1.5,
      source: 'test',
    });

    expect(low.confidence).toBe(0);
    expect(high.confidence).toBe(1);
  });

  test('should confirm and boost confidence', () => {
    const item = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test',
      content: 'Test',
      confidence: 0.8,
      source: 'test',
    });

    item.confirm();
    expect(item.confirmed).toBe(true);
    expect(item.confidence).toBe(0.9);
  });

  test('should not exceed 1.0 on confirm', () => {
    const item = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test',
      content: 'Test',
      confidence: 0.95,
      source: 'test',
    });

    item.confirm();
    expect(item.confidence).toBe(1);
  });

  test('should detect similar items', () => {
    const item1 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Run tests',
      content: 'npm run test for unit tests',
      confidence: 0.8,
      source: 'test',
    });
    const item2 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test command',
      content: 'npm run test for unit tests execution',
      confidence: 0.8,
      source: 'test2',
    });
    const item3 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Build',
      content: 'npm run build for production',
      confidence: 0.8,
      source: 'test3',
    });

    expect(item1.isSimilarTo(item2)).toBe(true);
    expect(item1.isSimilarTo(item3)).toBe(false);
  });

  test('should not match different categories', () => {
    const item1 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Same',
      content: 'Same content',
      confidence: 0.8,
      source: 'test',
    });
    const item2 = new LearningItem({
      category: LearningCategory.PRACTICES,
      title: 'Same',
      content: 'Same content',
      confidence: 0.8,
      source: 'test',
    });

    expect(item1.isSimilarTo(item2)).toBe(false);
  });

  test('should serialize and deserialize', () => {
    const original = new LearningItem({
      category: LearningCategory.ERRORS,
      title: 'Error Fix',
      content: 'Solution',
      confidence: 0.75,
      source: 'session-1',
    });
    original.confirm();

    const json = original.toJSON();
    const restored = LearningItem.fromJSON(json);

    expect(restored.id).toBe(original.id);
    expect(restored.category).toBe(original.category);
    expect(restored.confirmed).toBe(true);
  });
});

describe('MemoryStore', () => {
  test('should add learning and detect duplicates', () => {
    const store = new MemoryStore();

    const item1 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test',
      content: 'npm test command for testing',
      confidence: 0.7,
      source: 'test',
    });

    const item2 = new LearningItem({
      category: LearningCategory.COMMANDS,
      title: 'Test 2',
      content: 'npm test command for unit testing',
      confidence: 0.7,
      source: 'test2',
    });

    const added1 = store.addLearning(item1);
    const added2 = store.addLearning(item2);

    // Should be same item (duplicate detected)
    expect(added1.id).toBe(added2.id);
    expect(store.learnings.length).toBe(1);
    // Confidence should be boosted
    expect(store.learnings[0].confidence).toBeGreaterThan(0.7);
  });

  test('should get by category', () => {
    const store = new MemoryStore();

    store.addLearning(
      new LearningItem({
        category: LearningCategory.COMMANDS,
        title: 'Cmd',
        content: 'Command content unique',
        confidence: 0.8,
        source: 'test',
      })
    );
    store.addLearning(
      new LearningItem({
        category: LearningCategory.PRACTICES,
        title: 'Practice',
        content: 'Practice content unique',
        confidence: 0.8,
        source: 'test',
      })
    );

    expect(store.getByCategory(LearningCategory.COMMANDS).length).toBe(1);
    expect(store.getByCategory(LearningCategory.PRACTICES).length).toBe(1);
    expect(store.getByCategory(LearningCategory.ERRORS).length).toBe(0);
  });

  test('should get high confidence items', () => {
    const store = new MemoryStore();

    store.addLearning(
      new LearningItem({
        category: LearningCategory.COMMANDS,
        title: 'High',
        content: 'High confidence item unique',
        confidence: 0.9,
        source: 'test',
      })
    );
    store.addLearning(
      new LearningItem({
        category: LearningCategory.COMMANDS,
        title: 'Low',
        content: 'Low confidence item unique',
        confidence: 0.5,
        source: 'test',
      })
    );

    expect(store.getHighConfidence(0.8).length).toBe(1);
  });

  test('should record sessions', () => {
    const store = new MemoryStore();
    store.recordSession('session-001');
    store.recordSession('session-002');

    expect(store.sessions.length).toBe(2);
  });

  test('should serialize and deserialize', () => {
    const store = new MemoryStore();
    store.addLearning(
      new LearningItem({
        category: LearningCategory.COMMANDS,
        title: 'Test',
        content: 'Test content unique serialize',
        confidence: 0.8,
        source: 'test',
      })
    );
    store.recordSession('session-1');

    const json = store.toJSON();
    const restored = MemoryStore.fromJSON(json);

    expect(restored.learnings.length).toBe(1);
    expect(restored.sessions.length).toBe(1);
  });
});

describe('LearningCategory', () => {
  test('should have all expected categories', () => {
    expect(LearningCategory.STRUCTURE).toBe('structure');
    expect(LearningCategory.COMMANDS).toBe('commands');
    expect(LearningCategory.PRACTICES).toBe('practices');
    expect(LearningCategory.ERRORS).toBe('errors');
    expect(LearningCategory.PATTERNS).toBe('patterns');
    expect(LearningCategory.DEPENDENCIES).toBe('dependencies');
  });
});

describe('EXTRACTION_PATTERNS', () => {
  test('should have patterns for all categories', () => {
    expect(EXTRACTION_PATTERNS.commands).toBeDefined();
    expect(EXTRACTION_PATTERNS.practices).toBeDefined();
    expect(EXTRACTION_PATTERNS.errors).toBeDefined();
    expect(EXTRACTION_PATTERNS.structure).toBeDefined();
  });

  test('should have valid pattern structure', () => {
    for (const patterns of Object.values(EXTRACTION_PATTERNS)) {
      for (const p of patterns) {
        expect(p.pattern).toBeInstanceOf(RegExp);
        expect(typeof p.extract).toBe('function');
        expect(typeof p.confidence).toBe('number');
      }
    }
  });
});
