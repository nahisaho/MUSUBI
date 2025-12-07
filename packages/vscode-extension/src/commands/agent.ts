/**
 * Agent Selection Command
 */

import * as vscode from 'vscode';
import { WorkspaceState } from '../services/workspaceState';
import { PLATFORMS } from '../utils/constants';
import { Logger } from '../utils/logger';

export async function selectAgent(state: WorkspaceState): Promise<void> {
  const currentPlatform = state.getState().platform;

  const platform = await vscode.window.showQuickPick(
    PLATFORMS.map(p => ({
      label: p.label,
      description: p.id === currentPlatform ? '(current)' : undefined,
      value: p.value,
      id: p.id,
    })),
    {
      placeHolder: 'Select AI coding platform',
      title: 'MUSUBI: Select Agent Platform',
    }
  );

  if (!platform) {
    return;
  }

  await state.setPlatform(platform.id);
  
  vscode.window.showInformationMessage(
    `✅ Default platform set to ${platform.label}`
  );

  Logger.info(`Platform changed to: ${platform.id}`);
}
