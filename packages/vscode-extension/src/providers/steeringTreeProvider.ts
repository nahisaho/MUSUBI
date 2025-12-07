/**
 * Steering Tree Provider
 * 
 * Displays steering documents in the explorer
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { STEERING_FILES } from '../utils/constants';

export class SteeringTreeProvider implements vscode.TreeDataProvider<SteeringItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SteeringItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SteeringItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SteeringItem): Promise<SteeringItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [];
    }

    if (!element) {
      // Root level - show categories
      return this.getRootItems(workspaceRoot);
    }

    // Child items
    if (element.contextValue === 'category') {
      return this.getCategoryChildren(workspaceRoot, element.label as string);
    }

    return [];
  }

  private async getRootItems(workspaceRoot: string): Promise<SteeringItem[]> {
    const items: SteeringItem[] = [];

    // Check if steering directory exists
    const steeringPath = path.join(workspaceRoot, 'steering');
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(steeringPath));
      
      items.push(
        new SteeringItem(
          'Core Documents',
          vscode.TreeItemCollapsibleState.Expanded,
          'category',
          undefined,
          '$(file-text)'
        ),
        new SteeringItem(
          'Rules',
          vscode.TreeItemCollapsibleState.Collapsed,
          'category',
          undefined,
          '$(law)'
        ),
        new SteeringItem(
          'Memories',
          vscode.TreeItemCollapsibleState.Collapsed,
          'category',
          undefined,
          '$(history)'
        )
      );
    } catch {
      items.push(
        new SteeringItem(
          'No steering directory found',
          vscode.TreeItemCollapsibleState.None,
          'info',
          undefined,
          '$(info)'
        )
      );
    }

    return items;
  }

  private async getCategoryChildren(workspaceRoot: string, category: string): Promise<SteeringItem[]> {
    const items: SteeringItem[] = [];
    const steeringPath = path.join(workspaceRoot, 'steering');

    switch (category) {
      case 'Core Documents':
        for (const file of STEERING_FILES) {
          const filePath = path.join(steeringPath, file);
          try {
            await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
            items.push(
              new SteeringItem(
                file,
                vscode.TreeItemCollapsibleState.None,
                'file',
                vscode.Uri.file(filePath),
                this.getIconForFile(file)
              )
            );
          } catch {
            // File doesn't exist
          }
        }
        break;

      case 'Rules': {
        const rulesPath = path.join(steeringPath, 'rules');
        try {
          const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rulesPath));
          for (const [name, type] of entries) {
            if (type === vscode.FileType.File && name.endsWith('.md')) {
              items.push(
                new SteeringItem(
                  name,
                  vscode.TreeItemCollapsibleState.None,
                  'file',
                  vscode.Uri.file(path.join(rulesPath, name)),
                  '$(law)'
                )
              );
            }
          }
        } catch {
          // Rules directory doesn't exist
        }
        break;
      }

      case 'Memories': {
        const memoriesPath = path.join(steeringPath, 'memories');
        try {
          const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(memoriesPath));
          for (const [name, type] of entries) {
            if (type === vscode.FileType.File && name.endsWith('.md')) {
              items.push(
                new SteeringItem(
                  name,
                  vscode.TreeItemCollapsibleState.None,
                  'file',
                  vscode.Uri.file(path.join(memoriesPath, name)),
                  '$(history)'
                )
              );
            }
          }
        } catch {
          // Memories directory doesn't exist
        }
        break;
      }
    }

    return items;
  }

  private getIconForFile(filename: string): string {
    if (filename.includes('product')) {return '$(package)';}
    if (filename.includes('structure')) {return '$(file-directory)';}
    if (filename.includes('tech')) {return '$(tools)';}
    if (filename.includes('project')) {return '$(settings-gear)';}
    return '$(file)';
  }
}

class SteeringItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly resourceUri?: vscode.Uri,
    iconId?: string
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;
    
    if (iconId) {
      this.iconPath = new vscode.ThemeIcon(iconId.replace('$(', '').replace(')', ''));
    }

    if (resourceUri && contextValue === 'file') {
      this.command = {
        command: 'musubi.openSteering',
        title: 'Open File',
        arguments: [this],
      };
      this.tooltip = resourceUri.fsPath;
    }
  }
}
