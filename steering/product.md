# Product Context

## Overview
This document defines the business context, product purpose, and core capabilities. It helps AI agents understand the "why" behind development decisions and ensures alignment with business goals.

**Last Updated**: 2025-01-16 by @steering

## Product Vision

### What We're Building
**MUSUBI (むすび - "結び" - "to bind/connect")** - The Ultimate Specification Driven Development Tool that binds specifications, design, and code together through constitutional governance and multi-agent support.

MUSUBI is a comprehensive CLI-distributed SDD framework that:
- Supports 7 AI coding agents (Claude Code, GitHub Copilot, Cursor, Gemini CLI, Codex CLI, Qwen Code, Windsurf)
- Provides 25 specialized skills for Claude Code (Skills API exclusive)
- Enforces 9 Constitutional Articles for quality governance
- Maintains project memory (steering system) that auto-updates
- Uses EARS requirements format for unambiguous specifications
- Enables both Greenfield (0→1) and Brownfield (1→n) workflows

### Problem We're Solving
AI coding assistants have dramatically increased development speed, but **quality and traceability have suffered**:

**Pain Points**:
- **Ambiguous requirements**: "Please add user authentication" → What standard? Which features? What security level?
- **Lost traceability**: Code exists, but why? Which requirement does it fulfill? Which tests validate it?
- **Inconsistent quality**: Different AI agents produce different code styles and architectures
- **No governance**: Features implemented without architectural review or constitutional compliance
- **Brownfield chaos**: Changing existing code without impact analysis causes regressions
- **Multi-agent incompatibility**: Tools built for one AI agent don't work with others

### Target Users
**Primary Audience**: Developers using AI coding assistants (Claude Code, GitHub Copilot, Cursor, etc.)
- **Role/Title**: Full-stack developers, backend engineers, DevOps engineers, tech leads
- **Company Size**: Startups to enterprises (any team using AI-assisted development)
- **Technical Level**: Intermediate to advanced (comfortable with CLI tools, git, markdown)
- **AI Experience**: Using or evaluating AI coding agents

**Secondary Audience**: Engineering managers and architects
- Need to ensure quality and consistency across AI-assisted development
- Want traceability from requirements to code
- Need to enforce architectural standards (constitutional governance)

## Core Capabilities

### Must-Have Features (Implemented)

1. **Multi-Agent Support (7 Platforms)**
   - **User Value**: Use MUSUBI with your preferred AI coding agent
   - **Capabilities**: Claude Code, GitHub Copilot, Cursor, Gemini CLI, Codex CLI, Qwen Code, Windsurf
   - **Priority**: Critical (core differentiator)

2. **Constitutional Governance (9 Articles)**
   - **User Value**: Enforce quality standards automatically before implementation
   - **Capabilities**: 
     - Article I: Library-First Principle
     - Article II: CLI Interface Mandate
     - Article III: Test-First Imperative (Red-Green-Blue)
     - Article IV: EARS Requirements Format
     - Article V: Traceability Mandate (Requirements ↔ Design ↔ Code ↔ Tests)
     - Article VI: Project Memory (Steering System)
     - Article VII: Bilingual Documentation (English/Japanese)
     - Article VIII: Single Source of Truth
     - Article IX: Real Services in Tests (No Mocks)
   - **Priority**: Critical (quality enforcement)

3. **EARS Requirements Format**
   - **User Value**: Eliminate ambiguity, ensure testability
   - **Capabilities**: 5 EARS patterns (Event-driven, State-driven, Unwanted behavior, Optional features, Ubiquitous)
   - **Priority**: Critical (foundation of SDD)

4. **Project Memory (Steering System)**
   - **User Value**: AI agents auto-learn project context (architecture, tech stack, business domain)
   - **Capabilities**: `structure.md`, `tech.md`, `product.md` maintained automatically
   - **Priority**: Critical (context continuity)

5. **25 Claude Code Skills** (Claude Code Exclusive)
   - **User Value**: Specialized AI agents for every SDD stage
   - **Capabilities**: Orchestrator, Steering, Requirements, Architecture, Development, Quality, Security, Infrastructure, Documentation
   - **Priority**: High (Claude Code users)

6. **Greenfield & Brownfield Workflows**
   - **User Value**: Support both new projects (0→1) and existing codebases (1→n)
   - **Capabilities**:
     - Greenfield: 8-stage SDD workflow (Research → Monitoring)
     - Brownfield: Delta Specs (ADDED/MODIFIED/REMOVED), change impact analysis
   - **Priority**: Critical (real-world flexibility)

7. **Complete Traceability**
   - **User Value**: Track every requirement through design, code, and tests
   - **Capabilities**: Traceability matrix, audit trail, constitutional validation
   - **Priority**: High (compliance, maintenance)

8. **Bilingual Documentation**
   - **User Value**: All generated documents in English + Japanese
   - **Capabilities**: `.md` (English primary), `.ja.md` (Japanese translation)
   - **Priority**: Medium (Japanese market focus)

### Nice-to-Have Features (Future Roadmap)

- **Visual Studio Code Extension**: GUI for musubi commands (future)
- **GitHub Actions Integration**: Auto-run constitutional validation on PR (future)
- **Template Marketplace**: Community-contributed skill templates (future)
- **Metrics Dashboard**: Track SDD workflow metrics over time (future)
- **AI Model Comparison**: A/B test different AI models with same prompts (future)

### Explicitly Out of Scope

**MUSUBI is a CLI tool, NOT**:
- ❌ **Not a hosted service** (no cloud infrastructure, no SaaS)
- ❌ **Not an AI model** (uses existing AI agents, doesn't train models)
- ❌ **Not a code generator** (templates for AI agents, not code generation itself)
- ❌ **Not a project management tool** (no issue tracking, no kanban boards)
- ❌ **Not a CI/CD pipeline** (provides templates, but doesn't run pipelines)
- ❌ **Not a testing framework** (enforces test-first, but uses jest/vitest/etc.)
- ❌ **Not a documentation platform** (generates markdown, not hosted docs)

## Business Model

### Revenue Model
**Open Source / Free Forever** - MUSUBI is a public npm package distributed freely.

**No Monetization Plan** - Built as a reference implementation and research project:
- Demonstrates SDD best practices
- Synthesizes 6 leading SDD frameworks
- Educates developers on specification-driven development
- Showcases multi-agent architecture patterns

**Potential Future Revenue Streams** (not implemented):
- Premium templates / skill marketplace (community-driven)
- Enterprise consulting (SDD adoption, custom constitutional articles)
- Hosted SDD platform (if demand exists)

### Key Metrics
Success metrics for MUSUBI (community/adoption focus):

**Adoption Metrics**:
- npm downloads per week (npm install, npx usage)
- GitHub stars and forks
- Number of projects using MUSUBI (via telemetry opt-in, future)
- Community contributions (PRs, issues, skill templates)

**Quality Metrics**:
- Constitutional compliance rate (% of projects passing validation)
- Test coverage of MUSUBI-generated code (target: 80%+)
- Traceability completeness (requirements → tests mapping)

**Community Metrics**:
- Documentation page views (GitHub, Qiita article)
- Agent diversity (% of users per AI agent type)
- Skill adoption (which of 25 skills are most used)

## User Personas

### Persona 1: Kenji (Claude Code Power User)
**Background**: Senior full-stack developer at Tokyo startup, 8 years experience, uses Claude Code daily
**Goals**:
- Build features faster with AI while maintaining quality
- Enforce architectural standards across team
- Maintain traceability from requirements to deployment

**Pain Points**:
- Claude Code generates code without requirements documentation
- Hard to review AI-generated code (where did this design come from?)
- Junior developers skip testing when using AI copilots
- No way to enforce "library-first" principle with AI

**How They Use MUSUBI**:
- **Daily**: `/sdd-requirements [feature]` → `/sdd-design [feature]` → `/sdd-implement [feature]`
- **Weekly**: `/sdd-validate` to check constitutional compliance
- **Monthly**: `@steering` to update project memory after architecture changes
- **Uses**: All 25 Claude Code skills, especially `@orchestrator` for complex workflows

### Persona 2: Sarah (GitHub Copilot User, Tech Lead)
**Background**: Tech lead at US SaaS company, manages 5-person team, evaluating AI coding tools
**Goals**:
- Adopt AI assistants without sacrificing code quality
- Ensure team follows SOLID principles
- Maintain audit trail for compliance (SOC 2)

**Pain Points**:
- GitHub Copilot fast but produces inconsistent code
- No way to enforce "test-first" with Copilot
- Team skips requirements documentation ("Copilot knows what to do")
- Cannot track which Copilot suggestion fulfilled which requirement

**How They Use MUSUBI**:
- **Daily**: `#sdd-requirements` → `#sdd-implement` via GitHub Copilot chat
- **Weekly**: `musubi validate` CLI to check constitutional compliance
- **Monthly**: Review traceability matrix (requirements ↔ code ↔ tests)
- **Uses**: Commands only (GitHub Copilot doesn't support Skills API)

### Persona 3: Taro (Brownfield Migration Engineer)
**Background**: Backend engineer refactoring legacy monolith to microservices, 10 years experience
**Goals**:
- Modernize codebase incrementally without breaking production
- Document all changes with impact analysis
- Use AI to accelerate refactoring (Cursor IDE)

**Pain Points**:
- Hard to know what depends on code being changed
- AI suggests changes without considering side effects
- No audit trail of "why this was changed"
- Regression bugs from incomplete refactoring

**How They Use MUSUBI**:
- **Daily**: `/sdd-change-init [change]` → analyze impact → `/sdd-change-apply`
- **Weekly**: `/sdd-change-archive` to document completed changes
- **Monthly**: Review Delta Specifications (ADDED/MODIFIED/REMOVED)
- **Uses**: Brownfield workflow with change-impact-analyzer skill

## Product Principles

### Design Principles (Constitutional Governance)
1. **Library-First**: All features start as independent libraries (Article I)
2. **CLI Interface Mandate**: All libraries expose CLI interfaces (Article II)
3. **Test-First Imperative**: Red-Green-Blue cycle enforced (Article III)
4. **EARS Requirements**: Unambiguous requirements only (Article IV)
5. **100% Traceability**: Requirements ↔ Design ↔ Code ↔ Tests (Article V)
6. **Project Memory**: Auto-updating steering context (Article VI)
7. **Bilingual First**: English + Japanese documentation (Article VII)
8. **Single Source of Truth**: No conflicting documents (Article VIII)
9. **Real Services in Tests**: No mocks for integration tests (Article IX)

### Development Priorities (MUSUBI itself)
When making tradeoffs:
1. **Simplicity > Features**: Keep CLI easy to use, avoid complexity
2. **Compatibility > Cutting Edge**: Support Node.js 18+ (LTS), not bleeding edge
3. **Documentation > Code**: Comprehensive examples and guides
4. **Community > Revenue**: Open source, free forever, community-driven
5. **Multi-Agent Support > Single-Agent Optimization**: Work across all 7 agents

## Competitive Landscape

### Main Competitors (SDD Frameworks)
1. **musuhi (predecessor)**: 20-agent system with EARS + steering
   - **Strengths**: Pioneered project memory, EARS format, multi-agent support
   - **Weaknesses**: No constitutional governance, no Claude Code skills, missing brownfield support
   - **MUSUBI Advantage**: Added 25 skills, 9 constitutional articles, Delta Specs

2. **OpenSpec**: Brownfield-focused, delta specifications
   - **Strengths**: Excellent change tracking (ADDED/MODIFIED/REMOVED)
   - **Weaknesses**: No greenfield support, no multi-agent support, no constitutional governance
   - **MUSUBI Advantage**: Both greenfield + brownfield, 7 agents, constitutional articles

3. **ag2 (AutoGen)**: Multi-agent orchestration
   - **Strengths**: Agent collaboration, task decomposition
   - **Weaknesses**: Python-only, no SDD workflow, no constitutional governance
   - **MUSUBI Advantage**: Node.js CLI, complete SDD workflow, constitutional enforcement

4. **spec-copilot (predecessor)**: GitHub Copilot prompts
   - **Strengths**: Simple, 19 specialized agents
   - **Weaknesses**: Copilot-only, no project memory, no requirements format
   - **MUSUBI Advantage**: 7 agents, project memory, EARS format, constitutional governance

5. **cc-sdd**: Multi-agent CLI tool
   - **Strengths**: Agent registry pattern, flexible architecture
   - **Weaknesses**: Limited to 6 agents, no constitutional governance
   - **MUSUBI Advantage**: 7 agents, 9 constitutional articles, 25 Claude Code skills

6. **ai-dev-tasks**: Task-based AI workflows
   - **Strengths**: Simple task templates
   - **Weaknesses**: No requirements format, no traceability, no governance
   - **MUSUBI Advantage**: EARS format, complete traceability, constitutional articles

### Our Differentiation (MUSUBI's Unique Value)
**Only SDD framework with ALL of**:
- ✅ Multi-agent support (7 platforms)
- ✅ Constitutional governance (9 articles)
- ✅ EARS requirements format
- ✅ Project memory (steering system)
- ✅ Greenfield + Brownfield workflows
- ✅ 25 specialized skills (Claude Code)
- ✅ Complete traceability (requirements → tests)
- ✅ Bilingual documentation (English/Japanese)

**MUSUBI = Synthesis of 6 Frameworks** - Best features from each, integrated into one tool.

## Domain Terminology

### Key Terms (MUSUBI Vocabulary)
Standard terminology to use consistently:

- **MUSUBI**: The ultimate SDD tool ("結び" = to bind/connect specifications, design, code)
- **SDD**: Specification Driven Development (requirements-first methodology)
- **EARS**: Easy Approach to Requirements Syntax (5 patterns for unambiguous requirements)
- **Constitutional Articles**: 9 immutable governance rules (Article I-IX)
- **Steering System**: Project memory (structure.md, tech.md, product.md)
- **Skills**: Claude Code specialized agents (25 total, Skills API exclusive)
- **Commands**: Slash commands or prompts (works across all 7 agents)
- **Agent**: AI coding assistant platform (Claude Code, GitHub Copilot, Cursor, etc.)
- **Template**: Source files in `src/templates/` copied to user projects
- **Greenfield**: New project workflow (0→1, full 8-stage SDD)
- **Brownfield**: Existing codebase workflow (1→n, Delta Specs, change impact)
- **Delta Spec**: Change specification (ADDED/MODIFIED/REMOVED requirements)
- **Traceability Matrix**: Mapping Requirements ↔ Design ↔ Code ↔ Tests
- **Phase -1**: Pre-implementation constitutional validation gate

### Avoid These Terms (Ambiguous or Confusing)
- ❌ Don't say "agent" for MUSUBI skills (say "skill" or "specialized skill")
- ❌ Don't say "prompt" for Skills API (say "skill", Skills are richer than prompts)
- ❌ Don't say "template" for EARS requirements (say "EARS pattern" or "requirements format")
- ❌ Don't say "governance" alone (specify "constitutional governance" - the 9 articles)
- ❌ Don't say "project context" (say "project memory" or "steering context")
- ❌ Don't say "spec" alone (specify "requirement spec", "design spec", or "delta spec")

## User Journey

### Typical User Flow (Claude Code, Greenfield Project)

1. **Installation** (one-time setup):
   ```bash
   npx musubi-sdd init --claude
   # Selects: Greenfield, All 25 skills
   ```
   → Installs `.claude/skills/`, `.claude/commands/`, `steering/`, `templates/`, `storage/`

2. **Project Initialization**:
   - `/sdd-steering` → Analyzes codebase, generates `structure.md`, `tech.md`, `product.md`
   - Reviews steering files, edits as needed
   - Constitutional articles now active (9 articles enforced)

3. **Feature Development** (daily):
   - `/sdd-requirements [feature]` → Creates EARS requirements
   - `/sdd-design [feature]` → Generates C4 diagrams, ADR, API specs
   - `/sdd-tasks [feature]` → Breaks down into implementation tasks
   - `/sdd-implement [feature]` → Test-first implementation (Red-Green-Blue)
   - `/sdd-validate [feature]` → Constitutional compliance check

4. **Weekly Maintenance**:
   - `musubi status` → Check project health
   - `musubi validate` → Quick constitutional check
   - `@traceability-auditor` → Verify requirements ↔ tests mapping

5. **Monthly Review**:
   - `/sdd-steering` → Update project memory (after major changes)
   - Review specifications in `storage/specs/`
   - Archive completed features

### Typical User Flow (GitHub Copilot, Brownfield Project)

1. **Installation**:
   ```bash
   npx musubi-sdd init --copilot
   # Selects: Brownfield (existing codebase)
   ```
   → Installs `.github/prompts/`, `steering/`, `templates/`, `storage/`

2. **Reverse Engineering**:
   - `#sdd-steering` → Analyzes existing code, generates steering context
   - Reviews and edits `structure.md`, `tech.md`, `product.md`

3. **Change Workflow** (daily):
   - `#sdd-change-init [change]` → Create change proposal
   - Review impact analysis (what files affected?)
   - `#sdd-change-apply` → Implement changes with tests
   - `#sdd-change-archive` → Archive completed change

4. **Migration Progress**:
   - Delta Specs track ADDED/MODIFIED/REMOVED requirements
   - Incremental constitutional compliance (legacy code exempt, new code enforced)
   - Traceability for new features only

## Integration Strategy

### Must-Have Integrations (Built-In)
Essential for MUSUBI function:

- **npm Registry**: Package distribution (musubi-sdd)
- **Git/GitHub**: Version control (steering files, specs, code)
- **Terminal/CLI**: Primary interface (bash, zsh, PowerShell, cmd)
- **Node.js**: Runtime environment (>=18.0.0)

### AI Agent Integrations (Supported Platforms)
MUSUBI integrates with 7 AI coding agents:

1. **Claude Code** (Skills API + Commands)
   - 25 specialized skills in `.claude/skills/`
   - 9 commands in `.claude/commands/`
   - Markdown format

2. **GitHub Copilot** (Commands only)
   - 9 prompts in `.github/prompts/`
   - Markdown format, `#` prefix

3. **Cursor IDE** (Commands only)
   - 9 commands in `.cursor/commands/`
   - Markdown format

4. **Gemini CLI** (Commands only)
   - 9 commands in `.gemini/commands/`
   - **TOML format** (unique to Gemini)

5. **Codex CLI** (Commands only)
   - 9 prompts in `.codex/prompts/`
   - Markdown format, `/prompts:` prefix

6. **Qwen Code** (Commands only)
   - 9 commands in `.qwen/commands/`
   - Markdown format

7. **Windsurf IDE** (Commands only)
   - 9 workflows in `.windsurf/workflows/`
   - Markdown format

### Future Integrations (Roadmap)
Nice to have, but not critical:

- **VS Code Extension**: GUI for musubi commands, skill marketplace
- **JetBrains IDEs**: Plugin for IntelliJ IDEA, PyCharm, etc.
- **GitHub Actions**: Auto-run constitutional validation on PR
- **Slack/Discord**: Notifications for constitutional violations
- **Jira/Linear**: Sync EARS requirements to issue tracker
- **Notion/Confluence**: Export steering context to team wiki

## Compliance & Regulations

### Requirements
**Not Applicable** - MUSUBI is a local CLI tool, not a hosted service.

**No Data Collection**:
- No user tracking or analytics
- No telemetry (opt-in future consideration)
- No cloud storage (all files local)
- No authentication or user accounts

**License**: MIT (open source, permissive)

**Privacy**: Users' projects remain on their own machines, MUSUBI never sees them.

## Roadmap Themes

### Current Version (v0.1.2 - Published)
✅ **Foundation Complete**:
- 7 AI agent support (Claude Code, GitHub Copilot, Cursor, Gemini CLI, Codex CLI, Qwen Code, Windsurf)
- 25 Claude Code skills (Skills API exclusive)
- 9 Constitutional Articles
- EARS requirements format
- Steering system (project memory)
- Greenfield + Brownfield workflows (9 commands each)
- Bilingual documentation (English/Japanese)
- npm distribution (`npx musubi-sdd`)

### Next 3 Months (v0.2.x - Enhancement)
🎯 **Quality & Community**:
- Increase test coverage to 80% (Constitutional Article III)
- Add integration tests (full `musubi init` workflow)
- Template snapshot tests (validate all 63 command files)
- GitHub Actions CI/CD automation
- Community contribution guide
- Skill template generator (for custom skills)

### Next 6 Months (v0.3.x - Ecosystem)
🚀 **Tooling & Integration**:
- VS Code extension (GUI for musubi commands)
- GitHub Actions integration (auto-validate PRs)
- Skill marketplace (community-contributed skills)
- Metrics dashboard (SDD workflow analytics)
- EARS requirements linter (validate requirements files)
- Traceability visualizer (requirements → code graph)

### Long-Term Vision (v1.0+ - Platform)
🌟 **Ultimate SDD Platform**:
- Hosted SDD platform (optional, for teams)
- Real-time collaboration on specifications
- AI model comparison (A/B test different models)
- Constitutional article customization (team-specific governance)
- Integration with Jira, Linear, Notion
- Multi-language support (beyond English/Japanese)

---

**Note**: This document describes MUSUBI - the Ultimate SDD Tool that binds specifications, design, and code through constitutional governance. Update when product direction, features, or target users change.

**Last Updated**: 2025-01-16 by @steering
