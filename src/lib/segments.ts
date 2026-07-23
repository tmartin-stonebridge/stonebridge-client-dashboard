import { Tier } from "./types";

// Module keys must match the keys in components/Dashboard.tsx MODULES.
export type ModuleKey =
  | "verdict" | "snapshot" | "liquidity" | "changed" | "goals"
  | "allocation" | "philanthropy" | "deal" | "nextgen" | "desk" | "needs";

const CORE_TAIL: ModuleKey[] = ["changed", "goals", "allocation", "desk", "needs"];

// Tier -> ordered list of modules to render. This is THE personalization seam:
// your Segmentation Tracker tier chooses which arrangement a family gets.
export const SEGMENTS: Record<Tier, { label: string; order: ModuleKey[] }> = {
  base:           { label: "Standard",              order: ["verdict", "snapshot", ...CORE_TAIL] },
  entertainer:    { label: "Entertainer / Athlete", order: ["verdict", "snapshot", "liquidity", ...CORE_TAIL] },
  philanthropist: { label: "Philanthropist",        order: ["verdict", "snapshot", "philanthropy", ...CORE_TAIL] },
  transaction:    { label: "In-Transaction",        order: ["verdict", "snapshot", "deal", ...CORE_TAIL] },
  nextgen:        { label: "Next-Gen Focus",        order: ["verdict", "snapshot", "changed", "goals", "nextgen", "allocation", "desk", "needs"] },
};
