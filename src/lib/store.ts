import { Family, Tier, PublishStatus, Goal, AllocationSlice, Liquidity, Philanthropy, Deal, NextGen, Desk, NeedItem } from "./types";
import { SEED_FAMILIES } from "./seed";
import { getSupabase } from "./supabase";

// Row shape in the Supabase `families` table (see supabase/schema.sql).
interface FamilyRow {
  id: string; family_name: string; tier: Tier; status: PublishStatus;
  as_of: string; greeting: string; verdict: string; total_value: string;
  quarter_change: string; plan_status: string;
  changed: string[]; goals: Goal[]; liquidity: Liquidity; allocation: AllocationSlice[];
  philanthropy: Philanthropy; deal: Deal; next_gen: NextGen; desk: Desk; needs: NeedItem[];
}

function rowToFamily(r: FamilyRow): Family {
  return {
    id: r.id, familyName: r.family_name, tier: r.tier, status: r.status, asOf: r.as_of,
    greeting: r.greeting, verdict: r.verdict, totalValue: r.total_value,
    quarterChange: r.quarter_change, planStatus: r.plan_status, changed: r.changed,
    goals: r.goals, liquidity: r.liquidity, allocation: r.allocation,
    philanthropy: r.philanthropy, deal: r.deal, nextGen: r.next_gen, desk: r.desk, needs: r.needs,
  };
}

function familyToRow(f: Family): FamilyRow {
  return {
    id: f.id, family_name: f.familyName, tier: f.tier, status: f.status, as_of: f.asOf,
    greeting: f.greeting, verdict: f.verdict, total_value: f.totalValue,
    quarter_change: f.quarterChange, plan_status: f.planStatus, changed: f.changed,
    goals: f.goals, liquidity: f.liquidity, allocation: f.allocation,
    philanthropy: f.philanthropy, deal: f.deal, next_gen: f.nextGen, desk: f.desk, needs: f.needs,
  };
}

// In-memory dev store: used when Supabase is not configured. Persists for the
// life of the dev-server process only (resets on restart). Dev convenience, not
// a database.
let mem: Family[] | null = null;
function memStore(): Family[] {
  if (mem === null) mem = structuredClone(SEED_FAMILIES);
  return mem;
}

export async function listFamilies(): Promise<Family[]> {
  const sb = getSupabase();
  if (!sb) return memStore();
  const { data, error } = await sb.from("families").select("*").order("family_name");
  if (error || !data) return SEED_FAMILIES;
  return (data as FamilyRow[]).map(rowToFamily);
}

export async function getFamily(id: string): Promise<Family | null> {
  const sb = getSupabase();
  if (!sb) return memStore().find((f) => f.id === id) ?? null;
  const { data, error } = await sb.from("families").select("*").eq("id", id).single();
  if (error || !data) return null;
  return rowToFamily(data as FamilyRow);
}

// Save the AI-draftable narrative fields. Does NOT change status.
export async function saveNarrative(id: string, patch: { verdict: string; changed: string[]; desk: Desk }): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    const f = memStore().find((x) => x.id === id);
    if (f) { f.verdict = patch.verdict; f.changed = patch.changed; f.desk = patch.desk; }
    return;
  }
  await sb.from("families").update({ verdict: patch.verdict, changed: patch.changed, desk: patch.desk }).eq("id", id);
}

export async function setStatus(id: string, status: PublishStatus): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    const f = memStore().find((x) => x.id === id);
    if (f) f.status = status;
    return;
  }
  await sb.from("families").update({ status }).eq("id", id);
}

// Upsert a full family record (used by the Black Diamond ingestion path).
export async function upsertFamily(f: Family): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    const arr = memStore();
    const i = arr.findIndex((x) => x.id === f.id);
    if (i >= 0) arr[i] = f; else arr.push(f);
    return;
  }
  await sb.from("families").upsert(familyToRow(f));
}
