# Quick Start

Get productive with MUSUBI in 5 minutes.

## 1. Install

```bash
npx musubi-sdd init
```

## 2. Check Status

```bash
musubi status
```

## 3. Use SDD Commands

### With Claude Code (Skills API)

```
@orchestrator Plan user authentication feature
@requirements-analyst Create login requirements
@system-architect Design authentication system
@software-developer Implement login endpoint
@test-engineer Write authentication tests
```

Or use slash commands:

```
/sdd-requirements User Authentication
/sdd-design User Authentication
/sdd-tasks User Authentication
/sdd-implement User Authentication
/sdd-validate User Authentication
```

### With GitHub Copilot

```
#sdd-requirements User Authentication
#sdd-design User Authentication
#sdd-tasks User Authentication
```

### With Cursor

```
@requirements-analyst Create requirements for login
@system-architect Design the authentication flow
```

## 4. CLI Commands

```bash
# Requirements
musubi-requirements init "User Login"
musubi-requirements validate

# Design
musubi-design init "User Login"
musubi-design add-adr "Auth Method Selection"

# Tasks
musubi-tasks init "User Login"
musubi-tasks list

# Validation
musubi-validate constitution
musubi-validate all

# Traceability
musubi-trace --feature "User Login"
musubi-gaps --verbose
```

## 5. Workflow

```
1. Requirements  →  EARS format, validated
2. Design        →  C4 diagrams, ADRs
3. Tasks         →  Breakdown with estimates
4. Implement     →  Test-First (Red-Green-Blue)
5. Validate      →  Constitutional compliance
6. Deploy        →  Release coordination
```

## Common Commands Cheat Sheet

| Task | Command |
|------|---------|
| Initialize project | `musubi init` |
| Check status | `musubi status` |
| Create requirements | `musubi-requirements init "Feature"` |
| Create design | `musubi-design init "Feature"` |
| Create tasks | `musubi-tasks init "Feature"` |
| Validate all | `musubi-validate all` |
| Check traceability | `musubi-trace --verbose` |
| Find gaps | `musubi-gaps` |
| View workflow | `musubi-workflow status` |

## Next Steps

- [Full SDD Workflow](/guide/sdd-workflow)
- [EARS Requirements](/guide/ears-format)
- [Constitutional Governance](/guide/constitution)
- [CLI Reference](/reference/cli)
