import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposableFile = vscode.commands.registerCommand('organizeProps.organizeFileProps', async (file: vscode.Uri) => {
    await organizeProps(file);
  });

  const disposableFolder = vscode.commands.registerCommand('organizeProps.organizeFolderProps', async (folder: vscode.Uri) => {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: "Organizing Props in Folder"
      },
      async () => {
        const files = await getTsxFilesInFolder(folder);
        return Promise.all(files.map(organizeProps));
      });
  });

  context.subscriptions.push(disposableFile, disposableFolder);
}

async function getTsxFilesInFolder(dir: vscode.Uri): Promise<ReadonlyArray<vscode.Uri>> {
  return vscode.workspace.findFiles(
    new vscode.RelativePattern(dir.fsPath, '**/*.tsx'),
    '**/node_modules/**'
  );
}

async function organizeProps(file: vscode.Uri) {
  const document = await vscode.workspace.openTextDocument(file);
  const content = document.getText();
  const newContent = content.replace(/(\w+)={\'(.*?)\'}/g, "$1='$2'");
  
  if (newContent !== content) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      file,
      new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end),
      newContent
    );
    await vscode.workspace.applyEdit(edit);
  }
}
