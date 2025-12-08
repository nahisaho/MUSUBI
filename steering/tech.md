# Technology Stack

**Project**: MUSUBI (結び)
**Last Updated**: 2025-12-08
**Version**: 3.0.0

---

## Overview

This document defines the technology stack for MUSUBI - the Ultimate Specification Driven Development (SDD) Tool. MUSUBI is a Node.js CLI application supporting 7 AI coding platforms.

---

## Primary Technologies

### Programming Languages

| Language   | Version | Usage                        | Notes                     |
| ---------- | ------- | ---------------------------- | ------------------------- |
| JavaScript | ES2022+ | Primary application language | Node.js runtime           |
| Markdown   | -       | Documentation, prompts       | Skills, agents, docs      |
| YAML       | 1.2     | Configuration files          | project.yml               |
| TOML       | 1.0     | Gemini CLI commands          | Platform-specific format  |

### Runtime Environment

- **Node.js**: 18.0.0+ (LTS)
- **Package Manager**: npm 9.0+

---

## Core Dependencies

### CLI Framework

| Technology | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| Commander  | 11.0+   | CLI argument parsing   |
| Inquirer   | 9.0+    | Interactive prompts    |
| Chalk      | 4.1+    | Terminal styling       |

### File System & Processing

| Technology | Version | Purpose                   |
| ---------- | ------- | ------------------------- |
| fs-extra   | 11.3+   | Enhanced file operations  |
| glob       | 10.5+   | File pattern matching     |
| gray-matter | 4.0+   | Frontmatter parsing       |
| js-yaml    | 4.1+    | YAML parsing/generation   |
| chokidar   | 3.5+    | File watching             |

### Web Server (GUI)

| Technology | Version | Purpose               |
| ---------- | ------- | --------------------- |
| Express    | 4.18+   | HTTP server           |
| cors       | 2.8+    | CORS middleware       |
| ws         | 8.14+   | WebSocket support     |

### Integrations

| Technology    | Version | Purpose                |
| ------------- | ------- | ---------------------- |
| @octokit/rest | 22.0+   | GitHub API integration |
| Playwright    | 1.40+   | Browser automation     |
| open          | 10.1+   | Open URLs in browser   |

---

## Development Tools

### Testing

| Technology | Version | Purpose           |
| ---------- | ------- | ----------------- |
| Jest       | 29.0+   | Test framework    |
| Coverage   | -       | Code coverage     |

### Code Quality

| Tool     | Version | Purpose                       |
| -------- | ------- | ----------------------------- |
| ESLint   | 8.50+   | JavaScript linting            |
| Prettier | 3.0+    | Code formatting               |

**ESLint Configuration** (eslint.config.js):
- Uses eslint-config-prettier for format compatibility

### Scripts (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint bin/ src/ tests/",
    "lint:fix": "eslint bin/ src/ tests/ --fix",
    "format": "prettier --write bin/ src/ tests/",
    "format:check": "prettier --check 'bin/**/*.js' 'src/**/*.js' 'tests/**/*.js'"
  }
}
```

---

## Supported AI Platforms

### Platform Configurations

| Platform       | Command Prefix | Format     | Directory              |
| -------------- | -------------- | ---------- | ---------------------- |
| Claude Code    | `/sdd-*`       | Markdown   | `.claude/skills/`      |
| GitHub Copilot | `#sdd-*`       | Markdown   | `.github/prompts/`     |
| Cursor IDE     | `/sdd-*`       | Markdown   | `.cursor/commands/`    |
| Gemini CLI     | `/sdd-*`       | TOML       | `.gemini/commands/`    |
| Codex CLI      | `/prompts:*`   | Markdown   | `.codex/prompts/`      |
| Qwen Code      | `/sdd-*`       | Markdown   | `.qwen/commands/`      |
| Windsurf IDE   | `/sdd-*`       | Markdown   | `.windsurf/workflows/` |

### Skills/Agents API Support

| Platform       | Skills API | AGENTS.md | Notes                      |
| -------------- | ---------- | --------- | -------------------------- |
| Claude Code    | ✅ 25 skills | ✅       | Skills API + AGENTS.md     |
| GitHub Copilot | ❌         | ✅ 25 agents | Official AGENTS.md support |
| Cursor IDE     | ❌         | ✅ 25 agents | Official AGENTS.md support |
| Gemini CLI     | ❌         | ✅ GEMINI.md | GEMINI.md integration      |
| Codex CLI      | ❌         | ✅ 25 agents | AGENTS.md compatible       |
| Qwen Code      | ❌         | ✅ 25 agents | AGENTS.md compatible       |
| Windsurf IDE   | ❌         | ✅ 25 agents | AGENTS.md compatible       |

---

## MCP Integration (v2.0.0+)

### CodeGraphMCPServer

MUSUBI integrates with CodeGraphMCPServer for enhanced code analysis:

| Feature            | Description                      |
| ------------------ | -------------------------------- |
| 14 MCP Tools       | Graph query, code retrieval      |
| 4 MCP Resources    | Entities, files, communities     |
| 6 MCP Prompts      | Code review, feature impl        |
| GraphRAG           | Semantic code search             |
| 12 Languages       | Python, TS, JS, Rust, Go, etc.   |

### Configuration

```json
{
  "mcp.servers": {
    "codegraph": {
      "command": "codegraph-mcp",
      "args": ["serve", "--repo", "${workspaceFolder}"]
    }
  }
}
```

---

## CI/CD

### GitHub Actions

MUSUBI uses GitHub Actions for CI/CD:

| Workflow | Purpose                    |
| -------- | -------------------------- |
| ci.yml   | Tests, linting, coverage   |

### npm Publishing

```bash
# Publish to npm
npm publish
```

---

## Distribution

### npm Package

- **Package Name**: `musubi-sdd`
- **Registry**: npmjs.com
- **Entry Point**: `bin/musubi.js`

### Binary Commands

All 19 CLI commands are registered in package.json:

```json
{
  "bin": {
    "musubi-sdd": "bin/musubi.js",
    "musubi": "bin/musubi.js",
    "musubi-init": "bin/musubi-init.js",
    "musubi-requirements": "bin/musubi-requirements.js",
    ...
  }
}
```

---

## Constitutional Compliance (Article VIII)

### Anti-Abstraction Policy

MUSUBI uses framework APIs directly without custom wrappers:

### ✅ Allowed

```javascript
// Direct Commander usage
const { program } = require('commander');
program
  .name('musubi')
  .version('3.0.0')
  .parse();

// Direct fs-extra usage
const fs = require('fs-extra');
await fs.ensureDir(path);
await fs.writeJson(file, data);
```

### ❌ Prohibited

```javascript
// ❌ Custom CLI wrapper
class MyCLI {
  parse() { ... }  // Wrapping Commander
}

// ❌ Custom file wrapper
class MyFS {
  async write() { ... }  // Wrapping fs-extra
}
```

---

## Version Policy

### Semantic Versioning

MUSUBI follows semver:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Current Version: 3.0.0

Key milestones:
- v0.8.x: Core SDD features
- v0.9.x: Traceability enhancements
- v2.0.0: MCP integration
- v2.1.0: Workflow engine
- v3.0.0: Multi-agent architecture

---

**Last Updated**: 2025-12-08
**Maintained By**: MUSUBI Contributors
