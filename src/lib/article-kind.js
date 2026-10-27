// Each guide gets one of three editorial layouts so the archive does not read as one template.
//   figure    – pay conversions and rate math (one headline number, data-first)
//   ledger    – payroll, withholding and take-home breakdowns (gross to net)
//   editorial – statute, regulation and compliance analysis (default)

const FIGURE = [
  /^\d+-a-year-/,
  /^salary-to-hourly/,
  /^hourly-to-salary/,
  /^biweekly-paycheck/,
  /^reverse-biweekly/,
  /^real-hourly-pay/,
  /^hourly-pay-raise/,
  /^state-minimum-wage/,
  /^1099-contractor-vs-w2/,
  /^base-hourly-plus-commission/,
];

const LEDGER = [
  /^gross-vs-net/,
  /^hourly-paycheck-tax/,
  /^hourly-pay-stub/,
  /^severance-pay/,
  /^supplemental-wage/,
  /^fringe-benefit/,
  /^per-diem/,
  /^zero-state-income-tax/,
  /^pto-vacation/,
];

export function articleKind(slug) {
  if (FIGURE.some((re) => re.test(slug))) return "figure";
  if (LEDGER.some((re) => re.test(slug))) return "ledger";
  return "editorial";
}

export const KIND_LABEL = {
  figure: "Pay Conversion Guide",
  ledger: "Payroll & Tax Breakdown",
  editorial: "Labor Law Analysis",
};

export function readingMinutes(markdown) {
  const words = (markdown || "").trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 220));
}
