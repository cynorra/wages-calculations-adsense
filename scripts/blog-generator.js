import fs from "fs";
import path from "path";
import {
  auditArticleQuality,
  sanitizeSignatures,
  textOnly,
  shingleSet,
  jaccardSimilarity,
} from "./lib/article-quality.js";
import { renderSources, SOURCES_HEADING } from "./lib/sources.js";

/**
 * Draft generator for The Wage Report.
 *
 * What it does:  asks Gemini for ONE draft article from scripts/topic-queue.json and saves it as a
 *                local markdown file with status "draft".
 * What it never does:  publish, push to Supabase, or fall back to a canned template.
 *
 * A draft is only a starting point. Before publishing, a person must check every figure and citation
 * against the linked sources, then set `status: "published"` and a real `published` date.
 *
 * Usage:
 *   node scripts/blog-generator.js            next topic in the queue that has no file yet
 *   node scripts/blog-generator.js --list     show the queue and what exists
 *   node scripts/blog-generator.js --slug x   generate one specific queued topic
 *   node scripts/blog-generator.js --dry-run  print the prompt, call nothing
 */

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getUTCFullYear();
const ROOT = process.cwd();
const guidesDir = path.join(ROOT, "src", "content", "guides");
const queuePath = path.join(ROOT, "scripts", "topic-queue.json");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

// Links in a draft may only point at primary sources.
const ALLOWED_HOSTS = [
  "law.cornell.edu", "ecfr.gov", "dol.gov", "irs.gov", "ssa.gov", "gsa.gov", "eeoc.gov",
  "leginfo.legislature.ca.gov", "dir.ca.gov", "dol.ny.gov", "govinfo.gov", "federalregister.gov",
  "congress.gov", "sam.gov",
];

// Each article gets a completely different shape and analytical lens, so the archive reads like an authoritative journal, not a template farm.
const STRUCTURES = [
  {
    id: "scenario-table",
    needs: { tables: 1, math: 0 },
    brief:
      "Open with a one-paragraph direct answer. Build the article around a table of 6 to 8 concrete scenarios (one per row) with a 'Result' column, then explain the two or three trickiest rows in their own short sections. Finish with a short checklist.",
  },
  {
    id: "myth-fact",
    needs: { tables: 0, math: 1 },
    brief:
      "Organize the article as 4 to 6 'Myth' and 'Fact' pairs. Each pair states the rule, names the authority, and gives a one-line consequence. Include one worked calculation.",
  },
  {
    id: "worked-case",
    needs: { tables: 1, math: 2 },
    brief:
      "Center the article on ONE detailed worked example with stated numbers, computed step by step with formulas. Then add a table of variants showing how the result changes when one input changes.",
  },
  {
    id: "question-answer",
    needs: { tables: 0, math: 0 },
    brief:
      "Write 6 to 8 questions a worker or payroll manager would really ask. Make each question an H2, phrased as the question, and answer it in 140 to 220 words with a citation.",
  },
  {
    id: "process-timeline",
    needs: { tables: 1, math: 0 },
    brief:
      "Present the topic as a process or timeline: what happens first, next, and last, including notices, deadlines, or filings. Include a table of steps or deadlines.",
  },
  {
    id: "comparison",
    needs: { tables: 1, math: 1 },
    brief:
      "Compare two or three regimes side by side (federal and state, method A and B, employee and contractor) in a table. Explain where each wins, with one formula and one example.",
  },
  {
    id: "audit-checklist",
    needs: { tables: 1, math: 1 },
    brief:
      "Structure as an exhaustive internal payroll compliance audit. Divide into 4 distinct phases (Classification & Status, Working Time Accounting, Rate Composition, Record Retention). Under each phase provide forensic verification steps with statutory citations and a table rating violation severity (Low, Medium, Critical FLSA liability) with worked financial exposure numbers.",
  },
  {
    id: "statutory-deconstruction",
    needs: { tables: 1, math: 1 },
    brief:
      "Perform a clause-by-clause anatomical legal teardown of the governing regulation. Break down operative statutory phrases, define their judicial thresholds from landmark appellate rulings, explain how employers inadvertently trigger violations, and include a table quantifying employer financial liability under FLSA Section 16(b).",
  },
  {
    id: "paystub-anatomy",
    needs: { tables: 1, math: 2 },
    brief:
      "Center the article on a mock paycheck or timecard paystub line-by-line audit. Deconstruct each line item (Base Hours, Shift Premium, Imputed Income, Nondiscretionary Bonus, Overtime Allocation, Tax Withholdings). Use LaTeX formulas to show how regular rate flows into gross pay, and add a table contrasting lawful itemization versus deceptive wage bundling.",
  },
  {
    id: "multi-jurisdiction-matrix",
    needs: { tables: 1, math: 1 },
    brief:
      "Examine the topic through a multi-jurisdictional lens. Contrast the federal baseline against contrasting state laws (such as California Labor Code, New York Labor Law, Washington, or Illinois). Include a dense 5-to-6 column markdown comparison matrix and worked calculations showing the exact payroll wage variance between jurisdictions.",
  },
  {
    id: "troubleshooting-guide",
    needs: { tables: 1, math: 1 },
    brief:
      "Structure around the 5 most critical operational failure modes in payroll software and management practice for this topic. For each failure mode: state the symptom, identify the statutory violation, cite the governing CFR/USC section, provide the mathematical correction formula, and prescribe the permanent payroll fix.",
  },
  {
    id: "economic-tradeoff",
    needs: { tables: 1, math: 2 },
    brief:
      "Examine the financial and economic tradeoff between employer total compensation costs (payroll taxes, workers comp, benefits) and employee spendable take-home pay. Include worked mathematical formulas and a trade-off table comparing two alternative compensation or scheduling strategies.",
  },
  {
    id: "decision-tree",
    needs: { tables: 1, math: 1 },
    brief:
      "Build the article around a rigorous logical decision flow: 'If condition A is met, evaluate condition B'. Walk through 4 to 6 discrete decision checkpoints. Include a structured decision matrix table mapping workplace facts directly to lawful classification and payroll outcomes.",
  },
  {
    id: "historical-evolution",
    needs: { tables: 1, math: 1 },
    brief:
      "Trace the legal and economic evolution of this rule from its statutory origins through modern DOL Opinion Letters, Circuit Court rulings, and current 2026 enforcement standards. Include a timeline table of major legal turning points and worked calculations of past versus present statutory thresholds.",
  },
];

function readArchive() {
  if (!fs.existsSync(guidesDir)) return [];
  return fs
    .readdirSync(guidesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const text = fs.readFileSync(path.join(guidesDir, f), "utf-8");
      const headings = [...text.matchAll(/^##\s+(.+)$/gm)].map((m) => normalize(m[1]));
      const structure = (text.match(/^structure:\s*"?([a-z-]+)"?/m) || [])[1];
      return { slug: f.replace(/\.md$/, ""), text, headings, structure };
    });
}

const normalize = (h) => h.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

function loadQueue() {
  return JSON.parse(fs.readFileSync(queuePath, "utf-8"));
}

function pickStructure(archive) {
  const recent = archive.filter((a) => a.structure).slice(-6).map((a) => a.structure);
  const fresh = STRUCTURES.filter((s) => !recent.includes(s.id));
  const pool = fresh.length ? fresh : STRUCTURES;
  return pool[archive.length % pool.length];
}

// Headings that appear in more than one existing article are boilerplate and must not come back.
function overusedHeadings(archive) {
  const counts = new Map();
  for (const a of archive) for (const h of new Set(a.headings)) counts.set(h, (counts.get(h) || 0) + 1);
  return new Set([...counts].filter(([, n]) => n >= 2).map(([h]) => h));
}

function buildPrompt(topic, structure, archive, banned) {
  const siblings = archive
    .filter((a) => !/^draft$/.test((a.text.match(/^status:\s*"?(\w+)"?/m) || [])[1] || ""))
    .slice(-12)
    .map((a) => `- /guides/${a.slug}/`)
    .join("\n");
  return `TODAY'S DATE: ${TODAY_ISO}. Current calendar year: ${CURRENT_YEAR}.

Write an explanatory article for an independent financial and labor law publication about US wage and payroll rules. Audience: payroll controllers, corporate compensation analysts, small-business owners, and hourly employees.

TONE & FORENSIC STYLE:
Write with the objective rigor, depth, and precision of a specialized legal-accounting journal (such as Bloomberg Law, Tax Notes, or Journal of Accountancy). 
Never write like an AI assistant. Never use conversational meta-commentary, introductory throat-clearing, or clichéd transition words ("Moreover", "Furthermore", "In conclusion", "Ultimately", "Delving into", "In today's fast-paced world", "Crucial", "Vital", "Beacon"). Jump directly into the statutory reality in the very first sentence.

TOPIC
Title: ${topic.title}
Focus: ${topic.description}
Main point to establish: ${topic.keyTakeaway}
Primary authority: ${topic.statutoryRef}

FACTS YOU MAY RELY ON (verified by the editor; do not contradict them):
${topic.notes}

SHAPE OF THIS ARTICLE (${structure.id})
${structure.brief}

RULES
1. Third person only. Never claim first-hand experience, client stories, proprietary data, or "our analysis". No invented case studies, no invented worker names, and no invented employer names.
2. Accuracy over completeness. If you are not sure of a number, a date, or a citation, leave it out or write "check the current figure at the source". Do not guess. Any figure tied to a year (tax brackets, wage bases, limits, minimum wages) must name the exact year, or be left out.
3. Cite authority inline by exact statutory name (for example "29 C.F.R. § 778.114" or "29 U.S.C. § 207(o)"). Do not add a Sources section; the editor appends verified primary links.
4. Link only to these existing articles when natural, using the exact path, and at most three links:
${siblings}
   Do not link to any external website in the body text.
5. Headings: make headings specific and informative to this topic. Do NOT reuse generic boilerplate headings such as: ${[...banned].slice(0, 30).join(" | ")}.
6. Formatting: tables must be well-aligned GitHub markdown tables. Formulas must go on their own lines between $$ and $$. Write dollar amounts normally (for example $1,200).
7. Length: 1,050 to 1,450 words. Use between 5 and 8 H2 headings ('## '). Start immediately with the first H2; no title line and no frontmatter.`;
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini API returned status ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini API returned no text");
  return text.trim().replace(/^```(?:markdown)?\s*/i, "").replace(/\s*```$/, "");
}

function checkDraft(body, topic, structure, archive, banned) {
  const errors = [];

  const quality = auditArticleQuality({
    title: topic.title,
    description: topic.description,
    body_md: body,
    minWords: 1000,
    minTables: structure.needs.tables,
    minMath: structure.needs.math,
  });
  errors.push(...quality.errors);

  // Headings: no boilerplate, and not a copy of another article's outline.
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => normalize(m[1]));
  const reused = headings.filter((h) => banned.has(h));
  if (reused.length) errors.push(`BOILERPLATE_HEADINGS: ${reused.join("; ")}`);
  for (const a of archive) {
    const shared = headings.filter((h) => a.headings.includes(h)).length;
    if (headings.length && shared / headings.length >= 0.4) errors.push(`HEADING_OVERLAP with ${a.slug}`);
  }

  // Wording: no near-duplicate of an existing article.
  const mine = shingleSet(textOnly(body));
  for (const a of archive) {
    const sim = jaccardSimilarity(mine, shingleSet(textOnly(a.text)));
    if (sim > 0.35) errors.push(`TOO_SIMILAR to ${a.slug} (${(sim * 100).toFixed(0)}%)`);
  }

  // Links: internal ones must exist, external ones are not allowed in the body.
  const slugs = new Set(archive.map((a) => a.slug));
  for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    if (url.startsWith("/guides/")) {
      const slug = url.replace(/^\/guides\//, "").replace(/\/$/, "");
      if (!slugs.has(slug)) errors.push(`BROKEN_INTERNAL_LINK: ${url}`);
    } else if (/^https?:\/\//.test(url)) {
      let host = "";
      try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { /* ignore */ }
      if (!ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) errors.push(`DISALLOWED_LINK: ${url}`);
      else errors.push(`EXTERNAL_LINK_IN_BODY: ${url} (sources are appended by the editor)`);
    }
  }
  return { errors, stats: quality.stats };
}

async function main() {
  const archive = readArchive();
  const queue = loadQueue();
  const existing = new Set(archive.map((a) => a.slug));

  if (flag("--list")) {
    for (const t of queue) console.log(`${existing.has(t.slug) ? "[exists]" : "[queued]"} ${t.slug}`);
    return;
  }

  const wanted = flagValue("--slug");
  const topic = wanted ? queue.find((t) => t.slug === wanted) : queue.find((t) => !existing.has(t.slug));
  if (!topic) {
    console.log("[Generator] Nothing to do: every topic in scripts/topic-queue.json already has a file. Add topics to the queue.");
    return;
  }
  if (existing.has(topic.slug)) {
    console.error(`[Generator] ${topic.slug} already exists. Refusing to overwrite.`);
    process.exit(1);
  }

  const structure = pickStructure(archive);
  const banned = overusedHeadings(archive);
  const prompt = buildPrompt(topic, structure, archive, banned);

  console.log(`[Generator] Topic: ${topic.title}`);
  console.log(`[Generator] Structure: ${structure.id}`);
  if (flag("--dry-run")) {
    console.log("\n" + prompt);
    return;
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error("[Generator] GEMINI_API_KEY is not set. There is no fallback template: nothing was written.");
    process.exit(1);
  }

  let body = "";
  let lastErrors = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    const retry = lastErrors.length
      ? `\n\nYOUR PREVIOUS ATTEMPT WAS REJECTED FOR THESE REASONS. FIX THEM:\n- ${lastErrors.join("\n- ")}`
      : "";
    try {
      const raw = await callGemini(prompt + retry);
      const cleaned = sanitizeSignatures(raw.replace(new RegExp(`\\n${SOURCES_HEADING}[\\s\\S]*$`), "").trim());
      const { errors, stats } = checkDraft(cleaned, topic, structure, archive, banned);
      if (!errors.length) {
        body = cleaned;
        console.log(`[Generator] Passed checks on attempt ${attempt}: ${stats.words} words, ${stats.h2Count} H2s, ${stats.tableCount} tables, ${stats.mathCount} formulas.`);
        break;
      }
      lastErrors = errors;
      console.warn(`[Generator] Attempt ${attempt} rejected:\n  - ${errors.join("\n  - ")}`);
    } catch (e) {
      lastErrors = [e.message];
      console.warn(`[Generator] Attempt ${attempt} failed: ${e.message}`);
    }
  }

  if (!body) {
    console.error("[Generator] No acceptable draft after 3 attempts. Nothing was written.");
    process.exit(1);
  }

  const q = (v) => JSON.stringify(v);
  const file = `---
title: ${q(topic.title)}
description: ${q(topic.description)}
key_takeaway: ${q(topic.keyTakeaway)}
tool: ${q(topic.tool)}
status: "draft"
structure: ${q(structure.id)}
published: "${TODAY_ISO}"
author_slug: "eren-simsir"
---

${body}

${renderSources(topic.sources)}`;

  const target = path.join(guidesDir, `${topic.slug}.md`);
  fs.writeFileSync(target, file, "utf-8");
  console.log(`\n[Generator] Draft written: ${target}`);
  console.log("[Generator] NOT published. Before publishing:");
  console.log("  1. Check every number, date, and citation against the linked sources.");
  console.log("  2. Read it for repeated phrasing and anything you could not defend.");
  console.log('  3. Set status: "published" and a real published date.');
}

main().catch((e) => {
  console.error("[Generator] Fatal:", e);
  process.exit(1);
});
