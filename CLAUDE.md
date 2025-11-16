# Musuhi - Specification Driven Development AI Agents

This project uses **Musuhi** with 20 specialized AI agents for Specification Driven Development.

## 🧭 Project Memory (Steering System)

**IMPORTANT**: Before starting any task, check if steering files exist in `steering/` directory:
- `steering/structure.md` - Architecture patterns, directory organization, naming conventions
- `steering/tech.md` - Technology stack, frameworks, development tools
- `steering/product.md` - Business context, product purpose, users

If these files exist, ALWAYS read them first to understand project context.

## 🎭 Available Agents

This project has 20 specialized agents in `.claude/agents/`:

### Orchestration
- `@orchestrator` - Master coordinator for complex multi-agent workflows
- `@steering` - Project memory manager (analyzes codebase to generate/maintain steering context)

### Requirements & Planning
- `@requirements-analyst` - Requirements analysis, user stories, EARS format, SRS documents
- `@project-manager` - Project planning, scheduling, risk management

### Architecture & Design
- `@system-architect` - System architecture, C4 diagrams, ADR, EARS requirements mapping
- `@api-designer` - REST/GraphQL/gRPC API design, OpenAPI specs
- `@database-schema-designer` - Database design, ER diagrams, DDL
- `@ui-ux-designer` - UI/UX design, wireframes, prototypes

### Development & Implementation
- `@software-developer` - Multi-language code implementation, SOLID principles
- `@test-engineer` - Unit, integration, E2E testing with EARS requirements mapping

### Quality & Review
- `@code-reviewer` - Code review, SOLID principles, best practices
- `@bug-hunter` - Bug investigation, root cause analysis
- `@quality-assurance` - QA strategy, test planning

### Security & Performance
- `@security-auditor` - OWASP Top 10, vulnerability detection
- `@performance-optimizer` - Performance analysis, optimization

### Infrastructure & Operations
- `@devops-engineer` - CI/CD pipelines, Docker/Kubernetes
- `@cloud-architect` - AWS/Azure/GCP, IaC (Terraform/Bicep)
- `@database-administrator` - Database operations, tuning

### Documentation & Specialized
- `@technical-writer` - Technical documentation, API docs
- `@ai-ml-engineer` - ML model development, MLOps

## 📋 SDD Workflow (8 Stages)

```
Research → Requirements → Design → Tasks → Implementation → Testing → Deployment → Monitoring
```

**Workflow Guide**: See `steering/rules/workflow.md` for complete details.

### Document Templates

Use templates from `steering/templates/`:
- `research.md` - Technical research and options analysis
- `requirements.md` - EARS-format requirements with acceptance criteria
- `design.md` - Technical design with EARS requirements mapping
- `tasks.md` - Implementation plan with requirements coverage matrix

## 📝 EARS Format (Easy Approach to Requirements Syntax)

All requirements must use EARS patterns:
- **Event-driven**: `WHEN [event], the [system] SHALL [response]`
- **State-driven**: `WHILE [state], the [system] SHALL [response]`
- **Unwanted behavior**: `IF [error], THEN the [system] SHALL [response]`
- **Optional features**: `WHERE [feature enabled], the [system] SHALL [response]`
- **Ubiquitous**: `The [system] SHALL [requirement]`

**Guidelines**: See `steering/rules/ears-format.md` for complete EARS documentation.

## 🎯 Quick Start

### First Time Setup
```
1. Generate project memory: @steering
2. Review steering context in steering/ directory
3. Start development with agents
```

### For Complex Projects
```
@orchestrator [describe your complete task]
```

### For Specific Tasks
```
@requirements-analyst Create requirements for [feature]
@system-architect Design architecture based on requirements.md
@software-developer Implement [component] following design.md
@test-engineer Generate tests from requirements.md
```

## 📐 Documentation Standards

- **Language Policy**: Create English documentation first (`.md`), then Japanese translation (`.ja.md`)
- **Reference Policy**: Always reference English versions (`.md`) when reading documents
- **Traceability**: Maintain requirement ↔ design ↔ task ↔ code ↔ test mapping

## ✅ Quality Gates

- **Requirements**: All in EARS format, stakeholder approved
- **Design**: All requirements mapped, architecture aligned with steering
- **Implementation**: Code review passed, 80%+ test coverage, no critical bugs
- **Testing**: All EARS requirements tested, all tests passing
- **Deployment**: Staging successful, monitoring configured

## 🔗 Resources

- **Workflow**: `steering/rules/workflow.md` - 8-stage SDD workflow
- **EARS Format**: `steering/rules/ears-format.md` - Requirements syntax guide
- **Templates**: `steering/templates/` - Document templates
- **Agent Validation**: `steering/rules/agent-validation-checklist.md`

---

**Powered by Musuhi** - Specification Driven Development for AI-assisted coding
