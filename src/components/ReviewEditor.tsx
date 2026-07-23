"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Family } from "@/lib/types";
import { T, fonts } from "@/lib/tokens";
import {
  generateDraftAction, saveDraftAction, approveAction, publishAction, previewEmailAction,
} from "@/app/family/[id]/review/actions";

const box: React.CSSProperties = { background: "#fff", border: `1px solid ${T.line}`, borderRadius: 12, padding: 18, marginBottom: 16 };
const label: React.CSSProperties = { fontFamily: fonts.display, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: T.olive, fontWeight: 600, marginBottom: 8, display: "block" };
const input: React.CSSProperties = { width: "100%", fontFamily: fonts.body, fontSize: 14, color: T.slate, border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 12px", boxSizing: "border-box" };
const btn = (bg: string, disabled = false): React.CSSProperties => ({ background: disabled ? "#C9CDD2" : bg, color: "#fff", border: "none", fontFamily: fonts.display, fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" });

export default function ReviewEditor({ family }: { family: Family }) {
  const [events, setEvents] = useState("");
  const [verdict, setVerdict] = useState(family.verdict);
  const [changedText, setChangedText] = useState((family.changed || []).join("\n"));
  const [quarter, setQuarter] = useState(family.desk?.quarter || "");
  const [deskBody, setDeskBody] = useState(family.desk?.body || "");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [status, setStatus] = useState(family.status);
  const [msg, setMsg] = useState("");
  const [emailHtml, setEmailHtml] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const changedArray = () => changedText.split("\n").map((s) => s.trim()).filter(Boolean);

  const onGenerate = () => start(async () => {
    setMsg("Drafting in your voice…"); setWarnings([]);
    const r = await generateDraftAction(family.id, events);
    if (!r.ok) { setMsg(r.error || "Failed."); return; }
    setVerdict(r.verdict || ""); setChangedText((r.changed || []).join("\n")); setDeskBody(r.deskBody || "");
    setWarnings(r.warnings || []); setMsg("Draft ready — review, edit, then save.");
  });

  const onSave = () => start(async () => {
    const r = await saveDraftAction(family.id, verdict, changedArray(), quarter, deskBody);
    setMsg(r.ok ? "Saved." : (r.error || "Save failed."));
  });

  const onApprove = () => start(async () => {
    const r = await approveAction(family.id); setStatus(r.status as Family["status"]); setMsg("Approved. Ready to publish.");
  });

  const onPublish = () => start(async () => {
    const r = await publishAction(family.id); setStatus(r.status as Family["status"]); setMsg("Published. The client can now see it.");
  });

  const onPreviewEmail = () => start(async () => {
    const r = await previewEmailAction(family.id);
    if (r.ok && r.html) { setEmailHtml(r.html); setMsg("Email snapshot preview below."); } else { setMsg(r.error || "Preview failed."); }
  });

  const statusColor = status === "published" ? T.olive : T.coral;
  const statusBg = status === "published" ? T.oliveBg : T.coralBg;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: fonts.body, color: T.slate }}>
      <Link href="/" style={{ fontSize: 13, color: T.muted }}>← All families</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 4px" }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 26, color: T.navy, fontWeight: 700, margin: 0 }}>{family.familyName}</h1>
        <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: statusColor, background: statusBg, padding: "5px 12px", borderRadius: 20 }}>{status}</span>
      </div>
      <p style={{ fontSize: 13, color: T.muted, marginTop: 0 }}>Draft &rarr; approve &rarr; publish. Numbers come from data; you approve the words.</p>

      {msg && <div style={{ ...box, background: T.oliveBg, border: "none", fontSize: 13 }}>{msg}</div>}

      <div style={box}>
        <span style={label}>This period&rsquo;s events (advisor notes)</span>
        <textarea value={events} onChange={(e) => setEvents(e.target.value)} rows={4} placeholder="e.g. Tour income of $2.1M landed; trimmed concentrated tech into munis; Nashville property closed into the trust." style={{ ...input, resize: "vertical" }} />
        <button onClick={onGenerate} disabled={pending} style={{ ...btn(T.navy, pending), marginTop: 12 }}>{pending ? "Working…" : "Generate draft in Stonebridge voice"}</button>
      </div>

      {warnings.length > 0 && (
        <div style={{ ...box, background: T.coralBg, border: `1px solid ${T.coral}` }}>
          <span style={{ ...label, color: T.coral }}>Number-safety check</span>
          {warnings.map((w, i) => <div key={i} style={{ fontSize: 13, color: "#7A2E24", marginBottom: 4 }}>⚠ {w}</div>)}
        </div>
      )}

      <div style={box}>
        <span style={label}>Verdict (one line)</span>
        <input value={verdict} onChange={(e) => setVerdict(e.target.value)} style={input} />
        <span style={{ ...label, marginTop: 16 }}>What changed (one per line)</span>
        <textarea value={changedText} onChange={(e) => setChangedText(e.target.value)} rows={4} style={{ ...input, resize: "vertical" }} />
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <div style={{ width: 120 }}>
            <span style={label}>Quarter</span>
            <input value={quarter} onChange={(e) => setQuarter(e.target.value)} style={input} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={label}>From the desk</span>
            <textarea value={deskBody} onChange={(e) => setDeskBody(e.target.value)} rows={3} style={{ ...input, resize: "vertical" }} />
          </div>
        </div>
        <button onClick={onSave} disabled={pending} style={{ ...btn(T.slate, pending), marginTop: 14 }}>Save draft</button>
      </div>

      <div style={{ ...box, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={onApprove} disabled={pending || status !== "draft"} style={btn(T.olive, pending || status !== "draft")}>Approve</button>
        <button onClick={onPublish} disabled={pending || status !== "approved"} style={btn(T.navy, pending || status !== "approved")}>Publish to client</button>
        <Link href={`/family/${family.id}`} style={{ fontSize: 13, color: T.navy, fontWeight: 600, marginLeft: "auto" }}>View live dashboard →</Link>
      </div>

      <div style={box}>
        <span style={label}>Email snapshot</span>
        <button onClick={onPreviewEmail} disabled={pending} style={btn(T.slate, pending)}>Preview email</button>
        {emailHtml && (
          <iframe title="email preview" srcDoc={emailHtml} style={{ width: "100%", height: 560, border: `1px solid ${T.line}`, borderRadius: 8, marginTop: 14 }} />
        )}
      </div>
    </main>
  );
}
