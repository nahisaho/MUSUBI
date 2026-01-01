# Project Structure

**Project**: musubi
**Last Updated**: 2026-01-02
**Version**: 6.3.0

---

## Architecture Overview

```
musubi/
├── bin/                    # CLI entry points (24 commands)
├── src/
│   ├── agents/             # AI agents (browser, agentic, function-tool)
│   ├── ai/                 # Advanced AI integration
│   ├── analyzers/          # Code analysis (AST, complexity, security)
│   ├── converters/         # Spec format conversion (OpenAPI, SpecKit)
│   ├── enterprise/         # Enterprise features (multi-tenant)
│   ├── generators/         # Document generation (design, requirements, tasks)
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
│   ├── reporters/          # Report generation
│   ├── resolvers/          # Issue resolution
│   ├── steering/           # Steering file management
│   ├── templates/          # Agent templates (7 platforms)
│   │   └── agents/         # Claude Code, Copilot, Cursor, etc.
│   └── validators/         # Constitution & validation
├── steering/               # Project steering files
├── docs/                   # Documentation
├── tests/                  # Test suite (4,827+ tests)
└── packages/               # Sub-packages (VSCode extension)
```

## Supported AI Agent Platforms (7)

| Platform | Directory | Command Format | Prompt Extension |
|----------|-----------|----------------|------------------|
| **Claude Code** | `.claude/` | `/sdd-*` | `.md` |
| **GitHub Copilot** | `.github/prompts/` | `#sdd-*` | `.prompt.md` |
| **Cursor** | `.cursor/commands/` | `/sdd-*` | `.md` |
| **Gemini CLI** | `.gemini/commands/` | `/sdd-*` | `.toml` |
| **Codex CLI** | `.codex/prompts/` | `/prompts:sdd-*` | `.md` |
| **Qwen Code** | `.qwen/commands/` | `/sdd-*` | `.md` |
| **Windsurf** | `.windsurf/workflows/` | `/sdd-*` | `.md` |

## SDD Document Storage (v6.3.0)

```
storage/
├── specs/                # Requirements only
│   ├── auth-requirements.md
│   └── payment-requirements.md
├── design/               # Design documents only
│   ├── auth-design.md
│   └── payment-design.md
├── tasks/                # Tasks only
│   ├── auth-tasks.md
│   └── payment-tasks.md
├── changes/              # Delta specifications (brownfield)
│   ├── add-2fa.md
│   └── upgrade-jwt.md
├── features/             # Feature tracking
│   ├── auth.json
│   └── payment.json
└── validation/           # Validation reports
    ├── auth-validation-report.md
    └── payment-validation-report.md
```

### Path Rules

| Document Type | Storage Path | Naming Pattern |
|---------------|--------------|----------------|
| Requirements | `storage/specs/` | `{feature}-requirements.md` |
| Design | `storage/design/` | `{feature}-design.md` |
| Tasks | `storage/tasks/` | `{feature}-tasks.md` |
| Validation | `storage/validation/` | `{feature}-validation-report.md` |
| Changes | `storage/changes/` | `{change-name}.md` |

## Core Components (v6.3.0)

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
| ConstitutionalValidator | `src/validators/constitutional-validator.js` | 9 Articles enforcement |

### Generators

| Generator | File | Purpose | Output Path |
|-----------|------|---------|-------------|
| RequirementsGenerator | `src/generators/requirements.js` | EARS requirements | `storage/specs/` |
| DesignGenerator | `src/generators/design.js` | C4 + ADR design | `storage/design/` |
| TaskGenerator | `src/generators/tasks.js` | Task breakdown | `storage/tasks/` |

---

## Changelog

### 2026-01-02 (v6.3.0)
- SDD document path unification complete
- Requirements → `storage/specs/`
- Design documents → `storage/design/`
- Tasks → `storage/tasks/`
- All agent templates updated (7 platforms)
- Unit tests: 4,827 passing
- Integration tests: 660 passing

### 2026-01-01 (v6.2.0)
- Review Gate Engine
- Workflow Dashboard
- Traceability System

### 2025-12-12 (v5.9.0)
- Phase 1: Workflow modes (small/medium/large)
- Phase 2: Monorepo support (packages.yml)
- Phase 3: Constitution levels (critical/advisory/flexible)
- Phase 4: project.yml v2.0 schema validation

---

**Last Updated**: 2026-01-02
**Maintained By**: MUSUBI Team