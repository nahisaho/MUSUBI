# Coverage Matrix Template

This matrix tracks traceability between Requirements ↔ Design ↔ Code ↔ Tests.

---

## Feature: [Feature Name]

**Version**: [Version]
**Last Updated**: [YYYY-MM-DD]
**Coverage**: [XX%]

---

## Requirements Coverage

| Req ID | Description | Design | Code | Unit Test | Integration | E2E | Status |
|--------|-------------|--------|------|-----------|-------------|-----|--------|
| REQ-XXX-001 | [Brief description] | ☐ | ☐ | ☐ | ☐ | ☐ | Draft |
| REQ-XXX-002 | [Brief description] | ☐ | ☐ | ☐ | ☐ | ☐ | Draft |
| REQ-XXX-003 | [Brief description] | ☐ | ☐ | ☐ | ☐ | ☐ | Draft |
| REQ-XXX-004 | [Brief description] | ☐ | ☐ | ☐ | ☐ | ☐ | Draft |
| REQ-XXX-005 | [Brief description] | ☐ | ☐ | ☐ | ☐ | ☐ | Draft |

### Legend

- ☐ Not covered
- ☑ Covered
- ⚠ Partial coverage
- N/A Not applicable

### Status Values

- **Draft**: Requirement defined, no implementation
- **In Progress**: Implementation started
- **Implemented**: Code complete, tests pending
- **Tested**: Tests complete
- **Verified**: QA verified
- **Released**: In production

---

## Design Traceability

| Design Component | Requirements Covered | Source File(s) | Tests |
|-----------------|---------------------|----------------|-------|
| [Component A] | REQ-XXX-001, REQ-XXX-002 | `src/componentA.ts` | `tests/componentA.test.ts` |
| [Component B] | REQ-XXX-003 | `src/componentB.ts` | `tests/componentB.test.ts` |
| [API Endpoint 1] | REQ-XXX-004 | `src/api/endpoint1.ts` | `tests/api/endpoint1.test.ts` |
| [Data Model X] | REQ-XXX-005 | `src/models/x.ts` | `tests/models/x.test.ts` |

---

## Test Coverage Details

### Unit Tests

| Test File | Requirements | Assertions | Pass/Fail |
|-----------|--------------|------------|-----------|
| `componentA.test.ts` | REQ-XXX-001 | 5 | ☐ |
| `componentB.test.ts` | REQ-XXX-003 | 3 | ☐ |

### Integration Tests

| Test File | Requirements | Services Tested | Pass/Fail |
|-----------|--------------|-----------------|-----------|
| `integration/flow.test.ts` | REQ-XXX-002, REQ-XXX-004 | DB, API | ☐ |

### E2E Tests

| Test File | User Story | Scenarios | Pass/Fail |
|-----------|------------|-----------|-----------|
| `e2e/userFlow.spec.ts` | Complete user journey | 3 | ☐ |

---

## Gap Analysis

### Uncovered Requirements

| Req ID | Description | Reason | Remediation |
|--------|-------------|--------|-------------|
| REQ-XXX-006 | [desc] | [why not covered] | [plan to cover] |

### Partial Coverage

| Req ID | Missing | Priority | Owner |
|--------|---------|----------|-------|
| REQ-XXX-002 | E2E test | High | [name] |

---

## Coverage Metrics

### Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Requirements with Design | X/Y | 100% | ☐ |
| Requirements with Code | X/Y | 100% | ☐ |
| Requirements with Tests | X/Y | 100% | ☐ |
| Code Coverage | XX% | 80% | ☐ |
| Overall Traceability | XX% | 100% | ☐ |

### Trend

| Date | Req→Design | Req→Code | Req→Test | Overall |
|------|------------|----------|----------|---------|
| YYYY-MM-DD | 50% | 30% | 20% | 33% |
| YYYY-MM-DD | 80% | 60% | 50% | 63% |
| YYYY-MM-DD | 100% | 90% | 80% | 90% |

---

## Validation

### Constitutional Compliance (Article V)

```bash
# Run traceability audit
musubi-trace --feature [feature-name] --verbose

# Expected output:
# Coverage: 100%
# All requirements traced
```

### Audit Trail

| Date | Auditor | Finding | Action |
|------|---------|---------|--------|
| YYYY-MM-DD | [name] | [finding] | [action] |

---

## Sign-off

| Role | Name | Date | Verified |
|------|------|------|----------|
| Developer | | | ☐ |
| QA | | | ☐ |
| Tech Lead | | | ☐ |

**Next Audit**: [YYYY-MM-DD]
