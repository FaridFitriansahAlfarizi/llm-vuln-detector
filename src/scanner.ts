import * as vscode from 'vscode';
import { analyzeWithLLM } from './llm';
import { calculateSimilarity } from './similarity';
import { showWarning } from './highlight';

export async function scanCode() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage("No file open");
        return;
    }

    const code = editor.document.getText();

    vscode.window.showInformationMessage("Scanning vulnerability...");

    // call LLM
    const llmResult = await analyzeWithLLM(code);

    // similarity
    const result = calculateSimilarity(llmResult);

    // show result
    showWarning(result);
}