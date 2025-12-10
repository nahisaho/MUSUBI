/**
 * MUSUBI GitHub Client
 *
 * GitHub API 統合クライアント
 *
 * @module src/integrations/github-client
 * @see REQ-P0-B006
 */

const { Octokit } = require('@octokit/rest');

/**
 * GitHub API クライアント
 */
class GitHubClient {
  /**
   * @param {Object} options
   * @param {string} options.token - GitHub Personal Access Token
   * @param {string} options.owner - リポジトリオーナー
   * @param {string} options.repo - リポジトリ名
   */
  constructor(options = {}) {
    this.token = options.token || process.env.GITHUB_TOKEN;
    this.owner = options.owner;
    this.repo = options.repo;

    if (!this.token) {
      console.warn('GitHubClient: No GITHUB_TOKEN provided. API calls may fail.');
    }

    this.octokit = new Octokit({
      auth: this.token,
    });
  }

  /**
   * Issue を取得
   * @param {number} issueNumber
   * @returns {Promise<Object>}
   */
  async getIssue(issueNumber) {
    const { data } = await this.octokit.issues.get({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
    });
    return data;
  }

  /**
   * Issue のコメントを取得
   * @param {number} issueNumber
   * @returns {Promise<Object[]>}
   */
  async getIssueComments(issueNumber) {
    const { data } = await this.octokit.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
    });
    return data;
  }

  /**
   * Issue にコメントを追加
   * @param {number} issueNumber
   * @param {string} body
   * @returns {Promise<Object>}
   */
  async addIssueComment(issueNumber, body) {
    const { data } = await this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      body,
    });
    return data;
  }

  /**
   * Issue にラベルを追加
   * @param {number} issueNumber
   * @param {string[]} labels
   * @returns {Promise<Object>}
   */
  async addLabels(issueNumber, labels) {
    const { data } = await this.octokit.issues.addLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      labels,
    });
    return data;
  }

  /**
   * ブランチを作成
   * @param {string} branchName
   * @param {string} baseBranch - ベースブランチ (default: 'main')
   * @returns {Promise<Object>}
   */
  async createBranch(branchName, baseBranch = 'main') {
    // ベースブランチの最新コミットを取得
    const { data: baseRef } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${baseBranch}`,
    });

    // 新しいブランチを作成
    const { data } = await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha,
    });

    return data;
  }

  /**
   * ファイルを作成/更新
   * @param {string} path - ファイルパス
   * @param {string} content - ファイル内容
   * @param {string} message - コミットメッセージ
   * @param {string} branch - ブランチ名
   * @returns {Promise<Object>}
   */
  async createOrUpdateFile(path, content, message, branch) {
    let sha;

    // 既存ファイルの SHA を取得（更新の場合に必要）
    try {
      const { data: existingFile } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: branch,
      });
      sha = existingFile.sha;
    } catch (e) {
      // ファイルが存在しない場合は無視
    }

    const { data } = await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha,
    });

    return data;
  }

  /**
   * Pull Request を作成
   * @param {Object} options
   * @param {string} options.title - PR タイトル
   * @param {string} options.body - PR 説明
   * @param {string} options.head - ソースブランチ
   * @param {string} options.base - ターゲットブランチ
   * @param {boolean} options.draft - Draft PR フラグ
   * @returns {Promise<Object>}
   */
  async createPullRequest(options) {
    const { data } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title: options.title,
      body: options.body,
      head: options.head,
      base: options.base || 'main',
      draft: options.draft !== false,
    });

    return data;
  }

  /**
   * PR にレビュアーを追加
   * @param {number} pullNumber
   * @param {string[]} reviewers
   * @returns {Promise<Object>}
   */
  async addReviewers(pullNumber, reviewers) {
    const { data } = await this.octokit.pulls.requestReviewers({
      owner: this.owner,
      repo: this.repo,
      pull_number: pullNumber,
      reviewers,
    });
    return data;
  }

  /**
   * Issue を Close
   * @param {number} issueNumber
   * @returns {Promise<Object>}
   */
  async closeIssue(issueNumber) {
    const { data } = await this.octokit.issues.update({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      state: 'closed',
    });
    return data;
  }

  /**
   * Issue 一覧を取得
   * @param {Object} options
   * @param {string} options.state - 状態 ('open', 'closed', 'all')
   * @param {string[]} options.labels - フィルタするラベル
   * @param {number} options.perPage - 1ページあたりの件数
   * @returns {Promise<Object[]>}
   */
  async listIssues(options = {}) {
    const { data } = await this.octokit.issues.listForRepo({
      owner: this.owner,
      repo: this.repo,
      state: options.state || 'open',
      labels: options.labels?.join(','),
      per_page: options.perPage || 30,
    });
    return data;
  }

  /**
   * リポジトリ情報を取得
   * @returns {Promise<Object>}
   */
  async getRepository() {
    const { data } = await this.octokit.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return data;
  }

  /**
   * GitHub Actions ワークフローを手動実行
   * @param {string} workflowId - ワークフロー ID またはファイル名
   * @param {string} ref - ブランチ名
   * @param {Object} inputs - ワークフロー入力
   * @returns {Promise<void>}
   */
  async dispatchWorkflow(workflowId, ref, inputs = {}) {
    await this.octokit.actions.createWorkflowDispatch({
      owner: this.owner,
      repo: this.repo,
      workflow_id: workflowId,
      ref,
      inputs,
    });
  }
}

/**
 * URL からリポジトリ情報を抽出
 * @param {string} url
 * @returns {Object|null}
 */
function parseGitHubUrl(url) {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/\s.]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace('.git', ''),
    };
  }
  return null;
}

/**
 * Issue URL から番号を抽出
 * @param {string} url
 * @returns {number|null}
 */
function parseIssueNumber(url) {
  const match = url.match(/\/issues\/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

module.exports = {
  GitHubClient,
  parseGitHubUrl,
  parseIssueNumber,
};
