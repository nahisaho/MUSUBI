/**
 * @fileoverview Tests for Traceability Service
 */

const TraceabilityService = require('../../src/gui/services/traceability-service');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('TraceabilityService', () => {
  let tempDir;
  let service;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    service = new TraceabilityService(tempDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('constructor()', () => {
    it('should create a service instance', () => {
      expect(service).toBeInstanceOf(TraceabilityService);
      expect(service.projectPath).toBe(tempDir);
    });
  });

  describe('buildMatrix()', () => {
    it('should return empty matrix for no specs', async () => {
      const result = await service.buildMatrix();

      expect(result.requirements).toEqual([]);
      expect(result.links).toEqual([]);
      expect(result.coverage.total).toBe(0);
    });

    it('should build matrix from requirements', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '# Requirements\n\n### REQ-001: Login Feature\nThe system shall support login.'
      );

      const result = await service.buildMatrix();

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0].id).toBe('REQ-001');
      expect(result.requirements[0].status).toBe('unlinked');
    });

    it('should link requirements to designs', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: Login\nContent'
      );
      
      await fs.writeFile(
        path.join(specsDir, 'feature-design.md'),
        '---\ntitle: Design\nrequirements:\n  - REQ-001\n---\n# Design'
      );

      const result = await service.buildMatrix();

      expect(result.requirements[0].status).toBe('designed');
      expect(result.requirements[0].links.designs).toHaveLength(1);
    });

    it('should link requirements to tasks', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: Login\nContent'
      );
      
      await fs.writeFile(
        path.join(specsDir, 'feature-tasks.md'),
        '---\nrequirement: REQ-001\n---\n- [ ] Implement login'
      );

      const result = await service.buildMatrix();

      expect(result.requirements[0].status).toBe('tasked');
      expect(result.requirements[0].links.tasks).toHaveLength(1);
    });

    it('should calculate coverage statistics', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: Login\nContent\n\n### REQ-002: Logout\nContent'
      );
      
      await fs.writeFile(
        path.join(specsDir, 'feature-design.md'),
        '---\nrequirements:\n  - REQ-001\n---\n# Design'
      );

      const result = await service.buildMatrix();

      expect(result.coverage.total).toBe(2);
      expect(result.coverage.linked).toBe(1);
    });
  });

  describe('scanRequirements()', () => {
    it('should return empty array for no specs', async () => {
      const result = await service.scanRequirements();

      expect(result).toEqual([]);
    });

    it('should parse requirements from content', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'test-requirements.md'),
        '### REQ-001: First\nContent\n\n### REQ-002: Second\nMore content'
      );

      const result = await service.scanRequirements();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('REQ-001');
      expect(result[1].id).toBe('REQ-002');
    });

    it('should parse requirements from frontmatter', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'test-requirements.md'),
        '---\nrequirements:\n  - id: REQ-100\n    title: From YAML\n---\n# Content'
      );

      const result = await service.scanRequirements();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('REQ-100');
    });
  });

  describe('scanDesigns()', () => {
    it('should return empty array for no designs', async () => {
      const result = await service.scanDesigns();

      expect(result).toEqual([]);
    });

    it('should parse design files', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-design.md'),
        '---\ntitle: Feature Design\nrequirements:\n  - REQ-001\n---\n# Design'
      );

      const result = await service.scanDesigns();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('feature');
      expect(result[0].requirements).toContain('REQ-001');
    });
  });

  describe('scanTasks()', () => {
    it('should return empty array for no tasks', async () => {
      const result = await service.scanTasks();

      expect(result).toEqual([]);
    });

    it('should parse task files', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-tasks.md'),
        '---\nrequirement: REQ-001\n---\n- [ ] First task\n- [x] Second task'
      );

      const result = await service.scanTasks();

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('todo');
      expect(result[1].status).toBe('done');
    });
  });

  describe('scanImplementations()', () => {
    it('should return empty array for no source', async () => {
      const result = await service.scanImplementations();

      expect(result).toEqual([]);
    });

    it('should find implementation tags in source', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.ensureDir(srcDir);
      await fs.writeFile(
        path.join(srcDir, 'login.js'),
        '/**\n * @implements REQ-001\n */\nfunction login() {}'
      );

      const result = await service.scanImplementations();

      expect(result).toHaveLength(1);
      expect(result[0].requirements).toContain('REQ-001');
    });

    it('should find @requirement tags', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.ensureDir(srcDir);
      await fs.writeFile(
        path.join(srcDir, 'logout.ts'),
        '/**\n * @requirement REQ-002\n */\nfunction logout() {}'
      );

      const result = await service.scanImplementations();

      expect(result).toHaveLength(1);
      expect(result[0].requirements).toContain('REQ-002');
    });
  });

  describe('getCoverage()', () => {
    it('should calculate coverage statistics', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: One\n### REQ-002: Two\n### REQ-003: Three'
      );
      
      await fs.writeFile(
        path.join(specsDir, 'feature-design.md'),
        '---\nrequirements:\n  - REQ-001\n---'
      );

      const result = await service.getCoverage();

      expect(result.total).toBe(3);
      expect(result.linked).toBe(1);
      expect(result.linkedPercent).toBe(33);
    });

    it('should handle empty requirements', async () => {
      const result = await service.getCoverage();

      expect(result.total).toBe(0);
      expect(result.linkedPercent).toBe(0);
    });
  });

  describe('findGaps()', () => {
    it('should find requirements without design', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: No design\nContent'
      );

      const result = await service.findGaps();

      expect(result.some(g => g.type === 'no-design')).toBe(true);
    });

    it('should find requirements without tasks', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: No tasks\nContent'
      );

      const result = await service.findGaps();

      expect(result.some(g => g.type === 'no-tasks')).toBe(true);
    });

    it('should find tasked but not implemented', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      
      await fs.writeFile(
        path.join(specsDir, 'feature-requirements.md'),
        '### REQ-001: Has tasks\nContent'
      );
      
      await fs.writeFile(
        path.join(specsDir, 'feature-tasks.md'),
        '---\nrequirement: REQ-001\n---\n- [ ] Task'
      );

      const result = await service.findGaps();

      expect(result.some(g => g.type === 'not-implemented')).toBe(true);
    });
  });

  describe('walkDirectory()', () => {
    it('should walk directory recursively', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.ensureDir(path.join(srcDir, 'sub'));
      await fs.writeFile(path.join(srcDir, 'a.js'), '');
      await fs.writeFile(path.join(srcDir, 'sub', 'b.js'), '');

      const files = [];
      await service.walkDirectory(srcDir, (f) => files.push(f));

      expect(files).toHaveLength(2);
    });

    it('should skip node_modules', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.ensureDir(path.join(srcDir, 'node_modules'));
      await fs.writeFile(path.join(srcDir, 'a.js'), '');
      await fs.writeFile(path.join(srcDir, 'node_modules', 'b.js'), '');

      const files = [];
      await service.walkDirectory(srcDir, (f) => files.push(f));

      expect(files).toHaveLength(1);
    });
  });
});
