import { Family, Tier } from "../types";
import { upsertFamily, getFamily } from "../store";

// The NORMALIZED shape your Black Diamond adapter must produce. Whatever the
// real BD access turns out to be (API / SFTP export / manual CSV), map it to
// THIS, and the rest of the pipeline just works. Narrative fields are omitted
// on purpose — those come from the AI drafting + advisor approval step, never
// from BD.
export interface NormalizedImport {
  id: string;
  familyName: string;
  tier: Tier;
  asOf: string;
  totalValue: string;
  quarterChange: string;
  planStatus: string;
  liquidity: Family["liquidity"];
  allocation: Family["allocation"];
  goals: Family["goals"];
}

// Merge BD numbers into a family WITHOUT touching approved narrative or status.
// New families arrive as 'draft' so they can never skip the approval gate.
export async function importNormalized(n: NormalizedImport): Promise<void> {
  const existing = await getFamily(n.id);
  const merged: Family = {
    id: n.id,
    familyName: n.familyName,
    tier: n.tier,
    asOf: n.asOf,
    totalValue: n.totalValue,
    quarterChange: n.quarterChange,
    planStatus: n.planStatus,
    liquidity: n.liquidity,
    allocation: n.allocation,
    goals: n.goals,
    // Numbers refreshed => narrative must be re-approved. Reset to draft.
    status: "draft",
    greeting: existing?.greeting ?? "Good morning",
    verdict: existing?.verdict ?? "",
    changed: existing?.changed ?? [],
    philanthropy: existing?.philanthropy ?? { label: "", committed: "", granted: "", pct: 0, note: "" },
    deal: existing?.deal ?? { name: "", stage: "", steps: [], current: 0, note: "" },
    nextGen: existing?.nextGen ?? { label: "Next-generation transfers", lines: [] },
    desk: existing?.desk ?? { quarter: "", body: "" },
    needs: existing?.needs ?? [],
  };
  await upsertFamily(merged);
}

// STUB — map to your actual Black Diamond export columns once you confirm access.
// Do NOT ship until the column mapping is verified against a real export file.
export function parseBlackDiamondExport(_csv: string): NormalizedImport[] {
  throw new Error(
    "parseBlackDiamondExport is a stub. Confirm your Black Diamond access (API vs. SFTP/CSV export), " +
    "then map the export columns to NormalizedImport here."
  );
}
