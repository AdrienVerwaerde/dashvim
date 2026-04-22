import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildDashboardPrompt } from "@/lib/prompt-builder";
import { DashboardConfigSchema } from "@/lib/dashboard-schema";
import { WizardDataSchema } from "@/lib/wizard/schemas";

/**
 * Extracts a JSON string from a raw LLM response.
 * Handles three common cases:
 *   1. Pure JSON   → returned as-is
 *   2. ```json ... ``` fenced block
 *   3. ``` ... ``` generic fenced block
 * Falls back to the text between the first `{` and the last `}`.
 */
function extractJson(text: string): string {
  const trimmed = text.trim();

  // Case 1: fenced block with explicit json tag
  const fencedJson = trimmed.match(/```json\s*([\s\S]*?)\s*```/);
  if (fencedJson) return fencedJson[1].trim();

  // Case 2: generic fenced block
  const fencedAny = trimmed.match(/```\s*([\s\S]*?)\s*```/);
  if (fencedAny) return fencedAny[1].trim();

  // Case 3: find the outermost JSON object
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    // --- 1. Parse & validate wizard input ---
    const body = await req.json();
    const parsedInput = WizardDataSchema.safeParse(body);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          error: "Invalid wizard data",
          issues: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    // --- 2. Build the prompt ---
    const prompt = buildDashboardPrompt(parsedInput.data);

    // --- 3. Call Claude ---
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    // --- 4. Extract text from Claude's response ---
    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // --- 4b. Strip markdown code fences if present ---
    // Claude sometimes wraps JSON in ```json ... ``` despite instructions.
    // We normalize the output before parsing.
    const cleaned = extractJson(rawText);

    // --- 5. Parse as JSON ---
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error: "Claude did not return valid JSON",
          raw: rawText.slice(0, 500),
        },
        { status: 502 },
      );
    }

    // --- 6. Validate against our dashboard schema ---
    const parsedConfig = DashboardConfigSchema.safeParse(jsonData);
    if (!parsedConfig.success) {
      return NextResponse.json(
        {
          error:
            "Claude returned JSON that does not match the dashboard schema",
          issues: parsedConfig.error.flatten(),
          raw: rawText.slice(0, 500),
        },
        { status: 502 },
      );
    }

    // --- 7. Success ---
    return NextResponse.json({ config: parsedConfig.data });
  } catch (err) {
    console.error("[/api/generate] error:", err);

    // Anthropic SDK errors have a `status` property we can surface
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: "AI provider error",
          message: err.message,
          status: err.status,
        },
        { status: err.status ?? 500 },
      );
    }

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
