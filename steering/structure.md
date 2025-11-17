# Project Structure

## Overview
This document defines the architectural patterns, directory organization, and code structure conventions for this project. It serves as the single source of truth for structural decisions.

**Last Updated**: 2025-01-16 by @steering

## Organization Philosophy

**CLI-First Template Distribution System** - MUSUBI is a command-line tool that distributes SDD framework templates to multiple AI coding agent platforms through a centralized template management system.

**Core Architectural Approach**:
- **Template-based distribution**: Single source of truth in `src/templates/`
- **Agent registry pattern**: Centralized agent definitions with metadata
- **Format polymorphism**: Supports Markdown (6 agents) and TOML (1 agent)
- **Bilingual documentation**: English (`.md`) primary, Japanese (`.ja.md`) translation
- **Shared governance**: All agents use same `steering/` and `constitution/` files

## Directory Structure

### Root Level
**Purpose**: CLI tool with templates for 7 AI coding agents

```
musubi/
├── bin/                          # CLI entry points
│   ├── musubi.js                 # Main CLI (musubi, musubi-sdd)
│   └── musubi-init.js            # Interactive project initialization
├── src/                          # Source code
│   ├── agents/
│   │   └── registry.js           # Agent definitions (7 agents)
│   └── templates/                # Template source (copied to user projects)
│       ├── agents/               # Agent-specific templates
│       │   ├── claude-code/      # Skills API + Commands (Markdown)
│       │   ├── github-copilot/   # Commands (Markdown)
│       │   ├── cursor/           # Commands (Markdown)
│       │   ├── gemini-cli/       # Commands (TOML)
│       │   ├── codex/            # Commands (Markdown)
│       │   ├── qwen-code/        # Commands (Markdown)
│       │   └── windsurf/         # Commands (Markdown)
│       └── shared/               # Shared templates (all agents)
│           ├── constitution/     # 9 Constitutional Articles
│           ├── steering/         # Project memory templates
│           └── documents/        # Document templates
├── steering/                     # MUSUBI's own project memory
│   ├── structure.md              # This file
│   ├── tech.md                   # Technology stack
│   ├── product.md                # Product context
│   ├── rules/                    # Governance rules
│   └── templates/                # Document templates
├── docs/                         # Documentation
│   ├── Qiita/                    # Japanese article
│   ├── requirements/             # MUSUBI requirements
│   └── analysis/                 # Framework analysis
├── orchestrator/                 # Multi-agent coordination reports
├── References/                   # Source framework references
└── tests/                        # Test suite
```

### CLI Architecture
MUSUBI uses a command-based CLI architecture with dynamic agent selection:

```
bin/musubi.js
  ├── init command      → bin/musubi-init.js (interactive setup)
  ├── status command    → Shows project status
  ├── validate command  → Quick constitutional checks
  └── info command      → Version and agent information
```

### Template Distribution Pattern
When user runs `npx musubi-sdd init --claude`:

```
1. Detect agent from flags (src/agents/registry.js)
2. Copy templates from src/templates/agents/claude-code/
3. Copy shared templates from src/templates/shared/
4. Generate agent-specific guide (CLAUDE.md)
5. Install to user project:
   - .claude/skills/      (25 skills for Claude Code)
   - .claude/commands/    (9 commands)
   - steering/            (project memory)
   - templates/           (document templates)
   - storage/             (specs, changes, features)
```

## Naming Conventions

### Files and Directories
- **CLI executables**: `musubi.js`, `musubi-init.js` (kebab-case)
- **Source files**: `registry.js` (kebab-case)
- **Templates**: `sdd-*.md` for Markdown commands, `sdd-*.toml` for Gemini CLI
- **Agent directories**: `claude-code/`, `github-copilot/`, `cursor/` (kebab-case)
- **Skills**: `orchestrator/`, `requirements-analyst/` (kebab-case)
- **Documentation**: English `.md` first, Japanese `.ja.md` translation

### Command Naming (User-Facing)
- **Slash commands**: `/sdd-steering`, `/sdd-requirements` (Cursor, Windsurf, Claude Code, Gemini, Qwen)
- **Hash commands**: `#sdd-steering` (GitHub Copilot only)
- **Namespace commands**: `/prompts:sdd-steering` (Codex CLI only)

### Code Elements
- **Functions**: camelCase (`getAgentDefinition`, `detectAgentFromFlags`)
- **Constants**: camelCase for objects (`agentDefinitions`)
- **Classes**: PascalCase (not used in this project)
- **Environment variables**: UPPERCASE (`NODE_ENV`, `npm_package_version`)

## Import Organization

### Module System
MUSUBI uses **CommonJS** with dynamic ESM imports for compatibility:
```javascript
// CommonJS (default)
const { Command } = require('commander');
const chalk = require('chalk');

// Dynamic ESM import (for inquirer v9)
const inquirer = await import('inquirer');
await inquirer.default.prompt([...]);
```

### Import Order (in source files)
1. Node.js built-ins (`fs`, `path`)
2. External dependencies (`commander`, `chalk`, `fs-extra`)
3. Internal modules (`src/agents/registry`)

### Package.json Patterns
- **bin entries**: `{ "musubi-sdd": "bin/musubi.js", "musubi": "bin/musubi.js" }`
- **main**: `src/index.js` (not currently used, for future library API)
- **files**: Whitelist pattern `["bin/", "src/", "README.md", "LICENSE"]`

## Architectural Patterns

### Key Architectural Decisions

1. **CLI-First Distribution Model**
   - **Context**: Need to support 7 different AI agents with minimal user friction
   - **Decision**: Use npm-distributed CLI tool with `npx` support
   - **Consequences**: 
     - ✅ Easy installation (`npx musubi-sdd init`)
     - ✅ Version management through npm
     - ⚠️ Requires Node.js >=18.0.0

2. **Template-Based Architecture**
   - **Context**: Need consistent SDD framework across all agents
   - **Decision**: Single source of truth in `src/templates/`, copied to user projects
   - **Consequences**:
     - ✅ Easy to maintain (update once, affects all installations)
     - ✅ Users can customize after installation
     - ⚠️ Updates require re-running `musubi init`

3. **CommonJS with Dynamic ESM Imports**
   - **Context**: inquirer v9 is pure ESM, but CLI needs CommonJS for compatibility
   - **Decision**: Use CommonJS with dynamic `import()` for ESM dependencies
   - **Consequences**:
     - ✅ Compatible with older Node.js versions
     - ✅ Gradual migration path
     - ⚠️ Requires careful module loading (`inquirer.default.prompt()`)

4. **Agent Registry Pattern**
   - **Context**: Need to support multiple agents with different configurations
   - **Decision**: Centralized `registry.js` with agent metadata
   - **Consequences**:
     - ✅ Single source of truth for agent definitions
     - ✅ Easy to add new agents
     - ✅ Dynamic CLI flag generation

5. **Markdown + TOML Format Support**
   - **Context**: Gemini CLI requires TOML format, others use Markdown
   - **Decision**: Maintain parallel templates (`.md` and `.toml`)
   - **Consequences**:
     - ✅ Native format for each agent
     - ⚠️ Need to maintain 2 formats (6 agents Markdown, 1 agent TOML)

### Core Principles
1. **Template Distribution**: Single source → multiple agent targets
2. **Format Polymorphism**: Markdown default, TOML for specific agents
3. **Agent Agnostic**: MUSUBI doesn't depend on any specific AI agent
4. **Constitutional Governance**: 9 immutable articles enforced across all agents

## File Size Guidelines

- **CLI files**: bin/musubi.js (400+ lines - acceptable for CLI with multiple commands)
- **Registry file**: src/agents/registry.js (200-300 lines - agent definitions)
- **Template files**: sdd-*.md (300-500 lines - comprehensive prompts)
- **Skills**: Varies by complexity (orchestrator > simple validators)

MUSUBI prioritizes **completeness** over strict line limits for:
- CLI command implementations (need full help text, validation)
- Agent prompts (need detailed instructions, examples)
- Constitutional articles (need complete governance rules)

## Code Organization Best Practices

1. **Agent Registry**: Centralized agent definitions in `src/agents/registry.js`
   - All 7 agent configurations
   - Dynamic flag generation
   - Layout and command metadata

2. **Template Organization**: Templates mirror user project structure
   - `src/templates/agents/{agent}/` - Agent-specific files
   - `src/templates/shared/` - Common files (all agents)
   - Format variations: Markdown (default), TOML (Gemini CLI)

3. **CLI Command Pattern**: Each command in separate section of bin/musubi.js
   - init → delegates to bin/musubi-init.js
   - status → checks project state
   - validate → quick constitutional compliance
   - info → version and agent information

4. **Documentation Strategy**: Bilingual from day one
   - English `.md` (primary, reference version)
   - Japanese `.ja.md` (translation)
   - Always update English first, then Japanese

5. **Template Customization**: Users can modify after installation
   - Templates copied to user project (not symlinked)
   - Users own their copies
   - Updates require re-running `musubi init`

## Testing Structure

```
tests/
├── cli.test.js             # CLI command tests
└── (future: registry.test.js, template.test.js)
```

### Test Coverage Requirements (Constitutional Article III)
- **Target**: 80% coverage
- **Critical paths**: CLI commands, agent detection, template copying
- **Test-First**: Red-Green-Blue cycle enforced

### Test Strategy
- **Unit tests**: registry.js functions (agent detection, flag parsing)
- **Integration tests**: Full `musubi init` workflow
- **Snapshot tests**: Template content validation (future)

## Documentation

- **README.md**: Project overview, quick start, agent support matrix
- **README.ja.md**: Japanese translation
- **CLAUDE.md**: Claude Code specific guide (in templates)
- **AGENTS.md**: Generic agent guide (for non-Claude agents)
- **GEMINI.md / QWEN.md**: Agent-specific guides (in templates)
- **docs/Qiita/**: Japanese article about MUSUBI evolution
- **docs/analysis/**: Framework comparison and design decisions
- **steering/**: Project memory (structure, tech, product)

### Documentation Principles
1. **Bilingual First**: English primary, Japanese translation
2. **Agent-Specific**: Tailored guides for each agent
3. **Version in npm**: README and LICENSE included in package
4. **Comprehensive Examples**: All CLI commands documented with examples

---

**Note**: This document describes MUSUBI's actual architecture - a CLI tool that distributes SDD templates to 7 AI coding agents. Update this file when making architectural changes (e.g., adding new agents, changing template structure).

**Last Updated**: 2025-01-16 by @steering
