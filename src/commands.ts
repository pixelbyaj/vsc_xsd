import * as vscode from 'vscode';
import { State } from './models';
import { createJsonDocumentWithContent, createWebView, executeWebRequest, formatJson } from './helpers';
import { Logger } from './logging';
import { startServer } from './server';
import XsdTreeProvider from './treeView/xsdTree';

const { window } = vscode;
export async function xsdToJSONHandler() {

    const editor = window.activeTextEditor;
    if (editor && editor.document.languageId === 'xml' && editor.document.fileName.endsWith('.xsd')) {
        window.showInformationMessage("Conversion is in progress...");
        try {
            const response = await executeWebRequest(editor.document.getText());
            if (response.status === 200) {
                const responseData = response.data;
                if (responseData !== null || responseData !== '') {
                    const jsonResult = formatJson(responseData);
                    createJsonDocumentWithContent(jsonResult);
                    const treeDataProvider = new XsdTreeProvider(responseData);
                    const treeView = vscode.window.createTreeView('xsdTree', {
                        treeDataProvider,
                    });
                    window.showInformationMessage("Conversion completed successfully.");
                }
                else {
                    window.showErrorMessage(`There is something wrong with the XSD`);
                }
            } else {
                window.showErrorMessage(`API request failed with status ${response.status}`);
            }
        } catch (error: any) {
            window.showErrorMessage('Executable failed with exit code ' + error.message);
            Logger.info('Executable failed with exit code ' + error.message, false, "Error Message");
        }

    } else {
        window.showInformationMessage('This command is only available for XSD files.');
        Logger.info('This command is only available for XSD files.', false, "Information");
    }
    return State.extensionContext;
};


export async function xsdToFormHandler() {
    const editor = window.activeTextEditor;
    if (editor && editor.document.languageId === 'xml' && editor.document.fileName.endsWith('.xsd')) {
        window.showInformationMessage("Conversion is in progress...");
        startServer();
        const result = await executeWebRequest(editor.document.getText());
        const treeDataProvider = new XsdTreeProvider(result.data);
        const treeView = vscode.window.createTreeView('xsdTree', {
            treeDataProvider,
        });
        createWebView("http://localhost:8080/", "XSD Form", "1", result.data);
        window.showInformationMessage("Conversion has been completed...");
    } else {
        window.showInformationMessage('This command is only available for XSD files.');
    }
    return State.extensionContext;
}
