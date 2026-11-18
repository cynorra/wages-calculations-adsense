import fs from 'fs';
import path from 'path';

const dir = 'src/content/guides';
const files = fs.readdirSync(dir);

let fixed = 0;
for (const f of files) {
  if (!f.endsWith('.md')) continue;
  const p = path.join(dir, f);
  let raw = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Change status: "draft" to status: "published"
  if (raw.includes('status: "draft"') || raw.includes("status: 'draft'") || raw.includes('status: draft')) {
    raw = raw.replace(/status:\s*["']?draft["']?/g, 'status: "published"');
    changed = true;
  }

  // Check if published is in the future
  const pubMatch = raw.match(/published:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  if (pubMatch && pubMatch[1] > '2026-11-18') {
    raw = raw.replace(/published:\s*["']?\d{4}-\d{2}-\d{2}["']?/, 'published: "2026-11-18"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(p, raw, 'utf8');
    console.log(`Updated ${f} -> published on 2026-11-18`);
    fixed++;
  }
}

console.log(`Total fixed: ${fixed}`);
