import { readdirSync, readFileSync, writeFileSync } from "node:fs";

// Usage: node scripts/curated-schedule.mjs [--apply]
// Sets published dates in src/content/guides and (with --apply) mirrors them to Supabase.
// A curated launch set of 7 guides goes live first; the rest follow at one per day.

const dir = new URL("../src/content/guides/", import.meta.url);
const apply = process.argv.includes("--apply");

const LAUNCH = [
  ["50000-a-year-how-much-an-hour", "2026-10-20"],
  ["gross-vs-net-pay-payroll-deductions", "2026-10-21"],
  ["flsa-overtime-time-and-a-half-rules", "2026-10-22"],
  ["flsa-regular-rate-of-pay-bonuses", "2026-10-23"],
  ["salary-exempt-vs-non-exempt-flsa-test", "2026-10-24"],
  ["tipped-minimum-wage-tip-credit-audit", "2026-10-26"],
  ["1099-contractor-vs-w2-hourly-rate-equivalence", "2026-10-27"],
];
const FOLLOW_START = "2026-10-28";

const slugs = readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
const launchSlugs = new Set(LAUNCH.map(([s]) => s));
for (const s of launchSlugs) if (!slugs.includes(s)) throw new Error(`missing launch guide: ${s}`);

// Keep the near-identical "$X a year" guides apart instead of publishing them back to back.
const rest = slugs.filter((s) => !launchSlugs.has(s));
const salary = rest.filter((s) => /^\d+-a-year-/.test(s));
const other = rest.filter((s) => !/^\d+-a-year-/.test(s));
const gap = Math.floor(other.length / (salary.length + 1));
const ordered = [...other];
salary.forEach((s, i) => ordered.splice((i + 1) * gap + i, 0, s));

const plan = [...LAUNCH];
const d = new Date(`${FOLLOW_START}T12:00:00Z`);
for (const s of ordered) {
  plan.push([s, d.toISOString().slice(0, 10)]);
  d.setUTCDate(d.getUTCDate() + 1);
}

for (const [slug, date] of plan) {
  console.log(`${date}  ${slug}`);
  if (!apply) continue;
  const path = new URL(`${slug}.md`, dir);
  writeFileSync(path, readFileSync(path, "utf8").replace(/^published:\s*.*$/m, `published: "${date}"`));
}

if (apply) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY required to sync dates");
  for (const [slug, date] of plan) {
    const res = await fetch(`${url}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ published_at: `${date}T12:00:00Z` }),
    });
    if (!res.ok) console.warn(`Supabase update failed for ${slug}: ${res.status} ${await res.text()}`);
  }
  console.log("Supabase dates synced.");
}
