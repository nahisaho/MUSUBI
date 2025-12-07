/**
 * Analyze Command
 */

import * as vscode from 'vscode';
import { CliBridge } from '../services/cliBridge';
import { Logger } from '../utils/logger';

export async function analyzeCodebase(): Promise<void> {
  const analysisType = await vscode.window.showQuickPick(
    [
      { label: 'All', description: 'Complete analysis', value: 'all' },
      { label: 'Quality', description: 'Code quality metrics', value: 'quality' },
      { label: 'Dependencies', description: 'Dependency analysis', value: 'dependencies' },
      { label: 'Security', description: 'Security patterns', value: 'security' },
      { label: 'Stuck Detection', description: 'Detect stuck patterns', value: 'stuck' },
    ],
    {
      placeHolder: 'Select analysis type',
      title: 'MUSUBI: Analyze Codebase',
    }
  );

  if (!analysisType) {
    return;
  }

  const cli = new CliBridge();

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Running ${analysisType.label} analysis...`,
      cancellable: false,
    },
    async () => {
      return await cli.analyze(analysisType.value);
    }
  );

  if (result.success) {
    // Show analysis results in a new document
    const doc = await vscode.workspace.openTextDocument({
      content: result.stdout,
      language: 'markdown',
    });
    await vscode.window.showTextDocument(doc);
    
    Logger.info(`Analysis completed: ${analysisType.value}`);
  } else {
    vscode.window.showErrorMessage(
      `❌ Analysis failed: ${result.stderr || result.stdout}`
    );
    Logger.error('Analysis failed', new Error(result.stderr));
  }
}
