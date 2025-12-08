# Change Management Guide

This guide explains MUSUBI's **Change Management** workflow for managing modifications to specifications and code in a controlled, traceable manner.

## Overview

Change Management in MUSUBI ensures that:
- All changes are documented and traceable
- Impact is analyzed before implementation
- Approval workflows are followed
- Changes are properly archived

## Change Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                        CHANGE LIFECYCLE                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌───────────┐   │
│  │ PROPOSE │ ─▶ │ REVIEW  │ ─▶ │ APPROVED │ ─▶ │ IMPLEMENT │   │
│  └─────────┘    └─────────┘    └──────────┘    └───────────┘   │
│       │              │                              │            │
│       │              ▼                              ▼            │
│       │         ┌─────────┐                   ┌──────────┐      │
│       │         │ REJECT  │                   │ VERIFIED │      │
│       │         └─────────┘                   └──────────┘      │
│       │                                            │            │
│       ▼                                            ▼            │
│  ┌─────────┐                                 ┌──────────┐       │
│  │  DRAFT  │                                 │ ARCHIVED │       │
│  └─────────┘                                 └──────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Creating a Change Proposal

### 1. Initialize the Change

```bash
musubi-change init --title "Feature: User Export" --type feature
```

Options:
- `--title`: Brief description of the change
- `--type`: `feature`, `bugfix`, `refactor`, `security`, `docs`
- `--priority`: `critical`, `high`, `medium`, `low`

### 2. Change Folder Structure

```
storage/changes/CHG-20251208-user-export/
├── proposal.md         # Change proposal document
├── delta-spec.md       # Delta specification
├── impact-analysis.md  # Generated impact analysis
└── status.json         # Change status metadata
```

### 3. Write the Proposal

```markdown
# Change Proposal: User Export Feature

## Summary
Add ability for users to export their profile data in JSON format.

## Motivation
- GDPR compliance requirement
- User request (Support tickets #1234, #1456)

## Scope
- New export endpoint
- Background job processing
- Email notification on completion

## Requirements Affected
- [ADDED] REQ-015: User profile export
- [ADDED] REQ-016: Export notification
- [MODIFIED] REQ-003: Data privacy policy

## Risks
- Performance impact during export
- Storage costs for large exports

## Timeline
- Development: 1 week
- Testing: 3 days
- Deployment: 1 day
```

## Impact Analysis

### Running Impact Analysis

```bash
musubi-change impact CHG-20251208-user-export
```

### Understanding the Output

```
╔══════════════════════════════════════════════════════════════╗
║                    IMPACT ANALYSIS                           ║
╠══════════════════════════════════════════════════════════════╣
║ Change: CHG-20251208-user-export                             ║
║ Status: DRAFT                                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║ 📊 IMPACT SUMMARY                                             ║
║ ├── Risk Level: MEDIUM                                        ║
║ ├── Files Affected: 8                                         ║
║ ├── Tests Required: 12                                        ║
║ └── Estimated Effort: 5 days                                  ║
║                                                               ║
║ 📁 AFFECTED FILES                                             ║
║ ├── src/controllers/UserController.js [MODIFIED]              ║
║ ├── src/services/ExportService.js [ADDED]                     ║
║ ├── src/jobs/ExportJob.js [ADDED]                             ║
║ ├── src/routes/user.js [MODIFIED]                             ║
║ └── tests/export.test.js [ADDED]                              ║
║                                                               ║
║ 🔗 DEPENDENCY CHAIN                                           ║
║ UserController                                                ║
║ └── ExportService (new)                                       ║
║     ├── UserModel                                             ║
║     ├── StorageService                                        ║
║     └── EmailService                                          ║
║                                                               ║
║ ⚠️  RECOMMENDATIONS                                            ║
║ 1. Add rate limiting for export endpoint                      ║
║ 2. Implement export size limits                               ║
║ 3. Add monitoring for export job queue                        ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

### Impact Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| LOW | Isolated change, 1-3 files | Standard review |
| MEDIUM | Multiple components, 4-10 files | Team review |
| HIGH | Core systems affected, 10+ files | Architecture review |
| CRITICAL | Breaking changes, migrations | Leadership approval |

## Review and Approval

### Requesting Review

```bash
musubi-change submit CHG-20251208-user-export --reviewer @alice @bob
```

### Reviewing a Change

```bash
# View change details
musubi-change show CHG-20251208-user-export

# View diff from baseline
musubi-change diff CHG-20251208-user-export

# Approve the change
musubi-change approve CHG-20251208-user-export

# Request changes
musubi-change request-changes CHG-20251208-user-export \
  --comment "Add error handling for large exports"

# Reject the change
musubi-change reject CHG-20251208-user-export \
  --reason "Scope too large, please split into smaller changes"
```

### Approval Matrix

| Change Type | Approvers Required | SLA |
|-------------|-------------------|-----|
| Docs | 1 | 1 day |
| Bugfix | 1 | 2 days |
| Feature (low) | 2 | 3 days |
| Feature (high) | 2 + Lead | 5 days |
| Security | Security Team | 3 days |
| Critical | Tech Lead + PM | 1 day |

## Implementation

### Applying the Change

Once approved, apply the change to your codebase:

```bash
musubi-change apply CHG-20251208-user-export
```

This:
1. Updates status to `IMPLEMENTING`
2. Creates a tracking branch (optional)
3. Updates traceability links

### Implementation Checklist

```markdown
## Implementation Checklist

### Code Changes
- [ ] ExportService implemented
- [ ] ExportJob implemented
- [ ] Routes added
- [ ] Controller updated

### Tests
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests updated

### Documentation
- [ ] API docs updated
- [ ] User guide updated
- [ ] README updated

### Review
- [ ] Code review completed
- [ ] QA testing passed
- [ ] Performance testing passed
```

### Marking Complete

```bash
musubi-change complete CHG-20251208-user-export
```

## Archiving

### Archive Completed Changes

```bash
musubi-change archive CHG-20251208-user-export
```

This:
1. Merges delta spec into main specifications
2. Updates all requirement links
3. Generates change summary report
4. Moves change to `archived/` folder

### Archive Structure

```
storage/
├── changes/           # Active changes
└── archived/
    └── 2025/
        └── 12/
            └── CHG-20251208-user-export/
                ├── summary.md
                ├── original-proposal.md
                ├── delta-spec.md
                └── impact-analysis.md
```

## Batch Operations

### Validate All Changes

```bash
musubi-change validate-all
```

### List Changes by Status

```bash
musubi-change list --status draft
musubi-change list --status review
musubi-change list --status approved
musubi-change list --status implementing
```

### Generate Status Report

```bash
musubi-change status
```

```
╔══════════════════════════════════════════════════════════════╗
║                    CHANGE STATUS REPORT                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║ Total Changes: 12                                             ║
║ ├── Draft: 3                                                  ║
║ ├── In Review: 2                                              ║
║ ├── Approved: 4                                               ║
║ ├── Implementing: 2                                           ║
║ └── Completed: 1                                              ║
║                                                               ║
║ Overdue Reviews: 1                                            ║
║ └── CHG-20251201-auth-update (5 days in review)               ║
║                                                               ║
║ Stale Changes: 2                                              ║
║ └── CHG-20251115-legacy (23 days unchanged)                   ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

## Best Practices

### 1. Small, Focused Changes

```markdown
❌ Bad: "Refactor entire user module"
✅ Good: "Refactor user validation logic"
```

### 2. Complete Documentation

Always include:
- Clear motivation
- Scope boundaries
- Risk assessment
- Rollback plan

### 3. Link Everything

```markdown
## Related Items
- Issue: #1234
- PR: #567
- Depends on: CHG-20251201-auth-update
- Blocks: CHG-20251210-notifications
```

### 4. Regular Cleanup

- Archive completed changes weekly
- Review stale changes monthly
- Purge old archives quarterly

## Integration with Git

### Branch Naming

```bash
# Auto-generated branch name
git checkout -b change/CHG-20251208-user-export
```

### Commit Messages

```bash
git commit -m "feat(export): add user export endpoint

Implements CHG-20251208-user-export
Refs: REQ-015, REQ-016"
```

### PR Template

```markdown
## Change Reference
CHG-20251208-user-export

## Requirements
- REQ-015: User profile export ✅
- REQ-016: Export notification ✅

## Impact Analysis
[View Impact Analysis](link-to-impact-analysis)

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Traceability verified
```

## Troubleshooting

### Common Issues

**Change not found**
```bash
# List all changes including archived
musubi-change list --all
```

**Validation errors**
```bash
# Get detailed validation output
musubi-change validate CHG-xxx --verbose
```

**Merge conflicts in specs**
```bash
# View spec differences
musubi-change diff CHG-xxx --detailed
```

## Next Steps

- [Delta Specs Guide](./delta-specs.md) - Delta specification format
- [Brownfield Tutorial](./brownfield.md) - Converting existing projects
- [Traceability Examples](../examples/traceability-matrix.md)

---

*Part of MUSUBI - Ultimate Specification Driven Development*
