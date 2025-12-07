# ADR-P0-B001: OpenHands由来機能の導入

| 項目 | 内容 |
|------|------|
| **ADR ID** | ADR-P0-B001 |
| **ステータス** | 承認 |
| **決定日** | 2025-12-07 |
| **決定者** | MUSUBIチーム |
| **対象要件** | REQ-P0-B001 〜 REQ-P0-B008 |

---

## 1. コンテキスト

MUSUBIはSpecification Driven Development (SDD)フレームワークとして成熟してきたが、AIエージェントの実行品質向上に関する機能が不足していた。競合分析の結果、OpenHands（SWE-Bench 72.8%達成）から以下の機能を導入することで、MUSUBIの競争力を大幅に向上できることが判明した。

### 導入対象機能

1. **スタック検出システム** - エージェントの無限ループ検出
2. **キーワードトリガー型スキル** - 会話ベースのスキル活性化
3. **リポジトリ固有スキル** - プロジェクト固有の知識管理
4. **メモリコンデンサー** - コンテキスト圧縮
5. **クリティック（評価）システム** - 出力品質のスコアリング
6. **GitHub Issue自動解決** - 自動PR生成
7. **セキュリティリスクアナライザー** - セキュリティ評価
8. **エージェントメモリ** - セッション学習の永続化

---

## 2. 決定

OpenHandsの8つの機能をMUSUBI v2.2.0に導入する。

### 2.1 アーキテクチャ決定

| 項目 | 決定 | 理由 |
|------|------|------|
| **言語** | JavaScript (Node.js) | 既存コードベースとの一貫性 |
| **モジュール構造** | 新規ディレクトリなし | 既存の `src/analyzers/`, `src/managers/`, `src/validators/` に追加 |
| **設定形式** | YAML (`project.yml`) | 既存の設定システムを拡張 |
| **スキル形式** | Markdown + YAML frontmatter | OpenHandsと同一形式で互換性確保 |

### 2.2 命名規則

| OpenHands | MUSUBI |
|-----------|--------|
| Microagent | Skill |
| stuck.py | stuck-detector.js |
| condenser.py | memory-condenser.js |
| critic/ | critic-system.js |
| resolver/ | issue-resolver.js |
| security/ | security-analyzer.js |

### 2.3 ディレクトリ構造

```
.musubi/           # リポジトリ固有設定・スキル
  └── skills/
      └── repo.md

steering/          # プロジェクトメモリ（既存）
  └── memories/
      ├── quality_report.md   # Critic出力
      └── session_learnings.md # AgentMemory出力
```

---

## 3. 検討した選択肢

### 選択肢A: OpenHandsをそのまま依存関係として追加

**メリット:**
- 実装コスト最小
- 自動アップデート

**デメリット:**
- Python依存（MUSUBIはNode.js）
- OpenHandsの全機能が含まれる（過剰）
- ライセンス複雑化

**判定:** 却下

### 選択肢B: OpenHandsの機能をJavaScriptで再実装

**メリット:**
- Node.jsエコシステムとの統合
- MUSUBIのアーキテクチャに最適化
- 必要な機能のみ導入

**デメリット:**
- 実装コスト
- メンテナンス負担

**判定:** 採用

### 選択肢C: MCP (Model Context Protocol) 経由で連携

**メリット:**
- 疎結合
- 言語に依存しない

**デメリット:**
- 追加の複雑性
- ネットワーク依存

**判定:** 将来検討

---

## 4. 影響

### 4.1 ポジティブな影響

- エージェント品質の向上（スタック検出、クリティック）
- 開発者体験の向上（キーワードトリガー、エージェントメモリ）
- セキュリティの向上（セキュリティアナライザー）
- 自動化の向上（Issue解決）

### 4.2 リスクと緩和策

| リスク | 影響度 | 緩和策 |
|--------|-------|--------|
| 実装遅延 | 中 | フェーズ分割、MVP優先 |
| パフォーマンス低下 | 低 | 遅延評価、キャッシュ |
| ユーザー混乱 | 低 | 段階的ロールアウト、ドキュメント |

### 4.3 依存関係への影響

- `package.json` に新規依存なし（標準ライブラリのみ使用）
- 既存のCLIコマンドに影響なし
- 新規CLIコマンド: `musubi-resolve`, `musubi-remember`

---

## 5. 実装計画

### Phase 1 (Week 1-2): コア機能

- [ ] REQ-P0-B001: スタック検出システム
- [ ] REQ-P0-B002: キーワードトリガー型スキル
- [ ] REQ-P0-B003: リポジトリ固有スキル

### Phase 2 (Week 3-4): 品質機能

- [ ] REQ-P0-B004: メモリコンデンサー
- [ ] REQ-P0-B005: クリティック（評価）システム
- [ ] REQ-P0-B008: エージェントメモリ

### Phase 3 (Week 5-6): 自動化機能

- [ ] REQ-P0-B006: GitHub Issue自動解決
- [ ] REQ-P0-B007: セキュリティリスクアナライザー

---

## 6. 成功指標

| 指標 | 目標値 | 測定方法 |
|------|--------|----------|
| スタック検出精度 | 95%+ | テストケース |
| スキル活性化精度 | 90%+ | ユーザーフィードバック |
| クリティックスコア相関 | 0.8+ | 手動評価との比較 |
| Issue解決成功率 | 60%+ | 自動PR承認率 |

---

## 7. 参考資料

- [OpenHands GitHub](https://github.com/OpenHands/OpenHands)
- [OpenHands Skills README](https://github.com/OpenHands/OpenHands/blob/main/skills/README.md)
- [OpenHands Stuck Detector](https://github.com/OpenHands/OpenHands/blob/main/openhands/controller/stuck.py)
- [OpenHands Resolver](https://github.com/OpenHands/OpenHands/blob/main/openhands/resolver/README.md)

---

## 8. 文書履歴

| バージョン | 日付 | 作成者 | 変更内容 |
|-----------|------|--------|----------|
| 1.0 | 2025-12-07 | MUSUBIチーム | 初版作成 |

---

*― ADR終了 ―*
