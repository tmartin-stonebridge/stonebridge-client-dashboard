import Anthropic from "@anthropic-ai/sdk";
import { Family } from "../types";
import { getAnthropic, DRAFT_MODEL } from "./anthropic";
import { STONEBRIDGE_VOICE } from "./voiceGuide";

export interface DraftResult {
  verdict: string;
  changed: string[];
  deskBody: string;
  warnings: string[]; // number-safety flags for advisor review
}

// Collect every figure the model is ALLOWED to use, from the family's real data.
function allowedFigures(f: Family): Set<string> {
  const s = new Set<string>();
  const add = (v?: string | number) => { if (v !== undefined && v !== null && `${v}` !== "") s.add(`${v}`.trim()); };
  add(f.totalValue); add(f.quarterChange); add(f.planStatus);
  add(f.liquidity?.available); add(f.liquidity?.obligation);
  f.goals?.forEach((g) => add(`${g.pct}%`));
  f.allocation?.forEach((a) => { add(a.label); add(`${a.pct}%`); });
  add(f.philanthropy?.committed); add(f.philanthropy?.granted); add(`${f.philanthropy?.pct}%`);
  return s;
}

// Flag any $ or % figure in the generated text that is not present in source data.
// Exported for regression testing — see src/lib/ai/draft.test.ts.
export function checkNumbers(text: string, allowed: Set<string>): string[] {
  const found = text.match(/\$[\d.,]+[MBK]?|\b\d+(\.\d+)?%/g) ?? [];
  const warnings: string[] = [];
  for (const token of found) {
    const t = token.trim();
    const ok = [...allowed].some((a) => a.includes(t) || t.includes(a));
    if (!ok) warnings.push(`Figure "${t}" is not in the source data — verify before publishing.`);
  }
  return [...new Set(warnings)];
}

function buildUserPrompt(f: Family, events: string): string {
  return `FAMILY: ${f.familyName}
PERIOD: ${f.desk?.quarter || f.asOf}

FIGURES YOU MAY USE (do not introduce any others):
- Total portfolio: ${f.totalValue}
- Change this period: ${f.quarterChange}
- Plan status: ${f.planStatus}
- Cash available: ${f.liquidity?.available || "n/a"}
- Near-term obligation: ${f.liquidity?.obligation || "n/a"} (${f.liquidity?.obligationNote || ""})
- Goals: ${(f.goals || []).map((g) => `${g.label} ${g.done ? "achieved" : g.pct + "%"}`).join("; ") || "n/a"}
- Open items: ${(f.needs || []).map((n) => n.title).join("; ") || "none"}

THIS PERIOD'S EVENTS (advisor notes — turn these into the draft):
${events.trim() || "(none provided — draft from the figures above)"}

Draft the verdict, the "changed" items, and the desk note.`;
}

export async function generateDraft(family: Family, events: string): Promise<DraftResult> {
  const client = getAnthropic();
  if (!client) throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env.local to enable AI drafting.");

  const msg = await client.messages.create({
    model: DRAFT_MODEL,
    max_tokens: 2048,
    system: STONEBRIDGE_VOICE,
    messages: [{ role: "user", content: buildUserPrompt(family, events) }],
  });
if (msg.stop_reason === "max_tokens") {
  throw new Error(
    "The draft was cut off before it finished (hit the token limit). " +
    "Try shorter advisor notes, or raise max_tokens in lib/ai/draft.ts."
  );
}
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  let parsed: { verdict?: string; changed?: string[]; deskBody?: string };
  try {
    parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Model did not return valid JSON. Raw output: " + text.slice(0, 300));
  }

  const verdict = (parsed.verdict || "").trim();
  const changed = Array.isArray(parsed.changed) ? parsed.changed.map((c) => `${c}`.trim()).filter(Boolean) : [];
  const deskBody = (parsed.deskBody || "").trim();

  const allowed = allowedFigures(family);
  const warnings = checkNumbers([verdict, ...changed, deskBody].join(" "), allowed);

  return { verdict, changed, deskBody, warnings };
}
