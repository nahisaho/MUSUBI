/**
 * Status Bar Manager
 * 
 * Displays MUSUBI compliance status in the status bar
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Logger } from '../utils/logger';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    
    this.statusBarItem.command = 'musubi.validateScore';
    this.statusBarItem.tooltip = 'Click to check MUSUBI compliance score';
    this.statusBarItem.text = '$(shield) MUSUBI';
    this.statusBarItem.show();
    
    context.subscriptions.push(this.statusBarItem);
  }

  async update(): Promise<void> {
    try {
      const cli = new CliBridge();
      
      // Check if CLI is available
      const isAvailable = await cli.isAvailable();
      if (!isAvailable) {
        this.statusBarItem.text = '$(shield) MUSUBI (CLI not found)';
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        return;
      }

      // Get version
      const version = await cli.getVersion();
      
      // Try to get compliance score
      const result = await cli.validateScore();
      
      if (result.success && result.data) {
        const data = result.data as { score?: number; grade?: string };
        const score = data.score ?? 0;
        const grade = data.grade ?? 'N/A';
        
        this.updateStatusBar(score, grade, version);
      } else {
        // Fallback to basic validation
        const validateResult = await cli.validate();
        if (validateResult.success) {
          this.statusBarItem.text = `$(shield) MUSUBI v${version || '?'}`;
          this.statusBarItem.backgroundColor = undefined;
        } else {
          this.statusBarItem.text = `$(shield) MUSUBI ⚠️`;
          this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
      }
    } catch (error) {
      Logger.error('Failed to update status bar', error as Error);
      this.statusBarItem.text = '$(shield) MUSUBI';
      this.statusBarItem.backgroundColor = undefined;
    }
  }

  private updateStatusBar(score: number, grade: string, version: string | null): void {
    let icon: string;
    let bgColor: vscode.ThemeColor | undefined;
    
    if (score >= 80) {
      icon = '$(shield-check)';
      bgColor = undefined; // Green is default
    } else if (score >= 60) {
      icon = '$(shield)';
      bgColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
      icon = '$(shield-x)';
      bgColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    }
    
    this.statusBarItem.text = `${icon} ${score}% (${grade})`;
    this.statusBarItem.tooltip = `MUSUBI Compliance Score: ${score}%\nGrade: ${grade}\nVersion: ${version || 'unknown'}\n\nClick to refresh`;
    this.statusBarItem.backgroundColor = bgColor;
  }

  show(): void {
    this.statusBarItem.show();
  }

  hide(): void {
    this.statusBarItem.hide();
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
