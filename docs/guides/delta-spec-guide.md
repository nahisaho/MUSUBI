# Delta Specification Guide

**Managing Requirements Changes with Delta Specifications**

This guide explains how to use MUSUBI's delta specification format to track incremental changes in both greenfield and brownfield projects.

---

## Table of Contents

1. [Overview](#overview)
2. [Delta Format](#delta-format)
3. [Creating Delta Specs](#creating-delta-specs)
4. [Validation](#validation)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Overview

### What is a Delta Specification?

A **delta specification** describes **changes** to requirements rather than the complete set. This approach:

- ✅ Simplifies change tracking
- ✅ Reduces merge conflicts
- ✅ Provides clear audit trail
- ✅ Supports incremental adoption (brownfield)
- ✅ Enables change impact analysis

### Delta vs. Complete Specification

**Complete Specification** (Traditional):
```markdown
## Requirements
- REQ-001: Feature A
- REQ-002: Feature B
- REQ-003: Feature C (updated)
- REQ-004: Feature D
```
❌ Hard to see what changed  
❌ Requires full specification upfront  

**Delta Specification** (MUSUBI):
```markdown
## Requirements Changes

### ADDED
- REQ-004: Feature D

### MODIFIED
- REQ-003: Feature C
  - **Before**: Old description
  - **After**: New description
```
✅ Clear change tracking  
✅ Incremental specification  

---

## Delta Format

### Four Change Types

MUSUBI supports four delta operations:

#### 1. ADDED

New requirements, design decisions, or code.

**Format**:
```markdown
### ADDED
- REQ-XXX-NNN: Requirement description
```

**When to Use**:
- New features
- New constraints
- New quality attributes
- Additional test coverage

**Example**:
```markdown
### ADDED
- REQ-AUTH-001: User shall be able to log in with email and password
- REQ-AUTH-002: Password shall be hashed using bcrypt with cost factor 12
- REQ-AUTH-003: Failed login attempts shall be rate-limited (5 per minute)
```

#### 2. MODIFIED

Changed requirements (clarifications, scope changes).

**Format**:
```markdown
### MODIFIED
- REQ-XXX-NNN: Requirement title
  - **Before**: Old description
  - **After**: New description
  - **Reason**: Why changed
```

**When to Use**:
- Clarifying ambiguous requirements
- Scope adjustments
- Performance target updates
- Constraint changes

**Example**:
```markdown
### MODIFIED
- REQ-PERF-001: API response time performance
  - **Before**: API response time shall be < 500ms
  - **After**: API response time shall be < 200ms (95th percentile)
  - **Reason**: User feedback showed 500ms felt sluggish. Measured 95th percentile instead of average.
```

#### 3. REMOVED

Deprecated or obsolete requirements.

**Format**:
```markdown
### REMOVED
- REQ-XXX-NNN: Requirement title
  - **Reason**: Why removed
```

**When to Use**:
- Obsolete features
- Technical debt removal
- Scope reduction
- Platform deprecation

**Example**:
```markdown
### REMOVED
- REQ-COMPAT-001: Support Internet Explorer 11
  - **Reason**: IE11 reached end-of-life (June 2022). Current usage < 0.1% of users.
- REQ-LEGACY-002: Export to CSV format
  - **Reason**: Replaced by Excel export (REQ-EXPORT-003). No usage in last 6 months.
```

#### 4. RENAMED

Reorganized requirements (ID changes, category moves).

**Format**:
```markdown
### RENAMED
- REQ-XXX-NNN → REQ-YYY-NNN: Requirement title
  - **Reason**: Why renamed
```

**When to Use**:
- Category reorganization
- ID consolidation
- Structure improvements
- Namespace changes

**Example**:
```markdown
### RENAMED
- REQ-AUTH-001 → REQ-SEC-001: User authentication
  - **Reason**: Moved from AUTH category to SEC (security) for better organization
- REQ-API-042 → REQ-API-010: User CRUD endpoints
  - **Reason**: Renumbered to sequential IDs after removing deprecated requirements
```

---

## Creating Delta Specs

### Using musubi-change CLI

#### Step 1: Initialize Change Proposal

```bash
musubi-change init CHANGE-001 --title "Add user authentication"
```

This creates `storage/changes/CHANGE-001.md` with template:

```markdown
# Change Proposal: CHANGE-001

## Metadata
- **Change ID**: CHANGE-001
- **Title**: Add user authentication
- **Date**: 2025-11-23
- **Author**: (your name)
- **Status**: pending

## Requirements Changes

### ADDED
<!-- List new requirements here -->

### MODIFIED
<!-- List modified requirements here -->

### REMOVED
<!-- List removed requirements here -->

### RENAMED
<!-- List renamed requirements here -->

## Design Changes

### ADDED
<!-- List new design decisions here -->

### MODIFIED
<!-- List modified design decisions here -->

### REMOVED
<!-- List removed design decisions here -->

## Code Changes

### ADDED
<!-- List new files/modules here -->

### MODIFIED
<!-- List modified files/modules here -->

### REMOVED
<!-- List removed files/modules here -->

### RENAMED
<!-- List renamed files/modules here -->

## Impact Analysis

### Affected Components
<!-- List impacted systems/modules -->

### Breaking Changes
<!-- List any breaking API changes -->

### Migration Steps
<!-- List required migration actions -->

## Testing Checklist

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

## Traceability

### Requirements → Design
<!-- Map requirements to design decisions -->

### Design → Code
<!-- Map design to implementation -->

### Code → Tests
<!-- Map implementation to test coverage -->

## Approval Gates

- [ ] **Technical Review**: (reviewer name)
- [ ] **Product Review**: (reviewer name)
- [ ] **Security Review**: (reviewer name)
```

#### Step 2: Fill in Delta Sections

Edit `storage/changes/CHANGE-001.md` and fill in the relevant sections.

**Minimum Required**:
- At least one REQ-XXX-NNN in ADDED, MODIFIED, or REMOVED
- Impact Analysis (affected components)
- Traceability mapping

**Optional but Recommended**:
- Design changes
- Code changes
- Testing checklist
- Migration steps

#### Step 3: Validate Format

```bash
musubi-change validate CHANGE-001 --verbose
```

Expected output:
```
✓ Valid delta specification

📊 Statistics:
  ADDED requirements: 3
  MODIFIED requirements: 1
  REMOVED requirements: 0
  RENAMED requirements: 0

✓ REQ-XXX-NNN pattern compliance: 100%
✓ Impact analysis section present
✓ Traceability mapping complete
```

#### Step 4: Apply Changes

```bash
# Preview first (dry-run)
musubi-change apply CHANGE-001 --dry-run

# Apply
musubi-change apply CHANGE-001
```

#### Step 5: Archive

```bash
musubi-change archive CHANGE-001
```

This:
- Moves `storage/changes/CHANGE-001.md` → `specs/changes/CHANGE-001.md`
- Merges delta to canonical specs in `specs/`
- Creates/updates `docs/requirements/*.md`

---

## Validation

### REQ-XXX-NNN Pattern

MUSUBI enforces the `REQ-XXX-NNN` pattern:

- **REQ**: Prefix (required)
- **XXX**: Category (3+ uppercase letters)
- **NNN**: Number (3+ digits)

**Valid Examples**:
```
REQ-AUTH-001
REQ-PERF-042
REQ-SECURITY-123
```

**Invalid Examples**:
```
REQ-001          ❌ Missing category
REQ-auth-001     ❌ Lowercase category
REQUIREMENT-001  ❌ Wrong prefix
REQ-A-1          ❌ Too short
```

### Validation Rules

#### 1. At Least One Change

Delta must have at least one item in ADDED, MODIFIED, or REMOVED:

```bash
musubi-change validate CHANGE-001
```

```
✗ Error: No requirements found in delta
  Add at least one REQ-XXX-NNN to ADDED, MODIFIED, or REMOVED sections
```

#### 2. REQ-XXX-NNN Format

All requirement IDs must follow pattern:

```bash
musubi-change validate CHANGE-001 --verbose
```

```
✗ Error: Invalid REQ ID format
  - Line 42: "REQ-001" (missing category)
  - Line 58: "REQ-auth-001" (lowercase category)
```

#### 3. Before/After for MODIFIED

MODIFIED requirements must have Before/After:

```markdown
### MODIFIED
- REQ-PERF-001: API response time
  - **Before**: < 500ms
  - **After**: < 200ms
  - **Reason**: User feedback
```

Missing Before/After triggers warning:

```
⚠ Warning: MODIFIED requirement missing Before/After
  - REQ-PERF-001 (line 42)
```

#### 4. Reason for REMOVED/RENAMED

REMOVED and RENAMED should have rationale:

```markdown
### REMOVED
- REQ-LEGACY-001: IE11 support
  - **Reason**: IE11 end-of-life
```

Missing reason triggers warning:

```
⚠ Warning: REMOVED requirement missing Reason
  - REQ-LEGACY-001 (line 58)
```

---

## Best Practices

### 1. Small, Focused Changes

Create separate change proposals for different concerns:

**❌ Bad** (mixing concerns):
```bash
musubi-change init CHANGE-001 --title "Add auth, fix payments, refactor UI"
```

**✅ Good** (focused changes):
```bash
musubi-change init CHANGE-001 --title "Add user authentication"
musubi-change init CHANGE-002 --title "Fix payment validation bug"
musubi-change init CHANGE-003 --title "Refactor UI components"
```

### 2. Descriptive Titles

**❌ Bad**:
```bash
musubi-change init CHANGE-001 --title "Update code"
```

**✅ Good**:
```bash
musubi-change init CHANGE-001 --title "Add JWT authentication to API endpoints"
```

### 3. Clear Before/After

**❌ Bad**:
```markdown
### MODIFIED
- REQ-PERF-001: Made it faster
  - **Before**: Slow
  - **After**: Fast
```

**✅ Good**:
```markdown
### MODIFIED
- REQ-PERF-001: API response time (95th percentile)
  - **Before**: API response time shall be < 500ms (average)
  - **After**: API response time shall be < 200ms (95th percentile)
  - **Reason**: 
    1. Average hides outliers that affect UX
    2. 95th percentile is industry standard (Google, AWS)
    3. User testing showed 200ms feels instant
```

### 4. Actionable Removal Reasons

**❌ Bad**:
```markdown
### REMOVED
- REQ-LEGACY-001: Old feature
  - **Reason**: Not needed anymore
```

**✅ Good**:
```markdown
### REMOVED
- REQ-LEGACY-001: Internet Explorer 11 support
  - **Reason**:
    1. IE11 reached end-of-life (June 15, 2022)
    2. Current usage: 0.08% (12 users out of 15,000 monthly active)
    3. Maintenance cost: 40 hours/month (polyfills, testing)
    4. Alternatives: Modern browsers (Chrome, Firefox, Edge, Safari)
```

### 5. Complete Traceability

Map every requirement to design/code/tests:

```markdown
## Traceability

### Requirements → Design
- REQ-AUTH-001 (User Login) → Authentication Service Design (docs/design/auth.md)
- REQ-AUTH-002 (Password Hashing) → Security Best Practices (docs/design/security.md)

### Design → Code
- Authentication Service → src/auth/login.js, src/auth/middleware.js
- Password Hashing → src/auth/password.js (bcrypt wrapper)

### Code → Tests
- src/auth/login.js → tests/auth/login.test.js (12 test cases)
- src/auth/password.js → tests/auth/password.test.js (8 test cases)
```

### 6. Impact Analysis

List all affected components:

```markdown
## Impact Analysis

### Affected Components
- **Backend**: User API (/api/users), Auth middleware
- **Database**: Add `users.password_hash`, `users.last_login` columns
- **Frontend**: Login page, session management
- **Infrastructure**: Add Redis for session storage

### Breaking Changes
- `/api/login` now requires email (was username)
  - **Migration**: Map existing usernames to emails in database
  - **Timeline**: 2-week deprecation period

### Dependencies
- Add: bcrypt@^5.1.0, jsonwebtoken@^9.0.0
- Update: express-session@^1.17.0 → @^1.18.0

### Migration Steps
1. Run database migration: `npm run migrate:add-auth`
2. Update environment variables: `JWT_SECRET`, `SESSION_SECRET`
3. Deploy backend (API changes)
4. Deploy frontend (UI changes)
5. Monitor error rate for 24 hours
```

---

## Examples

### Example 1: Add New Feature (ADDED)

```markdown
# Change Proposal: CHANGE-001

## Metadata
- **Title**: Add two-factor authentication (2FA)
- **Date**: 2025-11-23
- **Status**: pending

## Requirements Changes

### ADDED
- REQ-SEC-010: User shall be able to enable 2FA via SMS
- REQ-SEC-011: User shall be able to enable 2FA via authenticator app (TOTP)
- REQ-SEC-012: 2FA codes shall expire after 5 minutes
- REQ-SEC-013: 2FA shall be optional (user choice)

## Design Changes

### ADDED
- TOTP implementation using `speakeasy` library
- SMS provider integration (Twilio)
- 2FA enrollment flow (QR code generation)

## Code Changes

### ADDED
- `src/auth/2fa/totp.js` - TOTP code generation/validation
- `src/auth/2fa/sms.js` - SMS code sending
- `src/auth/2fa/enrollment.js` - 2FA setup flow
- `tests/auth/2fa/*.test.js` - 2FA tests

## Impact Analysis

### Affected Components
- Login flow (add 2FA step)
- User settings (enable/disable 2FA)
- Database (add `users.two_factor_enabled`, `users.two_factor_secret`)

### Dependencies
- Add: speakeasy@^2.0.0, qrcode@^1.5.0, twilio@^4.0.0

## Testing Checklist
- [x] Unit tests (TOTP generation/validation)
- [x] Integration tests (enrollment flow)
- [ ] E2E tests (login with 2FA)
- [x] Security review (TOTP secret storage)

## Traceability

### Requirements → Design
- REQ-SEC-010 → SMS 2FA Design
- REQ-SEC-011 → TOTP 2FA Design
- REQ-SEC-012 → Code Expiration Design

### Design → Code
- TOTP Design → src/auth/2fa/totp.js
- SMS Design → src/auth/2fa/sms.js

### Code → Tests
- src/auth/2fa/totp.js → tests/auth/2fa/totp.test.js
```

### Example 2: Update Existing Requirement (MODIFIED)

```markdown
# Change Proposal: CHANGE-002

## Metadata
- **Title**: Improve password security requirements
- **Date**: 2025-11-23
- **Status**: pending

## Requirements Changes

### MODIFIED
- REQ-SEC-001: Password complexity requirements
  - **Before**: Password shall be at least 8 characters
  - **After**: Password shall meet all criteria:
    1. Minimum 12 characters
    2. At least 1 uppercase letter
    3. At least 1 lowercase letter
    4. At least 1 number
    5. At least 1 special character (!@#$%^&*)
  - **Reason**:
    1. NIST SP 800-63B recommends 12+ characters
    2. Recent security audit flagged weak passwords
    3. 8-character passwords can be cracked in hours

- REQ-SEC-002: Password storage
  - **Before**: Password shall be hashed using bcrypt with cost 10
  - **After**: Password shall be hashed using bcrypt with cost 12
  - **Reason**:
    1. Cost 10 is now too weak (2^10 = 1,024 rounds)
    2. Cost 12 (2^12 = 4,096 rounds) is current best practice
    3. Minimal UX impact (~100ms vs ~25ms on modern hardware)

## Code Changes

### MODIFIED
- `src/auth/password.js` - Update validation regex, bcrypt cost

## Impact Analysis

### Affected Components
- User registration (enforce new complexity)
- Password reset (enforce new complexity)
- Existing passwords (grandfather old hashes, re-hash on next login)

### Breaking Changes
- None (backward compatible: accept old hashes, upgrade on login)

### Migration Steps
1. Deploy code with new validation
2. Add notice to users: "We've improved password security. Please update your password."
3. Monitor re-hash rate (expect 80% within 30 days)

## Testing Checklist
- [x] Unit tests (new password validation)
- [x] Integration tests (registration/reset with new rules)
- [x] Migration test (old hash → new hash on login)

## Traceability

### Requirements → Code
- REQ-SEC-001 → src/auth/password.js:validatePassword()
- REQ-SEC-002 → src/auth/password.js:hashPassword() (cost=12)

### Code → Tests
- src/auth/password.js → tests/auth/password.test.js (18 test cases)
```

### Example 3: Remove Deprecated Feature (REMOVED)

```markdown
# Change Proposal: CHANGE-003

## Metadata
- **Title**: Remove deprecated XML export
- **Date**: 2025-11-23
- **Status**: pending

## Requirements Changes

### REMOVED
- REQ-EXPORT-001: System shall export data to XML format
  - **Reason**:
    1. Usage: 0.3% of exports (45 out of 15,000 monthly)
    2. Maintenance: 20 hours/month (XML schema updates)
    3. Alternative: JSON export (REQ-EXPORT-002) covers all use cases
    4. Deprecation notice sent 6 months ago (June 2025)
    5. Remaining users migrated to JSON

## Code Changes

### REMOVED
- `src/export/xml-exporter.js` - XML export logic
- `src/export/xml-schema.js` - XML schema definitions
- `tests/export/xml-exporter.test.js` - XML tests

## Impact Analysis

### Affected Components
- Export API (`DELETE /api/export/xml`)
- Admin dashboard (remove XML export option)

### Breaking Changes
- `/api/export/xml` endpoint removed
  - **Migration**: Use `/api/export/json` instead
  - **Timeline**: 3 months from now (Feb 2026)
  - **Notice**: Email sent to 45 affected users

### Migration Steps
1. Send final notice email (30 days before)
2. Add 410 Gone response to `/api/export/xml` with migration guide
3. Wait 30 days
4. Remove endpoint and code

## Testing Checklist
- [x] Verify JSON export covers all XML use cases
- [x] Test 410 Gone response with migration message
- [x] Remove XML export tests

## Traceability

### Removed Code
- src/export/xml-exporter.js (deleted)
- src/export/xml-schema.js (deleted)
- tests/export/xml-exporter.test.js (deleted)
```

### Example 4: Reorganize Requirements (RENAMED)

```markdown
# Change Proposal: CHANGE-004

## Metadata
- **Title**: Reorganize security requirements
- **Date**: 2025-11-23
- **Status**: pending

## Requirements Changes

### RENAMED
- REQ-AUTH-001 → REQ-SEC-001: User authentication
  - **Reason**: Moved authentication from AUTH to SEC category for consistency

- REQ-AUTH-002 → REQ-SEC-002: Password hashing
  - **Reason**: Moved to SEC category (all security requirements in one place)

- REQ-ENCRYPT-001 → REQ-SEC-010: Data encryption at rest
  - **Reason**: Consolidated ENCRYPT category into SEC

- REQ-ENCRYPT-002 → REQ-SEC-011: Data encryption in transit
  - **Reason**: Consolidated ENCRYPT category into SEC

## Impact Analysis

### Affected Components
- Documentation (update all REQ-XXX references)
- Code comments (update REQ-XXX references)
- Tests (update REQ-XXX references)

### Breaking Changes
- None (ID change only, functionality unchanged)

### Migration Steps
1. Update all documentation files
2. Find/replace in codebase: REQ-AUTH-001 → REQ-SEC-001
3. Update traceability matrix
4. Archive old IDs (create aliases for backward compatibility)

## Traceability

### Old ID → New ID Mapping
- REQ-AUTH-001 → REQ-SEC-001 (User authentication)
- REQ-AUTH-002 → REQ-SEC-002 (Password hashing)
- REQ-ENCRYPT-001 → REQ-SEC-010 (Encryption at rest)
- REQ-ENCRYPT-002 → REQ-SEC-011 (Encryption in transit)
```

---

## Summary

**Key Takeaways**:

✅ Use delta specs for incremental changes  
✅ Choose ADDED/MODIFIED/REMOVED/RENAMED appropriately  
✅ Follow REQ-XXX-NNN pattern strictly  
✅ Provide clear Before/After for MODIFIED  
✅ Give detailed reasons for REMOVED  
✅ Map traceability (Requirements → Design → Code → Tests)  
✅ Validate before applying (`musubi-change validate`)  
✅ Archive completed changes (`musubi-change archive`)  

**Result**: Clear audit trail of all requirement changes over time.

---

**Related Guides**:
- [Brownfield Tutorial](./brownfield-tutorial.md)
- [Gap Detection Guide](./gap-detection-guide.md)
- [Traceability Guide](./traceability-guide.md)
