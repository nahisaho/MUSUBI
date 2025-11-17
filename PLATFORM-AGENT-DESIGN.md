# MUSUBI Multi-Agent Platform Design

## 🎯 新しいアプローチ: Agent-Based Distribution

各プラットフォームの標準規約に従い、25の専門エージェント機能を配布します。

### プラットフォーム別配置戦略

#### 1. **GitHub Copilot**
- **標準**: `.github/copilot-instructions.md` (リポジトリ全体) + `.github/instructions/*.instructions.md` (パス別)
- **AGENTS.md サポート**: ✅ (.github/AGENTS.md または任意のディレクトリ)
- **MUSUBI実装**:
  ```
  .github/
    copilot-instructions.md         # メイン指示(ステアリング参照)
    AGENTS.md                        # 25エージェント定義
    prompts/                         # 9 SDDコマンド(既存)
      sdd-steering.md
      sdd-requirements.md
      ... (9コマンド)
  ```

#### 2. **Cursor IDE**  
- **標準**: `.cursorrules` (シングルファイル) または `.cursor/` ディレクトリ
- **MUSUBI実装**:
  ```
  .cursorrules                       # メイン指示
  .cursor/
    AGENTS.md                        # 25エージェント定義
    commands/                        # 9 SDDコマンド(既存)
      sdd-steering.md
      ... (9コマンド)
  ```

#### 3. **Claude Code**
- **標準**: `.claude/CLAUDE.md` + `.claude/skills/` (Skills API)
- **MUSUBI実装**: 現状維持
  ```
  .claude/
    CLAUDE.md                        # メイン指示
    skills/                          # 25 スキル(専用Skills API)
      orchestrator/SKILL.md
      ... (25スキル)
    commands/                        # 9 SDDコマンド
      sdd-steering.md
      ... (9コマンド)
  ```

#### 4. **Gemini CLI**
- **標準**: `GEMINI.md` ルートファイル
- **MUSUBI実装**:
  ```
  GEMINI.md                          # メイン指示 + 25エージェント定義
  .gemini/
    commands/                        # 9 SDDコマンド(TOML形式)
      sdd-steering.toml
      ... (9コマンド)
  ```

#### 5. **Windsurf IDE**
- **標準**: `.windsurf/` ディレクトリ
- **MUSUBI実装**:
  ```
  .windsurf/
    AGENTS.md                        # 25エージェント定義
    workflows/                       # 9 SDDコマンド
      sdd-steering.md
      ... (9コマンド)
  ```

#### 6. **Codex CLI**
- **標準**: 不明(調査要) - GitHub Copilot類似と推定
- **MUSUBI実装**:
  ```
  .codex/
    AGENTS.md                        # 25エージェント定義
    prompts/                         # 9 SDDコマンド
      sdd-steering.md
      ... (9コマンド)
  ```

#### 7. **Qwen Code**
- **標準**: 不明(調査要) - 汎用Markdownと推定
- **MUSUBI実装**:
  ```
  .qwen/
    AGENTS.md                        # 25エージェント定義
    commands/                        # 9 SDDコマンド
      sdd-steering.md
      ... (9コマンド)
  ```

## 📝 AGENTS.md フォーマット

OpenAI agents.md仕様に準拠:

```markdown
# MUSUBI - Specification Driven Development AI Agents

## Available Agents

### @orchestrator
**Role**: Master coordinator for complex multi-agent workflows
**Capabilities**:
- Orchestrates 24 specialized agents
- Manages cross-domain dependencies
- Ensures constitutional compliance

**When to use**:
- Multi-phase projects requiring multiple specialties
- Complex features spanning architecture, security, performance
- Automated end-to-end SDD workflows

**Example**: 
@orchestrator Implement user authentication with database, API, tests, and security audit

---

### @steering
**Role**: Project memory manager
**Capabilities**:
- Analyzes codebase structure
- Generates/maintains steering context
- Updates architecture documentation

**When to use**:
- Initial project setup
- After major architectural changes
- Before starting new features

**Example**:
@steering Analyze this React/Node.js project and create steering context

---

### @requirements-analyst
**Role**: Requirements analysis and EARS specification
**Capabilities**:
- Stakeholder interview simulation
- EARS-format requirements generation
- Acceptance criteria definition
- SRS document creation

**When to use**:
- Starting new features
- Clarifying ambiguous requirements
- Creating formal specifications

**Example**:
@requirements-analyst Create EARS requirements for user registration with email verification

---

(... 残り22エージェント ...)
```

## 🔄 実装手順

### Phase 1: AGENTS.md テンプレート作成
1. `src/templates/agents/shared/AGENTS.md` に統一エージェント定義
2. 25エージェントの役割・能力・使用例を記述

### Phase 2: プラットフォーム別配置ロジック
1. `src/agents/registry.js` 更新: 各プラットフォームの `layout.agentsFile` 追加
2. `src/init.js` 更新: AGENTS.mdコピーロジック追加

### Phase 3: 既存スキルからAGENTS.md生成
1. Claude Code の `skills/*/SKILL.md` を解析
2. AGENTS.md フォーマットに変換
3. 全プラットフォームで共有可能な形式に

### Phase 4: ドキュメント更新
1. README.md: エージェント起動方法更新
2. PLATFORM-COMPARISON.md: 機能平等化を反映
3. product.md: "25 Claude Code skills" → "25 specialized agents (all platforms)"

## ✅ 期待される結果

- **全プラットフォームで25エージェント利用可能**
- **各プラットフォームの標準規約に準拠**
- **Claude Code の Skills API は専用形式で継続**
- **他プラットフォームは AGENTS.md 経由でエージェント起動**

## 🎯 起動方法の違い

| プラットフォーム | コマンド例 | 
|------------------|------------|
| Claude Code | `@orchestrator <task>` (Skills API) |
| GitHub Copilot | `#` + チャットで "@orchestrator <task>" 参照 |
| Cursor | `/` + チャットで "@orchestrator <task>" 参照 |
| Gemini CLI | GEMINI.md読み込み後 "@orchestrator <task>" |
| Windsurf | `/` + AGENTS.md参照で "@orchestrator <task>" |
| Codex | `/prompts:` + AGENTS.md参照 |
| Qwen Code | `/` + AGENTS.md参照 |

**注意**: Skills API(`@agent`)は Claude Code専用。他プラットフォームは
自然言語でAGENTS.mdの定義を参照。
