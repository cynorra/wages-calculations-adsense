import { readdirSync, readFileSync, existsSync } from "node:fs";
import { guideRow } from "./frontmatter.js";

const COLUMNS = "slug,title,description,body_md,tool,published_at,content_updated_at,author_slug";

export const day = (iso) => (iso ? iso.slice(0, 10) : undefined);
export function updatedDay(row) {
  const pub = day(row.published_at);
  const upd = day(row.content_updated_at);
  return upd && upd > pub ? upd : undefined;
}

export function localRows() {
  const dir = new URL("../content/guides/", import.meta.url);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => guideRow(f, readFileSync(new URL(f, dir), "utf8")));
}

export function localLiveArticles() {
  const nowIso = new Date().toISOString();
  return localRows()
    .filter((r) => r.status === "published" && r.published_at <= nowIso)
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export async function liveArticles() {
  const nowIso = new Date().toISOString();
  // If SUPABASE credentials are set in process.env, fetch from Supabase
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = `${supabaseUrl}/rest/v1/articles?select=${COLUMNS}&status=eq.published&published_at=lte.${encodeURIComponent(nowIso)}&order=published_at.desc`;
      const res = await fetch(url, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local files:", e.message);
    }
  }

  return localLiveArticles();
}
