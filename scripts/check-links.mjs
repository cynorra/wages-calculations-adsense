import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { localRows } from "../src/lib/articles-source.js";

const DIST = new URL("../dist/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const problems = [];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

if (existsSync(DIST)) {
  for (const file of walk(DIST)) {
    const html = readFileSync(file, "utf8");
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      if (href.startsWith("//")) continue;
      const cleanHref = href.endsWith("/") ? href : `${href}/`;
      const target = join(DIST, cleanHref.replace(/\//g, "\\"), "index.html");
      const ok = existsSync(target) || existsSync(join(DIST, href.replace(/\//g, "\\")));
      if (!ok) problems.push(`${file.replace(DIST, "/")} -> ${href}`);
    }
  }
}

const rows = localRows();
const date = Object.fromEntries(rows.map((r) => [r.slug, r.published_at]));
for (const r of rows) {
  for (const m of r.body_md.matchAll(/\]\(\/guides\/([^/)]+)\/?\)|href="\/guides\/([^/"]+)/g)) {
    const slug = m[1] ?? m[2];
    if (!(slug in date)) problems.push(`${r.slug}: links to missing guide ${slug}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} link problem(s):\n` + [...new Set(problems)].join("\n"));
  process.exit(1);
}
console.log("Links and article schedules verified: OK");
