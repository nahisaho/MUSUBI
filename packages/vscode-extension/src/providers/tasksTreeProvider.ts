/**
 * Tasks Tree Provider
 * 
 * Displays tasks in the explorer
 */

import * as vscode from 'vscode';
import * as path from 'path';

export class TasksTreeProvider implements vscode.TreeDataProvider<TaskItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TaskItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TaskItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TaskItem): Promise<TaskItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [];
    }

    if (!element) {
      return this.getRootItems(workspaceRoot);
    }

    return [];
  }

  private async getRootItems(workspaceRoot: string): Promise<TaskItem[]> {
    const items: TaskItem[] = [];
    
    // Check docs/plans for task files
    const plansPath = path.join(workspaceRoot, 'docs', 'plans');
    try {
      const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(plansPath));
      
      for (const [name, type] of entries) {
        if (type === vscode.FileType.File && name.startsWith('TASKS-') && name.endsWith('.md')) {
          const filePath = path.join(plansPath, name);
          const status = await this.extractStatus(filePath);
          
          items.push(
            new TaskItem(
              name.replace('.md', ''),
              vscode.TreeItemCollapsibleState.None,
              'task',
              vscode.Uri.file(filePath),
              status
            )
          );
        }
      }
    } catch {
      // plans directory doesn't exist
    }

    // Also check storage/specs for task files
    const specsPath = path.join(workspaceRoot, 'storage', 'specs');
    try {
      const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(specsPath));
      
      for (const [name, type] of entries) {
        if (type === vscode.FileType.File && name.startsWith('TASKS-') && name.endsWith('.md')) {
          const filePath = path.join(specsPath, name);
          const status = await this.extractStatus(filePath);
          
          items.push(
            new TaskItem(
              name.replace('.md', ''),
              vscode.TreeItemCollapsibleState.None,
              'task',
              vscode.Uri.file(filePath),
              status
            )
          );
        }
      }
    } catch {
      // specs directory doesn't exist
    }

    if (items.length === 0) {
      items.push(
        new TaskItem(
          'No task files found',
          vscode.TreeItemCollapsibleState.None,
          'info',
          undefined,
          undefined
        )
      );
    }

    return items;
  }

  private async extractStatus(filePath: string): Promise<'completed' | 'in-progress' | 'not-started'> {
    try {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
      const text = Buffer.from(content).toString('utf-8');
      
      if (text.includes('✅ **完了**') || text.includes('✅ Complete')) {
        return 'completed';
      }
      if (text.includes('🔄 進行中') || text.includes('In Progress')) {
        return 'in-progress';
      }
    } catch {
      // Failed to read file
    }
    return 'not-started';
  }
}

class TaskItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly resourceUri?: vscode.Uri,
    public readonly status?: 'completed' | 'in-progress' | 'not-started'
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;

    if (status) {
      switch (status) {
        case 'completed':
          this.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
          this.description = '✅';
          break;
        case 'in-progress':
          this.iconPath = new vscode.ThemeIcon('loading~spin', new vscode.ThemeColor('editorWarning.foreground'));
          this.description = '🔄';
          break;
        default:
          this.iconPath = new vscode.ThemeIcon('circle-outline');
          this.description = '○';
      }
    } else {
      this.iconPath = new vscode.ThemeIcon('tasklist');
    }

    if (resourceUri && contextValue === 'task') {
      this.command = {
        command: 'vscode.open',
        title: 'Open Task',
        arguments: [resourceUri],
      };
      this.tooltip = resourceUri.fsPath;
    }
  }
}
