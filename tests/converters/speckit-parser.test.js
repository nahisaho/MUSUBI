/**
 * Spec Kit Parser Tests
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const {
  parseSpeckitProject,
  parseConstitution,
  parseSpecification,
  parseTasks,
  parseUserScenarios,
} = require('../../src/converters/parsers/speckit-parser');

// Test fixtures path
const FIXTURES_PATH = path.join(__dirname, 'fixtures', 'speckit-sample');

describe('Spec Kit Parser', () => {
  beforeAll(async () => {
    // Create test fixtures
    await fs.ensureDir(FIXTURES_PATH);
    await fs.ensureDir(path.join(FIXTURES_PATH, '.specify', 'memory'));
    await fs.ensureDir(path.join(FIXTURES_PATH, '.specify', 'specs', '001-auth'));
    
    // Create constitution.md
    await fs.writeFile(
      path.join(FIXTURES_PATH, '.specify', 'memory', 'constitution.md'),
      `# Project Constitution

The core principles that govern this project.

## Core Principles

### Quality First

All code must be thoroughly tested before deployment.

- Maintain 80% test coverage
- All tests must pass

### Documentation

Keep documentation up to date with code changes.

- Document all public APIs
- Update README for breaking changes

## Governance

**Version**: 1.0

- Major changes require review
- Breaking changes need approval
`
    );
    
    // Create spec.md with User Scenarios
    await fs.writeFile(
      path.join(FIXTURES_PATH, '.specify', 'specs', '001-auth', 'spec.md'),
      `# Authentication

User authentication feature.

## User Scenarios

### User Login

As a registered user, I want to log into the system so that I can access my account.

**Priority**: P1

**Acceptance Criteria**:
- Valid credentials grant access
- Invalid credentials show error
- Account lockout after 5 failures

### Password Reset

As a user, I want to reset my password so that I can regain access if I forget it.

**Priority**: P2

## Success Criteria

- Users can log in with valid credentials
- Password reset emails are sent within 5 minutes
`
    );
    
    // Create tasks.md (Spec Kit format)
    await fs.writeFile(
      path.join(FIXTURES_PATH, '.specify', 'specs', '001-auth', 'tasks.md'),
      `# Tasks

## Phase 1

- [ ] T001 [P] [US1] Create login form at src/components/Login.tsx
- [x] T002 [US1] Implement authentication API at src/api/auth.ts
- [ ] T003 [US2] Add password reset flow

## Phase 2

- [ ] T004 Add two-factor authentication
`
    );
  });

  afterAll(async () => {
    // Cleanup fixtures
    await fs.remove(FIXTURES_PATH);
  });

  describe('parseSpeckitProject', () => {
    test('should parse a complete Spec Kit project', async () => {
      const ir = await parseSpeckitProject(FIXTURES_PATH);
      
      expect(ir).toBeDefined();
      expect(ir.metadata.sourceFormat).toBe('speckit');
      expect(ir.features).toHaveLength(1);
      expect(ir.constitution.corePrinciples.length).toBeGreaterThan(0);
    });

    test('should throw error for non-Spec Kit project', async () => {
      await expect(parseSpeckitProject('/nonexistent')).rejects.toThrow();
    });
  });

  describe('parseConstitution', () => {
    test('should parse constitution with core principles', async () => {
      const specifyPath = path.join(FIXTURES_PATH, '.specify');
      const constitution = await parseConstitution(specifyPath);
      
      expect(constitution.corePrinciples.length).toBeGreaterThanOrEqual(1);
      
      // Should map to MUSUBI articles
      expect(constitution.articles.length).toBe(9); // All 9 MUSUBI articles
    });

    test('should parse governance section', async () => {
      const specifyPath = path.join(FIXTURES_PATH, '.specify');
      const constitution = await parseConstitution(specifyPath);
      
      expect(constitution.governance.version).toBe('1.0');
      expect(constitution.governance.rules.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('parseSpecification', () => {
    test('should parse spec.md with user scenarios', async () => {
      const specPath = path.join(FIXTURES_PATH, '.specify', 'specs', '001-auth', 'spec.md');
      const spec = await parseSpecification(specPath);
      
      expect(spec.title).toBe('Authentication');
      expect(spec.userScenarios.length).toBeGreaterThanOrEqual(1);
      
      const loginScenario = spec.userScenarios[0];
      expect(loginScenario.actor).toBe('registered user');
      expect(loginScenario.priority).toBe('P1');
      
      // Should also convert to EARS requirements
      expect(spec.requirements.length).toBeGreaterThanOrEqual(1);
      expect(spec.requirements[0].pattern).toBe('event-driven');
    });
  });

  describe('parseTasks', () => {
    test('should parse Spec Kit task format', async () => {
      const tasksPath = path.join(FIXTURES_PATH, '.specify', 'specs', '001-auth', 'tasks.md');
      const tasks = await parseTasks(tasksPath);
      
      expect(tasks.length).toBeGreaterThanOrEqual(4);
      
      const task1 = tasks.find(t => t.id === 'T001');
      expect(task1).toBeDefined();
      expect(task1.parallel).toBe(true);
      expect(task1.userStory).toBe('US1');
      expect(task1.filePath).toBe('src/components/Login.tsx');
      expect(task1.phase).toBe(1);
      
      const task2 = tasks.find(t => t.id === 'T002');
      expect(task2).toBeDefined();
      expect(task2.completed).toBe(true);
      
      const task4 = tasks.find(t => t.id === 'T004');
      expect(task4).toBeDefined();
      expect(task4.phase).toBe(2);
    });
  });

  describe('parseUserScenarios', () => {
    test('should parse user story format', () => {
      const content = `
### Login Feature

As a user, I want to login so that I can access my dashboard.

**Acceptance Criteria**:
- Valid credentials work
- Invalid credentials fail

### Signup Feature

As a new user, I want to create an account so that I can join the platform.
`;
      
      const scenarios = parseUserScenarios(content);
      
      expect(scenarios).toHaveLength(2);
      expect(scenarios[0].actor).toBe('user');
      expect(scenarios[0].action).toBe('login');
      expect(scenarios[0].benefit).toBe('I can access my dashboard');
    });
  });
});
