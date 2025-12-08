# Project Structure

**Project**: MUSUBI (結び)
**Last Updated**: 2025-12-08
**Version**: 3.0.0

---

## Architecture Pattern

**Primary Pattern**: Modular CLI Application with Multi-Agent Architecture

> MUSUBI is a specification-driven development (SDD) framework that uses a modular architecture
> with specialized agents/skills. It follows a CLI-first design with separate modules for
> generators, validators, analyzers, managers, and converters. The system supports 7 AI coding
> platforms through a unified agent registry pattern.

---

## Codebase Statistics (CodeGraph Analysis)

| Metric | Value |
|--------|-------|
| Total Entities | 12,094 |
| Total Relations | 74,338 |
| Files Indexed | 2,154 |
| Classes | 1,062 |
| Functions | 4,330 |
| Interfaces | 540 |
| Methods | 4,109 |
| Modules | 2,052 |
| Communities | 140 |

---

## Directory Organization

### Root Structure

```
musubi/
├── bin/                  # CLI entry points (19 commands)
│   ├── musubi.js         # Main CLI entry point
│   ├── musubi-init.js    # Project initialization
│   ├── musubi-onboard.js # Existing project onboarding
│   ├── musubi-requirements.js  # EARS requirements generator
│   ├── musubi-design.js  # C4/ADR design generator
│   ├── musubi-tasks.js   # Task breakdown
│   ├── musubi-validate.js # Constitutional validation
│   ├── musubi-trace.js   # Traceability management
│   ├── musubi-gaps.js    # Gap detection
│   ├── musubi-change.js  # Change management
│   ├── musubi-workflow.js # Workflow engine
│   ├── musubi-analyze.js # Code analysis
│   ├── musubi-sync.js    # Steering sync
│   ├── musubi-share.js   # Memory sharing
│   ├── musubi-remember.js # Memory management
│   ├── musubi-resolve.js # Issue resolution
│   ├── musubi-convert.js # Format conversion
│   ├── musubi-browser.js # Browser automation
│   └── musubi-gui.js     # GUI server
├── src/                  # Core source modules
│   ├── agents/           # Agent registry & browser automation
│   ├── generators/       # Document generators (requirements, design, tasks)
│   ├── validators/       # Constitution & critic system
│   ├── analyzers/        # Gap, security, stuck, traceability analysis
│   ├── managers/         # Skill loading, workflow, memory, changes
│   ├── resolvers/        # Issue resolution
│   ├── converters/       # Format conversion (IR, parsers, writers)
│   ├── integrations/     # External integrations (GitHub)
│   ├── gui/              # Web GUI server
│   └── templates/        # Document templates
├── tests/                # Test suites (mirrors src/ structure)
├── docs/                 # Documentation
│   ├── guides/           # User guides & tutorials
│   ├── design/           # Design documents
│   ├── requirements/     # Requirements documents
│   ├── analysis/         # Framework analysis
│   ├── plans/            # Project plans
│   ├── Qiita/            # Qiita articles
│   └── DevTo/            # Dev.to articles
├── storage/              # SDD artifacts
│   ├── specs/            # Requirements, design, tasks
│   ├── changes/          # Delta specifications (brownfield)
│   └── features/         # Feature specifications
├── steering/             # Project memory (this directory)
│   ├── structure.md      # This file
│   ├── tech.md           # Technology stack
│   ├── product.md        # Product context
│   ├── rules/            # Constitutional governance
│   ├── memories/         # Agent memories
│   └── templates/        # Steering templates
├── templates/            # Installable templates for platforms
├── packages/             # Sub-packages
│   └── vscode-extension/ # VS Code extension
└── References/           # Reference implementations
    └── OpenHands/        # OpenHands microagent reference
```

---

## Core Module Architecture

### Agent System (src/agents/)

The agent system manages multi-platform support and skill registration.

```
src/agents/
├── registry.js           # Agent definitions for 7 platforms
│                         # - claude-code (Skills API)
│                         # - github-copilot (AGENTS.md)
│                         # - cursor (AGENTS.md)
│                         # - gemini-cli (TOML + GEMINI.md)
│                         # - codex-cli (AGENTS.md)
│                         # - qwen-code (AGENTS.md)
│                         # - windsurf (AGENTS.md)
└── browser/              # Browser automation for web-based agents
```

### Generators (src/generators/)

Document generation following EARS format and C4 model.

```
src/generators/
├── requirements.js       # EARS requirements generator (5 patterns)
├── design.js             # C4 model + ADR generator
└── tasks.js              # Task breakdown generator
```

### Validators (src/validators/)

Constitutional governance and quality enforcement.

```
src/validators/
├── constitution.js       # 9 Constitutional Articles validation
└── critic-system.js      # Code review and critique system
```

### Analyzers (src/analyzers/)

Code analysis and gap detection.

```
src/analyzers/
├── gap-detector.js       # Orphaned requirements/untested code
├── security-analyzer.js  # Security vulnerability scanning
├── stuck-detector.js     # Development blockage detection
└── traceability.js       # Req→Design→Code→Test mapping
```

### Managers (src/managers/)

State management and workflow orchestration.

```
src/managers/
├── agent-memory.js       # Agent context memory
├── change.js             # Delta specification management
├── memory-condenser.js   # Memory optimization
├── repo-skill-manager.js # Repository-level skill management
├── skill-loader.js       # Keyword-triggered skill loading
└── workflow.js           # 9-stage workflow engine
```

### Converters (src/converters/)

Format conversion between platforms.

```
src/converters/
├── index.js              # Converter orchestration
├── ir/                   # Intermediate representation
├── parsers/              # Input format parsers
└── writers/              # Output format writers
```

### Resolvers (src/resolvers/)

Issue and conflict resolution.

```
src/resolvers/
└── issue-resolver.js     # Automated issue resolution
```

### Integrations (src/integrations/)

External service integrations.

```
src/integrations/
└── github-client.js      # GitHub API integration
```

### GUI (src/gui/)

Web-based graphical interface.

```
src/gui/
├── server.js             # Express server
├── public/               # Static assets
└── services/             # GUI backend services
```

---

## CLI Commands (bin/)

MUSUBI provides 19 CLI commands:

| Command | Purpose |
|---------|---------|
| `musubi` | Main CLI entry point |
| `musubi-init` | Initialize new project |
| `musubi-onboard` | Onboard existing project |
| `musubi-requirements` | Generate EARS requirements |
| `musubi-design` | Generate C4/ADR design |
| `musubi-tasks` | Task breakdown |
| `musubi-validate` | Constitutional validation |
| `musubi-trace` | Traceability management |
| `musubi-gaps` | Gap detection |
| `musubi-change` | Change management |
| `musubi-workflow` | Workflow engine |
| `musubi-analyze` | Code analysis |
| `musubi-sync` | Steering synchronization |
| `musubi-share` | Memory sharing |
| `musubi-remember` | Memory management |
| `musubi-resolve` | Issue resolution |
| `musubi-convert` | Format conversion |
| `musubi-browser` | Browser automation |
| `musubi-gui` | GUI server |

---

## Test Organization

### Test Structure

```
tests/
├── cli.test.js           # CLI integration tests
├── init-platforms.test.js # Platform initialization tests
├── registry.test.js      # Agent registry tests
├── agents/               # Agent module tests
├── generators/           # Generator tests
├── validators/           # Validator tests
├── analyzers/            # Analyzer tests
├── managers/             # Manager tests
├── resolvers/            # Resolver tests
├── converters/           # Converter tests
├── gui/                  # GUI tests
└── test-output/          # Test artifacts
```

### Test Guidelines

- **Test-First**: Tests written BEFORE implementation (Article III)
- **Coverage**: Minimum 80% coverage required
- **Naming**: `*.test.js` for all test files
- **Jest**: Using Jest as test framework

---

## Documentation Organization

### Documentation Structure

```
docs/
├── guides/               # User guides and tutorials
│   ├── brownfield-tutorial.md
│   ├── delta-spec-guide.md
│   ├── change-management-workflow.md
│   └── traceability-matrix-guide.md
├── design/               # Design documents
│   └── P1-roadmap.md
├── requirements/         # Requirements documents
├── analysis/             # Framework analysis
│   ├── SDD-Framework-Analysis-Summary.md
│   ├── SKILLS-AUDIT-REPORT.md
│   └── SKILLS-GAP-ANALYSIS.md
├── plans/                # Project plans
├── Qiita/                # Qiita articles (Japanese)
├── DevTo/                # Dev.to articles (English)
└── assets/               # Demo assets and media
```

---

## Platform-Specific Installations

MUSUBI installs different structures based on the target AI platform:

### Claude Code
```
.claude/
├── skills/               # 25 Skills API skills
│   ├── sdd-requirements.md
│   ├── sdd-design.md
│   └── ...
├── commands/             # Command definitions
└── AGENTS.md             # Agent definitions
```

### GitHub Copilot
```
.github/
├── prompts/              # Prompt templates
│   ├── sdd-requirements.prompt.md
│   └── ...
└── AGENTS.md             # 25 agent definitions
```

### Cursor IDE
```
.cursor/
├── commands/             # Command definitions
└── AGENTS.md             # 25 agent definitions
```

### Gemini CLI
```
.gemini/
├── commands/             # TOML format commands
└── GEMINI.md             # Agent definitions
```

---

## Steering Directory (Project Memory)

```
steering/
├── structure.md          # This file - architecture patterns
├── tech.md               # Technology stack
├── product.md            # Product context
├── structure.ja.md       # Japanese version
├── tech.ja.md            # Japanese version
├── product.ja.md         # Japanese version
├── project.yml           # Project configuration
├── rules/                # Constitutional governance
│   ├── constitution.md   # 9 Constitutional Articles
│   ├── phase-gates.md    # Phase -1 Gates
│   └── workflow.md       # 8-Stage SDD Workflow
├── memories/             # Agent memories
└── templates/            # Steering templates
```

---

## SDD Artifacts Organization

### Storage Directory

```
storage/
├── specs/                # Specifications
│   ├── requirements/     # EARS format requirements
│   ├── design/           # C4 model + ADR designs
│   └── tasks/            # Task breakdowns
├── changes/              # Delta specifications (brownfield)
└── features/             # Feature tracking
```

### Traceability

All artifacts maintain bidirectional traceability:

```
REQ-AUTH-001 → DES-AUTH-001 → TASK-AUTH-001 → TEST-AUTH-001
     ↓              ↓              ↓              ↓
Requirements  →  Design    →   Tasks      →    Tests
```
```

---

## Naming Conventions

### File Naming

- **JavaScript**: `kebab-case.js` for modules (e.g., `skill-loader.js`)
- **Tests**: `*.test.js`
- **CLI Commands**: `musubi-*.js` (e.g., `musubi-init.js`)

### Directory Naming

- **Modules**: `kebab-case` (e.g., `skill-loader/`)
- **Features**: `kebab-case` (e.g., `agents/`, `generators/`)

### Variable Naming

- **Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Classes**: `PascalCase`

---

## Version Control

### Branch Organization

- `main` - Production branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `docs/*` - Documentation branches

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Dependencies Graph

Key module dependencies (from CodeGraph analysis):

```
bin/musubi.js
  └── src/agents/registry.js
        └── (Platform configurations)

bin/musubi-requirements.js
  └── src/generators/requirements.js
        └── (EARS pattern generation)

bin/musubi-validate.js
  └── src/validators/constitution.js
        └── (9 Articles validation)
  └── src/validators/critic-system.js
        └── (Code review)

bin/musubi-workflow.js
  └── src/managers/workflow.js
        └── (9-stage workflow)

bin/musubi-gaps.js
  └── src/analyzers/gap-detector.js
        └── src/analyzers/traceability.js
              └── (Req→Design→Code→Test mapping)
```

---

## Constitutional Compliance

This structure enforces:

- **Article I**: Library-first pattern - Core modules in `src/`
- **Article II**: CLI interfaces - All 19 commands in `bin/`
- **Article III**: Test structure - Tests in `tests/` with 80% coverage
- **Article IV**: EARS format - Requirements via `musubi-requirements`
- **Article V**: Traceability - Via `musubi-trace` and `src/analyzers/traceability.js`
- **Article VI**: Project memory - Steering files in `steering/`
- **Article VII**: Simplicity Gate - Single deployable package
- **Article VIII**: Anti-Abstraction - Direct framework usage
- **Article IX**: Integration-First - Jest test framework

---

**Last Updated**: 2025-12-08
**Maintained By**: MUSUBI Contributors
**CodeGraph Index**: 12,094 entities, 74,338 relations, 2,154 files
