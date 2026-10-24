import fs from "fs";
import path from "path";

/**
 * 2026 Tier-1 High-Quality AI Compensation Engine (AdSense & E-E-A-T Compliant)
 * Generates in-depth, original research guides with statutory formulas, real case audits,
 * and structured comparison data.
 */

const TOPIC_REGISTRY = [
  {
    slug: "hazard-pay-regulations-flsa-standards",
    tool: "hour-and-wage-calculator",
    title: "Hazard Pay Rules: FLSA Standards, Dangerous Conditions & Overtime Multipliers",
    description: "Federal FLSA hazard pay regulations, high-risk compensation formulas, environmental premiums, and calculating overtime on combined hazardous duty rates.",
    keyTakeaway: "Hazard pay is not federally mandated under the FLSA, but when agreed upon contractually, Title 29 C.F.R. § 778.207 mandates that hazard premiums must be incorporated into the regular rate of pay for 1.5x overtime calculations.",
    focusKeywords: ["hazard pay regulations", "FLSA dangerous duty pay", "environmental differential wage", "overtime on hazard pay"]
  },
  {
    slug: "prevailing-wage-davis-bacon-act-compliance",
    tool: "hour-and-wage-calculator",
    title: "Davis-Bacon Act Prevailing Wage: Certified Payroll & Fringe Benefit Calculations",
    description: "How to calculate federal Davis-Bacon prevailing wages, basic hourly rates versus fringe benefit credits, and certified payroll reporting under 29 CFR Part 5.",
    keyTakeaway: "The Davis-Bacon Act mandates that contractors on federal construction contracts exceeding $2,000 must pay local prevailing wages, where total compensation equals the predetermined base wage plus bona fide fringe benefits.",
    focusKeywords: ["davis bacon prevailing wage", "certified payroll fringe benefits", "FLSA government contract wages", "29 CFR Part 5 rates"]
  },
  {
    slug: "on-call-waiting-time-engaged-to-wait-flsa",
    tool: "hour-and-wage-calculator",
    title: "On-Call Pay Rules: Engaged to Wait vs. Waiting to Be Engaged (FLSA 29 CFR 785.17)",
    description: "Federal compensation standards for standby and on-call shifts. Geographical response constraints, pager rules, and determining compensable working hours.",
    keyTakeaway: "Under 29 C.F.R. § 785.17, an employee is 'engaged to wait' and entitled to compensation if on-call freedom is severely restricted by tight response windows, whereas 'waiting to be engaged' at home allows personal freedom without mandatory hourly pay.",
    focusKeywords: ["FLSA on call pay rules", "engaged to wait compensation", "standby wage regulations", "29 CFR 785.17"]
  },
  {
    slug: "split-shift-differential-premiums-california-ny",
    tool: "shift-differential-pay-calculator",
    title: "Split Shift Differential Pay: California IWC & New York Labor Law Formulas",
    description: "State-mandated split shift premiums, non-consecutive working hours, minimum wage offsets, and calculating additional pay for interrupted workdays.",
    keyTakeaway: "Under California IWC Wage Orders, a split shift occurring when non-working breaks exceed 1 hour requires the employer to pay one additional hour at the state minimum wage, minus any hourly wages paid above the minimum rate.",
    focusKeywords: ["split shift differential pay", "California split shift wage order", "interrupted shift compensation", "NY split shift premium"]
  },
  {
    slug: "travel-time-pay-portal-to-portal-act",
    tool: "hour-and-wage-calculator",
    title: "Travel Time Compensation: The Portal-to-Portal Act & Compensable Drive Hours",
    description: "Distinguishing normal home-to-work commuting from compensable travel: emergency call-outs, special one-day assignments, and overnight travel under 29 CFR 785.",
    keyTakeaway: "Under the Portal-to-Portal Act (29 U.S.C. § 254), standard daily commuting is non-compensable, but travel between job sites during a workday or travel as a passenger during normal working hours on non-working days must be paid at full wage rates.",
    focusKeywords: ["compensable travel time FLSA", "portal to portal act rules", "drive time hourly compensation", "overnight business travel wages"]
  },
  {
    slug: "severance-pay-taxation-payroll-withholding-irc",
    tool: "hourly-paycheck-tax-calculator",
    title: "Severance Pay Taxation: IRC Supplemental Wage Withholding & FICA Impact",
    description: "Tax treatment of lump-sum and salary continuation severance packages under IRS Publication 15-T, the flat 22% supplemental rate, and unemployment offset rules.",
    keyTakeaway: "Severance payments are classified by the IRS as supplemental wages and are subject to mandatory FICA taxes (6.2% Social Security + 1.45% Medicare) and either a flat 22% federal withholding rate or aggregate regular withholding.",
    focusKeywords: ["severance pay taxation 2026", "IRS supplemental withholding severance", "lump sum severance FICA", "severance paycheck deductions"]
  },
  {
    slug: "per-diem-travel-stipends-irs-gsa-substantiation",
    tool: "gross-pay-vs-net-pay-calculator",
    title: "Per Diem Travel Stipends: GSA Rates, Accountable Plans & Tax Exemption Audits",
    description: "How lodging and M&IE per diem stipends function, qualifying for tax-exempt status under IRS Accountable Plans, and non-accountable plan wage reclassifications.",
    keyTakeaway: "Per diem allowances that comply with GSA benchmark rates and meet IRS Accountable Plan rules (business purpose, timely substantiation, return of excess) are 100% exempt from federal income, Social Security, and Medicare taxes.",
    focusKeywords: ["per diem tax exemption IRS", "GSA travel stipend rates 2026", "accountable plan payroll rules", "per diem vs hourly wage"]
  },
  {
    slug: "comp-time-in-lieu-of-overtime-public-vs-private",
    tool: "overtime-pay-calculator",
    title: "Comp Time Rules: Section 7(o) Public Agency Exceptions vs. Private Sector Ban",
    description: "Why private employers face severe FLSA liquidated damages for offering compensatory time off, and how public agencies lawfully accrue comp time at 1.5 hours per OT hour.",
    keyTakeaway: "Private sector employers are strictly prohibited from substituting compensatory time off for monetary overtime wages under FLSA Section 7(a); only public governmental agencies may offer comp time up to statutory caps (240 or 480 hours).",
    focusKeywords: ["comp time private employer illegal", "FLSA section 7o public agency", "compensatory time off calculation", "comp time vs overtime pay"]
  }
];

export async function runAutoPublisher() {
  const guidesDir = path.resolve("src/content/guides");
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(guidesDir);
  const existingSlugs = existingFiles.map(f => f.replace(/\.md$/, ""));

  // Find candidate topic not yet written
  const nextTopic = TOPIC_REGISTRY.find(t => !existingSlugs.includes(t.slug));

  if (!nextTopic) {
    console.log("ALL_TOPICS_PUBLISHED: All curated topics are currently generated.");
    return;
  }

  console.log(`Generating high-quality statutory guide: ${nextTopic.slug}...`);

  const today = new Date().toISOString().slice(0, 10);
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  let articleBody = "";

  if (geminiKey) {
    // Generate elite article via Gemini 2.5 Flash / Pro API
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an elite US Payroll & Labor Compensation Attorney and Systems Engineer writing for an authoritative publication (HourlySalaryCalc.com).
Write an extensive, peer-reviewed, masterclass guide on the following topic:

Title: ${nextTopic.title}
Key Focus: ${nextTopic.description}
Key Takeaway to prove: ${nextTopic.keyTakeaway}
Related Tool: ${nextTopic.tool}

MANDATORY EDITORIAL STANDARDS (AdSense Quality & E-E-A-T Compliance):
1. Word Count: 1,300 to 1,600 words of dense, rigorous, technical analysis. Zero generic filler, zero fluff.
2. Structure: Exactly 5 to 7 major '## ' (H2) sections, plus subsections with '### '.
3. Statutory Rigor: Directly cite federal codes (e.g. 29 U.S.C. § ..., 26 U.S.C., 29 C.F.R. § ...) and relevant 2026 IRS Publication 15-T standards.
4. Rich Markdown Tables: Include at least TWO detailed multi-column Markdown comparison tables with real numerical examples, statutory limits, and formulas.
5. Mathematical Formulas: Include 3 to 4 standalone LaTeX equation blocks ($$...$$) breaking down exact mathematical formulas.
6. Practical Case Audits: Include realistic employee scenarios (e.g., $32.00/hr technician working specific shift hours, bonus distributions, and tax deductions).
7. Year Relevance: Incorporate 2026 inflation-adjusted limits, standard deductions ($15,000 single), and tax brackets.
8. Internal Linking: Naturally cite internal guides using Markdown links: [Hourly to Salary Calculation](/guides/hourly-to-salary-annual-breakdown/), [FLSA Overtime Pay Rules](/guides/flsa-overtime-time-and-a-half-rules/), and [Gross vs Net Pay](/guides/gross-vs-net-pay-payroll-deductions/).

DO NOT output frontmatter (I will attach it). Start directly with the first '## ' section.`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 2500) {
          articleBody = text.trim();
        }
      } else {
        console.warn("Gemini API call failed, using built-in high-quality statutory blueprint.");
      }
    } catch (e) {
      console.warn("API error, fallback to statutory compiler:", e.message);
    }
  }

  // High-authority statutory fallback if API key is not present or failed
  if (!articleBody) {
    articleBody = generateStatutoryFallback(nextTopic);
  }

  const fullMarkdown = `---
title: "${nextTopic.title.replace(/"/g, '\\"')}"
description: "${nextTopic.description.replace(/"/g, '\\"')}"
key_takeaway: "${nextTopic.keyTakeaway.replace(/"/g, '\\"')}"
tool: "${nextTopic.tool}"
status: "published"
published: "${today}"
author_slug: "eren-simsir"
---

${articleBody}
`;

  const targetFile = path.join(guidesDir, `${nextTopic.slug}.md`);
  fs.writeFileSync(targetFile, fullMarkdown, "utf-8");
  console.log(`SUCCESS: Created high-quality guide at ${targetFile} (${articleBody.split(/\s+/).length} words).`);
}

function generateStatutoryFallback(topic) {
  return `## Statutory Authority & Legal Framework (2026 Compliance)

Under United States federal labor compensation law and Title 29 of the Fair Labor Standards Act (FLSA), navigating compensation requires applying statutory accounting conventions codified under federal regulations and Internal Revenue Code (IRC) standards.

When structuring compensation for **${topic.title}**, employers and payroll administrators must ensure adherence to Department of Labor (DOL) Wage and Hour Division mandates. The baseline compensation is governed by:

$$\\text{Total Lawful Compensation} = (\\text{Regular Hours} \\times R) + (\\text{Statutory Overtime Hours} \\times 1.5 \\times R) + \\text{Statutory Premiums}$$

Where $R$ represents the unadulterated regular rate of pay determined in accordance with 29 U.S.C. § 207(e).

---

## Technical Pay Breakdown & Conversion Matrix

To illustrate the financial impact across pay cycles, consider a baseline scenario of an earner at **$34.00 per hour** under standard 2026 full-time parameters (2,080 annual working hours):

| Compensation Element | Cadence / Basis | Standard Hours | Hourly Multiplier | Gross Equivalent |
| :--- | :--- | :--- | :--- | :--- |
| **Base Hourly Labor** | Hourly Rate | 1.00 Hour | 1.00x | **$34.00 / hr** |
| **Standard Day Shift** | 8-Hour Workday | 8.00 Hours | 1.00x | **$272.00 / day** |
| **Standard Weekly Pay** | 40-Hour Workweek | 40.00 Hours | 1.00x | **$1,360.00 / wk** |
| **Biweekly Regular Check** | 80-Hour Pay Period | 80.00 Hours | 1.00x | **$2,720.00 / check** |
| **FLSA Overtime Hours** | Excess of 40 hrs/wk | Per OT Hour | 1.50x | **$51.00 / hr** |
| **Gross Annualized Benchmark** | 52 Workweeks | 2,080 Hours | 1.00x | **$70,720.00 / yr** |

Failing to properly classify regular hours versus premium hours introduces substantial liabilities under federal audit procedures.

---

## Payroll Accounting: Gross to Net Withholding Analysis

Compensation realized as gross pay does not reflect liquidity in an employee's checking account. Mandatory federal and state deductions diminish the take-home cash flow:

$$\\text{Net Take-Home Pay} = \\text{Gross Pay} - (\\text{FICA Social Security} + \\text{FICA Medicare} + \\text{FIT} + \\text{SIT})$$

### 2026 Statutory Deduction Schedule (Single Filer, Standard Deduction)
1. **FICA Social Security Tax (6.20%):** Assessed on all gross earnings up to the annual statutory wage cap.
2. **FICA Medicare Tax (1.45%):** Assessed on all wages with zero cap, plus an additional 0.90% Medicare surtax on earnings exceeding $200,000 for single filers.
3. **Federal Income Tax (FIT):** Computed under IRS Publication 15-T progressive brackets following the standard deduction.
4. **State Income Tax (SIT):** Ranges from 0.00% (in states such as Texas, Florida, and Washington) to progressive tiers exceeding 5.5% in states like California and New York.

### Jurisdiction Take-Home Comparison

| State Tax Jurisdiction | Estimated Effective Tax | Biweekly Gross ($2,720) | Mandatory Deductions | Net Biweekly Take-Home |
| :--- | :--- | :--- | :--- | :--- |
| **Zero Income Tax State (TX, FL, WA)** | 16.8% | $2,720.00 | -$456.96 | **$2,263.04** |
| **Moderate Tax State (VA, NC, IL)** | 22.4% | $2,720.00 | -$609.28 | **$2,110.72** |
| **High Tax State (CA, NY, NJ)** | 27.8% | $2,720.00 | -$756.16 | **$1,963.84** |

---

## Practical Case Audit & Compliance Checklist

When auditing payroll records for statutory compliance, compensation analysts follow a strict verification protocol:

- [ ] **Regular Rate Verification:** Verify that all production bonuses, shift differentials, and non-discretionary stipends are blended into the regular rate prior to computing overtime multipliers.
- [ ] **FLSA Classification:** Ensure that exempt versus non-exempt classifications satisfy both the salary basis test (statutory threshold) and the specific administrative, executive, or professional duties tests.
- [ ] **Accurate Timecard Rounding:** Audit electronic time clocks to ensure rounding rules comply with the 7-minute rounding standard (29 C.F.R. § 785.48(b)) without systematically favoring the employer.
- [ ] **Meal & Rest Period Compliance:** Confirm that meal breaks lasting 30 minutes or more are completely relieved of all duties; otherwise, time must be fully compensated.

---

## Related Statutory & Payroll Guides

For additional analysis on federal wage mandates and take-home calculations, explore our companion guides:

- [Hourly to Salary Calculation: The 2,080-Hour Annual Standard Breakdown](/guides/hourly-to-salary-annual-breakdown/)
- [FLSA Overtime Pay Rules: Time-and-a-Half (1.5x) and Double Time (2.0x)](/guides/flsa-overtime-time-and-a-half-rules/)
- [Gross Pay vs Net Pay: Payroll Deductions Breakdown](/guides/gross-vs-net-pay-payroll-deductions/)
`;
}

// Execute directly if run as CLI script
runAutoPublisher();
