/**
 * Tests for Memory Condenser
 * @see src/managers/memory-condenser.js
 */

const {
  MemoryCondenser,
  MemoryEvent,
  CondensedView,
  CondenserType,
  MemoryEventType,
  NoopCondenser,
  RecentEventsCondenser,
  LLMCondenser,
  AmortizedCondenser,
} = require('../../src/managers/memory-condenser');

describe('MemoryEvent', () => {
  describe('constructor', () => {
    it('should create event with defaults', () => {
      const event = new MemoryEvent({ content: 'test' });
      expect(event.id).toBeDefined();
      expect(event.type).toBe(MemoryEventType.ACTION);
      expect(event.content).toBe('test');
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should estimate tokens', () => {
      const event = new MemoryEvent({ content: 'hello world test' });
      expect(event.tokens).toBeGreaterThan(0);
    });
  });

  describe('createSummary', () => {
    it('should create summary event', () => {
      const original = [
        new MemoryEvent({ content: 'event1' }),
        new MemoryEvent({ content: 'event2' }),
      ];
      const summary = MemoryEvent.createSummary('Summary text', original);

      expect(summary.type).toBe(MemoryEventType.SUMMARY);
      expect(summary.content).toBe('Summary text');
      expect(summary.metadata.summarizedCount).toBe(2);
      expect(summary.metadata.originalIds).toHaveLength(2);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const event = new MemoryEvent({ content: 'test' });
      const json = event.toJSON();
      expect(json.content).toBe('test');
      expect(json.timestamp).toBeDefined();
    });
  });
});

describe('CondensedView', () => {
  describe('constructor', () => {
    it('should calculate stats', () => {
      const events = [new MemoryEvent({ content: 'a' }), new MemoryEvent({ content: 'b' })];
      const view = new CondensedView(events, { originalCount: 5 });

      expect(view.stats.originalCount).toBe(5);
      expect(view.stats.condensedCount).toBe(2);
      expect(view.stats.compressionRatio).toBe(0.6);
    });
  });

  describe('toPrompt', () => {
    it('should format events for prompt', () => {
      const events = [
        new MemoryEvent({ type: MemoryEventType.USER_MESSAGE, content: 'Hello' }),
        new MemoryEvent({ type: MemoryEventType.ASSISTANT_MESSAGE, content: 'Hi there' }),
      ];
      const view = new CondensedView(events);
      const prompt = view.toPrompt();

      expect(prompt).toContain('Hello');
      expect(prompt).toContain('Hi there');
    });

    it('should mark summaries', () => {
      const events = [
        MemoryEvent.createSummary('Previous discussion', []),
        new MemoryEvent({ content: 'Current message' }),
      ];
      const view = new CondensedView(events);
      const prompt = view.toPrompt();

      expect(prompt).toContain('[Previous conversation summary]');
    });
  });
});

describe('NoopCondenser', () => {
  it('should return events unchanged', async () => {
    const condenser = new NoopCondenser();
    const events = [new MemoryEvent({ content: 'a' }), new MemoryEvent({ content: 'b' })];

    const result = await condenser.condense(events);
    expect(result.events).toHaveLength(2);
    expect(result.stats.compressionRatio).toBe(0);
  });
});

describe('RecentEventsCondenser', () => {
  let condenser;

  beforeEach(() => {
    condenser = new RecentEventsCondenser({
      keepFirst: 2,
      keepRecent: 3,
    });
  });

  it('should return all if under threshold', async () => {
    const events = [
      new MemoryEvent({ content: 'a' }),
      new MemoryEvent({ content: 'b' }),
      new MemoryEvent({ content: 'c' }),
    ];

    const result = await condenser.condense(events);
    expect(result.events).toHaveLength(3);
  });

  it('should keep first and recent events', async () => {
    const events = [];
    for (let i = 0; i < 10; i++) {
      events.push(new MemoryEvent({ content: `event${i}` }));
    }

    const result = await condenser.condense(events);

    // First 2 + summary + recent 3
    expect(result.events[0].content).toBe('event0');
    expect(result.events[1].content).toBe('event1');
    expect(result.events[result.events.length - 1].content).toBe('event9');
  });

  it('should preserve important events', async () => {
    const events = [
      new MemoryEvent({ content: 'start' }),
      new MemoryEvent({ content: 'second' }),
      new MemoryEvent({ content: 'DECISION: important choice' }),
      new MemoryEvent({ content: 'regular1' }),
      new MemoryEvent({ content: 'regular2' }),
      new MemoryEvent({ content: 'regular3' }),
      new MemoryEvent({ content: 'recent1' }),
      new MemoryEvent({ content: 'recent2' }),
      new MemoryEvent({ content: 'recent3' }),
    ];

    const result = await condenser.condense(events);
    const contents = result.events.map(e => e.content);

    expect(contents).toContain('DECISION: important choice');
  });
});

describe('LLMCondenser', () => {
  let condenser;
  let summarizerCalled;

  beforeEach(() => {
    summarizerCalled = false;
    condenser = new LLMCondenser({
      maxTokens: 100,
      keepFirst: 1,
      chunkSize: 3,
      summarizer: async events => {
        summarizerCalled = true;
        return `Summary of ${events.length} events`;
      },
    });
  });

  it('should not condense if under token limit', async () => {
    const events = [
      new MemoryEvent({ content: 'a', tokens: 10 }),
      new MemoryEvent({ content: 'b', tokens: 10 }),
    ];

    const result = await condenser.condense(events);
    expect(result.events).toHaveLength(2);
    expect(summarizerCalled).toBe(false);
  });

  it('should condense using summarizer', async () => {
    const events = [];
    for (let i = 0; i < 10; i++) {
      events.push(new MemoryEvent({ content: `event${i}`, tokens: 20 }));
    }

    const result = await condenser.condense(events);
    expect(summarizerCalled).toBe(true);
    expect(result.events.some(e => e.type === MemoryEventType.SUMMARY)).toBe(true);
  });

  it('should preserve important events', async () => {
    const events = [
      new MemoryEvent({ content: 'start', tokens: 20 }),
      new MemoryEvent({ content: 'REQ-001 requirement', tokens: 20 }),
      new MemoryEvent({ content: 'regular', tokens: 20 }),
      new MemoryEvent({ content: 'regular2', tokens: 20 }),
      new MemoryEvent({ content: 'regular3', tokens: 20 }),
      new MemoryEvent({ content: 'regular4', tokens: 20 }),
    ];

    const result = await condenser.condense(events);
    const contents = result.events.map(e => e.content);
    expect(contents).toContain('REQ-001 requirement');
  });
});

describe('AmortizedCondenser', () => {
  let condenser;

  beforeEach(() => {
    condenser = new AmortizedCondenser({
      maxSize: 5,
      targetSize: 3,
    });
  });

  it('should not condense if under max size', async () => {
    const events = [new MemoryEvent({ content: 'a' }), new MemoryEvent({ content: 'b' })];

    const result = await condenser.condense(events);
    expect(result.events).toHaveLength(2);
  });

  it('should condense when over max size', async () => {
    const events = [
      new MemoryEvent({ type: MemoryEventType.USER_MESSAGE, content: 'user1' }),
      new MemoryEvent({ content: 'action1' }),
      new MemoryEvent({ content: 'action2' }),
      new MemoryEvent({ content: 'action3' }),
      new MemoryEvent({ content: 'action4' }),
      new MemoryEvent({ type: MemoryEventType.USER_MESSAGE, content: 'user2' }),
    ];

    const result = await condenser.condense(events);
    expect(result.events.length).toBeLessThan(events.length);
    expect(result.events.some(e => e.type === MemoryEventType.SUMMARY)).toBe(true);
  });
});

describe('MemoryCondenser.create', () => {
  it('should create NoopCondenser', () => {
    const condenser = MemoryCondenser.create({ type: CondenserType.NOOP });
    expect(condenser).toBeInstanceOf(NoopCondenser);
  });

  it('should create RecentEventsCondenser', () => {
    const condenser = MemoryCondenser.create({ type: CondenserType.RECENT });
    expect(condenser).toBeInstanceOf(RecentEventsCondenser);
  });

  it('should create LLMCondenser', () => {
    const condenser = MemoryCondenser.create({ type: CondenserType.LLM });
    expect(condenser).toBeInstanceOf(LLMCondenser);
  });

  it('should create AmortizedCondenser', () => {
    const condenser = MemoryCondenser.create({ type: CondenserType.AMORTIZED });
    expect(condenser).toBeInstanceOf(AmortizedCondenser);
  });

  it('should throw for unknown type', () => {
    expect(() => MemoryCondenser.create({ type: 'invalid' })).toThrow();
  });

  it('should create from config', () => {
    const condenser = MemoryCondenser.fromConfig({
      type: 'recent',
      keep_first: 3,
      keep_recent: 5,
    });
    expect(condenser).toBeInstanceOf(RecentEventsCondenser);
  });
});
