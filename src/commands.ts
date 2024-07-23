import * as vscode from "vscode";
import { State } from "./models";
import {
  createJsonDocumentWithContent,
  executeXsdRequest,
  formatJson,
} from "./helpers";
import { Logger } from "./logging";
// eslint-disable-next-line @typescript-eslint/naming-convention
import XsdTreeProvider from "./treeView/xsdTree";

const { window } = vscode;
export async function xsdToJSONHandler() {
  const editor = window.activeTextEditor;
  if (
    editor &&
    editor.document.languageId === "xml" &&
    editor.document.fileName.endsWith(".xsd")
  ) {
    window.showInformationMessage("Conversion is in progress ...");
    try {
      const response = await executeXsdRequest(editor.document.fileName);
      if (response) {
        const parseJson = JSON.parse(response);
        const jsonResult = formatJson(parseJson);
        createJsonDocumentWithContent(jsonResult);
        const treeDataProvider = new XsdTreeProvider(response);
        const treeView = vscode.window.createTreeView("xsdTree", {
          treeDataProvider,
        });
        window.showInformationMessage("Conversion completed successfully.");
      } else {
        window.showErrorMessage(`There is something wrong with the XSD`);
      }
    } catch (error: any) {
      window.showErrorMessage(
        "Executable failed with exit code " + error.message
      );
      Logger.info(
        "Executable failed with exit code " + error.message,
        false,
        "Error Message"
      );
    }
  } else {
    window.showInformationMessage(
      "This command is only available for XSD files."
    );
    Logger.info(
      "This command is only available for XSD files.",
      false,
      "Information"
    );
  }
  return State.extensionContext;
}

export async function xsdToTreeHandler() {
  const editor = window.activeTextEditor;
  if (
    editor &&
    editor.document.languageId === "xml" &&
    editor.document.fileName.endsWith(".xsd")
  ) {
    window.showInformationMessage("Conversion is in progress...");
    const result = await executeXsdRequest(editor.document.fileName);
    if (result) {
      const parseJson = JSON.parse(result);
      const treeDataProvider = new XsdTreeProvider(parseJson);
      const treeView = vscode.window.createTreeView("xsdTree", {
        treeDataProvider,
      });
      window.showInformationMessage("Conversion has been completed...");
    } else {
      window.showInformationMessage(
        "This command is only available for XSD files."
      );
    }
    return State.extensionContext;
  }
}
