/**
 * CLI Bridge Service
 * 
 * Executes MUSUBI CLI commands from VS Code
 */

import * as vscode from 'vscode';
import { exec, ExecOptions } from 'child_process';
import { Logger } from '../utils/logger';

export interface CliResult {
  success: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
  data?: Record<string, unknown>;
}

export class CliBridge {
  private cliPath: string;
  private workspaceRoot: string | undefined;

  constructor() {
    const config = vscode.workspace.getConfiguration('musubi');
    this.cliPath = config.get<string>('cliPath', 'npx musubi-sdd');
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  /**
   * Execute a CLI command
   */
  async execute(command: string, options?: { json?: boolean }): Promise<CliResult> {
    const fullCommand = options?.json ? `${command} --json` : command;
    
    Logger.info(`Executing CLI command: ${fullCommand}`);

    return new Promise((resolve) => {
      const execOptions: ExecOptions = {
        cwd: this.workspaceRoot,
        env: { ...process.env, FORCE_COLOR: '0' },
        maxBuffer: 10 * 1024 * 1024, // 10MB
      };

      exec(fullCommand, execOptions, (error, stdout, stderr) => {
        const code = error?.code ?? 0;
        
        if (code !== 0) {
          Logger.error(`CLI command failed: ${fullCommand}`, error ?? undefined);
        }

        let data: Record<string, unknown> | undefined;
        if (options?.json && stdout) {
          try {
            data = JSON.parse(stdout);
          } catch {
            Logger.warn('Failed to parse JSON output');
          }
        }

        resolve({
          success: code === 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          code,
          data,
        });
      });
    });
  }

  /**
   * Execute init command
   */
  async init(platform: string): Promise<CliResult> {
    return this.execute(`${this.cliPath} init ${platform}`);
  }

  /**
   * Execute validate command
   */
  async validate(): Promise<CliResult> {
    return this.execute(`${this.cliPath} validate`, { json: true });
  }

  /**
   * Execute validate score command
   */
  async validateScore(): Promise<CliResult> {
    return this.execute('npx musubi-validate score', { json: true });
  }

  /**
   * Execute sync command
   */
  async sync(dryRun = false): Promise<CliResult> {
    const cmd = dryRun ? `${this.cliPath} sync --dry-run` : `${this.cliPath} sync`;
    return this.execute(cmd);
  }

  /**
   * Execute status command
   */
  async status(): Promise<CliResult> {
    return this.execute(`${this.cliPath} status`);
  }

  /**
   * Execute requirements command
   */
  async requirements(feature?: string): Promise<CliResult> {
    const cmd = feature 
      ? `npx musubi-requirements "${feature}"`
      : 'npx musubi-requirements';
    return this.execute(cmd);
  }

  /**
   * Execute design command
   */
  async design(feature?: string): Promise<CliResult> {
    const cmd = feature 
      ? `npx musubi-design "${feature}"`
      : 'npx musubi-design';
    return this.execute(cmd);
  }

  /**
   * Execute tasks command
   */
  async tasks(feature?: string): Promise<CliResult> {
    const cmd = feature 
      ? `npx musubi-tasks "${feature}"`
      : 'npx musubi-tasks';
    return this.execute(cmd);
  }

  /**
   * Execute analyze command
   */
  async analyze(type = 'all'): Promise<CliResult> {
    return this.execute(`npx musubi-analyze --type ${type}`, { json: true });
  }

  /**
   * Execute trace command
   */
  async trace(): Promise<CliResult> {
    return this.execute('npx musubi-trace', { json: true });
  }

  /**
   * Execute gaps command
   */
  async gaps(): Promise<CliResult> {
    return this.execute('npx musubi-gaps', { json: true });
  }

  /**
   * Check if CLI is available
   */
  async isAvailable(): Promise<boolean> {
    const result = await this.execute(`${this.cliPath} --version`);
    return result.success;
  }

  /**
   * Get CLI version
   */
  async getVersion(): Promise<string | null> {
    const result = await this.execute(`${this.cliPath} --version`);
    return result.success ? result.stdout : null;
  }
}
