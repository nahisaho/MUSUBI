/**
 * Logger utility for MUSUBI extension
 */

import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel('MUSUBI SDD');

export class Logger {
  static info(message: string): void {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] [INFO] ${message}`);
  }

  static warn(message: string): void {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] [WARN] ${message}`);
  }

  static error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
      outputChannel.appendLine(`  Stack: ${error.stack}`);
    }
  }

  static debug(message: string): void {
    const config = vscode.workspace.getConfiguration('musubi');
    if (config.get<boolean>('debug', false)) {
      const timestamp = new Date().toISOString();
      outputChannel.appendLine(`[${timestamp}] [DEBUG] ${message}`);
    }
  }

  static show(): void {
    outputChannel.show();
  }
}
