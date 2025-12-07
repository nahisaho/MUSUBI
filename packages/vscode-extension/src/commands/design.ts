/**
 * Design Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Logger } from '../utils/logger';

export async function generateDesign(): Promise<void> {
  // Ask for feature name
  const feature = await vscode.window.showInputBox({
    prompt: 'Enter feature name for design generation',
    placeHolder: 'e.g., user-authentication, payment-system',
    title: 'MUSUBI: Generate Design',
  });

  if (!feature) {
    return;
  }

  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Generating design for "${feature}"...`,
      cancellable: false,
    },
    async () => {
      return await cli.design(feature);
    }
  );

  if (result.success) {
    vscode.window.showInformationMessage(
      `✅ Design generated for "${feature}"`
    );
    Logger.info(`Design generated: ${feature}`);
  } else {
    vscode.window.showErrorMessage(
      `❌ Failed to generate design: ${result.stderr || result.stdout}`
    );
    Logger.error('Design generation failed', new Error(result.stderr));
  }
}
