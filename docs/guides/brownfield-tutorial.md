# Brownfield Project Tutorial

**Managing Changes in Existing Projects with MUSUBI**

This tutorial demonstrates how to use MUSUBI's change management system to introduce specifications into an existing codebase (brownfield project).

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Workflow](#workflow)
5. [Delta Specifications](#delta-specifications)
6. [Gap Detection](#gap-detection)
7. [Coverage Validation](#coverage-validation)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

---

## Overview

### What is a Brownfield Project?

A brownfield project is an existing codebase that needs to adopt specification-driven development practices. Unlike greenfield (new) projects, brownfield projects have:

- Existing code without formal requirements
- Legacy architecture decisions
- Technical debt
- Incomplete documentation
- Evolving requirements

### MUSUBI's Brownfield Support

MUSUBI provides three key tools for brownfield projects:

1. **Change Management** (`musubi-change`) - Track incremental changes
2. **Gap Detection** (`musubi-gaps`) - Identify missing specifications
3. **Traceability** (`musubi-trace`) - Link requirements to code

---

## Prerequisites

### Installation

```bash
npm install -g musubi-sdd
```

### Initialize MUSUBI

```bash
cd your-project
musubi init --copilot  # or --claude, --cursor, etc.
```

This creates:
- `steering/` - Project memory (architecture, tech, product)
- `.github/AGENTS.md` - Agent configuration
- `.github/prompts/` - SDD commands

### Onboard Existing Project

```bash
musubi-onboard
```

This analyzes your codebase and generates:
- `steering/structure.md` - Architecture patterns
- `steering/tech.md` - Technology stack
- `steering/product.md` - Product context

---

## Quick Start

### Step 1: Create Your First Change Proposal

```bash
musubi-change init CHANGE-001 --title "Add user authentication"
```

This creates `storage/changes/CHANGE-001.md` with a delta specification template.

### Step 2: Fill in the Delta Specification

Edit `storage/changes/CHANGE-001.md`:

```markdown
# Change Proposal: CHANGE-001

## Metadata
- **Title**: Add user authentication
- **Date**: 2025-11-23
- **Author**: Your Name
- **Status**: pending

## Requirements Changes

### ADDED
- REQ-AUTH-001: User shall be able to log in with email and password
- REQ-AUTH-002: User shall be able to log out
- REQ-AUTH-003: User shall be able to reset password via email

### MODIFIED
<!-- List modified requirements here -->

### REMOVED
<!-- List removed requirements here -->

### RENAMED
<!-- List renamed requirements here -->

## Design Changes

### ADDED
- Authentication service design
- JWT token management
- Password hashing strategy (bcrypt)

## Code Changes

### ADDED
- `src/auth/login.js` - Login endpoint
- `src/auth/logout.js` - Logout endpoint
- `src/auth/password-reset.js` - Password reset flow
- `src/middleware/auth.js` - JWT verification middleware

## Impact Analysis

### Affected Components
- User API (`/api/users`)
- Database schema (add `users.password_hash`, `users.reset_token`)
- Frontend login page

### Breaking Changes
- None (new feature)

### Migration Steps
1. Run database migration: `npm run migrate:auth`
2. Update environment variables: `JWT_SECRET`, `SMTP_HOST`
3. Deploy backend first, then frontend

## Testing Checklist

- [x] Unit tests for login/logout/reset
- [x] Integration tests for auth flow
- [ ] E2E tests for UI
- [ ] Security audit (password handling)

## Traceability

### Requirements → Design
- REQ-AUTH-001 → Authentication Service Design
- REQ-AUTH-002 → Session Management Design
- REQ-AUTH-003 → Password Reset Flow Design

### Design → Code
- Authentication Service → `src/auth/login.js`
- JWT Token Management → `src/middleware/auth.js`

### Code → Tests
- `src/auth/login.js` → `tests/auth/login.test.js`
- `src/auth/logout.js` → `tests/auth/logout.test.js`

## Approval Gates

- [ ] **Technical Review**: Architecture team approval
- [ ] **Product Review**: Product manager approval
- [ ] **Security Review**: Security team approval (password handling)
```

### Step 3: Validate the Change

```bash
musubi-change validate CHANGE-001 --verbose
```

Expected output:
```
✓ Valid delta specification
  - Found 3 ADDED requirements
  - REQ-XXX-NNN pattern compliance: 100%
```

### Step 4: Preview the Change (Dry Run)

```bash
musubi-change apply CHANGE-001 --dry-run
```

Expected output:
```
🔍 Previewing changes for CHANGE-001...

📊 Statistics:
  - Requirements: 3 added, 0 modified, 0 removed, 0 renamed
  - Design files: 1 added
  - Code files: 4 added

✓ Dry-run complete. Use --force to apply.
```

### Step 5: Apply the Change

```bash
musubi-change apply CHANGE-001
```

This creates:
- `docs/requirements/auth.md` - Requirements document
- `docs/design/auth.md` - Design document
- Links requirements to existing code (if `REQ-AUTH-001` comments exist)

### Step 6: Archive the Change

```bash
musubi-change archive CHANGE-001
```

This:
- Moves `storage/changes/CHANGE-001.md` → `specs/changes/CHANGE-001.md`
- Merges delta to canonical specifications in `specs/`

---

## Workflow

### Brownfield Change Management Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Brownfield Project                        │
│  (Existing code without formal requirements)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Identify Change Needed                             │
│  - New feature request                                      │
│  - Bug fix requiring spec                                   │
│  - Refactoring with traceability                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Create Change Proposal                             │
│  $ musubi-change init CHANGE-XXX --title "Feature Name"     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Fill Delta Specification                           │
│  - ADDED requirements (REQ-XXX-NNN)                         │
│  - MODIFIED requirements (before/after)                     │
│  - REMOVED requirements (with rationale)                    │
│  - Impact analysis, testing checklist                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Validate Delta Format                              │
│  $ musubi-change validate CHANGE-XXX --verbose              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Implement Code Changes                             │
│  - Add REQ-XXX-NNN comments in code                         │
│  - Write tests with REQ-XXX-NNN references                  │
│  - Update design documents                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Apply Change to Specs                              │
│  $ musubi-change apply CHANGE-XXX                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Detect Gaps                                        │
│  $ musubi-gaps detect --verbose                             │
│  - Orphaned requirements?                                   │
│  - Untested code?                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 8: Validate Coverage                                  │
│  $ musubi-gaps coverage --min-coverage 100                  │
│  - Requirements coverage: 100%?                             │
│  - Code coverage: 100%?                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 9: Archive Change                                     │
│  $ musubi-change archive CHANGE-XXX                         │
│  - Move to specs/changes/                                   │
│  - Merge to canonical specs                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Result: Incrementally Specified Codebase                   │
│  - Requirements tracked in docs/requirements/               │
│  - Design documented in docs/design/                        │
│  - Code linked via REQ-XXX-NNN comments                     │
│  - 100% traceability achieved                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Delta Specifications

### What is a Delta Specification?

A delta specification describes **changes** to requirements, not the complete set. This is ideal for brownfield projects where you incrementally add specifications.

### Delta Format

```markdown
## Requirements Changes

### ADDED
- REQ-XXX-001: New requirement description

### MODIFIED
- REQ-XXX-002: Updated requirement description
  - **Before**: Old description
  - **After**: New description
  - **Reason**: Why changed

### REMOVED
- REQ-XXX-003: Deprecated requirement
  - **Reason**: Why removed

### RENAMED
- REQ-XXX-004 → REQ-YYY-004: Requirement moved to different category
```

### When to Use Each Section

#### ADDED
Use when introducing new requirements:
- New features
- New constraints
- New quality attributes

Example:
```markdown
### ADDED
- REQ-AUTH-001: User shall be able to log in with email and password
- REQ-AUTH-002: Password shall be hashed using bcrypt with cost factor 12
```

#### MODIFIED
Use when changing existing requirements:
- Clarifications
- Scope changes
- Updated constraints

Example:
```markdown
### MODIFIED
- REQ-PERF-001: API response time shall be < 200ms
  - **Before**: API response time shall be < 500ms
  - **After**: API response time shall be < 200ms
  - **Reason**: User feedback showed 500ms was too slow
```

#### REMOVED
Use when deprecating requirements:
- Obsolete features
- Technical debt removal
- Simplified scope

Example:
```markdown
### REMOVED
- REQ-LEGACY-001: Support IE11 browser
  - **Reason**: IE11 reached end-of-life, usage < 0.1%
```

#### RENAMED
Use when reorganizing requirements:
- Category changes
- ID consolidation
- Structure improvements

Example:
```markdown
### RENAMED
- REQ-AUTH-001 → REQ-SEC-001: User authentication
  - **Reason**: Moved from AUTH category to SEC (security) category
```

---

## Gap Detection

### What are Gaps?

Gaps are missing traceability links in your specification chain:

```
Requirements → Design → Code → Tests
     ↑           ↑        ↑      ↑
     └── Gap ────┴── Gap ─┴─ Gap┘
```

### Types of Gaps

#### 1. Orphaned Requirements
Requirements with no design or task references.

**Detection**:
```bash
musubi-gaps requirements
```

**Example Output**:
```
🔴 Orphaned Requirements:

  REQ-AUTH-001: User Login
    File: docs/requirements/auth.md
    Reason: No design or task references found
```

**How to Fix**:
1. Create design document: `musubi-design init "Authentication"`
2. Reference requirement: "This design implements REQ-AUTH-001"
3. Re-run: `musubi-gaps requirements`

#### 2. Unimplemented Requirements
Requirements with no code implementation.

**Detection**:
```bash
musubi-gaps detect --verbose
```

**Example Output**:
```
🔴 Unimplemented Requirements:

  REQ-AUTH-002: User Logout
    File: docs/requirements/auth.md
    Reason: No code implementation found
```

**How to Fix**:
1. Implement code
2. Add comment: `// REQ-AUTH-002: User logout`
3. Re-run: `musubi-gaps detect`

#### 3. Untested Code
Source files without corresponding test files.

**Detection**:
```bash
musubi-gaps code
```

**Example Output**:
```
🔴 Untested Code:

  src/auth/login.js
    Reason: No corresponding test file found
```

**How to Fix**:
1. Create test file: `tests/auth/login.test.js`
2. Re-run: `musubi-gaps code`

#### 4. Missing Test Coverage
Requirements without test references.

**Detection**:
```bash
musubi-gaps detect
```

**How to Fix**:
1. Add comment in test: `// REQ-AUTH-001: Test user login`
2. Re-run: `musubi-gaps detect`

---

## Coverage Validation

### Calculate Coverage Statistics

```bash
musubi-gaps coverage
```

**Example Output**:
```
📊 Coverage Statistics

Requirements Coverage:
  Total Requirements: 10
  With Design: 8 (80.0%)
  With Tasks: 7 (70.0%)
  With Code: 9 (90.0%)
  With Tests: 6 (60.0%)

Code Coverage:
  Total Source Files: 20
  Tested: 18 (90.0%)
  Untested: 2
```

### Enforce 100% Coverage (CI/CD)

```bash
musubi-gaps coverage --min-coverage 100
```

Exit codes:
- `0` - Coverage meets minimum (pass)
- `1` - Coverage below minimum (fail)

**GitHub Actions Example**:
```yaml
name: Coverage Check
on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g musubi-sdd
      - run: musubi-gaps coverage --min-coverage 100
```

---

## Best Practices

### 1. Start Small

Don't try to specify the entire codebase at once. Start with:
- New features
- Critical bug fixes
- High-risk areas

**Example**:
```bash
# Week 1: Authentication module
musubi-change init CHANGE-001 --title "Specify auth module"

# Week 2: Payment module
musubi-change init CHANGE-002 --title "Specify payment module"
```

### 2. Use REQ Comments Everywhere

Add `REQ-XXX-NNN` comments in:
- Source code
- Test files
- Design documents
- Task descriptions

**Example**:
```javascript
// REQ-AUTH-001: User login with email and password
function login(email, password) {
  // REQ-AUTH-002: Password must be hashed
  const hash = bcrypt.hash(password, 12);
  // ...
}
```

### 3. Validate After Each Change

```bash
# After implementing a change
musubi-change apply CHANGE-001
musubi-gaps detect
musubi-gaps coverage --min-coverage 100
```

### 4. Archive Completed Changes

```bash
# Move to canonical specs
musubi-change archive CHANGE-001
```

This keeps `storage/changes/` clean (active changes only).

### 5. Export Gap Reports

```bash
# Export for team review
musubi-gaps detect --format markdown > reports/gaps-$(date +%Y%m%d).md
```

### 6. Incremental Adoption

```
Phase 1 (Month 1): Core modules (auth, payments)
Phase 2 (Month 2): API endpoints
Phase 3 (Month 3): UI components
Phase 4 (Month 4): Background jobs
```

---

## Examples

### Example 1: Add Authentication to Express App

#### Existing Code
```javascript
// src/app.js
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  // No authentication
  res.json({ users: [] });
});
```

#### Step 1: Create Change Proposal
```bash
musubi-change init CHANGE-001 --title "Add JWT authentication"
```

#### Step 2: Edit Delta Spec
```markdown
## Requirements Changes

### ADDED
- REQ-AUTH-001: API endpoints shall require JWT authentication
- REQ-AUTH-002: JWT tokens shall expire after 24 hours
- REQ-AUTH-003: Invalid tokens shall return 401 Unauthorized

## Code Changes

### ADDED
- `src/middleware/auth.js` - JWT verification middleware
```

#### Step 3: Implement Code
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// REQ-AUTH-001: JWT authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    // REQ-AUTH-003: Return 401 for missing token
    return res.sendStatus(401);
  }

  // REQ-AUTH-002: Verify token (expires in 24h)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // REQ-AUTH-003: Return 401 for invalid token
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
```

```javascript
// src/app.js
const express = require('express');
const { authenticateToken } = require('./middleware/auth');
const app = express();

// REQ-AUTH-001: Protect API endpoints
app.get('/api/users', authenticateToken, (req, res) => {
  res.json({ users: [] });
});
```

#### Step 4: Write Tests
```javascript
// tests/middleware/auth.test.js
const { authenticateToken } = require('../../src/middleware/auth');

// REQ-AUTH-001: Test JWT authentication
describe('authenticateToken', () => {
  // REQ-AUTH-003: Test invalid token returns 401
  it('should return 401 for invalid token', () => {
    // ...
  });

  // REQ-AUTH-002: Test token expiration
  it('should reject expired token', () => {
    // ...
  });
});
```

#### Step 5: Apply and Validate
```bash
musubi-change apply CHANGE-001
musubi-gaps detect
# ✓ No gaps detected! 100% traceability achieved.

musubi-change archive CHANGE-001
```

### Example 2: Refactor Payment Module

#### Existing Code (Technical Debt)
```javascript
// src/payment.js (200 lines, no tests, no specs)
function processPayment(amount, cardNumber) {
  // Legacy code without error handling
  // ...
}
```

#### Step 1: Create Change Proposal
```bash
musubi-change init CHANGE-002 --title "Refactor payment module with specs"
```

#### Step 2: Delta Spec
```markdown
## Requirements Changes

### ADDED
- REQ-PAY-001: Payment processing shall validate card number format
- REQ-PAY-002: Payment shall return transaction ID on success
- REQ-PAY-003: Payment failures shall log error with customer ID

## Code Changes

### MODIFIED
- `src/payment.js` - Add validation and error handling

## Impact Analysis

### Breaking Changes
- `processPayment()` now returns `{ success, transactionId, error }`
  - **Before**: `processPayment(amount, cardNumber) → boolean`
  - **After**: `processPayment(amount, cardNumber) → { success, transactionId, error }`

### Migration Steps
1. Update all callers to use new return format
2. Add tests for validation logic
```

#### Step 3: Refactor Code
```javascript
// src/payment.js
// REQ-PAY-001: Validate card number format
function validateCardNumber(cardNumber) {
  const regex = /^\d{13,19}$/;
  return regex.test(cardNumber);
}

// REQ-PAY-002, REQ-PAY-003: Payment processing with transaction ID and error logging
function processPayment(amount, cardNumber, customerId) {
  // REQ-PAY-001: Validate card number
  if (!validateCardNumber(cardNumber)) {
    const error = 'Invalid card number format';
    // REQ-PAY-003: Log error with customer ID
    console.error(`Payment failed for customer ${customerId}: ${error}`);
    return { success: false, error };
  }

  // Process payment...
  const transactionId = generateTransactionId();
  
  // REQ-PAY-002: Return transaction ID on success
  return { success: true, transactionId };
}
```

#### Step 4: Write Tests
```javascript
// tests/payment.test.js
const { processPayment } = require('../src/payment');

// REQ-PAY-001: Test card number validation
describe('processPayment', () => {
  it('should reject invalid card number', () => {
    const result = processPayment(100, 'invalid', 'CUST-001');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid card number format');
  });

  // REQ-PAY-002: Test transaction ID returned
  it('should return transaction ID on success', () => {
    const result = processPayment(100, '4111111111111111', 'CUST-001');
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });
});
```

#### Step 5: Validate and Archive
```bash
musubi-change validate CHANGE-002
musubi-change apply CHANGE-002
musubi-gaps coverage --min-coverage 100
# ✓ Coverage 100% meets minimum 100%

musubi-change archive CHANGE-002
```

---

## Next Steps

### Incremental Specification

Continue specifying modules incrementally:

```bash
# Specify user management
musubi-change init CHANGE-003 --title "Specify user CRUD operations"

# Specify API endpoints
musubi-change init CHANGE-004 --title "Specify REST API contracts"

# Specify database schema
musubi-change init CHANGE-005 --title "Specify database migrations"
```

### Traceability Matrix

Generate end-to-end traceability:

```bash
musubi-trace matrix --format markdown > docs/traceability-matrix.md
```

### Coverage Monitoring

Set up continuous coverage monitoring:

```bash
# .github/workflows/coverage.yml
musubi-gaps coverage --min-coverage 100
```

### Team Adoption

Share project memories:

```bash
musubi-share export
# Send memories.json to team
musubi-share import memories.json
```

---

## Summary

**Brownfield Best Practices**:

✅ Start small (one module at a time)  
✅ Use delta specifications (ADDED/MODIFIED/REMOVED)  
✅ Add REQ comments in code and tests  
✅ Validate after each change (musubi-gaps)  
✅ Enforce 100% coverage (CI/CD)  
✅ Archive completed changes  
✅ Export gap reports for team review  

**Result**: Incrementally transform legacy code into a well-specified, traceable system.

---

**Related Guides**:
- [Delta Specification Guide](./delta-spec-guide.md)
- [Gap Detection Guide](./gap-detection-guide.md)
- [Traceability Guide](./traceability-guide.md)
- [Constitutional Governance](../steering/rules/constitution.md)
