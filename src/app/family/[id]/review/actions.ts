"use server";

import { revalidatePath } from "next/cache";
import { getFamily, saveNarrative, setStatus } from "@/lib/store";
import { generateDraft } from "@/lib/ai/draft";
import { recordAudit } from "@/lib/audit";
import { buildSnapshotEmail } from "@/lib/delivery/email";

const ACTOR = "advisor (dev)"; // wire to the Clerk user once auth is added

export interface DraftActionResult {
  ok: boolean;
  error?: string;
  verdict?: string;
  changed?: string[];
  deskBody?: string;
  warnings?: string[];
}

export async function generateDraftAction(id: string, events: string): Promise<DraftActionResult> {
  const family = await getFamily(id);
  if (!family) return { ok: false, error: "Family not found." };
  try {
    const d = await generateDraft(family, events);
    await recordAudit({ familyId: id, action: "draft_generated", actor: ACTOR });
    return { ok: true, verdict: d.verdict, changed: d.changed, deskBody: d.deskBody, warnings: d.warnings };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Draft generation failed." };
  }
}

export async function saveDraftAction(id: string, verdict: string, changed: string[], quarter: string, deskBody: string): Promise<{ ok: boolean; error?: string }> {
  const family = await getFamily(id);
  if (!family) return { ok: false, error: "Family not found." };
  await saveNarrative(id, { verdict, changed, desk: { quarter, body: deskBody } });
  await recordAudit({ familyId: id, action: "draft_saved", actor: ACTOR });
  revalidatePath(`/family/${id}`);
  revalidatePath(`/family/${id}/review`);
  return { ok: true };
}

export async function approveAction(id: string): Promise<{ ok: boolean; status: string }> {
  await setStatus(id, "approved");
  await recordAudit({ familyId: id, action: "approved", actor: ACTOR });
  revalidatePath(`/family/${id}/review`);
  return { ok: true, status: "approved" };
}

export async function publishAction(id: string): Promise<{ ok: boolean; status: string }> {
  await setStatus(id, "published");
  await recordAudit({ familyId: id, action: "published", actor: ACTOR });
  revalidatePath(`/family/${id}`);
  revalidatePath(`/family/${id}/review`);
  return { ok: true, status: "published" };
}

export async function previewEmailAction(id: string): Promise<{ ok: boolean; subject?: string; html?: string; error?: string }> {
  const family = await getFamily(id);
  if (!family) return { ok: false, error: "Family not found." };
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.netlify.app";
  const { subject, html } = buildSnapshotEmail(family, `${base}/family/${id}`);
  return { ok: true, subject, html };
}
