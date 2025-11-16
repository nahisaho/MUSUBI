# MUSUBI - Product Context and Business Domain

**Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Planning Phase

---

## Overview

MUSUBI (derived from "musuhi" - connecting/binding) is a **next-generation Specification Driven Development (SDD) tool** that synthesizes the best features from six leading frameworks into a unified, comprehensive platform. It transforms software development from code-first to specification-first, ensuring traceability, quality, and governance throughout the entire development lifecycle.

---

## Vision and Mission

### Vision Statement

**"Make specification-driven development the new standard for software teams worldwide."**

MUSUBI envisions a world where:
- Software teams start with clear, testable specifications before writing code
- Requirements, design, code, and tests are fully traceable and synchronized
- Quality is enforced through constitutional governance, not manual reviews
- Both greenfield (0→1) and brownfield (1→n) projects benefit from structured workflows
- AI assistants seamlessly orchestrate 25 specialized skills to accelerate development

### Mission Statement

**"Provide the ultimate Specification Driven Development tool that combines the best of six leading SDD frameworks, powered by Claude Code Skills API, to deliver production-ready software with unmatched quality and traceability."**

### Core Values

1. **Specification-First**: All features begin with EARS-format requirements
2. **Traceability**: 100% mapping from requirements to code to tests
3. **Constitutional Governance**: Quality enforced through immutable principles
4. **Simplicity**: Progressive complexity (2-file PRD → 25-skill orchestration)
5. **Openness**: Open source, universal AI compatibility, zero vendor lock-in
6. **Community**: Collaborative development, transparent roadmap

---

## Product Purpose

### What is MUSUBI?

MUSUBI is a **comprehensive SDD framework** implemented as:
- **25 Claude Code Skills**: Specialized AI agents covering all 8 SDD workflow stages
- **Constitutional Governance System**: 9 immutable articles + Phase -1 Gates
- **Delta Specification System**: Change management for brownfield projects
- **Auto-Updating Project Memory**: Steering system that tracks architecture, tech stack, and business context
- **Multi-Agent Orchestration**: Intelligent skill selection and parallel execution
- **Complete Traceability**: Requirement ↔ Design ↔ Code ↔ Test mapping

### Problem Statement

**Current State**: Software teams struggle with specification-driven development due to fragmented tooling.

**Problems MUSUBI Solves**:

1. **Fragmentation**: Existing SDD frameworks each excel in different areas but lack comprehensive coverage
   - musuhi: 20 agents, but no brownfield support
   - OpenSpec: Delta specs, but no agent system
   - ag2: Multi-agent orchestration, but not SDD-specific
   - ai-dev-tasks: Simple onboarding, but limited (2 files only)
   - cc-sdd: Good workflow, but Kiro-dependent
   - spec-kit: Constitutional governance, but rigid

2. **Incomplete Workflows**: No single tool covers all 8 SDD stages (Research → Monitoring)

3. **Poor Governance**: Manual enforcement of quality gates and constitutional principles

4. **Limited Brownfield Support**: Most tools focus on greenfield (0→1) projects only

5. **No Traceability**: Requirement ↔ Code ↔ Test mapping is manual and error-prone

6. **Vendor Lock-in**: Tools tied to specific IDEs or AI platforms

**Impact of These Problems**:
- 20-30% rework rate due to specification-code misalignment
- 3+ days per feature for manual specification writing
- Inconsistent quality and governance across teams
- Difficulty adapting existing codebases (brownfield projects)

### Solution: MUSUBI's Approach

**Synthesis of Best Practices**:
- **From musuhi**: 25 specialized skills, auto-updating steering
- **From OpenSpec**: Delta specifications for change management
- **From ag2**: Multi-agent orchestration patterns (auto, sequential, parallel, nested, human-loop)
- **From ai-dev-tasks**: Progressive complexity (simple 2-file PRD for beginners)
- **From cc-sdd**: 8-stage SDD workflow (Research → Monitoring)
- **From spec-kit**: Constitutional governance (9 Articles + Phase -1 Gates)

**Unique Differentiators**:
1. **Complete Coverage**: 100% of 8 SDD workflow stages
2. **Automated Governance**: Constitution-enforcer skill validates all artifacts
3. **Dual Project Support**: Greenfield (0→1) and brownfield (1→n)
4. **Platform Agnostic**: Works with 13+ AI coding assistants
5. **Progressive Complexity**: Scale from 2-file PRD to 25-skill orchestration
6. **Zero Vendor Lock-in**: Markdown-based, portable, open source

---

## Target Users

### Primary Audience

**Software Development Teams** (5-50 developers)
- **Use Case**: Building greenfield products or maintaining brownfield systems
- **Needs**: Structured workflow, quality enforcement, traceability, fast onboarding
- **Challenges**: Balancing speed with quality, managing technical debt, coordinating multiple developers
- **MUSUBI Benefits**:
  - Constitutional governance ensures consistent quality
  - Delta specs manage brownfield changes without breaking existing code
  - Auto-updating steering keeps all developers aligned
  - Traceability auditor catches missing coverage

**User Persona**: "Alex, Tech Lead at a 20-person startup"
- **Goals**: Ship features fast without accumulating technical debt
- **Pain Points**: Manual code reviews miss architectural violations, requirements drift from code
- **How MUSUBI Helps**: Constitution-enforcer blocks non-compliant code, traceability-auditor ensures 100% requirement coverage

### Secondary Audience

**Enterprise Organizations** (100-1000+ developers)
- **Use Case**: Large-scale software development with strict compliance requirements
- **Needs**: Audit trails, governance enforcement, multi-team coordination, compliance (SOC2, ISO27001)
- **Challenges**: Coordinating multiple teams, ensuring consistency, auditing traceability
- **MUSUBI Benefits**:
  - Constitutional governance provides audit trails
  - Traceability matrix proves requirement coverage
  - Steering system ensures architectural consistency across teams
  - Change impact analyzer prevents breaking changes

**User Persona**: "Jordan, Director of Engineering at Fortune 500 company"
- **Goals**: Meet compliance requirements, coordinate 10+ teams, reduce rework
- **Pain Points**: Manual audits are expensive, teams use inconsistent processes
- **How MUSUBI Helps**: Automated constitutional validation, centralized steering, complete traceability for audits

### Tertiary Audience

**Open Source Projects**
- **Use Case**: Community-driven development with varying contributor skill levels
- **Needs**: Clear contribution guidelines, consistent code quality, easy onboarding
- **Challenges**: Inconsistent contributions, lack of documentation, hard to onboard new contributors
- **MUSUBI Benefits**:
  - Constitutional governance ensures all PRs meet quality standards
  - Auto-updating steering documents architecture automatically
  - EARS requirements make features clear to contributors

**Solo Developers / Indie Hackers**
- **Use Case**: Building side projects or MVPs quickly
- **Needs**: Speed, simplicity, no overhead
- **Challenges**: Balancing speed with maintainability
- **MUSUBI Benefits**:
  - Progressive complexity: Start with 2-file PRD, scale to 25 skills as needed
  - Constitutional simplicity gate prevents over-engineering
  - Auto-generated documentation

---

## Business Context

### Market Opportunity

**Total Addressable Market (TAM)**: 26M developers worldwide × $50/month = $15.6B/year

**Serviceable Addressable Market (SAM)**: 5M team developers (working in teams of 5+) × $50/month = $3B/year

**Serviceable Obtainable Market (SOM)**: 50K developers (1% of SAM) × $50/month = $30M/year (Year 3 target)

**Market Gap**: No existing tool offers comprehensive SDD with:
- 25+ specialized AI skills
- Constitutional governance (9 immutable articles)
- Delta-based change tracking
- Multi-agent orchestration (ag2 patterns)
- Auto-updating project memory
- Full greenfield + brownfield support
- Universal AI tool compatibility (13+ tools)

### Competitive Landscape

**Direct Competitors**:
- **Kiro IDE**: Spec-driven development, paid, proprietary, IDE-dependent
  - **MUSUBI Advantage**: Open source, platform-agnostic, more comprehensive
- **spec-kit**: Constitutional governance, rigid, manual
  - **MUSUBI Advantage**: Automated enforcement, 25 skills, flexible

**Indirect Competitors**:
- **Linear**: Project management, not SDD-specific
- **Jira**: Issue tracking, no traceability or governance
- **Notion**: Documentation, no code integration

**Differentiation**: MUSUBI is the **only tool** combining:
- AI-powered skills (25 specialized agents)
- Constitutional governance (automated enforcement)
- Change management (delta specs)
- Multi-platform support (13+ AI assistants)

### Revenue Model (Future)

**Phase 1 (Months 1-18)**: Open Source Launch
- Free and open source (Apache 2.0 license)
- Focus: Community growth, GitHub stars, active users
- Revenue: $0 (investment phase)

**Phase 2 (Year 2)**: Freemium Model
- **Free Tier**: All 25 skills, local usage, community support
- **Pro Tier** ($50/user/month):
  - Team collaboration features
  - Audit trails and compliance reports
  - Priority support (SLA)
  - Advanced traceability analytics
- **Enterprise Tier** ($200/user/month):
  - On-premises deployment
  - Custom constitutional articles
  - Dedicated support
  - SSO, RBAC, audit logs

**Phase 3 (Year 3+)**: Platform Expansion
- Marketplace for custom skills
- Consulting services (SDD implementation)
- Training and certification programs

---

## Core Capabilities

### 1. Complete SDD Workflow (8 Stages)

**Stage 1: Research**
- **Skills**: steering, performance-optimizer
- **Deliverables**: Project memory (steering files), technical research

**Stage 2: Requirements**
- **Skills**: requirements-analyst, project-manager, change-impact-analyzer
- **Deliverables**: EARS-format requirements, project plan, change proposals

**Stage 3: Design**
- **Skills**: system-architect, api-designer, database-schema-designer, ui-ux-designer
- **Deliverables**: C4 diagrams, ADR, API specs, DB schema, UI wireframes

**Stage 4: Tasks**
- **Skills**: orchestrator, project-manager
- **Deliverables**: P-labeled tasks (parallel execution plan)

**Stage 5: Implementation**
- **Skills**: software-developer, code-reviewer, bug-hunter
- **Deliverables**: Code, bug fixes, refactoring

**Stage 6: Testing**
- **Skills**: test-engineer, quality-assurance, security-auditor
- **Deliverables**: Unit/integration/E2E tests, QA plan, security audit

**Stage 7: Deployment**
- **Skills**: devops-engineer, cloud-architect, database-administrator, release-coordinator
- **Deliverables**: CI/CD pipelines, infrastructure code, release plan

**Stage 8: Monitoring**
- **Skills**: site-reliability-engineer
- **Deliverables**: SLO/SLI definitions, monitoring dashboards, incident runbooks

### 2. Constitutional Governance

**9 Constitutional Articles** (immutable, enforced by constitution-enforcer skill):
1. **Library-First Principle**: Every feature starts as a library
2. **CLI Interface Mandate**: All libraries must expose CLI
3. **Test-First Imperative**: No code before tests (Red→Green→Blue)
4. **EARS Requirements Format**: All requirements use EARS patterns
5. **Traceability Mandate**: 100% Requirement ↔ Design ↔ Code ↔ Test
6. **Project Memory**: Skills check steering before work
7. **Simplicity Gate**: ≤3 projects, no future-proofing
8. **Anti-Abstraction Gate**: Use frameworks directly, no wrappers
9. **Integration-First Testing**: Real services, contracts mandatory

**Phase -1 Gates** (pre-implementation validation):
- All gates must pass before any implementation begins
- Automated validation by constitution-enforcer skill
- Prevents technical debt at the source

### 3. Delta Specification System

**Greenfield Projects (0→1)**:
- Full specifications in `storage/specs/[capability]/`
- Complete requirements, design, tasks from scratch

**Brownfield Projects (1→n)**:
- Change proposals in `storage/changes/[change-id]/`
- Impact analysis via change-impact-analyzer skill
- Traceability to original specs via delta files
- Archive completed changes

**Workflow**:
```
/sdd-change-init → Proposal → Impact Analysis → Implementation → Archive
```

### 4. Auto-Updating Project Memory

**Steering Files**:
- `steering/structure.md`: Architecture patterns, directory organization
- `steering/tech.md`: Technology stack, frameworks, tools
- `steering/product.md`: Business context, product purpose, users (this file)

**Auto-Update Triggers**:
| Skill Completed | Updates |
|-----------------|---------|
| system-architect | structure.md (architecture patterns) |
| api-designer | tech.md (API conventions) |
| database-schema-designer | tech.md (DB patterns) |
| cloud-architect | tech.md + structure.md (infrastructure) |
| software-developer | tech.md (new dependencies) |
| requirements-analyst | product.md (new features, business rules) |

**Benefits**:
- Always up-to-date project context
- No stale documentation
- All skills reference current truth

### 5. Multi-Agent Orchestration

**5 Orchestration Patterns** (from ag2):
1. **Auto-Selection**: Orchestrator analyzes intent → selects skills → executes
2. **Sequential**: Linear workflow (Research → Requirements → Design → ...)
3. **Parallel**: P-labeled tasks execute simultaneously
4. **Nested Delegation**: Sub-orchestrators for complex domains
5. **Human-in-the-Loop**: Validation gates requiring user approval

**Example**:
```
User: "Build a user authentication feature"
  ↓
orchestrator (auto-selection):
  1. requirements-analyst → EARS requirements
  2. system-architect + api-designer + database-schema-designer (parallel)
  3. software-developer → Implementation
  4. test-engineer → Test suite
  5. constitution-enforcer → Validate compliance
```

### 6. Complete Traceability

**Traceability Matrix**:
```
Requirement → Design → Code → Test
[REQ-001]   → [ARCH-001] → [src/auth.ts] → [test/auth.test.ts]
```

**Enforced by**:
- `traceability-auditor` skill
- `validators/traceability.py` script
- Constitutional Article V (Traceability Mandate)

**Benefits**:
- Prove 100% requirement coverage
- Detect orphaned code (code with no requirement)
- Detect missing tests (requirements with no test)
- Audit trail for compliance (SOC2, ISO27001)

---

## User Journeys

### Journey 1: Greenfield Project (Startup Building MVP)

**User**: Alex, Tech Lead at 5-person startup

**Goal**: Build authentication feature for SaaS product

**Steps**:
1. Initialize project: `/sdd-constitution` → Creates constitutional governance
2. Generate project memory: `/sdd-steering` → Analyzes codebase, creates steering files
3. Create requirements: `/sdd-requirements` → requirements-analyst generates EARS requirements
4. Design architecture: `/sdd-design` → system-architect + api-designer create design
5. Break down tasks: `/sdd-tasks` → orchestrator generates P-labeled tasks
6. Implement: `/sdd-implement` → software-developer writes code, test-engineer writes tests
7. Validate: `constitution-enforcer` runs Phase -1 Gates → All pass
8. Deploy: `devops-engineer` creates CI/CD pipeline
9. Monitor: `site-reliability-engineer` sets up SLO/SLI

**Outcome**: Feature shipped in 3 days (vs. 5 days without MUSUBI), 100% test coverage, zero technical debt

### Journey 2: Brownfield Change (Enterprise Refactoring)

**User**: Jordan, Director of Engineering at Fortune 500 company

**Goal**: Migrate authentication from custom solution to OAuth 2.0

**Steps**:
1. Initialize change: `/sdd-change-init` → Creates change proposal
2. Analyze impact: `change-impact-analyzer` → Identifies affected components (10 services)
3. Review proposal: Human approval required (validation gate)
4. Design changes: `api-designer` updates API specs (backward-compatible)
5. Implement incrementally: `software-developer` + `test-engineer` (feature flags)
6. Validate traceability: `traceability-auditor` confirms 100% coverage
7. Deploy gradually: `release-coordinator` manages rollout (10% → 50% → 100%)
8. Archive change: `/sdd-change-archive` → Moves to archive, updates specs

**Outcome**: Migration completed in 6 weeks (vs. 12 weeks without MUSUBI), zero downtime, full audit trail for compliance

### Journey 3: Open Source Contribution (New Contributor)

**User**: Sam, first-time contributor to MUSUBI project

**Goal**: Add new skill for cost optimization (FinOps)

**Steps**:
1. Read steering files: `steering/structure.md`, `steering/tech.md` → Understand architecture
2. Check existing skills: `orchestrator/selection-matrix.md` → See 25 existing skills
3. Propose skill: GitHub Discussion → Community feedback
4. Create skill file: `.claude/skills/finops-engineer/SKILL.md` (YAML + prompt)
5. Add tests: `validators/` → Test skill selection logic
6. Submit PR: GitHub → constitutional validation runs automatically
7. Pass validation: All Phase -1 Gates pass → PR approved

**Outcome**: New skill merged in 2 weeks, contributor becomes maintainer

---

## Success Metrics (KPIs)

### Development KPIs (Internal)

| Metric | Target | Measurement |
|--------|--------|-------------|
| SDD Workflow Coverage | 100% (8/8 stages) | All stages have dedicated skills |
| Constitutional Compliance | 100% | All artifacts pass Phase -1 Gates |
| Test Coverage | ≥80% | pytest-cov for all validators |
| Traceability | 100% | All requirements mapped to code + tests |
| Documentation Completeness | 100% | All 25 skills documented |

### User Adoption KPIs (External)

| Metric | Month 6 | Month 12 | Month 18 |
|--------|---------|----------|----------|
| GitHub Stars | 500+ | 1,000+ | 5,000+ |
| Active Users | 500+ | 2,000+ | 10,000+ |
| Community PRs | 10+ | 20+ | 100+ |
| Documentation Views | 5,000/mo | 10,000/mo | 50,000/mo |

### Business Impact KPIs (User Value)

| Metric | Target | Industry Average | MUSUBI Advantage |
|--------|--------|------------------|------------------|
| Time-to-Market | 30-50% faster | - | Constitutional governance prevents rework |
| Specification Time | 3 hours | 3 days | 90% reduction via AI-generated specs |
| Rework Rate | <10% | 20-30% | Traceability catches misalignment early |
| Developer Productivity | 2x features/month | 1x | Multi-agent orchestration |

---

## Roadmap and Evolution

### Phase 1: Core Framework (Months 1-3)

**Deliverables**:
- 25 skills implemented
- Constitutional governance operational
- Core templates and validators
- CLI tool (optional)

**User Value**: Complete SDD workflow, quality enforcement

### Phase 2: Change Management (Months 4-6)

**Deliverables**:
- Delta specs for brownfield
- Change workflow (init → apply → archive)
- Validation gates
- Traceability auditor

**User Value**: Brownfield support, enterprise-grade change management

### Phase 3: Multi-Skill Orchestration (Months 7-9)

**Deliverables**:
- 5 orchestration patterns (auto, sequential, parallel, nested, human-loop)
- Parallel execution with P-labels
- Tool ecosystem integration (MCP servers)

**User Value**: Complex workflows, faster execution

### Phase 4: Monitoring & Operations (Months 10-12)

**Deliverables**:
- SRE skill (SLO/SLI, incident response)
- Release coordinator skill
- Production monitoring templates

**User Value**: Complete DevOps lifecycle (dev → deploy → monitor)

### Phase 5: Advanced Features (Months 13-15)

**Deliverables**:
- Steering auto-update enhancements
- Template constraints (custom constitutional articles)
- Quality metrics dashboard

**User Value**: Customization, analytics

### Phase 6: Ecosystem Integration (Months 16-18)

**Deliverables**:
- Multi-platform support (13+ AI assistants)
- CI/CD templates (GitHub Actions, GitLab CI, Jenkins)
- Documentation website (MkDocs/Docusaurus)
- Official v1.0 launch

**User Value**: Platform choice, production readiness

---

## Key Differentiators

### vs. Existing SDD Frameworks

| Feature | MUSUBI | musuhi | OpenSpec | ag2 | cc-sdd | spec-kit |
|---------|--------|--------|----------|-----|--------|----------|
| Skills/Agents | 25 | 20 | 0 | Generic | N/A | 0 |
| Brownfield Support | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Constitutional Governance | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (manual) |
| Traceability | ✅ (automated) | ✅ | ✅ | ❌ | ✅ | ✅ |
| Multi-Agent Orchestration | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Platform Agnostic | ✅ | ✅ | ✅ | ❌ | ❌ (Kiro) | ✅ |
| Open Source | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| 8-Stage SDD Workflow | ✅ | Partial | Partial | ❌ | ✅ | Partial |

**MUSUBI is the only framework with ALL features.**

---

## References

- **Project Plan**: PROJECT-PLAN-MUSUBI.md (18-month roadmap, budget, team)
- **Blueprint**: Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md (technical architecture)
- **Skills Inventory**: SKILLS-AUDIT-REPORT.md (25 skills categorization)
- **Framework Comparison**: SDD-Framework-Comparison-Report.md (6 frameworks analyzed)
- **Constitutional Governance**: steering/rules/constitution.md (to be created)
- **SDD Workflow**: steering/rules/workflow.md (to be created)

---

**Document Owner**: steering skill
**Maintained by**: Auto-update rules (requirements-analyst updates this file) + manual review
**Review Frequency**: Quarterly or when product strategy changes occur
