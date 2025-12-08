# Requirements Validation Checklist

Use this checklist to validate requirements before proceeding to design.

---

## EARS Format Compliance

### Pattern Usage

- [ ] Each requirement uses ONE EARS pattern correctly
- [ ] Event-driven: `WHEN [event], the [System] SHALL [response]`
- [ ] State-driven: `WHILE [state], the [System] SHALL [behavior]`
- [ ] Unwanted: `IF [error], THEN the [System] SHALL [handling]`
- [ ] Optional: `WHERE [feature enabled], the [System] SHALL [capability]`
- [ ] Ubiquitous: `The [System] SHALL [always behavior]`

### Language Quality

- [ ] Uses **SHALL** (not should, may, might, could)
- [ ] Uses **active voice** (System does X, not X is done)
- [ ] One requirement per statement (no compound requirements)
- [ ] No ambiguous terms (few, many, some, quickly, easily)
- [ ] Measurable where possible (specific numbers, times, sizes)

---

## Requirement Quality

### Clarity

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Single interpretation possible | | |
| Technical terms defined | | |
| Acronyms expanded first use | | |
| No assumed knowledge | | |

### Completeness

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| All user actions covered | | |
| All system responses defined | | |
| Error scenarios included | | |
| Edge cases addressed | | |
| Performance criteria stated | | |

### Testability

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Each requirement is testable | | |
| Test verification defined | | |
| Success/failure measurable | | |
| Test data requirements clear | | |

### Consistency

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No contradicting requirements | | |
| Terminology consistent | | |
| Aligned with steering files | | |
| Compatible with existing system | | |

---

## Traceability Setup

### Requirement IDs

- [ ] All requirements have unique IDs (REQ-[FEATURE]-NNN)
- [ ] ID format documented
- [ ] ID registry maintained

### Coverage Matrix Started

| Requirement ID | Has Design Ref | Has Test Ref | Status |
|----------------|----------------|--------------|--------|
| REQ-XXX-001 | ☐ | ☐ | Draft |
| REQ-XXX-002 | ☐ | ☐ | Draft |
| REQ-XXX-003 | ☐ | ☐ | Draft |

---

## Stakeholder Review

### Review Participants

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | | | ☐ |
| Technical Lead | | | ☐ |
| QA Lead | | | ☐ |

### Feedback Incorporated

- [ ] All review comments addressed
- [ ] Changes documented in revision history
- [ ] Re-review completed if major changes

---

## Constitutional Compliance (Article IV)

### Validation Results

```bash
# Run validator
musubi-validate article 4

# Expected output
Article IV: EARS Format - PASSED/FAILED
```

### Remediation (if failed)

| Violation | Requirement | Fix Applied |
|-----------|-------------|-------------|
| [issue] | [REQ-ID] | [fix] |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Author | | | |
| Reviewer | | | |
| Approver | | | |

**Status**: [ ] Draft → [ ] Review → [ ] Approved

**Next Step**: Proceed to Design Document (`design.md`)
