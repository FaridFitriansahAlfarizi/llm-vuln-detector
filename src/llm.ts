import * as path from "path";
import * as dotenv from "dotenv";

// pakai absolute path ke root project
const envPath = path.resolve(__dirname, "../.env");
console.log("ENV PATH:", envPath);

dotenv.config({
  path: envPath,
  override: true
});

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function analyzeWithLLM(code: string): Promise<string> {
  try {

    const prompt = `
You are a security analyst specialized in detecting SQL Injection vulnerabilities in Java code.

TASK
Analyze the given Java code and determine whether SQL Injection vulnerabilities exist.

The code may contain multiple functions (methods).
You MUST analyze EACH function independently.

For every function you find, determine:

* the Source type
* the SQL Sink method
* the Sink classification
* the final vulnerability status

You MUST think step by step internally, but DO NOT show the reasoning in the output.

---

STRICT JULIET DEFINITIONS

* Only classify BadSource using the real acquisition mechanism shown in the code (e.g., Property, connect_tcp, URLConnection, Scanner, etc.).
* If the data is a hardcoded string literal, classify it as:

  GoodSource: A hardcoded string

Rules:

* Determine the source strictly from the actual data acquisition mechanism in the code.
* Do NOT use variable names as the source type.
* Do NOT use generic terms such as "user input" or "untrusted input".

---

SINK IDENTIFICATION

The sink must be the actual SQL method used in the code (e.g., execute, executeQuery, executeUpdate, prepareStatement, etc.).

Report the exact SQL method used in the function.

---

SINK CLASSIFICATION

BadSink:
If data is directly concatenated into the SQL string inside the SQL execution method.

GoodSink:
If a prepared statement is used correctly with parameter binding.

Classification rules:

* If a prepared statement is used correctly with "?" placeholders and parameter binding methods (such as setString, setInt, etc.), classify as:

  GoodSink: Use prepared statement and execute (properly)

* If concatenation occurs inside prepareStatement(), classify as:

  BadSink: prepareStatement

---

DECISION RULE

BadSource + BadSink = Vulnerable
All other combinations = Not Vulnerable

---

OUTPUT FORMAT

Analyze each function separately.

Use EXACTLY the following structure:

Function: <function_name>
1. <BadSource or GoodSource>: <one sentence explanation>
2. <BadSink or GoodSink>: <one sentence explanation>
Answer: <Vulnerable or Not Vulnerable>

---

RULES

* Each explanation must be exactly one sentence.
* Do NOT include internal reasoning steps.
* Do NOT add extra commentary.
* ONLY display functions that contain BOTH a valid Source and a valid SQL Sink.
* If a function does NOT contain both Source and Sink, DO NOT display that function.
* Repeat the structure only for valid functions.

---

Java Code:
${code}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0
    });

    return completion.choices[0].message.content || "No result";

  } catch (error) {
    console.error(error);
    return "LLM Error";
  }
}