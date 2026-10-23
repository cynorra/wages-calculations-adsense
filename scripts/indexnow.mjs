import { readFileSync, readdirSync, existsSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const args = process.argv.slice(2);
const since = args.includes("--since") ? args[args.indexOf("--since") + 1] : null;
const dry = args.includes("--dry-run");

const dist = new URL("../dist/", import.meta.url);
const urls = [];

if (existsSync(dist)) {
  const files = readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f) || f === "sitemap-0.xml");
  for (const f of files) {
    const xml = readFileSync(new URL(f, dist), "utf8");
    for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
      const [, loc, lastmod] = m;
      if (!since || (lastmod && lastmod.slice(0, 10) >= since)) urls.push(loc);
    }
  }
}

if (!urls.length) {
  console.log("No URLs to submit to IndexNow.");
  process.exit(0);
}

const body = {
  host: new URL(SITE.url).host,
  key: SITE.indexNowKey,
  keyLocation: `${SITE.url}/indexnow-key.txt`,
  urlList: urls.slice(0, 10000),
};

if (dry) {
  console.log(`Dry run: would submit ${urls.length} URLs to IndexNow.`);
  process.exit(0);
}

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow responded ${res.status} ${res.statusText}`);
} catch (e) {
  console.error("IndexNow submission failed:", e.message);
}
