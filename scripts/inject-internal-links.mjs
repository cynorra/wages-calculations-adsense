import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../src/content/guides/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const files = readdirSync(dir).filter((f) => f.endsWith(".md"));

const clusters = {
  salary: [
    "hourly-to-salary-annual-breakdown",
    "salary-to-hourly-rate-converter",
    "hourly-to-salary-conversion-matrix",
    "50000-a-year-how-much-an-hour",
    "75000-a-year-how-much-an-hour",
    "80000-a-year-how-much-an-hour",
    "85000-a-year-how-much-an-hour",
    "hourly-pay-raise-impact-inflation-taxes",
  ],
  overtime: [
    "flsa-overtime-time-and-a-half-rules",
    "flsa-regular-rate-of-pay-bonuses",
    "flsa-7-minute-rounding-rule-timecard",
    "night-weekend-shift-differential-pay",
    "salary-exempt-vs-non-exempt-flsa-test",
  ],
  taxes: [
    "hourly-paycheck-tax-breakdown",
    "real-hourly-pay-rate-after-tax",
    "gross-vs-net-pay-payroll-deductions",
    "zero-state-income-tax-vs-california-new-york",
    "hourly-pay-stub-itemizer-flsa",
  ],
  paycheck: [
    "biweekly-paycheck-calculation-26-periods",
    "reverse-biweekly-to-hourly-rate-audit",
    "pto-vacation-payout-laws-by-state",
    "base-hourly-plus-commission-payroll-draws",
    "tipped-minimum-wage-tip-credit-audit",
    "1099-contractor-vs-w2-hourly-rate-equivalence",
    "state-minimum-wage-annual-salary-rankings",
  ],
};

function getCluster(slug) {
  for (const [key, list] of Object.entries(clusters)) {
    if (list.includes(slug)) return key;
  }
  return "salary";
}

function getRecommendations(currentSlug) {
  const c = getCluster(currentSlug);
  const inCluster = clusters[c].filter((s) => s !== currentSlug);
  const otherKeys = Object.keys(clusters).filter((k) => k !== c);
  const cross = clusters[otherKeys[0]].filter((s) => s !== currentSlug)[0];
  return [...inCluster.slice(0, 2), cross].filter(Boolean);
}

const titles = {};
for (const f of files) {
  const filePath = join(dir, f);
  const content = readFileSync(filePath, "utf8");
  const match = content.match(/title:\s*["']([^"']+)["']/);
  const slug = f.replace(".md", "");
  titles[slug] = match ? match[1] : slug;
}

let modified = 0;
for (const f of files) {
  const slug = f.replace(".md", "");
  const filePath = join(dir, f);
  let content = readFileSync(filePath, "utf8");

  if (content.includes("## Related Statutory & Payroll Guides")) {
    continue;
  }

  const recs = getRecommendations(slug);
  let block = "\n\n## Related Statutory & Payroll Guides\n\nFor additional context on FLSA regulations and take-home calculations, review our related guides:\n\n";
  for (const r of recs) {
    if (titles[r]) {
      block += `- [${titles[r]}](/guides/${r}/)\n`;
    }
  }

  content = content.trimEnd() + block;
  writeFileSync(filePath, content, "utf8");
  modified++;
}

console.log(`Successfully injected internal links into ${modified} markdown guides.`);
