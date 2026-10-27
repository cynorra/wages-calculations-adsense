---
title: "Imputed Income on Fringe Benefits: Company Car Valuation & Payroll Taxation"
description: "How personal use of employer-provided vehicles, group-term life insurance over $50k, and educational assistance are taxed on Form W-2."
key_takeaway: "Personal use of a company car is taxable wages. The employer must value it using IRS rules, add it to W-2 box 1, and withhold payroll taxes on it, even though no cash changes hands."
tool: "hourly-paycheck-tax-calculator"
status: "published"
published: "2026-11-01"
author_slug: "eren-simsir"
---

A fringe benefit is any form of compensation other than cash wages. The default rule in Internal Revenue Code § 61 is that it is **taxable**, valued at fair market value, unless a specific section excludes it. When it is taxable but not paid in cash, the value is called *imputed income*. It appears on Form W-2, raises the employee's taxable wages, and often creates the surprise of a larger tax bill with no larger paycheck. The IRS's reference for employers is Publication 15-B.

## Business use is free, personal use is not

An employer-provided vehicle is a good example. The part of the use that is **business** travel is a working condition fringe and excluded. The **personal** part, including the daily commute, is taxable. Employers must keep records that support the split, such as a mileage log, because an employee who cannot substantiate business use is treated as using the vehicle entirely for personal purposes.

## Four ways to value a company car

| Method | How it works | Best for |
| :--- | :--- | :--- |
| **Annual lease value (ALV)** | Look up the car's fair market value in the IRS table to get an annual figure, then multiply by the percentage of personal use | General use; the default for most employers |
| **Cents-per-mile** | Personal miles multiplied by the IRS standard mileage rate | Vehicles under a value cap, driven at least 10,000 miles a year mostly by employees |
| **Commuting rule** | $1.50 per one-way commute ($3.00 round trip) | Vehicles required for bona fide business reasons, with a written policy against other personal use |
| **Special rules** | Specific valuation for vehicles like trucks that are not generally used personally | Qualified nonpersonal-use vehicles are excluded entirely |

The commuting rule is limited: the employer must require the commuting use for a bona fide business reason, there must be a written policy prohibiting other personal use, and the employee cannot be a "control employee" (generally officers and certain highly paid or ownership-linked employees).

## A worked example under ALV

An employee drives a company sedan with a fair market value of $22,300. The IRS lease-value table assigns it an annual lease value of roughly $5,850 (confirm the current figure in Publication 15-B). The mileage log shows 8,000 total miles, of which 2,000 are personal:

$$\text{Personal use share} = \frac{2{,}000}{8{,}000} = 25\%$$

$$\text{Imputed income} = \$5{,}850 \times 25\% = \$1{,}462.50$$

If the employer also pays for fuel, it must add the value of fuel. The IRS allows a flat 5.5 cents per personal mile for fuel provided by the employer:

$$2{,}000 \times \$0.055 = \$110.00 \qquad \text{Total} = \$1{,}572.50$$

Under cents-per-mile, the same employee using a $0.70 mileage rate (the 2025 rate, used here only for illustration) would show $1,400.00 for 2,000 personal miles, which can be lower or higher than ALV depending on the car.

## How the tax actually lands

| Tax | Applies to imputed vehicle income? |
| :--- | :--- |
| Federal income tax withholding | Yes, but the employer may elect not to withhold on a noncash fringe if it tells the employee by January 31 |
| Social Security and Medicare (FICA) | **Yes, always** |
| W-2 reporting | Included in boxes 1, 3, and 5 |
| Employee pay stub | Appears as non-cash earnings or an offsetting adjustment |

At a 22% federal bracket and 7.65% FICA, the $1,572.50 of imputed income costs the employee roughly $466 in additional tax, about $346 federal income tax plus $120 FICA, whether withheld through the year or paid at filing.

## Other fringe benefits with imputed income

**Group-term life insurance above $50,000.** The first $50,000 of employer-paid coverage is excluded. Coverage above that is taxed using the IRS **Table I**, a cost per $1,000 per month by age bracket. For a 52-year-old with $150,000 of coverage, the rate for ages 50–54 is $0.23:

$$\frac{\$150{,}000 - \$50{,}000}{\$1{,}000} \times \$0.23 \times 12 = \$276.00$$

The $276 is subject to Social Security and Medicare, but not to federal income tax withholding.

**Educational assistance.** Under § 127, an employer can provide up to **$5,250 per year** tax-free under a written plan, including for student loan repayment. Amounts above that are taxable wages unless they qualify as a working-condition fringe.

**Personal use of other employer property.** Free use of employer aircraft, a club membership, or gift cards that are cash equivalents is taxable. De minimis items, such as occasional snacks, are excluded when they are so small that accounting for them is unreasonable.

## Compliance checklist

- Require a contemporaneous mileage log for every employer-provided vehicle.
- Choose a valuation method and apply it consistently, and tell employees how it works.
- Report the value by January 31 so it can be included in the W-2.
- Review whether a person is a control employee before using the commuting rule.

For the withholding side, see [supplemental wages](/guides/supplemental-wage-withholding-bonus-taxation-rules/) and for the net-pay result [gross vs. net pay](/guides/gross-vs-net-pay-payroll-deductions/).

## Sources and further reading

The figures and rules in this article come from the primary sources below. Thresholds, rates, and limits change from year to year, so confirm the current value at the source before relying on it.

- [IRS Publication 15-B, employer's guide to fringe benefits](https://www.irs.gov/publications/p15b)
- [26 C.F.R. § 1.61-21, fringe benefit valuation (eCFR)](https://www.ecfr.gov/current/title-26/section-1.61-21)
- [26 U.S.C. § 61, gross income (Cornell LII)](https://www.law.cornell.edu/uscode/text/26/61)
- [26 U.S.C. § 127, educational assistance programs (Cornell LII)](https://www.law.cornell.edu/uscode/text/26/127)
