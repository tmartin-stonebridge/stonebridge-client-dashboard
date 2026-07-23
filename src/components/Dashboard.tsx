import React from "react";
import { Family } from "@/lib/types";
import { SEGMENTS, ModuleKey } from "@/lib/segments";
import { T, fonts } from "@/lib/tokens";

// Presentational, server-rendered. Renders ONE family at its stored tier.
// No client state: the tier comes from the record, not a toggle.

function Eyebrow({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <div style={{ fontFamily: fonts.display, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: tone || T.olive, fontWeight: 600 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.line, margin: "0 24px" }} />;
}

function Donut({ segments }: { segments: Family["allocation"] }) {
  const size = 108, stroke = 18, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((s, i) => {
        const len = (s.pct / 100) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

const MODULES: Record<ModuleKey, (f: Family) => React.ReactNode> = {
  verdict: (f) => (
    <div style={{ padding: "26px 24px 22px" }}>
      <div style={{ fontFamily: fonts.body, fontSize: 13, color: T.muted }}>{f.greeting}, {f.familyName}.</div>
      <div style={{ fontFamily: fonts.display, fontSize: 24, lineHeight: 1.3, color: T.navy, marginTop: 10, fontWeight: 600 }}>{f.verdict}</div>
    </div>
  ),
  snapshot: (f) => (
    <div style={{ padding: "20px 24px 22px", background: "linear-gradient(180deg,#FBFCFD,#F4F6F8)" }}>
      <Eyebrow>Total portfolio</Eyebrow>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700, color: T.navy, lineHeight: 1 }}>{f.totalValue}</div>
        <div style={{ fontFamily: fonts.body, fontSize: 13, color: T.olive, fontWeight: 700 }}>{f.quarterChange}</div>
      </div>
      <div style={{ display: "inline-block", marginTop: 14, background: T.oliveBg, color: T.olive, fontFamily: fonts.body, fontSize: 12, fontWeight: 700, padding: "6px 13px", borderRadius: 20 }}>● {f.planStatus}</div>
    </div>
  ),
  liquidity: (f) => (
    <div style={{ padding: "20px 24px", display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <Eyebrow>Cash available now</Eyebrow>
        <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700, color: T.navy, marginTop: 6 }}>{f.liquidity.available}</div>
      </div>
      <div style={{ flex: 1 }}>
        <Eyebrow tone={T.coral}>Next 90 days out</Eyebrow>
        <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700, color: T.coral, marginTop: 6 }}>{f.liquidity.obligation}</div>
        <div style={{ fontFamily: fonts.body, fontSize: 12, color: T.muted, marginTop: 3 }}>{f.liquidity.obligationNote}</div>
      </div>
    </div>
  ),
  changed: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow>What changed</Eyebrow>
      <div style={{ marginTop: 12 }}>
        {f.changed.map((line, i) => (
          <div key={i} style={{ fontFamily: fonts.body, fontSize: 14, color: T.slate, lineHeight: 1.55, marginBottom: i === f.changed.length - 1 ? 0 : 10, display: "flex", gap: 8 }}>
            <span style={{ color: T.olive, fontWeight: 700 }}>→</span><span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  goals: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow>Progress toward what matters</Eyebrow>
      <div style={{ marginTop: 16 }}>
        {f.goals.map((g, i) => (
          <div key={i} style={{ marginBottom: i === f.goals.length - 1 ? 0 : 15, fontFamily: fonts.body }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.slate, marginBottom: 6 }}>
              <span>{g.label}</span>
              <span style={{ color: g.done ? T.olive : T.muted, fontWeight: g.done ? 700 : 400 }}>{g.done ? "Achieved" : `${g.pct}%`}</span>
            </div>
            <div style={{ background: T.line, borderRadius: 6, height: 7 }}>
              <div style={{ background: g.done ? T.olive : T.navy, width: `${g.pct}%`, height: 7, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  allocation: (f) => (
    <div style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}>
      <Donut segments={f.allocation} />
      <div style={{ flex: 1 }}>
        <Eyebrow>Allocation</Eyebrow>
        <div style={{ marginTop: 10 }}>
          {f.allocation.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.body, fontSize: 12.5, color: T.slate, marginBottom: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: a.color, display: "inline-block" }} />
              <span style={{ flex: 1 }}>{a.label}</span>
              <span style={{ color: T.muted }}>{a.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  philanthropy: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow>{f.philanthropy.label}</Eyebrow>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.body, fontSize: 13, color: T.slate, margin: "12px 0 6px" }}>
        <span>{f.philanthropy.granted} granted of {f.philanthropy.committed}</span>
        <span style={{ color: T.muted }}>{f.philanthropy.pct}%</span>
      </div>
      <div style={{ background: T.line, borderRadius: 6, height: 7 }}>
        <div style={{ background: T.navy, width: `${f.philanthropy.pct}%`, height: 7, borderRadius: 6 }} />
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>{f.philanthropy.note}</div>
    </div>
  ),
  deal: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow>{f.deal.name}</Eyebrow>
      <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: T.navy, margin: "8px 0 16px" }}>{f.deal.stage}</div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {f.deal.steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ textAlign: "center", flex: "0 0 auto" }}>
              <div style={{ width: 13, height: 13, borderRadius: 7, margin: "0 auto", background: i <= f.deal.current ? T.olive : T.line, border: i === f.deal.current ? `3px solid ${T.oliveBg}` : "none" }} />
              <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: i <= f.deal.current ? T.slate : T.muted, marginTop: 6, width: 62 }}>{s}</div>
            </div>
            {i < f.deal.steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < f.deal.current ? T.olive : T.line, marginTop: 6 }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: T.muted, marginTop: 14, lineHeight: 1.5 }}>{f.deal.note}</div>
    </div>
  ),
  nextgen: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow>{f.nextGen.label}</Eyebrow>
      <div style={{ marginTop: 12 }}>
        {f.nextGen.lines.map((l, i) => (
          <div key={i} style={{ fontFamily: fonts.body, fontSize: 14, color: T.slate, lineHeight: 1.55, marginBottom: i === f.nextGen.lines.length - 1 ? 0 : 10, display: "flex", gap: 8 }}>
            <span style={{ color: T.olive, fontWeight: 700 }}>→</span><span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  desk: (f) => (
    <div style={{ padding: "22px 24px", background: T.oliveBg }}>
      <Eyebrow>From the desk · {f.desk.quarter}</Eyebrow>
      <div style={{ fontFamily: fonts.body, fontSize: 15, fontStyle: "italic", lineHeight: 1.6, color: T.slate, marginTop: 10 }}>&ldquo;{f.desk.body}&rdquo;</div>
    </div>
  ),
  needs: (f) => (
    <div style={{ padding: "20px 24px" }}>
      <Eyebrow tone={T.coral}>Needs you</Eyebrow>
      {f.needs.map((n, i) => (
        <div key={i} style={{ marginTop: 12, background: T.coralBg, border: `1px solid ${T.line}`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 600, color: T.coral }}>{n.title}</div>
          <div style={{ fontFamily: fonts.body, fontSize: 13, color: T.slate, marginTop: 4 }}>{n.detail}</div>
          <button style={{ marginTop: 12, background: T.coral, color: "#fff", border: "none", fontFamily: fonts.display, fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 7, cursor: "pointer" }}>{n.cta} →</button>
        </div>
      ))}
    </div>
  ),
};

// A module is skipped if the family has no content for it (never fabricate).
function hasContent(key: ModuleKey, f: Family): boolean {
  switch (key) {
    case "liquidity": return Boolean(f.liquidity?.available);
    case "philanthropy": return Boolean(f.philanthropy?.label);
    case "deal": return Boolean(f.deal?.name);
    case "nextgen": return f.nextGen?.lines?.length > 0;
    case "changed": return f.changed?.length > 0;
    case "goals": return f.goals?.length > 0;
    case "needs": return true; // section renders even when empty (shows nothing outstanding)
    default: return true;
  }
}

export default function Dashboard({ family }: { family: Family }) {
  const order = SEGMENTS[family.tier].order.filter((k) => hasContent(k, family));

  return (
    <div style={{ background: T.page, minHeight: "100vh", padding: "24px 16px", fontFamily: fonts.body }}>
      <div style={{ maxWidth: 480, margin: "0 auto", background: T.white, border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 40px rgba(38,68,105,0.10)" }}>

        {family.status !== "published" && (
          <div style={{ background: T.coral, color: "#fff", textAlign: "center", fontFamily: fonts.body, fontSize: 10, letterSpacing: 1.2, padding: 5, textTransform: "uppercase" }}>
            Draft — not approved for client delivery
          </div>
        )}

        <div style={{ padding: "18px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/StonebridgeLogo-2C.png" alt="Stonebridge Wealth Management" style={{ height: 30, width: "auto" }} />
          <div style={{ fontFamily: fonts.body, fontSize: 11, color: T.muted }}>As of {family.asOf}</div>
        </div>

        {order.map((key, i) => (
          <React.Fragment key={key}>
            {i > 0 && key !== "snapshot" && <Divider />}
            {MODULES[key](family)}
          </React.Fragment>
        ))}

        <div style={{ padding: "18px 24px", borderTop: `1px solid ${T.line}`, textAlign: "center" }}>
          <button style={{ width: "100%", background: T.navy, color: "#fff", border: "none", fontFamily: fonts.display, fontSize: 13, fontWeight: 600, padding: 13, borderRadius: 8, cursor: "pointer" }}>View your full portfolio →</button>
          <div style={{ fontFamily: fonts.body, fontSize: 11, color: T.muted, marginTop: 10 }}>Questions? Text your team anytime.</div>
        </div>

        <div style={{ padding: "14px 24px 20px", background: "#EEF1F4" }}>
          <div style={{ fontFamily: fonts.body, fontSize: 9.5, color: T.muted, lineHeight: 1.55 }}>
            Performance shown net of fees. Past performance is not indicative of future results. Figures are unaudited and subject to revision. This material is not personalized investment, tax, or legal advice; see your advisory agreement and Form ADV Part 2.
          </div>
        </div>
      </div>
    </div>
  );
}
