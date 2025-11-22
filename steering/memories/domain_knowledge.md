# Domain Knowledge

Business logic, domain concepts, and terminology for the MUSUBI SDD project.

---

## Specification Driven Development (SDD)

### Core Philosophy

**Specification-First Development:**
- Start with precise specifications
- Generate code from specifications
- Validate against specifications
- Maintain specification-code alignment

**Ultimate SDD Vision:**
> "Perfect alignment between specification and implementation through AI-assisted governance"

### 8-Stage SDD Process

1. **Steering**: Establish project memory and context
2. **Requirements**: Define EARS-formatted requirements
3. **Design**: Create C4 models and ADRs
4. **Task**: Break down into actionable tasks
5. **Implementation**: Execute development
6. **Validation**: Verify constitutional compliance
7. **Documentation**: Generate bilingual docs
8. **Review**: Quality assurance and refinement

---

## EARS Requirements Format

### Overview

EARS (Easy Approach to Requirements Syntax) provides five requirement patterns for clear, unambiguous specifications.

### Five EARS Patterns

#### 1. Ubiquitous Requirements

**Pattern:**
```
The <system> shall <action>
```

**Example:**
```
The musubi-init command shall initialize SDD project structure with bilingual support.
```

**When to use:** Always-active requirements, unconditional behavior

---

#### 2. Event-Driven Requirements

**Pattern:**
```
WHEN <trigger event> the <system> shall <action>
```

**Example:**
```
WHEN user invokes #sdd-requirements, the requirements-analyst agent shall generate EARS-formatted requirements for the specified feature.
```

**When to use:** Triggered by specific events or conditions

---

#### 3. State-Driven Requirements

**Pattern:**
```
WHILE <system state> the <system> shall <action>
```

**Example:**
```
WHILE generating large files (>300 lines), the agent shall use multi-part generation with [Part 1/N] notation to prevent context overflow.
```

**When to use:** Behavior dependent on system state

---

#### 4. Unwanted Behavior Requirements

**Pattern:**
```
IF <condition> THEN the <system> shall <action>
```

**Example:**
```
IF context length approaches limit THEN the agent shall save current progress and notify user before continuing.
```

**When to use:** Handling exceptional or edge cases

---

#### 5. Optional Feature Requirements

**Pattern:**
```
WHERE <feature active> the <system> shall <action>
```

**Example:**
```
WHERE bilingual output is enabled, the agent shall generate both English and Japanese versions of all documentation.
```

**When to use:** Configurable or optional features

---

## Constitutional Governance

### Overview

MUSUBI enforces 9 Constitutional Articles that govern all development activities. These ensure consistency, quality, and alignment with project principles.

### 9 Constitutional Articles

#### Article 1: Specification First
> "All development shall begin with clear, EARS-formatted specifications"

**Implications:**
- No code before specification
- Requirements must be precise
- Validation against specifications

---

#### Article 2: Constitutional Compliance
> "All artifacts shall comply with Constitutional Articles"

**Implications:**
- Every output validated
- Constitution-enforcer agent verifies
- Non-compliant work rejected

---

#### Article 3: Traceability
> "All artifacts shall maintain bidirectional traceability"

**Implications:**
- Requirements → Design → Code → Tests
- Every code line traceable to requirement
- Traceability-auditor agent validates

---

#### Article 4: Bilingual Output
> "All user-facing documentation shall be provided in English and Japanese"

**Implications:**
- Dual language requirement
- Both versions equally maintained
- Synchronized updates

---

#### Article 5: Quality Assurance
> "All code shall meet quality standards before integration"

**Implications:**
- Automated testing required
- Code review process
- Quality gates enforced

---

#### Article 6: Documentation Completeness
> "All features shall be comprehensively documented"

**Implications:**
- User guides, API docs, examples
- Technical-writer agent generates
- Documentation versioned with code

---

#### Article 7: Security by Design
> "Security considerations shall be integrated from the start"

**Implications:**
- Security-auditor reviews all code
- Threat modeling during design
- Secure defaults

---

#### Article 8: Performance Awareness
> "Performance implications shall be considered in all decisions"

**Implications:**
- Performance-optimizer reviews architecture
- Benchmarking for critical paths
- Resource efficiency

---

#### Article 9: Maintainability
> "Code shall prioritize long-term maintainability"

**Implications:**
- Clear code structure
- Comprehensive tests
- Technical debt monitoring

---

## Agent System Architecture

### 25 Specialized Agents

**Orchestration Layer:**
- `orchestrator`: Coordinates multi-agent workflows
- `steering`: Manages project memory and context

**Development Agents:**
- `requirements-analyst`: EARS requirements generation
- `system-architect`: High-level architecture design
- `cloud-architect`: Cloud infrastructure design
- `database-schema-designer`: Database design
- `api-designer`: API specification
- `ui-ux-designer`: Interface design
- `software-developer`: Code implementation
- `test-engineer`: Test design and implementation

**Quality Assurance Agents:**
- `code-reviewer`: Code quality review
- `security-auditor`: Security analysis
- `performance-optimizer`: Performance optimization
- `quality-assurance`: Overall quality verification

**Governance Agents:**
- `constitution-enforcer`: Constitutional compliance
- `traceability-auditor`: Traceability verification
- `change-impact-analyzer`: Impact assessment

**Operations Agents:**
- `devops-engineer`: CI/CD and automation
- `site-reliability-engineer`: Reliability and monitoring
- `release-coordinator`: Release management
- `database-administrator`: Database operations

**Support Agents:**
- `technical-writer`: Documentation generation
- `project-manager`: Project planning and tracking
- `bug-hunter`: Bug detection and analysis
- `ai-ml-engineer`: AI/ML integration

**Specialized Agents:**
- `docs-generator`: Specification-to-docs conversion
- `test-automation-engineer`: Test automation

---

## C4 Modeling

### Four Levels of Architectural Diagrams

#### Level 1: System Context
- System boundaries
- External actors
- High-level interactions

#### Level 2: Container
- Applications and data stores
- Technology choices
- Inter-container communication

#### Level 3: Component
- Internal structure
- Component responsibilities
- Dependencies

#### Level 4: Code
- Classes and interfaces
- Implementation details
- Code-level relationships

---

## ADR (Architecture Decision Records)

### Format

```markdown
## [Date] Decision Title

**Context:**
What circumstances led to this decision?

**Decision:**
What was decided?

**Rationale:**
Why this decision over alternatives?

**Consequences:**
- Positive impacts
- Negative impacts
- Trade-offs accepted

**Alternatives Considered:**
- Alternative 1: Why not chosen
- Alternative 2: Why not chosen
```

### Storage

ADRs stored in `steering/memories/architecture_decisions.md` for persistence across conversations.

---

## Context Overflow Prevention

### Problem Domain

**Challenge:**
AI agent outputs can exceed context length limits, causing:
- Lost work (all-or-nothing generation)
- User frustration
- Inability to handle large projects

### Solution: Two-Level Defense

#### Level 1: File-by-File Gradual Output

**Pattern:**
```
[1/5] Creating requirements.md...
[Content saved]

[2/5] Creating design.md...
[Content saved]
```

**Benefits:**
- Progress visibility
- Incremental saves
- Partial recovery possible

#### Level 2: Multi-Part Large File Generation

**Pattern:**
```
[Part 1/3: Lines 1-300]
File: architecture.md
[Content saved]

[Part 2/3: Lines 301-600]
File: architecture.md
[Content appended]

[Part 3/3: Lines 601-final]
File: architecture.md
[Content completed]
```

**Trigger:** File exceeds 300 lines

**Benefits:**
- Handle unlimited file sizes
- No single-file overflow
- Clear continuation points

---

## Bilingual Output Requirements

### Dual Language Support

**Required for:**
- All user-facing documentation
- README files
- Agent skill descriptions
- Steering documents
- Requirements specifications

**Not required for:**
- Code comments
- Internal implementation files
- Configuration files

### Naming Convention

```
file.md       # English version
file.ja.md    # Japanese version
```

### Synchronization

Both versions must:
- Cover same content
- Update together
- Maintain consistency
- Same structure and examples

---

## Project Structure Patterns

### Steering Directory

```
steering/
  ├── structure.md        # Architecture patterns
  ├── structure.ja.md     
  ├── tech.md            # Technology stack
  ├── tech.ja.md
  ├── product.md         # Product context
  ├── product.ja.md
  ├── rules/
  │   └── constitution.md # 9 Constitutional Articles
  └── memories/          # Memory system (NEW)
      ├── README.md
      ├── architecture_decisions.md
      ├── development_workflow.md
      ├── domain_knowledge.md
      ├── suggested_commands.md
      └── lessons_learned.md
```

### Agent Structure

```
src/templates/agents/[platform]/skills/[agent-name]/
  ├── SKILL.md           # Agent capabilities
  ├── meta.json          # Metadata
  └── examples/          # Usage examples
```

---

## Integration Points

### GitHub Copilot Integration

- `.github/copilot-instructions.md`: Platform-specific agent skills
- Trigger pattern: `#sdd-[stage]`
- Interactive dialogue flow
- Context-aware responses

### Multi-Platform Support

Supported AI platforms:
- GitHub Copilot
- Claude Code
- Cursor
- Gemini CLI
- Windsurf
- Codex
- Qwen Code

Each platform gets customized agent skills optimized for that environment.

---

## Business Rules

### Agent Activation

1. User invokes trigger (e.g., `#sdd-requirements`)
2. Agent identifies itself
3. Agent asks clarifying questions (one-at-a-time)
4. Agent gathers sufficient context
5. Agent executes workflow
6. Agent produces outputs with progress indicators
7. Agent validates constitutional compliance

### Output Generation Rules

1. **File-by-file generation**: Save each file immediately
2. **Progress indicators**: Show [N/Total] for each file
3. **Large file splitting**: Use multi-part for >300 lines
4. **Bilingual output**: Generate both languages together
5. **Constitutional validation**: Check compliance before finalizing

---

## Quality Standards

### Code Quality

- ESLint compliance
- Prettier formatting
- Test coverage >80%
- No lint warnings
- Clear variable names
- Comprehensive comments

### Documentation Quality

- Clear, concise language
- Code examples
- Usage instructions
- Troubleshooting guidance
- Both English and Japanese

### Specification Quality

- EARS format compliance
- Unambiguous language
- Testable requirements
- Traceable to design
- Constitutional alignment

---

## Terminology

| Term | Definition |
|------|------------|
| **EARS** | Easy Approach to Requirements Syntax - 5 requirement patterns |
| **SDD** | Specification Driven Development - specification-first methodology |
| **ADR** | Architecture Decision Record - documented design decisions |
| **C4** | Context, Container, Component, Code - 4-level architecture modeling |
| **Constitutional Articles** | 9 governance rules for MUSUBI project |
| **Agent** | Specialized AI assistant for specific SDD stage |
| **Steering** | Project memory and context management system |
| **Gradual Output** | File-by-file generation with progress indicators |
| **Multi-Part Generation** | Splitting large files to prevent context overflow |
| **Bilingual Output** | Dual English/Japanese documentation requirement |

---

**Note**: This file captures domain knowledge and concepts. For architectural decisions, see `architecture_decisions.md`. For practical workflows, see `development_workflow.md`.
