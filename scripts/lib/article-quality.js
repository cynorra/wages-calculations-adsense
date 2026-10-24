import { sanitizeSignatures } from "./false-precision.js";

/**
 * Editorial Quality Gates & Anti-Hallucination Guard for The Wage Report.
 * Inspired by yukle-next article-quality architecture.
 */

const FIRST_PARTY_PATTERNS = [
  /\bour\s+(?:own\s+|internal\s+|proprietary\s+|platform\s+|aggregated\s+|client\s+)*(?:data(?:set|base)?|analys[ie]s|research|stud(?:y|ies)|survey|benchmarks?|clients?|customers?|users?|audits?|records?|team|findings)\b/i,
  /\b(?:in\s+)?our\s+(?:experience|observation|practice|files|caseload)\b/i,
  /\bTheWageReport(?:['’]s)?\s+(?:own\s+|internal\s+|proprietary\s+)*(?:data|research|analys[ie]s|analysts?|experts?|team|benchmarks?|audits?)\b/i,
  /\b(?:I['’]ve|I have)\s+(?:audited|calculated|processed|handled|seen|represented|advised)\b/i,
  /\b(?:when I was|in my \d+\+?\s+years|as an? (?:attorney|accountant|auditor|payroll specialist))\b/i,
  /\bwe(?:['’]ve| have)?\s+(?:audited|processed|calculated|surveyed|reviewed|found|observed|measured|handled)\b/i,
  /\b(?:a|one|another)\s+(?:client|customer|employer)\s+of ours\b/i
];

const FABRICATED_ANECDOTES = [
  /\bone client of ours\b/i,
  /\ba company we worked with\b/i,
  /\bin a recent case we handled\b/i,
  /\ba manufacturer in (?:Ohio|Texas|California|Florida|Illinois) recently\b/i
];

export function findFirstPartyClaim(text) {
  for (const re of FIRST_PARTY_PATTERNS) {
    const match = text.match(re);
    if (match) {
      const idx = match.index;
      return text.slice(Math.max(0, idx - 20), idx + match[0].length + 40).trim();
    }
  }
  return null;
}

export function findFabricatedAnecdote(text) {
  for (const re of FABRICATED_ANECDOTES) {
    const match = text.match(re);
    if (match) {
      const idx = match.index;
      return text.slice(Math.max(0, idx - 20), idx + match[0].length + 40).trim();
    }
  }
  return null;
}

// 5-word shingle extraction for similarity check
export function textOnly(markdown) {
  return (markdown || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function shingleSet(words, n = 5) {
  const set = new Set();
  for (let i = 0; i + n <= words.length; i++) {
    set.add(words.slice(i, i + n).join(' '));
  }
  return set;
}

export function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
  for (const shingle of smaller) {
    if (larger.has(shingle)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function auditArticleQuality({ title, description, body_md, minWords = 1000 }) {
  const errors = [];

  if (!body_md || typeof body_md !== "string") {
    errors.push("ARTICLE_EMPTY: Markdown content is empty or invalid.");
    return { isValid: false, errors };
  }

  // 1. First-Party Claims Check
  const fpClaim = findFirstPartyClaim(body_md);
  if (fpClaim) {
    errors.push(`FIRST_PARTY_CLAIM_FORBIDDEN: Article contains fabricated first-party claim: "${fpClaim}"`);
  }

  // 2. Fabricated Anecdote Check
  const anecdote = findFabricatedAnecdote(body_md);
  if (anecdote) {
    errors.push(`FABRICATED_ANECDOTE_FORBIDDEN: Article contains invented client anecdote: "${anecdote}"`);
  }

  // 3. Word Count Gate
  const words = textOnly(body_md);
  if (words.length < minWords) {
    errors.push(`WORD_COUNT_TOO_LOW: Article has ${words.length} words; minimum required is ${minWords}.`);
  }

  // 4. Structural Heading Count
  const h2Count = (body_md.match(/^##\s+/gm) || []).length;
  if (h2Count < 4) {
    errors.push(`INSUFFICIENT_HEADINGS: Article has only ${h2Count} H2 sections; minimum required is 4.`);
  }

  // 5. Data Density (Tables)
  const tableCount = (body_md.match(/\|[\s\S]*?\|[\s\S]*?\n\|[-:\s|]+\|/g) || []).length;
  if (tableCount < 1) {
    errors.push("MISSING_DATA_TABLE: Article must include at least one multi-column comparison markdown table.");
  }

  // 6. Mathematical / Formula Density ($$...$$ or LaTeX equations)
  const mathCount = (body_md.match(/\$\$[\s\S]*?\$\$/g) || []).length;
  if (mathCount < 2) {
    errors.push("MISSING_FORMULAS: Article must include at least 2 LaTeX mathematical equation blocks ($$...$$).");
  }

  // 7. Statutory Reference Gate
  const statutoryRegex = /(?:29\s+U\.S\.C\.|29\s+C\.F\.R\.|26\s+U\.S\.C\.|IRS\s+Publication|FLSA\s+Section|Title\s+29)/i;
  if (!statutoryRegex.test(body_md)) {
    errors.push("MISSING_STATUTORY_AUTHORITY: Article must cite specific US Code or CFR sections (e.g., 29 C.F.R. § 778 or 29 U.S.C. § 207).");
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      words: words.length,
      h2Count,
      tableCount,
      mathCount
    }
  };
}

export { sanitizeSignatures };
