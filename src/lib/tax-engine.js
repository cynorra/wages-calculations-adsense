// 2026 Tax Brackets & Standard Deductions (IRS Form 1040 / Pub 15-T)
export const TAX_CONSTANTS = {
  standardDeduction: {
    single: 15000,
    married: 30000,
    headOfHousehold: 22500,
  },
  fica: {
    socialSecurityRate: 0.062, // 6.2%
    socialSecurityCap: 176100, // 2026 SS wage base limit
    medicareRate: 0.0145, // 1.45%
    medicareAdditionalThreshold: 200000, // 0.9% additional over 200k single
    medicareAdditionalRate: 0.009,
  },
  federalBrackets2026: {
    single: [
      { max: 11925, rate: 0.10 },
      { max: 48475, rate: 0.12 },
      { max: 103350, rate: 0.22 },
      { max: 197300, rate: 0.24 },
      { max: 250525, rate: 0.32 },
      { max: 626350, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ],
    married: [
      { max: 23850, rate: 0.10 },
      { max: 96950, rate: 0.12 },
      { max: 206700, rate: 0.22 },
      { max: 394600, rate: 0.24 },
      { max: 501050, rate: 0.32 },
      { max: 751600, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ],
  },
  stateTaxRates: {
    TX: { name: "Texas", rate: 0.0, noTax: true },
    FL: { name: "Florida", rate: 0.0, noTax: true },
    WA: { name: "Washington", rate: 0.0, noTax: true },
    NV: { name: "Nevada", rate: 0.0, noTax: true },
    TN: { name: "Tennessee", rate: 0.0, noTax: true },
    WY: { name: "Wyoming", rate: 0.0, noTax: true },
    SD: { name: "South Dakota", rate: 0.0, noTax: true },
    AK: { name: "Alaska", rate: 0.0, noTax: true },
    NH: { name: "New Hampshire", rate: 0.0, noTax: true },
    CA: { name: "California", rate: 0.0725, noTax: false }, // effective avg for mid-incomes
    NY: { name: "New York", rate: 0.0585, noTax: false },
    IL: { name: "Illinois", rate: 0.0495, noTax: false },
    PA: { name: "Pennsylvania", rate: 0.0307, noTax: false },
    OH: { name: "Ohio", rate: 0.035, noTax: false },
    GA: { name: "Georgia", rate: 0.0539, noTax: false },
    NC: { name: "North Carolina", rate: 0.045, noTax: false },
    MI: { name: "Michigan", rate: 0.0425, noTax: false },
    AZ: { name: "Arizona", rate: 0.025, noTax: false },
    CO: { name: "Colorado", rate: 0.044, noTax: false },
    MA: { name: "Massachusetts", rate: 0.05, noTax: false },
    NJ: { name: "New Jersey", rate: 0.055, noTax: false },
    VA: { name: "Virginia", rate: 0.0575, noTax: false },
  },
};

export function calculateFederalTax(taxableIncome, status = "single") {
  if (taxableIncome <= 0) return 0;
  const brackets = TAX_CONSTANTS.federalBrackets2026[status] || TAX_CONSTANTS.federalBrackets2026.single;
  let tax = 0;
  let prevMax = 0;

  for (const b of brackets) {
    if (taxableIncome > b.max) {
      tax += (b.max - prevMax) * b.rate;
      prevMax = b.max;
    } else {
      tax += (taxableIncome - prevMax) * b.rate;
      break;
    }
  }
  return tax;
}

export function calculateFICA(grossAnnual) {
  const ssTaxable = Math.min(grossAnnual, TAX_CONSTANTS.fica.socialSecurityCap);
  const socialSecurity = ssTaxable * TAX_CONSTANTS.fica.socialSecurityRate;
  let medicare = grossAnnual * TAX_CONSTANTS.fica.medicareRate;
  if (grossAnnual > TAX_CONSTANTS.fica.medicareAdditionalThreshold) {
    medicare += (grossAnnual - TAX_CONSTANTS.fica.medicareAdditionalThreshold) * TAX_CONSTANTS.fica.medicareAdditionalRate;
  }
  return {
    socialSecurity,
    medicare,
    totalFICA: socialSecurity + medicare,
  };
}

export function calculateTakeHomePay({
  grossAnnual,
  stateCode = "TX",
  status = "single",
  preTaxDeductions = 0,
}) {
  const adjustedGross = Math.max(0, grossAnnual - preTaxDeductions);
  const stdDeduction = TAX_CONSTANTS.standardDeduction[status] || TAX_CONSTANTS.standardDeduction.single;
  const federalTaxable = Math.max(0, adjustedGross - stdDeduction);
  
  const federalTax = calculateFederalTax(federalTaxable, status);
  const fica = calculateFICA(grossAnnual);
  
  const stateInfo = TAX_CONSTANTS.stateTaxRates[stateCode] || { rate: 0.045, name: "Other" };
  const stateTax = stateInfo.rate * adjustedGross;

  const totalDeductions = federalTax + fica.totalFICA + stateTax + preTaxDeductions;
  const netAnnual = Math.max(0, grossAnnual - totalDeductions);

  return {
    grossAnnual,
    adjustedGross,
    federalTax,
    socialSecurity: fica.socialSecurity,
    medicare: fica.medicare,
    totalFICA: fica.totalFICA,
    stateTax,
    totalDeductions,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiweekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    netHourly40: netAnnual / 2080,
    effectiveTaxRate: grossAnnual > 0 ? ((totalDeductions - preTaxDeductions) / grossAnnual) * 100 : 0,
  };
}

export function formatCurrency(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
}
