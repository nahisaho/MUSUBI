# Architecture Decisions

Record of significant architectural and design decisions made during the MUSUBI project development.

---

## [2025-11-22] Multi-Level Context Overflow Prevention

**Decision**: Implement two-level context overflow prevention pattern across all agents

**Context**: 
- Agent outputs were causing context length overflow errors
- Large multi-file outputs exceeded token limits
- Single large files (>300 lines) also caused overflows
- Error resulted in loss of all generated content

**Solution**:
- **Level 1**: File-by-file gradual output with [1/N] progress counters
- **Level 2**: Multi-part generation for individual files >300 lines (Part 1/N, Part 2/N)
- Save immediately after each file/part to preserve partial results
- Clear progress reporting to users

**Rationale**:
- Multi-file generation often exceeds context limits
- Large individual files need separate handling
- Immediate save prevents loss on error
- Progress visibility improves user experience

**Implementation**:
- Applied to 23/25 agents (2 N/A for coordination)
- Each agent has gradual output pattern in Phase 4/5
- Pattern includes both file-level and line-level splitting
- Consistent format across all agents

**Impact**:
- ✅ Zero context overflow errors
- ✅ Partial results preserved on error
- ✅ Better user visibility of progress
- ✅ Can handle unlimited project sizes

**Files Modified**:
- All agent SKILL.md files in `src/templates/agents/claude-code/skills/*/`
- Commits: aa0ba28, d28d7b8

**Related**:
- See `steering/memories/lessons_learned.md` for context overflow lessons
- Pattern documented in `docs/agent-output-pattern.md`

---

## [Initial] 25-Agent Specialized System

**Decision**: Create 25 specialized agents rather than single general-purpose agent

**Context**:
- Specification Driven Development requires diverse skills
- Single agent lacks depth in specialized areas
- Different stages of SDD need different expertise

**Agent Categories**:
1. **Design (4)**: system-architect, cloud-architect, api-designer, database-schema-designer
2. **Development (4)**: software-developer, bug-hunter, performance-optimizer, security-auditor
3. **Testing/QA (2)**: test-engineer, quality-assurance
4. **Documentation (2)**: technical-writer, requirements-analyst
5. **Infrastructure (2)**: devops-engineer, database-administrator
6. **UX/Design (1)**: ui-ux-designer
7. **Analysis (3)**: code-reviewer, change-impact-analyzer, traceability-auditor
8. **Compliance (1)**: constitution-enforcer
9. **Project Management (2)**: project-manager, release-coordinator
10. **Advanced (2)**: ai-ml-engineer, site-reliability-engineer
11. **Coordination (2)**: orchestrator, steering

**Rationale**:
- Deep expertise in each domain
- Parallel execution possible
- Easier to maintain and update
- Users can choose relevant agents
- Better quality outputs per domain

**Impact**:
- Complete coverage of SDD lifecycle
- High-quality specialized outputs
- Modular and extensible system
- Platform-agnostic (7 platforms supported)

**Related**:
- See `steering/structure.md` for agent organization
- See `steering/tech.md` for implementation details

---

## [Initial] Constitutional Governance System

**Decision**: Implement 9 Constitutional Articles as project governance framework

**Context**:
- Need consistent quality and standards
- Multiple agents must follow same principles
- Requirements must be traceable and verifiable

**9 Constitutional Articles**:
1. EARS Requirements Format
2. Bidirectional Traceability
3. C4 Model + ADR Design
4. Task-based Implementation
5. Code Quality Standards
6. Security & Privacy
7. Testing & Quality
8. Documentation Excellence
9. Review & Validation

**Rationale**:
- Constitutional approach ensures consistency
- All agents reference same standards
- Validation gates maintain quality
- Traceability built-in from start

**Implementation**:
- Constitution stored in `steering/rules/constitution.md`
- constitution-enforcer agent validates compliance
- Each agent implements relevant articles
- Gates prevent non-compliant deliverables

**Impact**:
- ✅ Consistent quality across all agents
- ✅ Traceable requirements to code
- ✅ Automated validation possible
- ✅ Clear governance framework

**Related**:
- `steering/rules/constitution.md` - Full constitution
- `steering/rules/workflow.md` - 8-stage SDD process

---

## [Initial] Bilingual Output Requirement

**Decision**: All documentation must be generated in both English and Japanese

**Context**:
- Global and Japanese user base
- Professional documentation standards
- Internationalization requirement

**Implementation**:
- English version: `filename.md` (primary)
- Japanese version: `filename.ja.md` (required)
- Generate English first, then translate
- Both versions always created together

**Rationale**:
- Supports international users
- Japanese market is significant
- Maintains consistency between languages
- English as primary enables global collaboration

**Impact**:
- ✅ Accessible to both language groups
- ✅ Professional presentation
- ⚠️ Double the documentation volume
- ⚠️ Translation maintenance overhead

**Enforcement**:
- All document-generating agents have bilingual requirement
- Template includes both language versions
- Validation checks for both files

**Related**:
- See agent SKILL.md files for implementation
- `steering/product.md` and `steering/product.ja.md` as examples

---

## Template for New Decisions

```markdown
## [YYYY-MM-DD] Decision Title

**Decision**: What was decided

**Context**: 
- Why this decision was needed
- What problem it solves
- Constraints or requirements

**Solution**:
- Specific approach chosen
- Key components
- Implementation details

**Rationale**:
- Why this approach over alternatives
- Benefits and trade-offs
- Supporting evidence

**Implementation**:
- How it was implemented
- Files affected
- Integration points

**Impact**:
- Positive effects
- Negative effects or trade-offs
- Metrics or measurements

**Related**:
- Links to related decisions
- Documentation references
- Code references
```

---

## [2025-11-22] Project Configuration File (project.yml)

**Decision**: Implemented `steering/project.yml` as central project configuration

**Context**: 
- Memory system (Phase 1) completed, moving to Phase 2
- MUSUBI had human-readable steering docs but no machine-readable config
- Inspired by Serena's `.serena/project.yml` approach
- Needed standardized configuration for agent customization
- Required validation of version sync, framework matches, etc.

**Solution**:
Created `steering/project.yml` with 12 major sections:
1. Project Metadata - name, version, platforms
2. Languages and Frameworks - technology stack
3. Project Structure Conventions - naming, directory patterns
4. Steering Configuration - auto-update, exclusions, memories
5. Agent Configuration - bilingual, gradual output, dialogue settings
6. Development Workflow - testing, quality gates, commit format
7. Custom Rules - 9 Constitutional Articles with enforcement
8. Context Overflow Prevention - two-level defense configuration
9. SDD Configuration - 8 stages, EARS patterns
10. Integration Settings - git, npm
11. Maintenance and Monitoring - tasks, cleanup policies
12. Experimental Features - feature flags

Complementary documentation:
- `steering/project.yml.README.md` - comprehensive usage guide
- Updated steering agent with Mode 5: Configuration Management
- Config operations: show, validate, update

**Rationale**:
- YAML format: Human-readable, supports comments, widely used
- Comprehensive: Serves as documentation, not just config
- Machine-readable: Enables programmatic validation and automation
- Single source of truth: Reduces configuration drift
- Serena-inspired, MUSUBI-adapted: Proven pattern + our unique needs
- Foundation for automation: Enables Phase 3 (onboarding), Phase 4 (auto-sync)

**Implementation**:
- File: `steering/project.yml` (~400 lines)
- Documentation: `steering/project.yml.README.md` (~500 lines)
- Agent update: Mode 5 added to steering SKILL.md
- Operations: Show config, validate sync, update values
- Synchronization: Manual (with package.json) for now

**Impact**:

Positive:
- Agents can programmatically read configuration
- Version synchronization can be validated automatically
- Project conventions explicitly documented
- New contributor onboarding faster
- Foundation for CI/CD validation
- Enables future automation (Phase 3, 4)

Negative:
- Additional file to maintain
- Requires manual sync with package.json
- Learning curve for contributors

Trade-offs:
- Manual sync chosen over auto-sync (safer, explicit control)
- Comprehensive over minimal (better documentation)
- YAML over JSON (readability > strict parsing)

**Related**:
- [2025-11-22] Memory System Implementation - Memories configured in project.yml
- [2025-11-22] Multi-Level Context Overflow Prevention - Settings in project.yml
- [Initial] 25-Agent Specialized System - Agent behavior configured
- [Initial] Bilingual Output Requirement - Enabled in agents.bilingual_output
- Phase 3 roadmap: Onboarding automation will use project.yml
- Phase 4 roadmap: Auto-update/sync with project.yml

---

**Note**: This file records architectural decisions. For development workflows, see `development_workflow.md`. For lessons learned, see `lessons_learned.md`.
