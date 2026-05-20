import * as vscode from 'vscode';
import { analyzeWithLLM } from './llm';
import {
    showWarning,
    highlightVulnerableFunctions
} from './highlight';
import { updateDiagnostics } from './diagnostic';

const outputChannel =
    vscode.window.createOutputChannel(
        "LLM Vulnerability Detector"
    );

export async function scanCode() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage("No file open");
        return;
    }

    const code = editor.document.getText();

    vscode.window.showInformationMessage(
        "Scanning vulnerability..."
    );

    // call LLM
    const llmResult = await analyzeWithLLM(code);

    outputChannel.clear();

    outputChannel.appendLine(
        "===== LLM RESULT ====="
    );

    outputChannel.appendLine(llmResult);

    outputChannel.appendLine(
        "======================"
    );

    outputChannel.show(true);

    showWarning(llmResult);

    highlightVulnerableFunctions(
        editor,
        code,
        llmResult
    );

    updateDiagnostics(
        editor,
        code,
        llmResult
    );
}