# Complexity Tracking

This document tracks justified exceptions to Constitutional Articles VII (Simplicity Gate) and VIII (Anti-Abstraction Gate).

---

## Overview

| Metric | Current | Limit | Status |
|--------|---------|-------|--------|
| Project Count | 2 | 3 | ✅ Within limit |
| Approved Abstractions | 0 | - | ✅ None needed |

---

## Active Exceptions

### Article VII Exceptions (Project Count)

_No active exceptions. Project count within 3-project limit._

<!--
| Exception ID | Approved Date | Projects | Reason | Sunset Date |
|--------------|---------------|----------|--------|-------------|
| GATE-2024-XX-XX-001 | YYYY-MM-DD | [list] | [reason] | YYYY-MM-DD |
-->

### Article VIII Exceptions (Abstractions)

_No active exceptions. Using framework APIs directly._

<!--
| Exception ID | Approved Date | Abstraction | Frameworks | Sunset Date |
|--------------|---------------|-------------|------------|-------------|
| GATE-2024-XX-XX-002 | YYYY-MM-DD | [name] | [list] | YYYY-MM-DD |
-->

---

## Exception History

### Approved Exceptions

| ID | Date | Type | Description | Status |
|----|------|------|-------------|--------|
| - | - | - | No exceptions approved yet | - |

### Rejected Exceptions

| ID | Date | Type | Reason for Rejection |
|----|------|------|---------------------|
| - | - | - | No exceptions requested yet |

---

## Periodic Review Log

| Review Date | Reviewer | Findings | Actions |
|-------------|----------|----------|---------|
| YYYY-MM-DD | [name] | Initial setup | None required |

---

## Guidelines

### When to Request Exception

**Article VII (Simplicity Gate)**:
- Only when business requirements genuinely require > 3 projects
- When team capacity supports additional coordination
- When alternatives have been exhausted

**Article VIII (Anti-Abstraction Gate)**:
- Only when supporting multiple frameworks is a real requirement
- When abstraction provides clear value over direct usage
- When team has expertise in all target frameworks

### Review Process

1. Submit Phase -1 Gate Request (see `steering/templates/phase-minus-one-gate-request.md`)
2. Review by required approvers
3. If approved, document in this file
4. Set sunset/review date
5. Periodic reviews per schedule

---

## Current Architecture

```
musubi/
├── src/           # Core library
├── bin/           # CLI interfaces
├── packages/
│   └── vscode-extension/  # VS Code extension
└── tests/         # Test suites
```

**Project Count**: 2 (core + vscode-extension)

This architecture complies with Article VII without exceptions.
