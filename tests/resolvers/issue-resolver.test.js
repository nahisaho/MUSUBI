/**
 * Issue Resolver Tests
 *
 * Tests for REQ-P0-B006: Automated Issue Resolution
 */

'use strict';

const { IssueResolver, IssueInfo, IssueType, ResolverResult, ResolverStatus, ImpactAnalysis } = require('../../src/resolvers/issue-resolver');

describe('IssueResolver', () => {
  let resolver;

  beforeEach(() => {
    resolver = new IssueResolver({
      dryRun: true,
    });
  });

  describe('constructor', () => {
    test('should create with default options', () => {
      const r = new IssueResolver();
      expect(r.dryRun).toBe(false);
      expect(r.draftPR).toBe(true);
    });

    test('should accept custom options', () => {
      const r = new IssueResolver({
        dryRun: true,
        draftPR: false,
        projectRoot: '/custom/path',
      });
      expect(r.dryRun).toBe(true);
      expect(r.draftPR).toBe(false);
      expect(r.projectRoot).toBe('/custom/path');
    });
  });

  describe('generateBranchName', () => {
    test('should generate fix branch for bugs', () => {
      const issue = new IssueInfo({
        number: 123,
        title: 'Fix login bug',
        labels: ['bug'],
      });
      const branch = resolver.generateBranchName(issue);
      expect(branch).toContain('fix/123');
      expect(branch).toContain('login-bug');
    });

    test('should generate feat branch for features', () => {
      const issue = new IssueInfo({
        number: 456,
        title: 'Add dark mode',
        labels: ['enhancement'],
      });
      const branch = resolver.generateBranchName(issue);
      expect(branch).toContain('feat/456');
    });

    test('should sanitize special characters', () => {
      const issue = new IssueInfo({
        number: 789,
        title: 'Add @user/email validation!',
        labels: [],
      });
      const branch = resolver.generateBranchName(issue);
      expect(branch).not.toContain('@');
      expect(branch).not.toContain('!');
    });

    test('should truncate long titles', () => {
      const issue = new IssueInfo({
        number: 100,
        title: 'This is a very long issue title that should be truncated to fit branch name limits',
        labels: [],
      });
      const branch = resolver.generateBranchName(issue);
      expect(branch.length).toBeLessThanOrEqual(50);
    });
  });

  describe('extractRequirements', () => {
    test('should extract checkbox requirements', () => {
      const issue = new IssueInfo({
        number: 1,
        title: 'Feature request',
        body: `
          Requirements:
          - [ ] Add user validation
          - [ ] Show error messages
          - [ ] Log all attempts
        `,
        labels: [],
      });
      const reqs = resolver.extractRequirements(issue);
      expect(reqs.length).toBeGreaterThanOrEqual(3);
    });

    test('should extract numbered list requirements', () => {
      const issue = new IssueInfo({
        number: 2,
        title: 'Multiple tasks',
        body: `
          Steps to implement:
          - [ ] Create new component
          - [ ] Add styling
          - [ ] Write tests
        `,
        labels: [],
      });
      const reqs = resolver.extractRequirements(issue);
      expect(reqs.length).toBeGreaterThanOrEqual(3);
    });

    test('should handle empty body', () => {
      const issue = new IssueInfo({
        number: 4,
        title: 'Empty issue',
        body: '',
        labels: [],
      });
      const reqs = resolver.extractRequirements(issue);
      expect(Array.isArray(reqs)).toBe(true);
    });
  });

  describe('resolve', () => {
    test('should complete resolution for valid issue', async () => {
      const issue = new IssueInfo({
        number: 1,
        title: 'Fix login bug',
        body: '1. Check credentials\n2. Fix validation',
        labels: ['bug'],
      });
      const result = await resolver.resolve(issue);
      expect(result.status).toBe(ResolverStatus.COMPLETE);
      expect(result.issue).toBe(issue);
    });

    test('should extract requirements during resolution', async () => {
      const issue = new IssueInfo({
        number: 2,
        title: 'Add feature',
        body: '- [ ] Implement X\n- [ ] Test Y\n- [ ] Document Z',
        labels: ['enhancement'],
      });
      const result = await resolver.resolve(issue);
      expect(result.requirements.length).toBeGreaterThanOrEqual(3);
    });

    test('should generate branch name', async () => {
      const issue = new IssueInfo({
        number: 42,
        title: 'Update docs',
        labels: ['documentation'],
      });
      const result = await resolver.resolve(issue);
      expect(result.branchName).toBeDefined();
      expect(result.branchName).toContain('42');
    });
  });

  describe('generatePreview', () => {
    test('should generate markdown preview', async () => {
      const issue = new IssueInfo({
        number: 1,
        title: 'Test Issue',
        body: 'Test body',
        labels: ['bug'],
      });
      const result = await resolver.resolve(issue);
      const preview = resolver.generatePreview(result);
      expect(preview).toContain('Issue Resolution Preview');
      expect(preview).toContain('dry run');
    });
  });
});

describe('IssueInfo', () => {
  test('should create issue with all properties', () => {
    const issue = new IssueInfo({
      number: 42,
      title: 'Test Issue',
      body: 'Test body',
      labels: ['bug', 'urgent'],
      author: 'testuser',
      url: 'https://github.com/owner/repo/issues/42',
    });

    expect(issue.number).toBe(42);
    expect(issue.title).toBe('Test Issue');
    expect(issue.body).toBe('Test body');
    expect(issue.labels).toEqual(['bug', 'urgent']);
    expect(issue.author).toBe('testuser');
    expect(issue.url).toBe('https://github.com/owner/repo/issues/42');
  });

  test('should handle missing optional properties', () => {
    const issue = new IssueInfo({
      number: 1,
      title: 'Minimal Issue',
    });

    expect(issue.body).toBe('');
    expect(issue.labels).toEqual([]);
    expect(issue.comments).toEqual([]);
  });

  describe('type detection', () => {
    test('should detect bug type from labels', () => {
      const issue = new IssueInfo({
        number: 1,
        title: 'Something broken',
        labels: ['bug'],
      });
      expect(issue.type).toBe(IssueType.BUG);
    });

    test('should detect feature type from labels', () => {
      const issue = new IssueInfo({
        number: 2,
        title: 'New feature',
        labels: ['enhancement'],
      });
      expect(issue.type).toBe(IssueType.FEATURE);
    });

    test('should detect documentation type', () => {
      const issue = new IssueInfo({
        number: 3,
        title: 'Update docs',
        labels: ['documentation'],
      });
      expect(issue.type).toBe(IssueType.DOCUMENTATION);
    });

    test('should detect refactor type', () => {
      const issue = new IssueInfo({
        number: 4,
        title: 'Refactor service',
        labels: ['refactor'],
      });
      expect(issue.type).toBe(IssueType.REFACTOR);
    });

    test('should detect bug from title content', () => {
      const issue = new IssueInfo({
        number: 5,
        title: 'Bug: Login fails',
        labels: [],
      });
      expect(issue.type).toBe(IssueType.BUG);
    });

    test('should return unknown for unclassifiable', () => {
      const issue = new IssueInfo({
        number: 6,
        title: 'Something',
        labels: [],
      });
      expect(issue.type).toBe(IssueType.UNKNOWN);
    });
  });

  test('should return full content', () => {
    const issue = new IssueInfo({
      number: 1,
      title: 'Test Title',
      body: 'Test body content',
      comments: [{ author: 'user1', body: 'Comment 1' }],
    });
    const content = issue.fullContent;
    expect(content).toContain('Test Title');
    expect(content).toContain('Test body content');
    expect(content).toContain('Comment 1');
  });
});

describe('ResolverResult', () => {
  test('should create with pending status by default', () => {
    const result = new ResolverResult();
    expect(result.status).toBe(ResolverStatus.PENDING);
  });

  test('should store issue reference', () => {
    const issue = new IssueInfo({
      number: 1,
      title: 'Test',
    });
    const result = new ResolverResult({ issue });
    expect(result.issue).toBe(issue);
  });

  test('should serialize to JSON', () => {
    const issue = new IssueInfo({
      number: 1,
      title: 'Test',
      labels: ['bug'],
    });
    const result = new ResolverResult({
      status: ResolverStatus.COMPLETE,
      issue,
      requirements: ['req1', 'req2'],
    });
    const json = result.toJSON();
    expect(json.status).toBe(ResolverStatus.COMPLETE);
    expect(json.issueNumber).toBe(1);
    expect(json.timestamp).toBeDefined();
  });

  test('should generate markdown report', () => {
    const issue = new IssueInfo({
      number: 1,
      title: 'Test Issue',
      labels: ['bug'],
    });
    const result = new ResolverResult({
      status: ResolverStatus.COMPLETE,
      issue,
      requirements: ['req1', 'req2'],
      changes: [{ file: 'src/test.js', description: 'Added test' }],
    });
    const md = result.toMarkdown();
    expect(md).toContain('Issue Resolution Report');
    expect(md).toContain('req1');
    expect(md).toContain('src/test.js');
  });

  test('should include error in report when failed', () => {
    const result = new ResolverResult({
      status: ResolverStatus.FAILED,
      error: 'Something went wrong',
    });
    const md = result.toMarkdown();
    expect(md).toContain('Error');
    expect(md).toContain('Something went wrong');
  });
});

describe('ResolverStatus', () => {
  test('should have all expected statuses', () => {
    expect(ResolverStatus.PENDING).toBe('pending');
    expect(ResolverStatus.ANALYZING).toBe('analyzing');
    expect(ResolverStatus.IMPLEMENTING).toBe('implementing');
    expect(ResolverStatus.TESTING).toBe('testing');
    expect(ResolverStatus.COMPLETE).toBe('complete');
    expect(ResolverStatus.FAILED).toBe('failed');
  });
});

describe('IssueType', () => {
  test('should have all expected types', () => {
    expect(IssueType.BUG).toBe('bug');
    expect(IssueType.FEATURE).toBe('feature');
    expect(IssueType.DOCUMENTATION).toBe('documentation');
    expect(IssueType.REFACTOR).toBe('refactor');
    expect(IssueType.TEST).toBe('test');
    expect(IssueType.UNKNOWN).toBe('unknown');
  });
});

describe('ImpactAnalysis', () => {
  test('should create with default values', () => {
    const analysis = new ImpactAnalysis();
    expect(analysis.affectedFiles).toEqual([]);
    expect(analysis.affectedComponents).toEqual([]);
    expect(analysis.riskLevel).toBe('low');
  });

  test('should accept custom values', () => {
    const analysis = new ImpactAnalysis({
      affectedFiles: ['src/file.js'],
      affectedComponents: ['auth'],
      riskLevel: 'high',
      estimatedEffort: '2 hours',
    });
    expect(analysis.affectedFiles).toContain('src/file.js');
    expect(analysis.riskLevel).toBe('high');
    expect(analysis.estimatedEffort).toBe('2 hours');
  });

  test('should generate markdown', () => {
    const analysis = new ImpactAnalysis({
      affectedFiles: ['src/auth.js'],
      affectedComponents: ['Authentication'],
      riskLevel: 'medium',
    });
    const md = analysis.toMarkdown();
    expect(md).toContain('Affected Files');
    expect(md).toContain('src/auth.js');
    expect(md).toContain('medium');
  });
});
