-- Optional: load the two illustrative families into Supabase so you can test the
-- live path. These mirror src/lib/seed.ts. Safe to delete once you add real data.

insert into families (id, family_name, tier, status, as_of, greeting, verdict, total_value, quarter_change, plan_status, changed, goals, liquidity, allocation, philanthropy, deal, next_gen, desk, needs)
values
('rivera','The Rivera Family','entertainer','published','June 30, 2026','Good morning',
 'You''re on plan. One thing needs your signature.','$48.6M','+$1.2M this quarter','On track for your 2040 legacy goal',
 '["Tour income landed — $2.1M added to the reserve, exactly as planned.","We trimmed concentrated tech and rotated into munis for tax efficiency.","The Nashville property closed. Off the books, into the trust."]',
 '[{"label":"Legacy for the kids","pct":82,"done":false},{"label":"Foundation funding","pct":60,"done":false},{"label":"Work-optional by 50","pct":100,"done":true}]',
 '{"available":"$3.4M","obligation":"$1.1M","obligationNote":"Q3 estimated taxes, due Sept 15"}',
 '[{"label":"Public equity","pct":42,"color":"#264469"},{"label":"Fixed income","pct":23,"color":"#838E59"},{"label":"Private / alts","pct":20,"color":"#699CC6"},{"label":"Real estate","pct":9,"color":"#F79B2E"},{"label":"Cash","pct":6,"color":"#3F4B5C"}]',
 '{"label":"Rivera Family Foundation","committed":"$6.0M","granted":"$3.6M","pct":60,"note":"On pace to hit your 5% annual grant floor with room to spare."}',
 '{"name":"Pending property sale","stage":"Under contract — diligence","steps":["Offer accepted","Diligence","Financing","Close"],"current":1,"note":"Buyer''s inspection window closes Aug 8. No action needed from you yet."}',
 '{"label":"Next-generation transfers","lines":["529 plans fully funded for all three grandchildren.","Annual exclusion gifts made — $18k per beneficiary.","Next family governance meeting: October."]}',
 '{"quarter":"Q2 2026","body":"Markets did their thing this quarter — a little drama in April, a quiet recovery by June. Your plan didn''t flinch, and neither should you. The boring truth is that not reacting was the whole strategy, and you nailed it."}',
 '[{"title":"1 document to sign","detail":"Trust funding letter for the Nashville transfer.","cta":"Review & sign"}]'
)
on conflict (id) do nothing;
