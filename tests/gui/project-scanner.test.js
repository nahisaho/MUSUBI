/**
 * @fileoverview Tests for Project Scanner Service
 */

const ProjectScanner = require('../../src/gui/services/project-scanner');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('ProjectScanner', () => {
  let tempDir;
  let scanner;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    scanner = new ProjectScanner(tempDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('scan()', () => {
    it('should scan an empty project', async () => {
      const result = await scanner.scan();

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('path', tempDir);
      expect(result.hasSteering).toBe(false);
      expect(result.hasSpecs).toBe(false);
    });

    it('should detect steering directory', async () => {
      await fs.ensureDir(path.join(tempDir, 'steering'));

      const result = await scanner.scan();

      expect(result.hasSteering).toBe(true);
    });

    it('should detect specs directory', async () => {
      await fs.ensureDir(path.join(tempDir, 'storage', 'specs'));

      const result = await scanner.scan();

      expect(result.hasSpecs).toBe(true);
    });

    it('should cache results', async () => {
      await fs.ensureDir(path.join(tempDir, 'steering'));
      
      const result1 = await scanner.scan();
      const result2 = await scanner.scan();

      expect(result1).toBe(result2);
    });
  });

  describe('getSteering()', () => {
    it('should return null for missing steering', async () => {
      const result = await scanner.getSteering();

      expect(result).toBeNull();
    });

    it('should parse steering files', async () => {
      const steeringDir = path.join(tempDir, 'steering');
      await fs.ensureDir(steeringDir);
      await fs.writeFile(
        path.join(steeringDir, 'product.md'),
        '---\ntitle: Test Product\n---\n# Product'
      );
      await fs.writeFile(
        path.join(steeringDir, 'tech.md'),
        '---\nstack: Node.js\n---\n# Tech'
      );

      const result = await scanner.getSteering();

      expect(result).not.toBeNull();
      expect(result.product).not.toBeNull();
      expect(result.tech).not.toBeNull();
    });
  });

  describe('getConstitution()', () => {
    it('should return null for missing constitution', async () => {
      const result = await scanner.getConstitution();

      expect(result).toBeNull();
    });

    it('should parse constitution articles', async () => {
      const rulesDir = path.join(tempDir, 'steering', 'rules');
      await fs.ensureDir(rulesDir);
      await fs.writeFile(
        path.join(rulesDir, 'constitution.md'),
        `# Constitution\n\n## Article 1: Purpose\nDefines the purpose.\n\n## Article 2: Scope\nDefines the scope.`
      );

      const result = await scanner.getConstitution();

      expect(result).not.toBeNull();
      expect(result.articles).toHaveLength(2);
      expect(result.articles[0].number).toBe(1);
      expect(result.articles[0].title).toContain('Purpose');
    });
  });

  describe('getSpecs()', () => {
    it('should return empty array for missing specs', async () => {
      const result = await scanner.getSpecs();

      expect(result).toEqual([]);
    });

    it('should parse spec files', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature-a.md'),
        `---\ntitle: Feature A\n---\n\n## REQ-001: User Login\nThe system shall allow users to login.\n\n- [ ] TASK-001: Create login form`
      );

      const result = await scanner.getSpecs();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('feature-a');
      expect(result[0].requirements).toHaveLength(1);
      expect(result[0].tasks).toHaveLength(1);
    });
  });

  describe('parseRequirements()', () => {
    it('should parse requirements from content', () => {
      const content = `
## REQ-001: First requirement
The system shall do something.

## REQ-002: Second requirement
WHEN user clicks, the system shall respond.
`;
      const result = scanner.parseRequirements(content);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('REQ-001');
      expect(result[0].pattern).toBe('ubiquitous');
      expect(result[1].id).toBe('REQ-002');
      expect(result[1].pattern).toBe('event-driven');
    });
  });

  describe('parseTasks()', () => {
    it('should parse tasks from content', () => {
      const content = `
- [ ] TASK-001: Incomplete task
- [x] TASK-002: Completed task
- [ ] Another task without ID
`;
      const result = scanner.parseTasks(content);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('TASK-001');
      expect(result[0].completed).toBe(false);
      expect(result[1].id).toBe('TASK-002');
      expect(result[1].completed).toBe(true);
    });
  });

  describe('detectEARSPattern()', () => {
    it('should detect event-driven pattern', () => {
      expect(scanner.detectEARSPattern('WHEN user clicks')).toBe('event-driven');
    });

    it('should detect state-driven pattern', () => {
      expect(scanner.detectEARSPattern('WHILE system is running')).toBe('state-driven');
    });

    it('should detect optional pattern', () => {
      expect(scanner.detectEARSPattern('WHERE feature is enabled')).toBe('optional');
    });

    it('should detect complex pattern', () => {
      expect(scanner.detectEARSPattern('IF user is admin')).toBe('complex');
    });

    it('should default to ubiquitous pattern', () => {
      expect(scanner.detectEARSPattern('The system shall')).toBe('ubiquitous');
    });
  });

  describe('getTraceabilityMatrix()', () => {
    it('should return empty matrix for no specs', async () => {
      const result = await scanner.getTraceabilityMatrix();

      expect(result.requirements).toEqual([]);
      expect(result.traces).toEqual([]);
    });

    it('should build matrix from specs', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature.md'),
        `---\ntitle: Feature\n---\n\n## REQ-001: Requirement\nContent.\n\n- [ ] TASK-001: Task for REQ-001`
      );

      const result = await scanner.getTraceabilityMatrix();

      expect(result.requirements).toHaveLength(1);
      expect(result.traces).toHaveLength(1);
      expect(result.traces[0].from).toBe('REQ-001');
      expect(result.traces[0].to).toBe('TASK-001');
    });
  });

  describe('getTraceabilityGraph()', () => {
    it('should return graph data for D3.js', async () => {
      const specsDir = path.join(tempDir, 'storage', 'specs');
      await fs.ensureDir(specsDir);
      await fs.writeFile(
        path.join(specsDir, 'feature.md'),
        `---\ntitle: Feature\n---\n\n## REQ-001: Requirement\nContent.\n\n- [ ] TASK-001: Task for REQ-001`
      );

      const result = await scanner.getTraceabilityGraph();

      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('links');
      expect(result.nodes.some(n => n.id === 'REQ-001')).toBe(true);
      expect(result.nodes.some(n => n.id === 'TASK-001')).toBe(true);
    });
  });
});
