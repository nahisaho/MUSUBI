/**
 * Requirements Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Logger } from '../utils/logger';

export async function generateRequirements(): Promise<void> {
  // Ask for feature name
  const feature = await vscode.window.showInputBox({
    prompt: 'Enter feature name for requirements generation',
    placeHolder: 'e.g., user-authentication, payment-system',
    title: 'MUSUBI: Generate Requirements',
  });

  if (!feature) {
    return;
  }

  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Generating requirements for "${feature}"...`,
      cancellable: false,
    },
    async () => {
      return await cli.requirements(feature);
    }
  );

  if (result.success) {
    vscode.window.showInformationMessage(
      `✅ Requirements generated for "${feature}"`
    );
    Logger.info(`Requirements generated: ${feature}`);

    // Try to open the generated file
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (workspaceRoot) {
      const possiblePaths = [
        `storage/specs/REQ-${feature}.md`,
        `storage/specs/requirements/${feature}.md`,
        `storage/specs/${feature}.md`,
      ];

      for (const relativePath of possiblePaths) {
        const uri = vscode.Uri.file(`${workspaceRoot}/${relativePath}`);
        try {
          await vscode.workspace.fs.stat(uri);
          await vscode.window.showTextDocument(uri);
          break;
        } catch {
          // File doesn't exist, try next
        }
      }
    }
  } else {
    vscode.window.showErrorMessage(
      `❌ Failed to generate requirements: ${result.stderr || result.stdout}`
    );
    Logger.error('Requirements generation failed', new Error(result.stderr));
  }
}
