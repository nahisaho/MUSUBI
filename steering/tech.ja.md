# MUSUBI - 技術スタックと開発ツール

**バージョン**: 1.0
**最終更新**: 2025-11-16
**ステータス**: 計画フェーズ

---

## 概要

MUSUBIは、Claude Code Skills APIを中心とした**軽量でMarkdownベースの技術スタック**で構築されています。アーキテクチャは、シンプルさ、移植性、ゼロベンダーロックインを優先しながら、包括的な仕様駆動開発ワークフローをサポートします。

---

## 主要技術スタック

### コアプラットフォーム

**Claude Code Skills API**
- **バージョン**: 最新 (2025-11-16時点)
- **目的**: スキル定義とオーケストレーションの主要プラットフォーム
- **フォーマット**: YAMLフロントマターを含むMarkdownファイル
- **呼び出し**: モデル呼び出し (自動スキル選択) + ユーザー呼び出し (スラッシュコマンド)
- **許可ツール**: Read, Write, Bash, Glob, Grep, TodoWrite
- **スキル場所**: `.claude/skills/[skill-name]/SKILL.md`
- **コマンド場所**: `.claude/commands/sdd-*.md`

**理由**: Claude Codeとのネイティブ統合、外部依存関係ゼロ、AIアシスタント間での移植性

### 仕様とドキュメントフォーマット

**Markdown**
- **バージョン**: CommonMark + GFM (GitHub Flavored Markdown)
- **目的**: すべての仕様、設計、ドキュメント
- **使用する拡張機能**:
  - テーブル (トレーサビリティマトリックス、カバレッジレポート用)
  - タスクリスト (実装計画用)
  - 構文ハイライト付きコードブロック
  - YAMLフロントマター (メタデータ用)
- **リンティング**: markdownlint (厳格モード)

**EARSフォーマット** (Easy Approach to Requirements Syntax)
- **目的**: 構造化された要件記法
- **パターン**:
  - イベント駆動: `WHEN [event], the [system] SHALL [response]`
  - 状態駆動: `WHILE [state], the [system] SHALL [response]`
  - 望ましくない動作: `IF [error], THEN the [system] SHALL [response]`
  - オプション機能: `WHERE [feature enabled], the [system] SHALL [response]`
  - 普遍的: `The [system] SHALL [requirement]`
- **検証**: `validators/ears-format.py`

**理由**: 人間が読みやすい、バージョン管理可能、ツール非依存、普遍的な互換性

### 設定フォーマット

**YAML**
- **バージョン**: YAML 1.2
- **目的**: スキルフロントマター、設定ファイル、CI/CDパイプライン
- **使用方法**:
  - スキル定義 (name, description, trigger terms, allowed-tools)
  - GitHub Actionsワークフロー
  - テンプレートメタデータ
- **リンティング**: yamllint

**理由**: 人間が読みやすい、広くサポート、構造化データのクリーンな構文

---

## 開発ツール

### バリデーター用の主要言語

**Python 3.11+**
- **目的**: 検証スクリプト、CLIツール (オプション)
- **パッケージマネージャー**: uv (推奨) またはPoetry
- **リンティング**: Ruff (高速、包括的)
- **フォーマット**: Black (PEP 8準拠)
- **型チェック**: mypy (厳格モード)
- **テストフレームワーク**: pytest
- **コードカバレッジ**: pytest-cov (目標: ≥80%)

**主要ライブラリ**:
- `pyyaml`: YAML解析
- `click`または`typer`: CLIフレームワーク (CLIツールを構築する場合)
- `jsonschema`: JSON/YAMLスキーマ検証
- `pytest`: テストフレームワーク

**理由**: 普遍的な言語、豊富なエコシステム、検証とCLIに優れたツール

### バージョン管理

**Git + GitHub**
- **バージョン**: Git 2.40+
- **ホスティング**: GitHub.com (オープンソース)
- **ブランチ戦略**:
  - `main`: 保護、本番環境対応
  - `feature/[feature-id]`: 機能開発
  - `change/[change-id]`: ブラウンフィールド変更
  - `release/v[x.y.z]`: リリース準備
- **コミット規約**: Conventional Commits 1.0.0
  - `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- **フック**: pre-commit (バリデーターを実行)

**使用するGitHub機能**:
- Issues: バグ追跡、機能リクエスト
- Pull Requests: コードレビュー、憲法検証
- Discussions: コミュニティQ&A、RFC
- Actions: CI/CDパイプライン
- Releases: 変更履歴付きバージョンリリース
- GitHub Pages: ドキュメントホスティング

**理由**: 業界標準、優れたコラボレーション機能、オープンソースに無料

### 統合開発環境

**VS Code**
- **バージョン**: 1.80+
- **必須拡張機能**:
  - Claude Code (Anthropic): プライマリAIアシスタント
  - markdownlint: Markdownリンティング
  - YAML: YAML構文サポート
  - Python: Python開発
  - GitLens: Git履歴可視化
- **オプション拡張機能**:
  - Prettier: コードフォーマット
  - Error Lens: インラインエラー表示

**代替IDE** (Claude Codeサポートあり):
- JetBrains IDEs (IntelliJ, PyCharm): Claude Codeプラグイン経由
- Cursor: 組み込みClaude統合
- Zed: 実験的サポート

**理由**: Claude Codeの主要プラットフォーム、拡張可能、無料、クロスプラットフォーム

---

## フレームワークと標準

### Claude Code Skills API標準

**YAMLフロントマター構造**:
```yaml
---
name: [skill-name]                    # ハイフン区切りの小文字
description: |                        # 最大1024文字
  [簡潔な説明]
  [AI発見用の10-20トリガータム]
  [主要機能]
  [使用ケース]
allowed-tools: [Read, Write, Bash]   # 機能制限
---
```

**トリガータムのベストプラクティス**:
- 10-20の関連キーワードを含める
- ドメイン語彙をカバー (例: "API, REST, GraphQL, OpenAPI")
- アクション動詞を含める (例: "design, create, generate, validate")
- 成果物タイプを参照 (例: "specification, architecture, diagram")

**スキルタイプ別ツール制限**:
| スキルタイプ | 許可ツール |
|-----------|---------------|
| 読み取り専用 (レビュワー、監査者) | [Read, Glob, Grep] |
| 設計 (アーキテクト、デザイナー) | [Read, Write, Glob] |
| 開発 (開発者、テスター) | [Read, Write, Bash, Glob, Grep] |
| オーケストレーション | [Read, Write, Bash, Glob, Grep, TodoWrite] |

### 憲法ガバナンスフレームワーク

**9つの憲法条項** (不変):
1. ライブラリファーストの原則
2. CLIインターフェース義務
3. テストファーストの命令
4. EARS要件フォーマット
5. トレーサビリティ義務
6. プロジェクトメモリ
7. シンプリシティゲート
8. 抽象化禁止ゲート
9. 統合ファーストテスティング

**Phase -1 Gates** (実装前検証):
- シンプリシティゲート: ≤3プロジェクト、将来の備えなし
- 抽象化禁止ゲート: 不要なラッパーなし
- 統合ファーストゲート: 実サービス、モックなし
- EARS準拠ゲート: すべての要件がEARSパターンを使用
- トレーサビリティゲート: 100%要件カバレッジ
- ステアリング整合性ゲート: プロジェクトメモリとの一貫性

**強制**: `constitution-enforcer`スキル + `validators/constitutional.py`

### マルチエージェントオーケストレーションパターン

**AG2 (AutoGen v2) ベース**:
1. **自動選択**: 意図分析 → スキル選択 → 実行
2. **シーケンシャル**: 線形ワークフロー (調査 → 要件 → 設計 → ...)
3. **並列**: P-ラベル付きタスクを同時実行
4. **ネストされた委譲**: 複雑なドメイン用のサブオーケストレーター
5. **Human-in-the-Loop**: ユーザー承認が必要な検証ゲート

**スキル依存関係管理**:
- `orchestration/dependency-chains.md`で定義
- 例: `requirements-analyst` → `system-architect` → `software-developer`
- 並列実行: `api-designer` || `database-schema-designer` || `ui-ux-designer`

---

## インフラとDevOps

### CI/CDプラットフォーム

**GitHub Actions**
- **目的**: 自動テスト、検証、デプロイメント
- **ワークフロー**:
  - `ci.yml`: リンティング、ユニットテスト、EARS検証 (PR時)
  - `integration.yml`: 統合テスト、トレーサビリティチェック (マージ時)
  - `release.yml`: ドキュメントビルド、GitHubリリース (タグ時)
- **ランナー**: ubuntu-latest (無料ティア)
- **シークレット管理**: GitHub Secrets (APIキー、デプロイトークン)

**パイプラインステージ**:
```
PR作成:
  → リンティング (Ruff, markdownlint, yamllint)
  → ユニットテスト (pytest, coverage ≥80%)
  → EARSフォーマット検証 (validators/ears-format.py)
  → 憲法検証 (validators/constitutional.py)
  → トレーサビリティチェック (validators/traceability.py)

mainにマージ:
  → 統合テスト (Bashスクリプト)
  → ドキュメントビルド (MkDocs/Docusaurus)
  → カバレッジレポート (Codecovにアップロード)

タグ作成 (v*.*.*)
  → リリースパッケージビルド
  → 変更履歴生成 (conventional commits)
  → GitHubリリース作成
  → ドキュメントデプロイ (GitHub Pages)
```

**外部CI/CD不使用**: GitHub Actionsのみ (オープンソースに無料)

### ドキュメントプラットフォーム

**オプション** (Phase 1で決定):

**オプションA: MkDocs**
- **テーマ**: Material for MkDocs
- **プラグイン**: search, tags, git-revision-date
- **ホスティング**: GitHub Pages
- **ビルドコマンド**: `mkdocs build`
- **長所**: Pythonネイティブ、Markdownベース、優れた検索
- **短所**: 静的サイトジェネレーターと比較してカスタマイズが限定的

**オプションB: Docusaurus**
- **バージョン**: 3.0+
- **フレームワーク**: React
- **ホスティング**: GitHub PagesまたはVercel
- **ビルドコマンド**: `npm run build`
- **長所**: 機能豊富、バージョニング、i18nサポート
- **短所**: Node.js依存、より複雑なセットアップ

**決定基準**: チームの慣れ、機能要件、保守オーバーヘッド

**コンテンツ構造**:
```
docs/
├── index.md                      # ランディングページ
├── getting-started.md            # クイックスタートガイド
├── user-guide/
│   ├── workflow.md               # 8ステージSDDワークフロー
│   ├── constitutional-governance.md
│   └── change-management.md      # デルタ仕様
├── skill-reference/              # 25スキル
│   ├── orchestrator.md
│   ├── requirements-analyst.md
│   └── ...
├── examples/
│   ├── greenfield-project.md
│   └── brownfield-change.md
└── api/
    ├── ears-format.md
    └── validator-api.md
```

### ホスティング (ステージング/デモ)

**ドキュメント**: GitHub Pages (無料、自動デプロイメント)
**デモインスタンス** (オプション): RailwayまたはRender (無料ティア)
**モニタリング**: シンプルな稼働チェック (UptimeRobot無料ティア)

**本番ホスティングなし**: セルフホスト型ツール、ユーザーはローカルで実行

---

## MCPサーバー統合

### 利用可能なMCPサーバー

**Context7 MCP**
- **プロバイダー**: Context7.ai
- **目的**: 最新のライブラリドキュメンテーション
- **ツール**:
  - `mcp__context7__resolve-library-id`: ライブラリ名をContext7 IDに解決
  - `mcp__context7__get-library-docs`: 最新ドキュメントを取得
- **使用**: api-designer, software-developer, technical-writerスキル
- **例**:
  ```
  mcp__context7__get-library-docs("/vercel/next.js", topic="api routes", tokens=5000)
  → 返却: 最新のNext.js APIルートパターン
  ```

**IDE MCP**
- **プロバイダー**: VS Code
- **目的**: 診断、コード実行
- **ツール**:
  - `mcp__ide__getDiagnostics`: TypeScript/リンターエラーを取得
  - `mcp__ide__executeCode`: JupyterカーネルでPythonコードを実行
- **使用**: site-reliability-engineer, ai-ml-engineer, test-engineerスキル
- **例**:
  ```
  mcp__ide__getDiagnostics()
  → 返却: VS Code診断のリスト (エラー、警告)
  ```

### 将来のMCPサーバー (オプション)

**Microsoft Learn MCP**
- **目的**: Microsoftドキュメント (Azure, .NETなど)
- **スキル**: technical-writer, cloud-architect

**Azure MCP**
- **目的**: Azureリソース管理
- **スキル**: cloud-architect, devops-engineer

**GitHub MCP**
- **目的**: リポジトリ操作 (イシュー、PR、ワークフロー)
- **スキル**: devops-engineer, software-developer

**専用MCPマネジメントスキル不使用**: スキルは直接MCPツールを呼び出します (理由はMCP-MANAGEMENT-ANALYSIS.mdを参照)

---

## テストと品質保証

### テストスタック

**Pythonバリデーター** (validators/):
- **フレームワーク**: pytest 7.0+
- **カバレッジ**: pytest-cov (目標: ≥80%)
- **フィクスチャ**: 共有テストセットアップ用のconftest.py
- **モック**: 外部依存関係用のunittest.mock

**検証スクリプト**:
| スクリプト | 目的 | 呼び出し |
|--------|---------|------------|
| `ears-format.py` | EARS構文検証 | `python validators/ears-format.py [file]` |
| `constitutional.py` | Phase -1 Gates強制 | `python validators/constitutional.py` |
| `coverage.py` | 要件カバレッジ分析 | `python validators/coverage.py` |
| `traceability.py` | トレーサビリティマトリックス検証 | `python validators/traceability.py` |
| `delta-format.py` | デルタ仕様検証 | `python validators/delta-format.py [file]` |
| `consistency.py` | クロスアーティファクト一貫性 | `python validators/consistency.py` |

**統合テスト** (Bashスクリプト):
- エンドツーエンドワークフローテスト (調査 → モニタリング)
- スキル呼び出しテスト (オーケストレーター選択ロジック)
- 変更管理ワークフローテスト (init → apply → archive)

### コード品質ツール

**リンティング**:
- **Python**: Ruff (flake8, isort, Blackを置換)
  - 設定: `pyproject.toml`
  - ルール: E501 (行長) 以外のすべてのルールを有効化
- **Markdown**: markdownlint
  - 設定: `.markdownlint.json`
  - ルール: 厳格モード (末尾スペースなし、一貫した見出し)
- **YAML**: yamllint
  - 設定: `.yamllint`
  - ルール: 一貫したインデント、末尾スペースなし

**フォーマット**:
- **Python**: Black (PEP 8)
  - 行長: 100文字
  - 設定: `pyproject.toml`
- **Markdown**: Prettier (オプション)
  - 設定: `.prettierrc`

**型チェック**:
- **Python**: mypy (厳格モード)
  - 設定: `pyproject.toml`
  - 厳格フラグ: `--strict`, `--warn-unused-ignores`

### 品質ゲート

**Pre-Commitフック** (pre-commitフレームワーク経由):
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: ruff
        name: Ruffリンティング
        entry: ruff check
        language: system
        types: [python]
      - id: markdownlint
        name: Markdownリンティング
        entry: markdownlint
        language: node
        types: [markdown]
      - id: ears-validation
        name: EARSフォーマット検証
        entry: python validators/ears-format.py
        language: system
        types: [markdown]
```

**CI品質ゲート** (マージ前に合格必須):
- すべてのリンターが合格 (終了コード0)
- すべてのユニットテストが合格
- コードカバレッジ ≥80%
- EARSフォーマット検証が合格
- 憲法検証が合格
- 重大なセキュリティ脆弱性なし (Dependabot経由)

---

## 技術的制約

### プラットフォーム依存関係

**必須**:
- Python 3.11+ (バリデーター、CLI用)
- Git 2.40+ (バージョン管理)
- Claude Code (プライマリAIアシスタント)
- VS Code 1.80+ (推奨IDE)

**オプション**:
- Node.js 18+ (ドキュメント用にDocusaurusを使用する場合)
- Docker (再現可能な開発環境用)

### パフォーマンス要件

**スキル呼び出し**:
- スキル選択: <2秒 (オーケストレーター分析)
- EARS検証: <1秒 / 100要件
- トレーサビリティチェック: <5秒 / 1000行コードベース

**検証スクリプト**:
- 憲法検証: <3秒
- カバレッジ分析: <5秒
- デルタ仕様検証: <2秒

**ドキュメントビルド**:
- MkDocs: <10秒 / フルサイトビルド
- Docusaurus: <30秒 / フルサイトビルド

### ストレージ要件

**プロジェクトリポジトリ**:
- 典型的なプロジェクト: <100 MB (仕様、設計、タスク)
- 大規模プロジェクト: <500 MB (サンプル実装を含む)
- バイナリファイルなし (MarkdownとコードのみData Transfer Out)

**ドキュメントサイト**:
- 静的アセット: <50 MB
- GitHub Pagesでホスティング (1 GB制限、100 GB帯域幅/月)

---

## セキュリティ考慮事項

### バージョン管理にシークレットを含めない

**ポリシー**: シークレット、APIキー、資格情報を決してコミットしない
**強制**:
- `.gitignore`に一般的なシークレットパターンを含む
- Pre-commitフックでシークレットをスキャン (オプション: git-secrets)
- GitHub Secret Scanningを有効化

**Gitで許容**:
- 公開設定 (YAML, Markdown)
- テンプレートファイル (実際の資格情報なし)
- サンプルデータ (合成、機密性なし)

### MCPサーバーセキュリティ

**信頼モデル**: MCPサーバーは信頼できる (Context7, IDE)
**データ感度**: MCPサーバーに機密データを渡さない
**APIキー**: IDE設定に保存、プロジェクトファイルには含めない

### 依存関係セキュリティ

**Python依存関係**:
- `requirements.txt`または`pyproject.toml`でバージョン固定
- Dependabotを有効化 (自動セキュリティ更新)
- 定期的なセキュリティ監査 (GitHub Security Advisories)

**Node.js依存関係** (Docusaurusを使用する場合):
- `package-lock.json`でバージョン固定
- CI/CDでnpm auditを実行
- Dependabotを有効化

---

## 技術進化戦略

### 新技術の追加

**採用基準**:
1. 特定のギャップを解決 (冗長でない)
2. 広く採用されている (実験的でない)
3. 積極的に保守されている (放棄されていない)
4. 既存スタックと互換性がある (競合なし)
5. ADR経由で承認 (Architecture Decision Record)

**プロセス**:
1. GitHub Discussionで提案
2. ADRを作成 (steering/rules/adr-NNN-[title].md)
3. フィーチャーブランチでプロトタイプ
4. チームとレビュー (承認必要)
5. steering/tech.md (このファイル) を更新
6. CI/CDに統合

### 技術の非推奨化

**非推奨化基準**:
1. 保守されなくなった (セキュリティリスク)
2. より良い代替が利用可能
3. 技術的負債を引き起こしている
4. 将来のロードマップと互換性がない

**プロセス**:
1. 非推奨化を発表 (3ヶ月前予告)
2. 移行パスを提供 (ドキュメント + 自動化)
3. steering/tech.mdを更新 (非推奨としてマーク)
4. CI/CDから削除 (移行期間後)
5. 歴史的ADRをアーカイブ

---

## 技術決定記録

### TDR-001: プライマリプラットフォームとしてのClaude Code Skills API

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: スキル定義とオーケストレーション用のプラットフォームを選択する必要がある。

**決定**: Markdown + YAMLを使用したClaude Code Skills APIを使用。

**理由**:
- Claude Codeとのネイティブ統合 (プライマリAIアシスタント)
- AIアシスタント間での移植性 (Markdownは普遍的)
- 外部依存関係ゼロ (データベース、API不要)
- 人間が読める仕様 (バージョン管理可能)

**検討した代替案**:
- Pythonフレームワーク (AG2): より複雑、移植性が低い
- プロプライエタリIDEプラグイン: ベンダーロックイン
- カスタムDSL: 学習曲線が急

**結果**:
- ポジティブ: シンプル、移植可能、保守可能
- ネガティブ: テキストベースの仕様に限定 (SDDには許容可能)

### TDR-002: バリデーター用のPython 3.11+

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: 検証とCLI用のスクリプト言語が必要。

**決定**: 最新ツール (uv, Ruff, pytest) を使用したPython 3.11+を使用。

**理由**:
- 普遍的な言語 (ほとんどの開発者がPythonを知っている)
- 検証用の豊富なエコシステム (jsonschema, pytest)
- 優れたCLIフレームワーク (Click, Typer)
- 高速ツール (Ruff, uv)

**検討した代替案**:
- TypeScript/Node.js: CLIには不向き、より複雑なセットアップ
- Bash: 複雑な検証ロジックには不十分
- Go: 学習曲線が急、アクセスが難しい

**結果**:
- ポジティブ: 慣れた言語、豊富なエコシステム、高速ツール
- ネガティブ: ランタイム依存 (Pythonの普及により軽減)

### TDR-003: 要件用のEARSフォーマット

**ステータス**: 承認済み
**日付**: 2025-11-16

**背景**: テスト可能性とトレーサビリティを確保するための要件の構造化フォーマットが必要。

**決定**: 必須フォーマットとしてEARS (Easy Approach to Requirements Syntax) を採用。

**理由**:
- 業界標準 (NASA, DoD, 安全重視システム)
- テスト可能なパターン (明確なトリガー → 応答)
- 機械解析可能 (バリデーターが要件を抽出可能)
- 人間が読める (プロプライエタリ構文なし)

**検討した代替案**:
- 自由形式テキスト: テスト不可、トレーサビリティなし
- ユーザーストーリー (As a...I want...So that...): より精度が低い
- 形式手法 (Z, TLA+): ほとんどのプロジェクトには複雑すぎる

**結果**:
- ポジティブ: テスト可能、追跡可能、標準化
- ネガティブ: 学習曲線 (テンプレートとサンプルで軽減)

---

## 参考文献

- **Claude Code Skills API**: https://docs.anthropic.com/claude/claude-code/skills
- **EARSフォーマット**: steering/rules/ears-format.md (作成予定)
- **憲法ガバナンス**: steering/rules/constitution.md (作成予定)
- **MCP分析**: MCP-MANAGEMENT-ANALYSIS.md
- **プロジェクト計画**: PROJECT-PLAN-MUSUBI.md
- **ブループリント**: Ultimate-SDD-Tool-Blueprint-v3-25-Skills.md

---

**ドキュメントオーナー**: steeringスキル
**保守者**: 自動更新ルール + 手動レビュー
**レビュー頻度**: 四半期ごとまたは技術変更発生時
