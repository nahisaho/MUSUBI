# Product Context

## Description

Ultimate Specification Driven Development Tool with 31 Agents for 7 AI Coding Platforms + MCP Integration (Claude Code, GitHub Copilot, Cursor, Gemini CLI, Windsurf, Codex, Qwen Code)

## Purpose

MUSUBI は、仕様駆動開発 (SDD) を通じて AI コーディングエージェントの品質と一貫性を向上させるツールです。

### Core Value Proposition

- **Constitutional Governance**: 9つの憲法条項による一貫した開発ガイダンス
- **Review Gate Engine**: Requirements, Design, Implementation の各ゲートでの品質検証
- **Multi-Agent Orchestration**: Swarm, Triage, Handoff パターンによる複数エージェント協調
- **7 Platform Support**: Claude Code, GitHub Copilot, Cursor, Gemini CLI, Windsurf, Codex, Qwen Code
- **MCP Integration**: CodeGraph MCP による高度なコード分析
- **Traceability**: 要件からテストまでの完全な追跡可能性

## v6.2.0 Features (New)

### Review Gate Engine

| Feature | Description |
|---------|-------------|
| **Requirements Gate** | EARS形式、優先度、受入基準の検証 |
| **Design Gate** | C4モデル、ADR、コンポーネント設計の検証 |
| **Implementation Gate** | コード品質、テストカバレッジ、命名規則の検証 |
| **Review Prompts** | `#sdd-review-requirements`, `#sdd-review-design`, etc. |

### Workflow Dashboard

| Feature | Description |
|---------|-------------|
| **Progress Visualization** | 5ステージの進捗状況をリアルタイム表示 |
| **Blocker Management** | ブロッカーの追加・解決・追跡 |
| **Transition Recording** | ステージ間遷移の記録と分析 |
| **Sprint Planning** | タスク優先度とベロシティ管理 |

### Traceability System

| Feature | Description |
|---------|-------------|
| **Auto-Extraction** | コード・テスト・コミットからID自動抽出 |
| **Gap Detection** | 設計・実装・テストの欠落を検出 |
| **Matrix Storage** | YAMLベースのトレーサビリティマトリックス |

### Enterprise Features

| Feature | Description |
|---------|-------------|
| **Error Recovery** | エラー分析と修復手順の自動生成 |
| **Rollback Manager** | ファイル/コミット/ステージ/スプリント単位のロールバック |
| **CI Reporter** | GitHub Actions への結果レポート |
| **Tech Article Generator** | Qiita, Zenn, Medium, Dev.to 向け記事生成 |

### CLI Commands (24+)

- `musubi init` - プロジェクト初期化
- `musubi requirements` - 要件生成
- `musubi design` - 設計文書生成
- `musubi tasks` - タスク分解
- `musubi validate` - 憲法準拠検証
- `musubi orchestrate` - マルチエージェント実行
- `musubi release` - リリース管理
- `musubi config` - 設定管理
- `musubi dashboard` - ワークフローダッシュボード (v6.2.0 新規)

## Target Users

### Primary Users

- **開発チーム**: AI コーディングエージェントを活用する開発チーム
- **アーキテクト**: 一貫した開発プラクティスを確立したいアーキテクト
- **エンタープライズ**: 大規模プロジェクトでの品質管理が必要な組織
- **QA チーム**: トレーサビリティと品質ゲートを活用する品質保証チーム

### Use Cases

1. **新規プロジェクト**: SDD ワークフローでプロジェクトを開始
2. **既存プロジェクト**: 段階的に SDD プラクティスを導入
3. **モノレポ**: 複数パッケージの統合管理
4. **エンタープライズ**: カスタマイズ可能な Constitution レベル
5. **品質ゲート**: Review Gate Engine による段階的品質検証
6. **トレーサビリティ**: 要件からテストまでの完全な追跡

---

*Updated: 2025-12-31 - MUSUBI v6.2.0*
