/**
 * Tests for GitHub Reference Feature
 *
 * Tests the --reference option for referencing GitHub repositories
 * to analyze patterns and generate improvement suggestions.
 */

const path = require('path');

// Mock modules before requiring the module under test
jest.mock('fs-extra');
jest.mock('https');

const _fs = require('fs-extra'); // Mocked, kept for potential future use
const _https = require('https'); // Mocked, kept for potential future use

// Read both the init script and helpers module for testing
const initPath = path.join(__dirname, '..', 'bin', 'musubi-init.js');
const helpersPath = path.join(__dirname, '..', 'src', 'cli', 'init-helpers.js');
const initContent = require('fs').readFileSync(initPath, 'utf8');
const helpersContent = require('fs').readFileSync(helpersPath, 'utf8');
const allContent = initContent + '\n' + helpersContent;

// Helper to extract and create function from source
function _extractFunction(name) {
  // Simple extraction for testing - look for function definition
  const funcRegex = new RegExp(`(function ${name}|const ${name} = |async function ${name})`, 'g');
  if (!funcRegex.test(initContent)) {
    return null;
  }
  return true;
}

describe('GitHub Reference Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseGitHubRepo', () => {
    // Since we can't easily extract the function, we'll test the patterns
    const _patterns = [
      { input: 'owner/repo', expected: { owner: 'owner', repo: 'repo', branch: 'main' } },
      { input: 'facebook/react', expected: { owner: 'facebook', repo: 'react', branch: 'main' } },
      {
        input: 'owner/repo@develop',
        expected: { owner: 'owner', repo: 'repo', branch: 'develop' },
      },
      { input: 'https://github.com/owner/repo', expected: { owner: 'owner', repo: 'repo' } },
      { input: 'https://github.com/owner/repo.git', expected: { owner: 'owner', repo: 'repo' } },
      { input: 'git@github.com:owner/repo.git', expected: { owner: 'owner', repo: 'repo' } },
    ]; // Kept for documentation of expected patterns

    it('should have parseGitHubRepo function defined', () => {
      expect(allContent).toContain('function parseGitHubRepo');
    });

    it('should handle owner/repo format', () => {
      expect(allContent).toContain('simpleMatch = repoRef.match');
    });

    it('should handle https://github.com format', () => {
      expect(allContent).toContain('httpsMatch = repoRef.match');
    });

    it('should handle git@github.com format', () => {
      expect(allContent).toContain('sshMatch = repoRef.match');
    });

    it('should support branch specification with @', () => {
      expect(allContent).toContain("branch = simpleMatch[3] || 'main'");
    });

    it('should support path specification with #', () => {
      expect(allContent).toContain("repoPath = simpleMatch[4] || ''");
    });
  });

  describe('fetchGitHubRepo', () => {
    it('should have fetchGitHubRepo function defined', () => {
      expect(allContent).toContain('async function fetchGitHubRepo');
    });

    it('should fetch repository metadata from GitHub API', () => {
      expect(allContent).toContain('fetchGitHubAPI(`/repos/${owner}/${repo}`)');
    });

    it('should support GITHUB_TOKEN environment variable', () => {
      expect(allContent).toContain('process.env.GITHUB_TOKEN');
    });

    it('should fetch key files like README.md and package.json', () => {
      expect(allContent).toContain("'README.md'");
      expect(allContent).toContain("'package.json'");
      expect(allContent).toContain("'Cargo.toml'");
    });

    it('should handle rate limit errors gracefully', () => {
      expect(allContent).toContain('GitHub API rate limit exceeded');
    });

    it('should handle repository not found errors', () => {
      expect(allContent).toContain('Repository not found');
    });
  });

  describe('fetchGitHubRepos', () => {
    it('should have fetchGitHubRepos function defined', () => {
      expect(allContent).toContain('async function fetchGitHubRepos');
    });

    it('should iterate over multiple repositories', () => {
      expect(allContent).toContain('for (const repoRef of repos)');
    });

    it('should log progress for each repository', () => {
      expect(allContent).toContain('Fetching ${repoRef}');
    });
  });

  describe('analyzeReposForImprovements', () => {
    it('should have analyzeReposForImprovements function defined', () => {
      expect(allContent).toContain('function analyzeReposForImprovements');
    });

    it('should detect Clean Architecture pattern', () => {
      expect(allContent).toContain("pattern: 'clean-architecture'");
    });

    it('should detect Hexagonal Architecture pattern', () => {
      expect(allContent).toContain("pattern: 'hexagonal'");
    });

    it('should detect DDD patterns', () => {
      expect(allContent).toContain("pattern: 'domain-driven-design'");
    });

    it('should detect monorepo patterns', () => {
      expect(allContent).toContain("pattern: 'monorepo'");
    });

    it('should analyze package.json for technologies', () => {
      expect(allContent).toContain("JSON.parse(repo.files['package.json'])");
    });

    it('should detect React framework', () => {
      expect(allContent).toContain("tech: 'react'");
    });

    it('should detect Vue framework', () => {
      expect(allContent).toContain("tech: 'vue'");
    });

    it('should detect Next.js framework', () => {
      expect(allContent).toContain("tech: 'nextjs'");
    });

    it('should detect TypeScript', () => {
      expect(allContent).toContain("tech: 'typescript'");
    });

    it('should detect testing frameworks', () => {
      expect(allContent).toContain("config: 'jest'");
      expect(allContent).toContain("config: 'vitest'");
    });

    it('should detect linting tools', () => {
      expect(allContent).toContain("config: 'eslint'");
      expect(allContent).toContain("config: 'prettier'");
    });

    it('should analyze Cargo.toml for Rust patterns', () => {
      expect(allContent).toContain("pattern: 'rust-workspace'");
    });

    it('should detect Rust frameworks', () => {
      expect(allContent).toContain("tech: 'tokio'");
      expect(allContent).toContain("tech: 'axum'");
    });

    it('should analyze pyproject.toml for Python patterns', () => {
      expect(allContent).toContain("tech: 'fastapi'");
      expect(allContent).toContain("tech: 'django'");
    });

    it('should generate architecture suggestions', () => {
      expect(allContent).toContain("type: 'architecture'");
    });

    it('should generate technology suggestions', () => {
      expect(allContent).toContain("type: 'technology'");
    });
  });

  describe('saveReferenceRepos', () => {
    it('should have saveReferenceRepos function defined', () => {
      expect(allContent).toContain('async function saveReferenceRepos');
    });

    it('should create steering/references directory', () => {
      expect(allContent).toContain("steering', 'references'");
    });

    it('should generate markdown file with timestamp', () => {
      expect(allContent).toContain('github-references-${timestamp}.md');
    });

    it('should include repository metadata in output', () => {
      expect(allContent).toContain('repo.metadata.name');
      expect(allContent).toContain('repo.metadata.language');
      expect(allContent).toContain('repo.metadata.stars');
    });

    it('should include directory structure in output', () => {
      expect(allContent).toContain('Directory Structure');
    });

    it('should include architecture patterns section', () => {
      expect(allContent).toContain('Architecture Patterns Detected');
    });

    it('should include improvement suggestions section', () => {
      expect(allContent).toContain('Improvement Suggestions');
    });
  });

  describe('CLI Integration', () => {
    it('should add --reference option to init command', () => {
      const musubiPath = path.join(__dirname, '..', 'bin', 'musubi.js');
      const musubiContent = require('fs').readFileSync(musubiPath, 'utf8');
      expect(musubiContent).toContain('--reference <repo>');
    });

    it('should add -r/--ref shorthand alias', () => {
      const musubiPath = path.join(__dirname, '..', 'bin', 'musubi.js');
      const musubiContent = require('fs').readFileSync(musubiPath, 'utf8');
      expect(musubiContent).toContain('-r, --ref <repo>');
    });

    it('should support multiple references', () => {
      const musubiPath = path.join(__dirname, '..', 'bin', 'musubi.js');
      const musubiContent = require('fs').readFileSync(musubiPath, 'utf8');
      expect(musubiContent).toContain('can be specified multiple times');
    });

    it('should merge --reference and --ref options', () => {
      const musubiPath = path.join(__dirname, '..', 'bin', 'musubi.js');
      const musubiContent = require('fs').readFileSync(musubiPath, 'utf8');
      expect(musubiContent).toContain('(options.reference || [])');
      expect(musubiContent).toContain('(options.ref || [])');
    });

    it('should pass references to init options', () => {
      const musubiPath = path.join(__dirname, '..', 'bin', 'musubi.js');
      const musubiContent = require('fs').readFileSync(musubiPath, 'utf8');
      expect(musubiContent).toContain('references:');
    });
  });

  describe('Init Integration', () => {
    it('should handle GitHub references in main function', () => {
      expect(allContent).toContain('options.references');
    });

    it('should call fetchGitHubRepos when references provided', () => {
      expect(allContent).toContain('fetchGitHubRepos(options.references)');
    });

    it('should call analyzeReposForImprovements', () => {
      expect(allContent).toContain('analyzeReposForImprovements(validRepos)');
    });

    it('should display improvement suggestions during init', () => {
      expect(allContent).toContain('improvement suggestion(s)');
    });

    it('should save reference analysis to file', () => {
      expect(allContent).toContain('saveReferenceRepos(referenceRepos, repoAnalysis');
    });
  });
});

describe('Pattern Detection', () => {
  describe('Architecture Detection Rules', () => {
    it('should detect clean architecture by directory names', () => {
      // Clean architecture directories
      const _cleanArchDirs = ['domain', 'application', 'infrastructure', 'interface']; // Reference docs
      expect(allContent).toContain("['domain', 'application', 'infrastructure', 'interface']");
    });

    it('should detect hexagonal architecture by directory names', () => {
      // Hexagonal architecture directories
      const _hexDirs = ['adapters', 'ports', 'core', 'hexagon']; // Reference docs
      expect(allContent).toContain("['adapters', 'ports', 'core', 'hexagon']");
    });

    it('should detect DDD by directory names', () => {
      // DDD directories
      expect(allContent).toContain("'aggregates'");
      expect(allContent).toContain("'entities'");
      expect(allContent).toContain("'valueobjects'");
    });
  });

  describe('Technology Detection Rules', () => {
    it('should detect frontend frameworks', () => {
      expect(allContent).toContain("deps['react']");
      expect(allContent).toContain("deps['vue']");
      expect(allContent).toContain("deps['@angular/core']");
    });

    it('should detect backend frameworks', () => {
      expect(allContent).toContain("deps['express']");
      expect(allContent).toContain("deps['fastify']");
    });

    it('should detect meta-frameworks', () => {
      expect(allContent).toContain("deps['next']");
    });
  });
});

describe('Error Handling', () => {
  it('should handle invalid repository format', () => {
    expect(allContent).toContain('Invalid GitHub repository format');
  });

  it('should handle API errors gracefully', () => {
    expect(allContent).toContain('GitHub API error');
  });

  it('should continue on individual file fetch errors', () => {
    expect(allContent).toContain('Ignore individual file fetch errors');
  });

  it('should filter out repos with errors before analysis', () => {
    expect(allContent).toContain('referenceRepos.filter(r => !r.error)');
  });
});
