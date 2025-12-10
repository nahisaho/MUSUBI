# Phase 4 & 5 Design Document

## メタデータ
- **ドキュメント種別**: 設計書 (SDD Stage 3)
- **作成日**: 2025-12-10
- **プロジェクト**: MUSUBI v5.0.0
- **関連要件**: [srs-musubi-v5.0.0.md](../../docs/requirements/srs/srs-musubi-v5.0.0.md)
- **Constitutional Compliance**: Article III (Design-First), Article V (Traceability)

---

## 1. Architecture Decision Records (ADRs)

### ADR-P4-001: Codebase Intelligence Architecture

**Status**: Accepted  
**Date**: 2025-12-10  
**Context**:  
LLMエージェントに効率的なコンテキストを提供するため、コードベースの構造と関係性を理解する必要がある。

**Decision**:  
3つの独立したコンポーネントによる階層的アプローチを採用:
1. RepositoryMap - ファイル構造とエントリポイント
2. ASTExtractor - シンボルと関係性
3. ContextOptimizer - トークン最適化

**Consequences**:
- ✅ 関心事の分離
- ✅ 独立したテスト可能性
- ✅ 段階的な処理
- ⚠️ 3つのコンポーネント間の統合が必要

**Traceability**:
- REQ-P4-001, REQ-P4-002, REQ-P4-003

---

### ADR-P5-001: Monitoring Layer Design

**Status**: Accepted  
**Date**: 2025-12-10  
**Context**:  
本番運用のために、品質メトリクス、インシデント管理、リリース自動化が必要。

**Decision**:  
5つの専門コンポーネントを持つモニタリングレイヤーを実装:
1. QualityDashboard - カバレッジと品質メトリクス
2. IncidentManager - エラー追跡とインシデント対応
3. ReleaseManager - バージョン管理とリリース自動化
4. Observability - ログ、メトリクス、トレース
5. CostTracker - API使用量とコスト管理

**Consequences**:
- ✅ 包括的な可観測性
- ✅ 自動化されたリリースプロセス
- ✅ コスト可視化
- ⚠️ 追加の依存関係

**Traceability**:
- REQ-P5-001, REQ-P5-002, REQ-P5-003, REQ-P5-004, REQ-P5-005

---

## 2. C4 Model - Context Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      MUSUBI v5.0.0                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Intelligence Layer (Phase 4)            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ │   │
│  │  │ Repository  │ │    AST      │ │   Context     │ │   │
│  │  │    Map      │ │  Extractor  │ │  Optimizer    │ │   │
│  │  └─────────────┘ └─────────────┘ └───────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Monitoring Layer (Phase 5)              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ │   │
│  │  │  Quality    │ │  Incident   │ │   Release     │ │   │
│  │  │ Dashboard   │ │  Manager    │ │   Manager     │ │   │
│  │  └─────────────┘ └─────────────┘ └───────────────┘ │   │
│  │  ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │Observability│ │   Cost      │                   │   │
│  │  │             │ │  Tracker    │                   │   │
│  │  └─────────────┘ └─────────────┘                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Design

### 3.1 RepositoryMap

**File**: `src/analyzers/repository-map.js`
**Requirement**: REQ-P4-001

```javascript
class RepositoryMap {
  constructor(rootPath, options)
  async scan()
  getFiles(pattern)
  getSymbols(name)
  getDependencies(file)
  exportJSON()
  exportMarkdown()
}
```

---

### 3.2 ASTExtractor

**File**: `src/analyzers/ast-extractor.js`
**Requirement**: REQ-P4-002

```javascript
class ASTExtractor {
  constructor(options)
  parse(code, language)
  extractFunctions(ast)
  extractClasses(ast)
  calculateComplexity(ast)
}
```

---

### 3.3 ContextOptimizer

**File**: `src/analyzers/context-optimizer.js`
**Requirement**: REQ-P4-003

```javascript
class ContextOptimizer {
  constructor(repositoryMap, astExtractor)
  optimize(request)
  scoreRelevance(chunk, query)
  selectChunks(chunks, budget)
}
```

---

### 3.4 QualityDashboard

**File**: `src/monitoring/quality-dashboard.js`
**Requirement**: REQ-P5-001

```javascript
class QualityDashboard {
  constructor(options)
  collectMetrics()
  getHealthScore()
  generateReport()
}
```

---

### 3.5 IncidentManager

**File**: `src/monitoring/incident-manager.js`
**Requirement**: REQ-P5-002

```javascript
class IncidentManager {
  constructor(options)
  createIncident(error, severity)
  acknowledgeIncident(id)
  resolveIncident(id, resolution)
  getIncidentHistory()
}
```

---

### 3.6 ReleaseManager

**File**: `src/monitoring/release-manager.js`
**Requirement**: REQ-P5-003

```javascript
class ReleaseManager {
  constructor(options)
  planRelease(version)
  executeRelease()
  rollback(version)
  generateChangelog()
}
```

---

### 3.7 Observability

**File**: `src/monitoring/observability.js`
**Requirement**: REQ-P5-004

```javascript
class Observability {
  constructor(options)
  log(level, message, context)
  metric(name, value, tags)
  startSpan(name)
  endSpan(span)
}
```

---

### 3.8 CostTracker

**File**: `src/monitoring/cost-tracker.js`
**Requirement**: REQ-P5-005

```javascript
class CostTracker {
  constructor(options)
  trackRequest(provider, tokens)
  getDailyCost()
  getMonthlyCost()
  setAlert(threshold)
}
```

---

## 4. Traceability Matrix

| Requirement | Design Section | Implementation | Test |
|-------------|---------------|----------------|------|
| REQ-P4-001 | 3.1 | src/analyzers/repository-map.js | tests/analyzers/repository-map.test.js |
| REQ-P4-002 | 3.2 | src/analyzers/ast-extractor.js | tests/analyzers/ast-extractor.test.js |
| REQ-P4-003 | 3.3 | src/analyzers/context-optimizer.js | tests/analyzers/context-optimizer.test.js |
| REQ-P5-001 | 3.4 | src/monitoring/quality-dashboard.js | tests/monitoring/quality-dashboard.test.js |
| REQ-P5-002 | 3.5 | src/monitoring/incident-manager.js | tests/monitoring/incident-manager.test.js |
| REQ-P5-003 | 3.6 | src/monitoring/release-manager.js | tests/monitoring/release-manager.test.js |
| REQ-P5-004 | 3.7 | src/monitoring/observability.js | tests/monitoring/observability.test.js |
| REQ-P5-005 | 3.8 | src/monitoring/cost-tracker.js | tests/monitoring/cost-tracker.test.js |

---

## 5. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-10 | MUSUBI Team | Initial design for Phase 4 & 5 |

---

*― End of Document ―*
