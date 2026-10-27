---
title: "Base Hourly Plus Commission: Total Compensation & Draw Accounting"
description: "How to model sales compensation combining base hourly wages with tiered commissions, navigating recoverable vs non-recoverable draw accounts, and FLSA overtime blending."
tool: "base-hourly-plus-commission-calculator"
status: "published"
published: "2026-10-28"
author_slug: "eren-simsir"
---

## Modeling Base Hourly Plus Commission Structures

In commercial sales operations, retail automotive dealerships, real estate brokerages, software technology accounts, and wholesale distribution networks, compensation plans frequently pair a fixed hourly safety floor with performance-driven commission incentives. 

This hybrid compensation model—known in compensation architecture as **Base Plus Commission**—balances financial stability for the worker with performance incentives for the business:

$$\text{Total Gross Pay} = (\text{Total Hours Worked} \times \text{Base Hourly Rate}) + \text{Total Earned Commissions}$$

### Representative Biweekly Scenario:
An inside sales specialist earns a guaranteed base wage of **$20.00 per hour** and receives a **4.0% commission** on closed gross revenue. 

During an 80-hour biweekly pay period:
1. **Base Hourly Wages:** $80 \text{ hours} \times \$20.00 = \mathbf{\$1,600.00}$
2. **Gross Closed Sales Volume:** $45,000.00
3. **Earned Commission:** $\$45,000.00 \times 0.04 = \mathbf{\$1,800.00}$
4. **Total Gross Paycheck:** $\$1,600.00 + \$1,800.00 = \mathbf{\$3,400.00}$
5. **Effective Realized Hourly Yield:** $\frac{\$3,400.00}{80 \text{ hours}} = \mathbf{\$42.50 \text{ per hour}}$

---

## Draw Accounting: Recoverable vs. Non-Recoverable Draws

Many sales organizations implement a **draw against commission** structure to provide representatives with predictable, smoothed cash flow during ramp-up periods or seasonal sales troughs. A draw operates as an advance of cash against anticipated future commission earnings.

The legal and financial distinction between a **recoverable draw** and a **non-recoverable draw** is critical for sales representatives to comprehend:

| Feature | Non-Recoverable Draw | Recoverable Draw |
| :--- | :--- | :--- |
| **Basic Concept** | A guaranteed minimum income floor that functions like a salary. | A loan or advance against future commissions to be earned. |
| **Shortfall Treatment** | If commissions fall below the draw, the employer covers the deficit. | The shortfall rolls over into subsequent months as a negative deficit balance. |
| **Repayment Obligation** | **Zero repayment obligation**. The employee keeps the funds without liability. | **Repaid from future commissions**. Future excess commissions pay down the deficit. |
| **Separation / Termination**| The employee owes $0 upon resignation or layoff. | In some states, employers attempt to claw back remaining deficit balances. |
| **Ideal For** | New sales hires during their first 90 to 180 days of territory building. | Experienced commission sales professionals with fluctuating seasonal pipelines. |

---

## Detailed Draw Reconciliation Example

Consider a sales executive with a **$4,000 monthly recoverable draw** agreement:

### Month 1: The Pipeline Building Phase
- Guaranteed Draw Paid: $4,000.00
- Actual Earned Commission: $2,500.00
- **Shortfall:** $\$4,000.00 - \$2,500.00 = \mathbf{\$1,500.00 \text{ Deficit Balance}}$
- Net Cash Received by Worker: **$4,000.00**
- *Account Status:* Worker carries a -$1,500 deficit into Month 2.

### Month 2: The Breakthrough Month
- Guaranteed Draw Baseline: $4,000.00
- Actual Earned Commission: $7,000.00
- Gross Commission Surplus: $\$7,000.00 - \$4,000.00 = \$3,000.00$
- **Deficit Clawback Applied:** -$1,500.00 deducted to clear the Month 1 debt.
- **Net Commission Payout Disbursed:** $\$7,000.00 - \$1,500.00 = \mathbf{\$5,500.00}$
- *Account Status:* Deficit fully cleared; balance resets to $0.

---

## The FLSA Minimum Wage Floor and Clawback Legality

Regardless of how poorly sales perform or how deep an employee falls into a recoverable draw deficit, federal law under the Fair Labor Standards Act (**29 U.S.C. § 206**) establishes an absolute statutory floor:

$$\mathbf{\text{An employee must receive at least the federal or state minimum wage for every hour worked in every pay period.}}$$

### Key Legal Protections for Sales Personnel:
1. **No Paycheck Reductions Below Minimum Wage:** An employer cannot apply a commission clawback that reduces an employee's effective hourly rate below the applicable statutory minimum wage ($7.25 federal, or $15.00 to $16.50+ in states like California, Washington, or New York).
2. **Post-Termination Clawbacks:** In many jurisdictions (such as California under Labor Code § 221), employers are **strictly barred from demanding cash repayment of unearned draws** following employment termination, treating unpaid draw balances as an ordinary cost of business enterprise risk.

---

## The Overtime Trap: Blending Commissions into the FLSA Regular Rate

One of the most frequent payroll violations in inside sales departments is failing to incorporate commissions into overtime calculations for non-exempt sales staff.

Under **29 C.F.R. § 778.118 and § 778.208**, commissions are non-discretionary payments that **must be included in the regular rate of pay**.

### Case Simulation: Inside Sales Rep Working Overtime
- **Base Rate:** $18.00 / hour
- **Hours Worked:** 50 hours (40 straight-time + 10 overtime hours)
- **Weekly Commission Closed:** $500.00

### Step 1: Compute Total Straight-Time Earnings
$$\text{Base Hourly Pay} = 50 \text{ hours} \times \$18.00 = \$900.00$$
$$\text{Total Straight Earnings} = \$900.00 + \$500.00 \text{ commission} = \mathbf{\$1,400.00}$$

### Step 2: Calculate the Lawful Regular Rate
$$\text{Regular Rate of Pay} = \frac{\$1,400.00}{50 \text{ hours}} = \mathbf{\$28.00 \text{ per hour}}$$
*(The commission boosted the true hourly rate from $18.00 to $28.00).*

### Step 3: Compute the Overtime Premium
Because straight-time on all 50 hours was already paid in Step 1, the employer owes an additional 0.5x premium on the 10 overtime hours:
$$\text{Overtime Premium} = 10 \text{ hours} \times (\$28.00 \times 0.5) = 10 \times \$14.00 = \mathbf{\$140.00}$$

### Step 4: Total Lawful Gross Compensation
$$\text{Total Lawful Gross Pay} = \$1,400.00 + \$140.00 = \mathbf{\$1,540.00}$$

**The Payroll Violation:** If the employer calculated overtime solely on the $18 base wage ($10 \times \$9 = \$90$), paying only **$1,490.00**, they shortchanged the employee by **$50.00 in a single week**.

---

## Strategic Checklist: Reviewing a Commission & Draw Agreement

Before accepting a base-plus-commission sales role:

- [ ] **Verify Draw Classification:** Confirm in writing whether any draw offered is recoverable or non-recoverable, and the exact duration of the guarantee period.
- [ ] **Determine Timing of Commission Vesting:** Does commission vest upon customer contract signing, invoice generation, or cash receipt by the employer?
- [ ] **Check Exemption Status:** Are you classified as an **Outside Sales Employee** under FLSA § 13(a)(1) (exempt from overtime), or an **Inside Sales Representative** (non-exempt and legally entitled to overtime)?
- [ ] **Audit Overtime Calculations:** Review your paystubs to verify that commission earnings are being factored into your regular rate for all overtime hours worked.

---

## Related Statutory & Payroll Guides

For additional context on FLSA regulations and take-home calculations, review our related guides:

- [Biweekly Paycheck Schedules: Navigating 26-Pay-Period Years and Magic Months](/guides/biweekly-paycheck-calculation-26-periods/)
- [Reverse Paycheck Audit: Biweekly to Hourly Rate Deconstruction](/guides/reverse-biweekly-to-hourly-rate-audit/)
- [Hourly to Salary Calculation: The 2,080-Hour Annual Standard Breakdown](/guides/hourly-to-salary-annual-breakdown/)

## Sources and further reading

The figures and rules in this article come from the primary sources below. Thresholds, rates, and limits change from year to year, so confirm the current value at the source before relying on it.

- [29 U.S.C. § 207, maximum hours (Cornell LII)](https://www.law.cornell.edu/uscode/text/29/207)
- [29 C.F.R. Part 778, overtime compensation (eCFR)](https://www.ecfr.gov/current/title-29/part-778)
- [DOL Fact Sheet #23, overtime pay requirements](https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay)
- [IRS Publication 15, Employer's Tax Guide](https://www.irs.gov/publications/p15)
