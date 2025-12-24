# Project Structure

**Project**: musubi
**Last Updated**: 2025-12-24
**Version**: 5.9.6

---

## Architecture Overview

```
musubi/
├── bin/                    # CLI entry points (24 commands)
├── src/
│   ├── agents/             # AI agents (browser, agentic, function-tool)
│   ├── ai/                 # Advanced AI integration
│   ├── analyzers/          # Code analysis (AST, complexity, security)
│   ├── converters/         # Spec format converters (OpenAPI, SpecKit)
│   ├── enterprise/         # Enterprise features (multi-tenant)
│   ├── generators/         # Document generators (design, requirements, tasks)
│   ├── gui/                # Web GUI server
│   ├── integrations/       # External integrations (CI/CD, MCP, GitHub)
│   ├── llm-providers/      # LLM providers (Anthropic, OpenAI, Ollama, Copilot)
│   ├── managers/           # Core managers (workflow, package, checkpoint)
│   ├── monitoring/         # Monitoring (cost, incident, observability)
│   ├── orchestration/      # Multi-agent orchestration
│   │   ├── patterns/       # Orchestration patterns (swarm, triage, handoff)
│   │   ├── reasoning/      # Reasoning engine
│   │   ├── replanning/     # Adaptive replanning
│   │   └── guardrails/     # Safety guardrails
│   ├── performance/        # Performance optimization
│   ├── reporters/          # Report generators
│   ├── resolvers/          # Issue resolvers
│   ├── steering/           # Steering file management
│   ├── templates/          # Agent templates (7 platforms)
│   │   └── agents/         # Claude Code, Copilot, Cursor, etc.
│   └── validators/         # Constitution & validation
├── steering/               # Project steering files
├── docs/                   # Documentation
├── tests/                  # Test suite (4,408 tests)
└── packages/               # Subpackages (VSCode extension)
```

## Supported AI Agent Platforms (7)

| Platform | Directory | Command Format | Prompt Extension |
|----------|-----------|----------------|------------------|
| **Claude Code** | `.claude/` | `/sdd-*` | `.md` |
| **GitHub Copilot** | `.github/prompts/` | `/sdd-*` | `.prompt.md` |
| **Cursor** | `.cursor/commands/` | `/sdd-*` | `.md` |
| **Gemini CLI** | `.gemini/commands/` | `/sdd-*` | `.toml` |
| **Codex CLI** | `.codex/prompts/` | `/prompts:sdd-*` | `.md` |
| **Qwen Code** | `.qwen/commands/` | `/sdd-*` | `.md` |
| **Windsurf** | `.windsurf/workflows/` | `/sdd-*` | `.md` |

### GitHub Copilot Prompt Files

GitHub Copilot uses `.prompt.md` extension per official VS Code documentation:

```
.github/
├── prompts/
│   ├── sdd-steering.prompt.md
│   ├── sdd-requirements.prompt.md
│   ├── sdd-design.prompt.md
│   ├── sdd-tasks.prompt.md
│   ├── sdd-implement.prompt.md
│   ├── sdd-validate.prompt.md
│   ├── sdd-change-init.prompt.md
│   ├── sdd-change-apply.prompt.md
│   └── sdd-change-archive.prompt.md
└── AGENTS.md
```

## Major Components (v5.9.6)

### Managers

| Manager | File | Purpose |
|---------|------|---------|
| WorkflowModeManager | `src/managers/workflow-mode-manager.js` | small/medium/large workflow modes |
| PackageManager | `src/managers/package-manager.js` | Monorepo package management |
| CheckpointManager | `src/managers/checkpoint-manager.js` | Development checkpoints |
| AgentMemory | `src/managers/agent-memory.js` | Agent memory persistence |

### Validators

| Validator | File | Purpose |
|-----------|------|---------|
| ConstitutionLevelManager | `src/validators/constitution-level-manager.js` | critical/advisory/flexible levels |
| ProjectValidator | `src/validators/project-validator.js` | project.yml v2.0 schema validation |
| ConstitutionalValidator | `src/validators/constitutional-validator.js` | 9-article enforcement |

### Orchestration

| Component | File | Purpose |
|-----------|------|---------|
| BuiltinSkills | `src/orchestration/builtin-skills.js` | 5 built-in skills |
| SkillRegistry | `src/orchestration/skill-registry.js` | Skill registration & discovery |
| WorkflowOrchestrator | `src/orchestration/workflow-orchestrator.js` | Workflow execution |

---

## Architecture Layers

### Layer Dependency Rules

```
┌─────────────────────────────────────────┐
│        Interface / Presentation         │ ← Entry points
├─────────────────────────────────────────┤
│        Application / Use Cases          │ ← Orchestration
├─────────────────────────────────────────┤
│        Infrastructure / Adapters        │ ← I/O & External
├─────────────────────────────────────────┤
│            Domain / Core                │ ← Pure business logic
└─────────────────────────────────────────┘

Dependency direction: ↓ (outer → inner)
Domain layer has no dependencies
```

## Changelog

### 2025-12-24 (v5.9.6)
- GitHub Copilot prompt files renamed to `.prompt.md` extension
- 7 AI agent platforms supported

### 2025-12-12 (v5.9.0)
- Phase 1: Workflow modes (small/medium/large)
- Phase 2: Monorepo support (packages.yml)
- Phase 3: Constitution levels (critical/advisory/flexible)
- Phase 4: project.yml v2.0 schema validation
- New CLI: musubi-release, musubi-config
- 5 built-in orchestrator skills
- 4,408 tests passing