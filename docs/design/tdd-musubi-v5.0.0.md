# MUSUBI v5.0.0 Technical Design Document

**Phase 4 & 5: Codebase Intelligence and Production Readiness**

| Item | Content |
|------|---------|
| Document ID | MUSUBI-TDD-2025-002 |
| Version | 5.0.0 |
| Created | 2025-12-10 |
| Author | MUSUBI Team |
| Status | Released |

---

## 1. Overview

This document describes the technical design for MUSUBI v5.0.0, covering Phase 4 (Codebase Intelligence) and Phase 5 (Production Readiness) implementations.

### 1.1 Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        MUSUBI v5.0.0                           │
├─────────────────────────────────────────────────────────────────┤
│  CLI Layer (20 Commands)                                       │
│  ├── musubi-init, musubi-validate, musubi-sync                 │
│  ├── musubi-analyze, musubi-trace, musubi-gaps                 │
│  ├── musubi-orchestrate, musubi-change, musubi-costs           │
│  └── musubi-gui, musubi-browser, musubi-checkpoint             │
├─────────────────────────────────────────────────────────────────┤
│  Orchestration Layer (Phase 3)                                 │
│  ├── Pattern Registry (7 patterns)                             │
│  ├── Workflow Executor                                         │
│  ├── Guardrails (Input/Output)                                 │
│  └── Replanning Engine                                         │
├─────────────────────────────────────────────────────────────────┤
│  Intelligence Layer (Phase 4) ← NEW                            │
│  ├── RepositoryMap        → Codebase structure analysis        │
│  ├── ASTExtractor         → Syntax tree parsing                │
│  └── ContextOptimizer     → LLM context optimization           │
├─────────────────────────────────────────────────────────────────┤
│  Monitoring Layer (Phase 5) ← NEW                              │
│  ├── QualityDashboard     → Code quality metrics               │
│  ├── IncidentManager      → Error tracking                     │
│  ├── ReleaseManager       → Version automation                 │
│  ├── Observability        → Metrics/Logging/Tracing            │
│  └── CostTracker          → API usage tracking                 │
├─────────────────────────────────────────────────────────────────┤
│  Core Layer                                                    │
│  ├── Agents (25 Skills)                                        │
│  ├── Validators (Constitution, Traceability)                   │
│  ├── Generators (Requirements, Design, Tasks)                  │
│  └── Integrations (MCP, GitHub, CI/CD)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. C4 Architecture

### Level 1: System Context

MUSUBI is a specification-driven development tool that integrates with development environments (VS Code, IDEs), version control systems (Git, GitHub), and CI/CD pipelines to provide AI-enhanced software development workflows with constitutional governance.

### Level 2: Container Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        MUSUBI v5.0.0                           │
├─────────────────────────────────────────────────────────────────┤
│  CLI Container (20 Commands)                                   │
│  Web GUI Container (Browser-based Interface)                   │
│  VS Code Extension Container (In-IDE Integration)              │
│  Core Library Container (Agents, Validators, Generators)       │
└─────────────────────────────────────────────────────────────────┘
```

### Level 3: Component Diagram

The component diagram shows the major components within each container, including the 25 skills, validators, generators, and integrations.

### Level 4: Code Level

Detailed implementation in source files under `src/` directory.

---

## 3. Architectural Decision Records

### ADR-001: Constitutional Governance

**Context**: Need to ensure AI-generated code follows quality standards.
**Decision**: Implement 9 Constitutional Articles as code constraints.
**Status**: Accepted
**Consequences**: All generated artifacts must pass constitutional validation.
**Links**: REQ-P0-001, REQ-P0-002, REQ-P0-003

### ADR-002: Skill-Based Architecture

**Context**: Need modular, reusable components for different development phases.
**Decision**: Implement 25 specialized skills following single-responsibility principle.
**Status**: Accepted
**Consequences**: Each skill handles one concern, easier testing and maintenance.
**Links**: REQ-P1-001, REQ-P2-001

### ADR-003: Orchestration Engine

**Context**: Complex workflows require coordination of multiple skills.
**Decision**: Implement pattern-based orchestration with 7 workflow patterns.
**Status**: Accepted
**Consequences**: Predictable execution, replanning capability on failures.
**Links**: REQ-P3-001, REQ-P3-002, REQ-P3-003

### ADR-004: Codebase Intelligence

**Context**: LLM context windows are limited; need smart context selection.
**Decision**: Implement RepositoryMap + ASTExtractor + ContextOptimizer.
**Status**: Accepted
**Consequences**: Optimized context for LLM calls, reduced token usage.
**Links**: REQ-P4-001, REQ-P4-002, REQ-P4-003

### ADR-005: Production Monitoring

**Context**: Production systems need observability and incident management.
**Decision**: Implement QualityDashboard + IncidentManager + ReleaseManager.
**Status**: Accepted
**Consequences**: Full production readiness with monitoring and automation.
**Links**: REQ-P5-001, REQ-P5-002, REQ-P5-003, REQ-P5-004, REQ-P5-005

---

## 4. Phase 4: Codebase Intelligence

### 4.1 Component: RepositoryMap

**Requirement**: REQ-P4-001
**File**: `src/analyzers/repository-map.js`

#### 2.1.1 Class Diagram

```
┌───────────────────────────────────────┐
│          RepositoryMap                │
├───────────────────────────────────────┤
│ - rootPath: string                    │
│ - fileIndex: Map<string, FileInfo>    │
│ - symbolIndex: Map<string, Symbol[]>  │
│ - dependencies: DependencyGraph       │
├───────────────────────────────────────┤
│ + scan(): Promise<void>               │
│ + getFiles(pattern): FileInfo[]       │
│ + getSymbols(name): Symbol[]          │
│ + getDependencies(file): string[]     │
│ + exportJSON(): object                │
│ + exportMarkdown(): string            │
└───────────────────────────────────────┘
```

#### 2.1.2 Design Decisions

**ADR-P4-001**: File Indexing Strategy

- **Decision**: Use incremental indexing with file hash comparison
- **Rationale**: Full scan is expensive; incremental saves 80%+ time
- **Consequences**: Requires cache management, but 10x faster for large repos

---

### 2.2 Component: ASTExtractor

**Requirement**: REQ-P4-002
**File**: `src/analyzers/ast-extractor.js`

#### 2.2.1 Class Diagram

```
┌───────────────────────────────────────┐
│           ASTExtractor                │
├───────────────────────────────────────┤
│ - parser: Parser                      │
│ - cache: Map<string, AST>             │
├───────────────────────────────────────┤
│ + parse(code, lang): AST              │
│ + extractFunctions(ast): Function[]   │
│ + extractClasses(ast): Class[]        │
│ + calculateComplexity(ast): number    │
│ + getSymbolLocations(name): Location[]│
└───────────────────────────────────────┘
```

#### 2.2.2 Supported Languages

| Language | Parser | Status |
|----------|--------|--------|
| JavaScript | acorn | ✅ Full |
| TypeScript | typescript | ✅ Full |
| Python | Basic regex | ⚠️ Partial |

---

### 2.3 Component: ContextOptimizer

**Requirement**: REQ-P4-003
**File**: `src/analyzers/context-optimizer.js`

#### 2.3.1 Algorithm

```
1. Input: files[], query, tokenBudget
2. Score each file by relevance to query
3. Chunk files into semantic units (functions, classes)
4. Rank chunks by:
   - Query relevance (40%)
   - Code complexity (20%)
   - Recency of changes (20%)
   - Test coverage (20%)
5. Select chunks until tokenBudget reached
6. Output: optimized context string
```

---

## 3. Phase 5: Production Readiness

### 3.1 Component: QualityDashboard

**Requirement**: REQ-P5-001
**File**: `src/monitoring/quality-dashboard.js`

#### 3.1.1 Metrics Collected

| Metric | Source | Update Frequency |
|--------|--------|-----------------|
| Test Coverage | Jest/Istanbul | Per test run |
| Cyclomatic Complexity | ASTExtractor | Per file change |
| Maintainability Index | Calculated | Per file change |
| Constitutional Score | Validator | Per validation |
| Traceability Rate | Trace Analyzer | On demand |

---

### 3.2 Component: IncidentManager

**Requirement**: REQ-P5-002
**File**: `src/monitoring/incident-manager.js`

#### 3.2.1 Incident Lifecycle

```
┌─────────┐   create   ┌──────────┐   acknowledge   ┌──────────────┐
│   NEW   │ ────────── │  OPEN    │ ───────────────►│ ACKNOWLEDGED │
└─────────┘            └──────────┘                 └──────────────┘
                            │                              │
                            │ auto-resolve                 │ resolve
                            ▼                              ▼
                     ┌──────────────┐              ┌──────────────┐
                     │ AUTO_RESOLVED│              │   RESOLVED   │
                     └──────────────┘              └──────────────┘
```

---

### 3.3 Component: ReleaseManager

**Requirement**: REQ-P5-003
**File**: `src/monitoring/release-manager.js`

#### 3.3.1 Release Workflow

```
1. Validate all tests pass
2. Validate constitutional compliance (100%)
3. Calculate new version (semver)
4. Update package.json
5. Generate CHANGELOG.md entry
6. Create git tag
7. npm publish
8. Create GitHub Release
9. Post-release notifications
```

---

### 3.4 Component: Observability

**Requirement**: REQ-P5-004
**File**: `src/monitoring/observability.js`

#### 3.4.1 Integration Points

```
┌─────────────────────────────────────────────────────────┐
│                    Observability                        │
├─────────────────────────────────────────────────────────┤
│  Logging                                                │
│  └── Structured JSON logs (Winston-compatible)          │
├─────────────────────────────────────────────────────────┤
│  Metrics                                                │
│  └── Prometheus-compatible metric collection            │
├─────────────────────────────────────────────────────────┤
│  Tracing                                                │
│  └── OpenTelemetry trace context propagation            │
└─────────────────────────────────────────────────────────┘
```

---

### 3.5 Component: CostTracker

**Requirement**: REQ-P5-005
**File**: `src/monitoring/cost-tracker.js`

#### 3.5.1 Pricing Model

| Provider | Input (per 1M tokens) | Output (per 1M tokens) |
|----------|----------------------|------------------------|
| OpenAI GPT-4o | $2.50 | $10.00 |
| Anthropic Claude 3.5 | $3.00 | $15.00 |
| GitHub Copilot | Subscription | - |
| Ollama (Local) | $0.00 | $0.00 |

---

## 4. Integration Architecture

### 4.1 Orchestration Integration

```javascript
// src/orchestration/index.js exports
module.exports = {
  // Phase 3: Orchestration
  OrchestrationEngine,
  WorkflowOrchestrator,
  PatternRegistry,
  
  // Phase 4: Codebase Intelligence
  RepositoryMap,
  ASTExtractor,
  ContextOptimizer,
  
  // Phase 5: Monitoring
  QualityDashboard,
  IncidentManager,
  ReleaseManager,
  Observability,
  CostTracker
};
```

---

## 5. Testing Strategy

### 5.1 Test Categories

| Category | Count | Coverage |
|----------|-------|----------|
| Unit Tests | 2,800 | 95%+ |
| Integration Tests | 400 | 85%+ |
| E2E Tests | 178 | Core flows |
| **Total** | **3,378** | **100% pass** |

### 5.2 Test File Mapping

| Component | Test File |
|-----------|-----------|
| RepositoryMap | tests/analyzers/repository-map.test.js |
| ASTExtractor | tests/analyzers/ast-extractor.test.js |
| ContextOptimizer | tests/analyzers/context-optimizer.test.js |
| QualityDashboard | tests/monitoring/quality-dashboard.test.js |
| IncidentManager | tests/monitoring/incident-manager.test.js |
| ReleaseManager | tests/monitoring/release-manager.test.js |
| Observability | tests/monitoring/observability.test.js |
| CostTracker | tests/monitoring/cost-tracker.test.js |

---

## 6. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0.0 | 2025-12-10 | MUSUBI Team | Phase 4 & 5 Design |

---

*― End of Document ―*
