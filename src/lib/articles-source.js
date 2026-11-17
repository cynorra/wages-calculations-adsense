import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { guideRow } from "./frontmatter.js";
import { listPublishedFromFirestore } from "../../scripts/lib/firestore.mjs";

const COLUMNS = "slug,title,description,body_md,tool,published_at,content_updated_at,author_slug";

export const day = (iso) => (iso ? iso.slice(0, 10) : undefined);
export function updatedDay(row) {
  const pub = day(row.published_at);
  const upd = day(row.content_updated_at);
  return upd && upd > pub ? upd : undefined;
}

// Astro bundles this module into dist/chunks at build time, so a path relative to import.meta.url
// no longer points at src/. Builds always run from the project root, so resolve from there.
function guidesDir() {
  const candidates = [
    resolve(process.cwd(), "src/content/guides"),
    fileURLToPath(new URL("../content/guides/", import.meta.url)),
  ];
  return candidates.find((d) => existsSync(d));
}

export function localRows() {
  const dir = guidesDir();
  if (!dir) {
    console.warn("No guides directory found; no local guides will be published.");
    return [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => guideRow(f, readFileSync(join(dir, f), "utf8")));
}

export function localLiveArticles() {
  const nowIso = new Date().toISOString();
  return localRows()
    .filter((r) => r.status === "published" && r.published_at <= nowIso)
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

// Firestore is the source of truth (collection "articles" in the project of FIREBASE_SERVICE_ACCOUNT).
// Edit a guide in src/content/guides, run `node scripts/push-firestore.mjs`, then deploy.
// The markdown files stay in the repo as a backup: if Firestore is unreachable, empty, or returns far fewer
// guides than the files hold, the build falls back to the files so a Firestore problem can never ship a site
// with its guides missing. The result is memoized so one build reads Firestore once, not once per page.
let livePromise = null;
export function liveArticles() {
  if (!livePromise) {
    livePromise = loadLiveArticles().catch((e) => {
      livePromise = null;
      throw e;
    });
  }
  return livePromise;
}

async function loadLiveArticles() {
  const nowIso = new Date().toISOString();
  const local = localLiveArticles();

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const fire = await listPublishedFromFirestore(process.env.FIREBASE_SERVICE_ACCOUNT, nowIso, process.env.FIRESTORE_COLLECTION);
    const floor = Math.floor(local.length * 0.8);
    if (fire.length > 0 && fire.length >= floor) {
      console.log(`[articles] ${fire.length} live guides from Firestore (local files: ${local.length}).`);
      return fire.sort((a, b) => b.published_at.localeCompare(a.published_at));
    }
    console.warn(`[articles] Firestore returned ${fire.length} guides (local files: ${local.length}); falling back to the local files.`);
  }

  // Any local file, including a draft, takes precedence over a remote row with the same slug.
  const known = new Set(localRows().map((r) => r.slug));
  const extra = [];

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl}/rest/v1/articles?select=${COLUMNS}&status=eq.published&published_at=lte.${encodeURIComponent(nowIso)}&order=published_at.desc`;
      const res = await fetch(url, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
      if (!res.ok) console.warn(`Supabase responded ${res.status}; skipping Supabase articles.`);
      else {
        const remote = await res.json();
        if (Array.isArray(remote)) extra.push(...remote.filter((r) => !known.has(r.slug)));
      }
    } catch (e) {
      console.warn("Supabase fetch failed, skipping Supabase articles:", e.message);
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const fire = await listPublishedFromFirestore(process.env.FIREBASE_SERVICE_ACCOUNT, nowIso, process.env.FIRESTORE_COLLECTION);
    const seen = new Set(extra.map((r) => r.slug));
    extra.push(...fire.filter((r) => !known.has(r.slug) && !seen.has(r.slug)));
  }

  return [...local, ...extra].sort((a, b) => b.published_at.localeCompare(a.published_at));
}
