import { readdirSync, readFileSync, existsSync } from "node:fs";
import { guideRow } from "../src/lib/frontmatter.js";

const parseDotEnv = () => {
  const env = { ...process.env };
  if (existsSync(".env")) {
    for (const l of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const trimmed = l.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
};

const env = parseDotEnv();
const URL_ = env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");

if (!dry && (!URL_ || !KEY)) {
  console.log("Supabase credentials not configured in .env. Running in dry-run mode.");
}

const dir = new URL("../src/content/guides/", import.meta.url);
if (!existsSync(dir)) {
  console.log("No guides directory found yet.");
  process.exit(0);
}

const files = readdirSync(dir).filter(f => f.endsWith(".md"));
const rows = files.map(file => {
  const { content_updated_at, author_slug, ...row } = guideRow(file, readFileSync(new URL(file, dir), "utf8"));
  return row;
});

if (dry || !URL_ || !KEY) {
  console.log(`Found ${rows.length} guides:`);
  rows.forEach(r => console.log(`- [${r.slug}] (status: ${r.status}, date: ${r.published_at?.slice(0, 10)})`));
  process.exit(0);
}

const res = await fetch(`${URL_}/rest/v1/articles?on_conflict=slug`, {
  method: "POST",
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify(rows),
});

if (!res.ok) console.error("Error pushing to Supabase:", await res.text());
else console.log(`Successfully pushed ${rows.length} articles to Supabase.`);
