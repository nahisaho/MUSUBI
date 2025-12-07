/**
 * Sync Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Providers } from './index';
import { Logger } from '../utils/logger';

export async function syncSteering(providers: Providers): Promise<void> {
  const cli = new CliBridge();

  // Ask if dry run first
  const mode = await vscode.window.showQuickPick(
    [
      { label: 'Preview changes', description: 'Dry run without applying', value: 'dry-run' },
      { label: 'Apply changes', description: 'Sync steering documents', value: 'apply' },
    ],
    {
      placeHolder: 'Select sync mode',
      title: 'MUSUBI: Sync Steering',
    }
  );

  if (!mode) {
    return;
  }

  const isDryRun = mode.value === 'dry-run';

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: isDryRun ? 'Previewing steering changes...' : 'Syncing steering documents...',
      cancellable: false,
    },
    async () => {
      return await cli.sync(isDryRun);
    }
  );

  if (result.success) {
    if (isDryRun) {
      // Show output in a new document
      const doc = await vscode.workspace.openTextDocument({
        content: result.stdout,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
    } else {
      vscode.window.showInformationMessage('✅ Steering documents synced');
      
      // Refresh providers
      providers.steeringProvider.refresh();
      providers.statusBarManager?.update();
    }
    
    Logger.info(`Sync completed (dry-run: ${isDryRun})`);
  } else {
    vscode.window.showErrorMessage(
      `❌ Sync failed: ${result.stderr || result.stdout}`
    );
    Logger.error('Sync failed', new Error(result.stderr));
  }
}
