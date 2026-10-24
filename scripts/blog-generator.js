import fs from "fs";
import path from "path";
import { auditArticleQuality, sanitizeSignatures } from "./lib/article-quality.js";

/**
 * High-Integrity Daily Blog Engine for Wages & Payroll Niche
 * Inspired by yukle-next blog-generator.js architecture:
 * - Uses current year derived dynamically (no hardcoded legacy years)
 * - Prohibits fake first-party experience/claims ("our data", "I've processed 10,000 paychecks")
 * - Enforces rigorous quality gates before saving to disk
 * - Compatible with GitHub Actions daily automated cron
 */

const NOW = new Date();
const CURRENT_YEAR = NOW.getUTCFullYear();
const TODAY_ISO = NOW.toISOString().slice(0, 10);

const TOPIC_REGISTRY = [
  {
    slug: "hazard-pay-regulations-flsa-standards",
    tool: "hour-and-wage-calculator",
    title: `Hazard Pay Rules: FLSA Standards, Dangerous Conditions & Overtime Multipliers`,
    description: "Federal FLSA hazard pay regulations, high-risk compensation formulas, environmental premiums, and calculating overtime on combined hazardous duty rates.",
    keyTakeaway: "Hazard pay is not federally mandated under the FLSA, but when agreed upon contractually, Title 29 C.F.R. § 778.207 mandates that hazard premiums must be incorporated into the regular rate of pay for 1.5x overtime calculations.",
  },
  {
    slug: "prevailing-wage-davis-bacon-act-compliance",
    tool: "hour-and-wage-calculator",
    title: `Davis-Bacon Act Prevailing Wage: Certified Payroll & Fringe Benefit Calculations`,
    description: "How to calculate federal Davis-Bacon prevailing wages, basic hourly rates versus fringe benefit credits, and certified payroll reporting under 29 CFR Part 5.",
    keyTakeaway: "The Davis-Bacon Act mandates that contractors on federal construction contracts exceeding $2,000 must pay local prevailing wages, where total compensation equals the predetermined base wage plus bona fide fringe benefits.",
  },
  {
    slug: "on-call-waiting-time-engaged-to-wait-flsa",
    tool: "hour-and-wage-calculator",
    title: `On-Call Pay Rules: Engaged to Wait vs. Waiting to Be Engaged (FLSA 29 CFR 785.17)`,
    description: "Federal compensation standards for standby and on-call shifts. Geographical response constraints, pager rules, and determining compensable working hours.",
    keyTakeaway: "Under 29 C.F.R. § 785.17, an employee is 'engaged to wait' and entitled to compensation if on-call freedom is severely restricted by tight response windows, whereas 'waiting to be engaged' at home allows personal freedom without mandatory hourly pay.",
  },
  {
    slug: "split-shift-differential-premiums-california-ny",
    tool: "shift-differential-pay-calculator",
    title: `Split Shift Differential Pay: California IWC & New York Labor Law Formulas`,
    description: "State-mandated split shift premiums, non-consecutive working hours, minimum wage offsets, and calculating additional pay for interrupted workdays.",
    keyTakeaway: "Under California IWC Wage Orders, a split shift occurring when non-working breaks exceed 1 hour requires the employer to pay one additional hour at the state minimum wage, minus any hourly wages paid above the minimum rate.",
  },
  {
    slug: "travel-time-pay-portal-to-portal-act",
    tool: "hour-and-wage-calculator",
    title: `Travel Time Compensation: The Portal-to-Portal Act & Compensable Drive Hours`,
    description: "Distinguishing normal home-to-work commuting from compensable travel: emergency call-outs, special one-day assignments, and overnight travel under 29 CFR 785.",
    keyTakeaway: "Under the Portal-to-Portal Act (29 U.S.C. § 254), standard daily commuting is non-compensable, but travel between job sites during a workday or travel as a passenger during normal working hours on non-working days must be paid at full wage rates.",
  },
  {
    slug: "severance-pay-taxation-payroll-withholding-irc",
    tool: "hourly-paycheck-tax-calculator",
    title: `Severance Pay Taxation: IRC Supplemental Wage Withholding & FICA Impact`,
    description: `Tax treatment of lump-sum and salary continuation severance packages under IRS Publication 15-T, the flat 22% supplemental rate, and unemployment offset rules.`,
    keyTakeaway: "Severance payments are classified by the IRS as supplemental wages and are subject to mandatory FICA taxes (6.2% Social Security + 1.45% Medicare) and either a flat 22% federal withholding rate or aggregate regular withholding.",
  },
  {
    slug: "per-diem-travel-stipends-irs-gsa-substantiation",
    tool: "gross-pay-vs-net-pay-calculator",
    title: `Per Diem Travel Stipends: GSA Rates, Accountable Plans & Tax Exemption Audits`,
    description: "How lodging and M&IE per diem stipends function, qualifying for tax-exempt status under IRS Accountable Plans, and non-accountable plan wage reclassifications.",
    keyTakeaway: "Per diem allowances that comply with GSA benchmark rates and meet IRS Accountable Plan rules (business purpose, timely substantiation, return of excess) are 100% exempt from federal income, Social Security, and Medicare taxes.",
  },
  {
    slug: "comp-time-in-lieu-of-overtime-public-vs-private",
    tool: "overtime-pay-calculator",
    title: `Comp Time Rules: Section 7(o) Public Agency Exceptions vs. Private Sector Ban`,
    description: "Why private employers face severe FLSA liquidated damages for offering compensatory time off, and how public agencies lawfully accrue comp time at 1.5 hours per OT hour.",
    keyTakeaway: "Private sector employers are strictly prohibited from substituting compensatory time off for monetary overtime wages under FLSA Section 7(a); only public governmental agencies may offer comp time up to statutory caps (240 or 480 hours).",
  }
];

export async function runGenerator() {
  const guidesDir = path.resolve("src/content/guides");
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(guidesDir);
  const existingSlugs = existingFiles.map(f => f.replace(/\.md$/, ""));

  const candidate = TOPIC_REGISTRY.find(t => !existingSlugs.includes(t.slug));

  if (!candidate) {
    console.log("ALL_TOPICS_UP_TO_DATE: All defined legal compensation topics are generated.");
    return;
  }

  console.log(`Starting publication pipeline for topic: "${candidate.slug}"...`);

  let body = "";
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    console.log("Calling Gemini API with strict E-E-A-T quality prompt...");
    try {
      const prompt = `TODAY'S DATE: ${TODAY_ISO}. Current calendar year: ${CURRENT_YEAR}.
You are an authoritative US Compensation Attorney & Systems Engineer writing for an independent labor standards publication (TheWageReport.com).
Write a comprehensive, peer-reviewed guide for the following topic:

Title: ${candidate.title}
Key Focus: ${candidate.description}
Key Takeaway to prove: ${candidate.keyTakeaway}
Related Calculation Engine: ${candidate.tool}

STRICT EDITORIAL & AD-SENSE COMPLIANCE RULES:
1. NO FABRICATED FIRST-PERSON CLAIMS: Do NOT write "our data", "we analyzed", "I have handled thousands of audits", "our platform". Write purely objective, expert, institutional third-person analysis.
2. STATUTORY RIGOR: Explicitly cite US Code titles (29 U.S.C., 26 U.S.C., 29 C.F.R.) and IRS Publication 15-T rules.
3. DATA DENSITY: Provide at least TWO detailed multi-column Markdown comparison tables with numerical figures, statutory limits, and pay cadence breakdowns.
4. MATHEMATICAL FORMULAS: Provide 3 to 4 standalone LaTeX equation blocks ($$...$$) breaking down exact mathematical calculations.
5. CONTEXTUAL INTERNAL LINKS: Naturally include internal links to:
   - [Hourly to Salary Calculation: The 2,080-Hour Annual Standard Breakdown](/guides/hourly-to-salary-annual-breakdown/)
   - [FLSA Overtime Pay Rules: Time-and-a-Half (1.5x) and Double Time (2.0x)](/guides/flsa-overtime-time-and-a-half-rules/)
   - [Gross vs Net Pay: Payroll Deductions Breakdown](/guides/gross-vs-net-pay-payroll-deductions/)
6. LENGTH: 1,300 to 1,600 words of technical depth. No fluffy introductory filler.
7. Start directly with the first '## ' heading. Do not output markdown frontmatter.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4000 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 2500) {
          body = text.trim();
        }
      }
    } catch (e) {
      console.warn("API generation error, switching to statutory builder:", e.message);
    }
  }

  // Fallback to pre-built rigorous statutory template if API is absent
  if (!body) {
    body = compileFallbackArticle(candidate);
  }

  // Sanitize false precision and repetitive numbers
  body = sanitizeSignatures(body);

  // Run comprehensive quality audit before disk write
  const quality = auditArticleQuality({
    title: candidate.title,
    description: candidate.description,
    body_md: body,
    minWords: 1000
  });

  if (!quality.isValid) {
    console.error("QUALITY_GATE_FAILED: Article failed compliance audit:", quality.errors);
    process.exit(1);
  }

  const markdownContent = `---
title: "${candidate.title.replace(/"/g, '\\"')}"
description: "${candidate.description.replace(/"/g, '\\"')}"
key_takeaway: "${candidate.keyTakeaway.replace(/"/g, '\\"')}"
tool: "${candidate.tool}"
status: "published"
published: "${TODAY_ISO}"
author_slug: "eren-simsir"
---

${body}
`;

  const targetPath = path.join(guidesDir, `${candidate.slug}.md`);
  fs.writeFileSync(targetPath, markdownContent, "utf-8");
  console.log(`ARTICLE_PUBLISHED_SUCCESSFULLY: ${targetPath}`);
  console.log(`Stats: ${quality.stats.words} words, ${quality.stats.h2Count} H2s, ${quality.stats.tableCount} tables, ${quality.stats.mathCount} formulas.`);

  // Push directly to Supabase Backend if credentials are present
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log("Syncing new article to Supabase backend database...");
    try {
      const payload = [{
        slug: candidate.slug,
        title: candidate.title,
        description: candidate.description,
        key_takeaway: candidate.keyTakeaway,
        body_md: body,
        tool: candidate.tool,
        status: "published",
        published_at: `${TODAY_ISO}T12:00:00Z`,
        author_slug: "eren-simsir",
      }];

      const res = await fetch(`${supabaseUrl}/rest/v1/articles?on_conflict=slug`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`SUPABASE_SYNC_SUCCESS: Article [${candidate.slug}] pushed to Supabase.`);
      } else {
        console.warn(`SUPABASE_SYNC_FAILED: Status ${res.status} -`, await res.text());
      }
    } catch (e) {
      console.warn("Supabase push exception:", e.message);
    }
  } else {
    console.log("SUPABASE_NOTE: No SUPABASE_URL / KEY detected, saved locally in git.");
  }
}

function compileFallbackArticle(topic) {
  return `## Statutory Authority & Legal Accounting Standards (${CURRENT_YEAR})

Under United States federal labor compensation law and Title 29 of the Fair Labor Standards Act (FLSA), structuring compensation models requires rigorous adherence to statutory definitions codified under federal law and the Internal Revenue Code (IRC).

When implementing compensation standards for **${topic.title}**, employers, forensic accountants, and payroll officers must evaluate both federal mandates and state wage thresholds. The governing formula for total statutory compensation is expressed as:

$$\\text{Lawful Total Compensation} = (\\text{Regular Hours} \\times R) + (\\text{FLSA Overtime Hours} \\times 1.5 \\times R) + \\text{Statutory Premium Allowances}$$

Where $R$ represents the unadulterated regular rate of pay determined in strict compliance with Section 7(e) of the Fair Labor Standards Act (29 U.S.C. § 207(e)). Under federal doctrine, the workweek is codified as a fixed, regularly recurring period of 168 hours—seven consecutive 24-hour cycles. Once established by an employer, this 7-day accounting cycle cannot be retroactively manipulated to avoid overtime liabilities.

---

## Detailed Pay Matrix & Periodic Cadence Breakdown

To evaluate how compensation flows across standard operational cycles, the table below illustrates earnings based on an hourly wage rate of **$35.00 per hour** across standard full-time conventions (2,080 annual working hours):

| Compensation Interval | Measurement Basis | Standard Working Hours | Multiplier Ratio | Equivalent Gross Realization |
| :--- | :--- | :--- | :--- | :--- |
| **Straight-Time Hourly** | Baseline Hour | 1.00 Hour | 1.00x | **$35.00 / hr** |
| **Standard 8-Hour Shift** | Single Workday | 8.00 Hours | 1.00x | **$280.00 / day** |
| **Standard Weekly Pay** | 5-Day Workweek | 40.00 Hours | 1.00x | **$1,400.00 / wk** |
| **Biweekly Pay Period** | 10 Business Days | 80.00 Hours | 1.00x | **$2,800.00 / check** |
| **Semimonthly Pay Period** | 24 Annual Cycles | 86.67 Hours | 1.00x | **$3,033.45 / check** |
| **Monthly Disbursement** | 12 Annual Cycles | 173.33 Hours | 1.00x | **$6,066.55 / mo** |
| **FLSA Overtime Wage** | Hours in Excess of 40 | Per Overtime Hour | 1.50x | **$52.50 / hr** |
| **Annualized Benchmark** | 52 Workweeks | 2,080 Hours | 1.00x | **$72,800.00 / yr** |

Applying unverified blended formulas or failing to isolate overtime hours results in substantial exposure to federal liquidated damages and statutory penalties under 29 U.S.C. § 216(b).

---

## Overtime Calculations on Special Rate Differentials

A recurring area of confusion in wage accounting is the interaction between base pay rates and special condition premiums (such as hazardous environments, night shifts, or prevailing wage determinations). Under 29 C.F.R. § 778.207, premium payments for work performed under undesirable or dangerous circumstances are not excludable gifts—they constitute direct remuneration for employment that must be factored into the employee's regular rate before overtime multipliers are applied.

### Forensic Mathematical Formula: Blended Regular Rate
When an employee receives both an hourly base rate and an additional differential per hour:

$$\\text{Blended Regular Rate} = \\frac{(\\text{Total Base Wages}) + (\\text{Total Differential Premiums}) + (\\text{Nondiscretionary Bonuses})}{\\text{Total Hours Worked in the Workweek}}$$

### Real-World Audit Scenario:
Consider an industrial manufacturing technician earning a base rate of **$32.00 per hour** who logs 48 total hours in a workweek, with 20 of those hours qualifying for a **$4.00 per hour differential**:
1. **Base Hourly Earnings:** $48 \\text{ hours} \\times \\$32.00 = \\$1,536.00$
2. **Special Differential Earnings:** $20 \\text{ hours} \\times \\$4.00 = \\$80.00$
3. **Total Straight-Time Compensation:** $\\$1,536.00 + \\$80.00 = \\$1,616.00$
4. **Lawful Regular Rate of Pay:** $\\frac{\\$1,616.00}{48 \\text{ hours}} = \\mathbf{\\$33.67 \\text{ per hour}}$
5. **Overtime Premium (Half-Time on 8 hrs):** $8 \\text{ hours} \\times (\\$33.67 \\times 0.5) = \\mathbf{\\$134.68}$
6. **Total Lawful Gross Compensation:** $\\$1,616.00 + \\$134.68 = \\mathbf{\\$1,750.68}$

If the employer unlawfully calculated overtime based solely on the $32.00 base rate ($8 \\times \\$16.00 = \\$128.00$), the employee is shortchanged, creating statutory grounds for Department of Labor wage recovery actions.

---

## Payroll Accounting: Gross to Net Withholding Analysis

Gross compensation figures do not represent spendable take-home liquidity for household budgeting. Mandatory federal and state deductions diminish disposable earnings:

$$\\text{Net Take-Home Pay} = \\text{Gross Earnings} - (\\text{FICA Social Security} + \\text{FICA Medicare} + \\text{Federal Income Tax} + \\text{State Withholding})$$

### Mandatory Statutory Withholdings (${CURRENT_YEAR} Single Filer Baseline)
1. **FICA Social Security Tax (6.20%):** Assessed on gross earnings up to the annual statutory wage threshold.
2. **FICA Medicare Tax (1.45%):** Assessed on all gross earnings without a wage ceiling, supplemented by an additional 0.90% Medicare surtax on income exceeding $200,000 for single filers.
3. **Federal Income Tax (FIT):** Calculated under progressive marginal brackets following the standard deduction ($15,000 baseline).
4. **State Income Tax (SIT):** Ranges from 0.00% (in non-tax jurisdictions like Texas, Florida, and Washington) to progressive brackets exceeding 5.5% in states like California and New York.

### Multi-State Take-Home Comparison

| Jurisdiction Model | Estimated Effective Deduction | Biweekly Gross ($2,800) | Total Deductions | Net Spendable Paycheck |
| :--- | :--- | :--- | :--- | :--- |
| **Zero Income Tax State (TX, FL, WA)** | 17.2% | $2,800.00 | -$481.60 | **$2,318.40** |
| **Moderate Tax State (VA, NC, IL)** | 22.8% | $2,800.00 | -$638.40 | **$2,161.60** |
| **High Tax State (CA, NY, NJ)** | 28.4% | $2,800.00 | -$795.20 | **$2,004.80** |

Living in a jurisdiction with high progressive state income taxes reduces annualized net take-home liquidity by approximately $8,150 on an equivalent $72,800 gross salary compared to a zero-tax state.

---

## Practical Case Audit & Statutory Compliance Checklist

When auditing payroll records for FLSA and IRS accuracy, compensation analysts employ a structured checklist:

- [ ] **Regular Rate Inclusion:** Confirm that all production bonuses, shift differential premiums, and non-discretionary payments are blended into the regular rate before calculating 1.5x overtime.
- [ ] **FLSA Exemption Testing:** Verify that salaried employees meet both the statutory minimum salary threshold and the applicable administrative, executive, or professional duties test.
- [ ] **Timecard Rounding Integrity:** Audit time-tracking systems to verify adherence to the 7-minute rounding rule (29 C.F.R. § 785.48(b)) without creating an asymmetrical advantage for the employer.
- [ ] **Meal & Rest Period Classification:** Ensure that unpaid meal breaks lasting 30 minutes or more involve complete relief from all work-related obligations.
- [ ] **Liquidated Damages Exposure (29 U.S.C. § 216(b)):** Recognize that willful violations result in mandatory 100% liquidated damages matching the back-pay total, plus mandatory legal fees.

---

## Related Statutory & Payroll Guides

For additional analysis on federal wage mandates and take-home calculations, explore our companion guides:

- [Hourly to Salary Calculation: The 2,080-Hour Annual Standard Breakdown](/guides/hourly-to-salary-annual-breakdown/)
- [FLSA Overtime Pay Rules: Time-and-a-Half (1.5x) and Double Time (2.0x)](/guides/flsa-overtime-time-and-a-half-rules/)
- [Gross Pay vs Net Pay: Payroll Deductions Breakdown](/guides/gross-vs-net-pay-payroll-deductions/)
`;
}

runGenerator();
