import * as vscode from 'vscode';
import * as path from 'path';
export class XsdTreeItem extends vscode.TreeItem {
    constructor(
        public nodeName: string,
        public node: SchemaElement | null,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public description?: string,
    ) {
        super(nodeName, collapsibleState);
        this.tooltip = nodeName;
        this.description = description === undefined ? node?.xpath : description;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}

export interface SchemaElement {
    id: string;
    name: string;
    dataType: string;
    minOccurs: string;
    maxOccurs: string;
    minLength: string;
    maxLength: string;
    pattern: string;
    fractionDigits: string;
    totalDigits: string;
    minInclusive: string;
    maxInclusive: string;
    values: string[];
    isCurrency: boolean;
    xpath: string;
    elements: SchemaElement[];
}