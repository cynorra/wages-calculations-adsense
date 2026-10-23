import type { APIRoute } from "astro";
import { SITE } from "../site.config.js";

export const GET: APIRoute = () =>
  new Response(SITE.indexNowKey, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
