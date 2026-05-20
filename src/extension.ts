import * as vscode from 'vscode';
import { scanCode } from './scanner';

export function activate(
    context: vscode.ExtensionContext
) {

    // command scan
    let disposable =
        vscode.commands.registerCommand(
            'llm-vuln-detector.scan',
            async () => {
                await scanCode();
            }
        );

    context.subscriptions.push(disposable);
}

export function deactivate() {}