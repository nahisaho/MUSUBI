# Technology Stack

**Project**: musubi
**Last Updated**: 2025-12-31
**Version**: 6.2.0

---

## Languages

- JavaScript (Main)
- TypeScript (Type definitions)
- Markdown (Documentation)
- YAML (Configuration)
- JSON (Schemas)

## Frameworks

| Framework | Version | Purpose |
|-----------|---------|---------|
| Jest | ^29.0.0 | Testing |
| Commander.js | ^12.0.0 | CLI framework |
| AJV | ^8.12.0 | JSON Schema validation |
| ajv-formats | ^2.1.1 | Format validation |
| js-yaml | ^4.1.0 | YAML parsing |
| CodeGraph MCP | 0.8.0 | Code graph analysis |

## Tools

- **ESLint** (^8.50.0) - Linting
- **Prettier** (^3.0.0) - Formatting
- **CodeGraph MCP Server** - GraphRAG code analysis

## AI Agent Platforms (7 Supported)

| Platform | Prompt Extension | Notes |
|----------|------------------|-------|
| Claude Code | `.md` | Skills API support |
| GitHub Copilot | `.prompt.md` | VS Code official format |
| Cursor | `.md` | Commands directory |
| Gemini CLI | `.toml` | TOML format |
| Codex CLI | `.md` | Prompts directory |
| Qwen Code | `.md` | Commands directory |
| Windsurf | `.md` | Workflows directory |

## CodeGraph MCP v0.8.0 Features

- 14 MCP Tools (query, dependencies, callers, callees, etc.)
- 4 MCP Resources (entities, files, communities, stats)
- 6 MCP Prompts (code review, explain, implement, debug, refactor, test)
- File watching with auto re-indexing
- Community detection (Louvain algorithm)
- Global/Local GraphRAG search

## MUSUBI v6.2.0 Features

### Review Gate Engine (New in v6.2.0)

| Feature | Description |
|---------|-------------|
| **Requirements Gate** | EARS format, priority, acceptance criteria validation |
| **Design Gate** | C4 model, ADR, component design validation |
| **Implementation Gate** | Code quality, test coverage, naming convention validation |
| **Review Prompts** | `#sdd-review-requirements`, `#sdd-review-design`, etc. |

### Workflow Dashboard (New in v6.2.0)

| Feature | Description |
|---------|-------------|
| **Progress Visualization** | Real-time progress across 5 stages |
| **Blocker Management** | Add, resolve, and track blockers |
| **Transition Recording** | Record and analyze stage transitions |
| **Sprint Planning** | Task prioritization and velocity management |

### Traceability System (New in v6.2.0)

| Feature | Description |
|---------|-------------|
| **Auto-Extraction** | Automatic ID extraction from code/tests/commits |
| **Gap Detection** | Detect missing design/implementation/tests |
| **Matrix Storage** | YAML-based traceability matrix |

### Enterprise Features

| Feature | Description |
|---------|-------------|
| **Workflow Modes** | small (5 stages), medium (6 stages), large (8 stages) |
| **Monorepo Support** | packages.yml, PackageManager |
| **Constitution Levels** | critical (required), advisory (recommended), flexible |
| **Error Recovery** | Auto error analysis and remediation |
| **Rollback Manager** | File/commit/stage/sprint level rollback |
| **CI Reporter** | GitHub Actions integration |

### CLI Commands (25+)

- `musubi-init` - Project initialization
- `musubi-steering` - Steering management
- `musubi-requirements` - Requirements generation
- `musubi-design` - Design generation
- `musubi-tasks` - Task breakdown
- `musubi-validate` - Constitutional validation
- `musubi-workflow` - Workflow management
- `musubi-release` - Release management
- `musubi-config` - Configuration management
- `musubi-dashboard` - Workflow dashboard (v6.2.0)
- ... (and 15 more)

### Built-in Skills (31 Agents)

- `review-gate-engine` - Review gate validation (v6.2.0)
- `workflow-dashboard` - Progress visualization (v6.2.0)
- `traceability-manager` - Auto-extraction and gap detection (v6.2.0)
- `release-manager` - Release management skill
- `workflow-mode-manager` - Workflow mode management
- `package-manager` - Monorepo package management
- `constitution-level-manager` - Constitution level management
- `project-config-manager` - Project configuration management

---

*Updated: 2025-12-31 - MUSUBI v6.2.0*
