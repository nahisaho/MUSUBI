# Coverage Matrix Template

## Overview

Template for creating traceability coverage matrices that ensure 100% compliance with Constitutional Article V.

---

## Full Traceability Matrix

```markdown
# Traceability Matrix: [Feature Name]

**Date**: YYYY-MM-DD
**Version**: 1.0
**Status**: Complete | In Progress

## Forward Traceability (Requirements → Implementation)

| REQ ID  | Description    | Design Ref | Task ID | Code Files    | Test Files         | Status |
| ------- | -------------- | ---------- | ------- | ------------- | ------------------ | ------ |
| REQ-001 | User login     | AUTH-SVC   | P1-001  | auth/login.ts | auth/login.test.ts | ✅     |
| REQ-002 | Password reset | AUTH-SVC   | P1-002  | auth/reset.ts | auth/reset.test.ts | ✅     |
| REQ-003 | 2FA support    | AUTH-SVC   | -       | -             | -                  | ❌     |

## Backward Traceability (Tests → Requirements)

| Test ID | Test Description | Code File       | REQ ID  | Status    |
| ------- | ---------------- | --------------- | ------- | --------- |
| T-001   | Login success    | auth/login.ts   | REQ-001 | ✅        |
| T-002   | Login failure    | auth/login.ts   | REQ-001 | ✅        |
| T-003   | Session timeout  | auth/session.ts | -       | ⚠️ Orphan |

## Coverage Summary

| Metric                   | Current | Target | Status |
| ------------------------ | ------- | ------ | ------ |
| Requirements with Design | 100%    | 100%   | ✅     |
| Requirements with Code   | 67%     | 100%   | ❌     |
| Requirements with Tests  | 67%     | 100%   | ❌     |
| Overall Traceability     | 67%     | 100%   | ❌     |

## Gaps Identified

### Missing Implementations

| REQ ID  | Description | Action Required       |
| ------- | ----------- | --------------------- |
| REQ-003 | 2FA support | Create design & tasks |

### Orphaned Tests

| Test ID | Description     | Action Required           |
| ------- | --------------- | ------------------------- |
| T-003   | Session timeout | Add requirement or remove |

## Recommendations

1. Implement REQ-003 or mark as deferred
2. Create requirement for session timeout test
```

---

## Quick Coverage Report

```markdown
# Coverage Report: [Feature]

## At a Glance

📊 **Overall: 67%** ❌ (Target: 100%)

| Stage          | Coverage        |
| -------------- | --------------- |
| REQ → Design   | ████████░░ 80%  |
| Design → Tasks | ██████████ 100% |
| Tasks → Code   | ██████░░░░ 60%  |
| Code → Tests   | ████████░░ 80%  |

## Critical Gaps

🔴 REQ-003: No implementation
🔴 REQ-007: No tests

## Next Actions

1. [ ] Assign REQ-003 to developer
2. [ ] Create tests for REQ-007
```

---

## Automated Matrix Generation

```python
# generate_matrix.py

def generate_traceability_matrix(feature_name):
    """Generate traceability matrix for a feature."""

    requirements = parse_requirements(f"storage/specs/{feature_name}-requirements.md")
    design = parse_design(f"storage/design/{feature_name}-design.md")
    tasks = parse_tasks(f"storage/tasks/{feature_name}-tasks.md")
    code_files = find_code_files(f"src/{feature_name}/")
    test_files = find_test_files(f"tests/{feature_name}/")

    matrix = []
    for req in requirements:
        row = {
            'req_id': req.id,
            'description': req.description,
            'design_ref': find_design_ref(req.id, design),
            'task_id': find_task_ref(req.id, tasks),
            'code_files': find_code_ref(req.id, code_files),
            'test_files': find_test_ref(req.id, test_files),
            'status': calculate_status(row)
        }
        matrix.append(row)

    return matrix
```

---

## Status Indicators

| Icon | Meaning          |
| ---- | ---------------- |
| ✅   | Fully traced     |
| ⚠️   | Partially traced |
| ❌   | Not traced       |
| 🔄   | In progress      |
| ⏸️   | Deferred         |
