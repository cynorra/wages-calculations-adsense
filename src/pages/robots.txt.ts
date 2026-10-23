import type { APIRoute } from "astro";
import { SITE } from "../site.config.js";

const BOTS = [
  // Arama Motorları
  "Googlebot", "Googlebot-Image", "Bingbot", "Applebot", "DuckDuckBot", "YandexBot", "Baiduspider",
  // AdSense Taraması (AdSense onayı için hayati)
  "Mediapartners-Google", "AdsBot-Google",
  // Yapay Zeka Arama ve Yanıt Motorları (AEO / GEO)
  "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User",
  // Yapay Zeka Eğitim Botları
  "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"
];

export const GET: APIRoute = () => {
  const groups = BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n");
  const body = `# ${SITE.name}: open to all search engines and AI crawlers.\n\nUser-agent: *\nAllow: /\n\n${groups}\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
