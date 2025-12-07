/**
 * Skills Tree Provider
 * 
 * Displays available MUSUBI skills in the explorer
 */

import * as vscode from 'vscode';
import * as path from 'path';
// Skills are loaded dynamically from workspace

export class SkillsTreeProvider implements vscode.TreeDataProvider<SkillItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SkillItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SkillItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SkillItem): Promise<SkillItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [];
    }

    if (!element) {
      return this.getRootItems(workspaceRoot);
    }

    return [];
  }

  private async getRootItems(workspaceRoot: string): Promise<SkillItem[]> {
    const items: SkillItem[] = [];

    // Check for .claude/skills directory (Claude Code)
    const claudeSkillsPath = path.join(workspaceRoot, '.claude', 'skills');
    let hasClaudeSkills = false;
    
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(claudeSkillsPath));
      hasClaudeSkills = true;
    } catch {
      // No Claude skills directory
    }

    // Check for AGENTS.md (other platforms)
    const agentsLocations = [
      '.github/AGENTS.md',
      '.cursor/AGENTS.md',
      '.windsurf/AGENTS.md',
      '.codex/AGENTS.md',
      '.qwen/AGENTS.md',
    ];

    let hasAgentsMd = false;
    for (const loc of agentsLocations) {
      try {
        await vscode.workspace.fs.stat(vscode.Uri.file(path.join(workspaceRoot, loc)));
        hasAgentsMd = true;
        break;
      } catch {
        // Not found
      }
    }

    // Check for CLAUDE.md
    let hasClaudeMd = false;
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(workspaceRoot, 'CLAUDE.md')));
      hasClaudeMd = true;
    } catch {
      // Not found
    }

    if (hasClaudeSkills || hasClaudeMd || hasAgentsMd) {
      // Show available skills organized by category
      const categories: Record<string, string[]> = {
        'Core': ['orchestrator', 'steering', 'constitution-enforcer'],
        'Analysis': ['requirements-analyst', 'system-architect', 'traceability-auditor', 'change-impact-analyzer'],
        'Development': ['software-developer', 'test-engineer', 'code-reviewer', 'bug-hunter'],
        'Operations': ['devops-engineer', 'site-reliability-engineer', 'release-coordinator'],
        'Security': ['security-auditor'],
        'Data': ['database-administrator', 'database-schema-designer'],
        'Design': ['api-designer', 'ui-ux-designer', 'cloud-architect'],
        'AI': ['ai-ml-engineer'],
        'Documentation': ['technical-writer', 'project-manager', 'quality-assurance'],
        'Automation': ['agent-assistant', 'issue-resolver', 'performance-optimizer'],
      };

      for (const [category, skills] of Object.entries(categories)) {
        items.push(
          new SkillItem(
            `${category} (${skills.length})`,
            vscode.TreeItemCollapsibleState.Collapsed,
            'category',
            undefined,
            skills
          )
        );
      }
    } else {
      items.push(
        new SkillItem(
          'Run "MUSUBI: Initialize Project" to setup skills',
          vscode.TreeItemCollapsibleState.None,
          'info',
          undefined,
          undefined
        )
      );
    }

    return items;
  }
}

class SkillItem extends vscode.TreeItem {
  public skills?: string[];

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly resourceUri?: vscode.Uri,
    skills?: string[]
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;
    this.skills = skills;

    if (contextValue === 'category') {
      this.iconPath = new vscode.ThemeIcon('folder');
    } else if (contextValue === 'skill') {
      this.iconPath = new vscode.ThemeIcon('symbol-method');
    } else {
      this.iconPath = new vscode.ThemeIcon('info');
    }
  }
}
