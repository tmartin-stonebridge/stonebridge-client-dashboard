import { Family } from "./types";

// ILLUSTRATIVE fallback data. Used automatically when Supabase is not configured.
// Replace with (or migrate into) the `families` table for Phase 2+.
export const SEED_FAMILIES: Family[] = [
  {
    id: "rivera",
    familyName: "The Rivera Family",
    tier: "entertainer",
    status: "published",
    asOf: "June 30, 2026",
    greeting: "Good morning",
    verdict: "You're on plan. One thing needs your signature.",
    totalValue: "$48.6M",
    quarterChange: "+$1.2M this quarter",
    planStatus: "On track for your 2040 legacy goal",
    changed: [
      "Tour income landed — $2.1M added to the reserve, exactly as planned.",
      "We trimmed concentrated tech and rotated into munis for tax efficiency.",
      "The Nashville property closed. Off the books, into the trust.",
    ],
    goals: [
      { label: "Legacy for the kids", pct: 82, done: false },
      { label: "Foundation funding", pct: 60, done: false },
      { label: "Work-optional by 50", pct: 100, done: true },
    ],
    liquidity: { available: "$3.4M", obligation: "$1.1M", obligationNote: "Q3 estimated taxes, due Sept 15" },
    allocation: [
      { label: "Public equity", pct: 42, color: "#264469" },
      { label: "Fixed income", pct: 23, color: "#838E59" },
      { label: "Private / alts", pct: 20, color: "#699CC6" },
      { label: "Real estate", pct: 9, color: "#F79B2E" },
      { label: "Cash", pct: 6, color: "#3F4B5C" },
    ],
    philanthropy: { label: "Rivera Family Foundation", committed: "$6.0M", granted: "$3.6M", pct: 60, note: "On pace to hit your 5% annual grant floor with room to spare." },
    deal: { name: "Pending property sale", stage: "Under contract — diligence", steps: ["Offer accepted", "Diligence", "Financing", "Close"], current: 1, note: "Buyer's inspection window closes Aug 8. No action needed from you yet." },
    nextGen: { label: "Next-generation transfers", lines: ["529 plans fully funded for all three grandchildren.", "Annual exclusion gifts made — $18k per beneficiary.", "Next family governance meeting: October."] },
    desk: { quarter: "Q2 2026", body: "Markets did their thing this quarter — a little drama in April, a quiet recovery by June. Your plan didn't flinch, and neither should you. The boring truth is that not reacting was the whole strategy, and you nailed it." },
    needs: [{ title: "1 document to sign", detail: "Trust funding letter for the Nashville transfer.", cta: "Review & sign" }],
  },
  {
    id: "bennett",
    familyName: "The Bennett Family",
    tier: "philanthropist",
    status: "draft",
    asOf: "June 30, 2026",
    greeting: "Good afternoon",
    verdict: "Steady quarter. Your giving is ahead of schedule.",
    totalValue: "$72.1M",
    quarterChange: "+$0.9M this quarter",
    planStatus: "On track across every goal",
    changed: [
      "Grant cycle funded — $1.8M out to the four named initiatives.",
      "Muni ladder extended to smooth next year's distributions.",
    ],
    goals: [
      { label: "Perpetual foundation corpus", pct: 91, done: false },
      { label: "Grandchildren's education", pct: 100, done: true },
    ],
    liquidity: { available: "$5.2M", obligation: "$0.4M", obligationNote: "Q3 grant commitments" },
    allocation: [
      { label: "Public equity", pct: 38, color: "#264469" },
      { label: "Fixed income", pct: 34, color: "#838E59" },
      { label: "Private / alts", pct: 18, color: "#699CC6" },
      { label: "Cash", pct: 10, color: "#3F4B5C" },
    ],
    philanthropy: { label: "The Bennett Foundation", committed: "$20.0M", granted: "$14.5M", pct: 73, note: "Comfortably above the 5% payout requirement for the fourth year running." },
    deal: { name: "", stage: "", steps: [], current: 0, note: "" },
    nextGen: { label: "Next-generation transfers", lines: ["Donor-advised fund seeded for the next generation.", "Family philanthropy retreat scheduled for spring."] },
    desk: { quarter: "Q2 2026", body: "A quiet quarter is a good quarter when your plan is this far along. We spent it tightening the tax mechanics behind your giving so more of every dollar reaches the causes, not the IRS." },
    needs: [],
  },
];
