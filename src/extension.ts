// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "XSD Essentials" is now active!');
	
	const executeProcess = async (document:vscode.TextDocument) => {		
		const configuration = vscode.workspace.getConfiguration('Xsd');
		const apiUrl = configuration.get('apiUrl','https://www.pixelbyaj.com/api/XsdToJson');		
		const outputChannel = vscode.window.createOutputChannel('Executable Output');
		let outputContent = '';
		try{
			const response = await axios.post(apiUrl, document.getText(), {
				headers: {
					'Content-Type': 'application/xml', // Adjust the content type if needed
				},
			});

            if (response.status === 200) {
                const responseData = response.data;
				if (responseData !== null || responseData !== ''){
                	const jsonResult = formatJson(responseData);				
					createJsonDocumentWithContent(jsonResult);
					vscode.window.showInformationMessage("Conversion completed successfully.");
				}
				else{
					vscode.window.showErrorMessage(`There is something wrong with the XSD`);
				}
            } else {
                vscode.window.showErrorMessage(`API request failed with status ${response.status}`);
            }

		}catch(error: any)
		{
			vscode.window.showErrorMessage('Executable failed with exit code ' + error.message);
			outputChannel.show(true);
		}		
		
	};
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('xsd.xsdtojson', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.document.languageId === 'xml' && editor.document.fileName.endsWith('.xsd')) {
			vscode.window.showInformationMessage("Conversion is in progress...");
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			executeProcess(editor.document);			
		} else {
			vscode.window.showInformationMessage('This command is only available for XSD files.');
		}
	});
	context.subscriptions.push(disposable);
}


export function createJsonDocumentWithContent(content: string) {
	return vscode.workspace.openTextDocument({ content, language: 'json' }).then(doc => {
		return vscode.window.showTextDocument(doc);
	});
}

function formatJson(json: any): string {
    try {        
        const formattedJson = JSON.stringify(json, null, 4);
        return formattedJson;
    } catch (error:any) {
        vscode.window.showErrorMessage('Error formatting JSON: ' + error.message);
        return json;
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }
