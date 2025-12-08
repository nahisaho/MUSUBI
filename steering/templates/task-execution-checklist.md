# Task Execution Checklist

Use this checklist during implementation to ensure quality and compliance.

---

## Pre-Implementation (Per Task)

### Context Check

- [ ] Read related steering files
- [ ] Review requirements for this task
- [ ] Review design for this task
- [ ] Understand dependencies
- [ ] Check for blocking tasks

### Test-First Setup (Article III)

- [ ] Write failing test FIRST (Red)
- [ ] Test covers requirement
- [ ] Test file committed before code
- [ ] Test description includes REQ-ID

---

## Implementation

### Code Quality

- [ ] Follows project coding standards
- [ ] Meaningful variable/function names
- [ ] Appropriate comments (why, not what)
- [ ] No hardcoded values (use config)
- [ ] Error handling implemented
- [ ] Logging added

### Constitutional Compliance

| Article | Check | Status |
|---------|-------|--------|
| I: Library-First | Code in lib/ if reusable | ☐ |
| II: CLI Interface | CLI added for functionality | ☐ |
| III: Test-First | Tests written before code | ☐ |
| VIII: Anti-Abstraction | Framework used directly | ☐ |
| IX: Integration-First | Real services in tests | ☐ |

---

## Testing

### Test Verification

- [ ] Unit tests pass
- [ ] Test makes requirement verifiable
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Code passes (Green)
- [ ] Refactor completed (Blue)

### Coverage

```bash
# Check coverage
npm test -- --coverage

# Expected: ≥80%
```

---

## Traceability Update

### Update Coverage Matrix

| Item | Before | After |
|------|--------|-------|
| REQ → Code | ☐ | ☑ |
| REQ → Test | ☐ | ☑ |
| Design → Code | ☐ | ☑ |

### Documentation Updates

- [ ] Code comments include REQ-IDs
- [ ] API documentation updated
- [ ] README updated (if needed)
- [ ] Changelog entry added

---

## Code Review Preparation

### Self-Review

- [ ] Code diff reviewed
- [ ] No debug code remaining
- [ ] No commented-out code
- [ ] No TODO without issue link
- [ ] Tests all pass locally

### PR Description

```markdown
## Summary
[What does this PR do?]

## Requirements Addressed
- REQ-XXX-001: [description]
- REQ-XXX-002: [description]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests written before implementation
- [ ] Constitutional compliance verified
- [ ] Documentation updated
```

---

## Post-Implementation

### Task Completion

- [ ] All acceptance criteria met
- [ ] All subtasks completed
- [ ] Code merged to main branch
- [ ] Task status updated to ✓

### Progress Update

```markdown
# In tasks.md
### X.X (P) [Task Title]
...
**Status**: [✓] Completed
**Completed**: YYYY-MM-DD
**Notes**: [Any implementation notes]
```

---

## Retrospective Notes

### What Went Well

- [Note 1]

### What Could Improve

- [Note 1]

### Lessons Learned

- [Lesson 1]

---

## Quick Reference Commands

```bash
# Run constitutional validation
musubi-validate constitution

# Run specific article validation
musubi-validate article 3  # Test-First

# Run tests with coverage
npm test -- --coverage

# Trace requirements
musubi-trace --feature [feature-name]

# Check for gaps
musubi-gaps --verbose
```
