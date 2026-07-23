import Anthropic from "@anthropic-ai/sdk";

// Server-only. Returns null when ANTHROPIC_API_KEY is unset so callers can
// show a clear "not configured" state instead of crashing.
export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// Confirm the current model string against https://docs.claude.com/en/api
export const DRAFT_MODEL = "claude-sonnet-5";
