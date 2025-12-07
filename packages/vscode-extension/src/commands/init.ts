/**
 * Init Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { WorkspaceState } from '../services/workspaceState';
import { Providers } from './index';
import { PLATFORMS } from '../utils/constants';
import { Logger } from '../utils/logger';

export async function initProject(
  state: WorkspaceState,
  providers: Providers
): Promise<void> {
  // Show platform selection
  const platform = await vscode.window.showQuickPick(
    PLATFORMS.map(p => ({
      label: p.label,
      description: `Initialize with ${p.label} configuration`,
      value: p.value,
      id: p.id,
    })),
    {
      placeHolder: 'Select your AI coding platform',
      title: 'MUSUBI: Initialize Project',
    }
  );

  if (!platform) {
    return;
  }

  const cli = new CliBridge();

  // Check if CLI is available
  const isAvailable = await cli.isAvailable();
  if (!isAvailable) {
    const install = await vscode.window.showErrorMessage(
      'MUSUBI CLI is not installed. Would you like to install it?',
      'Install',
      'Cancel'
    );

    if (install === 'Install') {
      const terminal = vscode.window.createTerminal('MUSUBI Install');
      terminal.show();
      terminal.sendText('npm install -g musubi-sdd');
      return;
    }
    return;
  }

  // Execute init command
  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Initializing MUSUBI project with ${platform.label}...`,
      cancellable: false,
    },
    async () => {
      return await cli.init(platform.value);
    }
  );

  if (result.success) {
    await state.markAsMusubiProject(true);
    await state.setPlatform(platform.id);

    vscode.window.showInformationMessage(
      `✅ MUSUBI project initialized with ${platform.label}!`
    );

    // Refresh all providers
    providers.steeringProvider.refresh();
    providers.requirementsProvider.refresh();
    providers.tasksProvider.refresh();
    providers.skillsProvider.refresh();
    providers.statusBarManager?.update();

    Logger.info(`Project initialized with platform: ${platform.id}`);
  } else {
    vscode.window.showErrorMessage(
      `❌ Failed to initialize project: ${result.stderr || result.stdout}`
    );
    Logger.error('Init failed', new Error(result.stderr));
  }
}
