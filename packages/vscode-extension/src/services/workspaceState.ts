/**
 * Workspace State Service
 * 
 * Manages extension state and configuration
 */

import * as vscode from 'vscode';
import { Logger } from '../utils/logger';

export interface ProjectState {
  isMusubiProject: boolean;
  platform: string | null;
  version: string | null;
  lastValidation: Date | null;
  complianceScore: number | null;
}

export class WorkspaceState {
  private context: vscode.ExtensionContext;
  private stateKey = 'musubi.projectState';

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Get current project state
   */
  getState(): ProjectState {
    return this.context.workspaceState.get<ProjectState>(this.stateKey, {
      isMusubiProject: false,
      platform: null,
      version: null,
      lastValidation: null,
      complianceScore: null,
    });
  }

  /**
   * Update project state
   */
  async updateState(partial: Partial<ProjectState>): Promise<void> {
    const current = this.getState();
    const updated = { ...current, ...partial };
    await this.context.workspaceState.update(this.stateKey, updated);
    Logger.debug(`State updated: ${JSON.stringify(partial)}`);
  }

  /**
   * Set platform
   */
  async setPlatform(platform: string): Promise<void> {
    await this.updateState({ platform });
  }

  /**
   * Set compliance score
   */
  async setComplianceScore(score: number): Promise<void> {
    await this.updateState({ 
      complianceScore: score,
      lastValidation: new Date(),
    });
  }

  /**
   * Mark as MUSUBI project
   */
  async markAsMusubiProject(isMusubi = true): Promise<void> {
    await this.updateState({ isMusubiProject: isMusubi });
  }

  /**
   * Reset state
   */
  async reset(): Promise<void> {
    await this.context.workspaceState.update(this.stateKey, undefined);
    Logger.info('Workspace state reset');
  }
}
