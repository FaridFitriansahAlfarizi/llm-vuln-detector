import * as vscode from 'vscode';
import { analyzeWithLLM } from './llm';
import { showWarning } from './highlight';

export async function scanCode() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage("No file open");
        return;
    }

    const code = editor.document.getText();

    vscode.window.showInformationMessage("Scanning vulnerability...");

    const output = vscode.window.createOutputChannel("LLM Vuln Detector");
    output.clear();
    output.show(true);

    try {
        // call LLM
        const llmResult = await analyzeWithLLM(code);

        // tampilkan raw output
        output.appendLine("===== LLM RESULT =====");
        output.appendLine(llmResult);
        output.appendLine("======================");

        // tampilkan popup sederhana
        showWarning(llmResult);

    } catch (error) {
        output.appendLine("ERROR:");
        output.appendLine(String(error));
        vscode.window.showErrorMessage("Scan failed.");
    }
}