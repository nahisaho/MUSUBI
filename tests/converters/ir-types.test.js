/**
 * IR Types Tests
 */

'use strict';

const {
  createEmptyProjectIR,
  createEmptyFeatureIR,
  createRequirementFromEARS,
  detectEARSPattern,
  parseEARSStatement,
  userScenarioToRequirement,
  requirementToUserScenario,
} = require('../../src/converters/ir/types');

describe('IR Types', () => {
  describe('createEmptyProjectIR', () => {
    test('should create an empty project IR with correct structure', () => {
      const ir = createEmptyProjectIR();

      expect(ir).toHaveProperty('metadata');
      expect(ir).toHaveProperty('constitution');
      expect(ir).toHaveProperty('features');
      expect(ir).toHaveProperty('templates');
      expect(ir).toHaveProperty('memories');

      expect(ir.metadata.sourceFormat).toBe('musubi');
      expect(ir.features).toEqual([]);
      expect(ir.templates).toEqual([]);
    });
  });

  describe('createEmptyFeatureIR', () => {
    test('should create a feature IR with given id and name', () => {
      const feature = createEmptyFeatureIR('001-auth', 'Authentication');

      expect(feature.id).toBe('001-auth');
      expect(feature.name).toBe('Authentication');
      expect(feature.status).toBe('draft');
      expect(feature.specification).toBeDefined();
      expect(feature.specification.title).toBe('Authentication');
    });
  });

  describe('detectEARSPattern', () => {
    test('should detect ubiquitous pattern', () => {
      const statement = 'The system SHALL validate all user input.';
      expect(detectEARSPattern(statement)).toBe('ubiquitous');
    });

    test('should detect event-driven pattern', () => {
      const statement = 'WHEN the user clicks submit, the system SHALL save the data.';
      expect(detectEARSPattern(statement)).toBe('event-driven');
    });

    test('should detect state-driven pattern', () => {
      const statement =
        'WHILE the system is in maintenance mode, the system SHALL reject all requests.';
      expect(detectEARSPattern(statement)).toBe('state-driven');
    });

    test('should detect optional pattern', () => {
      const statement = 'WHERE advanced mode is enabled, the system SHALL show detailed logs.';
      expect(detectEARSPattern(statement)).toBe('optional');
    });

    test('should detect complex pattern', () => {
      const statement =
        'WHILE the user is logged in, WHEN they click save, the system SHALL persist changes.';
      expect(detectEARSPattern(statement)).toBe('complex');
    });
  });

  describe('parseEARSStatement', () => {
    test('should parse event-driven statement', () => {
      const statement = 'WHEN the user submits the form, the system SHALL validate the data.';
      const result = parseEARSStatement(statement, 'event-driven');

      expect(result.trigger).toBe('the user submits the form');
      expect(result.action).toBe('validate the data');
    });

    test('should parse state-driven statement', () => {
      const statement = 'WHILE in edit mode, the system SHALL auto-save every minute.';
      const result = parseEARSStatement(statement, 'state-driven');

      expect(result.condition).toBe('in edit mode');
      expect(result.action).toBe('auto-save every minute');
    });

    test('should parse optional statement', () => {
      const statement = 'WHERE debugging is enabled, the system SHALL log all API calls.';
      const result = parseEARSStatement(statement, 'optional');

      expect(result.condition).toBe('debugging is enabled');
      expect(result.action).toBe('log all API calls');
    });
  });

  describe('createRequirementFromEARS', () => {
    test('should create requirement from EARS statement', () => {
      const statement = 'WHEN the user logs in, the system SHALL create a session.';
      const req = createRequirementFromEARS('REQ-001', statement);

      expect(req.id).toBe('REQ-001');
      expect(req.pattern).toBe('event-driven');
      expect(req.statement).toBe(statement);
      expect(req.trigger).toBe('the user logs in');
      expect(req.action).toBe('create a session');
    });
  });

  describe('userScenarioToRequirement', () => {
    test('should convert user scenario to EARS requirement', () => {
      const userScenario = {
        id: 'US1',
        title: 'User Login',
        actor: 'registered user',
        action: 'logs into the system',
        benefit: 'access personalized content',
        priority: 'P1',
        acceptanceCriteria: [
          { id: 'AC1', description: 'Valid credentials succeed', testable: true },
        ],
      };

      const req = userScenarioToRequirement(userScenario, 'REQ-001');

      expect(req.id).toBe('REQ-001');
      expect(req.pattern).toBe('event-driven');
      expect(req.priority).toBe('P1');
      expect(req.statement).toContain('WHEN');
      expect(req.statement).toContain('SHALL');
      expect(req.mappedFromUserStory).toBe('US1');
      expect(req.acceptanceCriteria).toHaveLength(1);
    });
  });

  describe('requirementToUserScenario', () => {
    test('should convert EARS requirement to user scenario', () => {
      const requirement = {
        id: 'REQ-001',
        title: 'User Login',
        pattern: 'event-driven',
        priority: 'P1',
        trigger: 'the registered user logs in',
        action: 'access personalized content',
        statement:
          'WHEN the registered user logs in, the system SHALL access personalized content.',
        acceptanceCriteria: [
          { id: 'AC1', description: 'Valid credentials succeed', testable: true },
        ],
      };

      const story = requirementToUserScenario(requirement, 'US1');

      expect(story.id).toBe('US1');
      expect(story.title).toBe('User Login');
      expect(story.priority).toBe('P1');
      expect(story.acceptanceCriteria).toHaveLength(1);
    });
  });
});
