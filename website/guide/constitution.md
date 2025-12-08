# Constitutional Governance

The 9 immutable articles that govern all MUSUBI projects.

## Overview

Constitutional Governance ensures consistent quality across all AI-assisted development by enforcing non-negotiable rules at every stage of the workflow.

**Enforcement**: The `constitution-enforcer` skill validates compliance before implementation.

## The 9 Articles

### Article I: Library-First Principle

> All new features SHALL begin as independent libraries before integration into applications.

**Requirements**:
- Features start as standalone libraries
- Libraries have their own test suites
- Libraries are independently deployable
- Libraries don't depend on application code

**Validation**:
```bash
musubi-validate article 1
```

---

### Article II: CLI Interface Mandate

> All libraries SHALL expose functionality through CLI interfaces.

**Requirements**:
- Every library provides a CLI entry point
- CLI exposes all primary functionality
- CLI includes help text and examples
- CLI follows consistent argument conventions

**Validation**:
```bash
musubi-validate article 2
```

---

### Article III: Test-First Imperative

> Tests SHALL be written before implementation (Red-Green-Blue cycle).

**Requirements**:
- Tests written before production code
- Red-Green-Blue cycle followed
- All EARS requirements covered by tests
- Test coverage exceeds 80%

**Process**:
1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Blue**: Refactor with confidence

**Validation**:
```bash
musubi-validate article 3
```

---

### Article IV: EARS Requirements Format

> All requirements SHALL use EARS (Easy Approach to Requirements Syntax) format.

**5 Patterns**:

| Pattern | Syntax | Example |
|---------|--------|---------|
| Event-driven | WHEN...SHALL | WHEN user clicks login, System SHALL validate |
| State-driven | WHILE...SHALL | WHILE loading, System SHALL show spinner |
| Unwanted | IF...THEN...SHALL | IF error, THEN System SHALL display message |
| Optional | WHERE...SHALL | WHERE MFA enabled, System SHALL require 2FA |
| Ubiquitous | SHALL | System SHALL encrypt all data |

**Validation**:
```bash
musubi-validate article 4
musubi-requirements validate
```

---

### Article V: Traceability Mandate

> 100% traceability SHALL be maintained between Requirements ↔ Design ↔ Code ↔ Tests.

**Requirements**:
- Every requirement has unique ID (REQ-XXX-NNN)
- Requirements map to design components
- Code references requirement IDs
- Tests reference requirement IDs

**Validation**:
```bash
musubi-validate article 5
musubi-trace --verbose
```

---

### Article VI: Project Memory (Steering System)

> All skills SHALL consult project memory (steering files) before making decisions.

**Required Files**:
- `steering/structure.md` - Architecture patterns
- `steering/tech.md` - Technology stack
- `steering/product.md` - Business context

**Validation**:
```bash
musubi-validate article 6
musubi status
```

---

### Article VII: Simplicity Gate (Phase -1)

> Projects SHALL start with maximum 3 sub-projects initially.

**Requirements**:
- Initial architecture ≤ 3 projects
- Additional projects require Phase -1 Gate approval
- Complexity must be justified

**Validation**:
```bash
musubi-validate article 7
musubi-validate gates
```

---

### Article VIII: Anti-Abstraction Gate (Phase -1)

> Framework features SHALL be used directly without custom abstraction layers.

**Requirements**:
- Use framework APIs directly
- No custom wrappers around frameworks
- Abstractions require Phase -1 Gate approval

**Valid Exceptions**:
- Multi-framework support (e.g., Prisma AND TypeORM)
- Domain abstractions (e.g., PaymentGateway interface)

**Validation**:
```bash
musubi-validate article 8
musubi-validate gates
```

---

### Article IX: Integration-First Testing

> Integration tests SHALL use real services; mocks are discouraged.

**Requirements**:
- Integration tests use real databases/APIs
- Test databases are isolated (containers)
- External APIs use sandbox environments
- Mocks only when unavoidable (documented)

**Validation**:
```bash
musubi-validate article 9
```

## Full Validation

```bash
# Validate all 9 articles
musubi-validate constitution

# Validate with score
musubi-validate score

# Verbose output
musubi-validate all --verbose
```

## Phase -1 Gates

Before exceeding article limits, submit a gate request:

```markdown
# See: steering/templates/phase-minus-one-gate-request.md
```

**Approvers**:
- Article VII: System Architect + Project Manager
- Article VIII: System Architect + Dev Lead

## Compliance Report

```bash
musubi-validate score
```

Output:
```
Constitutional Compliance Score

█████████░ 90%

Breakdown:
  Constitution (50%): 100%
  Gates (30%):        80%
  Complexity (20%):   85%

✓ PASSED (threshold: 70%)
```
