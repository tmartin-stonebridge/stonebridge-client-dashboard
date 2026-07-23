// Domain model for a client dashboard. In Phase 3 the numeric fields will be
// fed from Black Diamond; for now money is stored as display strings.

// The "profile" that decides which modules show and in what order.
// NOTE: this may or may not equal your Segmentation Tracker service tier (A/B/C).
// If they differ, split this into `serviceTier` + `profile` (see README).
export type Tier = "base" | "entertainer" | "philanthropist" | "transaction" | "nextgen";

export type PublishStatus = "draft" | "approved" | "published";

export interface Goal { label: string; pct: number; done: boolean; }
export interface AllocationSlice { label: string; pct: number; color: string; }
export interface Liquidity { available: string; obligation: string; obligationNote: string; }
export interface Philanthropy { label: string; committed: string; granted: string; pct: number; note: string; }
export interface Deal { name: string; stage: string; steps: string[]; current: number; note: string; }
export interface NextGen { label: string; lines: string[]; }
export interface Desk { quarter: string; body: string; }
export interface NeedItem { title: string; detail: string; cta: string; }

export interface Family {
  id: string;
  familyName: string;
  tier: Tier;
  status: PublishStatus;   // compliance gate seam (Phase 4)
  asOf: string;
  greeting: string;
  verdict: string;
  totalValue: string;
  quarterChange: string;
  planStatus: string;
  changed: string[];
  goals: Goal[];
  liquidity: Liquidity;
  allocation: AllocationSlice[];
  philanthropy: Philanthropy;
  deal: Deal;
  nextGen: NextGen;
  desk: Desk;
  needs: NeedItem[];
}
