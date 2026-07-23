# Stonebridge — Client Dashboard

A client-facing portfolio dashboard for Stonebridge Wealth Management. One
standard skeleton, personalized three ways: **data** (Black Diamond), **profile**
(which modules a family sees), and **voice** (the AI-drafted, advisor-approved note).

Runnable now, no external services required — it falls back to seed data.

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## What's built

**Phase 1–2 — dashboard + config store**
- Advisor console (`/`) lists families with publish status.
- Client dashboard (`/family/[id]`) renders modules per the family's profile.
- Data layer reads Supabase when configured, else an in-memory seed store.

**Phase 4 — AI drafting + approval gate (the scale unlock)**
- `/family/[id]/review`: paste this period's events → **generate a draft** verdict,
  "what changed", and desk note **in the Stonebridge voice** → edit → **approve** →
  **publish**. That status chain is the compliance gate.
- **Number-safety check:** any $ or % figure the model emits that isn't in the
  family's source data is flagged for the advisor before publishing.
- **Audit log:** every generate/save/approve/publish/send is recorded
  (`audit_log` table) — the basis of your books-and-records trail.
- AI **only drafts narrative text.** Numbers always come from data, never the model.
  Nothing auto-publishes; the advisor is always the gate.

**Phase 5 — delivery templates (sends stubbed)**
- Email snapshot: table-based, inline-styled HTML that survives Outlook/Gmail —
  a teaser that links to the live dashboard. Preview it live in the review screen.
- Text nudge: link-only (never figures in an SMS).
- Both sends are **disabled until a provider is configured** and refuse to fire
  unless the family is `published`. The archived provider + retention rules are
  for your CCO to specify.

**Phase 3 — Black Diamond ingestion (interface only)**
- `lib/blackdiamond/import.ts` defines the `NormalizedImport` contract and the
  upsert path. Map whatever BD gives you (API / SFTP / CSV) to that shape.
- Importing fresh numbers resets a family to `draft` so it re-enters the approval
  gate — numbers can never reach a client without re-approval.
- The CSV parser is a **stub** on purpose: it needs your real export columns.

---

## Layout

```
src/
  app/
    page.tsx                       Advisor console
    family/[id]/page.tsx           Client dashboard
    family/[id]/review/page.tsx    Review & publish screen
    family/[id]/review/actions.ts  Server actions: generate / save / approve / publish / preview
  components/
    Dashboard.tsx                  Presentational dashboard (renders by profile)
    ReviewEditor.tsx               Advisor draft/approve/publish UI
  lib/
    types.ts  tokens.ts  segments.ts  seed.ts
    store.ts                       Data layer (Supabase | in-memory)
    families.ts                    Thin re-export of store reads
    audit.ts                       Audit trail
    ai/anthropic.ts ai/voiceGuide.ts ai/draft.ts   AI drafting + number-safety
    delivery/email.ts delivery/text.ts             Snapshot + nudge (+ stubbed sends)
    blackdiamond/import.ts         Normalized import contract + upsert
supabase/  schema.sql  seed.sql
public/    StonebridgeLogo-2C.png
```

---

## Environment

Copy `.env.local.example` → `.env.local`. Everything is optional; each unset
key just disables that capability gracefully.

| Var | Enables |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Live persistence (Phase 2) |
| `ANTHROPIC_API_KEY` | AI drafting (Phase 4). Model is `claude-sonnet-5` in `ai/anthropic.ts` — confirm against docs.claude.com. |
| `NEXT_PUBLIC_APP_URL` | Links in email/text |
| `EMAIL_PROVIDER_KEY`, `SMS_PROVIDER_KEY` | Actual sends (Phase 5) |

Without `ANTHROPIC_API_KEY`, the review screen still loads and everything is
editable by hand; "Generate draft" returns a clear "not configured" message.

---

## Decisions flagged for you

- **tier = profile, not service level (maybe).** `Family.tier` decides *which
  modules* show. Your Segmentation Tracker computes a *service* tier (A/B/C). If
  those differ, split into `serviceTier` + `profile` and point `segments.ts` at
  `profile`.
- **Derived neutrals** (page/line/muted in `tokens.ts`) are invented — swap if
  your brand guide specifies them.
- **Gotham** is licensed; Montserrat stands in until you self-host it.

---

## Still needs you (not code)

- **Phase 0 answers:** Black Diamond access type (API vs. export) drives the
  Phase 3 parser; CCO requirements drive the disclosures, approval workflow
  specifics, and the archived email/SMS providers for Phase 5 sends.
- **Auth (Phase 1 deploy):** gate everything behind Clerk before real client data.
  Env keys are stubbed; wiring is a deploy step, deliberately not forced here so
  the local demo runs.

Nothing here is legal or compliance advice. The `status` gate, number-safety
check, and audit log are scaffolding for your review process, not a substitute
for your CCO signing off on it.
