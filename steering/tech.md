# Technology Stack

**Project**: musubi
**Last Updated**: 2025-12-24
**Version**: 5.9.6

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

## MUSUBI v5.9.6 Features

### Enterprise Features (Phase 1-4)

| Feature | Description |
|---------|-------------|
| **Workflow Modes** | small (5 stages), medium (6 stages), large (8 stages) |
| **Monorepo Support** | packages.yml, PackageManager |
| **Constitution Levels** | critical (required), advisory (recommended), flexible |
| **project.yml v2.0** | JSON Schema validation, migration support |

### CLI Commands (24)

- `musubi-init` - Project initialization
- `musubi-steering` - Steering management
- `musubi-requirements` - Requirements generation
- `musubi-design` - Design generation
- `musubi-tasks` - Task breakdown
- `musubi-validate` - Constitutional validation
- `musubi-workflow` - Workflow management
- `musubi-release` - Release management
- `musubi-config` - Configuration management
- ... (and 15 more)

### Built-in Skills

- `release-manager` - Release management skill
- `workflow-mode-manager` - Workflow mode management
- `package-manager` - Monorepo package management
- `constitution-level-manager` - Constitution level management
- `project-config-manager` - Project configuration management

---

*Updated: 2025-12-24 - MUSUBI v5.9.6*
