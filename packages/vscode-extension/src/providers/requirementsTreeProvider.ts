/**
 * Requirements Tree Provider
 * 
 * Displays requirements in the explorer
 */

import * as vscode from 'vscode';
import * as path from 'path';

export class RequirementsTreeProvider implements vscode.TreeDataProvider<RequirementItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RequirementItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RequirementItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RequirementItem): Promise<RequirementItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [];
    }

    if (!element) {
      return this.getRootItems(workspaceRoot);
    }

    return [];
  }

  private async getRootItems(workspaceRoot: string): Promise<RequirementItem[]> {
    const items: RequirementItem[] = [];
    const specsPath = path.join(workspaceRoot, 'storage', 'specs');

    try {
      const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(specsPath));
      
      for (const [name, type] of entries) {
        if (type === vscode.FileType.File && name.startsWith('REQ-') && name.endsWith('.md')) {
          const filePath = path.join(specsPath, name);
          const priority = this.extractPriority(name);
          
          items.push(
            new RequirementItem(
              name.replace('.md', ''),
              vscode.TreeItemCollapsibleState.None,
              'requirement',
              vscode.Uri.file(filePath),
              priority
            )
          );
        }
      }

      // Also check requirements subdirectory
      const reqSubPath = path.join(specsPath, 'requirements');
      try {
        const subEntries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(reqSubPath));
        for (const [name, type] of subEntries) {
          if (type === vscode.FileType.File && name.endsWith('.md')) {
            const filePath = path.join(reqSubPath, name);
            items.push(
              new RequirementItem(
                name.replace('.md', ''),
                vscode.TreeItemCollapsibleState.None,
                'requirement',
                vscode.Uri.file(filePath),
                'P2'
              )
            );
          }
        }
      } catch {
        // Subdirectory doesn't exist
      }

      // Also check docs/requirements
      const docsReqPath = path.join(workspaceRoot, 'docs', 'requirements');
      try {
        const docsEntries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(docsReqPath));
        for (const [name, type] of docsEntries) {
          if (type === vscode.FileType.File && name.endsWith('.md')) {
            const filePath = path.join(docsReqPath, name);
            const priority = this.extractPriority(name);
            items.push(
              new RequirementItem(
                name.replace('.md', ''),
                vscode.TreeItemCollapsibleState.None,
                'requirement',
                vscode.Uri.file(filePath),
                priority
              )
            );
          }
        }
      } catch {
        // docs/requirements doesn't exist
      }

    } catch {
      items.push(
        new RequirementItem(
          'No requirements found',
          vscode.TreeItemCollapsibleState.None,
          'info',
          undefined,
          undefined
        )
      );
    }

    // Sort by priority
    items.sort((a, b) => {
      if (a.priority && b.priority) {
        return a.priority.localeCompare(b.priority);
      }
      return 0;
    });

    return items;
  }

  private extractPriority(filename: string): string {
    const match = filename.match(/P(\d)/);
    return match ? `P${match[1]}` : 'P2';
  }
}

class RequirementItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly resourceUri?: vscode.Uri,
    public readonly priority?: string
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;

    if (priority) {
      this.description = priority;
      this.iconPath = new vscode.ThemeIcon(
        priority === 'P0' ? 'error' : priority === 'P1' ? 'warning' : 'info',
        new vscode.ThemeColor(
          priority === 'P0' ? 'errorForeground' : 
          priority === 'P1' ? 'editorWarning.foreground' : 
          'editorInfo.foreground'
        )
      );
    } else {
      this.iconPath = new vscode.ThemeIcon('file-text');
    }

    if (resourceUri && contextValue === 'requirement') {
      this.command = {
        command: 'vscode.open',
        title: 'Open Requirement',
        arguments: [resourceUri],
      };
      this.tooltip = resourceUri.fsPath;
    }
  }
}
