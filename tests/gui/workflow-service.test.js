/**
 * @fileoverview Tests for Workflow Service
 */

const WorkflowService = require('../../src/gui/services/workflow-service');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('WorkflowService', () => {
  let tempDir;
  let service;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    service = new WorkflowService(tempDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('constructor()', () => {
    it('should create a service instance', () => {
      expect(service).toBeInstanceOf(WorkflowService);
      expect(service.projectPath).toBe(tempDir);
    });

    it('should have 8 workflow stages', () => {
      expect(service.stages).toHaveLength(8);
      expect(service.stages[0]).toBe('steering');
      expect(service.stages[7]).toBe('completion');
    });
  });

  describe('getWorkflowState()', () => {
    it('should return initial state for new feature', async () => {
      const result = await service.getWorkflowState('feature-1');

      expect(result.featureId).toBe('feature-1');
      expect(result.currentStage).toBe('steering');
      expect(result.completedStages).toEqual([]);
      expect(result.progress).toBe(0);
    });

    it('should detect steering completion', async () => {
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(path.join(rulesDir, 'constitution.md'), '# Constitution');

      const result = await service.getWorkflowState('feature-1');

      expect(result.completedStages).toContain('steering');
      expect(result.artifacts.steering.constitution).toBe(true);
    });

    it('should detect requirements completion', async () => {
      // Setup steering
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(path.join(rulesDir, 'constitution.md'), '# Constitution');

      // Setup requirements
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-1-requirements.md'),
        '---\ntitle: Requirements\n---\n## REQ-001'
      );

      const result = await service.getWorkflowState('feature-1');

      expect(result.completedStages).toContain('requirements');
      expect(result.currentStage).toBe('design');
    });

    it('should detect design completion', async () => {
      // Setup steering
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(path.join(rulesDir, 'constitution.md'), '# Constitution');

      // Setup specs
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(path.join(specsDir, 'feature-1-requirements.md'), '# Req');
      await fs.writeFile(path.join(specsDir, 'feature-1-design.md'), '# Design');

      const result = await service.getWorkflowState('feature-1');

      expect(result.completedStages).toContain('design');
      expect(result.currentStage).toBe('tasks');
    });

    it('should calculate progress percentage', async () => {
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(path.join(rulesDir, 'constitution.md'), '# Constitution');

      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(path.join(specsDir, 'feature-1-requirements.md'), '# Req');

      const result = await service.getWorkflowState('feature-1');

      // 2 stages completed out of 8 = 25%
      expect(result.progress).toBe(25);
    });
  });

  describe('getAllWorkflows()', () => {
    it('should return empty array for no specs', async () => {
      const result = await service.getAllWorkflows();

      expect(result).toEqual([]);
    });

    it('should find all workflows from specs', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(path.join(specsDir, 'feature-a-requirements.md'), '# A');
      await fs.writeFile(path.join(specsDir, 'feature-b-design.md'), '# B');
      await fs.writeFile(path.join(specsDir, 'feature-a-design.md'), '# A Design');

      const result = await service.getAllWorkflows();

      expect(result).toHaveLength(2);
      expect(result.some(w => w.featureId === 'feature-a')).toBe(true);
      expect(result.some(w => w.featureId === 'feature-b')).toBe(true);
    });
  });

  describe('transitionTo()', () => {
    it('should allow transition to next stage', async () => {
      const result = await service.transitionTo('feature-1', 'steering');

      expect(result.currentStage).toBe('steering');
    });

    it('should throw for unknown stage', async () => {
      await expect(service.transitionTo('feature-1', 'unknown')).rejects.toThrow('Unknown stage');
    });

    it('should throw for stage skip', async () => {
      await expect(service.transitionTo('feature-1', 'tasks')).rejects.toThrow(
        'Cannot skip stages'
      );
    });
  });

  describe('validateWorkflow()', () => {
    it('should return valid for new workflow', async () => {
      const result = await service.validateWorkflow('feature-1');

      expect(result.featureId).toBe('feature-1');
      expect(result.valid).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('should detect empty requirements', async () => {
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(path.join(rulesDir, 'constitution.md'), '# Constitution');

      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(path.join(specsDir, 'feature-1-requirements.md'), '# Empty');

      const result = await service.validateWorkflow('feature-1');

      expect(result.issues.some(i => i.message === 'No requirements defined')).toBe(true);
    });
  });

  describe('fileExists()', () => {
    it('should return true for existing file', async () => {
      const testFile = path.join(tempDir, 'test.md');
      await fs.writeFile(testFile, 'content');

      const result = await service.fileExists(testFile);

      expect(result).toBe(true);
    });

    it('should return false for missing file', async () => {
      const result = await service.fileExists(path.join(tempDir, 'missing.md'));

      expect(result).toBe(false);
    });
  });

  describe('parseSpecFile()', () => {
    it('should parse frontmatter and sections', async () => {
      const testFile = path.join(tempDir, 'test.md');
      await fs.writeFile(testFile, '---\ntitle: Test\n---\n# Main\n## Section 1\n## Section 2');

      const result = await service.parseSpecFile(testFile);

      expect(result.frontmatter.title).toBe('Test');
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0]).toBe('Section 1');
    });

    it('should handle missing file', async () => {
      const result = await service.parseSpecFile(path.join(tempDir, 'missing.md'));

      expect(result.frontmatter).toEqual({});
      expect(result.sections).toEqual([]);
    });
  });
});
