# REQ-P1-002: Web GUI Dashboard 設計書

## 概要

MUSUBI Web GUI Dashboard は、プロジェクトの仕様、ワークフロー、トレーサビリティをブラウザ上で可視化・編集できる Web アプリケーションです。

### 目的

1. **可視化**: MUSUBI プロジェクト構造をダッシュボードで一覧
2. **トレーサビリティ**: 要件→設計→実装→テストの関係をグラフ表示
3. **リアルタイム更新**: ファイル変更を即座に反映
4. **編集機能**: ブラウザ上での仕様編集

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                      musubi-gui                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Frontend (React 18)                      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │  Dashboard   │  │  Workflow    │  │  Traceability    │  │ │
│  │  │    Panel     │  │   Editor     │  │     Matrix       │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │ Constitution │  │   Feature    │  │     Task         │  │ │
│  │  │    Viewer    │  │    Editor    │  │    Tracker       │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │ HTTP/WebSocket                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Backend (Express)                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │   REST API   │  │  WebSocket   │  │  File Watcher    │  │ │
│  │  │   /api/*     │  │    Server    │  │  (chokidar)      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │   Project    │  │   Markdown   │  │   Validation     │  │ │
│  │  │   Scanner    │  │    Parser    │  │    Service       │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │   MUSUBI Project   │                        │
│                    │  steering/, storage/│                       │
│                    └────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## REST API 設計

### プロジェクト

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/project` | GET | プロジェクト情報取得 |
| `/api/project/validate` | POST | プロジェクト検証 |

### 憲法（Constitution）

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/constitution` | GET | 憲法取得 |
| `/api/constitution` | PUT | 憲法更新 |

### 仕様（Specifications）

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/specs` | GET | 仕様一覧 |
| `/api/specs/:id` | GET | 仕様詳細 |
| `/api/specs/:id` | PUT | 仕様更新 |
| `/api/specs/:id/tasks` | GET | タスク一覧 |
| `/api/specs/:id/tasks/:taskId` | PUT | タスク更新 |

### トレーサビリティ

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/traceability` | GET | トレーサビリティマトリクス |
| `/api/traceability/graph` | GET | グラフデータ（D3.js用） |

### ワークフロー

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/workflow` | GET | ワークフロー状態 |
| `/api/workflow/stage` | PUT | ステージ更新 |

## WebSocket イベント

| イベント | 方向 | 説明 |
|---------|------|------|
| `file:changed` | Server→Client | ファイル変更通知 |
| `spec:updated` | Server→Client | 仕様更新通知 |
| `task:completed` | Server→Client | タスク完了通知 |
| `validation:result` | Server→Client | 検証結果通知 |

## フロントエンド構成

```
gui/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DashboardPanel.jsx
│   │   │   ├── ProjectSummary.jsx
│   │   │   └── QuickActions.jsx
│   │   ├── Constitution/
│   │   │   ├── ConstitutionViewer.jsx
│   │   │   └── ArticleCard.jsx
│   │   ├── Specs/
│   │   │   ├── SpecList.jsx
│   │   │   ├── SpecEditor.jsx
│   │   │   └── RequirementCard.jsx
│   │   ├── Tasks/
│   │   │   ├── TaskTracker.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── Traceability/
│   │   │   ├── TraceMatrix.jsx
│   │   │   └── TraceGraph.jsx
│   │   └── Workflow/
│   │       ├── WorkflowEditor.jsx
│   │       └── StageNode.jsx
│   ├── hooks/
│   │   ├── useProject.js
│   │   ├── useWebSocket.js
│   │   └── useTraceability.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## バックエンド構成

```
src/
├── gui/
│   ├── server.js           # Express サーバー
│   ├── routes/
│   │   ├── project.js
│   │   ├── constitution.js
│   │   ├── specs.js
│   │   ├── traceability.js
│   │   └── workflow.js
│   ├── services/
│   │   ├── project-scanner.js
│   │   ├── file-watcher.js
│   │   ├── markdown-parser.js
│   │   └── websocket.js
│   └── middleware/
│       ├── cors.js
│       └── error-handler.js
└── ...
```

## CLI 統合

### `musubi gui` コマンド

```bash
# サーバー起動
npx musubi gui

# ポート指定
npx musubi gui --port 8080

# プロジェクトパス指定
npx musubi gui --project ./my-project

# 読み取り専用モード
npx musubi gui --readonly
```

## 実装フェーズ

### Phase 1: バックエンド基盤（Week 1）
- [ ] Express サーバー設定
- [ ] REST API 基本エンドポイント
- [ ] プロジェクトスキャナー
- [ ] 静的ファイル配信

### Phase 2: フロントエンド基盤（Week 2）
- [ ] Vite + React セットアップ
- [ ] Tailwind CSS 設定
- [ ] ダッシュボードレイアウト
- [ ] API クライアント

### Phase 3: リアルタイム機能（Week 3）
- [ ] WebSocket 統合
- [ ] ファイルウォッチャー
- [ ] リアルタイム更新

### Phase 4: 高度な機能（Week 4）
- [ ] トレーサビリティグラフ（D3.js）
- [ ] 仕様エディター
- [ ] ワークフローエディター

## 技術選定根拠

### React 18
- 豊富なエコシステム
- コンポーネント再利用性
- 並行レンダリング対応

### Tailwind CSS
- ユーティリティファースト
- カスタマイズ容易
- バンドルサイズ最適化

### Express.js
- 軽量で高速
- ミドルウェアエコシステム
- WebSocket 統合容易

### D3.js
- 強力な可視化機能
- カスタマイズ性高
- トレーサビリティグラフに最適

### Vite
- 高速な開発サーバー
- ES Modules ベース
- HMR 対応

## 成功基準

| 基準 | 目標 |
|------|------|
| 初期表示速度 | 2秒以内 |
| ファイル変更反映 | 500ms以内 |
| API レスポンス | 200ms以内 |
| ブラウザサポート | Chrome, Firefox, Safari |

## 依存関係

### バックエンド
```json
{
  "express": "^4.18.0",
  "ws": "^8.14.0",
  "chokidar": "^3.5.0",
  "cors": "^2.8.5"
}
```

### フロントエンド
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@tanstack/react-query": "^5.0.0",
  "d3": "^7.8.0",
  "tailwindcss": "^3.3.0"
}
```

### 開発
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0"
}
```
