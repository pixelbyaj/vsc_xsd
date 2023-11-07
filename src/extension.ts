// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from './models/enums';
import { xsdToFormHandler, xsdToJSONHandler } from './commands';
import { State } from './models';
import { Logger } from './logging';
import { stopServer } from './server';

const { commands } = vscode;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	State.extensionContext = context;
	console.log('Congratulations, your extension "XSD Essentials" is now active!');
	registerCommands();
	addSubscriptions();
}

function registerCommands() {
	commands.registerCommand(Commands.xsdToJson, xsdToJSONHandler);
	commands.registerCommand(Commands.xsdToForm, xsdToFormHandler);
}
function addSubscriptions() {
	State.extensionContext.subscriptions.push(Logger.getChannel());

}


// This method is called when your extension is deactivated
export function deactivate() { 
	stopServer();
}
