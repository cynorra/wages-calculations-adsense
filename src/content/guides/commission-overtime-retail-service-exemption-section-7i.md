---
title: "Retail and Service Commission Exemption: Section 7(i) Overtime Rules"
description: "How Section 7(i) lets some retail and service establishments skip overtime for commissioned employees, and the two tests every pay period must pass."
key_takeaway: "Section 7(i) exempts an employee from overtime only if the employer is a retail or service establishment, the regular rate is above one and a half times the minimum wage, and more than half of earnings in a representative period come from commissions."
tool: "base-hourly-plus-commission-calculator"
status: "published"
structure: "troubleshooting-guide"
published: "2026-12-04"
author_slug: "eren-simsir"
---

## Statutory Prerequisites for 29 U.S.C. § 207(i) Application

The Fair Labor Standards Act (FLSA), specifically 29 U.S.C. § 207(i), provides a narrow exception to the mandatory overtime requirements of 29 U.S.C. § 207(a). This provision permits retail or service establishments to compensate employees without the standard 1.5x overtime premium, provided the employer satisfies a tripartite test. First, the employer must qualify as a "retail or service establishment" as defined by 29 C.F.R. § 779.311. Second, the employee’s "regular rate" of pay must exceed 1.5 times the federal minimum wage. As of November 10, 2026, with the federal minimum wage held at $7.25 per hour, the minimum regular rate threshold is $10.88 per hour. Third, more than 50% of the employee’s total compensation for a representative period (not less than one month) must consist of commissions on goods or services. Failure to maintain these metrics necessitates compliance with standard overtime calculations, often requiring a conversion from [salary to hourly rate](/guides/salary-to-hourly-rate-converter/) to determine the base for overtime premiums.

## Failure Mode 1: Misclassification of Fixed Draws as Commissions

Payroll systems frequently mischaracterize non-recoverable draws or guaranteed base payments as "commissions." Under 29 C.F.R. § 779.416, a commission must be a bona fide percentage of the price of goods or services sold. A draw that is guaranteed regardless of sales volume does not constitute a commission.

**Statutory Violation:** Misclassification of guaranteed income as commission leads to an artificial inflation of the commission percentage, resulting in an unlawful denial of overtime pay.

**Mathematical Correction:**
$$
\text{Commission Ratio} = \frac{\text{Total Commissions Paid}}{\text{Total Compensation Paid}}
$$

**Payroll Fix:** Configure payroll software to segment earnings codes into "Guaranteed Base" and "Variable Commission." Only amounts tagged as "Variable Commission" may be included in the numerator of the 50% test. If an employee receives a draw, the system must distinguish between recoverable draws (advances against future commissions) and non-recoverable draws (fixed salary), the latter of which must be excluded from the commission ratio calculation.

## Failure Mode 2: Inaccurate Regular Rate Calculation for Overtime Liability

When an employer fails the 7(i) test, the payroll department must calculate overtime based on the "regular rate." A common error involves using only the base hourly wage, ignoring non-discretionary bonuses or commissions. This necessitates a [reverse biweekly to hourly rate audit](/guides/reverse-biweekly-to-hourly-rate-audit/) to ensure compliance.

**Statutory Violation:** Failure to include non-discretionary commissions in the regular rate calculation violates 29 C.F.R. § 778.117 through § 778.122.

**Mathematical Correction:**
$$
\text{Regular Rate} = \frac{\text{Total Earnings (Excluding Statutory Exclusions)}}{\text{Total Hours Worked in Workweek}}
$$

**Payroll Fix:** Implement an automated calculation engine that aggregates all non-discretionary compensation—including commissions—earned in the workweek. Divide this total by the actual hours worked to derive the regular rate. Multiply this rate by 0.5 for each overtime hour worked, adding this "half-time" premium to the total gross pay.

## Failure Mode 3: Representative Period Compression

The representative period for the 50% commission test must span at least one month. Employers often evaluate this ratio on a week-by-week basis, which fails to account for the volatility inherent in commission-based roles.

**Statutory Violation:** Determining 7(i) eligibility on a period shorter than one month is prohibited by 29 C.F.R. § 779.417.

**Mathematical Correction:**
The representative period must be a period of at least one month (not necessarily a calendar month, but a recurring period of at least 30 days). The formula is:
$$
\text{Eligibility} = \sum (\text{Commissions}) > \sum (\text{Other Compensation}) \text{ over } \ge 30 \text{ days}
$$

**Payroll Fix:** The payroll system must utilize a rolling "representative period" flag. For each pay cycle, the system must look back at the preceding 30-day window to calculate the commission percentage. If the ratio falls below 50.01% for that period, the system must trigger an automatic overtime calculation for all hours worked during that cycle, overriding the 7(i) exemption status.

## Failure Mode 4: Ignoring State-Specific Overtime Stricter Standards

State labor codes frequently supersede federal FLSA provisions. In jurisdictions like California or New York, the 7(i) exemption may be narrower or non-existent, or it may require a higher regular rate threshold than the federal $10.88 calculation.

**Statutory Violation:** Applying federal 29 U.S.C. § 207(i) standards in a state that mandates higher regular rate thresholds or stricter commission definitions violates state labor law.

**Mathematical Correction:**
$$
\text{Effective Threshold} = \max(\text{Federal Threshold}, \text{State-Mandated Minimum Rate})
$$

**Payroll Fix:** Establish a "Jurisdiction-Specific Exemption Table" within the payroll software. Before applying the 7(i) exemption, the software must validate the employee’s work location against state-specific labor statutes. If the state law requires a higher minimum regular rate (e.g., 2.0x the state minimum wage), the system must utilize the higher state threshold to test for exemption eligibility. For employees in complex regulatory environments, consult [salary exempt vs non-exempt FLSA test](/guides/salary-exempt-vs-non-exempt-flsa-test/) resources to ensure that the 7(i) exemption is not being improperly applied to employees who should be classified as salaried exempt under state law.

## Failure Mode 5: Failure to Include All Hours Worked in the Exemption Test

Retail employers often fail to track "off-the-clock" hours, such as mandatory morning huddles or post-shift closing duties. These hours must be included in the total hours worked for the purpose of the regular rate calculation and the determination of overtime eligibility.

**Statutory Violation:** Excluding non-sales hours (e.g., training, mandatory meetings) from the calculation of the regular rate violates 29 C.F.R. § 778.223.

**Mathematical Correction:**
$$
\text{Total Hours} = \text{Sales Hours} + \text{Training/Meeting Hours} + \text{Closing Duties}
$$

**Payroll Fix:** Ensure that timekeeping systems are integrated with the payroll engine to capture every minute of compensable time. All time recorded, regardless of whether it was spent on the sales floor, must be aggregated. When an employee spends significant time on non-sales tasks, the "commission-heavy" ratio may drop below 50%, effectively terminating the 7(i) exemption for that representative period.

## Administrative Recordkeeping Requirements

Under 29 C.F.R. § 516.16, employers relying on the 29 U.S.C. § 207(i) exemption must maintain specific records for each employee. These records must substantiate the representative period used, the total compensation paid, the total commission paid, and the regular rate calculated for each pay period.

| Record Element | Statutory Reference | Retention Requirement |
| :--- | :--- | :--- |
| Representative Period | 29 C.F.R. § 779.417 | 3 Years |
| Total Compensation | 29 C.F.R. § 516.2 | 3 Years |
| Commission Earnings | 29 C.F.R. § 516.2 | 3 Years |
| Regular Rate Log | 29 C.F.R. § 778.103 | 3 Years |

Employers must ensure that these records are audit-ready, as the burden of proof for the 7(i) exemption rests entirely on the employer. Failure to document the commission-to-base ratio per representative period results in the loss of the exemption, requiring retroactive payment of overtime premiums for all affected periods. When managing employees with fluctuating schedules or varying commission structures, the payroll controller must maintain rigorous oversight of these data points to avoid significant liability. For organizations with complex payroll structures, evaluating the impact of [supplemental wage withholding bonus taxation rules](/guides/supplemental-wage-withholding-bonus-taxation-rules/) on total compensation is also necessary to ensure that the 50% commission threshold is calculated on net earnings rather than just gross sales commissions. Proper payroll hygiene in this area mitigates the risk of Department of Labor enforcement actions and private litigation.

## Sources and further reading

The figures and rules in this article come from the primary sources below. Thresholds, rates, and limits change from year to year, so confirm the current value at the source before relying on it.

- [29 U.S.C. § 207, maximum hours (Cornell LII)](https://www.law.cornell.edu/uscode/text/29/207)
- [29 C.F.R. Part 778, overtime compensation (eCFR)](https://www.ecfr.gov/current/title-29/part-778)
- [DOL Fact Sheet #23, overtime pay requirements](https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay)
