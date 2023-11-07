import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SchemaElement, XsdTreeItem } from '../models/schemaElement';

export default class XsdTreeProvider implements vscode.TreeDataProvider<XsdTreeItem> {

    constructor(private xsdJSON: SchemaElement) { }

    getTreeItem(element: XsdTreeItem): XsdTreeItem {
        return element;
    }

    getChildren(element?: XsdTreeItem): Thenable<XsdTreeItem[]> {
        // Implement this method to return an array of tree items.
        if (!this.xsdJSON) {
            debugger;
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            
            if (element.node === null) {
                return Promise.resolve([]);
            }

            if (element.node.elements.length > 0) {
                return Promise.resolve(
                    this.getNodesFromJson(element.node.elements)
                );
            } else {
                return Promise.resolve(
                    this.getNodesAttributes(element.node)
                );
            }
        } else {
            const rootNode = new XsdTreeItem(this.xsdJSON.name, this.xsdJSON, vscode.TreeItemCollapsibleState.Expanded);
            return Promise.resolve([rootNode]);
        }
    }

    private getNodesFromJson(nodes: SchemaElement[]): XsdTreeItem[] {

        const treeItem: XsdTreeItem[] = [];
        nodes.forEach((node: SchemaElement) => {
            treeItem.push(new XsdTreeItem(node.name, structuredClone(node), vscode.TreeItemCollapsibleState.Collapsed,undefined));
        });
        return treeItem;
    }
    private getNodesAttributes(node: any): XsdTreeItem[] {

        const treeItem: XsdTreeItem[] = [];
        Object.keys(node).forEach((key) => {
            let value = node[key];
            if(value === null || value.length === 0){
                value = 'null';
            }   
            treeItem.push(new XsdTreeItem(key, null, vscode.TreeItemCollapsibleState.None, value));
        });
        return treeItem;
    }

}