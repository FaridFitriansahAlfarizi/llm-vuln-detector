import * as vscode from 'vscode';

import { analyzeWithLLM } from './llm';

import {
    showWarning,
    highlightVulnerableFunctions
} from './highlight';

import {
    VulnerabilityCodeLensProvider
} from './codelens';

export async function scanCode(
    codeLensProvider: VulnerabilityCodeLensProvider
) {

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

    // =========================
    // PARSE RESULT FOR CODELENS
    // =========================

    const vulnerabilities = [];

    const regex =
        /Function:\s*(\w+)[\s\S]*?Answer:\s*(Vulnerable|Not Vulnerable)/g;

    let match;

    while ((match = regex.exec(llmResult)) !== null) {

        vulnerabilities.push({
            functionName: match[1],
            vulnerable:
                match[2] === "Vulnerable"
        });
    }

    // update codelens
    codeLensProvider.update(vulnerabilities);

    // =========================

    showWarning(llmResult);

    highlightVulnerableFunctions(
        editor,
        code,
        llmResult
    );
}