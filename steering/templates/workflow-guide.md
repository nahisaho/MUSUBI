# SDD Workflow Quick Reference

Complete guide for using MUSUBI SDD templates in your development workflow.

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MUSUBI SDD Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REQUIREMENTS    2. DESIGN       3. TASKS      4. IMPLEMENT  │
│  ┌─────────────┐   ┌───────────┐   ┌─────────┐   ┌───────────┐ │
│  │ EARS Format │──▶│ C4 + ADR  │──▶│Breakdown│──▶│ Test-First│ │
│  │ + Validate  │   │ + Validate│   │+ Trace  │   │ + Trace   │ │
│  └─────────────┘   └───────────┘   └─────────┘   └───────────┘ │
│                                                                 │
│  Templates:        Templates:      Templates:    Checklists:   │
│  - requirements.md - design.md     - tasks.md    - execution   │
│  - checklist       - adr-template  - execution   - coverage    │
│                    - checklist     - checklist   - matrix      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start Commands

### Phase 1: Requirements

```bash
# Initialize requirements document
musubi-requirements init "User Authentication"

# Add requirement interactively
musubi-requirements add

# Validate EARS format (Article IV)
musubi-requirements validate

# View metrics
musubi-requirements metrics
```

### Phase 2: Design

```bash
# Initialize design document
musubi-design init "User Authentication"

# Add C4 diagram
musubi-design add-c4 container

# Add Architecture Decision Record
musubi-design add-adr "Database Selection"

# Validate design completeness
musubi-design validate
```

### Phase 3: Tasks

```bash
# Initialize task breakdown
musubi-tasks init "User Authentication"

# Add task
musubi-tasks add "Implement login endpoint"

# List all tasks
musubi-tasks list

# Update task status
musubi-tasks update TASK-001 completed

# Visualize dependencies
musubi-tasks graph
```

### Phase 4: Implementation

```bash
# Validate constitutional compliance
musubi-validate constitution

# Check traceability
musubi-trace --feature "User Authentication"

# Check for gaps
musubi-gaps --verbose
```

---

## Template Locations

| Template | Location | Purpose |
|----------|----------|---------|
| Requirements | `steering/templates/requirements.md` | EARS requirement spec |
| Requirements Checklist | `steering/templates/requirements-checklist.md` | Validation |
| Design | `steering/templates/design.md` | Technical design doc |
| Design Checklist | `steering/templates/design-checklist.md` | Review gate |
| ADR | `steering/templates/adr-template.md` | Architecture decisions |
| Tasks | `steering/templates/tasks.md` | Implementation plan |
| Task Execution | `steering/templates/task-execution-checklist.md` | Dev checklist |
| Coverage Matrix | `steering/templates/coverage-matrix.md` | Traceability |

---

## Example Workflow

### Step 1: Create Requirements

```bash
# Create requirements file
musubi-requirements init "User Login"

# Edit docs/requirements/user-login.md
# Add EARS-format requirements:
# - WHEN user submits credentials, System SHALL validate
# - IF validation fails, THEN System SHALL display error
```

### Step 2: Validate Requirements

```bash
# Check EARS compliance
musubi-requirements validate --file docs/requirements/user-login.md

# Use checklist: steering/templates/requirements-checklist.md
```

### Step 3: Create Design

```bash
# Create design document
musubi-design init "User Login"

# Edit docs/design/user-login.md
# - Add C4 diagrams
# - Map requirements to components
# - Create ADRs for key decisions
```

### Step 4: Review Design

```bash
# Validate design
musubi-design validate --file docs/design/user-login.md

# Use checklist: steering/templates/design-checklist.md
```

### Step 5: Create Tasks

```bash
# Generate task breakdown
musubi-tasks init "User Login"

# Edit docs/tasks/user-login.md
# - Map tasks to requirements
# - Set priorities and dependencies
```

### Step 6: Implement (Test-First)

```bash
# For each task:

# 1. Write failing test (Red)
git add tests/login.test.js
git commit -m "test: Add login validation tests [REQ-LOGIN-001]"

# 2. Write minimal code (Green)
git add src/auth/login.js
git commit -m "feat: Implement login validation [REQ-LOGIN-001]"

# 3. Refactor (Blue)
git add src/auth/login.js
git commit -m "refactor: Improve login validation [REQ-LOGIN-001]"
```

### Step 7: Validate & Close

```bash
# Run all validations
musubi-validate all

# Check traceability
musubi-trace --feature "User Login"

# Update task status
musubi-tasks update TASK-001 completed
```

---

## Constitutional Checkpoints

### Before Design (After Requirements)

```bash
musubi-validate article 4  # EARS format
musubi-requirements validate
```

### Before Implementation (After Design)

```bash
musubi-validate article 7  # Simplicity Gate
musubi-validate article 8  # Anti-Abstraction Gate
musubi-design validate
```

### During Implementation

```bash
musubi-validate article 3  # Test-First
musubi-validate article 1  # Library-First
musubi-validate article 2  # CLI Interface
```

### After Implementation

```bash
musubi-validate article 5  # Traceability
musubi-validate article 9  # Integration-First
musubi-validate all        # Full validation
```

---

## Template Variables

When using templates, replace these placeholders:

| Variable | Description | Example |
|----------|-------------|---------|
| `[Project Name]` | Project name | MUSUBI |
| `[Feature Name]` | Feature being developed | User Authentication |
| `[YYYY-MM-DD]` | Current date | 2024-03-15 |
| `[Author Name]` | Document author | John Smith |
| `REQ-XXX-NNN` | Requirement ID | REQ-AUTH-001 |
| `ADR-NNN` | ADR number | ADR-001 |
| `TASK-NNN` | Task ID | TASK-001 |

---

## Common Issues

### "Requirements not in EARS format"

```bash
# Check specific patterns
musubi-requirements validate --verbose

# Common fixes:
# - should → SHALL
# - may → SHALL (or remove if optional)
# - Add WHEN/WHILE/IF/WHERE prefix
```

### "Design missing traceability"

```bash
# Show what's missing
musubi-trace --verbose

# Add REQ-XXX references to:
# - Component descriptions
# - API definitions
# - Test files
```

### "Constitutional violation"

```bash
# Get detailed report
musubi-validate constitution --verbose

# See specific article
musubi-validate article <number>
```
