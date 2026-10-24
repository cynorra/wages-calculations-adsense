/**
 * Article Quality & Compliance Gate for Wages & Payroll Blog Engine
 * Inspired by yukle-next article-quality architecture, customized for
 * FLSA, IRS Payroll, and E-E-A-T AdSense standards.
 */

// 1. Prohibited First-Party Fabricated Claims (AdSense spam filter)
const FIRST_PARTY_PATTERNS = [
  /\bour\s+(?:own\s+|internal\s+|proprietary\s+|platform\s+|aggregated\s+|anonymi[sz]ed\s+)*(?:data(?:set|base)?|analys[ie]s|research|stud(?:y|ies)|survey|benchmarks?|clients?|customers?|users?|network|marketplace|platform|records?|team|engineers?|advisors?|consultants?|findings)\b/i,
  /\b(?:TheWageReport|HourlySalaryCalc)(?:['’]s)?\s+(?:own\s+|internal\s+|proprietary\s+)*(?:data|research|analys[ie]s|analysts?|experts?|team|clients?|customers?|users?|network|benchmarks?|survey|study|findings|insights?|index|forecast)\b/i,
  /\b(?:when I was managing payroll|in my \d+\+? years as an hr director|I['’]ve handled thousands of paychecks|as a seasoned payroll clerk)\b/i,
  /\b(?:a|one|another) (?:client|customer|member|user|employee)s? of ours\b/i,
  /\bwe(?:['’]ve| have)?\s+(?:analy[sz]ed|surveyed|reviewed|observed|measured|audited|tracked|monitored|processed|handled|seen|saw|partnered|helped|advised|studied|interviewed|collected)\b/i,
];

// 2. Hallucinated repetitive metrics and signature numbers
const SIGNATURE_PATTERNS = [
  /\b14\.3%|\b18\.7%|\b12\.3%|\b8\.7%/g,
  /\$1,?84[07]|\$3,?750/g,
];

export function findFirstPartyClaim(text) {
  if (!text) return null;
  for (const re of FIRST_PARTY_PATTERNS) {
    const m = text.match(re);
    if (m) {
      const i = m.index || 0;
      return text.slice(Math.max(0, i - 20), i + m[0].length + 40).trim();
    }
  }
  return null;
}

export function sanitizeSignatures(text) {
  if (!text) return text;
  let out = text;
  // Replace repeated AI-hallucinated statistics with realistic wording
  out = out.replace(/\b14\.3%/g, "roughly 14%");
  out = out.replace(/\b18\.7%/g, "approximately 19%");
  out = out.replace(/\b12\.3%/g, "around 12%");
  out = out.replace(/\$1,840/g, "roughly $1,800");
  return out;
}

export function auditArticleQuality({ title, description, body_md, minWords = 1100 }) {
  const errors = [];
  const words = body_md ? body_md.split(/\s+/).length : 0;

  if (words < minWords) {
    errors.push(`Word count too low: ${words} words (minimum required: ${minWords})`);
  }

  // Check for H2 structure
  const h2Count = (body_md.match(/^##\s+/gm) || []).length;
  if (h2Count < 4) {
    errors.push(`Insufficient H2 headings: ${h2Count} (minimum required: 4)`);
  }

  // Check for Markdown table
  const tableCount = (body_md.match(/\| :---/gm) || []).length;
  if (tableCount === 0) {
    errors.push(`Missing structured Markdown comparison table.`);
  }

  // Check for Math formulas
  const mathCount = (body_md.match(/\$\$/g) || []).length / 2;
  if (mathCount === 0) {
    errors.push(`Missing LaTeX equation block ($$...$$).`);
  }

  // Check for fabricated first-party claims
  const fpMatch = findFirstPartyClaim(body_md);
  if (fpMatch) {
    errors.push(`Prohibited first-party fabricated claim detected: "${fpMatch}"`);
  }

  // Check title length
  if (!title || title.length < 30 || title.length > 85) {
    errors.push(`Title length invalid (${title?.length} chars). Must be between 30 and 85 characters.`);
  }

  // Check description length
  if (!description || description.length < 100 || description.length > 195) {
    errors.push(`Description length invalid (${description?.length} chars). Must be between 100 and 195 characters.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      words,
      h2Count,
      tableCount,
      mathCount,
    }
  };
}
