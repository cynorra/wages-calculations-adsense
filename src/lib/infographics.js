// Cover infographics drawn from each article's own numbers.
// A guide listed in SPECS gets a chart of its real data; every other guide falls back to the
// generic motif in cover-art.js until a spec is written for it.

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f = (n) => Math.round(n * 10) / 10;

const SANS = "Inter, Arial, Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'JetBrains Mono', Consolas, monospace";

const KIND_COLOR = (t) => ({ a: t.mid, b: t.accent, c: t.soft, d: t.ink });

function frame(t, uid, kicker, headline, body, foot) {
  return `<defs><linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient></defs>
<rect width="960" height="420" fill="url(#bg-${uid})"/>
<text x="48" y="54" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2.5" fill="${t.mid}">${esc(kicker.toUpperCase())}</text>
<text x="48" y="94" font-family="${SERIF}" font-size="31" font-weight="700" fill="${t.ink}">${esc(headline)}</text>
${body}
<text x="48" y="402" font-family="${SANS}" font-size="12" fill="${t.ink}" fill-opacity=".55">${esc(foot)}</text>`;
}

// Horizontal bars, one per row, labelled with the real figure.
function ladder(t, uid, s) {
  const longest = Math.max(...s.rows.map((r) => r.label.length));
  const x0 = Math.max(300, 48 + longest * 7.6 + 18), maxW = Math.min(500, 800 - x0), top = 128, bottom = 376;
  const rowH = (bottom - top) / s.rows.length;
  const vals = s.rows.map((r) => r.value);
  const max = Math.max(...vals), min = Math.min(...vals);
  const width = (v) =>
    s.scale === "log" && max !== min
      ? 36 + (maxW - 36) * (Math.log(v / min) / Math.log(max / min))
      : 36 + (maxW - 36) * (v / max);
  const rows = s.rows
    .map((r, i) => {
      const y = top + i * rowH, h = Math.min(30, rowH - 12), w = width(r.value);
      const hot = s.highlightLast && i === s.rows.length - 1;
      return `<text x="48" y="${f(y + h / 2 + 5)}" font-family="${SANS}" font-size="15" fill="${t.ink}">${esc(r.label)}</text>
<rect x="${x0}" y="${f(y)}" width="${maxW}" height="${h}" rx="${h / 2}" fill="${t.soft}" opacity=".3"/>
<rect x="${x0}" y="${f(y)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${hot ? t.accent : t.mid}" opacity="${hot ? 1 : 0.9 - i * 0.04}"/>
<text x="${f(x0 + w + 12)}" y="${f(y + h / 2 + 6)}" font-family="${SERIF}" font-size="18" font-weight="700" fill="${t.ink}">${esc(r.text)}</text>`;
    })
    .join("");
  return rows;
}

// Daily timeline strips: where each rule starts paying 1.5x or 2x.
function strips(t, uid, s) {
  const x0 = 250, x1 = 900, top = 120, rowH = 40;
  const sx = (h) => x0 + ((x1 - x0) * h) / s.axisMax;
  const col = { reg: t.soft, ot15: t.mid, ot2: t.accent };
  const rows = s.rows
    .map((r, i) => {
      const y = top + i * rowH;
      const segs = r.segs
        .map(([a, b, k]) => `<rect x="${f(sx(a))}" y="${y}" width="${f(sx(b) - sx(a))}" height="26" fill="${col[k]}" ${a === 0 ? 'rx="13"' : ""} opacity="${k === "reg" ? 0.55 : 1}"/>`)
        .join("");
      const note = r.note ? `<text x="${x0 + 14}" y="${y + 19}" font-family="${SANS}" font-size="12" fill="${t.ink}" fill-opacity=".8">${esc(r.note)}</text>` : "";
      return `<text x="48" y="${y + 19}" font-family="${SANS}" font-size="15" fill="${t.ink}">${esc(r.label)}</text>${segs}${note}`;
    })
    .join("");
  const axisY = top + s.rows.length * rowH + 2;
  const ticks = s.ticks
    .map((h) => `<line x1="${f(sx(h))}" y1="${top - 6}" x2="${f(sx(h))}" y2="${axisY}" stroke="${t.ink}" stroke-opacity=".18" stroke-dasharray="3 4"/><text x="${f(sx(h))}" y="${axisY + 16}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${t.ink}" fill-opacity=".7">${h}h</text>`)
    .join("");
  const legend = s.legend
    .map((l, i) => `<rect x="${250 + i * 190}" y="${axisY + 30}" width="14" height="14" rx="3" fill="${col[l.kind]}" opacity="${l.kind === "reg" ? 0.55 : 1}"/><text x="${272 + i * 190}" y="${axisY + 42}" font-family="${SANS}" font-size="13" fill="${t.ink}">${esc(l.label)}</text>`)
    .join("");
  return ticks + rows + legend;
}

// Rising waterfall: a base figure plus each add-on up to the true total.
function buildup(t, uid, s) {
  const n = s.items.length, left = 56, right = 904, base = 330, top = 130;
  const slot = (right - left) / n, bw = Math.min(70, slot - 18);
  const total = s.items.reduce((a, i) => a + (i.kind === "total" ? 0 : i.value), 0);
  const sy = (v) => (v / total) * (base - top);
  let run = 0;
  const cols = s.items
    .map((it, i) => {
      const x = left + i * slot + (slot - bw) / 2;
      let y0, h, fill, label;
      if (it.kind === "total") { y0 = base - sy(total); h = sy(total); fill = t.ink; label = it.text; }
      else if (i === 0) { y0 = base - sy(it.value); h = sy(it.value); fill = t.mid; run = it.value; label = it.text; }
      else { y0 = base - sy(run + it.value); h = sy(it.value); fill = t.accent; run += it.value; label = it.text; }
      const words = it.label.split(" ");
      const lines = [];
      let cur = "";
      for (const w of words) { if ((cur + " " + w).trim().length > 11) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
      lines.push(cur);
      const lab = lines.slice(0, 3).map((l, k) => `<text x="${f(x + bw / 2)}" y="${base + 20 + k * 15}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="${t.ink}">${esc(l)}</text>`).join("");
      const conn = i > 0 && it.kind !== "total" ? `<line x1="${f(x - (slot - bw))}" y1="${f(y0 + h)}" x2="${f(x)}" y2="${f(y0 + h)}" stroke="${t.ink}" stroke-opacity=".3" stroke-dasharray="4 4"/>` : "";
      return `${conn}<rect x="${f(x)}" y="${f(y0)}" width="${bw}" height="${f(h)}" rx="6" fill="${fill}"/><text x="${f(x + bw / 2)}" y="${f(y0 - 8)}" text-anchor="middle" font-family="${SERIF}" font-size="16" font-weight="700" fill="${t.ink}">${esc(label)}</text>${lab}`;
    })
    .join("");
  return `<line x1="${left - 10}" y1="${base}" x2="${right + 6}" y2="${base}" stroke="${t.ink}" stroke-opacity=".35" stroke-width="2"/>${cols}`;
}

// Grouped vertical bars: "as often done" next to "as the law requires".
function pairs(t, uid, s) {
  const base = 318, top = 134, bw = 120, gap = 14;
  const max = Math.max(...s.groups.flatMap((g) => [g.a, g.b]));
  const sy = (v) => (v / max) * (base - top);
  const groupW = bw * 2 + gap, space = (864 - groupW * s.groups.length) / (s.groups.length + 1);
  const bars = s.groups
    .map((g, i) => {
      const gx = 48 + space * (i + 1) + groupW * i;
      const one = (x, v, txt, fill) => `<rect x="${f(x)}" y="${f(base - sy(v))}" width="${bw}" height="${f(sy(v))}" rx="8" fill="${fill}"/><text x="${f(x + bw / 2)}" y="${f(base - sy(v) - 10)}" text-anchor="middle" font-family="${SERIF}" font-size="22" font-weight="700" fill="${t.ink}">${esc(txt)}</text>`;
      return `${one(gx, g.a, g.aText, t.soft)}${one(gx + bw + gap, g.b, g.bText, t.accent)}<text x="${f(gx + groupW / 2)}" y="${base + 24}" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${t.ink}">${esc(g.label)}</text>`;
    })
    .join("");
  const legend = `<rect x="48" y="${base + 40}" width="14" height="14" rx="3" fill="${t.soft}"/><text x="70" y="${base + 52}" font-family="${SANS}" font-size="13" fill="${t.ink}">${esc(s.legend.a)}</text><rect x="${48 + 250}" y="${base + 40}" width="14" height="14" rx="3" fill="${t.accent}"/><text x="${70 + 250}" y="${base + 52}" font-family="${SANS}" font-size="13" fill="${t.ink}">${esc(s.legend.b)}</text>`;
  return `<line x1="48" y1="${base}" x2="912" y2="${base}" stroke="${t.ink}" stroke-opacity=".35" stroke-width="2"/>${bars}${legend}`;
}

// One or more stacked bars on a shared scale, with optional note cards underneath.
function stackrows(t, uid, s) {
  const x0 = 48, W = 864, K = KIND_COLOR(t);
  const sx = (v) => (v / s.max) * W;
  const rowTop = 136, rowGap = s.chips ? 78 : 118;
  const rows = s.rows
    .map((r, i) => {
      const y = rowTop + i * rowGap;
      let acc = 0;
      const segs = r.segs
        .map((g, k) => {
          const w = sx(g.v), x = x0 + sx(acc);
          acc += g.v;
          const last = k === r.segs.length - 1;
          const anchor = last && w < 150 ? "end" : "start";
          const lx = anchor === "end" ? x + w : x;
          const inside = w > 90 ? `<text x="${f(x + w / 2)}" y="${y + 36}" text-anchor="middle" font-family="${SERIF}" font-size="19" font-weight="700" fill="#fff">${esc(g.text)}</text>` : "";
          const outside = w <= 90 ? `<text x="${f(lx)}" y="${y - 8}" text-anchor="${anchor}" font-family="${SERIF}" font-size="16" font-weight="700" fill="${t.ink}">${esc(g.text)}</text>` : "";
          return `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="52" ${k === 0 ? 'rx="10"' : ""} fill="${K[g.kind]}" stroke="${t.bg1}" stroke-width="2"/>${inside}${outside}<text x="${f(lx)}" y="${y + 72}" text-anchor="${anchor}" font-family="${SANS}" font-size="12" fill="${t.ink}">${esc(g.label)}</text>`;
        })
        .join("");
      return `<text x="${x0}" y="${y - 12}" font-family="${SANS}" font-size="13" font-weight="700" fill="${t.mid}" letter-spacing="1">${esc(r.label.toUpperCase())}</text>${segs}`;
    })
    .join("");
  const chips = (s.chips || [])
    .map((c, i) => {
      const cw = (W - 32) / 3, x = x0 + i * (cw + 16), y = 268;
      const lines = c.lines.map((l, k) => `<text x="${f(x + 16)}" y="${y + 50 + k * 16}" font-family="${SANS}" font-size="12.5" fill="${t.ink}" fill-opacity=".85">${esc(l)}</text>`).join("");
      return `<rect x="${f(x)}" y="${y}" width="${f(cw)}" height="100" rx="13" fill="#fff" fill-opacity=".7" stroke="${t.soft}"/><text x="${f(x + 16)}" y="${y + 28}" font-family="${SERIF}" font-size="16" font-weight="700" fill="${t.ink}">${esc(c.title)}</text>${lines}`;
    })
    .join("");
  return rows + chips;
}

const R = { ladder, strips, buildup, pairs, stackrows };

const SPECS = {
  "50000-a-year-how-much-an-hour": {
    type: "ladder", kicker: "Pay conversion", headline: "$50,000 a year, in every pay period",
    foot: "Based on 2,080 paid hours per year. Bar length is on a log scale.",
    scale: "log", highlightLast: true,
    rows: [
      { label: "Annual", value: 50000, text: "$50,000" },
      { label: "Monthly", value: 4166.67, text: "$4,166.67" },
      { label: "Semimonthly", value: 2083.33, text: "$2,083.33" },
      { label: "Biweekly", value: 1923.08, text: "$1,923.08" },
      { label: "Weekly", value: 961.54, text: "$961.54" },
      { label: "Daily (8 hours)", value: 192.31, text: "$192.31" },
      { label: "Hourly", value: 24.04, text: "$24.04" },
    ],
  },
  "gross-vs-net-pay-payroll-deductions": {
    type: "stackrows", kicker: "Pre-tax deductions", headline: "A $500 deferral costs $365 of take-home",
    foot: "Example uses a 22% federal and 5% state marginal rate, as in the article.",
    max: 500,
    rows: [
      { label: "Pre-tax 401(k) deferral", segs: [
        { v: 365, kind: "a", text: "$365", label: "Drop in take-home pay" },
        { v: 110, kind: "b", text: "$110", label: "Federal tax saved" },
        { v: 25, kind: "c", text: "$25", label: "State tax saved" },
      ] },
      { label: "The same $500 saved after tax", segs: [
        { v: 500, kind: "d", text: "$500", label: "Drop in take-home pay" },
      ] },
    ],
  },
  "flsa-overtime-time-and-a-half-rules": {
    type: "strips", kicker: "Overtime thresholds", headline: "When 1.5x and 2x pay begin, by jurisdiction",
    foot: "Hours in a single workday. The 40-hour weekly rule also applies in every jurisdiction shown.",
    axisMax: 14, ticks: [0, 4, 8, 12],
    legend: [{ kind: "reg", label: "Regular rate" }, { kind: "ot15", label: "1.5x rate" }, { kind: "ot2", label: "2x rate" }],
    rows: [
      { label: "Federal (FLSA)", segs: [[0, 14, "reg"]], note: "no daily rule; overtime after 40 hours a week" },
      { label: "California", segs: [[0, 8, "reg"], [8, 12, "ot15"], [12, 14, "ot2"]] },
      { label: "Colorado", segs: [[0, 12, "reg"], [12, 14, "ot15"]] },
      { label: "Alaska", segs: [[0, 8, "reg"], [8, 14, "ot15"]] },
      { label: "Nevada", segs: [[0, 8, "reg"], [8, 14, "ot15"]], note: "" },
    ],
  },
  "flsa-regular-rate-of-pay-bonuses": {
    type: "pairs", kicker: "Regular rate of pay", headline: "A $100 bonus lifts the rate from $20 to $22",
    foot: "A worker earning $20.00 an hour for 50 hours, plus a $100 nondiscretionary bonus.",
    legend: { a: "Bonus ignored (underpays)", b: "Bonus included (FLSA method)" },
    groups: [
      { label: "Regular rate", a: 20, b: 22, aText: "$20.00", bText: "$22.00" },
      { label: "Overtime rate (1.5x)", a: 30, b: 33, aText: "$30.00", bText: "$33.00" },
    ],
  },
  "tipped-minimum-wage-tip-credit-audit": {
    type: "stackrows", kicker: "Tip credit", headline: "Federal tipped wage: $2.13 cash plus $5.12 credit",
    foot: "If cash wage plus tips falls below $7.25 an hour, the employer must pay the shortfall.",
    max: 7.25,
    rows: [
      { label: "Federal minimum wage, $7.25 an hour", segs: [
        { v: 2.13, kind: "a", text: "$2.13", label: "Direct cash wage" },
        { v: 5.12, kind: "b", text: "$5.12", label: "Maximum tip credit" },
      ] },
    ],
    chips: [
      { title: "No tip credit", lines: ["CA, WA, OR, NV, MT, AK, MN", "pay the full state minimum", "wage in cash."] },
      { title: "Higher cash wage", lines: ["NY, FL, IL, MA, CO, AZ", "require a cash wage above", "the federal $2.13."] },
      { title: "Federal floor", lines: ["TX, GA, AL, TN, LA, IN, UT", "follow the federal $2.13", "cash wage."] },
    ],
  },
  "salary-exempt-vs-non-exempt-flsa-test": {
    type: "ladder", kicker: "Salary thresholds", headline: "Federal salary tests for overtime exemption",
    foot: "Annualized at 2,080 hours. Salary level is one of three tests; salary basis and duties also apply.",
    scale: "linear", highlightLast: false,
    rows: [
      { label: "Standard white-collar ($684 a week)", value: 35568, text: "$35,568" },
      { label: "Computer professional ($27.63 an hour)", value: 57470.4, text: "$57,470" },
      { label: "Highly compensated employee", value: 107432, text: "$107,432" },
    ],
  },
  "1099-contractor-vs-w2-hourly-rate-equivalence": {
    type: "buildup", kicker: "1099 vs W-2", headline: "A $40 W-2 job is worth $54.23 an hour",
    foot: "Based on 2,080 hours. The article's 1099 break-even billing rate is $55.20 an hour.",
    items: [
      { label: "W-2 hourly rate", value: 40, text: "$40.00" },
      { label: "Employer FICA", value: 3.06, text: "+3.06" },
      { label: "Health insurance", value: 3.46, text: "+3.46" },
      { label: "Paid time off", value: 3.85, text: "+3.85" },
      { label: "401(k) match", value: 1.6, text: "+1.60" },
      { label: "Disability and workers comp", value: 0.58, text: "+0.58" },
      { label: "Overhead", value: 1.68, text: "+1.68" },
      { label: "True W-2 value", kind: "total", text: "$54.23" },
    ],
  },
};

export function hasInfographic(slug) {
  return Boolean(SPECS[slug]);
}

export function infographicBody(slug, t, uid) {
  const s = SPECS[slug];
  if (!s) return null;
  return frame(t, uid, s.kicker, s.headline, R[s.type](t, uid, s), s.foot);
}
