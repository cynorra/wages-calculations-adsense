---
title: "Fluctuating Workweek Method: Overtime Rules for Salaried Non-Exempt Staff"
description: "When a fixed salary covers hours that change every week, overtime is half-time on a regular rate that falls as hours rise. The conditions and the math under 29 CFR 778.114."
key_takeaway: "Under the fluctuating workweek method, a salaried non-exempt employee owed overtime receives an extra half of the regular rate, which is the salary divided by the hours actually worked that week."
tool: "hour-and-wage-calculator"
status: "published"
structure: "multi-jurisdiction-matrix"
published: "2026-11-29"
author_slug: "eren-simsir"
---

## Statutory Framework and Prerequisites of 29 C.F.R. § 778.114

Under the Fair Labor Standards Act (FLSA), the fluctuating workweek (FWW) method outlined in 29 C.F.R. § 778.114 provides an employer with an alternative formula for computing overtime compensation for salaried non-exempt employees. When an employee's weekly schedule fluctuates above and below 40 hours, the employer and employee may establish an agreement under which a fixed weekly salary compensates all straight-time hours worked, regardless of the quantity. Consequently, the regular rate of pay varies inversely with the number of hours worked in a given workweek. Because the fixed salary pre-compensates straight-time earnings (1.0x) for every hour worked, the employer owes only an additional half-time premium (0.5x) for hours worked in excess of 40.

To maintain compliance under 29 C.F.R. § 778.114, five mandatory statutory conditions must be satisfied concurrently:

1. **Fluctuating Hours:** The employee's actual work schedule must fluctuate from week to week. The hours must vary above and below 40 hours, or at minimum show genuine weekly variation.
2. **Fixed Weekly Salary:** The employee must receive a fixed weekly salary that does not vary based on the number of hours worked in a given workweek, whether the employee works 20 hours or 60 hours.
3. **Minimum Wage Floor Compliance:** The fixed salary must be sufficiently large to ensure that the employee’s regular rate of pay never falls below the applicable federal minimum wage of $7.25 per hour under 29 U.S.C. § 206(a)(1), or any applicable state or municipal minimum wage, in any workweek.
4. **Clear Mutual Understanding:** The employer and employee must maintain a clear mutual understanding—contemporaneous with hiring or the implementation of the pay arrangement—that the fixed salary covers all hours worked in the workweek, short or long, regardless of the total.
5. **Half-Time Overtime Premium Payment:** Overtime hours exceeding 40 per workweek must be compensated at a rate not less than one-half (0.5) times the regular rate of pay calculated for that specific workweek.

Failure to satisfy any single prerequisite invalidates the FWW method, exposing the employer to back-pay liabilities calculated at the standard one-and-one-half time (1.5x) multiplier under 29 U.S.C. § 207(a)(1). Employees categorized under this structure remain non-exempt; for detailed criteria separating exempt status from non-exempt classification, refer to the [overtime exemption salary basis and duties test guide](/guides/overtime-exemption-salary-basis-duties-test-flsa/).

## Mathematical Mechanics: Regular Rate Determination and Half-Time Calculations

The mathematical model governing 29 C.F.R. § 778.114 requires recalculating the regular rate of pay every single workweek based on the total hours actually worked. 

The regular rate ($RR$) is determined by dividing the fixed weekly salary ($S$) by the total hours worked in that specific workweek ($H$):

$$RR = \frac{S}{H}$$

Because the regular rate decreases as total hours increase, the overtime premium rate ($OTPR$), defined as 50 percent of the regular rate, is calculated as:

$$OTPR = RR \times 0.5 = \left(\frac{S}{H}\right) \times 0.5$$

Total overtime pay ($OT_{Pay}$) for hours worked in excess of 40 ($H_{OT} = H - 40$) is expressed as:

$$OT_{Pay} = H_{OT} \times OTPR$$

Total gross earnings ($Gross$) for the workweek equal the fixed salary plus total overtime pay:

$$Gross = S + OT_{Pay}$$

### Mandatory Calculation Examples

To demonstrate the application of 29 C.F.R. § 778.114, consider a salaried non-exempt employee with a fixed weekly salary of $900.00.

#### Scenario 1: 45-Hour Workweek
Where the employee works 45 hours in a single workweek:

$$RR = \frac{\$900.00}{45} = \$20.00 \text{ per hour}$$

$$OTPR = \$20.00 \times 0.5 = \$10.00 \text{ per hour}$$

$$OT_{Pay} = 5 \text{ hours} \times \$10.00 = \$50.00$$

$$Gross = \$900.00 + \$50.00 = \$950.00$$

#### Scenario 2: 55-Hour Workweek
Where the employee works 55 hours in a single workweek:

$$RR = \frac{\$900.00}{55} = \$16.3636... \approx \$16.36 \text{ per hour}$$

$$OTPR = \$16.36 \times 0.5 = \$8.18 \text{ per hour}$$

$$OT_{Pay} = 15 \text{ hours} \times \$8.18 = \$122.70$$

$$Gross = \$900.00 + \$122.70 = \$1,022.70$$

Because the base salary of $900.00 already satisfies straight-time compensation for all 55 hours, the employer pays only the additional 0.5x premium for the 15 overtime hours.

## Impact of the 2020 Department of Labor Rule on Supplemental Compensation

On May 20, 2020, the U.S. Department of Labor (DOL) issued a Final Rule (85 FR 35794), formally amending 29 C.F.R. § 778.114 to clarify that employers may pay supplemental compensation—such as bonuses, commissions, hazard pay, night-shift differentials, and equipment incentive pay—to employees compensated under the fluctuating workweek method without invalidating the pay structure.

Prior to the 2020 amendment, legal uncertainty existed regarding whether non-salary payments violated the statutory requirement of a "fixed salary." The amended regulation explicitly allows supplemental payments, provided those payments are included when computing the regular rate of pay, unless specifically excludable under Section 7(e) of the FLSA (29 U.S.C. § 207(e)).

When supplemental compensation ($P_{supp}$) is earned during a workweek, the revised formula for the regular rate is:

$$RR = \frac{S + P_{supp}}{H}$$

For example, if an employee with a $900.00 base salary works 45 hours and earns a $100.00 shift differential bonus, the regular rate becomes:

$$RR = \frac{\$900.00 + \$100.00}{45} = \frac{\$1,000.00}{45} = \$22.22 \text{ per hour}$$

$$OTPR = \$22.22 \times 0.5 = \$11.11 \text{ per hour}$$

$$OT_{Pay} = 5 \text{ hours} \times \$11.11 = \$55.55$$

$$Gross = \$900.00 + \$100.00 + \$55.55 = \$1,055.55$$

For further details on how non-discretionary bonuses affect overtime allocation, review the analysis on [hazard pay regulations under FLSA standards](/guides/hazard-pay-regulations-flsa-standards/) and the computational principles governing [overtime for dual-rate workers and blended hourly rates](/guides/overtime-for-dual-rate-workers-blended-hourly-rate/).

## Multi-Jurisdictional Analysis: State-Level Preemption and Prohibitions

State labor codes may grant workers greater protections than federal standard baseline regulations under 29 U.S.C. § 218(a). A critical compliance risk for multi-state payroll operations is that several jurisdictions explicitly prohibit or restrict the fluctuating workweek method.

* **California:** Under California Labor Code § 510 and the precedent set in *Skyline Homes, Inc. v. Department of Industrial Relations*, 165 Cal. App. 3d 959 (1985), the FWW method is illegal. California law mandates that a salaried non-exempt employee's regular rate must be computed by dividing the weekly salary by a maximum of 40 hours, regardless of hours worked. Overtime must then be compensated at 1.5x (or 2.0x for double-time) of that regular rate.
* **Pennsylvania:** The Pennsylvania Department of Labor and Industry interprets the Pennsylvania Minimum Wage Act (43 P.S. § 333.104) to reject 29 C.F.R. § 778.114. Employers must pay 1.5x overtime based on a regular rate derived from standard hours, prohibiting 0.5x FWW compensation.
* **New York:** New York general labor provisions (12 NYCRR § 142-2.2) allow FWW for non-exempt employees, but the New York Hospitality Industry Wage Order (12 NYCRR Part 146) prohibits FWW for covered hospitality employees.
* **Illinois:** Illinois law (820 ILCS 105/4a) permits the FWW method, strictly mirroring federal 29 C.F.R. § 778.114 conditions provided a written, signed clear mutual understanding exists.

### Multi-Jurisdictional Statutory Matrix

| Jurisdiction | FWW Permitted? | Statutory / Judicial Citation | Regular Rate Formula | Overtime Multiplier |
| :--- | :--- | :--- | :--- | :--- |
| **Federal FLSA** | Yes | 29 C.F.R. § 778.114 | $Salary / Total Hours$ | 0.5x regular rate |
| **California** | **Prohibited** | Cal. Lab. Code § 510; *Skyline Homes* | $Salary / 40 Hours$ | 1.5x (and 2.0x) regular rate |
| **Pennsylvania** | **Prohibited** | 43 P.S. § 333.104; Dept. Policy | $Salary / 40 Hours$ | 1.5x regular rate |
| **New York** | Conditional | 12 NYCRR § 142-2.2 (Excludes Hospitality) | $Salary / Total Hours$ | 0.5x regular rate |
| **Illinois** | Yes | 820 ILCS 105/4a | $Salary / Total Hours$ | 0.5x regular rate |

## Variance Analysis: Standard 1.5x Overtime vs. Fluctuating Workweek Calculation

To illustrate the financial variance across methodologies, consider an employee earning a base weekly salary of $900.00. Under standard FLSA 1.5x hourly calculations, a $900.00 salary for a 40-hour baseline translates to an hourly rate of $22.50 ($900.00 / 40) and an overtime rate of $33.75 ($22.50 × 1.5).

The table below contrasts gross weekly pay across four calculation standards: Federal FWW (0.5x), Standard FLSA Hourly (1.5x), California Non-Exempt Salaried (1.5x based on 40 hours), and high-hour threshold outcomes.

### Weekly Gross Pay Variance Table ($900 Baseline Salary)

| Total Hours Worked | Overtime Hours | Federal FWW Regular Rate | Federal FWW Gross Pay | Standard FLSA 1.5x Hourly Gross Pay | California Salaried 1.5x Gross Pay | Employer FWW Savings vs. CA Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **40 Hours** | 0 | $22.50 | $900.00 | $900.00 | $900.00 | $0.00 |
| **45 Hours** | 5 | $20.00 | $950.00 | $1,068.75 | $1,068.75 | $118.75 |
| **50 Hours** | 10 | $18.00 | $990.00 | $1,237.50 | $1,237.50 | $247.50 |
| **55 Hours** | 15 | $16.36 | $1,022.70 | $1,406.25 | $1,406.25 | $383.55 |
| **60 Hours** | 20 | $15.00 | $1,050.00 | $1,575.00 | $1,575.00 | $525.00 |

Under federal FWW, as hours increase from 45 to 60, the marginal overtime cost per hour drops from $10.00 per hour to $7.50 per hour. In contrast, under California law, the marginal overtime cost remains fixed at $33.75 per hour (increasing to $45.00 per hour for hours exceeding 12 in a workday).

## Legal Pitfalls, Salary Deductions, and Compliance Safeguards

Employers utilizing 29 C.F.R. § 778.114 face severe wage-and-hour liability if salary performance deviates from strict federal standards. The primary compliance risks include:

### Impermissible Salary Deductions
The core premise of FWW is that the fixed salary covers all hours worked, short or long. If an employer makes partial-day or full-day deductions from the employee's fixed salary due to variations in the quantity of work available, or for absences caused by sickness or holiday closures, the DOL views the salary as no longer "fixed." This invalidates the FWW method across the entire period of performance.

### Regular Rate Minimum Wage Floor Violations
If an employee works excessive hours such that $S / H < \text{Applicable Minimum Wage}$, a statutory violation occurs. For example, if an employee earning $900.00 works 125 hours in a state with a $7.25 minimum wage, the regular rate yields $7.20 per hour ($900 / 125). This invalidates FWW for that workweek, requiring the employer to pay statutory minimum wage for all straight time plus 1.5x minimum wage for overtime.

### Absence of Written Mutual Understanding
While 29 C.F.R. § 778.114 does not explicitly require a signed contract, courts strictly enforce the requirement of a clear mutual understanding. Employers must maintain executed written agreements signed by the non-exempt employee prior to applying FWW calculations. The document must explicitly state that:
* The weekly salary is fixed regardless of the number of hours worked;
* Weekly hours will fluctuate; and
* Overtime hours will be compensated at half-time (0.5x) of the workweek's actual regular rate.

Where an employer fails to maintain clear evidence of mutual understanding, courts routinely default to calculating unpaid overtime retroactively under the standard 1.5x regular rate method pursuant to 29 U.S.C. § 216(b).

## Sources and further reading

The figures and rules in this article come from the primary sources below. Thresholds, rates, and limits change from year to year, so confirm the current value at the source before relying on it.

- [29 U.S.C. § 207, maximum hours (Cornell LII)](https://www.law.cornell.edu/uscode/text/29/207)
- [29 C.F.R. Part 778, overtime compensation (eCFR)](https://www.ecfr.gov/current/title-29/part-778)
- [DOL Fact Sheet #23, overtime pay requirements](https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay)
