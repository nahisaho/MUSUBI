/**
 * Tests for Repository Skill Manager
 * @see src/managers/repo-skill-manager.js
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { RepoSkillManager } = require('../../src/managers/repo-skill-manager');

describe('RepoSkillManager', () => {
  let manager;
  let tempDir;

  beforeEach(() => {
    // Create temp directory for test
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'musubi-repo-skill-test-'));
    manager = new RepoSkillManager({ projectRoot: tempDir });
  });

  afterEach(() => {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const defaultManager = new RepoSkillManager();
      expect(defaultManager.projectRoot).toBe(process.cwd());
      expect(defaultManager.skillsDir).toContain('.musubi/skills');
    });

    it('should accept custom project root', () => {
      expect(manager.projectRoot).toBe(tempDir);
      expect(manager.skillsDir).toBe(path.join(tempDir, '.musubi/skills'));
    });
  });

  describe('initialize', () => {
    it('should create .musubi/skills directory', async () => {
      const result = await manager.initialize();
      expect(fs.existsSync(manager.skillsDir)).toBe(true);
      expect(result.created).toContain('.musubi/skills/');
    });

    it('should create repo.md', async () => {
      const result = await manager.initialize();
      const repoMdPath = path.join(manager.skillsDir, 'repo.md');
      expect(fs.existsSync(repoMdPath)).toBe(true);
      expect(result.created).toContain('repo.md');
    });

    it('should skip existing repo.md', async () => {
      // Create directory and repo.md first
      fs.mkdirSync(manager.skillsDir, { recursive: true });
      fs.writeFileSync(path.join(manager.skillsDir, 'repo.md'), '# Existing');

      const result = await manager.initialize();
      expect(result.skipped).toContain('repo.md');

      // Verify content unchanged
      const content = fs.readFileSync(path.join(manager.skillsDir, 'repo.md'), 'utf-8');
      expect(content).toBe('# Existing');
    });
  });

  describe('generateRepoMd', () => {
    it('should generate repo.md content', async () => {
      const content = await manager.generateRepoMd();
      expect(content).toContain('---');
      expect(content).toContain('name: repo');
      expect(content).toContain('type: repo');
      expect(content).toContain('## Repository Structure');
    });

    it('should detect Node.js project from package.json', async () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
        name: 'test-project',
        description: 'A test project',
        scripts: {
          test: 'jest',
          build: 'tsc',
        },
        devDependencies: {
          jest: '^29.0.0',
          typescript: '^5.0.0',
        },
      }, null, 2));

      const content = await manager.generateRepoMd();
      expect(content).toContain('# test-project');
      expect(content).toContain('A test project');
      expect(content).toContain('npm install');
      expect(content).toContain('npm run test');
      expect(content).toContain('Jest');
      expect(content).toContain('TypeScript');
    });

    it('should detect Python project', async () => {
      fs.writeFileSync(path.join(tempDir, 'requirements.txt'), 'pytest>=7.0.0\n');

      const content = await manager.generateRepoMd();
      expect(content).toContain('pip install -r requirements.txt');
    });

    it('should detect CI/CD configuration', async () => {
      fs.mkdirSync(path.join(tempDir, '.github/workflows'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, '.github/workflows/ci.yml'), 'name: CI');

      const content = await manager.generateRepoMd();
      expect(content).toContain('GitHub Actions');
    });

    it('should include conventions', async () => {
      fs.writeFileSync(path.join(tempDir, '.prettierrc'), '{}');

      const content = await manager.generateRepoMd();
      expect(content).toContain('Prettier');
    });
  });

  describe('_generateTreeStructure', () => {
    it('should generate directory tree', async () => {
      // Create sample structure
      fs.mkdirSync(path.join(tempDir, 'src'));
      fs.mkdirSync(path.join(tempDir, 'tests'));
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'src/index.js'), '');

      const tree = manager._generateTreeStructure();
      expect(tree).toContain('src/');
      expect(tree).toContain('tests/');
      expect(tree).toContain('package.json');
    });

    it('should ignore node_modules', async () => {
      fs.mkdirSync(path.join(tempDir, 'node_modules'));
      fs.writeFileSync(path.join(tempDir, 'node_modules/test'), '');

      const tree = manager._generateTreeStructure();
      expect(tree).not.toContain('node_modules');
    });

    it('should truncate long trees', async () => {
      // Create many directories
      for (let i = 0; i < 20; i++) {
        fs.mkdirSync(path.join(tempDir, `dir${i}`));
      }

      const tree = manager._generateTreeStructure();
      expect(tree).toContain('truncated');
    });
  });

  describe('addSkill', () => {
    it('should create new skill file', async () => {
      const filePath = await manager.addSkill('Testing', {
        triggers: ['test', 'spec'],
        content: '## Testing Guidelines\n\nWrite tests.',
      });

      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Testing');
      expect(content).toContain('- test');
      expect(content).toContain('- spec');
      expect(content).toContain('## Testing Guidelines');
    });

    it('should convert name to filename', async () => {
      const filePath = await manager.addSkill('My Great Skill', {});
      expect(path.basename(filePath)).toBe('my-great-skill.md');
    });

    it('should throw if skill exists and no overwrite', async () => {
      await manager.addSkill('test', {});
      await expect(manager.addSkill('test', {})).rejects.toThrow('already exists');
    });

    it('should overwrite with overwrite option', async () => {
      await manager.addSkill('test', { content: 'Original' });
      await manager.addSkill('test', { content: 'Updated', overwrite: true });

      const content = fs.readFileSync(path.join(manager.skillsDir, 'test.md'), 'utf-8');
      expect(content).toContain('Updated');
    });

    it('should create skills directory if not exists', async () => {
      const freshManager = new RepoSkillManager({ projectRoot: tempDir });
      await freshManager.addSkill('test', {});
      expect(fs.existsSync(freshManager.skillsDir)).toBe(true);
    });
  });

  describe('listSkills', () => {
    it('should list all skill files', async () => {
      await manager.addSkill('skill1', {});
      await manager.addSkill('skill2', {});

      const skills = manager.listSkills();
      expect(skills.length).toBe(2);
      expect(skills[0]).toHaveProperty('name');
      expect(skills[0]).toHaveProperty('path');
      expect(skills[0]).toHaveProperty('size');
    });

    it('should return empty array if no skills', () => {
      const skills = manager.listSkills();
      expect(skills).toEqual([]);
    });
  });

  describe('updateRepoMd', () => {
    it('should update repo.md', async () => {
      await manager.initialize();
      
      // Add package.json
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
        name: 'updated-project',
      }));

      await manager.updateRepoMd();
      const content = fs.readFileSync(path.join(manager.skillsDir, 'repo.md'), 'utf-8');
      expect(content).toContain('updated-project');
    });
  });

  describe('removeSkill', () => {
    it('should remove skill file', async () => {
      await manager.addSkill('test', {});
      const result = manager.removeSkill('test');
      expect(result).toBe(true);
      expect(fs.existsSync(path.join(manager.skillsDir, 'test.md'))).toBe(false);
    });

    it('should return false if skill not found', () => {
      const result = manager.removeSkill('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('generateSampleSkills', () => {
    it('should create sample skill files', async () => {
      const result = await manager.generateSampleSkills();
      expect(result.created).toContain('testing');
      expect(result.created).toContain('debugging');
      expect(fs.existsSync(path.join(manager.skillsDir, 'testing.md'))).toBe(true);
    });

    it('should skip existing skills', async () => {
      await manager.addSkill('testing', { content: 'Existing' });
      const result = await manager.generateSampleSkills();
      expect(result.skipped).toContain('testing');
      expect(result.created).toContain('debugging');
    });
  });
});
