# Serena vs MUSUBI Steering - 機能比較と適用可能性分析

## 調査日: 2025-11-22

## 1. Serenaの主要機能

### 1.1 プロジェクト管理機能

**`.serena/project.yml`**
- プロジェクト名
- 対応言語リスト
- 除外ツール設定
- 初期プロンプト
- 読み取り専用モード
- エンコーディング設定

### 1.2 メモリシステム (`.serena/memories/`)

**永続的なプロジェクト知識管理:**
- `serena_core_concepts_and_architecture.md` - アーキテクチャ概念
- `serena_repository_structure.md` - リポジトリ構造
- `suggested_commands.md` - 推奨コマンド
- `adding_new_language_support_guide.md` - 言語追加ガイド

**特徴:**
- Markdown形式で保存
- プロジェクト固有の知識
- AIエージェントがオンデマンドで読み込み
- 会話間で永続化

### 1.3 高度なツールセット

**言語サーバー統合 (LSP):**
- シンボル検索 (`find_symbol`)
- 参照検索 (`find_referencing_symbols`, `find_referencing_code_snippets`)
- シンボルベース編集 (`insert_after_symbol`, `replace_symbol_body`)
- 30以上の言語対応

**メモリツール:**
- `write_memory` - メモリ書き込み
- `read_memory` - メモリ読み込み
- `list_memories` - メモリ一覧
- `delete_memory` - メモリ削除

**プロジェクト管理:**
- `activate_project` - プロジェクト切り替え
- `onboarding` - プロジェクト構造分析
- `initial_instructions` - 初期指示取得

**メタ認知ツール:**
- `think_about_collected_information` - 情報完全性評価
- `think_about_task_adherence` - タスク進捗確認
- `think_about_whether_you_are_done` - 完了判定

### 1.4 コンテキスト・モードシステム

**動的ツール切り替え:**
- コンテキストに応じてツールセットを変更
- モード切り替えによる動作変更
- プロジェクト固有の設定

## 2. MUSUBI Steeringの現状

### 2.1 現在の実装

**ディレクトリ構造:**
```
steering/
├── product.md / product.ja.md     - ビジネスコンテキスト
├── structure.md / structure.ja.md - アーキテクチャパターン
├── tech.md / tech.ja.md           - 技術スタック
├── rules/                         - 憲法・ルール
└── templates/                     - テンプレート
```

**特徴:**
- 静的なMarkdownドキュメント
- 英語・日本語の両バージョン必須
- エージェントが読み込んで参照
- 手動更新が中心

### 2.2 課題

1. **動的更新の欠如**: コードベース変更時の自動更新なし
2. **メモリ管理なし**: 会話間の知識永続化機能なし
3. **シンボルレベル分析なし**: ディレクトリ/ファイルレベルのみ
4. **プロジェクト切り替え未対応**: 単一プロジェクト前提

## 3. Serena機能の適用可能性評価

### 3.1 高優先度 (即座に適用可能)

#### ✅ メモリシステム

**実装案:**
```
steering/
├── memories/                      # 新規追加
│   ├── architecture_decisions.md # ADR的な記録
│   ├── development_workflow.md   # 開発フロー
│   ├── domain_knowledge.md       # ドメイン知識
│   └── suggested_commands.md     # 推奨コマンド
```

**メリット:**
- プロジェクト固有の知識を蓄積
- 会話間で知識を維持
- エージェント間で共有可能
- 学習・成長する仕組み

**実装方法:**
1. `steering/memories/` ディレクトリ作成
2. steering エージェントにメモリ管理機能追加
3. read_memory, write_memory コマンド実装
4. 他エージェントからメモリ参照機能

#### ✅ プロジェクト設定ファイル

**実装案:**
```
steering/
├── project.yml                    # 新規追加
│   ├── project_name
│   ├── languages: [typescript, python]
│   ├── frameworks: [react, fastapi]
│   ├── excluded_patterns
│   └── custom_rules
```

**メリット:**
- プロジェクト設定の明示化
- エージェント動作のカスタマイズ
- 除外パターンの管理
- メタデータの一元管理

### 3.2 中優先度 (段階的導入)

#### 🔶 オンボーディング機能

**実装案:**
```
musubi onboard
→ プロジェクト構造分析
→ 技術スタック検出
→ steering初期ドキュメント生成
→ memoriesの初期化
```

**メリット:**
- 新規プロジェクトへの素早い適用
- 自動分析による正確性向上
- 初期設定の標準化

**実装ステップ:**
1. コードベース分析ツール開発
2. 技術スタック検出ロジック
3. テンプレート自動生成
4. CLI統合 (`musubi-init` 拡張)

#### 🔶 自動更新・乖離検出

**実装案:**
```
musubi steering-sync
→ コードベース変更検出
→ steeringドキュメントとの差分分析
→ 更新提案
→ (ユーザー承認後) ドキュメント更新
```

**メリット:**
- ドキュメントの鮮度維持
- 手動更新の負担軽減
- コードとドキュメントの同期

### 3.3 低優先度 (将来的検討)

#### ⚪ LSP統合

**課題:**
- 複雑な実装 (30言語サポート)
- 依存関係の増加
- メンテナンスコスト

**代替案:**
- Grep/Globツールで十分カバー可能
- 必要に応じて言語別に段階導入

#### ⚪ マルチプロジェクト対応

**現状:**
- MUSUBIは単一プロジェクト想定

**将来的に:**
- モノレポ対応時に検討
- サブプロジェクト管理

## 4. 推奨実装ロードマップ

### Phase 1: メモリシステム導入 (v0.2.0)

**目標:** 会話間で知識を永続化

**実装:**
1. `steering/memories/` ディレクトリ構造
2. steering エージェントにメモリ管理機能
3. 基本的なメモリCRUD操作
4. 他エージェントからのメモリ参照

**成果物:**
- メモリ管理ドキュメント
- メモリテンプレート
- 使用ガイド

### Phase 2: プロジェクト設定 (v0.2.1)

**目標:** プロジェクト設定の標準化

**実装:**
1. `steering/project.yml` スキーマ定義
2. 設定読み込み機能
3. エージェント動作のカスタマイズ
4. バリデーション機能

### Phase 3: オンボーディング自動化 (v0.3.0)

**目標:** 新規プロジェクトへの迅速適用

**実装:**
1. コードベース分析ツール
2. 技術スタック検出
3. 自動ドキュメント生成
4. `musubi onboard` CLI コマンド

### Phase 4: 自動更新・同期 (v0.4.0)

**目標:** ドキュメントの鮮度維持

**実装:**
1. 変更検出機構
2. 差分分析ロジック
3. 更新提案生成
4. `musubi steering-sync` CLI

## 5. 具体的な実装例

### 5.1 メモリシステム

**ファイル構造:**
```
steering/
├── memories/
│   ├── README.md                      # メモリシステム説明
│   ├── architecture_decisions.md     # ADR
│   ├── development_workflow.md       # 開発フロー
│   ├── domain_knowledge.md           # ドメイン知識
│   ├── suggested_commands.md         # 推奨コマンド
│   └── lessons_learned.md            # 学習内容
```

**steering エージェント拡張:**
```markdown
## Memory Management Commands

### Write Memory
📝 新しい知識をメモリに記録:
- Architecture Decision: 重要な設計決定
- Development Workflow: 開発プロセス
- Domain Knowledge: ビジネスロジック
- Lessons Learned: 過去の教訓

### Read Memory
📖 既存のメモリを参照して、過去の決定や知識を確認

### List Memories
📋 利用可能なすべてのメモリを一覧表示

### Update Memory
✏️ 既存のメモリを更新・改訂
```

**使用例:**
```
User: このプロジェクトで使用している認証方式は？

Agent: メモリを確認します...
[read_memory: domain_knowledge.md]

このプロジェクトではJWT + Refresh Tokenによる認証を使用しています。
詳細は steering/memories/domain_knowledge.md に記録されています。
```

### 5.2 project.yml スキーマ

```yaml
# steering/project.yml
project_name: "musubi-sdd"

# Project metadata
description: "Ultimate Specification Driven Development Tool"
version: "0.1.7"

# Supported languages
languages:
  - typescript
  - javascript
  - python
  - markdown

# Frameworks and libraries
frameworks:
  - name: "Node.js"
    version: ">=18.0.0"
  - name: "Jest"
    purpose: "testing"

# Project structure conventions
conventions:
  architecture_pattern: "CLI Tool with Agent System"
  directory_structure: "src/agents, src/templates"
  naming_convention: "kebab-case for files, camelCase for code"

# Steering configuration
steering:
  auto_update: false          # 自動更新の有効化
  update_frequency: "weekly"  # 更新頻度
  
  # 除外パターン
  excluded_paths:
    - "node_modules/**"
    - "dist/**"
    - ".git/**"
    - "References/**"
  
  # メモリ設定
  memories:
    max_size_kb: 100          # メモリファイルの最大サイズ
    retention_days: 90        # 古いメモリの保持期間

# Agent configuration
agents:
  default_language: "ja"      # デフォルト言語
  bilingual_output: true      # 英語・日本語両方生成
  
# Custom rules
custom_rules:
  - "All agents must implement gradual output pattern"
  - "Files >300 lines must be split into parts"
  - "Always generate both English and Japanese versions"
```

### 5.3 オンボーディング機能

**CLI コマンド:**
```bash
musubi onboard [directory]

Options:
  --auto-approve    自動承認モード
  --skip-memories   メモリ初期化をスキップ
  --language <lang> ドキュメント言語 (en/ja/both)
```

**実行フロー:**
```
1. プロジェクト構造分析
   → ディレクトリツリー走査
   → package.json / pyproject.toml 検出
   
2. 技術スタック検出
   → 依存関係分析
   → フレームワーク特定
   
3. steering ドキュメント生成
   → structure.md / structure.ja.md
   → tech.md / tech.ja.md
   → product.md / product.ja.md
   
4. project.yml 生成
   → 検出した情報を元に設定
   
5. memories 初期化
   → 初期メモリファイル作成
   → テンプレート配置
   
6. 完了報告
   → 生成ファイル一覧
   → 次のステップ案内
```

## 6. 実装優先順位の根拠

### なぜメモリシステムが最優先か

1. **即座に価値提供**
   - 追加の依存関係不要
   - Markdown形式で既存ツールと親和性高い
   - 実装が比較的シンプル

2. **エージェントの能力向上**
   - 会話間で知識を維持
   - プロジェクト固有の決定を記録
   - 学習・成長する仕組み

3. **他機能の基盤**
   - オンボーディング結果の保存先
   - 自動更新の参照元
   - エージェント間連携の要

### LSP統合が低優先な理由

1. **実装コスト vs 効果**
   - 30言語対応は大規模投資
   - 現状のGrep/Globで80%カバー可能
   - メンテナンス負担が大きい

2. **MUSUBIの性質**
   - 仕様駆動開発ツール
   - コード編集より設計・計画重視
   - シンボルレベル操作の優先度低い

3. **段階的導入可能**
   - 必要な言語から導入
   - プラグイン化で負担軽減
   - v1.0以降で検討

## 7. 結論

### 適用すべき機能 (Phase 1-2)

✅ **メモリシステム** - 最優先実装
✅ **プロジェクト設定 (project.yml)** - 早期実装

### 段階的導入 (Phase 3-4)

🔶 **オンボーディング機能** - v0.3.0目標
🔶 **自動更新・同期** - v0.4.0目標

### 保留・長期検討

⚪ **LSP統合** - v1.0以降で必要に応じて
⚪ **マルチプロジェクト** - モノレポ対応時

### 次のアクション

1. **メモリシステム設計ドキュメント作成**
2. **steering/memories/ ディレクトリ構造定義**
3. **steering エージェントへのメモリ管理機能追加**
4. **project.yml スキーマ定義**
5. **実装 PR 作成 (v0.2.0)**

---

**調査完了日**: 2025-11-22
**調査者**: GitHub Copilot (Claude Sonnet 4.5)
**参照**: References/serena プロジェクト分析
