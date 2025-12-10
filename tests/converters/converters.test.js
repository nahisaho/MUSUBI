/**
 * Converters Integration Tests
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const {
  convertFromSpeckit,
  convertToSpeckit,
  validateFormat,
  testRoundtrip,
} = require('../../src/converters');

const TEMP_PATH = path.join(__dirname, 'temp');

describe('Converters Integration', () => {
  beforeAll(async () => {
    await fs.ensureDir(TEMP_PATH);
  });

  afterAll(async () => {
    await fs.remove(TEMP_PATH);
  });

  describe('convertFromSpeckit', () => {
    const SPECKIT_PROJECT = path.join(TEMP_PATH, 'speckit-project');
    const MUSUBI_OUTPUT = path.join(TEMP_PATH, 'musubi-output');

    beforeAll(async () => {
      // Create Spec Kit project
      await fs.ensureDir(path.join(SPECKIT_PROJECT, '.specify', 'memory'));
      await fs.ensureDir(path.join(SPECKIT_PROJECT, '.specify', 'specs', '001-feature'));

      await fs.writeFile(
        path.join(SPECKIT_PROJECT, '.specify', 'memory', 'constitution.md'),
        `# Constitution

## Core Principles

### Spec First
Define before implementing.
`
      );

      await fs.writeFile(
        path.join(SPECKIT_PROJECT, '.specify', 'specs', '001-feature', 'spec.md'),
        `# Feature

## User Scenarios

### User Action
As a user, I want to do something so that I benefit.

## Success Criteria
- It works
`
      );
    });

    test('should convert Spec Kit to MUSUBI', async () => {
      const result = await convertFromSpeckit(SPECKIT_PROJECT, {
        output: MUSUBI_OUTPUT,
        force: true,
      });

      expect(result.filesConverted).toBeGreaterThan(0);
      expect(
        await fs.pathExists(path.join(MUSUBI_OUTPUT, 'steering', 'rules', 'constitution.md'))
      ).toBe(true);
      expect(await fs.pathExists(path.join(MUSUBI_OUTPUT, 'steering', 'project.yml'))).toBe(true);
      expect(
        await fs.pathExists(path.join(MUSUBI_OUTPUT, 'storage', 'specs', '001-feature', 'spec.md'))
      ).toBe(true);
    });

    test('should preserve feature structure', async () => {
      const specContent = await fs.readFile(
        path.join(MUSUBI_OUTPUT, 'storage', 'specs', '001-feature', 'spec.md'),
        'utf-8'
      );

      expect(specContent).toContain('Requirements');
      expect(specContent).toContain('REQ-');
    });
  });

  describe('convertToSpeckit', () => {
    const MUSUBI_PROJECT = path.join(TEMP_PATH, 'musubi-project');
    const SPECKIT_OUTPUT = path.join(TEMP_PATH, 'speckit-output');

    beforeAll(async () => {
      // Create MUSUBI project
      await fs.ensureDir(path.join(MUSUBI_PROJECT, 'steering', 'rules'));
      await fs.ensureDir(path.join(MUSUBI_PROJECT, 'storage', 'specs', 'auth'));

      await fs.writeFile(
        path.join(MUSUBI_PROJECT, 'steering', 'project.yml'),
        `project:
  name: Test MUSUBI
  version: 1.0.0
`
      );

      await fs.writeFile(
        path.join(MUSUBI_PROJECT, 'steering', 'rules', 'constitution.md'),
        `# Constitution

## Article 1: Spec First
Define specifications before implementation.
`
      );

      await fs.writeFile(
        path.join(MUSUBI_PROJECT, 'storage', 'specs', 'auth', 'spec.md'),
        `# Auth Feature

## Requirements

### REQ-001: Login
WHEN the user submits credentials, the system SHALL authenticate.

## Success Criteria
- Users can login
`
      );
    });

    test('should convert MUSUBI to Spec Kit', async () => {
      const result = await convertToSpeckit({
        source: MUSUBI_PROJECT,
        output: SPECKIT_OUTPUT,
        force: true,
      });

      expect(result.filesConverted).toBeGreaterThan(0);
      expect(
        await fs.pathExists(path.join(SPECKIT_OUTPUT, '.specify', 'memory', 'constitution.md'))
      ).toBe(true);
      expect(await fs.pathExists(path.join(SPECKIT_OUTPUT, '.specify', 'specs'))).toBe(true);
    });

    test('should convert EARS to User Stories', async () => {
      // Find spec file
      const specsDir = path.join(SPECKIT_OUTPUT, '.specify', 'specs');
      const features = await fs.readdir(specsDir);
      const featureDir = features[0];

      const specContent = await fs.readFile(path.join(specsDir, featureDir, 'spec.md'), 'utf-8');

      expect(specContent).toContain('User Scenarios');
      expect(specContent).toContain('As a');
    });
  });

  describe('validateFormat', () => {
    test('should validate MUSUBI format', async () => {
      const projectPath = path.join(TEMP_PATH, 'validate-musubi');
      await fs.ensureDir(path.join(projectPath, 'steering', 'rules'));
      await fs.writeFile(
        path.join(projectPath, 'steering', 'rules', 'constitution.md'),
        '# Constitution'
      );

      const result = await validateFormat('musubi', projectPath);
      expect(result.valid).toBe(true);
    });

    test('should validate Spec Kit format', async () => {
      const projectPath = path.join(TEMP_PATH, 'validate-speckit');
      await fs.ensureDir(path.join(projectPath, '.specify', 'memory'));
      await fs.writeFile(
        path.join(projectPath, '.specify', 'memory', 'constitution.md'),
        '# Constitution'
      );

      const result = await validateFormat('speckit', projectPath);
      expect(result.valid).toBe(true);
    });

    test('should reject invalid format name', async () => {
      const result = await validateFormat('invalid', '.');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Unknown format');
    });
  });

  describe('testRoundtrip', () => {
    test('should test roundtrip for Spec Kit project', async () => {
      const projectPath = path.join(TEMP_PATH, 'roundtrip-speckit');
      await fs.ensureDir(path.join(projectPath, '.specify', 'memory'));
      await fs.ensureDir(path.join(projectPath, '.specify', 'specs', '001-test'));

      await fs.writeFile(
        path.join(projectPath, '.specify', 'memory', 'constitution.md'),
        `# Constitution

## Core Principles

### Quality
Test everything.
`
      );

      await fs.writeFile(
        path.join(projectPath, '.specify', 'specs', '001-test', 'spec.md'),
        `# Test Feature

Simple test feature.

## User Scenarios

### Basic Test
As a developer, I want to test so that code works.

## Success Criteria
- Tests pass
`
      );

      const result = await testRoundtrip(projectPath);

      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('similarity');
      expect(result).toHaveProperty('differences');
      expect(result.similarity).toBeGreaterThan(50);
    });

    test('should handle non-existent project', async () => {
      const result = await testRoundtrip('/nonexistent/path');

      expect(result.passed).toBe(false);
      expect(result.differences.length).toBeGreaterThan(0);
    });
  });
});
