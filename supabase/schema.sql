-- Stonebridge Client Dashboard — Phase 2 schema
-- Run in the Supabase SQL editor.

create table if not exists families (
  id            text primary key,          -- slug or uuid; used in the URL
  family_name   text not null,
  tier          text not null,             -- base | entertainer | philanthropist | transaction | nextgen
  status        text not null default 'draft', -- draft | approved | published (compliance gate)
  as_of         text not null,
  greeting      text not null,
  verdict       text not null,
  total_value   text not null,
  quarter_change text not null,
  plan_status   text not null,
  changed       jsonb not null default '[]',
  goals         jsonb not null default '[]',
  liquidity     jsonb not null default '{}',
  allocation    jsonb not null default '[]',
  philanthropy  jsonb not null default '{}',
  deal          jsonb not null default '{}',
  next_gen      jsonb not null default '{}',
  desk          jsonb not null default '{}',
  needs         jsonb not null default '[]',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Row Level Security: enable it, then add policies once auth (Clerk JWT) is wired.
-- The server uses the service-role key, which bypasses RLS. RLS matters when/if
-- the client ever reads directly. Until then, keep it locked:
alter table families enable row level security;
-- (no permissive policies = no anon/client access; service role still works)

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_families_updated_at on families;
create trigger trg_families_updated_at before update on families
  for each row execute function set_updated_at();

-- Books-and-records / Marketing Rule audit trail (Phase 4).
create table if not exists audit_log (
  id         bigint generated always as identity primary key,
  family_id  text not null references families(id),
  action     text not null,   -- draft_generated | draft_saved | approved | published | email_sent | text_sent
  actor      text not null,   -- the advisor (wire to Clerk user id)
  detail     text,
  at         timestamptz not null default now()
);
create index if not exists idx_audit_family on audit_log(family_id, at desc);
alter table audit_log enable row level security;
