import * as vscode from 'vscode';
import { scanCode } from './scanner';
import { VulnerabilityCodeLensProvider } from './codelens';

export function activate(
    context: vscode.ExtensionContext
) {

    // register CodeLens provider
    const codeLensProvider =
        new VulnerabilityCodeLensProvider();

    vscode.languages.registerCodeLensProvider(
        { language: 'java' },
        codeLensProvider
    );

    // command scan
    let disposable =
        vscode.commands.registerCommand(
            'llm-vuln-detector.scan',
            async () => {
                await scanCode(codeLensProvider);
            }
        );

    context.subscriptions.push(disposable);
}

export function deactivate() {}