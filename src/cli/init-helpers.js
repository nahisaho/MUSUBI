/**
 * MUSUBI Initialization Helpers
 *
 * Helper functions for musubi-init.js
 * Extracted to reduce file size and improve maintainability
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * External specification reference handler
 * Supports: URL (http/https), local file path, Git repository
 * @param {string} specSource - Specification source (URL, file path, or git URL)
 * @returns {object} Parsed specification with metadata
 */
async function fetchExternalSpec(specSource) {
  const result = {
    source: specSource,
    type: 'unknown',
    content: null,
    metadata: {},
    error: null,
  };

  try {
    // Determine source type
    if (specSource.startsWith('http://') || specSource.startsWith('https://')) {
      result.type = 'url';
      const https = require('https');
      const http = require('http');
      const protocol = specSource.startsWith('https://') ? https : http;

      result.content = await new Promise((resolve, reject) => {
        protocol
          .get(specSource, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirect
              fetchExternalSpec(res.headers.location).then(r => resolve(r.content));
              return;
            }
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP ${res.statusCode}`));
              return;
            }
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => resolve(data));
          })
          .on('error', reject);
      });

      // Extract metadata from URL
      result.metadata.url = specSource;
      result.metadata.fetchedAt = new Date().toISOString();
    } else if (specSource.startsWith('git://') || specSource.includes('.git')) {
      result.type = 'git';
      result.metadata.repository = specSource;
      // For Git repos, we'll store the reference for later cloning
      result.content = `# External Specification Reference\n\nRepository: ${specSource}\n\n> Clone this repository to access the full specification.\n`;
    } else if (fs.existsSync(specSource)) {
      result.type = 'file';
      result.content = await fs.readFile(specSource, 'utf8');
      result.metadata.path = path.resolve(specSource);
      result.metadata.readAt = new Date().toISOString();
    } else {
      result.error = `Specification source not found: ${specSource}`;
    }

    // Try to parse specification format
    if (result.content) {
      result.metadata.format = detectSpecFormat(result.content, specSource);
      result.metadata.summary = extractSpecSummary(result.content);
    }
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

/**
 * Parse GitHub repository reference
 * Supports formats:
 * - owner/repo
 * - https://github.com/owner/repo
 * - git@github.com:owner/repo.git
 * @param {string} repoRef - Repository reference string
 * @returns {object} Parsed repository info
 */
function parseGitHubRepo(repoRef) {
  let owner = '';
  let repo = '';
  let branch = 'main';
  let repoPath = '';

  // Handle owner/repo format
  const simpleMatch = repoRef.match(/^([^/]+)\/([^/@#]+)(?:@([^#]+))?(?:#(.+))?$/);
  if (simpleMatch) {
    owner = simpleMatch[1];
    repo = simpleMatch[2];
    branch = simpleMatch[3] || 'main';
    repoPath = simpleMatch[4] || '';
    return { owner, repo, branch, path: repoPath, url: `https://github.com/${owner}/${repo}` };
  }

  // Handle https://github.com/owner/repo format
  const httpsMatch = repoRef.match(
    /github\.com\/([^/]+)\/([^/@#\s]+?)(?:\.git)?(?:@([^#]+))?(?:#(.+))?$/
  );
  if (httpsMatch) {
    owner = httpsMatch[1];
    repo = httpsMatch[2];
    branch = httpsMatch[3] || 'main';
    repoPath = httpsMatch[4] || '';
    return { owner, repo, branch, path: repoPath, url: `https://github.com/${owner}/${repo}` };
  }

  // Handle git@github.com:owner/repo.git format
  const sshMatch = repoRef.match(
    /git@github\.com:([^/]+)\/([^/.]+)(?:\.git)?(?:@([^#]+))?(?:#(.+))?$/
  );
  if (sshMatch) {
    owner = sshMatch[1];
    repo = sshMatch[2];
    branch = sshMatch[3] || 'main';
    repoPath = sshMatch[4] || '';
    return { owner, repo, branch, path: repoPath, url: `https://github.com/${owner}/${repo}` };
  }

  return { error: `Invalid GitHub repository format: ${repoRef}` };
}

/**
 * Fetch GitHub repository metadata and key files
 * @param {string} repoRef - Repository reference (owner/repo, URL, etc.)
 * @returns {object} Repository data with structure and key files
 */
async function fetchGitHubRepo(repoRef) {
  const parsed = parseGitHubRepo(repoRef);
  if (parsed.error) {
    return { source: repoRef, error: parsed.error };
  }

  const { owner, repo, branch, path: subPath } = parsed;
  const https = require('https');

  const result = {
    source: repoRef,
    owner,
    repo,
    branch,
    url: parsed.url,
    metadata: {},
    files: {},
    structure: [],
    improvements: [],
    error: null,
  };

  // Helper to fetch from GitHub API
  const fetchGitHubAPI = endpoint =>
    new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: endpoint,
        headers: {
          'User-Agent': 'MUSUBI-SDD',
          Accept: 'application/vnd.github.v3+json',
        },
      };

      // Add GitHub token if available
      if (process.env.GITHUB_TOKEN) {
        options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      https
        .get(options, res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                resolve(JSON.parse(data));
              } catch {
                reject(new Error('Invalid JSON response'));
              }
            } else if (res.statusCode === 404) {
              reject(new Error(`Repository not found: ${owner}/${repo}`));
            } else if (res.statusCode === 403) {
              reject(
                new Error('GitHub API rate limit exceeded. Set GITHUB_TOKEN environment variable.')
              );
            } else {
              reject(new Error(`GitHub API error: ${res.statusCode}`));
            }
          });
        })
        .on('error', reject);
    });

  // Fetch raw file content
  const fetchRawFile = filePath =>
    new Promise((resolve, reject) => {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      https
        .get(rawUrl, res => {
          if (res.statusCode === 302 || res.statusCode === 301) {
            https
              .get(res.headers.location, res2 => {
                let data = '';
                res2.on('data', chunk => (data += chunk));
                res2.on('end', () => resolve(data));
              })
              .on('error', reject);
            return;
          }
          if (res.statusCode !== 200) {
            resolve(null); // File not found is OK
            return;
          }
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => resolve(data));
        })
        .on('error', reject);
    });

  try {
    // Fetch repository metadata
    const repoData = await fetchGitHubAPI(`/repos/${owner}/${repo}`);
    result.metadata = {
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      stars: repoData.stargazers_count,
      topics: repoData.topics || [],
      license: repoData.license?.spdx_id,
      defaultBranch: repoData.default_branch,
      updatedAt: repoData.updated_at,
    };

    // Fetch directory structure (root level)
    const treePath = subPath
      ? `/repos/${owner}/${repo}/contents/${subPath}`
      : `/repos/${owner}/${repo}/contents`;
    try {
      const contents = await fetchGitHubAPI(treePath);
      if (Array.isArray(contents)) {
        result.structure = contents.map(item => ({
          name: item.name,
          type: item.type,
          path: item.path,
        }));
      }
    } catch {
      // Ignore structure fetch errors
    }

    // Fetch key files for analysis
    const keyFiles = [
      'README.md',
      'package.json',
      'Cargo.toml',
      'pyproject.toml',
      'go.mod',
      'pom.xml',
      '.github/CODEOWNERS',
      'ARCHITECTURE.md',
      'CONTRIBUTING.md',
      'docs/architecture.md',
      'src/lib.rs',
      'src/index.ts',
      'src/main.ts',
    ];

    for (const file of keyFiles) {
      const filePath = subPath ? `${subPath}/${file}` : file;
      try {
        const content = await fetchRawFile(filePath);
        if (content) {
          result.files[file] = content.slice(0, 10000); // Limit content size
        }
      } catch {
        // Ignore individual file fetch errors
      }
    }
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

/**
 * Fetch multiple GitHub repositories
 * @param {string[]} repos - Array of repository references
 * @returns {object[]} Array of repository data
 */
async function fetchGitHubRepos(repos) {
  const results = [];

  for (const repoRef of repos) {
    console.log(chalk.cyan(`  📦 Fetching ${repoRef}...`));
    const repoData = await fetchGitHubRepo(repoRef);

    if (repoData.error) {
      console.log(chalk.yellow(`    ⚠️ ${repoData.error}`));
    } else {
      console.log(
        chalk.green(
          `    ✓ ${repoData.metadata.name || repoData.repo} (${repoData.metadata.language || 'unknown'})`
        )
      );
      if (repoData.metadata.description) {
        console.log(chalk.gray(`      ${repoData.metadata.description.slice(0, 80)}`));
      }
    }

    results.push(repoData);
  }

  return results;
}

/**
 * Analyze repositories for improvement suggestions
 * @param {object[]} repos - Array of fetched repository data
 * @returns {object} Analysis results with patterns and suggestions
 */
function analyzeReposForImprovements(repos) {
  const analysis = {
    patterns: [],
    architectures: [],
    technologies: [],
    configurations: [],
    suggestions: [],
  };

  for (const repo of repos) {
    if (repo.error) continue;

    // Detect architecture patterns from structure
    const dirs = repo.structure.filter(s => s.type === 'dir').map(s => s.name);
    const files = repo.structure.filter(s => s.type === 'file').map(s => s.name);

    // Check for Clean Architecture
    if (dirs.some(d => ['domain', 'application', 'infrastructure', 'interface'].includes(d))) {
      analysis.architectures.push({
        repo: repo.repo,
        pattern: 'clean-architecture',
        evidence: dirs.filter(d =>
          ['domain', 'application', 'infrastructure', 'interface'].includes(d)
        ),
      });
    }

    // Check for Hexagonal Architecture
    if (dirs.some(d => ['adapters', 'ports', 'core', 'hexagon'].includes(d))) {
      analysis.architectures.push({
        repo: repo.repo,
        pattern: 'hexagonal',
        evidence: dirs.filter(d => ['adapters', 'ports', 'core', 'hexagon'].includes(d)),
      });
    }

    // Check for DDD patterns
    if (
      dirs.some(d =>
        ['aggregates', 'entities', 'valueobjects', 'repositories', 'services'].includes(
          d.toLowerCase()
        )
      )
    ) {
      analysis.patterns.push({
        repo: repo.repo,
        pattern: 'domain-driven-design',
        evidence: dirs,
      });
    }

    // Check for monorepo patterns
    if (
      dirs.includes('packages') ||
      dirs.includes('apps') ||
      files.includes('pnpm-workspace.yaml')
    ) {
      analysis.patterns.push({
        repo: repo.repo,
        pattern: 'monorepo',
        evidence: dirs.filter(d => ['packages', 'apps', 'libs'].includes(d)),
      });
    }

    // Analyze package.json for technologies
    if (repo.files['package.json']) {
      try {
        const pkg = JSON.parse(repo.files['package.json']);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        // Detect frameworks
        if (deps['react']) analysis.technologies.push({ repo: repo.repo, tech: 'react' });
        if (deps['vue']) analysis.technologies.push({ repo: repo.repo, tech: 'vue' });
        if (deps['@angular/core']) analysis.technologies.push({ repo: repo.repo, tech: 'angular' });
        if (deps['express']) analysis.technologies.push({ repo: repo.repo, tech: 'express' });
        if (deps['fastify']) analysis.technologies.push({ repo: repo.repo, tech: 'fastify' });
        if (deps['next']) analysis.technologies.push({ repo: repo.repo, tech: 'nextjs' });
        if (deps['typescript']) analysis.technologies.push({ repo: repo.repo, tech: 'typescript' });

        // Detect testing frameworks
        if (deps['jest']) analysis.configurations.push({ repo: repo.repo, config: 'jest' });
        if (deps['vitest']) analysis.configurations.push({ repo: repo.repo, config: 'vitest' });
        if (deps['mocha']) analysis.configurations.push({ repo: repo.repo, config: 'mocha' });

        // Detect linting/formatting
        if (deps['eslint']) analysis.configurations.push({ repo: repo.repo, config: 'eslint' });
        if (deps['prettier']) analysis.configurations.push({ repo: repo.repo, config: 'prettier' });
        if (deps['biome']) analysis.configurations.push({ repo: repo.repo, config: 'biome' });
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Analyze Cargo.toml for Rust patterns
    if (repo.files['Cargo.toml']) {
      const cargo = repo.files['Cargo.toml'];
      if (cargo.includes('[workspace]')) {
        analysis.patterns.push({ repo: repo.repo, pattern: 'rust-workspace' });
      }
      if (cargo.includes('tokio')) analysis.technologies.push({ repo: repo.repo, tech: 'tokio' });
      if (cargo.includes('actix')) analysis.technologies.push({ repo: repo.repo, tech: 'actix' });
      if (cargo.includes('axum')) analysis.technologies.push({ repo: repo.repo, tech: 'axum' });
    }

    // Analyze pyproject.toml for Python patterns
    if (repo.files['pyproject.toml']) {
      const pyproj = repo.files['pyproject.toml'];
      if (pyproj.includes('fastapi'))
        analysis.technologies.push({ repo: repo.repo, tech: 'fastapi' });
      if (pyproj.includes('django'))
        analysis.technologies.push({ repo: repo.repo, tech: 'django' });
      if (pyproj.includes('flask')) analysis.technologies.push({ repo: repo.repo, tech: 'flask' });
      if (pyproj.includes('pytest'))
        analysis.configurations.push({ repo: repo.repo, config: 'pytest' });
    }

    // Extract README insights
    if (repo.files['README.md']) {
      const readme = repo.files['README.md'];

      // Check for badges that indicate good practices
      if (readme.includes('coverage')) {
        analysis.suggestions.push({
          repo: repo.repo,
          suggestion: 'code-coverage',
          description: 'Implements code coverage tracking',
        });
      }
      if (readme.includes('CI/CD') || readme.includes('Actions')) {
        analysis.suggestions.push({
          repo: repo.repo,
          suggestion: 'ci-cd',
          description: 'Has CI/CD pipeline configured',
        });
      }
    }
  }

  // Generate improvement suggestions based on analysis
  if (analysis.architectures.length > 0) {
    const archCounts = {};
    for (const arch of analysis.architectures) {
      archCounts[arch.pattern] = (archCounts[arch.pattern] || 0) + 1;
    }
    const mostCommon = Object.entries(archCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostCommon) {
      analysis.suggestions.push({
        type: 'architecture',
        suggestion: `Consider using ${mostCommon[0]} pattern`,
        count: mostCommon[1],
        repos: analysis.architectures.filter(a => a.pattern === mostCommon[0]).map(a => a.repo),
      });
    }
  }

  if (analysis.technologies.length > 0) {
    const techCounts = {};
    for (const tech of analysis.technologies) {
      techCounts[tech.tech] = (techCounts[tech.tech] || 0) + 1;
    }
    const popular = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    for (const [tech, count] of popular) {
      analysis.suggestions.push({
        type: 'technology',
        suggestion: `Consider using ${tech}`,
        count,
        repos: analysis.technologies.filter(t => t.tech === tech).map(t => t.repo),
      });
    }
  }

  return analysis;
}

/**
 * Save reference repositories analysis to steering/references/
 * @param {object[]} repos - Fetched repository data
 * @param {object} analysis - Analysis results
 * @param {string} projectPath - Target project path
 * @returns {string} Created file path
 */
async function saveReferenceRepos(repos, analysis, projectPath) {
  const refsDir = path.join(projectPath, 'steering', 'references');
  await fs.ensureDir(refsDir);

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `github-references-${timestamp}.md`;

  // Build markdown content
  let content = `# GitHub Reference Repositories

> Analyzed on ${new Date().toISOString()}

## Referenced Repositories

`;

  for (const repo of repos) {
    if (repo.error) {
      content += `### ❌ ${repo.source}\n\n`;
      content += `Error: ${repo.error}\n\n`;
      continue;
    }

    content += `### ${repo.metadata.name || repo.repo}\n\n`;
    content += `- **URL**: ${repo.url}\n`;
    content += `- **Language**: ${repo.metadata.language || 'Unknown'}\n`;
    content += `- **Stars**: ${repo.metadata.stars || 0}\n`;
    if (repo.metadata.description) {
      content += `- **Description**: ${repo.metadata.description}\n`;
    }
    if (repo.metadata.topics && repo.metadata.topics.length > 0) {
      content += `- **Topics**: ${repo.metadata.topics.join(', ')}\n`;
    }
    if (repo.metadata.license) {
      content += `- **License**: ${repo.metadata.license}\n`;
    }
    content += '\n';

    // Structure
    if (repo.structure.length > 0) {
      content += '**Directory Structure:**\n\n';
      content += '```\n';
      for (const item of repo.structure.slice(0, 20)) {
        content += `${item.type === 'dir' ? '📁' : '📄'} ${item.name}\n`;
      }
      if (repo.structure.length > 20) {
        content += `... and ${repo.structure.length - 20} more items\n`;
      }
      content += '```\n\n';
    }
  }

  // Analysis section
  content += `## Analysis Results

### Architecture Patterns Detected

`;

  if (analysis.architectures.length > 0) {
    for (const arch of analysis.architectures) {
      content += `- **${arch.pattern}** in \`${arch.repo}\`\n`;
      content += `  - Evidence: ${arch.evidence.join(', ')}\n`;
    }
  } else {
    content += '_No specific architecture patterns detected_\n';
  }

  content += `\n### Design Patterns

`;

  if (analysis.patterns.length > 0) {
    for (const pattern of analysis.patterns) {
      content += `- **${pattern.pattern}** in \`${pattern.repo}\`\n`;
    }
  } else {
    content += '_No specific design patterns detected_\n';
  }

  content += `\n### Technologies Used

`;

  if (analysis.technologies.length > 0) {
    const techByRepo = {};
    for (const tech of analysis.technologies) {
      if (!techByRepo[tech.repo]) techByRepo[tech.repo] = [];
      techByRepo[tech.repo].push(tech.tech);
    }
    for (const [repoName, techs] of Object.entries(techByRepo)) {
      content += `- **${repoName}**: ${techs.join(', ')}\n`;
    }
  } else {
    content += '_No specific technologies detected_\n';
  }

  content += `\n### Configurations

`;

  if (analysis.configurations.length > 0) {
    const configByRepo = {};
    for (const config of analysis.configurations) {
      if (!configByRepo[config.repo]) configByRepo[config.repo] = [];
      configByRepo[config.repo].push(config.config);
    }
    for (const [repoName, configs] of Object.entries(configByRepo)) {
      content += `- **${repoName}**: ${configs.join(', ')}\n`;
    }
  } else {
    content += '_No specific configurations detected_\n';
  }

  content += `\n## Improvement Suggestions

Based on the referenced repositories, consider the following improvements:

`;

  if (analysis.suggestions.length > 0) {
    let i = 1;
    for (const suggestion of analysis.suggestions) {
      if (suggestion.type === 'architecture') {
        content += `${i}. **Architecture**: ${suggestion.suggestion}\n`;
        content += `   - Found in ${suggestion.count} repository(ies): ${suggestion.repos.join(', ')}\n\n`;
      } else if (suggestion.type === 'technology') {
        content += `${i}. **Technology**: ${suggestion.suggestion}\n`;
        content += `   - Used by ${suggestion.count} repository(ies): ${suggestion.repos.join(', ')}\n\n`;
      } else {
        content += `${i}. **${suggestion.suggestion}**: ${suggestion.description}\n`;
        content += `   - Found in: ${suggestion.repo}\n\n`;
      }
      i++;
    }
  } else {
    content += '_No specific suggestions generated_\n';
  }

  content += `
---
*Generated by MUSUBI SDD - GitHub Reference Analysis*
`;

  await fs.writeFile(path.join(refsDir, filename), content);
  return filename;
}

/**
 * Detect specification format from content and filename
 */
function detectSpecFormat(content, source) {
  const ext = path.extname(source).toLowerCase();
  if (ext === '.json') return 'json';
  if (ext === '.yaml' || ext === '.yml') return 'yaml';
  if (ext === '.md') return 'markdown';
  if (ext === '.rst') return 'rst';
  if (ext === '.html') return 'html';

  // Try to detect from content
  if (content.trim().startsWith('{')) return 'json';
  if (content.includes('openapi:') || content.includes('swagger:')) return 'openapi';
  if (content.includes('asyncapi:')) return 'asyncapi';
  if (content.includes('# ')) return 'markdown';

  return 'text';
}

/**
 * Extract summary from specification content
 */
function extractSpecSummary(content) {
  // Extract first heading and description
  const lines = content.split('\n').slice(0, 50);
  let title = '';
  let description = '';

  for (const line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else if (title && !description && line.trim() && !line.startsWith('#')) {
      description = line.trim().slice(0, 200);
      break;
    }
  }

  return { title, description };
}

/**
 * Save external specification reference to steering/specs/
 */
async function saveSpecReference(specResult, projectPath) {
  const specsDir = path.join(projectPath, 'steering', 'specs');
  await fs.ensureDir(specsDir);

  // Create spec reference file
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = specResult.metadata.summary?.title
    ? specResult.metadata.summary.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 50)
    : 'external-spec';
  const filename = `${safeName}-${timestamp}.md`;

  const refContent = `# External Specification Reference

## Source Information

- **Type**: ${specResult.type}
- **Source**: ${specResult.source}
- **Format**: ${specResult.metadata.format || 'unknown'}
- **Fetched**: ${specResult.metadata.fetchedAt || specResult.metadata.readAt || 'N/A'}

## Summary

${specResult.metadata.summary?.title ? `**Title**: ${specResult.metadata.summary.title}` : ''}
${specResult.metadata.summary?.description ? `\n**Description**: ${specResult.metadata.summary.description}` : ''}

## Integration Notes

This specification is used as a reference for:
- Requirements analysis
- Architecture design
- API design
- Compliance validation

## Original Content

\`\`\`${specResult.metadata.format || 'text'}
${specResult.content?.slice(0, 5000) || 'Content not available'}${specResult.content?.length > 5000 ? '\n\n... (truncated, see original source)' : ''}
\`\`\`

---
*Generated by MUSUBI SDD - External Specification Reference*
`;

  await fs.writeFile(path.join(specsDir, filename), refContent);
  return filename;
}

/**
 * Language recommendation engine
 * @param {object} requirements - User's answers about app types, performance, expertise
 * @returns {Array} Recommended languages with reasons
 */
function recommendLanguages(requirements) {
  const { appTypes, performanceNeeds, teamExpertise } = requirements;
  const scores = {};
  const reasons = {};

  // Initialize scores
  const allLangs = [
    'javascript',
    'python',
    'rust',
    'go',
    'java',
    'csharp',
    'cpp',
    'swift',
    'ruby',
    'php',
  ];
  for (const lang of allLangs) {
    scores[lang] = 0;
    reasons[lang] = [];
  }

  // Score by application type
  const appTypeScores = {
    'web-frontend': { javascript: 10, reason: 'Best ecosystem for web frontend' },
    'web-backend': {
      javascript: 6,
      python: 7,
      go: 8,
      rust: 7,
      java: 7,
      csharp: 6,
      ruby: 5,
      php: 5,
      reason: 'Strong backend frameworks',
    },
    cli: { rust: 9, go: 9, python: 6, reason: 'Fast startup, single binary' },
    desktop: { rust: 7, csharp: 8, cpp: 7, swift: 6, java: 6, reason: 'Native GUI support' },
    mobile: { swift: 9, java: 8, javascript: 6, reason: 'Mobile platform support' },
    data: { python: 10, rust: 6, reason: 'Rich data science ecosystem' },
    ml: { python: 10, rust: 5, cpp: 5, reason: 'ML/AI libraries and frameworks' },
    embedded: { rust: 10, cpp: 9, reason: 'Memory safety, no runtime' },
    game: { cpp: 9, csharp: 8, rust: 6, reason: 'Game engine support' },
    systems: { rust: 10, go: 8, cpp: 9, reason: 'Systems programming' },
  };

  for (const appType of appTypes || []) {
    const typeScores = appTypeScores[appType];
    if (typeScores) {
      for (const [lang, score] of Object.entries(typeScores)) {
        if (typeof score === 'number') {
          scores[lang] += score;
          if (!reasons[lang].includes(typeScores.reason)) {
            reasons[lang].push(typeScores.reason);
          }
        }
      }
    }
  }

  // Score by performance needs
  if (performanceNeeds === 'high') {
    scores.rust += 8;
    scores.go += 6;
    scores.cpp += 7;
    reasons.rust.push('High performance, zero-cost abstractions');
    reasons.go.push('Fast compilation, efficient runtime');
  } else if (performanceNeeds === 'rapid') {
    scores.python += 5;
    scores.javascript += 5;
    scores.ruby += 4;
    reasons.python.push('Rapid development, extensive libraries');
    reasons.javascript.push('Fast iteration, universal runtime');
  }

  // Boost by team expertise
  for (const lang of teamExpertise || []) {
    scores[lang] += 5;
    reasons[lang].push('Team has expertise');
  }

  // Sort and return top recommendations
  const sorted = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const langInfo = {
    javascript: { name: 'JavaScript/TypeScript', emoji: '🟨' },
    python: { name: 'Python', emoji: '🐍' },
    rust: { name: 'Rust', emoji: '🦀' },
    go: { name: 'Go', emoji: '🐹' },
    java: { name: 'Java/Kotlin', emoji: '☕' },
    csharp: { name: 'C#/.NET', emoji: '💜' },
    cpp: { name: 'C/C++', emoji: '⚙️' },
    swift: { name: 'Swift', emoji: '🍎' },
    ruby: { name: 'Ruby', emoji: '💎' },
    php: { name: 'PHP', emoji: '🐘' },
  };

  return sorted.map(([lang]) => ({
    value: lang,
    name: langInfo[lang].name,
    emoji: langInfo[lang].emoji,
    reason: reasons[lang].slice(0, 2).join('; ') || 'General purpose',
    score: scores[lang],
  }));
}

module.exports = {
  fetchExternalSpec,
  parseGitHubRepo,
  fetchGitHubRepo,
  fetchGitHubRepos,
  analyzeReposForImprovements,
  saveReferenceRepos,
  detectSpecFormat,
  extractSpecSummary,
  saveSpecReference,
  recommendLanguages,
};
