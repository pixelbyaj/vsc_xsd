// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from './models/enums';
import { xsdToTreeHandler, xsdToJSONHandler, clearXsdTreeHandler } from './commands';
import { State } from './models';
import { Logger } from './logging';

const { commands } = vscode;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	State.extensionContext = context;
	console.log('Congratulations, your extension "XSD Essentials" is now active!');
	registerCommands();
	addSubscriptions();

	vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === 'xml' && editor?.document.fileName.endsWith('.xsd')) {
            // This code runs whenever a file tab gets focused
           xsdToTreeHandler();
        }
    });

	vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'xml' && document.fileName.endsWith('.xsd')) {
            // This code runs whenever a file gets open
           xsdToTreeHandler();
        }
    });

    vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'xml' && document.fileName.endsWith('.xsd')) {
            // This code runs whenever a file gets open
            clearXsdTreeHandler();
        }
    });
}

function registerCommands() {
	commands.registerCommand(Commands.xsdToJson, xsdToJSONHandler);
	commands.registerCommand(Commands.xsdToTree, xsdToTreeHandler);
}
function addSubscriptions() {
	State.extensionContext.subscriptions.push(Logger.getChannel());

}


// This method is called when your extension is deactivated
export function deactivate() { }
