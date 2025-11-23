# Change Management Workflow Guide

Complete guide for managing changes in existing codebases with MUSUBI's change management system.

## Overview

MUSUBI's change management workflow provides a structured approach to:
- Track changes to requirements in existing projects
- Validate change proposals before implementation
- Apply changes with full traceability
- Archive completed changes for future reference

## Workflow Sequence

### 1. Create Change Proposal

Initialize a new change proposal:

```bash
musubi-change init
```

Interactive prompts:
- **Change ID**: Unique identifier (e.g., `CHG-001-auth`)
- **Title**: Brief description (e.g., "Add user authentication")
- **Description**: Detailed explanation of the change
- **Impact**: Affected components/modules

**Output**: Creates `changes/CHG-001-auth.md` with delta specification template

### 2. Document Delta Specification

Edit the generated delta specification file:

```markdown
# Change: CHG-001-auth - Add User Authentication

## ADDED Requirements

- **REQ-AUTH-001**: System shall authenticate users with email/password
- **REQ-AUTH-002**: System shall implement JWT token-based session management
- **REQ-AUTH-003**: System shall enforce password complexity requirements

## MODIFIED Requirements

- **REQ-API-005**: 
  - **Before**: API endpoints are publicly accessible
  - **After**: API endpoints require valid JWT token (except /login, /register)

## REMOVED Requirements

- **REQ-SEC-001**: Basic HTTP authentication (replaced by JWT)

## Impact Analysis

- **Affected Components**: API routes, database schema, frontend login
- **Breaking Changes**: All API clients must include JWT token in headers
- **Dependencies**: bcrypt, jsonwebtoken npm packages
```

See [Delta Specification Guide](delta-spec-guide.md) for complete format reference.

### 3. Validate Format

Validate the delta specification:

```bash
musubi-change validate changes/CHG-001-auth.md
```

**Validation Checks**:
- ✓ REQ-XXX-NNN pattern format
- ✓ Required sections present (ADDED/MODIFIED/REMOVED)
- ✓ Impact Analysis documented
- ✓ Testing Checklist included
- ✓ Traceability Mapping complete

**Example Output**:
```
✓ Delta specification is valid
✓ Found 3 ADDED requirements
✓ Found 1 MODIFIED requirement
✓ Found 1 REMOVED requirement
✓ REQ pattern format: OK
✓ Impact analysis: OK
```

### 4. Review and Approve

**Manual Review Steps**:
1. Review delta specification with stakeholders
2. Validate impact analysis is complete
3. Confirm testing requirements are defined
4. Get approval from project leads
5. Document approval in delta spec (Approval Gates section)

### 5. Apply Changes

**Dry-run mode** (recommended first):

```bash
musubi-change apply changes/CHG-001-auth.md --dry-run
```

Review proposed changes before actual application.

**Apply changes**:

```bash
musubi-change apply changes/CHG-001-auth.md
```

**What Happens**:
- ADDED requirements → Added to `docs/requirements/functional/`
- MODIFIED requirements → Updated in existing requirement files
- REMOVED requirements → Moved to archive with timestamp
- Traceability links → Updated in all affected documents

**Example Output**:
```
✓ Applied 3 ADDED requirements
✓ Applied 1 MODIFIED requirement
✓ Applied 1 REMOVED requirement
✓ Updated traceability links
✓ Changes applied successfully
```

### 6. Verify Implementation

**Run gap detection**:

```bash
musubi-gaps detect
```

Identifies:
- Orphaned requirements (no design/task/code references)
- Unimplemented requirements (requirements without code)
- Untested code (code without tests)

**Example Output**:
```
Gap Detection Report

Orphaned Requirements: 3
- REQ-AUTH-001 (no design document)
- REQ-AUTH-002 (no design document)
- REQ-AUTH-003 (no design document)

Unimplemented Requirements: 3
- REQ-AUTH-001 (no code implementation)
- REQ-AUTH-002 (no code implementation)
- REQ-AUTH-003 (no code implementation)

Action Required: Create design documents and implement code
```

**Generate traceability matrix**:

```bash
musubi-trace matrix --format markdown > trace-report.md
```

Validates:
- Requirements → Design → Tasks → Code → Tests chain
- 100% traceability coverage

### 7. Archive Completed Change

Archive the change proposal:

```bash
musubi-change archive changes/CHG-001-auth.md
```

**What Happens**:
- Moves delta spec to `specs/changes/CHG-001-auth.md`
- Updates change status to "Completed"
- Adds completion timestamp
- Preserves full change history

## Commands Reference

### musubi-change init

Create a new change proposal.

```bash
musubi-change init
```

**Options**:
- Interactive mode (default): Prompts for all fields
- Template: Pre-filled delta specification

**Output**: `changes/{changeId}.md`

### musubi-change validate

Validate delta specification format.

```bash
musubi-change validate <file>
```

**Arguments**:
- `<file>`: Path to delta specification file

**Exit Codes**:
- `0`: Valid delta specification
- `1`: Validation errors found

### musubi-change apply

Apply changes to requirements.

```bash
musubi-change apply <file> [--dry-run]
```

**Arguments**:
- `<file>`: Path to delta specification file

**Options**:
- `--dry-run`: Preview changes without applying

**Exit Codes**:
- `0`: Changes applied successfully
- `1`: Application failed

### musubi-change archive

Archive completed change.

```bash
musubi-change archive <file>
```

**Arguments**:
- `<file>`: Path to delta specification file

**Output**: Moves file to `specs/changes/`

## Integration with Other Tools

### Gap Detection Integration

After applying changes, run gap detection:

```bash
# Detect all gaps
musubi-gaps detect

# Detect only orphaned requirements
musubi-gaps requirements

# Detect only untested code
musubi-gaps code

# Calculate coverage with minimum threshold
musubi-gaps coverage --min-coverage 80
```

**Workflow**:
1. Apply change → `musubi-change apply`
2. Detect gaps → `musubi-gaps detect`
3. Create design docs → `musubi-design`
4. Create tasks → `musubi-tasks`
5. Implement code
6. Verify gaps closed → `musubi-gaps detect`

### Traceability Integration

Verify traceability after changes:

```bash
# Generate traceability matrix
musubi-trace matrix

# Calculate coverage percentage
musubi-trace coverage

# Detect traceability gaps
musubi-trace gaps

# Trace specific requirement
musubi-trace requirement REQ-AUTH-001

# Validate 100% coverage
musubi-trace validate --min-coverage 100
```

**Workflow**:
1. Apply change → Requirements updated
2. Create design → Design references requirements
3. Create tasks → Tasks reference design
4. Implement code → Code references tasks
5. Write tests → Tests reference code
6. Verify → `musubi-trace matrix`

## Real-World Examples

### Example 1: Feature Addition

**Scenario**: Add user authentication to existing API

**Workflow**:
```bash
# 1. Create change proposal
musubi-change init
# → Enter: CHG-001-auth, "Add user authentication"

# 2. Edit changes/CHG-001-auth.md
# → Document ADDED requirements (REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-003)
# → Document MODIFIED requirements (REQ-API-005 - add JWT requirement)

# 3. Validate
musubi-change validate changes/CHG-001-auth.md

# 4. Dry-run
musubi-change apply changes/CHG-001-auth.md --dry-run

# 5. Apply
musubi-change apply changes/CHG-001-auth.md

# 6. Detect gaps
musubi-gaps detect
# → Shows 3 orphaned requirements (need design docs)

# 7. Create design docs
musubi-design
# → Create design for authentication system

# 8. Create tasks
musubi-tasks
# → Break down implementation tasks

# 9. Verify traceability
musubi-trace coverage
# → Check requirements coverage percentage

# 10. Archive
musubi-change archive changes/CHG-001-auth.md
```

### Example 2: Refactoring Existing Code

**Scenario**: Replace MongoDB with PostgreSQL

**Workflow**:
```bash
# 1. Create change proposal
musubi-change init
# → Enter: CHG-002-postgres, "Migrate to PostgreSQL"

# 2. Edit changes/CHG-002-postgres.md
# → MODIFIED: REQ-DB-001 through REQ-DB-010 (update database references)
# → REMOVED: REQ-DB-020 (MongoDB-specific features)
# → ADDED: REQ-DB-030 (PostgreSQL connection pooling)

# 3. Validate
musubi-change validate changes/CHG-002-postgres.md

# 4. Apply with dry-run first
musubi-change apply changes/CHG-002-postgres.md --dry-run
# → Review all changes to requirements

# 5. Apply
musubi-change apply changes/CHG-002-postgres.md

# 6. Update design docs
musubi-design
# → Update data architecture diagrams

# 7. Create migration tasks
musubi-tasks
# → Create detailed migration steps

# 8. Archive
musubi-change archive changes/CHG-002-postgres.md
```

### Example 3: Bug Fix with Requirements Update

**Scenario**: Fix validation bug and update requirements

**Workflow**:
```bash
# 1. Create change proposal
musubi-change init
# → Enter: CHG-003-validation-fix, "Fix email validation"

# 2. Edit changes/CHG-003-validation-fix.md
# → MODIFIED: REQ-VAL-001 (clarify email validation rules)
# → No ADDED or REMOVED requirements (small scope)

# 3. Validate
musubi-change validate changes/CHG-003-validation-fix.md

# 4. Apply
musubi-change apply changes/CHG-003-validation-fix.md

# 5. Implement fix in code

# 6. Verify traceability
musubi-trace requirement REQ-VAL-001
# → Confirm code and tests reference requirement

# 7. Archive
musubi-change archive changes/CHG-003-validation-fix.md
```

## Best Practices

### 1. Keep Changes Focused

**Good**: One change proposal per feature/bug/refactor

```markdown
# CHG-001-auth - Add User Authentication
- Focus: Authentication only
- Requirements: 3 ADDED, 1 MODIFIED
```

**Bad**: Multiple unrelated changes

```markdown
# CHG-001-everything - Multiple Changes
- Authentication + Payment + Email + ...
- Requirements: 50 ADDED, 30 MODIFIED (too large!)
```

### 2. Validate Early and Often

```bash
# After every edit to delta spec
musubi-change validate changes/CHG-001-auth.md

# Before applying
musubi-change apply changes/CHG-001-auth.md --dry-run
```

### 3. Use Dry-Run Mode

Always use `--dry-run` first:

```bash
# 1. Dry-run (safe)
musubi-change apply changes/CHG-001-auth.md --dry-run
# → Review proposed changes

# 2. Apply (if dry-run looks good)
musubi-change apply changes/CHG-001-auth.md
```

### 4. Maintain 100% Traceability

After applying changes:

```bash
# 1. Detect gaps
musubi-gaps detect

# 2. Create design docs for new requirements
musubi-design

# 3. Create tasks
musubi-tasks

# 4. Verify traceability
musubi-trace coverage
# → Target: 100% coverage
```

### 5. Archive Completed Changes

Keep change history clean:

```bash
# After change is fully implemented and tested
musubi-change archive changes/CHG-001-auth.md
# → Moves to specs/changes/ for future reference
```

### 6. Review Gap Detection Regularly

Run gap detection as part of workflow:

```bash
# Daily/weekly check
musubi-gaps detect

# Before releases
musubi-gaps coverage --min-coverage 100
# → Exit code 1 if below threshold
```

## Troubleshooting

### Validation Errors

**Problem**: Invalid REQ pattern format

```
✗ Invalid REQ pattern: REQ-auth-1
```

**Solution**: Use correct format `REQ-XXX-NNN`

```markdown
# Wrong
- REQ-auth-1
- REQ-authentication-001

# Correct
- REQ-AUTH-001
- REQ-AUTH-002
```

### Apply Failures

**Problem**: File conflicts during apply

```
✗ Failed to apply changes: File conflict in requirements/functional/auth.md
```

**Solution**: Resolve conflicts manually

```bash
# 1. Review conflicting file
cat docs/requirements/functional/auth.md

# 2. Resolve conflicts

# 3. Retry apply
musubi-change apply changes/CHG-001-auth.md
```

### Missing References

**Problem**: Orphaned requirements after apply

```
Orphaned Requirements: 3
- REQ-AUTH-001 (no design document)
```

**Solution**: Create design documents

```bash
# 1. Create design docs
musubi-design

# 2. Verify gaps closed
musubi-gaps requirements
# → Should show 0 orphaned requirements
```

### Archive Failures

**Problem**: Cannot archive uncommitted changes

```
✗ Cannot archive: Change not fully implemented
```

**Solution**: Complete implementation first

```bash
# 1. Check gaps
musubi-gaps detect

# 2. Implement missing pieces

# 3. Verify traceability
musubi-trace validate --min-coverage 100

# 4. Archive
musubi-change archive changes/CHG-001-auth.md
```

## CI/CD Integration

### Pre-commit Validation

```bash
# .git/hooks/pre-commit
#!/bin/bash
for file in changes/*.md; do
  musubi-change validate "$file" || exit 1
done
```

### Pull Request Checks

```yaml
# .github/workflows/validate-changes.yml
name: Validate Changes
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g musubi-sdd
      - run: |
          for file in changes/*.md; do
            musubi-change validate "$file"
          done
```

### Coverage Enforcement

```yaml
# .github/workflows/coverage.yml
name: Coverage Check
on: [push]
jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g musubi-sdd
      - run: musubi-gaps coverage --min-coverage 80
      - run: musubi-trace validate --min-coverage 100
```

## Summary

MUSUBI's change management workflow provides:
- **Structured approach** to requirement changes
- **Validation gates** before applying changes
- **Traceability** throughout the lifecycle
- **Integration** with gap detection and traceability tools
- **Archive** for historical reference

**Key Commands**:
- `musubi-change init` → Create change proposal
- `musubi-change validate` → Validate delta spec
- `musubi-change apply` → Apply changes to requirements
- `musubi-change archive` → Archive completed changes
- `musubi-gaps detect` → Detect gaps after changes
- `musubi-trace matrix` → Verify traceability

For detailed delta specification format, see [Delta Specification Guide](delta-spec-guide.md).

For complete brownfield workflow, see [Brownfield Tutorial](brownfield-tutorial.md).
