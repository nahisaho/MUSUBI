# MUSUBI - Technology Stack and Development Tools

**Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Planning Phase

---

## Overview

MUSUBI is built on a **lightweight, markdown-based technology stack** centered around the Claude Code Skills API. The architecture prioritizes simplicity, portability, and zero vendor lock-in while supporting comprehensive Specification Driven Development workflows.

---

## Primary Technology Stack

### Core Platform

**Claude Code Skills API**
- **Version**: Latest (as of 2025-11-16)
- **Purpose**: Primary platform for skill definitions and orchestration
- **Format**: Markdown files with YAML frontmatter
- **Invocation**: Model-invoked (automatic skill selection) + user-invoked (slash commands)
- **Allowed Tools**: Read, Write, Bash, Glob, Grep, TodoWrite
- **Skill Location**: `.claude/skills/[skill-name]/SKILL.md`
- **Command Location**: `.claude/commands/sdd-*.md`

**Rationale**: Native integration with Claude Code, zero external dependencies, portable across AI assistants

### Specification and Documentation Format

**Markdown**
- **Version**: CommonMark + GFM (GitHub Flavored Markdown)
- **Purpose**: All specifications, designs, documentation
- **Extensions Used**:
  - Tables (for traceability matrices, coverage reports)
  - Task lists (for implementation plans)
  - Code blocks with syntax highlighting
  - YAML frontmatter (for metadata)
- **Linting**: markdownlint (strict mode)

**EARS Format** (Easy Approach to Requirements Syntax)
- **Purpose**: Structured requirements notation
- **Patterns**:
  - Event-driven: `WHEN [event], the [system] SHALL [response]`
  - State-driven: `WHILE [state], the [system] SHALL [response]`
  - Unwanted behavior: `IF [error], THEN the [system] SHALL [response]`
  - Optional features: `WHERE [feature enabled], the [system] SHALL [response]`
  - Ubiquitous: `The [system] SHALL [requirement]`
- **Validation**: `validators/ears-format.py`

**Rationale**: Human-readable, version-controllable, tool-independent, universal compatibility

### Configuration Format

**YAML**
- **Version**: YAML 1.2
- **Purpose**: Skill frontmatter, configuration files, CI/CD pipelines
- **Usage**:
  - Skill definitions (name, description, trigger terms, allowed-tools)
  - GitHub Actions workflows
  - Template metadata
- **Linting**: yamllint

**Rationale**: Human-readable, widely supported, clean syntax for structured data

---

## Development Tools

### Primary Language for Validators

**Python 3.11+**
- **Purpose**: Validation scripts, CLI tool (optional)
- **Package Manager**: uv (preferred) or Poetry
- **Linting**: Ruff (fast, comprehensive)
- **Formatting**: Black (PEP 8 compliance)
- **Type Checking**: mypy (strict mode)
- **Testing Framework**: pytest
- **Code Coverage**: pytest-cov (target: ≥80%)

**Key Libraries**:
- `pyyaml`: YAML parsing
- `click` or `typer`: CLI framework (if CLI tool is built)
- `jsonschema`: JSON/YAML schema validation
- `pytest`: Testing framework

**Rationale**: Universal language, rich ecosystem, excellent tooling for validation and CLI

### Version Control

**Git + GitHub**
- **Version**: Git 2.40+
- **Hosting**: GitHub.com (open source)
- **Branching Strategy**:
  - `main`: Protected, production-ready
  - `feature/[feature-id]`: Feature development
  - `change/[change-id]`: Brownfield changes
  - `release/v[x.y.z]`: Release preparation
- **Commit Convention**: Conventional Commits 1.0.0
  - `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- **Hooks**: pre-commit (runs validators)

**GitHub Features Used**:
- Issues: Bug tracking, feature requests
- Pull Requests: Code review, constitutional validation
- Discussions: Community Q&A, RFCs
- Actions: CI/CD pipelines
- Releases: Versioned releases with changelogs
- GitHub Pages: Documentation hosting

**Rationale**: Industry standard, excellent collaboration features, free for open source

### Integrated Development Environment

**VS Code**
- **Version**: 1.80+
- **Required Extensions**:
  - Claude Code (Anthropic): Primary AI assistant
  - markdownlint: Markdown linting
  - YAML: YAML syntax support
  - Python: Python development
  - GitLens: Git history visualization
- **Optional Extensions**:
  - Prettier: Code formatting
  - Error Lens: Inline error display

**Alternative IDEs** (with Claude Code support):
- JetBrains IDEs (IntelliJ, PyCharm): Via Claude Code plugin
- Cursor: Built-in Claude integration
- Zed: Experimental support

**Rationale**: Claude Code's primary platform, extensible, free, cross-platform

---

## Frameworks and Standards

### Claude Code Skills API Standards

**YAML Frontmatter Structure**:
```yaml
---
name: [skill-name]                    # Lowercase with hyphens
description: |                        # Max 1024 characters
  [Brief description]
  [10-20 trigger terms for AI discovery]
  [Key capabilities]
  [Use cases]
allowed-tools: [Read, Write, Bash]   # Restrict capabilities
---
```

**Trigger Terms Best Practices**:
- Include 10-20 relevant keywords
- Cover domain vocabulary (e.g., "API, REST, GraphQL, OpenAPI")
- Include action verbs (e.g., "design, create, generate, validate")
- Reference deliverable types (e.g., "specification, architecture, diagram")

**Tool Restrictions by Skill Type**:
| Skill Type | Allowed Tools |
|-----------|---------------|
| Read-only (reviewers, auditors) | [Read, Glob, Grep] |
| Design (architects, designers) | [Read, Write, Glob] |
| Development (developers, testers) | [Read, Write, Bash, Glob, Grep] |
| Orchestration | [Read, Write, Bash, Glob, Grep, TodoWrite] |

### Constitutional Governance Framework

**9 Constitutional Articles** (immutable):
1. Library-First Principle
2. CLI Interface Mandate
3. Test-First Imperative
4. EARS Requirements Format
5. Traceability Mandate
6. Project Memory
7. Simplicity Gate
8. Anti-Abstraction Gate
9. Integration-First Testing

**Phase -1 Gates** (pre-implementation validation):
- Simplicity Gate: ≤3 projects, no future-proofing
- Anti-Abstraction Gate: No unnecessary wrappers
- Integration-First Gate: Real services, no mocks
- EARS Compliance Gate: All requirements use EARS patterns
- Traceability Gate: 100% requirement coverage
- Steering Alignment Gate: Consistency with project memory

**Enforcement**: `constitution-enforcer` skill + `validators/constitutional.py`

### Multi-Agent Orchestration Patterns

**Based on AG2 (AutoGen v2)**:
1. **Auto-Selection**: Analyze intent → Select skills → Execute
2. **Sequential**: Linear workflow (Research → Requirements → Design → ...)
3. **Parallel**: P-labeled tasks execute simultaneously
4. **Nested Delegation**: Sub-orchestrators for complex domains
5. **Human-in-the-Loop**: Validation gates requiring user approval

**Skill Dependency Management**:
- Defined in `orchestration/dependency-chains.md`
- Example: `requirements-analyst` → `system-architect` → `software-developer`
- Parallel execution: `api-designer` || `database-schema-designer` || `ui-ux-designer`

---

## Infrastructure and DevOps

### CI/CD Platform

**GitHub Actions**
- **Purpose**: Automated testing, validation, deployment
- **Workflows**:
  - `ci.yml`: Linting, unit tests, EARS validation (on PR)
  - `integration.yml`: Integration tests, traceability checks (on merge)
  - `release.yml`: Documentation build, GitHub Release (on tag)
- **Runners**: ubuntu-latest (free tier)
- **Secrets Management**: GitHub Secrets (API keys, deploy tokens)

**Pipeline Stages**:
```
PR Created:
  → Linting (Ruff, markdownlint, yamllint)
  → Unit Tests (pytest, coverage ≥80%)
  → EARS Format Validation (validators/ears-format.py)
  → Constitutional Validation (validators/constitutional.py)
  → Traceability Check (validators/traceability.py)

PR Merged to main:
  → Integration Tests (Bash scripts)
  → Documentation Build (MkDocs/Docusaurus)
  → Coverage Report (upload to Codecov)

Tag Created (v*.*.* :
  → Build Release Package
  → Generate Changelog (conventional commits)
  → Create GitHub Release
  → Deploy Documentation (GitHub Pages)
```

**No External CI/CD**: GitHub Actions only (free for open source)

### Documentation Platform

**Options** (to be decided in Phase 1):

**Option A: MkDocs**
- **Theme**: Material for MkDocs
- **Plugins**: search, tags, git-revision-date
- **Hosting**: GitHub Pages
- **Build Command**: `mkdocs build`
- **Pros**: Python-native, Markdown-based, excellent search
- **Cons**: Limited customization vs. static site generators

**Option B: Docusaurus**
- **Version**: 3.0+
- **Framework**: React
- **Hosting**: GitHub Pages or Vercel
- **Build Command**: `npm run build`
- **Pros**: Feature-rich, versioning, i18n support
- **Cons**: Node.js dependency, more complex setup

**Decision Criteria**: Team familiarity, feature requirements, maintenance overhead

**Content Structure**:
```
docs/
├── index.md                      # Landing page
├── getting-started.md            # Quick start guide
├── user-guide/
│   ├── workflow.md               # 8-stage SDD workflow
│   ├── constitutional-governance.md
│   └── change-management.md      # Delta specs
├── skill-reference/              # 25 skills
│   ├── orchestrator.md
│   ├── requirements-analyst.md
│   └── ...
├── examples/
│   ├── greenfield-project.md
│   └── brownfield-change.md
└── api/
    ├── ears-format.md
    └── validator-api.md
```

### Hosting (Staging/Demo)

**Documentation**: GitHub Pages (free, automatic deployment)
**Demo Instances** (optional): Railway or Render (free tier)
**Monitoring**: Simple uptime checks (UptimeRobot free tier)

**No Production Hosting**: Self-hosted tool, users run locally

---

## MCP Servers Integration

### Available MCP Servers

**Context7 MCP**
- **Provider**: Context7.ai
- **Purpose**: Up-to-date library documentation
- **Tools**:
  - `mcp__context7__resolve-library-id`: Resolve library name to Context7 ID
  - `mcp__context7__get-library-docs`: Fetch latest documentation
- **Usage**: api-designer, software-developer, technical-writer skills
- **Example**:
  ```
  mcp__context7__get-library-docs("/vercel/next.js", topic="api routes", tokens=5000)
  → Returns: Latest Next.js API route patterns
  ```

**IDE MCP**
- **Provider**: VS Code
- **Purpose**: Diagnostics, code execution
- **Tools**:
  - `mcp__ide__getDiagnostics`: Get TypeScript/linter errors
  - `mcp__ide__executeCode`: Execute Python code in Jupyter kernel
- **Usage**: site-reliability-engineer, ai-ml-engineer, test-engineer skills
- **Example**:
  ```
  mcp__ide__getDiagnostics()
  → Returns: List of VS Code diagnostics (errors, warnings)
  ```

### Future MCP Servers (Optional)

**Microsoft Learn MCP**
- **Purpose**: Microsoft documentation (Azure, .NET, etc.)
- **Skills**: technical-writer, cloud-architect

**Azure MCP**
- **Purpose**: Azure resource management
- **Skills**: cloud-architect, devops-engineer

**GitHub MCP**
- **Purpose**: Repository operations (issues, PRs, workflows)
- **Skills**: devops-engineer, software-developer

**No Dedicated MCP Management Skill**: Skills invoke MCP tools directly (see MCP-MANAGEMENT-ANALYSIS.md for rationale)

---

## Testing and Quality Assurance

### Testing Stack

**Python Validators** (validators/):
- **Framework**: pytest 7.0+
- **Coverage**: pytest-cov (target: ≥80%)
- **Fixtures**: conftest.py for shared test setup
- **Mocking**: unittest.mock for external dependencies

**Validation Scripts**:
| Script | Purpose | Invocation |
|--------|---------|------------|
| `ears-format.py` | EARS syntax validation | `python validators/ears-format.py [file]` |
| `constitutional.py` | Phase -1 Gates enforcement | `python validators/constitutional.py` |
| `coverage.py` | Requirements coverage analysis | `python validators/coverage.py` |
| `traceability.py` | Traceability matrix validation | `python validators/traceability.py` |
| `delta-format.py` | Delta spec validation | `python validators/delta-format.py [file]` |
| `consistency.py` | Cross-artifact consistency | `python validators/consistency.py` |

**Integration Tests** (Bash scripts):
- End-to-end workflow tests (Research → Monitoring)
- Skill invocation tests (orchestrator selection logic)
- Change management workflow tests (init → apply → archive)

### Code Quality Tools

**Linting**:
- **Python**: Ruff (replaces flake8, isort, Black)
  - Config: `pyproject.toml`
  - Rules: Enable all rules except E501 (line length)
- **Markdown**: markdownlint
  - Config: `.markdownlint.json`
  - Rules: Strict mode (no trailing spaces, consistent headings)
- **YAML**: yamllint
  - Config: `.yamllint`
  - Rules: Consistent indentation, no trailing spaces

**Formatting**:
- **Python**: Black (PEP 8)
  - Line length: 100 characters
  - Config: `pyproject.toml`
- **Markdown**: Prettier (optional)
  - Config: `.prettierrc`

**Type Checking**:
- **Python**: mypy (strict mode)
  - Config: `pyproject.toml`
  - Strict flags: `--strict`, `--warn-unused-ignores`

### Quality Gates

**Pre-Commit Hooks** (via pre-commit framework):
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: ruff
        name: Ruff linting
        entry: ruff check
        language: system
        types: [python]
      - id: markdownlint
        name: Markdown linting
        entry: markdownlint
        language: node
        types: [markdown]
      - id: ears-validation
        name: EARS format validation
        entry: python validators/ears-format.py
        language: system
        types: [markdown]
```

**CI Quality Gates** (must pass before merge):
- All linters pass (exit code 0)
- All unit tests pass
- Code coverage ≥80%
- EARS format validation passes
- Constitutional validation passes
- No critical security vulnerabilities (via Dependabot)

---

## Technical Constraints

### Platform Dependencies

**Required**:
- Python 3.11+ (for validators, CLI)
- Git 2.40+ (version control)
- Claude Code (primary AI assistant)
- VS Code 1.80+ (recommended IDE)

**Optional**:
- Node.js 18+ (if using Docusaurus for docs)
- Docker (for reproducible development environments)

### Performance Requirements

**Skill Invocation**:
- Skill selection: <2 seconds (orchestrator analysis)
- EARS validation: <1 second per 100 requirements
- Traceability check: <5 seconds for 1000-line codebase

**Validation Scripts**:
- Constitutional validation: <3 seconds
- Coverage analysis: <5 seconds
- Delta spec validation: <2 seconds

**Documentation Build**:
- MkDocs: <10 seconds for full site build
- Docusaurus: <30 seconds for full site build

### Storage Requirements

**Project Repository**:
- Typical project: <100 MB (specifications, designs, tasks)
- Large project: <500 MB (including example implementations)
- No binary files (Markdown and code only)

**Documentation Site**:
- Static assets: <50 MB
- Hosted on GitHub Pages (1 GB limit, 100 GB bandwidth/month)

---

## Security Considerations

### No Secrets in Version Control

**Policy**: Never commit secrets, API keys, or credentials
**Enforcement**:
- `.gitignore` includes common secret patterns
- Pre-commit hook scans for secrets (optional: git-secrets)
- GitHub Secret Scanning enabled

**Acceptable in Git**:
- Public configuration (YAML, Markdown)
- Template files (no actual credentials)
- Example data (synthetic, non-sensitive)

### MCP Server Security

**Trust Model**: MCP servers are trusted (Context7, IDE)
**Data Sensitivity**: No sensitive data passed to MCP servers
**API Keys**: Stored in IDE settings, not in project files

### Dependency Security

**Python Dependencies**:
- Pinned versions in `requirements.txt` or `pyproject.toml`
- Dependabot enabled (automated security updates)
- Regular security audits (GitHub Security Advisories)

**Node.js Dependencies** (if using Docusaurus):
- Pinned versions in `package-lock.json`
- npm audit run in CI/CD
- Dependabot enabled

---

## Technology Evolution Strategy

### Adding New Technologies

**Criteria for Adoption**:
1. Solves a specific gap (not redundant)
2. Widely adopted (not experimental)
3. Actively maintained (not abandoned)
4. Compatible with existing stack (no conflicts)
5. Approved via ADR (Architecture Decision Record)

**Process**:
1. Propose in GitHub Discussion
2. Write ADR (steering/rules/adr-NNN-[title].md)
3. Prototype in feature branch
4. Review with team (approval required)
5. Update steering/tech.md (this file)
6. Integrate into CI/CD

### Deprecating Technologies

**Criteria for Deprecation**:
1. No longer maintained (security risk)
2. Better alternative available
3. Causing technical debt
4. Incompatible with future roadmap

**Process**:
1. Announce deprecation (3-month notice)
2. Provide migration path (documentation + automation)
3. Update steering/tech.md (mark as deprecated)
4. Remove from CI/CD (after migration period)
5. Archive historical ADR

---

## Technology Decision Records

### TDR-001: Claude Code Skills API as Primary Platform

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Need to choose platform for skill definitions and orchestration.

**Decision**: Use Claude Code Skills API with Markdown + YAML.

**Rationale**:
- Native integration with Claude Code (primary AI assistant)
- Portable across AI assistants (Markdown is universal)
- Zero external dependencies (no databases, APIs)
- Human-readable specifications (version-controllable)

**Alternatives Considered**:
- Python framework (AG2): More complex, less portable
- Proprietary IDE plugins: Vendor lock-in
- Custom DSL: Steeper learning curve

**Consequences**:
- Positive: Simple, portable, maintainable
- Negative: Limited to text-based specifications (acceptable for SDD)

### TDR-002: Python 3.11+ for Validators

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Need scripting language for validation and CLI.

**Decision**: Use Python 3.11+ with modern tooling (uv, Ruff, pytest).

**Rationale**:
- Universal language (most developers know Python)
- Rich ecosystem for validation (jsonschema, pytest)
- Excellent CLI frameworks (Click, Typer)
- Fast tooling (Ruff, uv)

**Alternatives Considered**:
- TypeScript/Node.js: Less suitable for CLI, more complex setup
- Bash: Insufficient for complex validation logic
- Go: Steeper learning curve, less accessible

**Consequences**:
- Positive: Familiar language, rich ecosystem, fast tooling
- Negative: Runtime dependency (mitigated by Python's ubiquity)

### TDR-003: EARS Format for Requirements

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Need structured format for requirements to ensure testability and traceability.

**Decision**: Adopt EARS (Easy Approach to Requirements Syntax) as mandatory format.

**Rationale**:
- Industry standard (NASA, DoD, safety-critical systems)
- Testable patterns (clear trigger → response)
- Machine-parsable (validators can extract requirements)
- Human-readable (no proprietary syntax)

**Alternatives Considered**:
- Free-form text: Not testable, no traceability
- User stories (As a...I want...So that...): Less precise
- Formal methods (Z, TLA+): Too complex for most projects

**Consequences**:
- Positive: Testable, traceable, standardized
- Negative: Learning curve (mitigated by templates and examples)

---

## References

- **Claude Code Skills API**: https://docs.anthropic.com/claude/claude-code/skills
- **EARS Format**: steering/rules/ears-format.md (to be created)
- **Constitutional Governance**: steering/rules/constitution.md (to be created)
- **MCP Analysis**: MCP-MANAGEMENT-ANALYSIS.md
- **Project Plan**: PROJECT-PLAN-MUSUBI.md
- **Blueprint**: Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md

---

**Document Owner**: steering skill
**Maintained by**: Auto-update rules + manual review
**Review Frequency**: Quarterly or when technology changes occur
