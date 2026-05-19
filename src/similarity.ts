export function calculateSimilarity(text: string) {

    // dummy score dulu
    const score = 0.91;

    return {
        vulnerable: true,
        source: "getParameter",
        sink: "executeQuery",
        score: score
    };
}