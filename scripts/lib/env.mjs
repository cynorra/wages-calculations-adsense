// .env reader that also accepts a multi-line JSON value (e.g. a pasted service-account file).
import fs from "node:fs";

export function parseEnv(text) {
  const out = {};
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (value.startsWith("{")) {
      const depth = (s) => (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;
      let d = depth(value);
      while (d > 0 && i + 1 < lines.length) {
        const next = lines[++i].trim();
        value += next;
        d += depth(next);
      }
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    out[key] = value;
  }
  return out;
}

export function loadEnvFile(file, base = process.env) {
  const env = { ...base };
  if (fs.existsSync(file)) {
    for (const [k, v] of Object.entries(parseEnv(fs.readFileSync(file, "utf8")))) env[k] = v;
  }
  return env;
}
