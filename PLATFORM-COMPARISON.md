# MUSUBI - プラットフォーム間機能比較レポート

**調査日**: 2025-11-17  
**対象バージョン**: MUSUBI v0.1.2

## 📊 エグゼクティブサマリー

MUSUBIは7つのAIコーディングエージェントをサポートしていますが、**Claude Code専用の機能(Skills API)** があります。

### 結論

**❌ Claude Code以外のプラットフォームでは、Claude Code用のMUSUBIと同じ機能はすべて使えません**

- **✅ 同等機能**: コマンド(9種類)、ステアリングシステム、憲法ガバナンス
- **❌ Claude Code限定**: 25の専門スキル(Skills API)

---

## 🎯 サポート対象プラットフォーム(7種類)

| プラットフォーム | コマンド | スキル | フォーマット | プレフィックス |
|------------------|----------|--------|--------------|----------------|
| **Claude Code** | ✅ 9 | ✅ 25 | Markdown | `/` |
| GitHub Copilot | ✅ 9 | ❌ 0 | Markdown | `#` |
| Cursor IDE | ✅ 9 | ❌ 0 | Markdown | `/` |
| Gemini CLI | ✅ 9 | ❌ 0 | **TOML** | `/` |
| Codex CLI | ✅ 9 | ❌ 0 | Markdown | `/prompts:` |
| Qwen Code | ✅ 9 | ❌ 0 | Markdown | `/` |
| Windsurf IDE | ✅ 9 | ❌ 0 | Markdown | `/` |

---

## ✅ 全プラットフォーム共通機能

### 1. コマンド(9種類)

すべてのプラットフォームで以下の9コマンドが利用可能:

#### グリーンフィールド(新規プロジェクト - 6コマンド)
1. **`sdd-steering`** - プロジェクトメモリ生成(structure.md, tech.md, product.md)
2. **`sdd-requirements`** - EARS要件仕様作成
3. **`sdd-design`** - 技術設計生成(C4図、ADR、API仕様)
4. **`sdd-tasks`** - 実装タスク分解
5. **`sdd-implement`** - テストファースト実装
6. **`sdd-validate`** - 憲法準拠検証

#### ブラウンフィールド(既存コードベース - 3コマンド)
7. **`sdd-change-init`** - 変更提案作成
8. **`sdd-change-apply`** - 変更実装
9. **`sdd-change-archive`** - 変更アーカイブ

### 2. ステアリングシステム(プロジェクトメモリ)

すべてのプラットフォームで以下が自動生成・維持される:
- `steering/structure.md` - アーキテクチャパターン
- `steering/tech.md` - 技術スタック
- `steering/product.md` - ビジネスコンテキスト

### 3. 憲法ガバナンス(9条項)

すべてのプラットフォームで以下が実施される:
- Article I: ライブラリファースト原則
- Article II: CLIインターフェイス義務
- Article III: テストファースト命令
- Article IV: EARS要件フォーマット
- Article V: トレーサビリティ義務
- Article VI: プロジェクトメモリ
- Article VII: バイリンガルドキュメント
- Article VIII: 単一の真実の情報源
- Article IX: テストでの実サービス

### 4. SDDワークフロー

すべてのプラットフォームで8ステージワークフローをサポート:
1. Research(調査)
2. Requirements(要件)
3. Design(設計)
4. Tasks(タスク)
5. Implementation(実装)
6. Testing(テスト)
7. Deployment(デプロイ)
8. Monitoring(モニタリング)

---

## ❌ Claude Code専用機能

### 25の専門スキル(Skills API)

**Skills APIはClaude Code専用機能**のため、他プラットフォームでは利用不可。

#### スキル一覧(25種類)

**オーケストレーション(3スキル)**:
1. `@orchestrator` - マルチエージェント統合調整
2. `@steering` - プロジェクトメモリ管理
3. `@constitution-enforcer` - 憲法ガバナンス実施

**要件・計画(3スキル)**:
4. `@requirements-analyst` - 要件分析・EARS仕様
5. `@project-manager` - プロジェクト計画・スケジュール
6. `@change-impact-analyzer` - 変更影響分析

**アーキテクチャ・設計(4スキル)**:
7. `@system-architect` - システムアーキテクチャ・C4図
8. `@api-designer` - REST/GraphQL/gRPC API設計
9. `@database-schema-designer` - データベース設計・ER図
10. `@ui-ux-designer` - UI/UXデザイン・ワイヤーフレーム

**開発(1スキル)**:
11. `@software-developer` - マルチ言語コード実装

**品質・レビュー(5スキル)**:
12. `@test-engineer` - ユニット・統合・E2Eテスト
13. `@code-reviewer` - コードレビュー・SOLID原則
14. `@bug-hunter` - バグ調査・根本原因分析
15. `@quality-assurance` - QA戦略・テスト計画
16. `@traceability-auditor` - トレーサビリティ検証

**セキュリティ・パフォーマンス(2スキル)**:
17. `@security-auditor` - OWASP Top 10・脆弱性検出
18. `@performance-optimizer` - パフォーマンス分析・最適化

**インフラ(5スキル)**:
19. `@devops-engineer` - CI/CDパイプライン・Docker/Kubernetes
20. `@cloud-architect` - AWS/Azure/GCP・IaC(Terraform/Bicep)
21. `@database-administrator` - データベース運用・チューニング
22. `@site-reliability-engineer` - SRE実践・モニタリング
23. `@release-coordinator` - リリース調整・デプロイ戦略

**ドキュメント・専門(2スキル)**:
24. `@technical-writer` - 技術ドキュメント・API docs
25. `@ai-ml-engineer` - MLモデル開発・MLOps

### スキルの機能

スキルは単なるプロンプトより高機能:
- **コンテキスト管理**: ステアリングファイル自動読み込み
- **ツール統合**: ファイル読み書き、検索、実行を統合
- **ワークフロー自動化**: 複数ステップを自動実行
- **トリガーワード**: 特定キーワードで自動起動
- **品質保証**: 出力形式とトレーサビリティを保証

---

## 📋 機能比較詳細

### Claude Code vs 他プラットフォーム

| 機能カテゴリ | Claude Code | 他6プラットフォーム |
|--------------|-------------|---------------------|
| **コマンド数** | 9 | 9 |
| **スキル数** | 25 | 0 (Skills API非対応) |
| **ステアリングシステム** | ✅ | ✅ |
| **憲法ガバナンス** | ✅ | ✅ |
| **EARS要件** | ✅ | ✅ |
| **C4図生成** | ✅ | ✅ |
| **ADR生成** | ✅ | ✅ |
| **テストファースト** | ✅ | ✅ |
| **トレーサビリティ** | ✅ | ✅ |
| **バイリンガルドキュメント** | ✅ | ✅ |
| **マルチエージェント調整** | ✅ @orchestrator | ❌ 手動 |
| **変更影響分析** | ✅ @change-impact-analyzer | ⚠️ コマンドのみ |
| **憲法自動実施** | ✅ @constitution-enforcer | ⚠️ CLIのみ |
| **トレーサビリティ自動監査** | ✅ @traceability-auditor | ❌ 手動 |
| **専門ロール別AI** | ✅ 25スキル | ❌ 汎用AIのみ |

### コマンドとスキルの違い

| 比較項目 | コマンド | スキル(Claude Code専用) |
|----------|----------|--------------------------|
| **利用可能プラットフォーム** | 全7プラットフォーム | Claude Codeのみ |
| **実装** | Markdownプロンプト | Skills API |
| **自動化レベル** | 半自動 | 完全自動 |
| **コンテキスト管理** | 手動読み込み | 自動読み込み |
| **ツール統合** | 明示的呼び出し | 暗黙的統合 |
| **複雑ワークフロー** | ユーザー調整必要 | AI自動調整 |
| **専門性** | 汎用 | 役割特化(25種類) |
| **トリガー** | 明示的コマンド | キーワード自動起動 |

---

## 🔍 プラットフォーム別特徴

### 1. Claude Code(デフォルト)
- **ディレクトリ**: `.claude/skills/`, `.claude/commands/`
- **ドキュメント**: `CLAUDE.md`
- **プレフィックス**: `/`(スラッシュ)
- **特徴**: **Skills API対応 - 25スキル利用可能**
- **推奨モデル**: Claude Sonnet 4.5以降

### 2. GitHub Copilot
- **ディレクトリ**: `.github/prompts/`
- **ドキュメント**: `AGENTS.md`
- **プレフィックス**: `#`(ハッシュ)
- **特徴**: コマンドのみ(スキルなし)
- **推奨モデル**: Claude Sonnet 4.5以降、GPT-4

### 3. Cursor IDE
- **ディレクトリ**: `.cursor/commands/`
- **ドキュメント**: `AGENTS.md`
- **プレフィックス**: `/`(スラッシュ)
- **特徴**: コマンドのみ(スキルなし)
- **推奨モデル**: Claude Sonnet 4.5以降、GPT-4

### 4. Gemini CLI
- **ディレクトリ**: `.gemini/commands/`
- **ドキュメント**: `GEMINI.md`
- **プレフィックス**: `/`(スラッシュ)
- **フォーマット**: **TOML**(他はMarkdown)
- **特徴**: Gemini固有TOML形式
- **推奨モデル**: Gemini 2.0 Flash以降

### 5. Codex CLI
- **ディレクトリ**: `.codex/prompts/`
- **ドキュメント**: `AGENTS.md`
- **プレフィックス**: `/prompts:`
- **特徴**: コマンドのみ(スキルなし)
- **推奨モデル**: GPT-4以降

### 6. Qwen Code
- **ディレクトリ**: `.qwen/commands/`
- **ドキュメント**: `QWEN.md`
- **プレフィックス**: `/`(スラッシュ)
- **特徴**: コマンドのみ(スキルなし)
- **推奨モデル**: Qwen 2.5 Coder以降

### 7. Windsurf IDE
- **ディレクトリ**: `.windsurf/workflows/`
- **ドキュメント**: `AGENTS.md`
- **プレフィックス**: `/`(スラッシュ)
- **特徴**: ワークフロー形式、コマンドのみ(スキルなし)
- **推奨モデル**: Claude Sonnet 4.5以降、GPT-4

---

## 💡 推奨プラットフォーム選択

### Claude Codeを選ぶべきケース

- **複雑なプロジェクト**: 複数の専門領域(API設計、DB設計、セキュリティ等)
- **マルチエージェント調整が必要**: @orchestratorで自動調整
- **高度な品質保証**: @constitution-enforcer、@traceability-auditorで自動監査
- **専門スキル活用**: 25種類の役割特化AI
- **完全自動化**: コンテキスト自動読み込み、ワークフロー自動実行

### 他プラットフォームでも十分なケース

- **シンプルなプロジェクト**: 単一ドメイン、小〜中規模
- **基本的なSDD**: 要件→設計→実装→検証フロー
- **手動調整可能**: ユーザーが明示的にコマンド実行
- **プラットフォーム制約**: GitHub Copilot、Cursor等の使用が必須

---

## 📚 ドキュメント構造

すべてのプラットフォームで以下のディレクトリ構造が生成される:

```
project/
├── .{agent}/              # エージェント別ディレクトリ
│   ├── skills/            # Claude Codeのみ(25スキル)
│   └── commands/          # 全エージェント(9コマンド)
├── steering/              # 全エージェント共通
│   ├── structure.md       # アーキテクチャ
│   ├── tech.md            # 技術スタック
│   ├── product.md         # ビジネスコンテキスト
│   └── rules/
│       └── constitution.md  # 9憲法条項
├── templates/             # ドキュメントテンプレート
└── storage/               # 生成された仕様
    ├── specs/             # 要件・設計
    ├── changes/           # 変更履歴
    └── features/          # 機能記録
```

---

## 🎯 結論と推奨事項

### 主要な発見

1. **機能の不平等性**: Claude Code専用の25スキル(Skills API)は他プラットフォームで利用不可
2. **基本機能の平等性**: 9コマンド、ステアリングシステム、憲法ガバナンスは全プラットフォームで利用可能
3. **自動化レベルの差**: Claude Codeは完全自動化、他は半自動(手動調整必要)

### ユーザーへの推奨

#### Claude Codeユーザー
- **最大活用**: 25スキル、@orchestrator、自動化ワークフロー
- **高度な機能**: マルチエージェント調整、自動憲法実施、トレーサビリティ監査

#### 他プラットフォームユーザー
- **基本SDDワークフロー利用可能**: 要件→設計→実装→検証
- **手動調整が必要**: コマンド実行、コンテキスト管理
- **将来の拡張可能性**: プラットフォームがSkills API対応した場合、自動的に利用可能

### 開発チームへの示唆

- **Skills API移植の検討**: GitHub Copilot、Cursor等へのSkills API対応を検討
- **代替実装の可能性**: MCP(Model Context Protocol)による統合など
- **ドキュメント充実**: 他プラットフォームでの手動ワークフロー例を提供

---

**レポート作成日**: 2025-11-17  
**MUSUBIバージョン**: v0.1.2  
**調査範囲**: 全7サポートプラットフォーム
