import { getSupabase } from "./supabase";

export type AuditAction =
  | "draft_generated" | "draft_saved" | "approved" | "published"
  | "email_sent" | "text_sent";

export interface AuditEntry {
  familyId: string;
  action: AuditAction;
  actor: string;      // wire to the Clerk user once auth is added
  detail?: string;
  at: string;
}

// In-memory mirror for dev; real record goes to Supabase `audit_log`.
const memLog: AuditEntry[] = [];

export async function recordAudit(e: Omit<AuditEntry, "at">): Promise<void> {
  const entry: AuditEntry = { ...e, at: new Date().toISOString() };
  const sb = getSupabase();
  if (!sb) { memLog.push(entry); console.log("[audit]", entry); return; }
  await sb.from("audit_log").insert({
    family_id: entry.familyId, action: entry.action, actor: entry.actor,
    detail: entry.detail ?? null, at: entry.at,
  });
}

export function devAuditLog(): AuditEntry[] { return memLog; }
