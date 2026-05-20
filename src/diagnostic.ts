import * as vscode from 'vscode';

const diagnosticCollection =
    vscode.languages.createDiagnosticCollection(
        "sql-injection"
    );

export function updateDiagnostics(
    editor: vscode.TextEditor,
    code: string,
    llmResult: string
) {

    const diagnostics: vscode.Diagnostic[] = [];

    const regex =
        /Function:\s*(\w+)[\s\S]*?Answer:\s*Vulnerable/g;

    let match;

    while ((match = regex.exec(llmResult)) !== null) {

        const functionName = match[1];

        // cari function di code Java
        const fnRegex = new RegExp(
            `\\b${functionName}\\s*\\(`,
            "g"
        );

        const fnMatch = fnRegex.exec(code);

        if (!fnMatch) {
            continue;
        }

        const startPos =
            editor.document.positionAt(
                fnMatch.index
            );

        const endPos =
            editor.document.positionAt(
                fnMatch.index + functionName.length
            );

        const range =
            new vscode.Range(startPos, endPos);

        const diagnostic =
            new vscode.Diagnostic(
                range,
                `SQL Injection detected in function: ${functionName}`,
                vscode.DiagnosticSeverity.Warning
            );

        diagnostic.source =
            "LLM Vulnerability Detector";

        diagnostics.push(diagnostic);
    }

    diagnosticCollection.set(
        editor.document.uri,
        diagnostics
    );
}