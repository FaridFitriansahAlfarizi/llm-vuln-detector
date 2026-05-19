import * as vscode from 'vscode';

export function showWarning(result: string) {
    const vulnerableCount =
        (result.match(/Answer:\s*Vulnerable/g) || []).length;

    if (vulnerableCount > 0) {
        vscode.window.showWarningMessage(
            `⚠ ${vulnerableCount} SQL Injection Vulnerability Detected`
        );
    } else {
        vscode.window.showInformationMessage(
            "✅ No SQL Injection Vulnerability Detected"
        );
    }
}

export function highlightVulnerableFunctions(
    editor: vscode.TextEditor,
    code: string,
    llmResult: string
) {
    const vulnerableFunctions: string[] = [];

    const resultRegex =
        /Function:\s*(\w+)[\s\S]*?Answer:\s*Vulnerable/g;

    let match;

    while ((match = resultRegex.exec(llmResult)) !== null) {
        vulnerableFunctions.push(match[1]);
    }

    const decorations: vscode.DecorationOptions[] = [];

    for (const fn of vulnerableFunctions) {

        console.log("Searching function:", fn);

        // regex lebih longgar
        const fnRegex = new RegExp(
            `\\b${fn}\\s*\\([^)]*\\)[\\s\\S]*?\\{`,
            "m"
        );

        const fnMatch = fnRegex.exec(code);

        if (!fnMatch) {
            console.log("NOT FOUND:", fn);
            continue;
        }

        const start = fnMatch.index;

        let braceCount = 0;
        let end = start;

        let foundOpening = false;

        for (let i = start; i < code.length; i++) {
            if (code[i] === "{") {
                braceCount++;
                foundOpening = true;
            }

            if (code[i] === "}") {
                braceCount--;
            }

            if (foundOpening && braceCount === 0) {
                end = i + 1;
                break;
            }
        }

        const startPos =
            editor.document.positionAt(start);

        const endPos =
            editor.document.positionAt(end);

        decorations.push({
            range: new vscode.Range(startPos, endPos),
            hoverMessage: `⚠ Vulnerable Function: ${fn}`
        });
    }

    const decorationType =
        vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255,0,0,0.15)",
            isWholeLine: true,

            // marker di minimap / scrollbar kanan
            overviewRulerColor: "red",
            overviewRulerLane:
                vscode.OverviewRulerLane.Full
        });

    editor.setDecorations(
        decorationType,
        decorations
    );

    if (decorations.length > 0) {
        editor.revealRange(
            decorations[0].range,
            vscode.TextEditorRevealType.InCenter
        );
    }
}