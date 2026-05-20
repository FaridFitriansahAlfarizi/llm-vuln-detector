import * as vscode from 'vscode';

export interface VulnerabilityInfo {
    functionName: string;
    vulnerable: boolean;
}

export class VulnerabilityCodeLensProvider
    implements vscode.CodeLensProvider {

    private vulnerabilities: VulnerabilityInfo[] = [];

    // refresh event
    private _onDidChangeCodeLenses =
        new vscode.EventEmitter<void>();

    readonly onDidChangeCodeLenses =
        this._onDidChangeCodeLenses.event;

    public update(vulns: VulnerabilityInfo[]) {
        this.vulnerabilities = vulns;

        // trigger refresh
        this._onDidChangeCodeLenses.fire();
    }

    provideCodeLenses(
        document: vscode.TextDocument
    ): vscode.CodeLens[] {

        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();

        for (const vuln of this.vulnerabilities) {

            const regex = new RegExp(
                `\\b${vuln.functionName}\\s*\\(`,
                "g"
            );

            const match = regex.exec(text);

            if (match) {

                const position =
                    document.positionAt(match.index);

                const range =
                    new vscode.Range(position, position);

                const title = vuln.vulnerable
                    ? "⚠ Vulnerable (SQL Injection)"
                    : "✅ Not Vulnerable";

                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title,
                        command: ""
                    })
                );
            }
        }

        return codeLenses;
    }
}