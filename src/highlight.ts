import * as vscode from 'vscode';

export function showWarning(result: string) {

    if (result.includes("Answer: Vulnerable")) {
        vscode.window.showWarningMessage(
            "⚠ SQL Injection Vulnerability Detected"
        );
    } else {
        vscode.window.showInformationMessage(
            "✅ No SQL Injection Vulnerability Detected"
        );
    }
}