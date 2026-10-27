// Appends (or refreshes) a "Sources and further reading" section on every guide.
// Every URL below was opened and checked before it was added. Do not add a link that has not been checked.
//
// Usage: node scripts/add-sources.mjs

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { L, SOURCES_HEADING, renderSources } from "./lib/sources.js";

const dir = new URL("../src/content/guides/", import.meta.url);


const MAP = {
  "1099-contractor-vs-w2-hourly-rate-equivalence": ["irsContractor", "ss8", "fs13", "misclass", "p15"],
  "50000-a-year-how-much-an-hour": ["fs23", "dolFlsa", "p15t", "tc751"],
  "75000-a-year-how-much-an-hour": ["fs23", "dolFlsa", "p15t", "tc751"],
  "80000-a-year-how-much-an-hour": ["fs23", "dolFlsa", "p15t", "tc751"],
  "85000-a-year-how-much-an-hour": ["fs23", "dolFlsa", "p15t", "tc751"],
  "base-hourly-plus-commission-payroll-draws": ["usc207", "cfr778", "fs23", "p15"],
  "biweekly-paycheck-calculation-26-periods": ["p15", "p15t", "fs23"],
  "flsa-7-minute-rounding-rule-timecard": ["cfr785", "fs22", "cfr516", "usc207"],
  "flsa-overtime-time-and-a-half-rules": ["usc207", "cfr778", "fs23", "ca510"],
  "flsa-regular-rate-of-pay-bonuses": ["usc207", "cfr778", "fs23"],
  "gross-vs-net-pay-payroll-deductions": ["p15", "p15t", "tc751", "k401", "p969"],
  "hourly-paycheck-tax-breakdown": ["p15", "p15t", "tc751", "ssa"],
  "hourly-pay-raise-impact-inflation-taxes": ["p15t", "tc751", "fs23"],
  "hourly-pay-stub-itemizer-flsa": ["cfr516", "p15", "dolFlsa"],
  "hourly-to-salary-annual-breakdown": ["fs23", "dolFlsa", "p15"],
  "hourly-to-salary-conversion-matrix": ["fs23", "dolFlsa", "p15"],
  "night-weekend-shift-differential-pay": ["cfr778", "usc207", "fs23"],
  "pto-vacation-payout-laws-by-state": ["dolFlsa", "p15", "p15t"],
  "real-hourly-pay-rate-after-tax": ["p15t", "tc751", "ssa"],
  "reverse-biweekly-to-hourly-rate-audit": ["fs23", "p15"],
  "salary-exempt-vs-non-exempt-flsa-test": ["fs17a", "cfr541", "usc213", "dolFlsa"],
  "salary-to-hourly-rate-converter": ["fs23", "dolFlsa", "p15"],
  "state-minimum-wage-annual-salary-rankings": ["dolMinWage", "usc206", "nyMin"],
  "tipped-minimum-wage-tip-credit-audit": ["usc203", "cfr531", "dolMinWage", "usc206"],
  "zero-state-income-tax-vs-california-new-york": ["p15", "p15t", "tc751"],
  "comp-time-in-lieu-of-overtime-public-vs-private": ["usc207", "cfr553", "fs23"],
  "fringe-benefit-taxation-imputed-income-company-vehicle": ["p15b", "t6121", "u61", "u127"],
  "hazard-pay-regulations-flsa-standards": ["cfr778", "usc207", "fs23"],
  "independent-contractor-economic-reality-test-dol": ["fs13", "misclass", "cfr795", "irsContractor", "ss8", "vcsp"],
  "on-call-waiting-time-engaged-to-wait-flsa": ["cfr785", "fs22", "dolFlsa"],
  "overtime-exemption-salary-basis-duties-test-flsa": ["fs17a", "cfr541", "usc213", "dolFlsa"],
  "overtime-for-dual-rate-workers-blended-hourly-rate": ["cfr778", "usc207", "fs23"],
  "per-diem-travel-stipends-irs-gsa-substantiation": ["p463", "gsa", "t162", "u62", "p15"],
  "prevailing-wage-davis-bacon-act-compliance": ["dba", "cfr5", "cfr3", "sam", "usc40"],
  "rest-break-and-meal-period-penalty-pay-california": ["ca2267", "ca512", "ca510"],
  "severance-pay-taxation-payroll-withholding-irc": ["p15t", "u3121", "u409a", "eeoc"],
  "split-shift-differential-premiums-california-ny": ["nyReg", "nyMin", "dolMinWage"],
  "supplemental-wage-withholding-bonus-taxation-rules": ["p15", "p15t", "u3402", "w4"],
  "travel-time-pay-portal-to-portal-act": ["usc254", "cfr785", "fs22"],
};

let changed = 0;
const missing = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const keys = MAP[slug];
  if (!keys) { missing.push(slug); continue; }
  const path = new URL(file, dir);
  const raw = readFileSync(path, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  let text = raw.replace(/\r\n/g, "\n");
  text = text.replace(/\n## Sources and further reading[\s\S]*$/, "").replace(/\s+$/, "");
  keys.forEach((k) => { if (!L[k]) throw new Error(`unknown source key ${k} for ${slug}`); });
  text += `

${renderSources(keys)}`;
  writeFileSync(path, text.replace(/\n/g, nl));
  changed++;
}

console.log(`Updated ${changed} guides.`);
if (missing.length) console.log("No source mapping for:", missing.join(", "));
