import { infographicBody } from "./infographics.js";

// Original cover illustrations, generated per article from its slug.
// No stock photography: every piece is drawn from geometry that matches the article type.

const THEMES = [
  { bg1: "#f4f7f5", bg2: "#dfeae3", ink: "#1e3027", mid: "#4f8266", soft: "#a3c2b0", accent: "#c8873a" },
  { bg1: "#f5f6f9", bg2: "#e0e5ef", ink: "#1b2740", mid: "#4a639b", soft: "#a9b8d6", accent: "#d1693f" },
  { bg1: "#faf6ef", bg2: "#efe3cd", ink: "#3a2a16", mid: "#a8742f", soft: "#dcc196", accent: "#2f6f5e" },
  { bg1: "#f8f4f2", bg2: "#ecdcd5", ink: "#3b2020", mid: "#a4523f", soft: "#d9aea0", accent: "#2d5a6b" },
];

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

function frame(t, uid, body) {
  return `<defs>
<linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
<linearGradient id="fade-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.mid}" stop-opacity=".9"/><stop offset="1" stop-color="${t.ink}" stop-opacity=".95"/></linearGradient>
</defs>
<rect width="960" height="420" fill="url(#bg-${uid})"/>
<g stroke="${t.ink}" stroke-opacity=".05">${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 42}" x2="960" y2="${i * 42}"/>`).join("")}</g>
${body}`;
}

// Stacked statute pages with ruled lines, a 40-hour dial and a small bar run.
function editorial(t, uid, r) {
  const sheets = [0, 1, 2]
    .map((i) => {
      const x = 560 + i * 34;
      const y = 60 + i * 22;
      const rot = f(-6 + i * 5 + r() * 2);
      const lines = Array.from({ length: 9 }, (_, k) => {
        const w = f(120 + r() * 110);
        return `<rect x="${x + 28}" y="${y + 58 + k * 26}" width="${w}" height="6" rx="3" fill="${t.ink}" opacity="${k === 0 ? 0.55 : 0.14}"/>`;
      }).join("");
      return `<g transform="rotate(${rot} ${x + 130} ${y + 150})"><rect x="${x}" y="${y}" width="260" height="300" rx="16" fill="#fff" stroke="${t.soft}" stroke-width="1.5"/><rect x="${x + 28}" y="${y + 24}" width="70" height="12" rx="6" fill="${t.accent}"/>${lines}</g>`;
    })
    .join("");
  const cx = 250, cy = 215, R = 118;
  const share = 0.45 + r() * 0.3;
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
    const long = i % 6 === 0;
    const r1 = R + 14, r2 = R + (long ? 34 : 24);
    const on = i / 48 <= share;
    return `<line x1="${f(cx + r1 * Math.cos(a))}" y1="${f(cy + r1 * Math.sin(a))}" x2="${f(cx + r2 * Math.cos(a))}" y2="${f(cy + r2 * Math.sin(a))}" stroke="${on ? t.accent : t.ink}" stroke-opacity="${on ? 1 : 0.25}" stroke-width="${long ? 3 : 2}" stroke-linecap="round"/>`;
  }).join("");
  const end = share * Math.PI * 2 - Math.PI / 2;
  const ex = f(cx + R * Math.cos(end)), ey = f(cy + R * Math.sin(end));
  const large = share > 0.5 ? 1 : 0;
  const bars = Array.from({ length: 14 }, (_, i) => {
    const h = f(16 + r() * 54);
    return `<rect x="${70 + i * 22}" y="${376 - h}" width="12" height="${h}" rx="3" fill="${i > 9 ? t.accent : t.mid}" opacity="${i > 9 ? 0.95 : 0.55}"/>`;
  }).join("");
  return frame(t, uid, `<circle cx="${cx}" cy="${cy}" r="${R + 70}" fill="${t.soft}" opacity=".22"/>${sheets}<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" fill-opacity=".7" stroke="${t.soft}" stroke-width="2"/>${ticks}<path d="M ${cx} ${cy - R} A ${R} ${R} 0 ${large} 1 ${ex} ${ey}" fill="none" stroke="${t.ink}" stroke-width="10" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="9" fill="${t.ink}"/>${bars}`);
}

// A ladder of pay periods shrinking from the annual figure down to the hourly rate, over a ring of 52 weeks.
function figure(t, uid, r) {
  const labels = 6;
  const rows = Array.from({ length: labels }, (_, i) => {
    const w = f(470 * Math.pow(0.58, i) + 18);
    const y = 78 + i * 52;
    const hot = i === labels - 1;
    return `<rect x="70" y="${y}" width="470" height="30" rx="15" fill="${t.soft}" opacity=".35"/><rect x="70" y="${y}" width="${w}" height="30" rx="15" fill="${hot ? t.accent : t.mid}" opacity="${hot ? 1 : 0.88 - i * 0.08}"/>`;
  }).join("");
  const cx = 750, cy = 210, R = 120;
  const weeks = Array.from({ length: 52 }, (_, i) => {
    const a = (i / 52) * Math.PI * 2 - Math.PI / 2;
    const r1 = R - 2, r2 = R + 30 + (r() > 0.78 ? 14 : 0);
    const lit = i < 40;
    return `<line x1="${f(cx + r1 * Math.cos(a))}" y1="${f(cy + r1 * Math.sin(a))}" x2="${f(cx + r2 * Math.cos(a))}" y2="${f(cy + r2 * Math.sin(a))}" stroke="${lit ? t.ink : t.mid}" stroke-opacity="${lit ? 0.85 : 0.35}" stroke-width="5" stroke-linecap="round"/>`;
  }).join("");
  return frame(t, uid, `<circle cx="${cx}" cy="${cy}" r="${R + 60}" fill="${t.soft}" opacity=".25"/>${rows}${weeks}<circle cx="${cx}" cy="${cy}" r="${R - 26}" fill="url(#fade-${uid})"/><circle cx="${cx}" cy="${cy}" r="${R - 58}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-dasharray="3 9"/><circle cx="${cx}" cy="${cy}" r="8" fill="${t.accent}"/>`);
}

// Gross-to-net waterfall: one tall bar, floating deductions, a final take-home bar.
function ledger(t, uid, r) {
  const base = 372, top = 70, H = base - top;
  const cuts = [0.12 + r() * 0.05, 0.075 + r() * 0.02, 0.04 + r() * 0.05, 0.03 + r() * 0.06, 0.02 + r() * 0.05];
  const labels = ["gross", ...cuts.map(() => ""), "net"];
  const bw = 96, gap = 38, x0 = 80;
  let level = 1;
  const bars = [];
  bars.push(`<rect x="${x0}" y="${f(base - H)}" width="${bw}" height="${H}" rx="10" fill="url(#fade-${uid})"/>`);
  cuts.forEach((c, i) => {
    const x = x0 + (i + 1) * (bw + gap);
    const yTop = base - level * H;
    const h = c * H;
    bars.push(`<line x1="${x - gap}" y1="${f(yTop)}" x2="${x}" y2="${f(yTop)}" stroke="${t.ink}" stroke-opacity=".3" stroke-dasharray="4 5"/>`);
    bars.push(`<rect x="${x}" y="${f(yTop)}" width="${bw}" height="${f(h)}" rx="10" fill="${i === 0 ? t.accent : t.soft}" opacity="${i === 0 ? 1 : 0.9 - i * 0.07}"/>`);
    level -= c;
  });
  const xn = x0 + (cuts.length + 1) * (bw + gap);
  const yn = base - level * H;
  bars.push(`<line x1="${xn - gap}" y1="${f(yn)}" x2="${xn}" y2="${f(yn)}" stroke="${t.ink}" stroke-opacity=".3" stroke-dasharray="4 5"/>`);
  bars.push(`<rect x="${xn}" y="${f(yn)}" width="${bw}" height="${f(base - yn)}" rx="10" fill="${t.mid}"/>`);
  const axis = `<line x1="50" y1="${base}" x2="910" y2="${base}" stroke="${t.ink}" stroke-opacity=".35" stroke-width="2"/>`;
  void labels;
  return frame(t, uid, `<circle cx="820" cy="90" r="150" fill="${t.soft}" opacity=".22"/>${axis}${bars.join("")}`);
}

const MOTIFS = { editorial, figure, ledger };

export function coverSvg(slug, kind, { className = "", label = "" } = {}) {
  const seed = hash(slug);
  const t = THEMES[seed % THEMES.length];
  const r = rng(seed);
  const uid = seed.toString(36);
  const body = infographicBody(slug, t, uid) ?? (MOTIFS[kind] || editorial)(t, uid, r);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" preserveAspectRatio="xMidYMid slice" class="${className}" role="img" aria-label="${label.replace(/"/g, "&quot;")}">${body}</svg>`;
}

export function themeFor(slug) {
  return THEMES[hash(slug) % THEMES.length];
}
