# SDD Workflow

The complete Specification Driven Development workflow in MUSUBI.

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MUSUBI SDD Workflow                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Stage 0     Stage 1      Stage 2     Stage 3      Stage 4         │
│  ┌───────┐  ┌─────────┐  ┌────────┐  ┌────────┐  ┌──────────┐      │
│  │ Spike │─▶│ Require │─▶│ Design │─▶│ Tasks  │─▶│Implement │      │
│  │ (PoC) │  │  ments  │  │        │  │        │  │          │      │
│  └───────┘  └─────────┘  └────────┘  └────────┘  └──────────┘      │
│                                                        │            │
│  Stage 9     Stage 8      Stage 7     Stage 6    Stage 5           │
│  ┌───────┐  ┌─────────┐  ┌────────┐  ┌────────┐  ┌──────────┐      │
│  │ Retro │◀─│ Deploy  │◀─│ Review │◀─│  Test  │◀─│  Review  │◀─────┘
│  │       │  │         │  │        │  │        │  │  (Code)  │      │
│  └───────┘  └─────────┘  └────────┘  └────────┘  └──────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Stages

### Stage 0: Spike/PoC (Optional)

Research and prototyping before committing to requirements.

**Skill**: `@research`

**Output**: Research findings, technical feasibility assessment

### Stage 1: Requirements

Define what the system must do using EARS format.

**Skill**: `@requirements-analyst`

**Command**: `/sdd-requirements [feature]`

**Output**: EARS-format requirements document

**Validation**:
- All requirements use EARS patterns
- No ambiguous language
- Acceptance criteria defined

### Stage 2: Design

Create technical architecture and make key decisions.

**Skill**: `@system-architect`

**Command**: `/sdd-design [feature]`

**Output**: 
- C4 architecture diagrams
- Architecture Decision Records (ADRs)
- Component specifications

**Validation**:
- Aligns with steering files
- Requirements mapped to components
- Phase -1 Gates passed

### Stage 3: Tasks

Break down design into actionable implementation tasks.

**Skill**: `@project-manager`

**Command**: `/sdd-tasks [feature]`

**Output**: Task breakdown with:
- Priorities
- Dependencies
- Estimates
- Requirement traceability

### Stage 4: Implementation

Write code following Test-First methodology.

**Skill**: `@software-developer`

**Command**: `/sdd-implement [feature]`

**Process** (Red-Green-Blue):
1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Blue**: Refactor

### Stage 5: Code Review

Review implementation for quality and compliance.

**Skill**: `@code-reviewer`

**Checklist**:
- Code quality
- Test coverage
- Security considerations
- Constitutional compliance

### Stage 6: Testing

Comprehensive testing at all levels.

**Skill**: `@test-engineer`

**Types**:
- Unit tests
- Integration tests (with real services)
- E2E tests

### Stage 7: Review

Final review before deployment.

**Skills**: `@quality-assurance`, `@security-auditor`

### Stage 8: Deployment

Release to production.

**Skill**: `@release-coordinator`, `@devops-engineer`

### Stage 9: Retrospective

Learn and improve for next iteration.

**Focus**:
- What went well
- What could improve
- Action items

## Workflow Commands

```bash
# Check current stage
musubi-workflow status

# Move to next stage
musubi-workflow next

# View metrics
musubi-workflow metrics

# Reset workflow
musubi-workflow reset
```

## Constitutional Checkpoints

| Stage Transition | Validation Required |
|-----------------|---------------------|
| 1 → 2 | Article IV (EARS Format) |
| 2 → 3 | Articles VII, VIII (Phase -1 Gates) |
| 3 → 4 | Articles I, II (Library-First, CLI) |
| 4 → 5 | Article III (Test-First) |
| 5 → 6 | Code review approval |
| 6 → 7 | Article V (Traceability) |
| 7 → 8 | Article IX (Integration Tests) |

## Iteration

MUSUBI supports iterative development:

```
Requirements ──▶ Design ──▶ Implement ──▶ Test
     ▲                                      │
     └──────────── Feedback ────────────────┘
```

Use `musubi-workflow iterate` to track iteration cycles.
