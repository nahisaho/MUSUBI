/**
 * Tasks Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Logger } from '../utils/logger';

export async function generateTasks(): Promise<void> {
  // Ask for feature name
  const feature = await vscode.window.showInputBox({
    prompt: 'Enter feature name for task breakdown',
    placeHolder: 'e.g., user-authentication, payment-system',
    title: 'MUSUBI: Generate Tasks',
  });

  if (!feature) {
    return;
  }

  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Generating tasks for "${feature}"...`,
      cancellable: false,
    },
    async () => {
      return await cli.tasks(feature);
    }
  );

  if (result.success) {
    vscode.window.showInformationMessage(
      `✅ Tasks generated for "${feature}"`
    );
    Logger.info(`Tasks generated: ${feature}`);
  } else {
    vscode.window.showErrorMessage(
      `❌ Failed to generate tasks: ${result.stderr || result.stdout}`
    );
    Logger.error('Tasks generation failed', new Error(result.stderr));
  }
}
