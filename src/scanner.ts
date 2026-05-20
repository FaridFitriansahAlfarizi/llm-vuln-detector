import * as vscode from 'vscode';
import { analyzeWithLLM } from './llm';
import {
    showWarning,
    highlightVulnerableFunctions
} from './highlight';
import { updateDiagnostics } from './diagnostic';

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

    console.log("\n===== LLM RESULT =====");
    console.log(llmResult);
    console.log("======================");

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