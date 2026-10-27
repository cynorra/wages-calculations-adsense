import sharp from "sharp";
import { liveArticles } from "../../lib/articles-source.js";
import { articleKind, KIND_LABEL } from "../../lib/article-kind.js";
import { coverSvg, themeFor } from "../../lib/cover-art.js";

export async function getStaticPaths() {
  const articles = await liveArticles();
  return articles.map((article: any) => ({ params: { slug: article.slug }, props: { article } }));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text: string, max: number, lines: number) {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > max) {
      out.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) out.push(line);
  return out.slice(0, lines).map((l, i, a) => (i === a.length - 1 && out.length > lines ? l + "…" : l));
}

export async function GET({ props }: { props: { article: any } }) {
  const { article } = props;
  const kind = articleKind(article.slug);
  const t = themeFor(article.slug);
  const art = coverSvg(article.slug, kind);
  const lines = wrap(article.title, 38, 3);
  const text = lines
    .map((l, i) => `<text x="64" y="${452 + i * 56}" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="46" fill="${t.ink}">${esc(l)}</text>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<svg x="0" y="0" width="1200" height="525" viewBox="0 0 960 420" preserveAspectRatio="xMidYMid slice">${art.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</svg>
<rect y="350" width="1200" height="280" fill="#ffffff"/>
<text x="64" y="396" font-family="Arial, sans-serif" font-weight="700" font-size="20" letter-spacing="4" fill="${t.mid}">${esc(KIND_LABEL[kind].toUpperCase())}</text>
${text}
<text x="64" y="610" font-family="Arial, sans-serif" font-size="22" fill="${t.ink}" fill-opacity=".7">TheWageReport</text>
</svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
