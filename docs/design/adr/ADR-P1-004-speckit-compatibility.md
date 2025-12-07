# ADR-P1-004: Spec Kit Compatibility

## Status

Proposed

## Date

2025-12-07

## Context

MUSUBI と GitHub Spec Kit は両方とも Specification-Driven Development (SDD) を推進するツールです。多くの開発チームが両方のツールを評価・使用する可能性があるため、相互運用性を提供することで以下のメリットが得られます：

1. **移行パス**: Spec Kit から MUSUBI への移行、またはその逆を容易にする
2. **エコシステム統合**: Spec Kit ユーザーが MUSUBI の機能（憲法ガバナンス、EARS形式）を活用可能
3. **相互運用性**: プロジェクト間でスペックを共有・交換可能
4. **ベンダーロックイン回避**: ユーザーが特定ツールに縛られない

### Spec Kit の構造

GitHub Spec Kit は以下の構造を使用：

```
.specify/
├── memory/
│   └── constitution.md          # プロジェクト憲法
├── templates/
│   ├── spec-template.md        # スペックテンプレート
│   ├── plan-template.md        # 計画テンプレート
│   ├── tasks-template.md       # タスクテンプレート
│   └── commands/               # スラッシュコマンド定義
├── scripts/
│   ├── bash/                   # Bashスクリプト
│   └── powershell/             # PowerShellスクリプト
└── specs/
    └── ###-feature-name/
        ├── spec.md             # 機能仕様
        ├── plan.md             # 実装計画
        ├── tasks.md            # タスクリスト
        ├── research.md         # リサーチ（オプション）
        ├── data-model.md       # データモデル（オプション）
        ├── quickstart.md       # クイックスタート（オプション）
        └── contracts/          # APIコントラクト
```

### MUSUBI の構造

MUSUBI は以下の構造を使用：

```
steering/
├── product.md                  # プロダクトコンテキスト
├── structure.md                # アーキテクチャパターン
├── tech.md                     # テクノロジースタック
├── project.yml                 # プロジェクト設定
├── rules/
│   ├── constitution.md         # 9条項憲法
│   └── workflow.md             # 8ステージワークフロー
├── memories/                   # 記憶システム
└── templates/                  # EARS テンプレート
storage/
└── specs/                      # スペック保存
```

## Decision

**双方向変換システム**を実装し、`musubi-convert` コマンドで MUSUBI ↔ Spec Kit の相互変換を可能にします。

### 主要アーキテクチャ決定

#### 1. 変換アーキテクチャ: Intermediate Representation (IR) パターン

**選択肢**:
- A. 直接変換（MUSUBI → Spec Kit, Spec Kit → MUSUBI）
- B. Intermediate Representation (IR) 経由変換
- C. プラグインベース変換

**決定**: B. Intermediate Representation (IR) 経由変換

**理由**:
- 将来的に他のフォーマット（Kiro、OpenSpec等）への拡張が容易
- 変換ロジックの複雑さを O(n) に抑制（直接変換は O(n²)）
- テスト・デバッグが容易
- 変換精度の検証が明確

#### 2. マッピング戦略: 構造マッピング + 意味マッピング

**選択肢**:
- A. 構造マッピングのみ（ファイル→ファイル）
- B. 意味マッピングのみ（内容解析）
- C. 構造マッピング + 意味マッピング（ハイブリッド）

**決定**: C. 構造マッピング + 意味マッピング

**理由**:
- ファイル構造は直接マッピング可能
- 内容（EARS形式 ↔ User Stories）は意味的変換が必要
- 両方を組み合わせることで高精度な変換を実現

#### 3. 憲法マッピング: 拡張マッピング

**Spec Kit Constitution** → **MUSUBI 9 Articles** マッピング:

| Spec Kit Section | MUSUBI Article |
|-----------------|----------------|
| Core Principles | Article I: Specification Primacy |
| Quality Standards | Article II: Test-First Development |
| Architecture | Article III: Architectural Compliance |
| Security | Article IV: Traceability Requirements |
| Governance | Article V: Change Control Protocol |
| (implicit) | Article VI: Separation of Concerns |
| (implicit) | Article VII: Documentation Standards |
| (implicit) | Article VIII: Continuous Validation |
| (implicit) | Article IX: Graceful Degradation |

**決定**: MUSUBI の 9 条項を完全維持し、Spec Kit からの変換時に不足分を補完

#### 4. 要件形式マッピング: EARS ↔ User Stories

**Spec Kit User Story 形式**:
```markdown
### User Story: [Title]
**Priority**: [P1/P2/P3]
As a [user type], I want to [action] so that [benefit]
**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
```

**MUSUBI EARS 形式**:
```markdown
### REQ-XXX: [Title]
**Pattern**: [Ubiquitous/Event-Driven/State-Driven/Optional/Complex]
**Priority**: [P0/P1/P2/P3]
WHEN [trigger], the system SHALL [action]
**Acceptance Criteria**:
- AC1: [criterion]
- AC2: [criterion]
```

**決定**: 双方向変換ルールを定義し、情報損失を最小化

#### 5. CLI インターフェース設計

```bash
# Spec Kit → MUSUBI
musubi-convert --from-speckit [path] [--output dir] [--dry-run] [--verbose]

# MUSUBI → Spec Kit
musubi-convert --to-speckit [--output dir] [--dry-run] [--verbose]

# 検証のみ
musubi-convert --validate [format] [path]

# ラウンドトリップテスト
musubi-convert --roundtrip [path]
```

## Consequences

### Positive

1. **相互運用性向上**: Spec Kit ユーザーが MUSUBI を試用しやすい
2. **移行パス提供**: プロジェクトの段階的移行が可能
3. **エコシステム拡大**: 両ツールのコミュニティが相互に利益を得る
4. **将来拡張性**: IR パターンにより他フォーマット対応が容易

### Negative

1. **開発コスト**: 変換ロジックの実装・テストに時間が必要
2. **メンテナンス負担**: Spec Kit の仕様変更への追従が必要
3. **情報損失リスク**: 完全な1:1マッピングは困難

### Risks

| リスク | 確率 | 影響 | 対策 |
|--------|------|------|------|
| Spec Kit 仕様変更 | 中 | 中 | バージョン固定、抽象化層 |
| 変換精度の問題 | 低 | 高 | 徹底的なテスト、ラウンドトリップ検証 |
| パフォーマンス | 低 | 低 | ストリーミング処理、キャッシュ |

## Related Decisions

- ADR-P1-003: VS Code Extension（変換機能の UI 統合）
- REQ-P1-004: Spec Kit Compatibility（要件定義）

## References

- GitHub Spec Kit: https://github.com/github/spec-kit
- EARS Notation: docs/requirements/ears-format.md
- MUSUBI Constitution: steering/rules/constitution.md
