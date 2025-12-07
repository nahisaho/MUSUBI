/**
 * Validate Commands
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { WorkspaceState } from '../services/workspaceState';
import { StatusBarManager } from '../views/statusBar';
import { Logger } from '../utils/logger';

export async function validateConstitution(_state: WorkspaceState): Promise<void> {
  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Validating constitutional compliance...',
      cancellable: false,
    },
    async () => {
      return await cli.validate();
    }
  );

  if (result.success) {
    const data = result.data as { passed?: number; total?: number } | undefined;
    const passed = data?.passed ?? 0;
    const total = data?.total ?? 9;

    vscode.window.showInformationMessage(
      `✅ Constitutional compliance: ${passed}/${total} articles passed`
    );

    Logger.info(`Validation passed: ${passed}/${total}`);
  } else {
    vscode.window.showWarningMessage(
      `⚠️ Validation issues detected. Check output for details.`
    );
    Logger.show();
  }
}

export async function validateScore(
  state: WorkspaceState,
  statusBar?: StatusBarManager
): Promise<void> {
  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Calculating compliance score...',
      cancellable: false,
    },
    async () => {
      return await cli.validateScore();
    }
  );

  if (result.success && result.data) {
    const data = result.data as { score?: number; grade?: string };
    const score = data.score ?? 0;
    const grade = data.grade ?? 'N/A';

    await state.setComplianceScore(score);
    
    const emoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
    vscode.window.showInformationMessage(
      `${emoji} Compliance Score: ${score}% (Grade: ${grade})`
    );

    // Update status bar
    statusBar?.update();

    Logger.info(`Compliance score: ${score}% (${grade})`);
  } else {
    vscode.window.showWarningMessage(
      'Could not calculate compliance score. Ensure project is properly set up.'
    );
  }
}
