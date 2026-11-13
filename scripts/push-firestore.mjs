// Backfill: push every markdown guide in src/content/guides to Firestore.
//   node scripts/push-firestore.mjs            push all
//   node scripts/push-firestore.mjs --dry-run  list only
// Reads FIREBASE_SERVICE_ACCOUNT from the environment or .env (raw JSON on one line, or base64).
import { readdirSync, readFileSync } from "node:fs";
import { guideRow } from "../src/lib/frontmatter.js";
import { pushToFirestore } from "./lib/firestore.mjs";
import { loadEnvFile } from "./lib/env.mjs";

const env = loadEnvFile(".env");

const dir = new URL("../src/content/guides/", import.meta.url);
const rows = readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => guideRow(f, readFileSync(new URL(f, dir), "utf8")));
const dry = process.argv.includes("--dry-run");
let ok = 0;
for (const r of rows) {
  if (dry) console.log(`- [${r.slug}] ${r.status} ${r.published_at?.slice(0, 10)}`);
  else if (await pushToFirestore(r, env.FIREBASE_SERVICE_ACCOUNT, env.FIRESTORE_COLLECTION)) ok++;
}
console.log(dry ? `${rows.length} guides (dry run).` : `Pushed ${ok}/${rows.length} guides to Firestore.`);
if (!dry && ok < rows.length) process.exit(1);
