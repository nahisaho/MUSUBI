# MUSUBI - Project Structure and Architecture

**Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Planning Phase

---

## Overview

MUSUBI follows a **skill-based architecture** with 25 specialized Claude Code Skills organized into a structured directory hierarchy. The project uses **constitutional governance** to enforce quality and **delta specifications** for change management.

---

## Architecture Patterns

### 1. Skill-Based Architecture

**Core Principle**: Functionality is organized into 25 specialized, autonomous skills that are model-invoked by Claude Code.

**Skill Categories** (9 categories):
- **Orchestration & Management** (3 skills): Master coordination, project memory, governance
- **Requirements & Planning** (3 skills): Requirements analysis, project management, change impact
- **Architecture & Design** (4 skills): System architecture, API design, database design, UI/UX design
- **Development & Implementation** (2 skills): Code implementation, AI/ML engineering
- **Quality & Review** (5 skills): Code review, bug hunting, traceability, security, performance
- **QA** (2 skills): Test engineering, quality assurance
- **Infrastructure & Operations** (5 skills): DevOps, release coordination, cloud architecture, SRE, database administration
- **Documentation** (1 skill): Technical writing

**Pattern**: Each skill is self-contained with:
- YAML frontmatter (name, description, trigger terms, allowed-tools)
- Skill prompt (responsibilities, workflows, templates)
- Supporting materials (templates, examples, guidelines)

### 2. Constitutional Governance

**Core Principle**: All development must comply with 9 immutable Constitutional Articles enforced through Phase -1 Gates.

**9 Constitutional Articles**:
1. **Library-First Principle**: Every feature starts as a library
2. **CLI Interface Mandate**: All libraries must expose CLI
3. **Test-First Imperative**: No code before tests (Red→Green→Blue)
4. **EARS Requirements Format**: All requirements use EARS patterns
5. **Traceability Mandate**: 100% Requirement ↔ Design ↔ Code ↔ Test mapping
6. **Project Memory**: Skills check steering before work
7. **Simplicity Gate**: ≤3 projects, no future-proofing
8. **Anti-Abstraction Gate**: Use frameworks directly, no wrappers
9. **Integration-First Testing**: Real services, contracts mandatory

**Enforcement**: `constitution-enforcer` skill validates all artifacts against these articles.

### 3. Delta Specification System

**Core Principle**: Support both greenfield (0→1) and brownfield (1→n) projects through change tracking.

**Pattern**:
- **Greenfield**: Start with complete specifications in `storage/specs/`
- **Brownfield**: Use `storage/changes/` for incremental modifications
- **Change Workflow**: Proposal → Impact Analysis → Implementation → Archive
- **Traceability**: All changes linked to original specs via delta files

**Skills Involved**:
- `change-impact-analyzer`: Analyzes change impact
- `orchestrator`: Coordinates change workflow
- `traceability-auditor`: Validates change coverage

### 4. Auto-Updating Project Memory (Steering)

**Core Principle**: Project context (architecture, tech stack, business domain) is automatically maintained and referenced by all skills.

**Steering Files**:
- `steering/structure.md`: Architecture patterns, directory organization, naming conventions
- `steering/tech.md`: Technology stack, frameworks, development tools
- `steering/product.md`: Business context, product purpose, target users

**Pattern**:
- `steering` skill generates initial context from codebase analysis
- Skills update steering when making architectural decisions
- All skills read steering before starting work (Constitutional Article VI)

**Auto-Update Triggers**:
| Skill Completed | Updates | Steering File |
|-----------------|---------|---------------|
| system-architect | Architecture patterns | structure.md |
| api-designer | API conventions | tech.md |
| database-schema-designer | DB patterns | tech.md |
| cloud-architect | Infrastructure patterns | tech.md + structure.md |
| ui-ux-designer | UI component organization | structure.md |
| software-developer | New dependencies | tech.md |

---

## Directory Organization

### Root Directory Structure

```
musubi/
├── .claude/                      # Claude Code integration
│   ├── skills/                   # 25 Skills (model-invoked)
│   └── commands/                 # Slash commands (user-invoked)
├── steering/                     # Project memory (auto-generated)
│   ├── structure.md              # THIS FILE
│   ├── tech.md                   # Technology stack
│   ├── product.md                # Business context
│   └── rules/                    # Governance rules
├── templates/                    # Document templates
├── orchestration/                # Multi-skill coordination patterns
├── validators/                   # Quality gates (Python scripts)
└── storage/                      # Project data
    ├── specs/                    # Current truth (greenfield)
    ├── changes/                  # Change proposals (brownfield)
    └── features/                 # Feature branches
```

### Skill Directory Pattern

**Location**: `.claude/skills/[skill-name]/`

**Standard Structure**:
```
[skill-name]/
├── SKILL.md                      # Main skill definition with YAML frontmatter
├── [domain]-guide.md             # Domain-specific guidelines
├── templates/                    # Skill-specific templates
└── examples/                     # Reference examples
```

**Example** (system-architect):
```
system-architect/
├── SKILL.md                      # Architecture skill prompt
├── c4-model-guide.md             # C4 diagram standards
├── adr-template.md               # Architecture Decision Record template
└── examples/
    └── sample-design.md
```

### Commands Directory Pattern

**Location**: `.claude/commands/`

**Purpose**: User-invoked slash commands for SDD workflow

**Naming Convention**: `sdd-[action].md`

**Categories**:
- Workflow: `/sdd-requirements`, `/sdd-design`, `/sdd-tasks`, `/sdd-implement`
- Change Management: `/sdd-change-init`, `/sdd-change-apply`, `/sdd-change-archive`
- Validation: `/sdd-validate-requirements`, `/sdd-validate-design`, `/sdd-validate-traceability`
- Utilities: `/sdd-list`, `/sdd-show`

### Storage Directory Pattern

**Location**: `storage/`

**Purpose**: Version-controlled project data

**Subdirectories**:
1. **specs/** - Greenfield specifications (current truth)
   ```
   specs/
   └── [capability]/
       ├── spec.md                # EARS requirements
       └── design.md              # Architecture design
   ```

2. **changes/** - Brownfield change tracking
   ```
   changes/
   ├── [change-id]/
   │   ├── proposal.md            # Change proposal
   │   ├── tasks.md               # Implementation plan
   │   ├── design.md              # Design updates
   │   └── impact-analysis.md     # Impact assessment
   └── archive/                   # Completed changes
   ```

3. **features/** - Feature branch specifications
   ```
   features/
   └── [feature-id]/
       ├── requirements.md        # EARS requirements
       ├── research.md            # Technical research
       ├── design.md              # Architecture
       └── tasks.md               # Implementation plan
   ```

---

## Naming Conventions

### Skills

**Pattern**: `lowercase-hyphenated-name`

**Examples**:
- `requirements-analyst`
- `system-architect`
- `site-reliability-engineer`
- `change-impact-analyzer`

**File**: `SKILL.md` (uppercase) in skill directory

### Slash Commands

**Pattern**: `sdd-[action].md`

**Examples**:
- `sdd-requirements.md`
- `sdd-validate-traceability.md`
- `sdd-change-init.md`

### Steering Files

**Pattern**: `lowercase.md` (English primary), `lowercase.ja.md` (Japanese translation)

**Examples**:
- `structure.md` / `structure.ja.md`
- `tech.md` / `tech.ja.md`
- `product.md` / `product.ja.md`

### Document Templates

**Pattern**: Descriptive lowercase names

**Examples**:
- `requirements.md` (EARS requirements template)
- `design.md` (C4 + ADR template)
- `tasks.md` (P-labeled tasks template)
- `proposal.md` (Change proposal template)

---

## Orchestration Patterns

### Pattern 1: Auto-Selection

**Use Case**: User provides high-level intent, orchestrator selects appropriate skills

**Flow**:
```
User Intent → Orchestrator Analyzes → Selects Skill(s) → Executes → Returns Result
```

**Example**: "Create requirements for user authentication"
→ Orchestrator selects `requirements-analyst` skill

### Pattern 2: Sequential Workflow

**Use Case**: Multi-stage SDD workflow (8 stages)

**Flow**:
```
Research → Requirements → Design → Tasks → Implementation → Testing → Deployment → Monitoring
```

**Skills Involved**: Orchestrator coordinates sequential execution

### Pattern 3: Parallel Execution

**Use Case**: Independent tasks that can run simultaneously

**Flow**:
```
Orchestrator → Split into P-labeled tasks → Execute in parallel → Merge results
```

**Example**: P1 (API design), P2 (DB schema), P3 (UI design) execute concurrently

### Pattern 4: Nested Delegation

**Use Case**: Complex domains requiring sub-orchestration

**Flow**:
```
Orchestrator → Delegates to Domain Orchestrator → Executes Specialized Skills
```

**Example**: Cloud deployment delegates to `cloud-architect` which coordinates infrastructure skills

### Pattern 5: Human-in-the-Loop

**Use Case**: Quality gates requiring user approval

**Flow**:
```
Skill Execution → Validation Gate → User Approval → Continue/Reject
```

**Example**: Constitutional validation before implementation

---

## Design Decisions

### ADR-001: Skill-Based Architecture over Monolithic Agent

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Need to balance simplicity (musuhi's 20 agents) with completeness (coverage of all 8 SDD stages).

**Decision**: Adopt 25 specialized skills with clear domain boundaries.

**Rationale**:
- Modularity: Each skill is independently testable and maintainable
- Scalability: Easy to add new skills without affecting existing ones
- Discovery: YAML trigger terms enable automatic skill selection
- Governance: Skills can be validated individually against constitutional articles

**Consequences**:
- Positive: Clear separation of concerns, easier maintenance
- Negative: Increased complexity in orchestration (mitigated by orchestrator skill)

### ADR-002: Constitutional Governance as Skill

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Need to enforce quality gates consistently across all skills.

**Decision**: Create dedicated `constitution-enforcer` skill for validation.

**Rationale**:
- Centralization: Single source of truth for constitutional compliance
- Automation: Validation is automated, not manual
- Traceability: All validations are logged and auditable
- Separation: Enforcement logic separated from implementation skills

**Consequences**:
- Positive: Consistent enforcement, no manual checks
- Negative: Additional skill to maintain (acceptable tradeoff)

### ADR-003: Auto-Updating Steering over Static Documentation

**Status**: Accepted
**Date**: 2025-11-16

**Context**: Project context (architecture, tech stack) changes over time and manual updates are error-prone.

**Decision**: `steering` skill automatically updates context based on skill execution.

**Rationale**:
- Accuracy: Project memory stays in sync with codebase
- Freshness: Always reflects current state
- Self-documenting: Architectural decisions captured automatically
- Compliance: Supports Constitutional Article VI (Project Memory)

**Consequences**:
- Positive: Always accurate, no stale documentation
- Negative: Requires careful trigger design (mitigated by update rules)

---

## Integration Points

### Claude Code Skills API

**Integration Type**: Model-invoked skills

**Mechanism**:
- Skills defined in `.claude/skills/[name]/SKILL.md`
- YAML frontmatter includes trigger terms for automatic discovery
- Claude Code invokes skills based on user intent analysis

**Example**:
```yaml
---
name: requirements-analyst
description: |
  Use this skill for requirements analysis, specification writing, and user story creation.

  Trigger terms: requirements, specifications, user stories, acceptance criteria, EARS format
allowed-tools: [Read, Write, Glob, Grep]
---
```

### MCP Servers

**Integration Type**: Direct tool invocation by skills

**Available MCP Servers**:
- **context7**: Up-to-date library documentation
- **ide**: VS Code diagnostics, Jupyter kernel execution

**Usage Pattern**:
```
Skill → mcp__context7__get-library-docs("/vercel/next.js") → Latest Next.js docs
```

**No Dedicated MCP Skill**: Skills invoke MCP tools directly (see MCP-MANAGEMENT-ANALYSIS.md for rationale)

### Git Workflow

**Integration Type**: Version control for all artifacts

**Pattern**:
- All specifications, designs, and tasks are Git-tracked
- Change proposals are Git branches
- Traceability maintained through Git history
- Constitutional validation runs as pre-commit hook

---

## Quality Gates

### Phase -1 Gates (Pre-Implementation)

**Enforced by**: `constitution-enforcer` skill

**Gates**:
1. **Simplicity Gate**: Validates ≤3 projects, no speculative features
2. **Anti-Abstraction Gate**: Checks for unnecessary wrappers
3. **Integration-First Gate**: Ensures real service testing
4. **EARS Compliance Gate**: Validates all requirements use EARS format
5. **Traceability Gate**: Confirms 100% requirement coverage
6. **Steering Alignment Gate**: Verifies consistency with project memory

**Trigger**: Before any implementation begins

### Validation Scripts

**Location**: `validators/`

**Scripts**:
- `ears-format.py`: EARS syntax validation
- `constitutional.py`: Phase -1 Gates enforcement
- `coverage.py`: Requirements coverage analysis
- `traceability.py`: Traceability matrix validation
- `delta-format.py`: Delta spec validation
- `consistency.py`: Cross-artifact consistency

**Execution**: Can be run manually or via CI/CD

---

## Evolution and Maintenance

### Adding New Skills

1. Create skill directory: `.claude/skills/[new-skill-name]/`
2. Write SKILL.md with YAML frontmatter
3. Add trigger terms for discovery
4. Update orchestrator selection matrix
5. Add to steering/structure.md (this file)
6. Update constitutional validation if needed

### Modifying Architecture Patterns

1. Propose change via change proposal (storage/changes/)
2. Analyze impact with `change-impact-analyzer` skill
3. Update affected skills
4. Update steering/structure.md
5. Validate with `constitution-enforcer`
6. Archive proposal

### Deprecating Patterns

1. Mark as deprecated in steering/structure.md
2. Provide migration path
3. Update skills to use new pattern
4. Remove deprecated pattern after transition period

---

## References

- **Blueprint**: Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md
- **Project Plan**: PROJECT-PLAN-MUSUBI.md
- **Skills Inventory**: SKILLS-AUDIT-REPORT.md
- **MCP Analysis**: MCP-MANAGEMENT-ANALYSIS.md
- **Constitutional Governance**: steering/rules/constitution.md (to be created)
- **SDD Workflow**: steering/rules/workflow.md (to be created)

---

**Document Owner**: steering skill
**Maintained by**: Auto-update rules + manual review
**Review Frequency**: Monthly or when architectural changes occur
