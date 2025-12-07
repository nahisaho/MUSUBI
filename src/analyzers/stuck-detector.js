/**
 * MUSUBI Stuck Detector
 * 
 * AIエージェントのスタック状態（無限ループ、繰り返しエラー）を検出
 * 
 * @module src/analyzers/stuck-detector
 * @see REQ-P0-B001
 * @inspired-by OpenHands openhands/controller/stuck.py
 */

const crypto = require('crypto');

/**
 * スタックイベントの種類
 */
const EventType = {
  ACTION: 'action',
  OBSERVATION: 'observation',
  ERROR: 'error',
  MESSAGE: 'message',
};

/**
 * SDDステージ
 */
const Stage = {
  REQUIREMENTS: 'requirements',
  DESIGN: 'design',
  IMPLEMENT: 'implement',
  TEST: 'test',
  VALIDATE: 'validate',
};

/**
 * スタックの種類
 */
const LoopType = {
  REPEATING_ACTION: 'repeating_action',
  ERROR_LOOP: 'error_loop',
  MONOLOGUE: 'monologue',
  CONTEXT_OVERFLOW: 'context_overflow',
  STAGE_OSCILLATION: 'stage_oscillation',
};

/**
 * 深刻度
 */
const Severity = {
  WARNING: 'warning',
  CRITICAL: 'critical',
};

/**
 * イベントのハッシュを生成
 * @param {Object} event 
 * @returns {string}
 */
function hashEvent(event) {
  const content = JSON.stringify({
    type: event.type,
    stage: event.stage,
    content: event.content,
  });
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

/**
 * スタック分析結果
 */
class StuckAnalysis {
  /**
   * @param {Object} options
   * @param {string} options.loopType - スタックの種類
   * @param {number} options.loopRepeatTimes - 繰り返し回数
   * @param {number} options.loopStartIndex - ループ開始インデックス
   * @param {string[]} options.suggestedActions - 推奨アクション
   * @param {string} options.severity - 深刻度
   */
  constructor(options = {}) {
    this.loopType = options.loopType;
    this.loopRepeatTimes = options.loopRepeatTimes || 0;
    this.loopStartIndex = options.loopStartIndex || 0;
    this.suggestedActions = options.suggestedActions || [];
    this.severity = options.severity || Severity.WARNING;
    this.timestamp = new Date();
  }

  /**
   * 人間が読める形式のメッセージを生成
   * @returns {string}
   */
  getMessage() {
    const typeMessages = {
      [LoopType.REPEATING_ACTION]: `同じアクションが${this.loopRepeatTimes}回繰り返されています`,
      [LoopType.ERROR_LOOP]: `同じエラーが${this.loopRepeatTimes}回繰り返されています`,
      [LoopType.MONOLOGUE]: `出力なしの思考が${this.loopRepeatTimes}ステップ続いています`,
      [LoopType.CONTEXT_OVERFLOW]: `コンテキスト超過エラーが${this.loopRepeatTimes}回発生しています`,
      [LoopType.STAGE_OSCILLATION]: `同一ステージ間を${this.loopRepeatTimes}回往復しています`,
    };
    return typeMessages[this.loopType] || 'スタック状態が検出されました';
  }

  toJSON() {
    return {
      loopType: this.loopType,
      loopRepeatTimes: this.loopRepeatTimes,
      loopStartIndex: this.loopStartIndex,
      suggestedActions: this.suggestedActions,
      severity: this.severity,
      message: this.getMessage(),
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * スタック検出システム
 */
class StuckDetector {
  /**
   * @param {Object} options
   * @param {number} options.maxRepeatActions - アクション繰り返し検出閾値（デフォルト: 4）
   * @param {number} options.maxRepeatErrors - エラー繰り返し検出閾値（デフォルト: 3）
   * @param {number} options.maxMonologueSteps - モノローグ検出閾値（デフォルト: 10）
   * @param {number} options.maxContextErrors - コンテキスト超過検出閾値（デフォルト: 3）
   * @param {number} options.maxStageOscillations - ステージ往復検出閾値（デフォルト: 3）
   */
  constructor(options = {}) {
    this.maxRepeatActions = options.maxRepeatActions || 4;
    this.maxRepeatErrors = options.maxRepeatErrors || 3;
    this.maxMonologueSteps = options.maxMonologueSteps || 10;
    this.maxContextErrors = options.maxContextErrors || 3;
    this.maxStageOscillations = options.maxStageOscillations || 3;
    
    this.history = [];
    this.stuckAnalysis = null;
  }

  /**
   * イベントを履歴に追加
   * @param {Object} event
   * @param {string} event.type - イベント種類
   * @param {string} event.stage - SDDステージ
   * @param {string} event.content - 内容
   */
  addEvent(event) {
    const eventWithMeta = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: event.type || EventType.ACTION,
      stage: event.stage || Stage.IMPLEMENT,
      content: event.content || '',
      hash: hashEvent(event),
    };
    this.history.push(eventWithMeta);
    return eventWithMeta;
  }

  /**
   * 履歴をクリア
   */
  clearHistory() {
    this.history = [];
    this.stuckAnalysis = null;
  }

  /**
   * スタック状態を検出
   * @returns {StuckAnalysis|null}
   */
  detect() {
    // 最低3イベント必要
    if (this.history.length < 3) {
      return null;
    }

    // シナリオ1: 同じアクション・同じ結果の繰り返し
    const repeatingAction = this._detectRepeatingAction();
    if (repeatingAction) {
      this.stuckAnalysis = repeatingAction;
      return repeatingAction;
    }

    // シナリオ2: エラーループ
    const errorLoop = this._detectErrorLoop();
    if (errorLoop) {
      this.stuckAnalysis = errorLoop;
      return errorLoop;
    }

    // シナリオ3: モノローグ
    const monologue = this._detectMonologue();
    if (monologue) {
      this.stuckAnalysis = monologue;
      return monologue;
    }

    // シナリオ4: コンテキスト超過ループ
    const contextOverflow = this._detectContextOverflow();
    if (contextOverflow) {
      this.stuckAnalysis = contextOverflow;
      return contextOverflow;
    }

    // シナリオ5: ステージ往復
    const stageOscillation = this._detectStageOscillation();
    if (stageOscillation) {
      this.stuckAnalysis = stageOscillation;
      return stageOscillation;
    }

    this.stuckAnalysis = null;
    return null;
  }

  /**
   * シナリオ1: 同じアクション・同じ結果の繰り返しを検出
   * @private
   * @returns {StuckAnalysis|null}
   */
  _detectRepeatingAction() {
    if (this.history.length < this.maxRepeatActions) {
      return null;
    }

    const lastN = this.history.slice(-this.maxRepeatActions);
    const firstHash = lastN[0].hash;
    const allSame = lastN.every(e => e.hash === firstHash);

    if (allSame) {
      return new StuckAnalysis({
        loopType: LoopType.REPEATING_ACTION,
        loopRepeatTimes: this.maxRepeatActions,
        loopStartIndex: this.history.length - this.maxRepeatActions,
        suggestedActions: this._suggestAlternatives(LoopType.REPEATING_ACTION),
        severity: Severity.WARNING,
      });
    }

    return null;
  }

  /**
   * シナリオ2: エラーループを検出
   * @private
   * @returns {StuckAnalysis|null}
   */
  _detectErrorLoop() {
    if (this.history.length < this.maxRepeatErrors) {
      return null;
    }

    const lastN = this.history.slice(-this.maxRepeatErrors);
    const allErrors = lastN.every(e => e.type === EventType.ERROR);
    
    if (allErrors) {
      const firstHash = lastN[0].hash;
      const sameError = lastN.every(e => e.hash === firstHash);
      
      if (sameError) {
        return new StuckAnalysis({
          loopType: LoopType.ERROR_LOOP,
          loopRepeatTimes: this.maxRepeatErrors,
          loopStartIndex: this.history.length - this.maxRepeatErrors,
          suggestedActions: this._suggestAlternatives(LoopType.ERROR_LOOP),
          severity: Severity.CRITICAL,
        });
      }
    }

    return null;
  }

  /**
   * シナリオ3: モノローグ（出力なしの思考継続）を検出
   * @private
   * @returns {StuckAnalysis|null}
   */
  _detectMonologue() {
    if (this.history.length < this.maxMonologueSteps) {
      return null;
    }

    const lastN = this.history.slice(-this.maxMonologueSteps);
    const allMessages = lastN.every(e => 
      e.type === EventType.MESSAGE && 
      !e.content.includes('```') &&  // コードブロックなし
      e.content.length < 500  // 短いメッセージ
    );

    if (allMessages) {
      return new StuckAnalysis({
        loopType: LoopType.MONOLOGUE,
        loopRepeatTimes: this.maxMonologueSteps,
        loopStartIndex: this.history.length - this.maxMonologueSteps,
        suggestedActions: this._suggestAlternatives(LoopType.MONOLOGUE),
        severity: Severity.WARNING,
      });
    }

    return null;
  }

  /**
   * シナリオ4: コンテキスト超過ループを検出
   * @private
   * @returns {StuckAnalysis|null}
   */
  _detectContextOverflow() {
    if (this.history.length < this.maxContextErrors) {
      return null;
    }

    const contextErrorPatterns = [
      'context_length_exceeded',
      'maximum context length',
      'token limit',
      'context window',
      'too many tokens',
    ];

    const lastN = this.history.slice(-this.maxContextErrors);
    const allContextErrors = lastN.every(e => 
      e.type === EventType.ERROR &&
      contextErrorPatterns.some(pattern => 
        e.content.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    if (allContextErrors) {
      return new StuckAnalysis({
        loopType: LoopType.CONTEXT_OVERFLOW,
        loopRepeatTimes: this.maxContextErrors,
        loopStartIndex: this.history.length - this.maxContextErrors,
        suggestedActions: this._suggestAlternatives(LoopType.CONTEXT_OVERFLOW),
        severity: Severity.CRITICAL,
      });
    }

    return null;
  }

  /**
   * シナリオ5: ステージ往復を検出
   * @private
   * @returns {StuckAnalysis|null}
   */
  _detectStageOscillation() {
    const minEvents = this.maxStageOscillations * 2;
    if (this.history.length < minEvents) {
      return null;
    }

    const lastN = this.history.slice(-minEvents);
    const stages = lastN.map(e => e.stage);
    
    // 2つのステージ間を往復しているかチェック
    const uniqueStages = [...new Set(stages)];
    if (uniqueStages.length !== 2) {
      return null;
    }

    // 交互パターンのチェック
    let oscillations = 0;
    for (let i = 1; i < stages.length; i++) {
      if (stages[i] !== stages[i - 1]) {
        oscillations++;
      }
    }

    if (oscillations >= this.maxStageOscillations) {
      return new StuckAnalysis({
        loopType: LoopType.STAGE_OSCILLATION,
        loopRepeatTimes: oscillations,
        loopStartIndex: this.history.length - minEvents,
        suggestedActions: this._suggestAlternatives(LoopType.STAGE_OSCILLATION),
        severity: Severity.WARNING,
      });
    }

    return null;
  }

  /**
   * 代替アプローチを提案
   * @param {string} loopType 
   * @returns {string[]}
   */
  _suggestAlternatives(loopType) {
    const suggestions = {
      [LoopType.REPEATING_ACTION]: [
        '別のアプローチを試してください',
        '要件を再確認してください',
        '問題を小さなステップに分解してください',
        '一時的に別のタスクに取り組んでください',
      ],
      [LoopType.ERROR_LOOP]: [
        'エラーメッセージを詳しく確認してください',
        '依存関係を確認してください',
        '環境設定を見直してください',
        'デバッグ情報を追加してください',
      ],
      [LoopType.MONOLOGUE]: [
        '具体的なアクションを実行してください',
        'コードを書いてください',
        'テストを実行してください',
        'ユーザーに質問してください',
      ],
      [LoopType.CONTEXT_OVERFLOW]: [
        'メモリコンデンサーを有効にしてください',
        '不要なコンテキストを削除してください',
        'セッションを分割してください',
        '要約を生成してください',
      ],
      [LoopType.STAGE_OSCILLATION]: [
        '現在のステージを完了させてください',
        '受入基準を明確にしてください',
        'ステージの完了条件を確認してください',
        'ブロッカーを特定してください',
      ],
    };

    return suggestions[loopType] || ['状態を確認してください'];
  }

  /**
   * 現在の分析結果を取得
   * @returns {StuckAnalysis|null}
   */
  getAnalysis() {
    return this.stuckAnalysis;
  }

  /**
   * 履歴を取得
   * @returns {Object[]}
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * 履歴をMarkdown形式でエクスポート
   * @returns {string}
   */
  exportHistory() {
    if (this.history.length === 0) {
      return '# Stuck Detector History\n\nNo events recorded.';
    }

    let md = '# Stuck Detector History\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += '## Events\n\n';
    md += '| # | Timestamp | Type | Stage | Hash |\n';
    md += '|---|-----------|------|-------|------|\n';

    this.history.forEach((event, index) => {
      md += `| ${index + 1} | ${event.timestamp.toISOString()} | ${event.type} | ${event.stage} | ${event.hash} |\n`;
    });

    if (this.stuckAnalysis) {
      md += '\n## Analysis\n\n';
      md += `- **Type**: ${this.stuckAnalysis.loopType}\n`;
      md += `- **Message**: ${this.stuckAnalysis.getMessage()}\n`;
      md += `- **Severity**: ${this.stuckAnalysis.severity}\n`;
      md += `- **Suggestions**:\n`;
      this.stuckAnalysis.suggestedActions.forEach(s => {
        md += `  - ${s}\n`;
      });
    }

    return md;
  }
}

module.exports = {
  StuckDetector,
  StuckAnalysis,
  EventType,
  Stage,
  LoopType,
  Severity,
  hashEvent,
};
