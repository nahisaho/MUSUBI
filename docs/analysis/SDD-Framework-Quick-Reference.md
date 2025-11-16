# SDD Framework Quick Reference Matrix

**Quick comparison guide for choosing the right SDD framework or building the ultimate tool**

---

## 🎯 At-a-Glance Comparison

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| **Agent Count** | 20 | 0 | Unlimited | 0 | 7-9 | 0 |
| **Workflow Stages** | 8 | 3 | Custom | 3 | 7 | 7 |
| **Requirements Format** | EARS | Freeform | N/A | User Stories | EARS | EARS-like |
| **Project Memory** | ✅ Steering | ❌ | ❌ | ❌ | ✅ Steering | ⚠️ Constitution |
| **Change Tracking** | ❌ | ✅ Deltas | ❌ | ❌ | ❌ | ❌ |
| **Brownfield Support** | ⚠️ Limited | ✅ Strong | ❌ | ❌ | ⚠️ Validation | ⚠️ Limited |
| **Parallel Execution** | ✅ Agent-level | ❌ | ✅ Swarms | ❌ | ✅ P-labels | ❌ |
| **Constitutional Governance** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ 9 Articles |
| **Complexity** | High | Medium | High | Low | Medium | Medium-High |
| **Best For** | Full SDLC | Brownfield | Multi-agent | Beginners | Kiro users | Quality-first |

---

## 🏆 "Best Of" Awards

### 🥇 Best Overall Agent System
**Winner**: musuhi
- 20 specialized agents covering entire SDLC
- Orchestrator with dependency management
- Auto-updating project memory (v0.4.9)

**Runner-up**: ag2 (most flexible multi-agent framework)

---

### 🥇 Best Brownfield/Existing Code Support
**Winner**: OpenSpec
- Delta specs (ADDED/MODIFIED/REMOVED)
- Archive workflow preserves history
- Multi-capability change tracking

**Runner-up**: cc-sdd (validation gates)

---

### 🥇 Best Multi-Agent Orchestration
**Winner**: ag2 (AutoGen)
- 9+ orchestration patterns
- Human-in-the-loop support
- Production-ready framework

**Runner-up**: musuhi (20 specialized agents)

---

### 🥇 Best Simplicity & Onboarding
**Winner**: ai-dev-tasks
- 2 markdown files (PRD + Tasks)
- Universal AI tool compatibility
- Progressive complexity

**Runner-up**: OpenSpec (3 files: proposal + tasks + design)

---

### 🥇 Best Kiro-Compatible Implementation
**Winner**: cc-sdd
- EARS format requirements
- Parallel execution with P-labels
- Portable to Kiro IDE

**Runner-up**: spec-kit (similar spec-driven philosophy)

---

### 🥇 Best Constitutional Governance
**Winner**: spec-kit
- 9 immutable articles
- Phase -1 Gates enforcement
- Template-driven LLM constraints

**Runner-up**: musuhi (project memory with steering rules)

---

### 🥇 Best Test-First Enforcement
**Winner**: spec-kit
- Article III: No code before tests
- Integration-first testing
- Contract tests mandatory

**Runner-up**: musuhi (EARS → Test mapping)

---

### 🥇 Best Project Memory System
**Winner**: musuhi
- 3-file steering (structure, tech, product)
- Auto-update after agent work
- Domain-specific custom steering

**Runner-up**: cc-sdd (similar steering system)

---

## 📊 Feature Comparison Matrix

### Requirements Management

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| EARS Format | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| User Stories | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Acceptance Criteria | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Clarification Markers | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delta Tracking | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Validation | Agent | CLI | N/A | Manual | Subagent | Template |
| Traceability | Req→Test | Manual | N/A | PRD→Task | Req→Test | Spec→Code |

### Architecture & Design

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| C4 Model | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ADR | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mermaid Diagrams | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| API Contracts | ✅ | ✅ | ❌ | ⚠️ | ✅ | ✅ |
| Database Schema | ✅ | ❌ | ❌ | ⚠️ | ✅ | ✅ |
| Research Phase | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Constitutional Gates | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Task Management

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| Task Breakdown | ✅ | ✅ | Custom | ✅ | ✅ | ✅ |
| Parallel Labels | ⚠️ | ❌ | ✅ | ❌ | ✅ P0/P1/P2 | ❌ |
| Dependency Tracking | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Coverage Matrix | ✅ | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| Checkbox Tracking | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| File Path Specs | ⚠️ | ❌ | ❌ | ⚠️ | ⚠️ | ✅ |

### Testing Approaches

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| Test-First Mandate | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| EARS → Test Mapping | ✅ | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| Contract Tests | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Integration-First | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| TDD Workflow | ⚠️ | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| Coverage Requirements | ⚠️ | ❌ | ❌ | ❌ | ⚠️ | ✅ 80%+ |

### Project Memory & Context

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| Steering System | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Structure.md | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Tech.md | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Product.md | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Constitution.md | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Project.md | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Auto-Update | ✅ v0.4.9 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Custom Domain | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

### Change Management

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| Delta Specs | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ADDED/MODIFIED/REMOVED | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Archive Workflow | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change Proposals | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Git Branching | ✅ | Manual | Manual | Manual | Manual | ✅ Auto |
| Validation Gates | ⚠️ | ✅ CLI | ❌ | ❌ | ✅ | ✅ |

### Tool Integration

| Feature | musuhi | OpenSpec | ag2 | ai-dev-tasks | cc-sdd | spec-kit |
|---------|--------|----------|-----|--------------|--------|----------|
| Claude Code | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| GitHub Copilot | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Cursor | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Windsurf | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Gemini CLI | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Codex CLI | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Qwen Code | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| CLI Tool | ❌ | ✅ | Python | ❌ | ✅ npx | ✅ uv |
| Git Integration | Branch | Manual | Manual | Manual | Manual | Auto-branch |
| CI/CD Support | Manual | Manual | ✅ Code exec | Manual | Manual | Manual |

---

## 🎨 Use Case Recommendations

### Scenario 1: Greenfield Project (0 → 1)

**Best Choice**: **musuhi** or **spec-kit**

**Why**:
- musuhi: Comprehensive agent coverage, EARS format, steering system
- spec-kit: Constitutional governance, test-first, template constraints

**Workflow**:
1. Constitution (spec-kit) or Steering (musuhi)
2. Research → Requirements → Design → Tasks
3. Test-first implementation
4. Continuous validation

---

### Scenario 2: Brownfield Enhancement (1 → n)

**Best Choice**: **OpenSpec** or **cc-sdd**

**Why**:
- OpenSpec: Delta specs track changes, archive workflow
- cc-sdd: Validation gates (gap analysis, design validation)

**Workflow**:
1. Validate gap between requirements and existing code
2. Create change proposal with delta specs
3. Implement tasks sequentially
4. Archive change and merge deltas

---

### Scenario 3: Complex Multi-Agent Orchestration

**Best Choice**: **ag2** (AutoGen)

**Why**:
- Mature multi-agent framework
- 9+ orchestration patterns
- Human-in-the-loop support
- Production-ready

**Workflow**:
1. Define agents with specialized roles
2. Use AutoPattern or sequential/nested/group chats
3. Execute with human validation gates
4. Tool execution (RAG, code execution)

---

### Scenario 4: Simple Feature Development

**Best Choice**: **ai-dev-tasks**

**Why**:
- Minimal setup (2 markdown files)
- Progressive complexity
- Universal AI tool compatibility

**Workflow**:
1. Create PRD with clarifying questions
2. Generate task list from PRD
3. Implement tasks one-by-one with review

---

### Scenario 5: Kiro IDE Migration

**Best Choice**: **cc-sdd**

**Why**:
- Kiro-compatible spec format
- EARS requirements
- Portable to Kiro IDE

**Workflow**:
1. Steering → Requirements → Design → Tasks
2. Use P-labels for parallel execution
3. Validate with gap/design checks
4. Migrate specs to Kiro when ready

---

### Scenario 6: Quality-Focused Team

**Best Choice**: **spec-kit**

**Why**:
- Constitutional governance (9 articles)
- Test-first imperative
- Phase -1 Gates enforcement
- Template-driven quality

**Workflow**:
1. Establish constitution with team
2. Specify → Clarify → Plan → Tasks
3. Validate constitutional gates
4. Test-first implementation

---

## 🚀 Quick Start Guide by Framework

### musuhi
```bash
# 1. Install
git clone https://github.com/your-repo/musuhi.git
cd musuhi

# 2. Initialize project
@steering  # Generate project memory

# 3. Start development
@requirements-analyst  # Create requirements.md
@system-architect      # Create design.md
@software-developer    # Implement code

# 4. Validate
@code-reviewer  # Review quality
@test-engineer  # Generate tests
```

### OpenSpec
```bash
# 1. Install
npm install -g openspec-cli

# 2. Initialize
openspec init

# 3. Create change
mkdir -p openspec/changes/add-feature/specs/auth
# Write proposal.md, tasks.md, spec.md (deltas)

# 4. Validate
openspec validate add-feature --strict

# 5. Archive
openspec archive add-feature --yes
```

### ag2
```python
# 1. Install
pip install ag2

# 2. Create agents
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent("assistant", llm_config=config)
user = UserProxyAgent("user", human_input_mode="ALWAYS")

# 3. Initiate chat
user.initiate_chat(assistant, message="Build a REST API")
```

### ai-dev-tasks
```bash
# 1. Clone
git clone https://github.com/snarktank/ai-dev-tasks.git

# 2. Use in AI tool
# In Claude/Copilot/Cursor:
Use @create-prd.md
[Describe feature]

# 3. Generate tasks
Now take @prd-feature.md and create tasks using @generate-tasks.md

# 4. Implement
Please start on task 1.1 from the generated task list.
```

### cc-sdd
```bash
# 1. Install
npx cc-sdd@latest --claude --lang en

# 2. Workflow
/kiro:steering
/kiro:spec-init photo-albums
/kiro:spec-requirements photo-albums
/kiro:spec-design photo-albums -y
/kiro:spec-tasks photo-albums -y
/kiro:spec-impl photo-albums 1.1
```

### spec-kit
```bash
# 1. Install
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 2. Initialize
specify init my-project --ai claude

# 3. Workflow
/speckit.constitution Create principles focused on quality...
/speckit.specify Build a photo album app...
/speckit.plan Vite with vanilla JS, SQLite database
/speckit.tasks
/speckit.implement
```

---

## 🎯 Decision Tree

```
Start here
│
├─ Do you need multi-agent orchestration?
│  ├─ Yes → ag2 (AutoGen)
│  └─ No → Continue
│
├─ Is this a brownfield/existing codebase?
│  ├─ Yes → OpenSpec (delta specs) or cc-sdd (validation)
│  └─ No → Continue
│
├─ Do you need comprehensive SDLC coverage?
│  ├─ Yes → musuhi (20 agents)
│  └─ No → Continue
│
├─ Do you prioritize quality gates and governance?
│  ├─ Yes → spec-kit (constitutional)
│  └─ No → Continue
│
├─ Are you migrating to/from Kiro IDE?
│  ├─ Yes → cc-sdd (Kiro-compatible)
│  └─ No → Continue
│
└─ Do you want simplicity?
   └─ Yes → ai-dev-tasks (2 files)
```

---

## 📈 Complexity vs. Power Matrix

```
High Power
│
│  ag2          musuhi
│   │             │
│   │             │
│   │             │
│   │             │
│   │          cc-sdd  spec-kit
│   │             │       │
│   │             │       │
│   │             │       │
│   │          OpenSpec   │
│   │             │       │
│   │             │       │
│   └─────────────┼───────┘
│            ai-dev-tasks
│
└──────────────────────────── High Complexity

Low Power                    Low Complexity
```

**Interpretation**:
- **Top-left (ag2)**: High power, high complexity (multi-agent framework)
- **Top-right (musuhi)**: High power, high complexity (20 agents, full SDLC)
- **Center (cc-sdd, spec-kit, OpenSpec)**: Balanced power/complexity
- **Bottom-center (ai-dev-tasks)**: Low complexity, moderate power (simplicity)

---

## 🎁 Framework Strengths Summary

### musuhi
- ✅ 20 specialized agents
- ✅ Auto-updating project memory
- ✅ EARS format with traceability
- ✅ 8-stage workflow
- ✅ Multi-platform support

### OpenSpec
- ✅ Delta specs (ADDED/MODIFIED/REMOVED)
- ✅ Archive workflow
- ✅ Brownfield-first
- ✅ CLI validation
- ✅ Multi-capability changes

### ag2
- ✅ Production-ready multi-agent
- ✅ 9+ orchestration patterns
- ✅ Human-in-the-loop
- ✅ Tool ecosystem
- ✅ LLM agnostic

### ai-dev-tasks
- ✅ Simplest onboarding (2 files)
- ✅ Progressive complexity
- ✅ Universal AI compatibility
- ✅ Junior developer friendly

### cc-sdd
- ✅ Kiro-compatible
- ✅ P-label parallelization
- ✅ EARS requirements
- ✅ Validation gates
- ✅ Customizable templates

### spec-kit
- ✅ Constitutional governance
- ✅ Test-first imperative
- ✅ Template-driven quality
- ✅ Phase -1 Gates
- ✅ Clarification markers

---

## 🔮 Future-Proof Synthesis

**For the ultimate SDD tool, combine**:

1. **Agent System**: musuhi (20 agents) + ag2 (orchestration)
2. **Workflow**: musuhi (8 stages) + spec-kit (constitutional gates)
3. **Change Management**: OpenSpec (delta specs + archive)
4. **Task Execution**: cc-sdd (P-labels) + ag2 (swarms)
5. **Quality**: spec-kit (test-first + gates) + musuhi (traceability)
6. **Context**: musuhi (steering auto-update) + spec-kit (constitution)
7. **Simplicity**: ai-dev-tasks (progressive complexity)

**Result**: A tool that scales from 2-file simplicity to 20-agent orchestration, enforces quality through constitutional gates, tracks changes with deltas, and maintains consistency through auto-updating project memory.

---

**End of Quick Reference**
