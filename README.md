# MUSUBI

**Ultimate Specification Driven Development Tool with 25 Claude Code Skills**

MUSUBI is a comprehensive SDD (Specification Driven Development) framework that synthesizes the best features from 6 leading frameworks into a production-ready tool for Claude Code.

## Features

- 🎯 **25 Specialized Claude Code Skills** - Orchestrator, Steering, Requirements, Architecture, Development, Quality, Security, Infrastructure, and more
- 📋 **Constitutional Governance** - 9 immutable articles + Phase -1 Gates for quality enforcement
- 📝 **EARS Requirements Format** - Unambiguous requirements with complete traceability
- 🔄 **Delta Specifications** - Brownfield and greenfield project support
- 🧭 **Auto-Updating Project Memory** - Steering system maintains architecture, tech stack, and product context
- ✅ **Complete Traceability** - Requirements → Design → Code → Tests mapping
- 🤖 **Multi-Agent Orchestration** - 5 orchestration patterns for complex workflows

## Quick Start

### Installation via npx

```bash
# Initialize MUSUBI in your project
npx musubi-sdd init

# Or install globally
npm install -g musubi-sdd
musubi init
```

### What Gets Installed

```
your-project/
├── .claude/
│   ├── skills/              # 25 specialized skills
│   │   ├── orchestrator/
│   │   ├── steering/
│   │   ├── requirements-analyst/
│   │   └── ... (22 more)
│   └── commands/            # Slash commands (/sdd-*)
├── steering/
│   ├── structure.md         # Architecture patterns
│   ├── tech.md              # Technology stack
│   ├── product.md           # Product context
│   └── rules/
│       ├── constitution.md  # 9 Constitutional Articles
│       ├── workflow.md      # 8-Stage SDD workflow
│       └── ears-format.md   # EARS syntax guide
├── templates/               # Document templates
└── storage/                 # Specs, changes, features
```

## Usage

### Slash Commands

```bash
# Generate project memory
/sdd-steering

# Create requirements
/sdd-requirements authentication

# Design architecture
/sdd-design authentication

# Break down into tasks
/sdd-tasks authentication

# Implement feature
/sdd-implement authentication

# Validate constitutional compliance
/sdd-validate authentication
```

### Skills (Auto-Invoked by Claude)

Claude Code will automatically select the appropriate skill based on your request:

- "Review my code" → `code-reviewer` skill
- "Create requirements for user login" → `requirements-analyst` skill
- "Design API for payment" → `api-designer` skill
- "Set up monitoring" → `site-reliability-engineer` skill

## 25 Skills Overview

### Orchestration & Management (3)
- **orchestrator** - Master coordinator for multi-skill workflows
- **steering** - Project memory manager (auto-updating context)
- **constitution-enforcer** - Governance validation (9 Articles + Phase -1 Gates)

### Requirements & Planning (3)
- **requirements-analyst** - EARS format requirements generation
- **project-manager** - Project planning, scheduling, risk management
- **change-impact-analyzer** - Brownfield change analysis

### Architecture & Design (4)
- **system-architect** - C4 model + ADR architecture design
- **api-designer** - REST/GraphQL/gRPC API design
- **database-schema-designer** - Database design, ER diagrams, DDL
- **ui-ux-designer** - UI/UX design, wireframes, prototypes

### Development (1)
- **software-developer** - Multi-language code implementation

### Quality & Review (5)
- **test-engineer** - Unit, integration, E2E testing with EARS mapping
- **code-reviewer** - Code review, SOLID principles
- **bug-hunter** - Bug investigation, root cause analysis
- **quality-assurance** - QA strategy, test planning
- **traceability-auditor** - Requirements ↔ Code ↔ Test coverage validation

### Security & Performance (2)
- **security-auditor** - OWASP Top 10, vulnerability detection
- **performance-optimizer** - Performance analysis, optimization

### Infrastructure & Operations (5)
- **devops-engineer** - CI/CD pipelines, Docker/Kubernetes
- **cloud-architect** - AWS/Azure/GCP, IaC (Terraform/Bicep)
- **database-administrator** - Database operations, tuning
- **site-reliability-engineer** - Production monitoring, SLO/SLI, incident response
- **release-coordinator** - Multi-component release management

### Documentation & Specialized (2)
- **technical-writer** - Technical documentation, API docs
- **ai-ml-engineer** - ML model development, MLOps

## Constitutional Governance

MUSUBI enforces 9 immutable constitutional articles:

1. **Library-First Principle** - Features start as libraries
2. **CLI Interface Mandate** - All libraries expose CLI
3. **Test-First Imperative** - Tests before code (Red-Green-Blue)
4. **EARS Requirements Format** - Unambiguous requirements
5. **Traceability Mandate** - 100% coverage required
6. **Project Memory** - All skills check steering first
7. **Simplicity Gate** - Maximum 3 projects initially
8. **Anti-Abstraction Gate** - Use framework features directly
9. **Integration-First Testing** - Real services over mocks

## SDD Workflow (8 Stages)

```
1. Research → 2. Requirements → 3. Design → 4. Tasks →
5. Implementation → 6. Testing → 7. Deployment → 8. Monitoring
```

Each stage has:
- Dedicated skills
- Quality gates
- Traceability requirements
- Constitutional validation

## EARS Requirements Format

```markdown
### Requirement: User Login

WHEN user provides valid credentials,
THEN the system SHALL authenticate the user
AND the system SHALL create a session.

#### Scenario: Successful login
- WHEN user enters correct email and password
- THEN system SHALL verify credentials
- AND system SHALL redirect to dashboard
```

## Delta Specifications (Brownfield)

```markdown
## ADDED Requirements
### REQ-NEW-001: Two-Factor Authentication
...

## MODIFIED Requirements
### REQ-001: User Authentication
**Previous**: Email + password
**Updated**: Email + password + OTP
...

## REMOVED Requirements
### REQ-OLD-005: Remember Me
**Reason**: Security policy change
```

## Example Usage

### Greenfield Project (0→1)

```bash
# 1. Initialize
npx musubi-sdd init

# 2. Generate steering
/sdd-steering

# 3. Create requirements
/sdd-requirements user-authentication

# 4. Design architecture
/sdd-design user-authentication

# 5. Break into tasks
/sdd-tasks user-authentication

# 6. Implement
/sdd-implement user-authentication
```

### Brownfield Project (1→n)

```bash
# 1. Initialize with existing codebase
npx musubi-sdd init

# 2. Generate steering from existing code
/sdd-steering

# 3. Create change proposal
/sdd-change-init add-2fa

# 4. Impact analysis (automatic via change-impact-analyzer skill)

# 5. Implement change
/sdd-change-apply add-2fa

# 6. Archive change
/sdd-change-archive add-2fa
```

## Configuration

### MCP Server Integration

MUSUBI integrates with MCP servers for enhanced capabilities:

- **Context7 MCP** - Up-to-date library documentation (Next.js, React, etc.)
- **Azure MCP** - Azure resource management
- **Microsoft Learn MCP** - Microsoft documentation

Skills automatically use available MCP servers when needed.

### Customization

Edit steering files to customize for your project:

```bash
# Architecture patterns
steering/structure.md

# Technology stack
steering/tech.md

# Product context
steering/product.md

# Constitutional rules (if needed)
steering/rules/constitution.md
```

## Development

```bash
# Clone repository
git clone https://github.com/your-org/musubi.git
cd musubi

# Install dependencies
npm install

# Run tests
npm test

# Link for local development
npm link
musubi init
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

MUSUBI synthesizes features from:
- **musuhi** - 20-agent system, steering, EARS format
- **OpenSpec** - Delta specs, brownfield support
- **ag2** (AutoGen) - Multi-agent orchestration
- **ai-dev-tasks** - Simplicity, progressive complexity
- **cc-sdd** - P-label parallelization, validation gates
- **spec-kit** - Constitutional governance, test-first

## Learn More

- [Documentation](https://musubi-sdd.dev)
- [Blueprint](Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md)
- [Project Plan](PROJECT-PLAN-MUSUBI.md)
- [Framework Comparison](SDD-Framework-Comparison-Report.md)

---

**MUSUBI** - むすび - Bringing specifications, design, and code together.
