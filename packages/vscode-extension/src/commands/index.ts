/**
 * Command Registration
 */

import * as vscode from 'vscode';
import { WorkspaceState } from '../services/workspaceState';
import { SteeringTreeProvider } from '../providers/steeringTreeProvider';
import { RequirementsTreeProvider } from '../providers/requirementsTreeProvider';
import { TasksTreeProvider } from '../providers/tasksTreeProvider';
import { SkillsTreeProvider } from '../providers/skillsTreeProvider';
import { StatusBarManager } from '../views/statusBar';
import { initProject } from './init';
import { validateConstitution, validateScore } from './validate';
import { generateRequirements } from './requirements';
import { generateDesign } from './design';
import { generateTasks } from './tasks';
import { selectAgent } from './agent';
import { syncSteering } from './sync';
import { analyzeCodebase } from './analyze';

export interface Providers {
  steeringProvider: SteeringTreeProvider;
  requirementsProvider: RequirementsTreeProvider;
  tasksProvider: TasksTreeProvider;
  skillsProvider: SkillsTreeProvider;
  statusBarManager?: StatusBarManager;
}

export function registerCommands(
  context: vscode.ExtensionContext,
  state: WorkspaceState,
  providers: Providers
): void {
  const commands = [
    {
      id: 'musubi.init',
      handler: () => initProject(state, providers),
    },
    {
      id: 'musubi.validate',
      handler: () => validateConstitution(state),
    },
    {
      id: 'musubi.validateScore',
      handler: () => validateScore(state, providers.statusBarManager),
    },
    {
      id: 'musubi.requirements',
      handler: () => generateRequirements(),
    },
    {
      id: 'musubi.design',
      handler: () => generateDesign(),
    },
    {
      id: 'musubi.tasks',
      handler: () => generateTasks(),
    },
    {
      id: 'musubi.selectAgent',
      handler: () => selectAgent(state),
    },
    {
      id: 'musubi.sync',
      handler: () => syncSteering(providers),
    },
    {
      id: 'musubi.analyze',
      handler: () => analyzeCodebase(),
    },
    {
      id: 'musubi.openSteering',
      handler: (item?: { resourceUri?: vscode.Uri }) => {
        if (item?.resourceUri) {
          vscode.window.showTextDocument(item.resourceUri);
        }
      },
    },
    {
      id: 'musubi.refresh',
      handler: () => {
        providers.steeringProvider.refresh();
        providers.requirementsProvider.refresh();
        providers.tasksProvider.refresh();
        providers.skillsProvider.refresh();
        providers.statusBarManager?.update();
      },
    },
  ];

  for (const cmd of commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(cmd.id, cmd.handler)
    );
  }
}
