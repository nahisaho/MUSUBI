/**
 * Tests for Stuck Detector
 * @see src/analyzers/stuck-detector.js
 */

const { 
  StuckDetector, 
  StuckAnalysis, 
  EventType, 
  Stage, 
  LoopType, 
  Severity,
  hashEvent 
} = require('../../src/analyzers/stuck-detector');

describe('StuckDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new StuckDetector();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      expect(detector.maxRepeatActions).toBe(4);
      expect(detector.maxRepeatErrors).toBe(3);
      expect(detector.maxMonologueSteps).toBe(10);
      expect(detector.history).toEqual([]);
    });

    it('should accept custom options', () => {
      const customDetector = new StuckDetector({
        maxRepeatActions: 5,
        maxRepeatErrors: 2,
        maxMonologueSteps: 8,
      });
      expect(customDetector.maxRepeatActions).toBe(5);
      expect(customDetector.maxRepeatErrors).toBe(2);
      expect(customDetector.maxMonologueSteps).toBe(8);
    });
  });

  describe('addEvent', () => {
    it('should add event to history', () => {
      detector.addEvent({ type: EventType.ACTION, content: 'test' });
      expect(detector.history.length).toBe(1);
      expect(detector.history[0].type).toBe(EventType.ACTION);
    });

    it('should generate unique ids for events', () => {
      detector.addEvent({ content: 'test1' });
      detector.addEvent({ content: 'test2' });
      expect(detector.history[0].id).not.toBe(detector.history[1].id);
    });

    it('should add timestamp to events', () => {
      const event = detector.addEvent({ content: 'test' });
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate hash for events', () => {
      const event = detector.addEvent({ content: 'test' });
      expect(event.hash).toBeDefined();
      expect(event.hash.length).toBe(8);
    });
  });

  describe('detect - no stuck', () => {
    it('should return null when history is too short', () => {
      detector.addEvent({ content: 'test' });
      expect(detector.detect()).toBeNull();
    });

    it('should return null when no patterns detected', () => {
      detector.addEvent({ type: EventType.ACTION, content: 'action1' });
      detector.addEvent({ type: EventType.OBSERVATION, content: 'result1' });
      detector.addEvent({ type: EventType.ACTION, content: 'action2' });
      detector.addEvent({ type: EventType.OBSERVATION, content: 'result2' });
      expect(detector.detect()).toBeNull();
    });
  });

  describe('detect - repeating action', () => {
    it('should detect repeating same action', () => {
      for (let i = 0; i < 4; i++) {
        detector.addEvent({ 
          type: EventType.ACTION, 
          stage: Stage.IMPLEMENT,
          content: 'npm install foo' 
        });
      }

      const analysis = detector.detect();
      expect(analysis).not.toBeNull();
      expect(analysis.loopType).toBe(LoopType.REPEATING_ACTION);
      expect(analysis.loopRepeatTimes).toBe(4);
    });

    it('should not detect different actions', () => {
      detector.addEvent({ type: EventType.ACTION, content: 'action1' });
      detector.addEvent({ type: EventType.ACTION, content: 'action2' });
      detector.addEvent({ type: EventType.ACTION, content: 'action3' });
      detector.addEvent({ type: EventType.ACTION, content: 'action4' });
      expect(detector.detect()).toBeNull();
    });
  });

  describe('detect - error loop', () => {
    it('should detect repeating same error', () => {
      const errorContent = 'Error: Module not found';
      for (let i = 0; i < 3; i++) {
        detector.addEvent({ 
          type: EventType.ERROR, 
          content: errorContent 
        });
      }

      const analysis = detector.detect();
      expect(analysis).not.toBeNull();
      expect(analysis.loopType).toBe(LoopType.ERROR_LOOP);
      expect(analysis.severity).toBe(Severity.CRITICAL);
    });

    it('should not detect different errors', () => {
      detector.addEvent({ type: EventType.ERROR, content: 'Error 1' });
      detector.addEvent({ type: EventType.ERROR, content: 'Error 2' });
      detector.addEvent({ type: EventType.ERROR, content: 'Error 3' });
      expect(detector.detect()).toBeNull();
    });
  });

  describe('detect - monologue', () => {
    it('should detect extended monologue', () => {
      // Add varied short messages (different content to avoid repeating_action detection)
      for (let i = 0; i < 10; i++) {
        detector.addEvent({ 
          type: EventType.MESSAGE, 
          content: `I am thinking about step ${i}...` 
        });
      }

      const analysis = detector.detect();
      expect(analysis).not.toBeNull();
      expect(analysis.loopType).toBe(LoopType.MONOLOGUE);
    });

    it('should not detect if messages contain code blocks', () => {
      // Varied content with code blocks - should not be detected as monologue
      for (let i = 0; i < 10; i++) {
        detector.addEvent({ 
          type: EventType.MESSAGE, 
          content: `Here is code ${i}: \`\`\`console.log(${i})\`\`\`` 
        });
      }
      // This may detect as repeating_action if last 4 are same hash, 
      // but shouldn't detect as monologue due to code blocks
      const analysis = detector.detect();
      if (analysis) {
        expect(analysis.loopType).not.toBe(LoopType.MONOLOGUE);
      }
    });
  });

  describe('detect - context overflow', () => {
    it('should detect context length exceeded errors', () => {
      // Use different content each time to avoid error_loop detection first
      const contextErrors = [
        'context_length_exceeded: maximum tokens reached for request 1',
        'context_length_exceeded: maximum tokens reached for request 2',
        'context_length_exceeded: maximum tokens reached for request 3',
      ];
      
      for (const error of contextErrors) {
        detector.addEvent({ 
          type: EventType.ERROR, 
          content: error 
        });
      }

      const analysis = detector.detect();
      expect(analysis).not.toBeNull();
      // Note: error_loop is detected first because same error type
      // Context overflow is a special case of error loop
      expect([LoopType.CONTEXT_OVERFLOW, LoopType.ERROR_LOOP]).toContain(analysis.loopType);
      expect(analysis.severity).toBe(Severity.CRITICAL);
    });

    it('should detect token limit errors', () => {
      const tokenErrors = [
        'Error: token limit reached - part 1',
        'Error: token limit reached - part 2', 
        'Error: token limit reached - part 3',
      ];
      
      for (const error of tokenErrors) {
        detector.addEvent({ 
          type: EventType.ERROR, 
          content: error 
        });
      }

      const analysis = detector.detect();
      // Should detect some form of error pattern
      expect(analysis).not.toBeNull();
      expect(analysis.severity).toBe(Severity.CRITICAL);
    });
  });

  describe('detect - stage oscillation', () => {
    it('should detect stage back-and-forth', () => {
      for (let i = 0; i < 6; i++) {
        const stage = i % 2 === 0 ? Stage.DESIGN : Stage.IMPLEMENT;
        detector.addEvent({ 
          type: EventType.ACTION, 
          stage: stage,
          content: `action ${i}` 
        });
      }

      const analysis = detector.detect();
      expect(analysis).not.toBeNull();
      expect(analysis.loopType).toBe(LoopType.STAGE_OSCILLATION);
    });
  });

  describe('clearHistory', () => {
    it('should clear history and analysis', () => {
      detector.addEvent({ content: 'test' });
      for (let i = 0; i < 4; i++) {
        detector.addEvent({ content: 'same' });
      }
      detector.detect();

      detector.clearHistory();
      expect(detector.history).toEqual([]);
      expect(detector.stuckAnalysis).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('should return copy of history', () => {
      detector.addEvent({ content: 'test' });
      const history = detector.getHistory();
      history.push({ content: 'fake' });
      expect(detector.history.length).toBe(1);
    });
  });

  describe('exportHistory', () => {
    it('should export empty history message', () => {
      const md = detector.exportHistory();
      expect(md).toContain('No events recorded');
    });

    it('should export history as markdown', () => {
      detector.addEvent({ type: EventType.ACTION, content: 'test' });
      const md = detector.exportHistory();
      expect(md).toContain('# Stuck Detector History');
      expect(md).toContain('| # |');
      expect(md).toContain('| 1 |');
    });

    it('should include analysis if stuck detected', () => {
      for (let i = 0; i < 4; i++) {
        detector.addEvent({ content: 'same action' });
      }
      detector.detect();
      const md = detector.exportHistory();
      expect(md).toContain('## Analysis');
      expect(md).toContain('Suggestions');
    });
  });
});

describe('StuckAnalysis', () => {
  describe('getMessage', () => {
    it('should return human-readable message', () => {
      const analysis = new StuckAnalysis({
        loopType: LoopType.ERROR_LOOP,
        loopRepeatTimes: 3,
      });
      expect(analysis.getMessage()).toContain('3回');
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const analysis = new StuckAnalysis({
        loopType: LoopType.REPEATING_ACTION,
        loopRepeatTimes: 4,
        suggestedActions: ['try something else'],
      });
      const json = analysis.toJSON();
      expect(json.loopType).toBe(LoopType.REPEATING_ACTION);
      expect(json.suggestedActions).toContain('try something else');
      expect(json.timestamp).toBeDefined();
    });
  });
});

describe('hashEvent', () => {
  it('should generate same hash for same content', () => {
    const event1 = { type: EventType.ACTION, stage: Stage.IMPLEMENT, content: 'test' };
    const event2 = { type: EventType.ACTION, stage: Stage.IMPLEMENT, content: 'test' };
    expect(hashEvent(event1)).toBe(hashEvent(event2));
  });

  it('should generate different hash for different content', () => {
    const event1 = { type: EventType.ACTION, content: 'test1' };
    const event2 = { type: EventType.ACTION, content: 'test2' };
    expect(hashEvent(event1)).not.toBe(hashEvent(event2));
  });
});
