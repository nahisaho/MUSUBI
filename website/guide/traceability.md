# Traceability

100% traceability between Requirements ↔ Design ↔ Code ↔ Tests.

## What is Traceability?

Traceability ensures every requirement is:
- Designed into the architecture
- Implemented in code
- Verified by tests

```
REQ-AUTH-001 ──▶ Component: AuthService ──▶ src/auth.ts ──▶ auth.test.ts
REQ-AUTH-002 ──▶ Component: TokenManager ──▶ src/token.ts ──▶ token.test.ts
```

## Why Traceability Matters

| Benefit | Description |
|---------|-------------|
| **Completeness** | Ensures no requirements are missed |
| **Impact Analysis** | Know what's affected by changes |
| **Audit Compliance** | Evidence for regulatory requirements |
| **Test Coverage** | Verify all requirements are tested |
| **Gap Detection** | Find missing implementations |

## Requirement IDs

Use consistent ID format:

```
REQ-[FEATURE]-[NUMBER]

Examples:
REQ-AUTH-001    # Authentication requirement 1
REQ-PAY-003     # Payment requirement 3
REQ-UI-015      # UI requirement 15
```

## Coverage Matrix

Track traceability in a coverage matrix:

| Req ID | Description | Design | Code | Test | Status |
|--------|-------------|--------|------|------|--------|
| REQ-AUTH-001 | Login validation | ☑ | ☑ | ☑ | Complete |
| REQ-AUTH-002 | Session timeout | ☑ | ☑ | ☐ | In Progress |
| REQ-AUTH-003 | MFA support | ☑ | ☐ | ☐ | Designed |

## Adding Traceability

### In Requirements

```markdown
### REQ-AUTH-001: Login Validation

WHEN user submits credentials, the Auth Service SHALL validate username and password

**Acceptance Criteria**:
- Valid credentials → access granted
- Invalid credentials → error message displayed
```

### In Design

```markdown
## Component: AuthService

**Requirements Mapped**: REQ-AUTH-001, REQ-AUTH-002

**Responsibilities**:
- Validate user credentials
- Manage session state
```

### In Code

```typescript
/**
 * Validates user credentials
 * @requirement REQ-AUTH-001
 */
async function validateCredentials(username: string, password: string): Promise<boolean> {
  // Implementation
}
```

### In Tests

```typescript
describe('AuthService', () => {
  /**
   * @requirement REQ-AUTH-001
   */
  it('should validate correct credentials', async () => {
    // Test implementation
  });

  /**
   * @requirement REQ-AUTH-001
   */
  it('should reject invalid credentials', async () => {
    // Test implementation
  });
});
```

## Traceability Commands

```bash
# Show traceability matrix
musubi-trace matrix

# Find gaps in coverage
musubi-trace gaps

# Filter by feature
musubi-trace --feature "Authentication"

# Verify complete traceability
musubi-trace verify

# Show detailed report
musubi-trace --verbose
```

## Gap Detection

```bash
musubi-gaps

# Output:
# ❌ REQ-AUTH-003: No implementation found
# ⚠️ REQ-AUTH-002: No test found
# ✅ REQ-AUTH-001: Complete traceability
```

## Constitutional Compliance

Traceability is mandated by **Article V**:

> 100% traceability SHALL be maintained between Requirements ↔ Design ↔ Code ↔ Tests.

Validate with:

```bash
musubi-validate article 5
```

## Templates

See [Coverage Matrix Template](/reference/templates/coverage-matrix) for tracking format.

## Best Practices

1. **Assign IDs early** - Give requirements IDs when first written
2. **Update continuously** - Keep matrix current as work progresses
3. **Automate checks** - Run traceability validation in CI
4. **Review gaps** - Address gaps before marking features complete
5. **Use consistent format** - Same ID format across all documents
