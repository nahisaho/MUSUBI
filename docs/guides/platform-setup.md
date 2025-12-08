# 🔧 プラットフォーム別セットアップガイド

**MUSUBI v3.5.1** | 最終更新: 2025-12-08

> 7つのAIコーディングエージェントごとの詳細セットアップ手順

---

## 📋 目次

1. [Claude Code（Skills API）](#1-claude-codeskills-api)
2. [GitHub Copilot](#2-github-copilot)
3. [Cursor](#3-cursor)
4. [Gemini CLI](#4-gemini-cli)
5. [Codex CLI](#5-codex-cli)
6. [Qwen Code](#6-qwen-code)
7. [Windsurf](#7-windsurf)
8. [プラットフォーム比較](#8-プラットフォーム比較)

---

## 1. Claude Code（Skills API）

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | Skills API（.mdc ファイル） |
| **コマンド形式** | `/command` |
| **Skills数** | 25 スキル + 11 コマンド |
| **推奨度** | ⭐⭐⭐⭐⭐ 最高 |

### セットアップ

```bash
# 初期化
npx musubi-sdd init --claude-code
```

### 生成されるファイル構成

```
project/
├── CLAUDE.md                    # メインエントリーポイント
├── .claude/
│   ├── commands/                # 11 SDDコマンド
│   │   ├── sdd-requirements.md
│   │   ├── sdd-design.md
│   │   ├── sdd-tasks.md
│   │   ├── sdd-implement.md
│   │   ├── sdd-validate.md
│   │   └── ...
│   └── skills/                  # 25 専門スキル
│       ├── orchestrator/
│       ├── requirements-analyst/
│       ├── system-architect/
│       ├── frontend-developer/
│       └── ...
└── steering/
    └── ...
```

### 使用方法

```
# コマンド実行
/sdd-requirements ログイン機能

# スキル指定
@requirements-analyst この機能の要件を分析して

# オーケストレーター経由
@orchestrator 新機能を設計から実装まで担当して
```

### 25 スキル一覧

| カテゴリ | スキル |
|---------|--------|
| **Core** | orchestrator, steering, constitution-enforcer |
| **Requirements** | requirements-analyst, change-impact-analyzer |
| **Architecture** | system-architect, api-designer |
| **Development** | frontend-developer, backend-developer, database-administrator |
| **Quality** | test-engineer, quality-assurance, code-reviewer |
| **Infrastructure** | devops-engineer, site-reliability-engineer |
| **Security** | security-engineer |
| **Documentation** | technical-writer |
| **Project** | project-manager, scrum-master |
| **Specialized** | ai-ml-engineer, ui-ux-designer, mobile-developer, data-engineer, issue-resolver, agent-assistant |

---

## 2. GitHub Copilot

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | AGENTS.md（公式サポート） |
| **コマンド形式** | `#command` |
| **推奨度** | ⭐⭐⭐⭐⭐ 最高 |

### セットアップ

```bash
# 初期化
npx musubi-sdd init --copilot
```

### 生成されるファイル構成

```
project/
├── AGENTS.md                    # メインエントリーポイント
├── .github/
│   └── copilot-instructions.md  # Copilot設定
└── steering/
    └── ...
```

### 使用方法

```
# コマンド実行
#sdd-requirements ログイン機能
#sdd-design ログイン機能
#sdd-implement REQ-LOGIN-001

# ワークフロー
#sdd-steering 現在のプロジェクト状況を確認
```

### VS Code設定（推奨）

`.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "file": "AGENTS.md"
    },
    {
      "file": "steering/rules/constitution.md"
    }
  ]
}
```

---

## 3. Cursor

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | AGENTS.md + .cursorrules |
| **コマンド形式** | `@command` |
| **推奨度** | ⭐⭐⭐⭐ 高 |

### セットアップ

```bash
# 初期化
npx musubi-sdd init --cursor
```

### 生成されるファイル構成

```
project/
├── AGENTS.md                    # メインエントリーポイント
├── .cursorrules                 # Cursorルール設定
└── steering/
    └── ...
```

### .cursorrules 設定

```yaml
# .cursorrules
rules:
  - Follow AGENTS.md for project context
  - Use steering/ for architecture decisions
  - Apply constitution.md quality gates
  - Generate EARS-format requirements
  - Maintain traceability matrix
```

### 使用方法

```
# Cursorチャットで
@sdd-requirements ログイン機能を定義して
@sdd-design C4モデルで設計して
@sdd-implement この要件を実装して
```

---

## 4. Gemini CLI

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | GEMINI.md |
| **コマンド形式** | テキストプロンプト |
| **推奨度** | ⭐⭐⭐⭐ 高 |

### セットアップ

```bash
# Gemini CLI インストール（まだの場合）
npm install -g @anthropic-ai/gemini-cli

# MUSUBI初期化
npx musubi-sdd init --gemini
```

### 生成されるファイル構成

```
project/
├── GEMINI.md                    # メインエントリーポイント
└── steering/
    └── ...
```

### 使用方法

```bash
# Gemini CLIで実行
gemini "GEMINI.mdを参照して、ログイン機能の要件を定義して"

# ファイル参照付き
gemini -f GEMINI.md -f steering/tech.md "新機能を設計して"
```

### コンテキスト設定

```bash
# 環境変数でコンテキスト設定
export GEMINI_CONTEXT="$(cat GEMINI.md steering/product.md)"
```

---

## 5. Codex CLI

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | AGENTS.md |
| **コマンド形式** | テキストプロンプト |
| **推奨度** | ⭐⭐⭐ 中 |

### セットアップ

```bash
# Codex CLI インストール（まだの場合）
npm install -g @openai/codex-cli

# MUSUBI初期化
npx musubi-sdd init --codex
```

### 生成されるファイル構成

```
project/
├── AGENTS.md                    # メインエントリーポイント
└── steering/
    └── ...
```

### 使用方法

```bash
# Codex CLIで実行
codex "AGENTS.mdのSDD手法に従って、ログイン機能を実装して"

# インタラクティブモード
codex -i
> sdd-requirements ログイン機能
```

---

## 6. Qwen Code

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | QWEN.md + commands/ |
| **コマンド形式** | テキストプロンプト |
| **推奨度** | ⭐⭐⭐ 中 |

### セットアップ

```bash
# MUSUBI初期化
npx musubi-sdd init --qwen
```

### 生成されるファイル構成

```
project/
├── QWEN.md                      # メインエントリーポイント
├── .qwen/
│   └── commands/                # SDDコマンド
│       ├── sdd-requirements.md
│       ├── sdd-design.md
│       └── ...
└── steering/
    └── ...
```

### 使用方法

```
# Qwen Codeで実行
QWEN.mdを参照して、sdd-requirementsでログイン機能を定義

# コマンドファイル参照
.qwen/commands/sdd-requirements.mdに従って要件を書いて
```

---

## 7. Windsurf

### 概要

| 項目 | 内容 |
|------|------|
| **形式** | AGENTS.md |
| **コマンド形式** | チャット形式 |
| **推奨度** | ⭐⭐⭐ 中 |

### セットアップ

```bash
# MUSUBI初期化
npx musubi-sdd init --windsurf
```

### 生成されるファイル構成

```
project/
├── AGENTS.md                    # メインエントリーポイント
└── steering/
    └── ...
```

### Windsurf設定

Windsurfの設定パネルで:

1. **Project Context** → `AGENTS.md` を追加
2. **Custom Instructions** → 以下を設定:

```
Follow the SDD methodology defined in AGENTS.md.
Always check steering/rules/constitution.md before changes.
Generate EARS-format requirements.
Maintain full traceability.
```

### 使用方法

```
# Windsurfチャットで
AGENTS.mdに従って、sdd-requirementsでログイン機能を定義して

# ステアリング参照
steering/tech.mdの技術スタックに基づいて設計して
```

---

## 8. プラットフォーム比較

### 機能比較表

| 機能 | Claude Code | GitHub Copilot | Cursor | Gemini CLI | Codex CLI | Qwen Code | Windsurf |
|------|:-----------:|:--------------:|:------:|:----------:|:---------:|:---------:|:--------:|
| **Skills API** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AGENTS.md** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **コマンド形式** | `/cmd` | `#cmd` | `@cmd` | Text | Text | Text | Text |
| **25スキル** | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **IDE統合** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **CLI利用** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

⚠️ = AGENTS.md経由で限定的にサポート

### 推奨プラットフォーム

| ユースケース | 推奨 |
|-------------|------|
| **フル機能SDD** | Claude Code |
| **日常的な開発** | GitHub Copilot, Cursor |
| **CLIベース開発** | Gemini CLI, Codex CLI |
| **中国語環境** | Qwen Code |
| **Cascadeワークフロー** | Windsurf |

### CLI コマンド（全プラットフォーム共通）

すべてのプラットフォームで以下のCLIコマンドが使用可能:

```bash
# 初期化
npx musubi-sdd init

# SDDワークフロー
npx musubi-sdd requirements --feature <name>
npx musubi-sdd design --feature <name>
npx musubi-sdd tasks --feature <name>
npx musubi-sdd validate

# 分析
npx musubi-sdd analyze
npx musubi-sdd gaps
npx musubi-sdd trace

# メモリ管理
npx musubi-sdd remember
npx musubi-sdd sync

# 自動化
npx musubi-sdd orchestrate
npx musubi-sdd resolve --issue <number>

# ユーティリティ
npx musubi-sdd browser
npx musubi-sdd gui start
npx musubi-sdd convert
```

---

## 🔗 関連ドキュメント

- [5分間クイックスタート](./quick-start-5min.md)
- [CLI完全リファレンス](./cli-reference.md)
- [実践チュートリアル](./tutorial-todo-app.md)
- [トラブルシューティング](./troubleshooting.md)

---

*ドキュメント生成: MUSUBI v3.5.1*
