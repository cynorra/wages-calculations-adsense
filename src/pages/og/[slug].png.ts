import sharp from "sharp";
import { liveArticles } from "../../lib/articles-source.js";
import { articleKind } from "../../lib/article-kind.js";
import { coverSvg } from "../../lib/cover-art.js";

export async function getStaticPaths() {
  const articles = await liveArticles();
  return articles.map((article: any) => ({ params: { slug: article.slug }, props: { article } }));
}

export async function GET({ props }: { props: { article: any } }) {
  const { article } = props;
  const kind = articleKind(article.slug);
  const art = coverSvg(article.slug, kind);
  const inner = art.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#091410"/>
  <svg x="0" y="0" width="1200" height="525" viewBox="0 0 960 420" preserveAspectRatio="xMidYMid meet">
    ${inner}
  </svg>
  <rect y="525" width="1200" height="105" fill="#0d1b15"/>
  <line x1="0" y1="525" x2="1200" y2="525" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <circle cx="64" cy="578" r="6" fill="#38bdf8"/>
  <text x="84" y="583" font-family="'Inter', Arial, sans-serif" font-weight="700" font-size="20" fill="#ffffff" letter-spacing="2">THE WAGE REPORT</text>
  <text x="340" y="583" font-family="'Inter', Arial, sans-serif" font-size="16" fill="#718a7e">| Independent Labor Economics &amp; Payroll Journal</text>
  <text x="1136" y="583" text-anchor="end" font-family="'JetBrains Mono', Consolas, monospace" font-size="15" font-weight="700" fill="#e5a952" letter-spacing="1">thewagereport.com</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
