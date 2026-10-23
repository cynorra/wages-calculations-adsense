import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const start = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const dry = args.includes("--dry-run");
const perWeek = Number(args[args.indexOf("--per-week") + 1]) || 6;
if (!start) {
  console.error("Usage: node scripts/reschedule.mjs YYYY-MM-DD [--dry-run] [--per-week N]");
  process.exit(1);
}

const DAYS = { 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6], 7: [0, 1, 2, 3, 4, 5, 6] }[perWeek];
if (!DAYS) throw new Error("--per-week must be 3 to 7");

const dir = new URL("../src/content/guides/", import.meta.url);
const today = new Date().toISOString().slice(0, 10);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const text = readFileSync(new URL(f, dir), "utf8");
    return { f, text, date: text.match(/^published:\s*(\S+)/m)?.[1] };
  })
  .filter((g) => g.date && g.date > today && !/^draft:\s*true/m.test(g.text))
  .sort((a, b) => a.date.localeCompare(b.date) || a.f.localeCompare(b.f));

let d = new Date(`${start}T12:00:00Z`);
const next = () => {
  while (!DAYS.includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1);
  const out = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 1);
  return out;
};
for (const g of files) {
  const nd = next();
  console.log(`${g.date} -> ${nd}  ${g.f}`);
  if (!dry) writeFileSync(new URL(g.f, dir), g.text.replace(/^published:\s*\S+/m, `published: ${nd}`));
}
