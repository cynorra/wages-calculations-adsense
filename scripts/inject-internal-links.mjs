import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const dir = join(ROOT, "src", "content", "guides");
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
    "prevailing-wage-davis-bacon-act-compliance",
    "state-minimum-wage-annual-salary-rankings",
  ],
  overtime: [
    "flsa-overtime-time-and-a-half-rules",
    "flsa-regular-rate-of-pay-bonuses",
    "flsa-7-minute-rounding-rule-timecard",
    "night-weekend-shift-differential-pay",
    "salary-exempt-vs-non-exempt-flsa-test",
    "on-call-waiting-time-engaged-to-wait-flsa",
    "comp-time-in-lieu-of-overtime-public-vs-private",
    "hazard-pay-regulations-flsa-standards",
    "overtime-exemption-salary-basis-duties-test-flsa",
    "overtime-for-dual-rate-workers-blended-hourly-rate",
    "travel-time-pay-portal-to-portal-act",
    "split-shift-differential-premiums-california-ny",
  ],
  taxes: [
    "hourly-paycheck-tax-breakdown",
    "real-hourly-pay-rate-after-tax",
    "gross-vs-net-pay-payroll-deductions",
    "zero-state-income-tax-vs-california-new-york",
    "hourly-pay-stub-itemizer-flsa",
    "fringe-benefit-taxation-imputed-income-company-vehicle",
    "per-diem-travel-stipends-irs-gsa-substantiation",
    "severance-pay-taxation-payroll-withholding-irc",
    "supplemental-wage-withholding-bonus-taxation-rules",
  ],
  paycheck: [
    "biweekly-paycheck-calculation-26-periods",
    "reverse-biweekly-to-hourly-rate-audit",
    "pto-vacation-payout-laws-by-state",
    "base-hourly-plus-commission-payroll-draws",
    "tipped-minimum-wage-tip-credit-audit",
    "1099-contractor-vs-w2-hourly-rate-equivalence",
    "independent-contractor-economic-reality-test-dol",
    "rest-break-and-meal-period-penalty-pay-california",
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
  const cross2 = clusters[otherKeys[1]].filter((s) => s !== currentSlug)[0];
  return [...inCluster.slice(0, 2), cross, cross2].filter(Boolean);
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

  // Check how many internal links already exist
  const internalLinks = (content.match(/\[.*?\]\(\/guides\/[a-z0-9-]+\/?\)/gm) || []).length;
  if (internalLinks >= 3) {
    continue;
  }

  const recs = getRecommendations(slug);
  let block = "\n\n## Related Statutory & Payroll Guides\n\nFor additional context on FLSA regulations and compensation compliance, review our related guides:\n\n";
  let addedCount = 0;
  for (const r of recs) {
    if (titles[r] && !content.includes(`/guides/${r}/`)) {
      block += `- [${titles[r]}](/guides/${r}/)\n`;
      addedCount++;
      if (internalLinks + addedCount >= 3) break;
    }
  }

  if (addedCount > 0) {
    // Insert before sources heading if exists, otherwise append
    const sourcesIdx = content.indexOf("## Sources and further reading");
    if (sourcesIdx !== -1) {
      content = content.slice(0, sourcesIdx).trimEnd() + block + "\n" + content.slice(sourcesIdx);
    } else {
      content = content.trimEnd() + block;
    }
    writeFileSync(filePath, content, "utf8");
    modified++;
  }
}

console.log(`Successfully injected internal links into ${modified} markdown guides.`);
