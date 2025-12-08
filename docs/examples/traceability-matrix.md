# Traceability Matrix Examples

This document provides practical examples of traceability matrices in MUSUBI, demonstrating how to track requirements through design, implementation, and testing.

## Basic Matrix Format

A traceability matrix shows the connections between different artifacts:

| Requirement | Design | Tasks | Code | Tests | Status |
|-------------|--------|-------|------|-------|--------|
| REQ-001 | DES-001 | TASK-001 | auth.js | auth.test.js | ✓ Complete |
| REQ-002 | DES-002 | TASK-002 | user.js | user.test.js | ✓ Complete |
| REQ-003 | DES-003 | - | - | - | ✗ Incomplete |

## Example 1: Authentication System

### Requirements

```markdown
# REQ-AUTH-001: User Login
**EARS**: When a user submits valid credentials, the system shall authenticate 
the user and establish a session.

# REQ-AUTH-002: Password Hashing
**EARS**: The system shall hash all passwords using bcrypt with minimum 12 rounds.

# REQ-AUTH-003: Session Management
**EARS**: The system shall invalidate sessions after 24 hours of inactivity.
```

### Traceability Matrix

```
╔════════════════╦══════════════╦══════════════╦════════════════════╦════════════════════╦════════════╗
║ Requirement    ║ Design       ║ Tasks        ║ Code               ║ Tests              ║ Status     ║
╠════════════════╬══════════════╬══════════════╬════════════════════╬════════════════════╬════════════╣
║ REQ-AUTH-001   ║ DES-AUTH-001 ║ TASK-AUTH-1  ║ auth/login.js      ║ auth/login.test.js ║ ✓ Complete ║
║ User Login     ║ Login Flow   ║ Implement    ║ auth/session.js    ║                    ║            ║
║                ║              ║ login        ║                    ║                    ║            ║
╠════════════════╬══════════════╬══════════════╬════════════════════╬════════════════════╬════════════╣
║ REQ-AUTH-002   ║ DES-AUTH-002 ║ TASK-AUTH-2  ║ auth/password.js   ║ auth/password.     ║ ✓ Complete ║
║ Password Hash  ║ Security     ║ Implement    ║ utils/crypto.js    ║ test.js            ║            ║
║                ║              ║ hashing      ║                    ║                    ║            ║
╠════════════════╬══════════════╬══════════════╬════════════════════╬════════════════════╬════════════╣
║ REQ-AUTH-003   ║ DES-AUTH-001 ║ TASK-AUTH-3  ║ auth/session.js    ║ auth/session.      ║ ✓ Complete ║
║ Session Mgmt   ║ Login Flow   ║ Session      ║ middleware/auth.js ║ test.js            ║            ║
║                ║              ║ cleanup      ║                    ║                    ║            ║
╚════════════════╩══════════════╩══════════════╩════════════════════╩════════════════════╩════════════╝
```

### Visual Chain

```
REQ-AUTH-001: User Login
    │
    ├── Design: DES-AUTH-001 (Login Flow)
    │       └── C4 Component Diagram
    │
    ├── Tasks:
    │       ├── TASK-AUTH-1.1: Create login endpoint
    │       ├── TASK-AUTH-1.2: Implement validation
    │       └── TASK-AUTH-1.3: Add rate limiting
    │
    ├── Code:
    │       ├── src/auth/login.js
    │       ├── src/auth/session.js
    │       └── src/middleware/auth.js
    │
    └── Tests:
            ├── tests/auth/login.test.js
            │       ├── should login with valid credentials
            │       ├── should reject invalid password
            │       └── should handle missing username
            └── tests/e2e/auth.spec.js
```

## Example 2: E-commerce Cart

### Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-CART-001 | Add item to cart | P0 |
| REQ-CART-002 | Remove item from cart | P0 |
| REQ-CART-003 | Update item quantity | P1 |
| REQ-CART-004 | Calculate cart total | P0 |
| REQ-CART-005 | Apply discount code | P2 |

### Full Traceability Matrix

```markdown
## Forward Traceability (Requirements → Tests)

| Requirement | Design Docs | Source Files | Test Files | Coverage |
|-------------|-------------|--------------|------------|----------|
| REQ-CART-001 | DES-CART-001 | cart/add.js, cart/service.js | cart.test.js:15-45 | 100% |
| REQ-CART-002 | DES-CART-001 | cart/remove.js | cart.test.js:47-72 | 100% |
| REQ-CART-003 | DES-CART-001 | cart/update.js | cart.test.js:74-99 | 95% |
| REQ-CART-004 | DES-CART-002 | cart/calculator.js | calculator.test.js | 100% |
| REQ-CART-005 | DES-CART-003 | cart/discount.js | discount.test.js | 80% |

## Backward Traceability (Tests → Requirements)

| Test File | Tests Requirement | Status |
|-----------|-------------------|--------|
| cart.test.js | REQ-CART-001, REQ-CART-002, REQ-CART-003 | ✓ |
| calculator.test.js | REQ-CART-004 | ✓ |
| discount.test.js | REQ-CART-005 | ✓ |
| checkout.test.js | ? (No requirement linked) | ⚠️ |
```

### Gap Analysis

```
╔══════════════════════════════════════════════════════════════╗
║                      GAP ANALYSIS                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║ ✅ COMPLETE CHAINS (4)                                        ║
║    REQ-CART-001 → DES → CODE → TEST                          ║
║    REQ-CART-002 → DES → CODE → TEST                          ║
║    REQ-CART-003 → DES → CODE → TEST                          ║
║    REQ-CART-004 → DES → CODE → TEST                          ║
║                                                               ║
║ ⚠️  INCOMPLETE CHAINS (1)                                     ║
║    REQ-CART-005: Missing integration tests                    ║
║                                                               ║
║ ❌ ORPHANED ITEMS                                              ║
║    checkout.test.js: No linked requirement                    ║
║    src/cart/legacy.js: No linked requirement                  ║
║                                                               ║
║ 📊 COVERAGE SUMMARY                                           ║
║    Requirements with design: 100%                             ║
║    Requirements with code: 100%                               ║
║    Requirements with tests: 100%                              ║
║    Full chain complete: 80%                                   ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

## Example 3: API Endpoints

### Requirement-to-Endpoint Mapping

```yaml
# traceability.yaml
endpoints:
  POST /api/users:
    requirement: REQ-USER-001
    design: DES-API-001
    handler: controllers/UserController.create
    tests:
      - tests/api/users.create.test.js
      - tests/integration/user-creation.test.js

  GET /api/users/:id:
    requirement: REQ-USER-002
    design: DES-API-001
    handler: controllers/UserController.get
    tests:
      - tests/api/users.get.test.js

  PUT /api/users/:id:
    requirement: REQ-USER-003
    design: DES-API-001
    handler: controllers/UserController.update
    tests:
      - tests/api/users.update.test.js

  DELETE /api/users/:id:
    requirement: REQ-USER-004
    design: DES-API-001
    handler: controllers/UserController.delete
    tests:
      - tests/api/users.delete.test.js
```

### API Coverage Matrix

| Endpoint | Method | Requirement | Implemented | Tested | Documented |
|----------|--------|-------------|-------------|--------|------------|
| /api/users | POST | REQ-USER-001 | ✓ | ✓ | ✓ |
| /api/users/:id | GET | REQ-USER-002 | ✓ | ✓ | ✓ |
| /api/users/:id | PUT | REQ-USER-003 | ✓ | ✓ | ✓ |
| /api/users/:id | DELETE | REQ-USER-004 | ✓ | ✓ | ✗ |
| /api/users/export | POST | REQ-USER-005 | ✗ | ✗ | ✗ |

## Example 4: Microservices Traceability

### Service-Level Matrix

```
╔══════════════════════════════════════════════════════════════════════════╗
║                     MICROSERVICES TRACEABILITY                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║ ┌─────────────────────────────────────────────────────────────────────┐ ║
║ │ AUTH SERVICE                                                         │ ║
║ │ Requirements: REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-003              │ ║
║ │ Design: DES-AUTH-001                                                 │ ║
║ │ Repo: github.com/org/auth-service                                    │ ║
║ │ Tests: 45 unit, 12 integration                                       │ ║
║ │ Coverage: 92%                                                        │ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║         │                                                                ║
║         ▼                                                                ║
║ ┌─────────────────────────────────────────────────────────────────────┐ ║
║ │ USER SERVICE                                                         │ ║
║ │ Requirements: REQ-USER-001 to REQ-USER-010                          │ ║
║ │ Design: DES-USER-001, DES-USER-002                                  │ ║
║ │ Repo: github.com/org/user-service                                    │ ║
║ │ Tests: 78 unit, 24 integration                                       │ ║
║ │ Coverage: 88%                                                        │ ║
║ │ Depends on: AUTH SERVICE                                             │ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║         │                                                                ║
║         ▼                                                                ║
║ ┌─────────────────────────────────────────────────────────────────────┐ ║
║ │ ORDER SERVICE                                                        │ ║
║ │ Requirements: REQ-ORD-001 to REQ-ORD-015                            │ ║
║ │ Design: DES-ORD-001                                                  │ ║
║ │ Repo: github.com/org/order-service                                   │ ║
║ │ Tests: 92 unit, 30 integration                                       │ ║
║ │ Coverage: 85%                                                        │ ║
║ │ Depends on: AUTH SERVICE, USER SERVICE                               │ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## Example 5: HTML Report

Generate an interactive HTML report:

```bash
musubi-trace html-report -o traceability-matrix.html
```

The HTML report includes:

### Overview Dashboard
- Overall coverage percentage
- Forward/backward traceability scores
- Orphaned item count
- Recent changes

### Interactive Matrix
- Filterable by status
- Searchable by requirement ID
- Expandable details
- Click to navigate to source

### Gaps Section
- Orphaned requirements
- Orphaned code
- Missing tests
- Incomplete chains

## Generating Reports

### Command Line

```bash
# Text format (terminal)
musubi-trace matrix --format table

# Markdown format
musubi-trace matrix --format markdown -o matrix.md

# JSON format (for CI/tools)
musubi-trace matrix --format json -o matrix.json

# HTML format (interactive)
musubi-trace html-report -o matrix.html --theme dark
```

### CI Integration

```yaml
- name: Generate Traceability Matrix
  run: |
    musubi-trace html-report -o reports/traceability.html
    musubi-trace matrix --format json -o reports/matrix.json
    
- name: Upload Matrix
  uses: actions/upload-artifact@v4
  with:
    name: traceability-matrix
    path: reports/
```

## Best Practices

### 1. Keep Requirements Atomic

```markdown
❌ Bad: REQ-001: The system shall handle user management
✅ Good: REQ-001: The system shall create new users
         REQ-002: The system shall update user profiles
         REQ-003: The system shall deactivate users
```

### 2. Use Consistent Naming

```
Requirements: REQ-<MODULE>-<NUMBER>
Design:       DES-<MODULE>-<NUMBER>
Tasks:        TASK-<MODULE>-<NUMBER>

Example:
REQ-AUTH-001 → DES-AUTH-001 → TASK-AUTH-001
```

### 3. Link at Multiple Levels

```javascript
/**
 * User authentication module
 * 
 * @requirement REQ-AUTH-001 User Login
 * @requirement REQ-AUTH-002 Password Hashing
 * @design DES-AUTH-001 Authentication Flow
 */
class AuthService {
  /**
   * Validates user credentials
   * @requirement REQ-AUTH-001.1 Credential Validation
   */
  async validate(credentials) {
    // Implementation
  }
}
```

### 4. Regular Audits

Schedule regular traceability audits:

```bash
# Weekly check
musubi-trace ci-check --strictness standard

# Monthly comprehensive audit
musubi-trace strict-validate --fail-on-warning
musubi-trace report --format markdown -o audit-$(date +%Y%m).md
```

## Next Steps

- [Delta Specs Guide](../guides/delta-specs.md) - Managing changes
- [Brownfield Tutorial](../guides/brownfield.md) - Converting existing projects
- [Change Management](../guides/change-management.md) - Workflow details

---

*Part of MUSUBI - Ultimate Specification Driven Development*
