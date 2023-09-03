"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const fs = require("fs/promises");
const path = require("path");
const vscode = require("vscode");
const replaceInFile = async (filePath) => {
    const content = await fs.readFile(filePath, "utf-8");
    const newContent = content.replace(/(\w+)={\'(.*?)\'}/g, "$1='$2'");
    console.log(newContent);
    await fs.writeFile(filePath, newContent, "utf-8");
};
const replaceProps = async (directoryPath) => {
    console.log('test4');
    const files = await fs.readdir(directoryPath);
    console.log(files);
    for (const file of files) {
        console.log('99');
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await replaceProps(filePath).catch(console.error);
            return;
        }
        if (path.extname(filePath) === ".tsx") {
            console.log("test1");
            await replaceInFile(filePath);
            return;
        }
    }
};
const organizePropsCallback = async (folder) => {
    console.log('test');
    if (!folder.fsPath) {
        console.error("No folder selected");
        return;
    }
    console.log('test');
    await replaceProps(folder.fsPath).catch(console.error);
};
function activate(context) {
    console.log('activate');
    const disposable = vscode.commands.registerCommand("extension.organizeProps", organizePropsCallback);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map