---
title: "Hourly Paycheck Tax Withholding: Federal, FICA & State Deductions"
description: "Penny-accurate hourly paycheck deductions for Federal withholding, Social Security (6.2%), Medicare (1.45%), and State taxes under IRS Publication 15-T."
tool: "hourly-paycheck-tax-calculator"
status: "published"
published: "2026-11-06"
author_slug: "eren-simsir"
---

## Anatomy of Hourly Payroll Deductions: Statutory Authorities

When an hourly employee logs 80 hours across a standard biweekly pay period at an agreed rate of **$35.00 per hour**, their gross earnings equal **$2,800.00**. However, the net liquidity deposited into their checking account is significantly smaller, reduced by a series of mandatory statutory deductions governed by the Internal Revenue Code (IRC) and state tax authorities.

Payroll processors (e.g., ADP, Gusto, Paychex) do not calculate withholdings haphazardly. They execute precise percentage algorithms and bracket lookups published by the Internal Revenue Service in **IRS Publication 15-T (Federal Income Tax Withholding Methods)** and state departments of revenue.

---

## 1. Federal Insurance Contributions Act (FICA): Mandatory Payroll Taxes

Mandatory federal payroll taxes are governed by Chapter 21 of the Internal Revenue Code (IRC §§ 3101–3128) under the Federal Insurance Contributions Act (FICA). FICA is split into two distinct programs:

### A. Old-Age, Survivors, and Disability Insurance (OASDI / Social Security)
- **Statutory Employee Tax Rate:** **6.20%**
- **Employer Matching Contribution:** An identical **6.20%** paid directly by the employer (not deducted from employee wages).
- **Annual Wage Base Ceiling:** Social Security tax is capped annually by the Social Security Administration (SSA). In 2026, the taxable maximum wage base is set at **$176,100**. Any earnings beyond this cumulative threshold in a calendar year are taxed at 0.00% for OASDI.
- **Biweekly Deduction on $2,800:** $\$2,800.00 \times 0.062 = \mathbf{\$173.60}$

### B. Hospital Insurance (HI / Medicare)
- **Statutory Employee Tax Rate:** **1.45%**
- **Employer Matching Contribution:** An identical **1.45%** paid by the employer.
- **Annual Wage Base Ceiling:** **None**. Medicare tax applies to 100% of all gross earned wages.
- **Biweekly Deduction on $2,800:** $\$2,800.00 \times 0.0145 = \mathbf{\$40.60}$

### C. Additional Medicare Tax (IRC § 3101(b)(2))
High-income earners face an additional **0.90% Medicare surtax** on compensation exceeding statutory thresholds:
- $200,000 for single filers
- $250,000 for married couples filing jointly
- Employers are required to begin withholding the additional 0.9% in the pay period where cumulative year-to-date wages exceed $200,000, regardless of the employee's marital filing status.

### Total Standard FICA Tax Withheld:
$$\text{Combined FICA Rate} = 6.20\% + 1.45\% = \mathbf{7.65\%}$$
$$\text{Biweekly FICA Withholding on \$2,800} = \$2,800.00 \times 0.0765 = \mathbf{\$214.20}$$

---

## 2. Federal Income Tax Withholding (FIT): IRS Publication 15-T Methods

Unlike FICA's flat percentages, Federal Income Tax (FIT) withholding is determined using the employee's Form W-4 elections and IRS Publication 15-T computational rules. Employers use either the **Percentage Method** or the **Wage Bracket Method**.

### Biweekly Percentage Method Simulation (2026 Single Filer, Standard Withholding)
For an employee paid biweekly (26 pay periods per year) earning $2,800.00 gross per paycheck ($72,800 annualized):

1. **Annualized Gross Pay:** $\$2,800.00 \times 26 = \$72,800.00$
2. **Annual Withholding Allowance (Standard Deduction):** -$15,000.00
3. **Annualized Adjusted Wage Base:** **$57,800.00**
4. **Publication 15-T Progressive Slices:**
   - Tax on first $11,925 at 10%: $1,192.50
   - Tax on $11,925 to $48,475 ($36,550 at 12%): $4,386.00
   - Tax on $48,475 to $57,800 ($9,325 at 22%): $2,051.50
   - *Total Annualized Projected Federal Tax:* **$7,630.00**
5. **Biweekly Federal Withholding:** $\frac{\$7,630.00}{26 \text{ pay periods}} = \mathbf{\$293.46 \text{ per paycheck}}$

---

## 3. State and Municipal Income Taxes (SIT & Local Taxes)

State income tax withholdings vary widely across the 50 states and over 4,000 local taxing jurisdictions:

| Jurisdiction Profile | Representative States / Cities | State Tax Rate Formula | Biweekly Deduction on $2,800 | Net Biweekly Paycheck |
| :--- | :--- | :--- | :--- | :--- |
| **Zero Income Tax** | Texas, Florida, Washington, Tennessee | 0.00% | **$0.00** | **$2,292.34** |
| **Flat-Rate State** | North Carolina (4.5%), Arizona (2.5%), Illinois (4.95%)| Flat % on taxable base | **~$95.00 – $130.00** | **$2,162.34 – $2,197.34** |
| **Progressive State** | California (1% to 12.3% + 1.1% SDI)| Progressive brackets | **~$125.00 + $30.80 SDI**| **$2,136.54** |
| **State + Local City**| New York City (NYS progressive + NYC resident tax)| State + 3.876% city tax| **~$145.00 NYS + $95.00 NYC**| **$2,052.34** |

An hourly worker in New York City forfeits approximately **$240 more per biweekly paycheck** in state and municipal taxes than an identical coworker performing remote work from Texas or Florida.

---

## Penny-Accurate Paycheck Itemization Table ($35/hr, 80 Hours)

The complete itemization of an 80-hour biweekly paycheck for a single worker earning $35.00/hour in a moderate-tax state (e.g., Virginia or North Carolina) appears as follows:

| Paystub Category | Description / Authority | Calculation | Amount |
| :--- | :--- | :--- | :--- |
| **Gross Earnings** | 80 Hours Straight Time @ $35.00/hr | $80.00 \times \$35.00$ | **+$2,800.00** |
| **Pre-Tax Deduction** | 5% Pre-Tax 401(k) Retirement Deferral | $\$2,800.00 \times 0.05$ | -$140.00 |
| **Pre-Tax Deduction** | Section 125 Health Insurance Premium | Standard employee share | -$120.00 |
| **Taxable Wage Base (FIT/SIT)**| Gross minus Pre-Tax Benefit Deductions | $\$2,800 - \$140 - \$120$ | **$2,540.00** |
| **Taxable Wage Base (FICA)**| Gross minus Section 125 Health (401k is FICA taxable)| $\$2,800 - \$120$ | **$2,680.00** |
| **FICA: Social Security**| 6.20% on FICA wage base | $\$2,680.00 \times 0.062$ | -$166.16 |
| **FICA: Medicare** | 1.45% on FICA wage base | $\$2,680.00 \times 0.0145$ | -$38.86 |
| **Federal Income Tax** | IRS Pub 15-T Percentage Method on $2,540 | Progressive algorithm | -$242.15 |
| **State Income Tax** | State Department of Revenue algorithm | ~$2,540 \times 0.045$ | -$114.30 |
| **NET TAKE-HOME PAY** | Direct Deposit Amount to Employee Checking | Line-by-line total | **$1,978.53** |

### The Power of Pre-Tax Deductions
Notice that by contributing **$140.00 to a 401(k)** and **$120.00 to health insurance**, the employee sheltered $260.00 from federal and state income taxes. This reduced federal and state withholding by approximately **$69.00**, meaning the $260.00 in retirement and healthcare benefits only reduced take-home pay by **$191.00**.

---

## Year-End Payroll Reconciliations: Form W-2 Boxes Explained

At the conclusion of the tax year, the cumulative results of these hourly deductions are summarized on **IRS Form W-2 (Wage and Tax Statement)**:
- **Box 1 (Wages, tips, other compensation):** Gross wages minus pre-tax retirement, HSA, and Section 125 healthcare deductions. This is the figure transferred to Form 1040 Line 1z.
- **Box 2 (Federal income tax withheld):** Total cumulative FIT withheld across all paychecks.
- **Box 3 (Social Security wages):** Total earnings subject to OASDI (typically higher than Box 1 because 401(k) contributions are not exempt from FICA).
- **Box 4 (Social Security tax withheld):** Exactly 6.2% of Box 3 (capped at $10,918.20 for 2026).
- **Box 5 (Medicare wages and tips):** Total earnings subject to Medicare (no annual cap).
- **Box 6 (Medicare tax withheld):** 1.45% of Box 5 plus any 0.9% Additional Medicare Tax.

---

## Related Statutory & Payroll Guides

For additional context on FLSA regulations and take-home calculations, review our related guides:

- [Real Hourly Pay Rate After Tax: Demystifying Progressive Tax Brackets](/guides/real-hourly-pay-rate-after-tax/)
- [Gross Pay vs Net Pay: How Pre-Tax Reductions Preserve Take-Home Value](/guides/gross-vs-net-pay-payroll-deductions/)
- [Hourly to Salary Calculation: The 2,080-Hour Annual Standard Breakdown](/guides/hourly-to-salary-annual-breakdown/)
