/**
 * MUSUBI Parser Tests
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const {
  parseMusubiProject,
  parseConstitution,
  parseSpecification,
  parseTasks,
} = require('../../src/converters/parsers/musubi-parser');

// Test fixtures path
const FIXTURES_PATH = path.join(__dirname, 'fixtures', 'musubi-sample');

describe('MUSUBI Parser', () => {
  beforeAll(async () => {
    // Create test fixtures if they don't exist
    await fs.ensureDir(FIXTURES_PATH);
    await fs.ensureDir(path.join(FIXTURES_PATH, 'steering', 'rules'));
    await fs.ensureDir(path.join(FIXTURES_PATH, 'storage', 'specs', 'auth-feature'));
    
    // Create project.yml
    await fs.writeFile(
      path.join(FIXTURES_PATH, 'steering', 'project.yml'),
      `project:
  name: Test Project
  version: 1.0.0
`
    );
    
    // Create constitution.md
    await fs.writeFile(
      path.join(FIXTURES_PATH, 'steering', 'rules', 'constitution.md'),
      `# MUSUBI Constitution

## Article 1: Specification Primacy

Specifications define the system.

- All features must be specified
- Specifications are the single source of truth

## Article 2: Test-First Development

Tests are written before implementation.

- Tests must pass before merge
- Coverage should be above 80%
`
    );
    
    // Create spec.md
    await fs.writeFile(
      path.join(FIXTURES_PATH, 'storage', 'specs', 'auth-feature', 'spec.md'),
      `# Authentication Feature

This feature handles user authentication.

## Requirements

### REQ-001: User Login

WHEN the user submits valid credentials, the system SHALL create a session.

**Acceptance Criteria**:
- Valid credentials succeed
- Invalid credentials fail

### REQ-002: Session Management

The system SHALL automatically expire sessions after 24 hours.

## Success Criteria

- All users can log in successfully
- Sessions expire correctly
`
    );
    
    // Create tasks.md
    await fs.writeFile(
      path.join(FIXTURES_PATH, 'storage', 'specs', 'auth-feature', 'tasks.md'),
      `# Tasks

## Phase 1

- [ ] T001: Create login form
- [x] T002: Implement session management
- [ ] T003: [P] Add remember me feature at src/auth/
`
    );
  });

  afterAll(async () => {
    // Cleanup fixtures
    await fs.remove(FIXTURES_PATH);
  });

  describe('parseMusubiProject', () => {
    test('should parse a complete MUSUBI project', async () => {
      const ir = await parseMusubiProject(FIXTURES_PATH);
      
      expect(ir).toBeDefined();
      expect(ir.metadata.name).toBe('Test Project');
      expect(ir.metadata.version).toBe('1.0.0');
      expect(ir.metadata.sourceFormat).toBe('musubi');
      expect(ir.features).toHaveLength(1);
      expect(ir.constitution.articles.length).toBeGreaterThan(0);
    });
  });

  describe('parseConstitution', () => {
    test('should parse constitution with articles', async () => {
      const constitution = await parseConstitution(FIXTURES_PATH);
      
      expect(constitution.articles.length).toBeGreaterThanOrEqual(2);
      
      const article1 = constitution.articles.find(a => a.number === 1);
      expect(article1).toBeDefined();
      expect(article1.name).toBe('Specification Primacy');
      expect(article1.rules.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('parseSpecification', () => {
    test('should parse spec.md with EARS requirements', async () => {
      const specPath = path.join(FIXTURES_PATH, 'storage', 'specs', 'auth-feature', 'spec.md');
      const spec = await parseSpecification(specPath);
      
      expect(spec.title).toBe('Authentication Feature');
      expect(spec.requirements).toHaveLength(2);
      
      const req1 = spec.requirements[0];
      expect(req1.id).toBe('REQ-001');
      expect(req1.pattern).toBe('event-driven');
      expect(req1.statement).toContain('WHEN');
      
      const req2 = spec.requirements[1];
      expect(req2.id).toBe('REQ-002');
      expect(req2.pattern).toBe('ubiquitous');
      
      expect(spec.successCriteria.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('parseTasks', () => {
    test('should parse tasks.md with checkboxes and metadata', async () => {
      const tasksPath = path.join(FIXTURES_PATH, 'storage', 'specs', 'auth-feature', 'tasks.md');
      const tasks = await parseTasks(tasksPath);
      
      expect(tasks).toHaveLength(3);
      
      const task1 = tasks.find(t => t.id === 'T001');
      expect(task1).toBeDefined();
      expect(task1.completed).toBe(false);
      expect(task1.phase).toBe(1);
      
      const task2 = tasks.find(t => t.id === 'T002');
      expect(task2).toBeDefined();
      expect(task2.completed).toBe(true);
      
      const task3 = tasks.find(t => t.id === 'T003');
      expect(task3).toBeDefined();
      expect(task3.parallel).toBe(true);
      expect(task3.filePath).toBe('src/auth/');
    });
  });
});
