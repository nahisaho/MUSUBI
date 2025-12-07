import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('nahisaho.musubi-sdd'));
  });

  test('Should activate extension', async () => {
    const ext = vscode.extensions.getExtension('nahisaho.musubi-sdd');
    assert.ok(ext);
    
    if (!ext.isActive) {
      await ext.activate();
    }
    assert.ok(ext.isActive);
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    
    const musubiCommands = [
      'musubi.init',
      'musubi.validate',
      'musubi.sync',
      'musubi.requirements',
      'musubi.design',
      'musubi.tasks',
      'musubi.analyze',
      'musubi.agent',
      'musubi.refresh',
      'musubi.openFile',
    ];

    for (const cmd of musubiCommands) {
      assert.ok(
        commands.includes(cmd),
        `Command ${cmd} should be registered`
      );
    }
  });

  test('Views should be registered', () => {
    // Views are registered via contributes in package.json
    // This test verifies the extension loaded correctly
    const ext = vscode.extensions.getExtension('nahisaho.musubi-sdd');
    assert.ok(ext);
    
    const contributes = ext.packageJSON.contributes;
    assert.ok(contributes.views);
    assert.ok(contributes.views['musubi-sidebar']);
    
    const viewIds = contributes.views['musubi-sidebar'].map((v: { id: string }) => v.id);
    assert.ok(viewIds.includes('musubi-steering'));
    assert.ok(viewIds.includes('musubi-skills'));
  });
});
