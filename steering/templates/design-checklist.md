# Design Review Checklist

Use this checklist to validate design documents before implementation.

---

## Architecture Review

### Pattern Alignment

- [ ] Architecture pattern clearly stated
- [ ] Pattern matches project needs
- [ ] Aligned with `steering/structure.md`
- [ ] Boundaries clearly defined
- [ ] Component responsibilities documented

### Steering Compliance

| Steering File | Reviewed | Aligned | Notes |
|---------------|----------|---------|-------|
| `structure.md` | ☐ | ☐ | |
| `tech.md` | ☐ | ☐ | |
| `product.md` | ☐ | ☐ | |

---

## Constitutional Compliance

### Article VII: Simplicity Gate

- [ ] Project count ≤ 3 (or exception approved)
- [ ] No premature complexity
- [ ] Minimal viable architecture
- [ ] Future-proofing avoided

### Article VIII: Anti-Abstraction Gate

- [ ] Framework APIs used directly
- [ ] No unnecessary wrapper layers
- [ ] Abstractions justified (if any)
- [ ] Single model representation

---

## Technical Review

### Component Design

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Single Responsibility | | |
| Clear interfaces defined | | |
| Dependencies documented | | |
| Error handling specified | | |
| Logging strategy defined | | |

### Data Design

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Data models complete | | |
| Relationships clear | | |
| Migrations planned | | |
| Validation rules defined | | |
| Privacy considerations | | |

### API Design

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Endpoints documented | | |
| Request/Response schemas | | |
| Error responses defined | | |
| Authentication specified | | |
| Rate limits considered | | |

---

## Security Review

### Security Considerations

- [ ] Authentication mechanism specified
- [ ] Authorization model defined
- [ ] Input validation planned
- [ ] Output encoding specified
- [ ] Sensitive data handling
- [ ] Secrets management approach

### Threat Model (if applicable)

| Threat | Mitigation | Owner |
|--------|------------|-------|
| [threat] | [mitigation] | [owner] |

---

## Performance Review

### Performance Considerations

- [ ] Expected load documented
- [ ] Critical paths identified
- [ ] Caching strategy defined
- [ ] Database indexes planned
- [ ] Async operations identified

### Scalability

| Aspect | Current Design | Future Consideration |
|--------|----------------|---------------------|
| Horizontal scaling | | |
| Database scaling | | |
| Cache scaling | | |

---

## Traceability

### Requirements Coverage

| Requirement ID | Component | API | Test | Coverage |
|----------------|-----------|-----|------|----------|
| REQ-XXX-001 | ☐ | ☐ | ☐ | 0% |
| REQ-XXX-002 | ☐ | ☐ | ☐ | 0% |
| REQ-XXX-003 | ☐ | ☐ | ☐ | 0% |

### ADR References

| Decision | ADR ID | Status |
|----------|--------|--------|
| [decision topic] | ADR-NNN | Proposed/Accepted |

---

## Implementation Readiness

### Pre-Implementation Checklist

- [ ] All requirements mapped to design
- [ ] Technology choices finalized
- [ ] Dependencies identified
- [ ] Risks documented
- [ ] Task breakdown possible

### Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| [question] | [owner] | [date] | Pending |

---

## Review Sign-off

### Reviewers

| Role | Name | Date | Decision |
|------|------|------|----------|
| System Architect | | | Approve/Reject |
| Tech Lead | | | Approve/Reject |
| Security | | | Approve/Reject |

### Final Decision

- [ ] **APPROVED** - Ready for implementation
- [ ] **APPROVED WITH CHANGES** - Minor updates needed
- [ ] **REJECTED** - Significant issues to address
- [ ] **DEFERRED** - More information needed

**Status**: [ ] Draft → [ ] Review → [ ] Approved

**Next Step**: Create Task Breakdown (`tasks.md`)
