import fs from "node:fs";
import path from "node:path";
import { localRows } from "./articles-source.js";

export function findCoverPhoto(slug) {
  try {
    const exts = [".webp", ".jpg", ".png", ".jpeg"];
    const baseDir = path.join(process.cwd(), "public", "images", "guides");
    for (const ext of exts) {
      const filename = `${slug}${ext}`;
      if (fs.existsSync(path.join(baseDir, filename))) {
        return `/images/guides/${filename}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

// Cache article metadata for instantaneous lookup
let rowCache = null;
function getRowMap() {
  if (!rowCache) {
    try {
      const rows = localRows();
      rowCache = new Map(rows.map((r) => [r.slug, r]));
    } catch {
      rowCache = new Map();
    }
  }
  return rowCache;
}

const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function wrapText(text, maxChars, maxLines) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = candidate;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  const allWords = words.join(" ");
  const printedWords = lines.join(" ");
  if (allWords.length > printedWords.length && lines.length > 0) {
    const lastIdx = lines.length - 1;
    const last = lines[lastIdx];
    if (last.length + 1 <= maxChars) {
      lines[lastIdx] = last + "…";
    } else {
      lines[lastIdx] = last.replace(/\s+[^ ]*$/, "") + "…";
    }
  }

  return lines;
}

function classifyTopic(slug) {
  const s = slug.toLowerCase();
  if (/(?:overtime|flsa|hour|night|shift|differential|call-in|travel-time|on-call|hazard|double-time)/.test(s)) {
    return {
      category: "OVERTIME & FLSA STANDARDS",
      badge: "29 C.F.R. PART 778",
      accent: "#e5a952", // Warm Gold
      accentSoft: "rgba(229, 169, 82, 0.15)",
      visual: "gauge",
    };
  }
  if (/(?:tax|net|gross|fringe|severance|deduction|per-diem|withholding|supplemental|take-home)/.test(s)) {
    return {
      category: "TAXATION & PAYCHECK WITHHOLDING",
      badge: "IRS PUBLICATION 15-T",
      accent: "#48b182", // Emerald Green
      accentSoft: "rgba(72, 177, 130, 0.15)",
      visual: "waterfall",
    };
  }
  if (/(?:salary|year|how-much|hourly-to|biweekly|rate|conversion|raise|annual|matrix)/.test(s)) {
    return {
      category: "WAGE CONVERSION & EARNINGS",
      badge: "2,080-HOUR BASELINE",
      accent: "#38bdf8", // Sky Blue
      accentSoft: "rgba(56, 189, 248, 0.15)",
      visual: "conversion",
    };
  }
  return {
    category: "LABOR STATUTE & COMPLIANCE",
    badge: "STATUTORY FORENSICS",
    accent: "#f59e0b", // Amber
    accentSoft: "rgba(245, 158, 11, 0.15)",
    visual: "compliance",
  };
}

function drawGaugeVisual(accent) {
  return `
    <!-- Right Panel Card: Overtime Threshold Meter -->
    <g transform="translate(632, 72)">
      <rect width="272" height="256" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-width="1.5"/>
      <text x="136" y="34" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#9ab3a6" letter-spacing="1.5">STATUTORY OVERTIME GAUGE</text>
      
      <!-- Outer Dial Arc -->
      <circle cx="136" cy="140" r="74" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12" stroke-linecap="round"/>
      <path d="M 76 178 A 74 74 0 1 1 196 178" fill="none" stroke="${accent}" stroke-width="12" stroke-dasharray="190 280" stroke-linecap="round"/>
      
      <!-- Center Display -->
      <text x="136" y="132" text-anchor="middle" font-family="'Inter', sans-serif" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="-1">1.5×</text>
      <text x="136" y="154" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${accent}">TIME-AND-A-HALF</text>
      <text x="136" y="174" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" fill="#718a7e">THRESHOLD: &gt; 40.0 HRS</text>

      <!-- Bottom Benchmark Indicators -->
      <rect x="20" y="210" width="110" height="24" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <text x="75" y="226" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" fill="#ffffff">BASE: 1.0×</text>
      <rect x="142" y="210" width="110" height="24" rx="6" fill="rgba(229,169,82,0.12)" stroke="${accent}" stroke-opacity="0.4"/>
      <text x="197" y="226" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${accent}">DOUBLE: 2.0×</text>
    </g>
  `;
}

function drawWaterfallVisual(accent) {
  return `
    <!-- Right Panel Card: Waterfall Net Pay Reduction -->
    <g transform="translate(632, 72)">
      <rect width="272" height="256" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-width="1.5"/>
      <text x="136" y="34" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#9ab3a6" letter-spacing="1.5">PAYCHECK WATERFALL</text>

      <!-- Step 1: Gross Pay -->
      <rect x="20" y="58" width="58" height="135" rx="6" fill="#38bdf8" opacity="0.85"/>
      <text x="49" y="210" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" fill="#9ab3a6">GROSS</text>
      <text x="49" y="125" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" transform="rotate(-90 49 125)">100%</text>

      <!-- Step 2: FICA Deduction (7.65%) -->
      <line x1="78" y1="58" x2="94" y2="58" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
      <rect x="94" y="58" width="34" height="28" rx="5" fill="#f87171" opacity="0.8"/>
      <text x="111" y="210" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" fill="#f87171">-7.65%</text>
      <text x="111" y="222" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" fill="#718a7e">FICA</text>

      <!-- Step 3: Federal FIT (15-22%) -->
      <line x1="128" y1="86" x2="142" y2="86" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
      <rect x="142" y="86" width="38" height="42" rx="5" fill="#fb923c" opacity="0.8"/>
      <text x="161" y="210" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" fill="#fb923c">-18%</text>
      <text x="161" y="222" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" fill="#718a7e">FIT</text>

      <!-- Step 4: Net Pay Remaining -->
      <line x1="180" y1="128" x2="196" y2="128" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
      <rect x="196" y="128" width="56" height="65" rx="6" fill="${accent}"/>
      <text x="224" y="210" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${accent}">NET</text>
      <text x="224" y="222" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" fill="#718a7e">TAKE-HOME</text>
      <text x="224" y="165" text-anchor="middle" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff">~74%</text>
    </g>
  `;
}

function drawConversionVisual(accent) {
  return `
    <!-- Right Panel Card: Wage Matrix Conversion -->
    <g transform="translate(632, 72)">
      <rect width="272" height="256" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-width="1.5"/>
      <text x="136" y="34" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#9ab3a6" letter-spacing="1.5">ANNUAL DILUTION MATRIX</text>
      
      <!-- Split Cards -->
      <rect x="20" y="56" width="232" height="64" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <text x="36" y="80" font-family="'JetBrains Mono', monospace" font-size="10" fill="#9ab3a6">STANDARD FULL-TIME</text>
      <text x="36" y="106" font-family="'Inter', sans-serif" font-size="22" font-weight="800" fill="#ffffff">2,080 <tspan font-size="12" font-weight="500" fill="#718a7e">HRS / YR</tspan></text>
      
      <!-- Exchange Icon -->
      <circle cx="216" cy="88" r="16" fill="${accent}" fill-opacity="0.15"/>
      <text x="216" y="93" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="${accent}">⇄</text>

      <rect x="20" y="132" width="232" height="64" rx="10" fill="rgba(255,255,255,0.04)" stroke="${accent}" stroke-opacity="0.3"/>
      <text x="36" y="156" font-family="'JetBrains Mono', monospace" font-size="10" fill="${accent}">BIWEEKLY (26 PAY PERIODS)</text>
      <text x="36" y="182" font-family="'Inter', sans-serif" font-size="22" font-weight="800" fill="#ffffff">80.0 <tspan font-size="12" font-weight="500" fill="#718a7e">HRS / CHECK</tspan></text>

      <!-- Bottom Formula Tag -->
      <text x="136" y="230" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#9ab3a6">HOURLY = ANNUAL / 2,080</text>
    </g>
  `;
}

function drawComplianceVisual(accent) {
  return `
    <!-- Right Panel Card: Statutory Audit Seal & Checklist -->
    <g transform="translate(632, 72)">
      <rect width="272" height="256" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-width="1.5"/>
      <text x="136" y="34" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#9ab3a6" letter-spacing="1.5">FORENSIC AUDIT CHECK</text>

      <!-- 4 Verification Rows -->
      <g transform="translate(20, 56)">
        <!-- Row 1 -->
        <rect x="0" y="0" width="232" height="36" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
        <circle cx="18" cy="18" r="8" fill="${accent}" fill-opacity="0.2"/>
        <text x="18" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="${accent}">✓</text>
        <text x="36" y="22" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#ffffff">Salary Basis &amp; Level Test</text>
        
        <!-- Row 2 -->
        <rect x="0" y="44" width="232" height="36" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
        <circle cx="18" cy="18" r="8" fill="${accent}" fill-opacity="0.2"/>
        <text x="18" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="${accent}">✓</text>
        <text x="36" y="22" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#ffffff">Duties Test Classification</text>
        
        <!-- Row 3 -->
        <rect x="0" y="88" width="232" height="36" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
        <circle cx="18" cy="18" r="8" fill="${accent}" fill-opacity="0.2"/>
        <text x="18" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="${accent}">✓</text>
        <text x="36" y="22" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#ffffff">Regular Rate Composition</text>

        <!-- Row 4 -->
        <rect x="0" y="132" width="232" height="36" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
        <circle cx="18" cy="18" r="8" fill="${accent}" fill-opacity="0.2"/>
        <text x="18" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="${accent}">✓</text>
        <text x="36" y="22" font-family="'Inter', sans-serif" font-size="11.5" font-weight="600" fill="#ffffff">Record Retention Timelines</text>
      </g>
    </g>
  `;
}

export function coverSvg(slug, kind, { className = "", label = "", title: passedTitle, description: passedDesc } = {}) {
  const rowMap = getRowMap();
  const row = rowMap.get(slug) || {};
  
  const title = passedTitle || row.title || slug.replace(/-/g, " ");
  const description = passedDesc || row.description || row.key_takeaway || "";
  const topic = classifyTopic(slug);

  // If a real photograph exists in public/images/guides/[slug], render clean photographic cover
  const photoUrl = findCoverPhoto(slug);
  if (photoUrl) {
    return `<div class="relative w-full h-full overflow-hidden bg-slate-950 group ${className}" role="img" aria-label="${esc(label || title)}">
      <img src="${photoUrl}" alt="${esc(label || title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="eager" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute top-4 left-4">
        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-slate-950/80 border border-amber-400/30 backdrop-blur-md shadow-sm">${esc(topic.category)}</span>
      </div>
    </div>`;
  }

  const badgeWidth = Math.round(topic.category.length * 7.8 + 24);
  const isLongTitle = title.length > 46;
  const titleFontSize = isLongTitle ? 26 : 30;
  const titleLineHeight = isLongTitle ? 36 : 40;
  const titleMaxChars = isLongTitle ? 26 : 22;

  const headlineLines = wrapText(title, titleMaxChars, 3);
  const descLines = wrapText(description, 46, 2);

  // Generate unique seed for subtle gradient angle or ambient glow
  const uid = Math.abs(slug.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)).toString(36);

  let visualSvg = "";
  if (topic.visual === "gauge") visualSvg = drawGaugeVisual(topic.accent);
  else if (topic.visual === "waterfall") visualSvg = drawWaterfallVisual(topic.accent);
  else if (topic.visual === "conversion") visualSvg = drawConversionVisual(topic.accent);
  else visualSvg = drawComplianceVisual(topic.accent);

  const headlineSvg = headlineLines
    .map((line, idx) => {
      const yPos = 130 + idx * titleLineHeight;
      return `<text x="56" y="${yPos}" font-family="Georgia, 'Times New Roman', serif" font-size="${titleFontSize}" font-weight="700" fill="#ffffff" letter-spacing="-0.3">${esc(line)}</text>`;
    })
    .join("\n");

  const descStartY = 142 + headlineLines.length * titleLineHeight;
  const descSvg = descLines
    .map((line, idx) => {
      const yPos = descStartY + idx * 20;
      return `<text x="56" y="${yPos}" font-family="'Inter', -apple-system, sans-serif" font-size="13.5" fill="#9ab3a6" fill-opacity="0.9">${esc(line)}</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" preserveAspectRatio="xMidYMid slice" class="${className}" role="img" aria-label="${esc(label || title)}">
    <defs>
      <!-- Deep Emerald Executive Background Gradient -->
      <linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#091410"/>
        <stop offset="60%" stop-color="#11221b"/>
        <stop offset="100%" stop-color="#172b22"/>
      </linearGradient>

      <!-- Ambient Glow Behind Graphic -->
      <radialGradient id="glow-${uid}" cx="80%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${topic.accent}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0"/>
      </radialGradient>

      <!-- Grid Pattern -->
      <pattern id="grid-${uid}" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Base Canvas & Background Grid -->
    <rect width="960" height="420" fill="url(#bg-${uid})"/>
    <rect width="960" height="420" fill="url(#grid-${uid})"/>
    <rect width="960" height="420" fill="url(#glow-${uid})"/>

    <!-- Outer Perimeter Framing -->
    <rect x="20" y="20" width="920" height="380" rx="18" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>

    <!-- Left Header: Kicker and Statutory Reference Badge -->
    <g transform="translate(56, 58)">
      <rect x="0" y="0" width="${badgeWidth}" height="26" rx="6" fill="${topic.accentSoft}" stroke="${topic.accent}" stroke-opacity="0.35"/>
      <text x="12" y="17" font-family="'JetBrains Mono', Consolas, monospace" font-size="11" font-weight="800" fill="${topic.accent}" letter-spacing="1.5">${esc(topic.category)}</text>
      <text x="12" y="44" font-family="'JetBrains Mono', Consolas, monospace" font-size="11" font-weight="700" fill="#718a7e" letter-spacing="2">AUTHORITY: ${esc(topic.badge)}</text>
    </g>

    <!-- Main Editorial Headline (Georgia Serif) -->
    ${headlineSvg}

    <!-- Summary Dec / Key Takeaway Under Title -->
    ${descSvg}

    <!-- Right-Hand High-Precision Visualization -->
    ${visualSvg}

    <!-- Bottom Institutional Signature Ribbon -->
    <line x1="56" y1="362" x2="904" y2="362" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    
    <g transform="translate(56, 386)">
      <!-- Brand Seal -->
      <circle cx="8" cy="-4" r="5" fill="${topic.accent}"/>
      <text x="22" y="0" font-family="'Inter', sans-serif" font-size="11.5" font-weight="700" fill="#ffffff" letter-spacing="1.5">THE WAGE REPORT</text>
      <text x="156" y="0" font-family="'Inter', sans-serif" font-size="11" fill="#718a7e">| Independent Labor Economics &amp; Payroll Journal</text>
    </g>

    <text x="904" y="386" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" fill="${topic.accent}" letter-spacing="0.5">★ 2026 AUDITED STATUTORY STANDARD</text>
  </svg>`;
}

export function themeFor(slug) {
  const topic = classifyTopic(slug);
  return {
    bg1: "#091410",
    bg2: "#172b22",
    ink: "#ffffff",
    mid: topic.accent,
    soft: "#9ab3a6",
    accent: topic.accent,
  };
}
