# What is MUSUBI?

**MUSUBI** (結び - "connection/binding") is a comprehensive **Specification Driven Development (SDD)** framework that brings structure, traceability, and governance to AI-assisted software development.

## The Problem

Modern AI coding agents are powerful, but they often:

- ❌ Generate code without understanding requirements
- ❌ Create inconsistent architectures across sessions
- ❌ Lose context between conversations
- ❌ Skip testing and documentation
- ❌ Work differently across AI platforms

## The MUSUBI Solution

MUSUBI provides:

### 1. Unified Workflow

One consistent SDD workflow across 7 AI coding agents:

| Agent | Integration |
|-------|-------------|
| Claude Code | Skills API (25 skills) |
| GitHub Copilot | AGENTS.md + Custom Instructions |
| Cursor | AGENTS.md + Rules |
| Gemini CLI | AGENTS.md |
| Codex CLI | AGENTS.md |
| Qwen Code | AGENTS.md |
| Windsurf | AGENTS.md |

### 2. Constitutional Governance

9 immutable articles that ensure quality:

1. **Library-First** - Features as reusable libraries
2. **CLI Interface** - Everything scriptable
3. **Test-First** - Red-Green-Blue cycle
4. **EARS Format** - Unambiguous requirements
5. **Traceability** - 100% coverage mapping
6. **Project Memory** - Persistent steering context
7. **Simplicity Gate** - Max 3 projects initially
8. **Anti-Abstraction** - Use frameworks directly
9. **Integration-First** - Real services in tests

### 3. 25 Specialized Skills

From requirements to deployment:

**Core**: Orchestrator, Steering, Constitution Enforcer

**Development**: Requirements Analyst, System Architect, Software Developer, Test Engineer

**Quality**: Code Reviewer, Security Auditor, Performance Optimizer, QA

**Infrastructure**: DevOps Engineer, Database Administrator, Cloud Architect, SRE

**Specialized**: API Designer, UI/UX Designer, AI/ML Engineer, Technical Writer

### 4. Complete Traceability

```
Requirement → Design → Code → Test
    REQ-001 →  COMP-A → file.ts → test.ts
```

Every requirement is tracked through design, implementation, and testing.

## Key Features

### EARS Requirements

5 patterns for unambiguous requirements:

```
WHEN user clicks login, the System SHALL validate credentials
WHILE session active, the System SHALL refresh token every 15 minutes
IF validation fails, THEN the System SHALL display error message
WHERE MFA enabled, the System SHALL require second factor
The System SHALL encrypt all sensitive data
```

### Steering System

Persistent project memory that survives between AI sessions:

- `structure.md` - Architecture patterns
- `tech.md` - Technology stack
- `product.md` - Business context

### Phase -1 Gates

Quality gates before implementation:

- **Simplicity Gate** - Prevent over-engineering
- **Anti-Abstraction Gate** - No unnecessary wrappers

## Who Should Use MUSUBI?

- **Development Teams** using AI coding assistants
- **Tech Leads** wanting consistent AI outputs
- **Quality Engineers** needing traceability
- **Enterprise Projects** requiring governance
- **Anyone** building production software with AI

## Getting Started

```bash
npx musubi-sdd init
```

See [Getting Started](/guide/getting-started) for detailed instructions.
