# CLI Reference

Complete reference for all MUSUBI CLI commands.

## Main Commands

### musubi

Main entry point for MUSUBI.

```bash
musubi [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `init` | Initialize MUSUBI in project |
| `status` | Show project status |
| `validate` | Validate constitutional compliance |
| `sync` | Sync steering with codebase |
| `info` | Show version and environment |

**Agent Selection**:

```bash
musubi init --claude      # Claude Code (default)
musubi init --copilot     # GitHub Copilot
musubi init --cursor      # Cursor IDE
musubi init --gemini      # Gemini CLI
musubi init --codex       # Codex CLI
musubi init --qwen        # Qwen Code
musubi init --windsurf    # Windsurf IDE
```

---

## Requirements

### musubi-requirements

Generate EARS-format requirements.

```bash
musubi-requirements [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `init <feature>` | Create requirements document |
| `add` | Add requirement interactively |
| `list` | List all requirements |
| `validate` | Validate EARS format |
| `metrics` | Show quality metrics |
| `trace` | Show traceability |

**Examples**:

```bash
musubi-requirements init "User Authentication"
musubi-requirements add --pattern event-driven
musubi-requirements validate --file docs/requirements/auth.md
musubi-requirements metrics
```

---

## Design

### musubi-design

Generate design documents with C4 and ADRs.

```bash
musubi-design [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `init <feature>` | Create design document |
| `add-c4 <level>` | Add C4 diagram |
| `add-adr <decision>` | Add ADR |
| `validate` | Validate completeness |
| `trace` | Show requirement mapping |

**C4 Levels**: `context`, `container`, `component`, `code`

**Examples**:

```bash
musubi-design init "User Authentication"
musubi-design add-c4 container
musubi-design add-adr "Database Selection"
musubi-design validate
```

---

## Tasks

### musubi-tasks

Break down design into tasks.

```bash
musubi-tasks [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `init <feature>` | Create task breakdown |
| `add <title>` | Add new task |
| `list` | List all tasks |
| `update <id> <status>` | Update task status |
| `validate` | Validate completeness |
| `graph` | Show dependency graph |

**Examples**:

```bash
musubi-tasks init "User Authentication"
musubi-tasks add "Implement login endpoint"
musubi-tasks update TASK-001 completed
musubi-tasks graph
```

---

## Validation

### musubi-validate

Validate constitutional compliance.

```bash
musubi-validate [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `constitution` | Validate all 9 articles |
| `article <1-9>` | Validate specific article |
| `gates` | Validate Phase -1 Gates |
| `complexity` | Validate complexity limits |
| `score` | Calculate compliance score |
| `all` | Run all validations |

**Options**:

| Option | Description |
|--------|-------------|
| `-v, --verbose` | Detailed output |
| `-f, --format` | Output format (console/json/markdown) |
| `--threshold` | Minimum passing score |

**Examples**:

```bash
musubi-validate constitution
musubi-validate article 4
musubi-validate score --threshold 80
musubi-validate all --verbose
```

---

## Traceability

### musubi-trace

Analyze requirement traceability.

```bash
musubi-trace [command] [options]
```

**Commands**:

| Command | Description |
|---------|-------------|
| `matrix` | Show coverage matrix |
| `gaps` | Find coverage gaps |
| `verify` | Verify traceability |

**Options**:

| Option | Description |
|--------|-------------|
| `--feature` | Filter by feature |
| `--verbose` | Show details |

---

## Other Commands

### musubi-analyze

Analyze codebase for quality and technical debt.

### musubi-gaps

Detect gaps in requirements, code, and tests.

### musubi-change

Manage delta specifications for brownfield projects.

### musubi-workflow

Manage SDD workflow state and metrics.

```bash
musubi-workflow status    # Current stage
musubi-workflow next      # Move to next stage
musubi-workflow metrics   # View metrics
```

### musubi-onboard

Analyze existing codebase and generate steering docs.

### musubi-gui

Launch web-based dashboard.

```bash
musubi-gui start
```

---

## Global Options

Available on all commands:

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help |
| `-V, --version` | Show version |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation failed or error |
