# Delta Specification Template

Use this template for brownfield project change tracking.

## Format

```
[DELTA_TYPE] DELTA-ID: Brief description
```

### Delta Types

| Type | Usage | Example |
|------|-------|---------|
| `ADDED` | New requirement/component | `[ADDED] REQ-AUTH-005: OAuth2 support` |
| `MODIFIED` | Changed requirement/component | `[MODIFIED] REQ-AUTH-001: Updated password policy` |
| `REMOVED` | Deleted requirement/component | `[REMOVED] REQ-LEGACY-001: Deprecated feature` |
| `RENAMED` | Renamed identifier | `[RENAMED] UserService → AuthenticationService` |

---

## Template

```markdown
# Delta Specification: DELTA-{FEATURE}-{NNN}

**Type**: {ADDED | MODIFIED | REMOVED | RENAMED}
**Target**: {REQ-XXX-NNN | Component/File path}
**Status**: proposed
**Created**: {YYYY-MM-DD}
**Updated**: {YYYY-MM-DD}

## Description

{Clear, concise description of the change. Use definitive language (SHALL, MUST).}

## Rationale

{Why is this change necessary? Reference business requirements, technical debt, etc.}

## Impacted Areas

- {api | database | ui | backend | frontend | security | performance | testing | documentation | infrastructure | configuration}

## Before State (for MODIFIED/RENAMED/REMOVED)

```
{Previous specification, code, or configuration}
```

## After State (for ADDED/MODIFIED/RENAMED)

```
{New specification, code, or configuration}
```

## Acceptance Criteria

- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

## Traceability

| Item | Reference |
|------|-----------|
| Requirement | REQ-XXX-NNN |
| Design | ADR-NNN |
| Implementation | src/path/file.js |
| Tests | tests/path/file.test.js |

## Review Checklist

- [ ] Description is clear and uses definitive language
- [ ] Rationale explains business/technical justification
- [ ] All impacted areas are identified
- [ ] Before/After states are documented (if applicable)
- [ ] Acceptance criteria are testable
- [ ] Traceability links are complete
```

---

## Examples

### ADDED Example

```markdown
# Delta Specification: DELTA-AUTH-001

**Type**: ADDED
**Target**: REQ-AUTH-005
**Status**: proposed
**Created**: 2025-12-08
**Updated**: 2025-12-08

## Description

WHEN user selects "Login with Google", the Auth Service SHALL authenticate via OAuth2 and create session.

## Rationale

Users requested social login to reduce friction during signup. Analytics show 40% drop-off at registration page.

## Impacted Areas

- api
- backend
- database
- security

## After State

```typescript
interface OAuthConfig {
  provider: 'google' | 'github' | 'microsoft';
  clientId: string;
  redirectUri: string;
}

function authenticateOAuth(config: OAuthConfig): Promise<Session>;
```

## Acceptance Criteria

- [ ] Google OAuth2 flow completes successfully
- [ ] Session created with correct user data
- [ ] Existing email accounts are linked
- [ ] Failed auth shows appropriate error
```

### MODIFIED Example

```markdown
# Delta Specification: DELTA-AUTH-002

**Type**: MODIFIED
**Target**: REQ-AUTH-001
**Status**: approved
**Created**: 2025-12-08
**Updated**: 2025-12-08

## Description

Password policy SHALL require minimum 12 characters (increased from 8).

## Rationale

Security audit (SEC-2025-042) identified weak password policy as high risk.

## Impacted Areas

- backend
- ui
- testing

## Before State

```typescript
const PASSWORD_MIN_LENGTH = 8;
```

## After State

```typescript
const PASSWORD_MIN_LENGTH = 12;
```

## Acceptance Criteria

- [ ] New passwords require 12+ characters
- [ ] Existing passwords remain valid
- [ ] UI displays updated requirements
- [ ] Tests updated for new policy
```

### REMOVED Example

```markdown
# Delta Specification: DELTA-LEGACY-001

**Type**: REMOVED
**Target**: REQ-LEGACY-001
**Status**: proposed
**Created**: 2025-12-08
**Updated**: 2025-12-08

## Description

Remove deprecated XML export feature.

## Rationale

Feature unused (0 invocations in 6 months). Maintenance burden not justified.

## Impacted Areas

- api
- backend
- documentation

## Before State

```typescript
// Deprecated since v2.0.0
function exportToXML(data: Record[]): string;
```

## Acceptance Criteria

- [ ] XML export endpoint returns 410 Gone
- [ ] Code and tests removed
- [ ] Documentation updated
- [ ] Changelog documents breaking change
```

---

## Validation

```bash
# Validate single delta
musubi-change validate DELTA-AUTH-001

# Validate all deltas
musubi-change validate-all

# Show delta details
musubi-change show DELTA-AUTH-001

# Analyze impact
musubi-change impact DELTA-AUTH-001
```

---

## Workflow

```
1. Create   → musubi-change create --id DELTA-AUTH-001 --type ADDED ...
2. Review   → musubi-change show DELTA-AUTH-001
3. Approve  → musubi-change approve DELTA-AUTH-001
4. Implement → (make code changes)
5. Apply    → musubi-change apply DELTA-AUTH-001
6. Archive  → musubi-change archive DELTA-AUTH-001
```
