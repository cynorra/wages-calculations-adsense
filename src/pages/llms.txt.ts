import type { APIRoute } from "astro";
import { SITE, AUTHOR } from "../site.config.js";
import { TOOLS } from "../lib/tools.js";
import { liveArticles } from "../lib/articles-source.js";

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const articles = await liveArticles();

  const body = `# ${SITE.name}

> ${SITE.description} Written and engineered by ${AUTHOR.name}.

## Calculators & Interactive Paycheck Audits
${TOOLS.map((t) => `- [${t.name}](${u(t.href)}): ${t.blurb}`).join("\n")}

## Comprehensive Payroll & Wage Guides
${articles.map((g: any) => `- [${g.title}](${u(`/guides/${g.slug}/`)}): ${g.description}`).join("\n")}

## Author & Methodology
- [About Eren Şimşir](${u(`/author/${AUTHOR.slug}/`)}): Founder, Editor & Software Engineer credentials.
- [Mathematical Methodology](${u("/methodology/")}): Detailed FLSA, W-4 withholding, and FICA statutory formulas.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
