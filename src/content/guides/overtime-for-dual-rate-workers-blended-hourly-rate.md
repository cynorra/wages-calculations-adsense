---
title: "Calculating Overtime for Dual-Rate Workers: Weighted Average Regular Rate"
description: "How to calculate lawful overtime when an employee works two different jobs at different hourly rates in the same workweek under 29 CFR 778.115."
key_takeaway: "When an employee works at two or more rates in one workweek, overtime is owed on the weighted average of all earnings, unless a prior agreement fixes the overtime rate for the overtime work (29 C.F.R. §§ 778.115 and 778.419)."
tool: "hour-and-wage-calculator"
status: "published"
published: "2026-11-14"
author_slug: "eren-simsir"
---

A restaurant employee spends part of the week as a server at a tip-credit wage and part as a prep cook at a higher rate. A warehouse worker is a forklift operator some days and a general laborer others. When these workers pass 40 hours, which rate is the overtime rate? The FLSA gives two lawful answers and one common wrong answer.

## The setup used throughout this guide

Maria works for a distribution company in one workweek:

| Job | Hours | Rate | Straight-time pay |
| :--- | :--- | :--- | :--- |
| Forklift operator | 30 | $24.00 | $720.00 |
| Packing | 18 | $18.00 | $324.00 |
| **Total** | **48** | | **$1,044.00** |

She worked 8 hours over 40, so overtime is owed. There are two lawful ways to compute it.

## Method 1: the weighted average (the default)

Under 29 C.F.R. § 778.115, when no other agreement exists, the regular rate is the **total straight-time pay divided by total hours**. Overtime is then owed at half that rate for each overtime hour, because the straight time for all 48 hours has already been paid.

$$\text{Weighted regular rate} = \frac{\$720.00 + \$324.00}{48} = \$21.75$$

$$\text{Overtime premium} = 8 \times (0.5 \times \$21.75) = \$87.00$$

$$\text{Total pay} = \$1{,}044.00 + \$87.00 = \$1{,}131.00$$

Note that the half-time method works only because the straight-time earnings for all hours are in the numerator. A frequent error is to apply 1.5x to the weighted rate and then pay it on top of straight time, which double-counts.

## Method 2: the rate for the overtime work (by agreement)

Under 29 C.F.R. § 778.419, if the employee and employer agree **in advance of the work** that overtime is paid at one and one-half times the rate for the job being performed when the overtime occurs, the overtime is computed that way. The agreement must be made before the overtime is worked, the rate must be a bona fide rate, and the employee must in fact be performing the work at that rate during the overtime hours.

Suppose Maria's overtime hours were all packing hours, with an agreement in place:

$$\text{Total pay for the 8 overtime hours} = 8 \times (1.5 \times \$18.00) = \$216.00$$

Her straight-time pay for those 8 hours ($144.00) is already inside the $1,044, so the **extra** owed is only the half-time portion:

$$\text{Extra overtime owed} = 8 \times (0.5 \times \$18.00) = \$72.00 \quad \text{Total} = \$1{,}116.00$$

| Method | Overtime premium | Weekly total |
| :--- | :--- | :--- |
| 1. Weighted average | $87.00 | $1,131.00 |
| 2. Overtime-job rate (with advance agreement) | $72.00 | $1,116.00 |

## Which is better for whom?

Method 2 helps the employer when the overtime tends to fall on the lower-paid job and hurts the employee. It also helps the employee when overtime falls on the higher-paid job, so the agreement should be genuinely neutral and not used selectively. Without a proper agreement, Method 1 applies, and an employer that guesses at Method 2 can owe back wages.

## Adding bonuses and differentials

Nondiscretionary bonuses and shift premiums go into the numerator before dividing. If Maria also received a $60 attendance bonus:

$$\frac{\$720.00 + \$324.00 + \$60.00}{48} = \$23.00$$

$$\text{Premium} = 8 \times (0.5 \times \$23.00) = \$92.00$$

See [regular rate and bonuses](/guides/flsa-regular-rate-of-pay-bonuses/) for which payments are included.

## Tipped employees with two jobs

Under the "dual jobs" rule in 29 C.F.R. § 531.56(e), an employee who is a tipped server in one role and a non-tipped worker in another is entitled to the tip credit only for the tipped role. How much side work (rolling silverware, cleaning) may be done before the credit is lost has been litigated: the DOL's 2021 rule with a 20% and 30-minute limit was vacated by the Fifth Circuit in 2024, so check the current guidance and your state's rules. The weighted average then uses the cash wage actually paid plus the tip credit properly taken. See the [tip credit audit](/guides/tipped-minimum-wage-tip-credit-audit/) for the details.

## Record-keeping

For each employee with multiple rates, payroll records should show hours worked at each rate, each rate in effect, and any agreement about overtime computation, in writing and dated before the work. These records must be kept for three years under 29 C.F.R. Part 516.

## Statutory Liabilities and DOL Audit Verification

Under FLSA Section 16(b) (29 U.S.C. § 216(b)), an employer that miscalculates the weighted regular rate faces liability for 100% back overtime wages, plus an equal amount in mandatory statutory liquidated damages and reasonable attorney fees. Common audit triggers during Department of Labor Wage and Hour Division (WHD) audits include:

- **Automated Payroll Software Rounding Errors:** Many off-the-shelf timekeeping tools incorrectly assign overtime to whichever job was worked chronologically last in the workweek without prior written agreement under 29 C.F.R. § 778.419.
- **Exclusion of Non-Discretionary Incentive Pay:** Failing to pool production bonuses, attendance incentives, or shift differentials into the total straight-time earnings before dividing by total hours worked.
- **Three-Year Lookback for Willful Violations:** Under 29 U.S.C. § 255(a), standard wage claims carry a 2-year statute of limitations, but systematic miscalculation across multi-rate workforces can extend exposure to 3 years.

To ensure statutory compliance, employers operating multi-rate operations should maintain contemporaneous timecard records distinguishing exact hours clocked under each pay rate code, verify that payroll software executes the weighted average formula automatically, and execute signed rate-agreement riders prior to scheduling dual-rate overtime shifts.


### Multi-Rate Overtime Compliance Checklist

Before running payroll for employees working multiple roles across a single workweek:
1. Confirm that total hours across all roles combined exceed 40 hours before applying overtime calculations.
2. Sum straight-time earnings from each position before dividing by aggregate hours to determine the true weighted regular rate.
3. Multiply overtime hours by 50% of the weighted regular rate to determine the additional half-time premium owed.
4. Verify whether any written agreement exists under 29 C.F.R. Section 778.419 establishing job-specific overtime rates.

## Sources and further reading

The figures and rules in this article come from the primary sources below. Thresholds, rates, and limits change from year to year, so confirm the current value at the source before relying on it.

- [29 C.F.R. Part 778, overtime compensation (eCFR)](https://www.ecfr.gov/current/title-29/part-778)
- [29 U.S.C. § 207, maximum hours (Cornell LII)](https://www.law.cornell.edu/uscode/text/29/207)
- [DOL Fact Sheet #23, overtime pay requirements](https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay)
