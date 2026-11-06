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
 * High-Quality Automated Guide Generator & Publisher for The Wage Report.
 * Compliant with AUTO_BLOG_PLAYBOOK.md and AdSense / E-E-A-T Quality Standards.
 *
 * Usage:
 *   node scripts/generate-guide.mjs --publish       generate and publish next queued topic
 *   node scripts/generate-guide.mjs --draft         generate as draft
 *   node scripts/generate-guide.mjs --slug <slug>   generate one specific queued topic
 *   node scripts/generate-guide.mjs --list          list queue status
 *   node scripts/generate-guide.mjs --dry-run       print prompt without calling API
 */

const ROOT = process.cwd();
const guidesDir = path.join(ROOT, "src", "content", "guides");
const queuePath = path.join(ROOT, "scripts", "topic-queue.json");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

// Parse environment variables from .env
function loadEnv() {
  const env = { ...process.env };
  const envPath = path.join(ROOT, ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

const env = loadEnv();
const GEMINI_API_KEY = env.GEMINI_API_KEY;
const SUPABASE_URL = env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getUTCFullYear();

// Allowed external primary sources for citations
const ALLOWED_HOSTS = [
  "law.cornell.edu", "ecfr.gov", "dol.gov", "irs.gov", "ssa.gov", "gsa.gov", "eeoc.gov",
  "leginfo.legislature.ca.gov", "dir.ca.gov", "dol.ny.gov", "govinfo.gov", "federalregister.gov",
  "congress.gov", "sam.gov",
];

const STRUCTURES = [
  {
    id: "scenario-table",
    needs: { tables: 1, math: 0 },
    brief:
      "Open with a one-paragraph direct answer. Build the article around a table of 6 to 8 concrete scenarios (one per row) with a 'Result' column, then explain the two or three trickiest rows in their own short sections. Finish with a short statutory checklist.",
  },
  {
    id: "myth-fact",
    needs: { tables: 0, math: 1 },
    brief:
      "Organize the article as 4 to 6 'Myth' and 'Fact' pairs. Each pair states the rule, names the primary legal authority, and gives a one-line consequence. Include one worked calculation with LaTeX formulas.",
  },
  {
    id: "worked-case",
    needs: { tables: 1, math: 2 },
    brief:
      "Center the article on ONE detailed worked payroll example with stated numbers, computed step by step with LaTeX formulas ($$). Then add a table of variants showing how the gross/net/overtime result changes when one input changes.",
  },
  {
    id: "question-answer",
    needs: { tables: 0, math: 0 },
    brief:
      "Write 6 to 8 questions a worker or payroll controller would really ask. Make each question an H2 ('## '), phrased as the question, and answer it in 140 to 220 words with specific statutory citations.",
  },
  {
    id: "process-timeline",
    needs: { tables: 1, math: 0 },
    brief:
      "Present the topic as a compliance process or timeline: what happens first, next, and last, including statutory notices, deadlines, or payroll adjustments. Include a markdown table of steps or deadlines.",
  },
  {
    id: "comparison",
    needs: { tables: 1, math: 1 },
    brief:
      "Compare two or three legal or payroll regimes side by side (federal vs state, method A vs method B, exempt vs non-exempt) in a markdown table. Explain statutory trade-offs, with one formula and one concrete worked scenario.",
  },
  {
    id: "audit-checklist",
    needs: { tables: 1, math: 1 },
    brief:
      "Structure as an exhaustive internal payroll compliance audit. Divide into 4 distinct phases (Classification, Working Time Accounting, Rate Composition, Record Retention). Under each phase provide forensic verification steps with statutory citations and a table rating violation severity with financial exposure numbers.",
  },
  {
    id: "statutory-deconstruction",
    needs: { tables: 1, math: 1 },
    brief:
      "Perform a clause-by-clause anatomical legal teardown of the governing regulation. Break down operative statutory phrases, define judicial thresholds, explain how employers trigger violations, and include a table quantifying employer financial liability under FLSA Section 16(b).",
  },
  {
    id: "troubleshooting-guide",
    needs: { tables: 1, math: 1 },
    brief:
      "Structure around the 5 most critical operational failure modes in payroll software and management practice for this topic. For each failure mode: state the symptom, identify the statutory violation, cite governing CFR/USC section, provide mathematical correction formula, and prescribe the permanent payroll fix.",
  },
  {
    id: "multi-jurisdiction-matrix",
    needs: { tables: 1, math: 1 },
    brief:
      "Examine the topic through a multi-jurisdictional lens. Contrast the federal baseline against contrasting state laws (such as California Labor Code, New York Labor Law, Illinois). Include a dense markdown comparison matrix and worked calculations showing the wage variance.",
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
      const published = (text.match(/^published:\s*"?([0-9-]+)"?/m) || [])[1];
      const isDraft = /status:\s*"draft"/m.test(text);
      return { slug: f.replace(/\.md$/, ""), text, headings, structure, published, isDraft };
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

function overusedHeadings(archive) {
  const counts = new Map();
  for (const a of archive) for (const h of new Set(a.headings)) counts.set(h, (counts.get(h) || 0) + 1);
  return new Set([...counts].filter(([, n]) => n >= 2).map(([h]) => h));
}

function getNextPublishDate(archive) {
  const publishedDates = archive
    .filter((a) => !a.isDraft && a.published)
    .map((a) => a.published)
    .sort();

  if (!publishedDates.length) return TODAY_ISO;
  const latest = publishedDates[publishedDates.length - 1];

  if (latest < TODAY_ISO) return TODAY_ISO;

  const next = new Date(`${latest}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

function buildPrompt(topic, structure, archive, banned) {
  const siblings = archive
    .filter((a) => !a.isDraft)
    .slice(-15)
    .map((a) => `- /guides/${a.slug}/`)
    .join("\n");

  return `TODAY'S DATE: ${TODAY_ISO}. Current calendar year: ${CURRENT_YEAR}.

Write an exhaustive, authoritative explanatory article for The Wage Report (an independent labor economics and payroll legal publication).
Audience: payroll controllers, corporate compensation analysts, small-business owners, and hourly employees.

TONE & FORENSIC STYLE:
Write with the objective rigor, depth, and analytical precision of a specialized legal-accounting journal (such as Bloomberg Tax, Journal of Accountancy, or Tax Notes).
Never write like an AI assistant. Never use conversational filler, rhetorical throat-clearing, or clichéd transitions ("Moreover", "Furthermore", "In conclusion", "Ultimately", "Delving into", "In today's fast-paced world", "Crucial", "Vital", "Beacon", "Landscape").
Jump directly into the statutory payroll reality in the very first sentence.

TOPIC DETAILS:
Title: ${topic.title}
Focus: ${topic.description}
Main point to establish: ${topic.keyTakeaway}
Primary legal authority: ${topic.statutoryRef}

FACTUAL BASELINE (strictly follow and do not contradict):
${topic.notes}

EDITORIAL STRUCTURE (${structure.id}):
${structure.brief}

MANDATORY RULES:
1. Third person only. Never use 'our data', 'in our experience', 'we audited', or fabricated anecdotes.
2. Concrete figures: cite exact statutory thresholds, percentages, and dollar amounts. Any year-dependent figures must name the exact year.
3. Authority citations: cite governing legal authority inline by exact statutory name (e.g. '29 C.F.R. § 778.114' or '29 U.S.C. § 207(o)'). Do not add an external sources section at the end; the system attaches primary links.
4. Internal links: naturally link to 2 or 3 of these existing guides using exact markdown paths:
${siblings}
   Do not link to any non-existing paths or outside websites in the body.
5. Headings: make headings specific, descriptive, and technical. Do NOT reuse generic headings such as: ${[...banned].slice(0, 25).join(" | ")}.
6. Formatting: tables must be clean GitHub markdown tables. Formulas must be on their own lines between $$ and $$.
7. Length: 1,100 to 1,500 words. Include 5 to 8 H2 headings ('## '). Start immediately with the first H2; do NOT include frontmatter or H1 title.
8. Complete finish: End with a complete, definitive closing sentence. Never leave an open clause.`;
}

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest"
];

async function callGemini(prompt) {
  let lastErr = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          }),
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Generator] Model ${model} returned HTTP ${res.status}. Falling back to next model...`);
        lastErr = new Error(`HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];
      if (!candidate) {
        lastErr = new Error(`Model ${model} returned no candidates`);
        continue;
      }

      if (candidate.finishReason === "MAX_TOKENS") {
        lastErr = new Error(`Model ${model} output was truncated due to max output tokens`);
        continue;
      }

      const text = candidate.content?.parts?.[0]?.text;
      if (!text) {
        lastErr = new Error(`Model ${model} returned empty text`);
        continue;
      }

      // Success with this model!
      return text.trim().replace(/^```(?:markdown)?\s*/i, "").replace(/\s*```$/, "");
    } catch (e) {
      console.warn(`[Generator] Error contacting model ${model}: ${e.message}`);
      lastErr = e;
    }
  }

  throw lastErr || new Error("All candidate Gemini models failed to generate content.");
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

  // Check complete sentence ending
  if (!/[.!?]["']?\s*$/.test(body.trim())) {
    errors.push("TRUNCATED_BODY: Article body does not terminate on a finished sentence.");
  }

  // Headings check
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => normalize(m[1]));
  const reused = headings.filter((h) => banned.has(h));
  if (reused.length) errors.push(`BOILERPLATE_HEADINGS: ${reused.join("; ")}`);

  for (const a of archive) {
    const shared = headings.filter((h) => a.headings.includes(h)).length;
    if (headings.length && shared / headings.length >= 0.4) {
      errors.push(`HEADING_OVERLAP with ${a.slug}`);
    }
  }

  // Similarity check
  const mine = shingleSet(textOnly(body));
  for (const a of archive) {
    const sim = jaccardSimilarity(mine, shingleSet(textOnly(a.text)));
    if (sim > 0.35) errors.push(`TOO_SIMILAR to ${a.slug} (${(sim * 100).toFixed(0)}%)`);
  }

  // Links validation
  const slugs = new Set(archive.map((a) => a.slug));
  for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    if (url.startsWith("/guides/")) {
      const targetSlug = url.replace(/^\/guides\//, "").replace(/\/$/, "");
      if (!slugs.has(targetSlug)) errors.push(`BROKEN_INTERNAL_LINK: ${url}`);
    } else if (/^https?:\/\//.test(url)) {
      errors.push(`EXTERNAL_LINK_IN_BODY: ${url} (sources are appended automatically)`);
    }
  }

  return { errors, stats: quality.stats };
}

async function pushToSupabase(articleRow) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[Supabase] Credentials not configured. Skipping database push.");
    return false;
  }

  console.log(`[Supabase] Pushing article '${articleRow.slug}' to Supabase...`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([articleRow]),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[Supabase] Push failed (${res.status}): ${err}`);
    return false;
  }

  console.log(`[Supabase] Successfully synced '${articleRow.slug}' to Supabase.`);
  return true;
}

async function main() {
  const archive = readArchive();
  const queue = loadQueue();
  const existing = new Set(archive.map((a) => a.slug));

  if (flag("--list")) {
    console.log(`\n=== Topic Queue Status (${queue.length} topics) ===`);
    let written = 0;
    for (const t of queue) {
      const exists = existing.has(t.slug);
      if (exists) written++;
      console.log(`${exists ? "[PUBLISHED]" : "[QUEUED]   "} ${t.slug}`);
    }
    console.log(`Total: ${written}/${queue.length} completed.\n`);
    return;
  }

  const wanted = flagValue("--slug");
  const topic = wanted ? queue.find((t) => t.slug === wanted) : queue.find((t) => !existing.has(t.slug));

  if (!topic) {
    console.log("[Generator] All queued topics have already been generated!");
    return;
  }

  if (existing.has(topic.slug)) {
    console.error(`[Generator] Topic '${topic.slug}' already exists on disk.`);
    process.exit(1);
  }

  const isPublishMode = flag("--publish") || (!flag("--draft"));
  const targetStatus = isPublishMode ? "published" : "draft";
  const publishDate = isPublishMode ? getNextPublishDate(archive) : TODAY_ISO;

  const structure = pickStructure(archive);
  const banned = overusedHeadings(archive);
  const prompt = buildPrompt(topic, structure, archive, banned);

  console.log(`\n[Generator] Target Topic: "${topic.title}"`);
  console.log(`[Generator] Slug: ${topic.slug}`);
  console.log(`[Generator] Status: ${targetStatus} | Target Date: ${publishDate}`);
  console.log(`[Generator] Editorial Structure: ${structure.id}`);

  if (flag("--dry-run")) {
    console.log("\n--- GENERATED PROMPT ---");
    console.log(prompt);
    return;
  }

  if (!GEMINI_API_KEY) {
    console.error("[Generator] FATAL: GEMINI_API_KEY is missing from environment or .env!");
    process.exit(1);
  }

  let body = "";
  let lastErrors = [];

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`[Generator] Calling Gemini API (attempt ${attempt}/3)...`);
    const retry = lastErrors.length
      ? `\n\nYOUR PREVIOUS ATTEMPT HAD THE FOLLOWING REJECTIONS. YOU MUST FIX THEM:\n- ${lastErrors.join("\n- ")}`
      : "";

    try {
      const raw = await callGemini(prompt + retry);
      const cleaned = sanitizeSignatures(
        raw.replace(new RegExp(`\\n${SOURCES_HEADING}[\\s\\S]*$`), "").trim(),
      );

      const { errors, stats } = checkDraft(cleaned, topic, structure, archive, banned);
      if (!errors.length) {
        body = cleaned;
        console.log(
          `[Generator] Passed all quality gates on attempt ${attempt}: ` +
          `${stats.words} words, ${stats.h2Count} H2s, ${stats.tableCount} tables, ${stats.mathCount} formulas.`,
        );
        break;
      }

      lastErrors = errors;
      console.warn(`[Generator] Quality Reject (attempt ${attempt}):\n  - ${errors.join("\n  - ")}`);
    } catch (e) {
      lastErrors = [e.message];
      console.warn(`[Generator] Attempt ${attempt} failed: ${e.message}`);
    }

    if (attempt < 3) {
      console.log("[Generator] Waiting 4 seconds before retry...");
      await new Promise((r) => setTimeout(r, 4000));
    }
  }

  if (!body) {
    console.error("[Generator] FATAL: Could not generate a compliant article after 3 attempts.");
    process.exit(1);
  }

  // Ensure internal linking depth
  let relatedLinksBlock = "";
  const existingSlugsList = archive.map((a) => a.slug).filter((s) => s !== topic.slug);
  const internalLinkMatches = (body.match(/\[.*?\]\(\/guides\/[a-z0-9-]+\/?\)/gm) || []).length;

  if (internalLinkMatches < 3 && existingSlugsList.length >= 2) {
    const candidates = existingSlugsList.slice(-2);
    relatedLinksBlock = `\n\n## Related Statutory & Payroll Guides\n\nFor additional context on FLSA regulations and compensation compliance, review our related guides:\n\n`;
    for (const c of candidates) {
      const item = archive.find((a) => a.slug === c);
      const titleMatch = item?.text?.match(/title:\s*["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : c;
      relatedLinksBlock += `- [${title}](/guides/${c}/)\n`;
    }
  }

  const q = (v) => JSON.stringify(v);
  const markdownContent = `---
title: ${q(topic.title)}
description: ${q(topic.description)}
key_takeaway: ${q(topic.keyTakeaway)}
tool: ${q(topic.tool)}
status: ${q(targetStatus)}
structure: ${q(structure.id)}
published: "${publishDate}"
author_slug: "eren-simsir"
---

${body}${relatedLinksBlock}

${renderSources(topic.sources)}`;

  const targetPath = path.join(guidesDir, `${topic.slug}.md`);
  fs.writeFileSync(targetPath, markdownContent, "utf-8");
  console.log(`\n[Generator] Guide successfully written to: ${targetPath}`);

  if (isPublishMode) {
    const row = {
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      key_takeaway: topic.keyTakeaway,
      body_md: `${body}${relatedLinksBlock}\n\n${renderSources(topic.sources)}`,
      tool: topic.tool,
      status: "published",
      published_at: `${publishDate}T12:00:00Z`,
      author_slug: "eren-simsir",
    };
    await pushToSupabase(row);
  }

  console.log(`\n[Generator] COMPLETED: "${topic.title}" is ready for deployment.`);
}

main().catch((err) => {
  console.error("[Generator] Fatal execution error:", err);
  process.exit(1);
});