import * as vscode from 'vscode';
import { Settings, State } from './models';
import { apiURL, xmlContentType } from './models/constants';
import axios, { AxiosResponse } from 'axios';

const { window } = vscode;

export async function executeWebRequest(document: string): Promise<AxiosResponse<any, any>> {
    const configuration = vscode.workspace.getConfiguration('Xsd');
    const apiUrl = configuration.get(Settings.apiUrl, apiURL);
    const headers = {
        headers: {
            'Content-Type': xmlContentType, // Adjust the content type if needed
        }
    };
    return axios.post(apiUrl, document, headers);
};

export async function createJsonDocumentWithContent(content: string) {
    const doc = await vscode.workspace.openTextDocument({ content, language: 'json' });
    return window.showTextDocument(doc, vscode.ViewColumn.Two);
}

export function formatJson(json: any): string {
    try {
        const formattedJson = JSON.stringify(json, null, 4);
        return formattedJson;
    } catch (error: any) {
        window.showErrorMessage('Error formatting JSON: ' + error.message);
        return json;
    }
}

export async function createWebView(url: string, title: string, uniqueId: string, jsonResult: string) {
    // Define a title and an ID for your WebView panel
    const panel = vscode.window.createWebviewPanel(
        uniqueId, // WebView panel ID
        `${title} ${uniqueId}`, // Title of the panel
        vscode.ViewColumn.Two, // Display in the sidebar in the first column
        {
            enableScripts: true, // Enable JavaScript in the WebView
            localResourceRoots: [vscode.Uri.file(State.extensionContext.extension.extensionPath)],
        }
    );
    panel.webview.html = getWebviewContent(url);
    setTimeout(() => {
        panel.webview.postMessage(jsonResult);
    });
}

function getWebviewContent(htmlUrl: string) {
    return `
    <style>html, body { height: 100%; margin: 0;padding: 0 !important; }iframe{border:0;}</style>
    <script>
        window.addEventListener('message', (event) => {
            const message = event.data;
            // Check if the received message is the JSON data
            if (message) {
                const childFrame = document.getElementById('webViewIframe');
                // Send a message to the child iframe
                childFrame.contentWindow.postMessage(message, '*');
            }
        });

    </script>
    <iframe src="${htmlUrl}" width="100%" height="700px" border="0" id="webViewIframe"></iframe>`;
}