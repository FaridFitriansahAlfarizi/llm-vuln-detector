import * as vscode from 'vscode';

export function showWarning(result: any) {

    const output = vscode.window.createOutputChannel("LLM Vulnerability");

    output.clear();
    output.show(true);

    output.appendLine("⚠ SQL Injection Detected");
    output.appendLine("----------------------------");
    output.appendLine(`Source : ${result.source}`);
    output.appendLine(`Sink   : ${result.sink}`);
    output.appendLine(`Score  : ${result.score}`);
    output.appendLine(`Status : Vulnerable`);
}