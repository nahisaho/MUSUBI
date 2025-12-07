/**
 * MUSUBI SDD VS Code Extension
 * 
 * Ultimate Specification Driven Development Tool
 * 27 Skills, 7 AI Platforms
 */

import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { SteeringTreeProvider } from './providers/steeringTreeProvider';
import { RequirementsTreeProvider } from './providers/requirementsTreeProvider';
import { TasksTreeProvider } from './providers/tasksTreeProvider';
import { SkillsTreeProvider } from './providers/skillsTreeProvider';
import { StatusBarManager } from './views/statusBar';
import { WorkspaceState } from './services/workspaceState';
import { Logger } from './utils/logger';

let statusBarManager: StatusBarManager | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  Logger.info('MUSUBI SDD extension activating...');

  // Initialize workspace state
  const workspaceState = new WorkspaceState(context);
  
  // Check if this is a MUSUBI project
  const isMusubiProject = await checkMusubiProject();
  
  // Register tree view providers
  const steeringProvider = new SteeringTreeProvider();
  const requirementsProvider = new RequirementsTreeProvider();
  const tasksProvider = new TasksTreeProvider();
  const skillsProvider = new SkillsTreeProvider();
  
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('musubi-steering', steeringProvider),
    vscode.window.registerTreeDataProvider('musubi-requirements', requirementsProvider),
    vscode.window.registerTreeDataProvider('musubi-tasks', tasksProvider),
    vscode.window.registerTreeDataProvider('musubi-agents', skillsProvider)
  );

  // Initialize status bar if enabled
  const config = vscode.workspace.getConfiguration('musubi');
  if (config.get<boolean>('showStatusBar', true)) {
    statusBarManager = new StatusBarManager(context);
    if (isMusubiProject) {
      await statusBarManager.update();
    }
  }

  // Register commands
  registerCommands(context, workspaceState, {
    steeringProvider,
    requirementsProvider,
    tasksProvider,
    skillsProvider,
    statusBarManager
  });

  // Setup file watchers for auto-refresh
  if (isMusubiProject) {
    setupFileWatchers(context, steeringProvider, requirementsProvider, tasksProvider);
  }

  Logger.info('MUSUBI SDD extension activated successfully');
}

export function deactivate(): void {
  Logger.info('MUSUBI SDD extension deactivated');
}

/**
 * Check if the current workspace is a MUSUBI project
 */
async function checkMusubiProject(): Promise<boolean> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return false;
  }

  const rootPath = workspaceFolders[0].uri;
  
  // Check for steering directory
  const steeringUri = vscode.Uri.joinPath(rootPath, 'steering');
  try {
    await vscode.workspace.fs.stat(steeringUri);
    return true;
  } catch {
    // Check for CLAUDE.md
    try {
      const claudeUri = vscode.Uri.joinPath(rootPath, 'CLAUDE.md');
      await vscode.workspace.fs.stat(claudeUri);
      return true;
    } catch {
      // Check for .github/AGENTS.md
      try {
        const agentsUri = vscode.Uri.joinPath(rootPath, '.github', 'AGENTS.md');
        await vscode.workspace.fs.stat(agentsUri);
        return true;
      } catch {
        return false;
      }
    }
  }
}

/**
 * Setup file watchers for auto-refresh
 */
function setupFileWatchers(
  context: vscode.ExtensionContext,
  steeringProvider: SteeringTreeProvider,
  requirementsProvider: RequirementsTreeProvider,
  tasksProvider: TasksTreeProvider
): void {
  // Watch steering directory
  const steeringWatcher = vscode.workspace.createFileSystemWatcher('**/steering/**/*.{md,yml,yaml}');
  
  steeringWatcher.onDidChange(() => {
    steeringProvider.refresh();
    statusBarManager?.update();
  });
  
  steeringWatcher.onDidCreate(() => {
    steeringProvider.refresh();
  });
  
  steeringWatcher.onDidDelete(() => {
    steeringProvider.refresh();
  });

  // Watch storage/specs for requirements and tasks
  const specsWatcher = vscode.workspace.createFileSystemWatcher('**/storage/specs/**/*.md');
  
  specsWatcher.onDidChange(() => {
    requirementsProvider.refresh();
    tasksProvider.refresh();
  });
  
  specsWatcher.onDidCreate(() => {
    requirementsProvider.refresh();
    tasksProvider.refresh();
  });

  context.subscriptions.push(steeringWatcher, specsWatcher);
}
