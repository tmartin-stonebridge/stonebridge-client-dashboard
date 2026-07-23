import Link from "next/link";
import { listFamilies } from "@/lib/families";
import { SEGMENTS } from "@/lib/segments";
import { T, fonts } from "@/lib/tokens";

export default async function Home() {
  const families = await listFamilies();

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px", fontFamily: fonts.body, color: T.slate }}>
      <div style={{ fontFamily: fonts.display, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: T.olive, fontWeight: 600 }}>
        Advisor Console
      </div>
      <h1 style={{ fontFamily: fonts.display, fontSize: 28, color: T.navy, margin: "8px 0 4px", fontWeight: 700 }}>Client Dashboards</h1>
      <p style={{ fontSize: 14, color: T.muted, marginTop: 0 }}>Open a family to view its live dashboard, or review &amp; publish its next update.</p>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
        {families.map((f) => (
          <div key={f.id} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: T.navy }}>{f.familyName}</div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{SEGMENTS[f.tier].label} · {f.totalValue}</div>
              </div>
              <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: f.status === "published" ? T.olive : T.coral, background: f.status === "published" ? T.oliveBg : T.coralBg, padding: "4px 10px", borderRadius: 20 }}>
                {f.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
              <Link href={`/family/${f.id}`} style={{ fontSize: 13, color: T.navy, fontWeight: 600 }}>View dashboard →</Link>
              <Link href={`/family/${f.id}/review`} style={{ fontSize: 13, color: T.slate, fontWeight: 600 }}>Review &amp; publish →</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
