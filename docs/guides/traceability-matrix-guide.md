# Traceability Matrix Guide

Complete guide for using MUSUBI's traceability system to maintain end-to-end traceability from requirements to tests.

## Overview

MUSUBI's traceability system provides:
- **End-to-end tracking**: Requirements → Design → Tasks → Code → Tests
- **Coverage metrics**: Percentage of traced vs untraced items
- **Gap detection**: Orphaned requirements, unimplemented features, untested code
- **Validation gates**: Enforce minimum coverage thresholds

## What is Traceability?

**Traceability** ensures every requirement is:
1. Designed in architecture/design documents
2. Broken down into implementation tasks
3. Implemented in code
4. Verified by tests

**Why it matters**:
- **Compliance**: Prove requirements are implemented
- **Impact Analysis**: Understand downstream effects of changes
- **Coverage**: Ensure nothing is missed
- **Quality**: Verify every requirement is tested

## Traceability Levels

### Level 1: Requirements → Design

Requirements must be referenced in design documents:

**Requirement** (`docs/requirements/functional/auth.md`):
```markdown
## REQ-AUTH-001: User Authentication

System shall authenticate users with email/password.
```

**Design Document** (`docs/design/authentication-system.md`):
```markdown
## Authentication Flow

This design implements the following requirements:
- REQ-AUTH-001: User authentication with email/password
- REQ-AUTH-002: JWT token management
```

**Traceability Link**: Design document references `REQ-AUTH-001`

### Level 2: Design → Tasks

Design documents must be broken down into tasks:

**Design Document** (`docs/design/authentication-system.md`):
```markdown
## Design: Authentication System (DSN-AUTH-001)
```

**Task Breakdown** (`docs/tasks/authentication-tasks.md`):
```markdown
## Tasks for DSN-AUTH-001

### TASK-AUTH-001: Implement login endpoint
- Design: DSN-AUTH-001
- Estimate: 4 hours
```

**Traceability Link**: Task references `DSN-AUTH-001`

### Level 3: Tasks → Code

Tasks must be implemented in code:

**Task** (`docs/tasks/authentication-tasks.md`):
```markdown
### TASK-AUTH-001: Implement login endpoint
```

**Code** (`src/auth/login.js`):
```javascript
/**
 * Login endpoint
 * @implements TASK-AUTH-001
 * @satisfies REQ-AUTH-001
 */
export async function login(email, password) {
  // Implementation
}
```

**Traceability Links**: Code references `TASK-AUTH-001` and `REQ-AUTH-001`

### Level 4: Code → Tests

Code must be verified by tests:

**Code** (`src/auth/login.js`):
```javascript
export async function login(email, password) {
  // Implementation
}
```

**Test** (`tests/auth/login.test.js`):
```javascript
/**
 * Tests for login functionality
 * @tests src/auth/login.js
 * @verifies REQ-AUTH-001
 */
describe('login', () => {
  it('should authenticate valid credentials', async () => {
    // Test implementation
  });
});
```

**Traceability Links**: Test references `src/auth/login.js` and `REQ-AUTH-001`

## Commands Reference

### musubi-trace matrix

Generate complete traceability matrix.

```bash
musubi-trace matrix [--format <format>]
```

**Options**:
- `--format <format>`: Output format (`table`, `json`, `markdown`)
- Default: `table`

**Example Output** (table format):
```
Traceability Matrix

Requirement     Design          Task            Code                Test
──────────────────────────────────────────────────────────────────────────
REQ-AUTH-001    DSN-AUTH-001    TASK-AUTH-001   src/auth/login.js   tests/auth/login.test.js
REQ-AUTH-002    DSN-AUTH-001    TASK-AUTH-002   src/auth/jwt.js     tests/auth/jwt.test.js
REQ-AUTH-003    DSN-AUTH-002    TASK-AUTH-003   src/auth/password.js tests/auth/password.test.js
REQ-API-001     DSN-API-001     TASK-API-001    src/api/routes.js   tests/api/routes.test.js
REQ-API-002     DSN-API-001     ─               ─                   ─
```

**Example Output** (markdown format):
```markdown
# Traceability Matrix

| Requirement | Design | Task | Code | Test |
|-------------|--------|------|------|------|
| REQ-AUTH-001 | DSN-AUTH-001 | TASK-AUTH-001 | src/auth/login.js | tests/auth/login.test.js |
| REQ-AUTH-002 | DSN-AUTH-001 | TASK-AUTH-002 | src/auth/jwt.js | tests/auth/jwt.test.js |
| REQ-API-002 | DSN-API-001 | - | - | - |
```

### musubi-trace coverage

Calculate traceability coverage percentage.

```bash
musubi-trace coverage [--min-coverage <percentage>]
```

**Options**:
- `--min-coverage <percentage>`: Minimum required coverage (0-100)
- Exit code 0 if coverage meets threshold, 1 otherwise

**Example Output**:
```
Traceability Coverage Report

Requirements Coverage:
  Total Requirements: 25
  With Design: 23 (92%)
  With Tasks: 20 (80%)
  With Code: 18 (72%)
  With Tests: 18 (72%)

Overall Coverage: 72%

Status: ✓ Coverage meets minimum threshold (70%)
```

**CI/CD Integration**:
```bash
# Enforce 80% coverage in CI/CD
musubi-trace coverage --min-coverage 80
# Exit code 1 if below 80%
```

### musubi-trace gaps

Detect traceability gaps.

```bash
musubi-trace gaps [--verbose]
```

**Options**:
- `--verbose`: Show detailed gap information

**Example Output**:
```
Traceability Gaps

Orphaned Requirements (no design):
- REQ-AUTH-004: Password reset
- REQ-API-005: Rate limiting

Unimplemented Requirements (no code):
- REQ-AUTH-003: Password complexity
- REQ-API-002: API versioning

Untested Code (no tests):
- src/auth/reset-password.js
- src/api/middleware/rate-limit.js

Total Gaps: 6
```

### musubi-trace requirement

Trace a specific requirement through the system.

```bash
musubi-trace requirement <REQ-ID>
```

**Arguments**:
- `<REQ-ID>`: Requirement identifier (e.g., `REQ-AUTH-001`)

**Example Output**:
```
Traceability for REQ-AUTH-001

Requirement: REQ-AUTH-001 - User Authentication
  ↓
Design: DSN-AUTH-001 - Authentication System
  ↓
Task: TASK-AUTH-001 - Implement login endpoint
  ↓
Code: src/auth/login.js
  ↓
Test: tests/auth/login.test.js

Status: ✓ Fully traced
```

### musubi-trace validate

Validate traceability with enforcement.

```bash
musubi-trace validate [--min-coverage <percentage>]
```

**Options**:
- `--min-coverage <percentage>`: Required minimum coverage (default: 100)

**Example Output**:
```
Traceability Validation

Overall Coverage: 85%
Minimum Required: 100%

Status: ✗ Validation failed

Missing Traceability:
- REQ-AUTH-004 → No design document
- REQ-API-002 → No code implementation
- src/utils/helper.js → No tests

Action Required: Close traceability gaps to meet 100% coverage
```

**Exit Codes**:
- `0`: Validation passed (coverage ≥ threshold)
- `1`: Validation failed (coverage < threshold)

## Integration with Gap Detection

MUSUBI provides two complementary tools:

### musubi-trace (Traceability Focus)

Focus: **Verify requirements are traced**

```bash
# Generate traceability matrix
musubi-trace matrix

# Calculate coverage
musubi-trace coverage

# Detect gaps in traceability
musubi-trace gaps
```

### musubi-gaps (Completeness Focus)

Focus: **Detect missing work**

```bash
# Detect all gaps
musubi-gaps detect

# Detect orphaned requirements
musubi-gaps requirements

# Detect untested code
musubi-gaps code

# Calculate coverage
musubi-gaps coverage --min-coverage 80
```

### Using Together

**Recommended Workflow**:

```bash
# 1. Check traceability matrix
musubi-trace matrix --format markdown > trace-report.md

# 2. Detect gaps in both systems
musubi-trace gaps
musubi-gaps detect

# 3. Calculate coverage
musubi-trace coverage
musubi-gaps coverage --min-coverage 80

# 4. Validate enforcement
musubi-trace validate --min-coverage 100
```

## Example Traceability Matrix

### Complete Example

**Project**: E-commerce API

**Requirements** (`docs/requirements/functional/`):
- REQ-AUTH-001: User authentication
- REQ-AUTH-002: JWT token management
- REQ-CART-001: Add items to cart
- REQ-CART-002: Remove items from cart
- REQ-PAY-001: Process payment

**Design Documents** (`docs/design/`):
- DSN-AUTH-001: Authentication system (implements REQ-AUTH-001, REQ-AUTH-002)
- DSN-CART-001: Shopping cart (implements REQ-CART-001, REQ-CART-002)
- DSN-PAY-001: Payment processing (implements REQ-PAY-001)

**Tasks** (`docs/tasks/`):
- TASK-AUTH-001: Login endpoint (implements DSN-AUTH-001)
- TASK-AUTH-002: JWT middleware (implements DSN-AUTH-001)
- TASK-CART-001: Cart API (implements DSN-CART-001)
- TASK-PAY-001: Payment gateway (implements DSN-PAY-001)

**Code** (`src/`):
- src/auth/login.js (implements TASK-AUTH-001, satisfies REQ-AUTH-001)
- src/auth/jwt.js (implements TASK-AUTH-002, satisfies REQ-AUTH-002)
- src/cart/api.js (implements TASK-CART-001, satisfies REQ-CART-001, REQ-CART-002)
- src/payment/gateway.js (implements TASK-PAY-001, satisfies REQ-PAY-001)

**Tests** (`tests/`):
- tests/auth/login.test.js (tests src/auth/login.js, verifies REQ-AUTH-001)
- tests/auth/jwt.test.js (tests src/auth/jwt.js, verifies REQ-AUTH-002)
- tests/cart/api.test.js (tests src/cart/api.js, verifies REQ-CART-001, REQ-CART-002)
- tests/payment/gateway.test.js (tests src/payment/gateway.js, verifies REQ-PAY-001)

**Traceability Matrix**:

| Requirement | Design | Task | Code | Test |
|-------------|--------|------|------|------|
| REQ-AUTH-001 | DSN-AUTH-001 | TASK-AUTH-001 | src/auth/login.js | tests/auth/login.test.js |
| REQ-AUTH-002 | DSN-AUTH-001 | TASK-AUTH-002 | src/auth/jwt.js | tests/auth/jwt.test.js |
| REQ-CART-001 | DSN-CART-001 | TASK-CART-001 | src/cart/api.js | tests/cart/api.test.js |
| REQ-CART-002 | DSN-CART-001 | TASK-CART-001 | src/cart/api.js | tests/cart/api.test.js |
| REQ-PAY-001 | DSN-PAY-001 | TASK-PAY-001 | src/payment/gateway.js | tests/payment/gateway.test.js |

**Coverage**: 100% (all requirements fully traced)

## Best Practices

### 1. Maintain 100% Traceability

**Target**: Every requirement traced from design to tests

```bash
# Enforce in CI/CD
musubi-trace validate --min-coverage 100
```

### 2. Regular Validation

**Daily/Weekly**:
```bash
# Generate matrix
musubi-trace matrix --format markdown > docs/trace-$(date +%Y%m%d).md

# Check coverage
musubi-trace coverage
```

### 3. Use REQ References in Code

**Good Practice**:
```javascript
/**
 * Login endpoint
 * @implements TASK-AUTH-001
 * @satisfies REQ-AUTH-001
 */
export async function login(email, password) {
  // Implementation
}
```

**Bad Practice**:
```javascript
// No traceability comments
export async function login(email, password) {
  // Implementation
}
```

### 4. Link Tests to Requirements

**Good Practice**:
```javascript
/**
 * Tests for login functionality
 * @tests src/auth/login.js
 * @verifies REQ-AUTH-001
 */
describe('login', () => {
  it('should authenticate valid user (REQ-AUTH-001)', async () => {
    // Test implementation
  });
});
```

### 5. Review Gaps After Changes

After applying changes:

```bash
# 1. Apply change
musubi-change apply changes/CHG-001-auth.md

# 2. Detect gaps
musubi-trace gaps
musubi-gaps detect

# 3. Create missing items
musubi-design  # Create design docs
musubi-tasks   # Create tasks

# 4. Verify traceability restored
musubi-trace validate --min-coverage 100
```

## Coverage Reporting

### Generate Reports

**Markdown Report**:
```bash
musubi-trace matrix --format markdown > trace-report.md
```

**JSON Report**:
```bash
musubi-trace matrix --format json > trace-report.json
```

**CI/CD Integration**:
```bash
# Generate coverage badge
COVERAGE=$(musubi-trace coverage | grep -oP '\d+%' | head -1)
echo "Coverage: $COVERAGE"
```

### Example Coverage Report

```markdown
# Traceability Coverage Report
Generated: 2025-11-23

## Summary
- Total Requirements: 50
- With Design: 48 (96%)
- With Tasks: 45 (90%)
- With Code: 42 (84%)
- With Tests: 42 (84%)
- Overall Coverage: 84%

## Gaps
### Orphaned Requirements (2)
- REQ-NOTIF-001: Email notifications
- REQ-NOTIF-002: SMS notifications

### Unimplemented Requirements (3)
- REQ-AUTH-004: Password reset
- REQ-NOTIF-001: Email notifications
- REQ-NOTIF-002: SMS notifications

### Untested Code (0)
All implemented code has tests ✓

## Action Items
1. Create design document for notification system (REQ-NOTIF-001, REQ-NOTIF-002)
2. Implement password reset feature (REQ-AUTH-004)
```

## Troubleshooting

### Missing References

**Problem**: Requirement not found in traceability matrix

```
REQ-AUTH-005 → Not found in any design document
```

**Solution**: Add design document reference

```bash
# 1. Create or update design document
# Add: "This design implements REQ-AUTH-005"

# 2. Verify
musubi-trace requirement REQ-AUTH-005
```

### Broken Traceability Chain

**Problem**: Requirement has design but no code

```
REQ-AUTH-001 → DSN-AUTH-001 → (missing task)
```

**Solution**: Create tasks

```bash
# 1. Create tasks
musubi-tasks

# 2. Verify chain restored
musubi-trace requirement REQ-AUTH-001
```

### Low Coverage

**Problem**: Coverage below threshold

```
Coverage: 65%
Minimum Required: 80%
✗ Validation failed
```

**Solution**: Close gaps systematically

```bash
# 1. Identify gaps
musubi-trace gaps --verbose

# 2. Create missing design docs
musubi-design

# 3. Create missing tasks
musubi-tasks

# 4. Implement code

# 5. Write tests

# 6. Verify coverage
musubi-trace coverage
```

## CI/CD Integration

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
musubi-trace coverage --min-coverage 80 || {
  echo "Error: Traceability coverage below 80%"
  echo "Run 'musubi-trace gaps' to identify issues"
  exit 1
}
```

### GitHub Actions

```yaml
# .github/workflows/traceability.yml
name: Traceability Check
on: [push, pull_request]
jobs:
  traceability:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g musubi-sdd
      - name: Generate traceability matrix
        run: musubi-trace matrix --format markdown > trace-report.md
      - name: Validate coverage
        run: musubi-trace validate --min-coverage 100
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: traceability-report
          path: trace-report.md
```

### GitLab CI

```yaml
# .gitlab-ci.yml
traceability:
  stage: test
  script:
    - npm install -g musubi-sdd
    - musubi-trace matrix --format json > trace-report.json
    - musubi-trace coverage --min-coverage 80
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: trace-report.json
```

## Summary

MUSUBI's traceability system provides:
- **End-to-end tracking**: Requirements → Design → Tasks → Code → Tests
- **Coverage metrics**: Percentage-based reporting
- **Gap detection**: Identify missing traceability links
- **Validation gates**: Enforce coverage thresholds in CI/CD
- **Integration**: Works with gap detection system

**Key Commands**:
- `musubi-trace matrix` → Generate traceability matrix
- `musubi-trace coverage` → Calculate coverage percentage
- `musubi-trace gaps` → Detect traceability gaps
- `musubi-trace requirement` → Trace specific requirement
- `musubi-trace validate` → Enforce coverage thresholds

**Best Practices**:
- Maintain 100% traceability coverage
- Use REQ references in code comments
- Link tests to requirements
- Review gaps after every change
- Generate coverage reports regularly
- Enforce coverage in CI/CD

For change management workflow, see [Change Management Workflow Guide](change-management-workflow.md).

For brownfield project tutorial, see [Brownfield Tutorial](brownfield-tutorial.md).
