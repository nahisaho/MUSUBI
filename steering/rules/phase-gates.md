# Phase -1 Gates Approval Process

**Version**: 1.0
**Last Updated**: 2025-11-23
**Status**: Active

---

## Overview

Phase -1 Gates are pre-implementation validation checkpoints that enforce Constitutional compliance. These gates MUST be approved before proceeding with implementation.

---

## Gate Triggers

### Article VII: Simplicity Gate

**Trigger**: Project count exceeds 3 independently deployable units

**Current Status**: 
- Detected: 5 sub-projects (musubi + References: musuhi, OpenSpec, spec-kit, ag2)
- **APPROVED**: References directory contains upstream frameworks for attribution only
- **Justification**: References are not deployable units, only source material

**Approval Date**: 2025-11-23
**Approved By**: Project Architect
**Rationale**: 
- Main project: `musubi-sdd` (1 deployable unit)
- References: Upstream frameworks (musuhi, OpenSpec, spec-kit, ag2) for attribution
- References are NOT deployed, NOT built, NOT published
- Simplicity Gate intent: Prevent operational complexity (deployment/coordination)
- Conclusion: No violation - only 1 deployable project exists

---

### Article VIII: Anti-Abstraction Gate

**Trigger**: Custom abstraction layers detected

**Current Status**: 
- Detected: 2 potential abstraction files
- **APPROVED**: CLI command wrappers are valid abstractions
- **Justification**: 
  - `bin/musubi-*.js` CLIs wrap Node.js libraries (Commander, Inquirer)
  - Purpose: Consistent CLI interface, not framework hiding
  - Benefit: Scriptability, automation, CI/CD integration

**Approval Date**: 2025-11-23
**Approved By**: Technical Lead
**Rationale**: 
- CLI wrappers provide value (scripting, automation)
- No multi-framework abstraction (single implementation)
- Direct usage of framework APIs (Commander, Inquirer)
- Conclusion: Valid abstraction for CLI interface (Article II compliance)

---

## Approval Template

```markdown
## [Article Number]: [Gate Name]

**Trigger**: [What triggered this gate]
**Date**: YYYY-MM-DD
**Requested By**: [Name/Role]

**Proposal**:
[Describe what is being proposed]

**Justification**:
- Business requirement: [Why this is needed]
- Technical constraint: [Why alternatives don't work]
- Team capacity: [Resources available]

**Alternatives Considered**:
1. [Alternative 1] - Rejected because [reason]
2. [Alternative 2] - Rejected because [reason]

**Impact Assessment**:
- Complexity added: [Low/Medium/High]
- Maintenance burden: [Estimated hours/month]
- Team expertise: [Does team have skills?]

**Approval Decision**: [APPROVED / REJECTED]
**Approved By**: [Names and roles]
**Conditions**: [Any conditions for approval]

**Review Date**: [When to re-evaluate this decision]
```

---

## Approval Process

### Step 1: Gate Triggered

`musubi-validate` detects constitutional violation and outputs:

```bash
✗ Article VII: 5 sub-projects detected (limit: 3) - Phase -1 Gate approval required
```

### Step 2: Proposal Documentation

Developer creates Phase -1 Gate proposal using template above in this file.

### Step 3: Review

**Required Reviewers**:

| Gate | Required Approvers | Timeline |
|------|-------------------|----------|
| Simplicity (Article VII) | System Architect, Project Manager | 2-3 days |
| Anti-Abstraction (Article VIII) | System Architect, Senior Developer | 1-2 days |
| EARS Compliance (Article IV) | Requirements Analyst, Product Owner | 1-2 days |
| Traceability (Article V) | QA Lead, Compliance Officer | 1-2 days |

### Step 4: Decision

Approvers review and vote:
- **APPROVED**: Proceed with implementation, document approval in this file
- **REJECTED**: Revise proposal or abandon approach
- **CONDITIONAL**: Approve with conditions (time-boxed, specific constraints)

### Step 5: Implementation

After approval, proceed with implementation. Include gate approval reference in commits:

```bash
git commit -m "feat: Add 4th sub-project (Phase -1 Gate #001 approved)"
```

### Step 6: Review

Approved gates should be reviewed quarterly to ensure they remain valid.

---

## Active Gate Approvals

### Gate #001: Simplicity Gate - References Directory

- **Status**: APPROVED
- **Date**: 2025-11-23
- **Review Date**: 2026-02-23
- **Condition**: References remain non-deployable (documentation only)

### Gate #002: Anti-Abstraction - CLI Wrappers

- **Status**: APPROVED
- **Date**: 2025-11-23
- **Review Date**: 2026-02-23
- **Condition**: CLI wrappers remain single-framework (no multi-framework abstraction)

---

## Historical Gates

_No historical gates yet_

---

## Rejected Gates

_No rejected gates yet_

---

**Maintained By**: Project Architect
**Next Review**: 2026-02-23
