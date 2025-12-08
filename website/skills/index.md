# Skills Overview

MUSUBI provides 25 specialized skills for Claude Code's Skills API.

## Skill Categories

### Core Skills

| Skill | Description |
|-------|-------------|
| [Orchestrator](/skills/orchestrator) | Routes tasks to appropriate specialist skills |
| [Steering](/skills/steering) | Manages project memory and context |
| [Constitution Enforcer](/skills/constitution-enforcer) | Validates 9 Constitutional Articles |

### Development Skills

| Skill | Description |
|-------|-------------|
| [Requirements Analyst](/skills/requirements-analyst) | Creates EARS-format requirements |
| [System Architect](/skills/system-architect) | Designs C4 architecture + ADRs |
| [Software Developer](/skills/software-developer) | Implements with Test-First methodology |
| [Test Engineer](/skills/test-engineer) | Creates comprehensive test suites |

### Quality Skills

| Skill | Description |
|-------|-------------|
| [Code Reviewer](/skills/code-reviewer) | Reviews code for quality and standards |
| [Bug Hunter](/skills/bug-hunter) | Root cause analysis and debugging |
| [Quality Assurance](/skills/quality-assurance) | QA planning and execution |
| [Security Auditor](/skills/security-auditor) | Security analysis and OWASP compliance |
| [Performance Optimizer](/skills/performance-optimizer) | Performance analysis and optimization |
| [Traceability Auditor](/skills/traceability-auditor) | Validates requirement coverage |

### Infrastructure Skills

| Skill | Description |
|-------|-------------|
| [DevOps Engineer](/skills/devops-engineer) | CI/CD pipelines and automation |
| [Release Coordinator](/skills/release-coordinator) | Release planning and feature flags |
| [Site Reliability Engineer](/skills/site-reliability-engineer) | SLOs, SLIs, and incident response |
| [Database Administrator](/skills/database-administrator) | Database tuning and management |
| [Cloud Architect](/skills/cloud-architect) | Cloud infrastructure design |

### Specialized Skills

| Skill | Description |
|-------|-------------|
| [API Designer](/skills/api-designer) | RESTful and GraphQL API design |
| [Database Schema Designer](/skills/database-schema-designer) | Schema design and modeling |
| [UI/UX Designer](/skills/ui-ux-designer) | Interface and experience design |
| [AI/ML Engineer](/skills/ai-ml-engineer) | MLOps and model development |
| [Technical Writer](/skills/technical-writer) | Documentation and guides |
| [Project Manager](/skills/project-manager) | Agile ceremonies and planning |
| [Change Impact Analyzer](/skills/change-impact-analyzer) | Change impact assessment |

## Using Skills

### Direct Invocation

```
@orchestrator What's the best approach for user authentication?
@requirements-analyst Create requirements for login feature
@system-architect Design authentication system
@software-developer Implement password hashing
@test-engineer Write authentication tests
```

### Via Slash Commands

```
/sdd-requirements User Authentication
/sdd-design User Authentication
/sdd-tasks User Authentication
/sdd-implement User Authentication
/sdd-validate User Authentication
```

### Orchestrator Routing

The orchestrator automatically routes tasks:

```
@orchestrator Implement user authentication with JWT tokens
```

The orchestrator will:
1. Analyze the request
2. Identify required skills
3. Create execution plan
4. Delegate to specialists
5. Coordinate outputs

## Skill Location

Skills are installed in:

```
.claude/skills/
├── orchestrator/
│   └── SKILL.md
├── steering/
│   └── SKILL.md
├── requirements-analyst/
│   └── SKILL.md
└── ... (25 skills total)
```

## Custom Skills

You can create custom skills by adding to `.claude/skills/`:

```markdown
---
name: my-custom-skill
description: Description of what this skill does
allowed-tools: [Read, Write, Bash]
---

# My Custom Skill

Instructions for the skill...
```

## Skill Attributes

Each skill has:

| Attribute | Description |
|-----------|-------------|
| `name` | Unique skill identifier |
| `description` | What the skill does and triggers |
| `allowed-tools` | Permitted tool access |
| `input-schema` | Optional structured input |

## Platform Support

| Platform | Skill Support |
|----------|---------------|
| Claude Code | Full Skills API (25 skills) |
| GitHub Copilot | AGENTS.md commands |
| Cursor | AGENTS.md + Rules |
| Others | AGENTS.md format |
