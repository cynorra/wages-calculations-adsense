import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { guideRow } from "../src/lib/frontmatter.js";

const dir = new URL("../src/content/guides/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();

console.log(`Total guides to schedule: ${files.length}`);

// We will keep 8 core foundational guides published as of TODAY (Oct 24, 2026) and prior days.
// The remaining 29 guides will be distributed across subsequent days (mostly 1 per day, occasionally 2).

const KEEP_LIVE = new Set([
  "hourly-to-salary-annual-breakdown.md",
  "salary-to-hourly-rate-converter.md",
  "hourly-to-salary-conversion-matrix.md",
  "75000-a-year-how-much-an-hour.md",
  "80000-a-year-how-much-an-hour.md",
  "50000-a-year-how-much-an-hour.md",
  "hourly-paycheck-tax-breakdown.md",
  "hourly-pay-stub-itemizer-flsa.md"
]);

// 1. Assign past dates up to Oct 24 for the KEEP_LIVE guides
const liveDates = [
  "2026-10-20",
  "2026-10-20",
  "2026-10-21",
  "2026-10-21",
  "2026-10-22",
  "2026-10-22",
  "2026-10-23",
  "2026-10-24"
];

let liveIdx = 0;
const futureFiles = [];

for (const file of files) {
  if (KEEP_LIVE.has(file)) {
    const filePath = new URL(file, dir);
    const text = readFileSync(filePath, "utf8");
    const d = liveDates[liveIdx++] || "2026-10-24";
    const updated = text.replace(/^published:\s*.*$/m, `published: "${d}"`);
    writeFileSync(filePath, updated);
    console.log(`[LIVE TODAY] ${d} -> ${file}`);
  } else {
    futureFiles.push(file);
  }
}

// 2. Schedule remaining 29 files from Oct 25 onwards: mostly 1/day, weekends or specific days 2/day
let currentCalendarDate = new Date("2026-10-25T12:00:00Z");
let remaining = [...futureFiles];

while (remaining.length > 0) {
  const dateStr = currentCalendarDate.toISOString().slice(0, 10);
  const dayOfWeek = currentCalendarDate.getUTCDay(); // 0: Sun, 6: Sat

  // Give 2 articles on Saturdays and Wednesdays, 1 article on other days
  const countToday = (dayOfWeek === 6 || dayOfWeek === 3) && remaining.length > 1 ? 2 : 1;
  const batch = remaining.splice(0, countToday);

  for (const f of batch) {
    const filePath = new URL(f, dir);
    const text = readFileSync(filePath, "utf8");
    const updated = text.replace(/^published:\s*.*$/m, `published: "${dateStr}"`);
    writeFileSync(filePath, updated);
    console.log(`[SCHEDULED] ${dateStr} -> ${f}`);
  }

  // Advance by 1 day
  currentCalendarDate.setUTCDate(currentCalendarDate.getUTCDate() + 1);
}

console.log("\nAll guides have been cleanly scheduled into the calendar!");
