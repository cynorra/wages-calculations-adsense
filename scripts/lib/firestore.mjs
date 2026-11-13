// Minimal Firestore writer (REST + service account), no extra npm dependency.
// Env: FIREBASE_SERVICE_ACCOUNT = the service-account JSON (raw JSON or base64 of it).
// Optional: FIRESTORE_COLLECTION (default "articles").
import crypto from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/datastore";
let cached;

export function loadServiceAccount(raw) {
  if (!raw) return null;
  const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const sa = JSON.parse(text);
  if (!sa.client_email || !sa.private_key || !sa.project_id) throw new Error("service account JSON is missing client_email/private_key/project_id");
  return sa;
}

const b64u = (b) => Buffer.from(b).toString("base64url");

async function accessToken(sa) {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64u(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const sig = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claim}`), sa.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claim}.${sig}` }),
  });
  if (!res.ok) throw new Error(`token request failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  cached = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

function toField(key, value) {
  if (key.endsWith("_at")) return { timestampValue: new Date(value).toISOString() };
  return { stringValue: String(value) };
}

// Upserts one article document at <collection>/<slug>. Returns true on success, never throws.
export async function pushToFirestore(row, rawServiceAccount, collection = "articles") {
  let sa;
  try {
    sa = loadServiceAccount(rawServiceAccount);
  } catch (e) {
    console.error(`[Firestore] Bad FIREBASE_SERVICE_ACCOUNT: ${e.message}`);
    return false;
  }
  if (!sa) {
    console.warn("[Firestore] FIREBASE_SERVICE_ACCOUNT not configured. Skipping Firestore push.");
    return false;
  }
  try {
    const fields = {};
    for (const [k, v] of Object.entries(row)) if (v !== undefined && v !== null && v !== "") fields[k] = toField(k, v);
    const url = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents/${collection}/${encodeURIComponent(row.slug)}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${await accessToken(sa)}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      console.error(`[Firestore] Push failed for '${row.slug}' (${res.status}): ${await res.text()}`);
      return false;
    }
    console.log(`[Firestore] Synced '${row.slug}' to ${collection}.`);
    return true;
  } catch (e) {
    console.error(`[Firestore] Push failed for '${row.slug}': ${e.message}`);
    return false;
  }
}

const fromField = (f) => (f && (f.timestampValue ?? f.stringValue)) ?? undefined;

// Reads published articles (published_at <= nowIso) from <collection>. Returns [] on any problem.
export async function listPublishedFromFirestore(rawServiceAccount, nowIso, collection = "articles") {
  try {
    const sa = loadServiceAccount(rawServiceAccount);
    if (!sa) return [];
    const url = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents:runQuery`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken(sa)}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
        },
      }),
    });
    if (!res.ok) {
      console.warn(`Firestore responded ${res.status}; skipping Firestore articles.`);
      return [];
    }
    const rows = (await res.json())
      .filter((r) => r.document)
      .map((r) => Object.fromEntries(Object.entries(r.document.fields || {}).map(([k, v]) => [k, fromField(v)])));
    // The date filter is applied here (not in the query) so no composite index is needed.
    return rows.filter((r) => r.slug && r.body_md && r.published_at && r.published_at <= nowIso);
  } catch (e) {
    console.warn("Firestore fetch failed, skipping Firestore articles:", e.message);
    return [];
  }
}
