/**
 * Tests for Skill Loader
 * @see src/managers/skill-loader.js
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  SkillLoader,
  Skill,
  SkillType,
  AgentType,
} = require('../../src/managers/skill-loader');

describe('Skill', () => {
  describe('constructor', () => {
    it('should initialize with default values', () => {
      const skill = new Skill();
      expect(skill.name).toBe('unnamed');
      expect(skill.type).toBe(SkillType.GLOBAL);
      expect(skill.triggers).toEqual([]);
      expect(skill.agent).toBe(AgentType.ALL);
      expect(skill.priority).toBe(0);
    });

    it('should accept custom options', () => {
      const skill = new Skill({
        name: 'test-skill',
        type: SkillType.REPO,
        triggers: ['test', 'testing'],
        agent: AgentType.CODER,
        priority: 100,
        content: '# Test Content',
      });
      expect(skill.name).toBe('test-skill');
      expect(skill.type).toBe(SkillType.REPO);
      expect(skill.triggers).toContain('test');
      expect(skill.priority).toBe(100);
    });
  });

  describe('matchesTrigger', () => {
    it('should match simple keyword', () => {
      const skill = new Skill({ triggers: ['test'] });
      expect(skill.matchesTrigger('I want to run a test')).toBe(true);
      expect(skill.matchesTrigger('no match here')).toBe(false);
    });

    it('should match case-insensitively', () => {
      const skill = new Skill({ triggers: ['test'] });
      expect(skill.matchesTrigger('TEST something')).toBe(true);
      expect(skill.matchesTrigger('TeSt CaSe')).toBe(true);
    });

    it('should match regex pattern', () => {
      const skill = new Skill({ triggers: ['/\\btest(ing)?\\b/i'] });
      expect(skill.matchesTrigger('I am testing this')).toBe(true);
      expect(skill.matchesTrigger('Run the test now')).toBe(true);
      expect(skill.matchesTrigger('no match')).toBe(false);
    });

    it('should match any trigger in array', () => {
      const skill = new Skill({ triggers: ['test', 'spec', 'テスト'] });
      expect(skill.matchesTrigger('write a spec')).toBe(true);
      expect(skill.matchesTrigger('テストを書いて')).toBe(true);
    });

    it('should handle invalid regex gracefully', () => {
      const skill = new Skill({ triggers: ['/[invalid/'] });
      expect(skill.matchesTrigger('test')).toBe(false);
    });
  });

  describe('isAvailableFor', () => {
    it('should return true for ALL agent type', () => {
      const skill = new Skill({ agent: AgentType.ALL });
      expect(skill.isAvailableFor(AgentType.CODER)).toBe(true);
      expect(skill.isAvailableFor(AgentType.TESTER)).toBe(true);
    });

    it('should match specific agent type', () => {
      const skill = new Skill({ agent: AgentType.CODER });
      expect(skill.isAvailableFor(AgentType.CODER)).toBe(true);
      expect(skill.isAvailableFor(AgentType.TESTER)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const skill = new Skill({
        name: 'test',
        triggers: ['keyword'],
      });
      const json = skill.toJSON();
      expect(json.name).toBe('test');
      expect(json.triggers).toContain('keyword');
      expect(json.loadedAt).toBeDefined();
    });
  });
});

describe('SkillLoader', () => {
  let loader;
  let tempDir;
  let skillsDir;

  beforeEach(() => {
    // Create temp directory for test
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'musubi-skill-test-'));
    skillsDir = path.join(tempDir, '.musubi/skills');
    fs.mkdirSync(skillsDir, { recursive: true });

    loader = new SkillLoader({
      projectRoot: tempDir,
      globalDir: path.join(tempDir, 'global-skills'),
      userDir: path.join(tempDir, 'user-skills'),
      repoDir: skillsDir,
    });
  });

  afterEach(() => {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const defaultLoader = new SkillLoader();
      expect(defaultLoader.loadedSkills).toBeInstanceOf(Map);
      expect(defaultLoader.initialized).toBe(false);
    });

    it('should accept custom directories', () => {
      expect(loader.repoDir).toBe(skillsDir);
    });
  });

  describe('parseSkill', () => {
    it('should parse skill file with frontmatter', async () => {
      const skillContent = `---
name: test-skill
type: repo
triggers:
  - test
  - testing
agent: all
priority: 50
---

# Test Skill

This is test content.
`;
      const skillPath = path.join(skillsDir, 'test.md');
      fs.writeFileSync(skillPath, skillContent);

      const skill = await loader.parseSkill(skillPath);
      expect(skill.name).toBe('test-skill');
      expect(skill.triggers).toContain('test');
      expect(skill.triggers).toContain('testing');
      expect(skill.priority).toBe(50);
      expect(skill.content).toContain('# Test Skill');
    });

    it('should use filename as name if not specified', async () => {
      const skillContent = `---
type: repo
---

Content here.
`;
      const skillPath = path.join(skillsDir, 'my-skill.md');
      fs.writeFileSync(skillPath, skillContent);

      const skill = await loader.parseSkill(skillPath);
      expect(skill.name).toBe('my-skill');
    });

    it('should handle files without frontmatter', async () => {
      const skillContent = `# Just Markdown

No frontmatter here.
`;
      const skillPath = path.join(skillsDir, 'simple.md');
      fs.writeFileSync(skillPath, skillContent);

      const skill = await loader.parseSkill(skillPath);
      expect(skill.name).toBe('simple');
      expect(skill.content).toContain('# Just Markdown');
    });

    it('should parse inline array triggers', async () => {
      const skillContent = `---
name: inline-test
triggers: [test, spec, check]
---

Content.
`;
      const skillPath = path.join(skillsDir, 'inline.md');
      fs.writeFileSync(skillPath, skillContent);

      const skill = await loader.parseSkill(skillPath);
      expect(skill.triggers).toContain('test');
      expect(skill.triggers).toContain('spec');
      expect(skill.triggers).toContain('check');
    });
  });

  describe('loadAll', () => {
    it('should load skills from repo directory', async () => {
      const skillContent = `---
name: repo-skill
triggers:
  - help
---

Help content.
`;
      fs.writeFileSync(path.join(skillsDir, 'help.md'), skillContent);

      const skills = await loader.loadAll();
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('repo-skill');
      expect(loader.initialized).toBe(true);
    });

    it('should prioritize repo skills over global', async () => {
      // Create global skill
      const globalDir = path.join(tempDir, 'global-skills');
      fs.mkdirSync(globalDir, { recursive: true });
      fs.writeFileSync(path.join(globalDir, 'test.md'), `---
name: test
priority: 10
---
Global version.
`);

      // Create repo skill with same name
      fs.writeFileSync(path.join(skillsDir, 'test.md'), `---
name: test
priority: 10
---
Repo version.
`);

      await loader.loadAll();
      const skill = loader.getSkill('test');
      expect(skill.content).toContain('Repo version');
      expect(skill.priority).toBe(210); // 10 + 200 (repo base)
    });
  });

  describe('activateByKeywords', () => {
    beforeEach(async () => {
      fs.writeFileSync(path.join(skillsDir, 'testing.md'), `---
name: testing
triggers:
  - test
  - テスト
---
Testing content.
`);
      fs.writeFileSync(path.join(skillsDir, 'coding.md'), `---
name: coding
triggers:
  - code
  - implement
---
Coding content.
`);
      await loader.loadAll();
    });

    it('should activate matching skills', () => {
      const skills = loader.activateByKeywords('I want to write a test');
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('testing');
    });

    it('should activate multiple matching skills', () => {
      const skills = loader.activateByKeywords('test and code please');
      expect(skills.length).toBe(2);
    });

    it('should return empty array if no match', () => {
      const skills = loader.activateByKeywords('no keywords here');
      expect(skills.length).toBe(0);
    });

    it('should match Japanese keywords', () => {
      const skills = loader.activateByKeywords('テストを書いて');
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('testing');
    });

    it('should warn if not initialized', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const freshLoader = new SkillLoader({ projectRoot: tempDir });
      freshLoader.activateByKeywords('test');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('getSkills', () => {
    it('should return all loaded skills', async () => {
      fs.writeFileSync(path.join(skillsDir, 'a.md'), '---\nname: a\n---\nA');
      fs.writeFileSync(path.join(skillsDir, 'b.md'), '---\nname: b\n---\nB');
      await loader.loadAll();

      const skills = loader.getSkills();
      expect(skills.length).toBe(2);
    });
  });

  describe('getSkillsByType', () => {
    it('should filter by type', async () => {
      fs.writeFileSync(path.join(skillsDir, 'repo.md'), '---\nname: r\ntype: repo\n---\nR');
      await loader.loadAll();

      const repoSkills = loader.getSkillsByType(SkillType.REPO);
      expect(repoSkills.length).toBe(1);
    });
  });

  describe('hasRepoSkills', () => {
    it('should return true if repo skills exist', () => {
      fs.writeFileSync(path.join(skillsDir, 'test.md'), '# Test');
      expect(loader.hasRepoSkills()).toBe(true);
    });

    it('should return false if no skills', () => {
      fs.rmSync(skillsDir, { recursive: true });
      expect(loader.hasRepoSkills()).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('should return markdown summary', async () => {
      fs.writeFileSync(path.join(skillsDir, 'test.md'), `---
name: test
triggers:
  - keyword
---
Content.
`);
      await loader.loadAll();

      const summary = loader.getSummary();
      expect(summary).toContain('# Loaded Skills');
      expect(summary).toContain('Total: 1');
      expect(summary).toContain('test');
    });

    it('should handle no skills', () => {
      const summary = loader.getSummary();
      expect(summary).toContain('No skills loaded');
    });
  });

  describe('formatSkillsForPrompt', () => {
    it('should format skills for LLM prompt', async () => {
      fs.writeFileSync(path.join(skillsDir, 'test.md'), `---
name: test
triggers:
  - keyword
---
# Test Skill

This is important content.
`);
      await loader.loadAll();
      const skills = loader.activateByKeywords('keyword');

      const prompt = loader.formatSkillsForPrompt(skills);
      expect(prompt).toContain('## Activated Skills');
      expect(prompt).toContain('### test');
      expect(prompt).toContain('This is important content');
    });

    it('should return empty string for no skills', () => {
      const prompt = loader.formatSkillsForPrompt([]);
      expect(prompt).toBe('');
    });
  });
});
