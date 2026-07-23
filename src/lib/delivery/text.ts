import { Family } from "../types";
import { recordAudit } from "../audit";

// Text is a link-only nudge. NEVER put figures or account data in an SMS —
// retention/privacy rules (your CCO will specify the archived vendor).
export function buildTextNudge(family: Family, dashboardUrl: string): string {
  return `Stonebridge: your ${family.desk?.quarter || "latest"} review is ready. View it securely here: ${dashboardUrl}`;
}

export async function sendTextNudge(family: Family, phone: string, dashboardUrl: string, actor: string) {
  if (family.status !== "published") {
    return { sent: false, reason: "Family dashboard is not published — cannot send." };
  }
  const provider = process.env.SMS_PROVIDER_KEY;
  if (!provider) {
    return { sent: false, reason: "No compliance-archived SMS provider configured (SMS_PROVIDER_KEY). Preview only." };
  }
  // TODO: archived SMS provider.send({ to: phone, body }) here.
  await recordAudit({ familyId: family.id, action: "text_sent", actor, detail: `to ${phone}` });
  return { sent: true };
}
