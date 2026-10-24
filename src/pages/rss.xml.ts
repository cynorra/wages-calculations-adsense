import type { APIRoute } from "astro";
import { SITE, AUTHOR } from "../site.config.js";
import { localLiveArticles } from "../lib/articles-source.js";

export const GET: APIRoute = async () => {
  const articles = localLiveArticles();

  const itemsXml = articles
    .map((a: any) => {
      const link = `${SITE.url}/guides/${a.slug}/`;
      const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : new Date().toUTCString();
      return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${a.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${SITE.email} (${AUTHOR.name})</author>
      <category>${a.tool || "Payroll"}</category>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name}</title>
    <link>${SITE.url}</link>
    <description>${SITE.description}</description>
    <language>${SITE.language || "en-US"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
