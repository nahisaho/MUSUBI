# プロジェクト構造

## 概要
このドキュメントは、本プロジェクトのアーキテクチャパターン、ディレクトリ構成、コード構造規則を定義します。構造的決定の唯一の信頼できる情報源として機能します。

**最終更新日**: 2025-01-16 by @steering

## 構成理念

**CLI ファーストテンプレート配布システム** - MUSUBI は、集中型テンプレート管理システムを通じて、複数の AI コーディングエージェントプラットフォームに SDD フレームワークテンプレートを配布するコマンドラインツールです。

**コアアーキテクチャアプローチ**:
- **テンプレートベース配布**: `src/templates/` が唯一の信頼できる情報源
- **エージェントレジストリパターン**: メタデータを持つ集中型エージェント定義
- **フォーマットポリモーフィズム**: Markdown (6エージェント) と TOML (1エージェント) をサポート
- **バイリンガルドキュメント**: 英語 (`.md`) がプライマリ、日本語 (`.ja.md`) が翻訳
- **共有ガバナンス**: すべてのエージェントが同じ `steering/` と `constitution/` ファイルを使用

## ディレクトリ構造

### ルートレベル
**目的**: 7つのAIコーディングエージェント用テンプレートを持つCLIツール

```
musubi/
├── bin/                          # CLI エントリーポイント
│   ├── musubi.js                 # メイン CLI (musubi, musubi-sdd)
│   └── musubi-init.js            # インタラクティブプロジェクト初期化
├── src/                          # ソースコード
│   ├── agents/
│   │   └── registry.js           # エージェント定義 (7エージェント)
│   └── templates/                # テンプレートソース (ユーザープロジェクトにコピー)
│       ├── agents/               # エージェント固有テンプレート
│       │   ├── claude-code/      # Skills API + Commands (Markdown)
│       │   ├── github-copilot/   # Commands (Markdown)
│       │   ├── cursor/           # Commands (Markdown)
│       │   ├── gemini-cli/       # Commands (TOML)
│       │   ├── codex/            # Commands (Markdown)
│       │   ├── qwen-code/        # Commands (Markdown)
│       │   └── windsurf/         # Commands (Markdown)
│       └── shared/               # 共有テンプレート (全エージェント)
│           ├── constitution/     # 9つの憲法条項
│           ├── steering/         # プロジェクトメモリテンプレート
│           └── documents/        # ドキュメントテンプレート
├── steering/                     # MUSUBI 自身のプロジェクトメモリ
│   ├── structure.md              # このファイル
│   ├── tech.md                   # 技術スタック
│   ├── product.md                # 製品コンテキスト
│   ├── rules/                    # ガバナンスルール
│   └── templates/                # ドキュメントテンプレート
├── docs/                         # ドキュメント
│   ├── Qiita/                    # 日本語記事
│   ├── requirements/             # MUSUBI 要件
│   └── analysis/                 # フレームワーク分析
├── orchestrator/                 # マルチエージェント調整レポート
├── References/                   # 参照フレームワークソース
└── tests/                        # テストスイート
```

### CLIアーキテクチャ
MUSUBI は動的エージェント選択を伴うコマンドベースCLIアーキテクチャを使用:

```
bin/musubi.js
  ├── init command      → bin/musubi-init.js (インタラクティブセットアップ)
  ├── status command    → プロジェクトステータス表示
  ├── validate command  → クイック憲法チェック
  └── info command      → バージョンとエージェント情報
```

### テンプレート配布パターン
ユーザーが `npx musubi-sdd init --claude` を実行すると:

```
1. フラグからエージェントを検出 (src/agents/registry.js)
2. src/templates/agents/claude-code/ からテンプレートをコピー
3. src/templates/shared/ から共有テンプレートをコピー
4. エージェント固有ガイド (CLAUDE.md) を生成
5. ユーザープロジェクトにインストール:
   - .claude/skills/      (Claude Code用25スキル)
   - .claude/commands/    (9コマンド)
   - steering/            (プロジェクトメモリ)
   - templates/           (ドキュメントテンプレート)
   - storage/             (仕様、変更、機能)
```

## 命名規則

### ファイルとディレクトリ
- **CLI実行ファイル**: `musubi.js`, `musubi-init.js` (ケバブケース)
- **ソースファイル**: `registry.js` (ケバブケース)
- **テンプレート**: Markdownコマンドは `sdd-*.md`、Gemini CLIは `sdd-*.toml`
- **エージェントディレクトリ**: `claude-code/`, `github-copilot/`, `cursor/` (ケバブケース)
- **スキル**: `orchestrator/`, `requirements-analyst/` (ケバブケース)
- **ドキュメント**: 英語 `.md` が先、日本語 `.ja.md` が翻訳

### コマンド命名 (ユーザー向け)
- **スラッシュコマンド**: `/sdd-steering`, `/sdd-requirements` (Cursor, Windsurf, Claude Code, Gemini, Qwen)
- **ハッシュコマンド**: `#sdd-steering` (GitHub Copilot のみ)
- **名前空間コマンド**: `/prompts:sdd-steering` (Codex CLI のみ)

### コード要素
- **関数**: camelCase (`getAgentDefinition`, `detectAgentFromFlags`)
- **定数**: camelCase (オブジェクトの場合) (`agentDefinitions`)
- **クラス**: PascalCase (このプロジェクトでは未使用)
- **環境変数**: UPPERCASE (`NODE_ENV`, `npm_package_version`)

## インポート構成

### モジュールシステム
MUSUBI は互換性のため **CommonJS** と動的ESMインポートを使用:
```javascript
// CommonJS (デフォルト)
const { Command } = require('commander');
const chalk = require('chalk');

// 動的ESMインポート (inquirer v9用)
const inquirer = await import('inquirer');
await inquirer.default.prompt([...]);
```

### インポート順序 (ソースファイル内)
1. Node.js組み込み (`fs`, `path`)
2. 外部依存関係 (`commander`, `chalk`, `fs-extra`)
3. 内部モジュール (`src/agents/registry`)

### package.json パターン
- **bin エントリ**: `{ "musubi-sdd": "bin/musubi.js", "musubi": "bin/musubi.js" }`
- **main**: `src/index.js` (現在未使用、将来のライブラリAPI用)
- **files**: ホワイトリストパターン `["bin/", "src/", "README.md", "LICENSE"]`

## アーキテクチャパターン

### 主要アーキテクチャ決定

1. **CLI ファースト配布モデル**
   - **背景**: 7つの異なるAIエージェントを最小限のユーザー摩擦でサポートする必要
   - **決定**: `npx` サポート付きnpm配布CLIツールを使用
   - **結果**: 
     - ✅ 簡単なインストール (`npx musubi-sdd init`)
     - ✅ npm経由のバージョン管理
     - ⚠️ Node.js >=18.0.0 が必要

2. **テンプレートベースアーキテクチャ**
   - **背景**: すべてのエージェントで一貫したSDDフレームワークが必要
   - **決定**: `src/templates/` が唯一の信頼できる情報源、ユーザープロジェクトにコピー
   - **結果**:
     - ✅ メンテナンスが容易 (1回更新すればすべてのインストールに影響)
     - ✅ インストール後にユーザーがカスタマイズ可能
     - ⚠️ 更新には `musubi init` の再実行が必要

3. **CommonJS と動的ESMインポート**
   - **背景**: inquirer v9は純粋なESMだが、CLIは互換性のためCommonJSが必要
   - **決定**: ESM依存関係用に動的 `import()` を使用するCommonJSを使用
   - **結果**:
     - ✅ 古いNode.jsバージョンと互換性
     - ✅ 段階的な移行パス
     - ⚠️ 慎重なモジュール読み込みが必要 (`inquirer.default.prompt()`)

4. **エージェントレジストリパターン**
   - **背景**: 異なる構成を持つ複数のエージェントをサポートする必要
   - **決定**: エージェントメタデータを持つ集中型 `registry.js`
   - **結果**:
     - ✅ エージェント定義の唯一の信頼できる情報源
     - ✅ 新しいエージェントの追加が容易
     - ✅ 動的CLIフラグ生成

5. **Markdown + TOML フォーマットサポート**
   - **背景**: Gemini CLIはTOMLフォーマットが必要、他はMarkdownを使用
   - **決定**: 並列テンプレート (`.md` と `.toml`) を維持
   - **結果**:
     - ✅ 各エージェントのネイティブフォーマット
     - ⚠️ 2つのフォーマットを維持する必要 (6エージェントMarkdown、1エージェントTOML)

### コア原則
1. **テンプレート配布**: 単一ソース → 複数エージェントターゲット
2. **フォーマットポリモーフィズム**: Markdownがデフォルト、特定エージェント用にTOML
3. **エージェント非依存**: MUSUBI は特定のAIエージェントに依存しない
4. **憲法ガバナンス**: すべてのエージェントで9つの不変条項を実施

## ファイルサイズガイドライン

- **CLI ファイル**: bin/musubi.js (400+ 行 - 複数コマンドを持つCLIとして許容)
- **レジストリファイル**: src/agents/registry.js (200-300 行 - エージェント定義)
- **テンプレートファイル**: sdd-*.md (300-500 行 - 包括的プロンプト)
- **スキル**: 複雑さによって変動 (orchestrator > シンプルなバリデーター)

MUSUBI は以下において**完全性**を厳格な行制限より優先:
- CLI コマンド実装 (完全なヘルプテキスト、検証が必要)
- エージェントプロンプト (詳細な指示、例が必要)
- 憲法条項 (完全なガバナンスルールが必要)

## コード構成ベストプラクティス

1. **エージェントレジストリ**: `src/agents/registry.js` の集中型エージェント定義
   - すべての7エージェント構成
   - 動的フラグ生成
   - レイアウトとコマンドメタデータ

2. **テンプレート構成**: テンプレートはユーザープロジェクト構造を反映
   - `src/templates/agents/{agent}/` - エージェント固有ファイル
   - `src/templates/shared/` - 共通ファイル (全エージェント)
   - フォーマットバリエーション: Markdown (デフォルト), TOML (Gemini CLI)

3. **CLI コマンドパターン**: 各コマンドは bin/musubi.js の別セクション
   - init → bin/musubi-init.js に委譲
   - status → プロジェクト状態チェック
   - validate → クイック憲法コンプライアンス
   - info → バージョンとエージェント情報

4. **ドキュメント戦略**: 初日からバイリンガル
   - 英語 `.md` (プライマリ、参照バージョン)
   - 日本語 `.ja.md` (翻訳)
   - 常に英語を先に更新、次に日本語

5. **テンプレートカスタマイズ**: インストール後にユーザーが変更可能
   - テンプレートはユーザープロジェクトにコピー (シンボリックリンクではない)
   - ユーザーがコピーを所有
   - 更新には `musubi init` の再実行が必要

## テスト構造

```
tests/
├── cli.test.js             # CLI コマンドテスト
└── (将来: registry.test.js, template.test.js)
```

### テストカバレッジ要件 (憲法条項III)
- **目標**: 80% カバレッジ
- **重要パス**: CLIコマンド、エージェント検出、テンプレートコピー
- **テストファースト**: Red-Green-Blue サイクル実施

### テスト戦略
- **ユニットテスト**: registry.js 関数 (エージェント検出、フラグパース)
- **統合テスト**: 完全な `musubi init` ワークフロー
- **スナップショットテスト**: テンプレートコンテンツ検証 (将来)

## ドキュメント

- **README.md**: プロジェクト概要、クイックスタート、エージェントサポートマトリックス
- **README.ja.md**: 日本語翻訳
- **CLAUDE.md**: Claude Code 固有ガイド (テンプレート内)
- **AGENTS.md**: 汎用エージェントガイド (非Claude エージェント用)
- **GEMINI.md / QWEN.md**: エージェント固有ガイド (テンプレート内)
- **docs/Qiita/**: MUSUBI 進化に関する日本語記事
- **docs/analysis/**: フレームワーク比較と設計決定
- **steering/**: プロジェクトメモリ (structure, tech, product)

### ドキュメント原則
1. **バイリンガルファースト**: 英語がプライマリ、日本語翻訳
2. **エージェント固有**: 各エージェント用にカスタマイズされたガイド
3. **npm でバージョン管理**: README と LICENSE がパッケージに含まれる
4. **包括的な例**: すべての CLI コマンドが例付きで文書化

---

**注記**: このドキュメントは MUSUBI の実際のアーキテクチャを記述しています - 7つのAIコーディングエージェントにSDDテンプレートを配布するCLIツールです。アーキテクチャ変更を行う際はこのファイルを更新してください (例: 新しいエージェントの追加、テンプレート構造の変更)。

**最終更新日**: 2025-01-16 by @steering

### 3. デルタ仕様システム

**核心原則**: 変更追跡を通じてグリーンフィールド (0→1) とブラウンフィールド (1→n) の両方のプロジェクトをサポート。

**パターン**:
- **グリーンフィールド**: `storage/specs/` に完全な仕様で開始
- **ブラウンフィールド**: 段階的な変更のために `storage/changes/` を使用
- **変更ワークフロー**: 提案 → 影響分析 → 実装 → アーカイブ
- **トレーサビリティ**: すべての変更はデルタファイルを介して元の仕様にリンク

**関連スキル**:
- `change-impact-analyzer`: 変更影響を分析
- `orchestrator`: 変更ワークフローを調整
- `traceability-auditor`: 変更カバレッジを検証

### 4. 自動更新プロジェクトメモリ (Steering)

**核心原則**: プロジェクトコンテキスト (アーキテクチャ、技術スタック、ビジネスドメイン) は自動的に維持され、すべてのスキルによって参照されます。

**ステアリングファイル**:
- `steering/structure.md`: アーキテクチャパターン、ディレクトリ構成、命名規則
- `steering/tech.md`: 技術スタック、フレームワーク、開発ツール
- `steering/product.md`: ビジネスコンテキスト、製品目的、ターゲットユーザー

**パターン**:
- `steering`スキルがコードベース分析から初期コンテキストを生成
- スキルがアーキテクチャ決定を行う際にステアリングを更新
- すべてのスキルは作業開始前にステアリングを読む (憲法条項VI)

**自動更新トリガー**:
| 完了したスキル | 更新内容 | ステアリングファイル |
|-----------------|---------|---------------|
| system-architect | アーキテクチャパターン | structure.md |
| api-designer | API規約 | tech.md |
| database-schema-designer | DBパターン | tech.md |
| cloud-architect | インフラパターン | tech.md + structure.md |
| ui-ux-designer | UIコンポーネント構成 | structure.md |
| software-developer | 新しい依存関係 | tech.md |

---

## ディレクトリ構成

### ルートディレクトリ構造

```
musubi/
├── .claude/                      # Claude Code統合
│   ├── skills/                   # 25スキル (モデル呼び出し)
│   └── commands/                 # スラッシュコマンド (ユーザー呼び出し)
├── steering/                     # プロジェクトメモリ (自動生成)
│   ├── structure.md              # このファイル
│   ├── tech.md                   # 技術スタック
│   ├── product.md                # ビジネスコンテキスト
│   └── rules/                    # ガバナンスルール
├── templates/                    # ドキュメントテンプレート
├── orchestration/                # マルチスキル調整パターン
├── validators/                   # 品質ゲート (Pythonスクリプト)
└── storage/                      # プロジェクトデータ
    ├── specs/                    # 現在の真実 (グリーンフィールド)
    ├── changes/                  # 変更提案 (ブラウンフィールド)
    └── features/                 # フィーチャーブランチ
```

### スキルディレクトリパターン

**場所**: `.claude/skills/[skill-name]/`

**標準構造**:
```
[skill-name]/
├── SKILL.md                      # YAMLフロントマターを含むメインスキル定義
├── [domain]-guide.md             # ドメイン固有のガイドライン
├── templates/                    # スキル固有のテンプレート
└── examples/                     # リファレンスサンプル
```

**例** (system-architect):
```
system-architect/
├── SKILL.md                      # アーキテクチャスキルプロンプト
├── c4-model-guide.md             # C4図標準
├── adr-template.md               # アーキテクチャ決定記録テンプレート
└── examples/
    └── sample-design.md
```

### コマンドディレクトリパターン

**場所**: `.claude/commands/`

**目的**: SDDワークフロー用のユーザー呼び出しスラッシュコマンド

**命名規則**: `sdd-[action].md`

**カテゴリ**:
- ワークフロー: `/sdd-requirements`, `/sdd-design`, `/sdd-tasks`, `/sdd-implement`
- 変更管理: `/sdd-change-init`, `/sdd-change-apply`, `/sdd-change-archive`
- 検証: `/sdd-validate-requirements`, `/sdd-validate-design`, `/sdd-validate-traceability`
- ユーティリティ: `/sdd-list`, `/sdd-show`

### ストレージディレクトリパターン

**場所**: `storage/`

**目的**: バージョン管理されたプロジェクトデータ

**サブディレクトリ**:
1. **specs/** - グリーンフィールド仕様 (現在の真実)
   ```
   specs/
   └── [capability]/
       ├── spec.md                # EARS要件
       └── design.md              # アーキテクチャ設計
   ```

2. **changes/** - ブラウンフィールド変更追跡
   ```
   changes/
   ├── [change-id]/
   │   ├── proposal.md            # 変更提案
   │   ├── tasks.md               # 実装計画
   │   ├── design.md              # 設計更新
   │   └── impact-analysis.md     # 影響評価
   └── archive/                   # 完了した変更
   ```

3. **features/** - フィーチャーブランチ仕様
   ```
   features/
   └── [feature-id]/
       ├── requirements.md        # EARS要件
       ├── research.md            # 技術調査
       ├── design.md              # アーキテクチャ
       └── tasks.md               # 実装計画
   ```

---

## 命名規則

### スキル

**パターン**: `lowercase-hyphenated-name` (小文字ハイフン区切り)

**例**:
- `requirements-analyst`
- `system-architect`
- `site-reliability-engineer`
- `change-impact-analyzer`

**ファイル**: スキルディレクトリ内の `SKILL.md` (大文字)

### スラッシュコマンド

**パターン**: `sdd-[action].md`

**例**:
- `sdd-requirements.md`
- `sdd-validate-traceability.md`
- `sdd-change-init.md`

### ステアリングファイル

**パターン**: `lowercase.md` (英語プライマリ), `lowercase.ja.md` (日本語翻訳)

**例**:
- `structure.md` / `structure.ja.md`
- `tech.md` / `tech.ja.md`
- `product.md` / `product.ja.md`

### ドキュメントテンプレート

**パターン**: 説明的な小文字名

**例**:
- `requirements.md` (EARS要件テンプレート)
- `design.md` (C4 + ADRテンプレート)
- `tasks.md` (P-ラベル付きタスクテンプレート)
- `proposal.md` (変更提案テンプレート)

---

## オーケストレーションパターン

### パターン1: 自動選択

**ユースケース**: ユーザーが高レベルの意図を提供し、オーケストレーターが適切なスキルを選択

**フロー**:
```
ユーザー意図 → オーケストレーター分析 → スキル選択 → 実行 → 結果返却
```

**例**: "ユーザー認証の要件を作成"
→ オーケストレーターが `requirements-analyst`スキルを選択

### パターン2: シーケンシャルワークフロー

**ユースケース**: マルチステージSDDワークフロー (8ステージ)

**フロー**:
```
調査 → 要件 → 設計 → タスク → 実装 → テスト → デプロイ → モニタリング
```

**関連スキル**: オーケストレーターがシーケンシャル実行を調整

### パターン3: 並列実行

**ユースケース**: 同時実行可能な独立したタスク

**フロー**:
```
オーケストレーター → P-ラベル付きタスクに分割 → 並列実行 → 結果マージ
```

**例**: P1 (API設計), P2 (DBスキーマ), P3 (UI設計) を同時実行

### パターン4: ネストされた委譲

**ユースケース**: サブオーケストレーションを必要とする複雑なドメイン

**フロー**:
```
オーケストレーター → ドメインオーケストレーターに委譲 → 専門スキル実行
```

**例**: クラウドデプロイは`cloud-architect`に委譲され、インフラスキルを調整

### パターン5: Human-in-the-Loop

**ユースケース**: ユーザー承認を必要とする品質ゲート

**フロー**:
```
スキル実行 → 検証ゲート → ユーザー承認 → 続行/拒否
```

**例**: 実装前の憲法検証

---

## 設計決定

### ADR-001: モノリシックエージェントではなくスキルベースアーキテクチャ

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: シンプルさ (musuhiの20エージェント) と完全性 (全8SDDステージのカバレッジ) のバランスが必要。

**決定**: 明確なドメイン境界を持つ25の専門スキルを採用。

**理由**:
- モジュール性: 各スキルは独立してテスト・保守可能
- スケーラビリティ: 既存スキルに影響を与えずに新しいスキルを追加可能
- 発見可能性: YAMLトリガータームが自動スキル選択を可能に
- ガバナンス: スキルは憲法条項に対して個別に検証可能

**結果**:
- ポジティブ: 明確な関心の分離、保守の容易性
- ネガティブ: オーケストレーションの複雑さ増加 (オーケストレータースキルで軽減)

### ADR-002: スキルとしての憲法ガバナンス

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: すべてのスキルにわたって一貫して品質ゲートを強制する必要がある。

**決定**: 検証のための専用`constitution-enforcer`スキルを作成。

**理由**:
- 一元化: 憲法準拠の単一真実源
- 自動化: 検証は手動ではなく自動化
- トレーサビリティ: すべての検証はログ記録され監査可能
- 分離: 強制ロジックは実装スキルから分離

**結果**:
- ポジティブ: 一貫した強制、手動チェック不要
- ネガティブ: 追加のスキル保守 (受け入れ可能なトレードオフ)

### ADR-003: 静的ドキュメントではなく自動更新ステアリング

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: プロジェクトコンテキスト (アーキテクチャ、技術スタック) は時間とともに変化し、手動更新はエラーが発生しやすい。

**決定**: `steering`スキルがスキル実行に基づいてコンテキストを自動更新。

**理由**:
- 正確性: プロジェクトメモリがコードベースと同期を保つ
- 鮮度: 常に現在の状態を反映
- 自己文書化: アーキテクチャ決定が自動的にキャプチャ
- 準拠: 憲法条項VI (プロジェクトメモリ) をサポート

**結果**:
- ポジティブ: 常に正確、陳腐化したドキュメントなし
- ネガティブ: 慎重なトリガー設計が必要 (更新ルールで軽減)

---

## 統合ポイント

### Claude Code Skills API

**統合タイプ**: モデル呼び出しスキル

**メカニズム**:
- スキルは`.claude/skills/[name]/SKILL.md`で定義
- YAMLフロントマターに自動発見用のトリガータームを含む
- Claude Codeはユーザー意図分析に基づいてスキルを呼び出す

**例**:
```yaml
---
name: requirements-analyst
description: |
  要件分析、仕様書作成、ユーザーストーリー作成にこのスキルを使用します。

  トリガータム: requirements, specifications, user stories, acceptance criteria, EARS format
allowed-tools: [Read, Write, Glob, Grep]
---
```

### MCPサーバー

**統合タイプ**: スキルによる直接ツール呼び出し

**利用可能なMCPサーバー**:
- **context7**: 最新のライブラリドキュメンテーション
- **ide**: VS Code診断、Jupyterカーネル実行

**使用パターン**:
```
スキル → mcp__context7__get-library-docs("/vercel/next.js") → 最新Next.jsドキュメント
```

**専用MCPスキルなし**: スキルはMCPツールを直接呼び出します (理由はMCP-MANAGEMENT-ANALYSIS.mdを参照)

### Gitワークフロー

**統合タイプ**: すべてのアーティファクトのバージョン管理

**パターン**:
- すべての仕様、設計、タスクはGit追跡
- 変更提案はGitブランチ
- トレーサビリティはGit履歴を通じて維持
- 憲法検証はpre-commitフックとして実行

---

## 品質ゲート

### Phase -1 Gates (実装前)

**強制者**: `constitution-enforcer`スキル

**ゲート**:
1. **シンプリシティゲート**: ≤3プロジェクト、推測的機能なしを検証
2. **抽象化禁止ゲート**: 不要なラッパーをチェック
3. **統合ファーストゲート**: 実サービステストを保証
4. **EARS準拠ゲート**: すべての要件がEARSフォーマットを使用することを検証
5. **トレーサビリティゲート**: 100%要件カバレッジを確認
6. **ステアリング整合性ゲート**: プロジェクトメモリとの一貫性を検証

**トリガー**: 実装開始前

### 検証スクリプト

**場所**: `validators/`

**スクリプト**:
- `ears-format.py`: EARS構文検証
- `constitutional.py`: Phase -1 Gates強制
- `coverage.py`: 要件カバレッジ分析
- `traceability.py`: トレーサビリティマトリックス検証
- `delta-format.py`: デルタ仕様検証
- `consistency.py`: クロスアーティファクト一貫性

**実行**: 手動またはCI/CD経由で実行可能

---

## 進化と保守

### 新しいスキルの追加

1. スキルディレクトリを作成: `.claude/skills/[new-skill-name]/`
2. YAMLフロントマターでSKILL.mdを作成
3. 発見用のトリガータームを追加
4. オーケストレーター選択マトリックスを更新
5. steering/structure.md (このファイル) に追加
6. 必要に応じて憲法検証を更新

### アーキテクチャパターンの変更

1. 変更提案を通じて提案 (storage/changes/)
2. `change-impact-analyzer`スキルで影響を分析
3. 影響を受けるスキルを更新
4. steering/structure.mdを更新
5. `constitution-enforcer`で検証
6. 提案をアーカイブ

### パターンの非推奨化

1. steering/structure.mdで非推奨としてマーク
2. 移行パスを提供
3. 新しいパターンを使用するようにスキルを更新
4. 移行期間後に非推奨パターンを削除

---

## 参考文献

- **ブループリント**: Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md
- **プロジェクト計画**: PROJECT-PLAN-MUSUBI.md
- **スキルインベントリ**: SKILLS-AUDIT-REPORT.md
- **MCP分析**: MCP-MANAGEMENT-ANALYSIS.md
- **憲法ガバナンス**: steering/rules/constitution.md (作成予定)
- **SDDワークフロー**: steering/rules/workflow.md (作成予定)

---

**ドキュメントオーナー**: steeringスキル
**保守者**: 自動更新ルール + 手動レビュー
**レビュー頻度**: 月次またはアーキテクチャ変更発生時
