import { Family } from "../types";
import { recordAudit } from "../audit";

// Email is a TEASER that points to the live dashboard, not a full render.
// Table layout + inline styles = survives Outlook/Gmail. No flex, no SVG.
export function buildSnapshotEmail(family: Family, dashboardUrl: string): { subject: string; html: string } {
  const navy = "#264469", olive = "#838E59", slate = "#3F4B5C", muted = "#8A9099", line = "#E4E7EB";
  const needsCount = family.needs?.length || 0;
  const needsLine = needsCount > 0
    ? `<span style="color:#E45D50;font-weight:bold;">${needsCount} item${needsCount > 1 ? "s" : ""} need${needsCount > 1 ? "" : "s"} your attention.</span>`
    : `Nothing needs your attention right now.`;

  const subject = `${family.familyName} — your ${family.desk?.quarter || "latest"} review is ready`;

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#F4F6F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${line};border-radius:14px;font-family:'Lato',Arial,sans-serif;overflow:hidden;">
  <tr><td style="padding:22px 28px 8px;">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${olive};font-weight:bold;">Stonebridge</div>
  </td></tr>
  <tr><td style="padding:4px 28px 8px;">
    <div style="font-size:13px;color:${muted};">${family.greeting}, ${family.familyName}.</div>
    <div style="font-size:22px;line-height:1.3;color:${navy};font-weight:bold;margin-top:8px;">${family.verdict}</div>
  </td></tr>
  <tr><td style="padding:12px 28px;">
    <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${muted};">Total portfolio</div>
    <div style="font-size:30px;color:${navy};font-weight:bold;">${family.totalValue}
      <span style="font-size:14px;color:${olive};">&nbsp;${family.quarterChange}</span>
    </div>
    <div style="font-size:13px;color:${slate};margin-top:6px;">${family.planStatus}</div>
    <div style="font-size:13px;color:${slate};margin-top:10px;">${needsLine}</div>
  </td></tr>
  <tr><td style="padding:14px 28px 24px;">
    <a href="${dashboardUrl}" style="display:block;background:${navy};color:#ffffff;text-decoration:none;text-align:center;font-weight:bold;font-size:14px;padding:14px;border-radius:8px;">View your full dashboard &rarr;</a>
  </td></tr>
  <tr><td style="padding:14px 28px 22px;background:#EEF1F4;">
    <div style="font-size:10px;color:${muted};line-height:1.5;">Performance shown net of fees. Past performance is not indicative of future results. Figures are unaudited and subject to revision. Not personalized investment, tax, or legal advice; see your advisory agreement and Form ADV Part 2.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html };
}

// Stub. Wire a compliance-archived provider (Postmark/Resend + your archiving
// requirements from the CCO). Never send unless status === 'published'.
export async function sendSnapshotEmail(family: Family, to: string, dashboardUrl: string, actor: string) {
  if (family.status !== "published") {
    return { sent: false, reason: "Family dashboard is not published — cannot send." };
  }
  const provider = process.env.EMAIL_PROVIDER_KEY;
  if (!provider) {
    return { sent: false, reason: "No email provider configured (EMAIL_PROVIDER_KEY). Preview only." };
  }
  // TODO: provider.send({ to, subject, html }) here.
  await recordAudit({ familyId: family.id, action: "email_sent", actor, detail: `to ${to}` });
  return { sent: true };
}
