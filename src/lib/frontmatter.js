export function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: raw };

  const yamlStr = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();
  const data = {};

  for (const line of yamlStr.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();

    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val === "true") {
      val = true;
    } else if (val === "false") {
      val = false;
    }
    data[key] = val;
  }

  return { data, content };
}

export function guideRow(filename, raw) {
  const { data, content } = parseFrontmatter(raw);
  const slug = filename.replace(/\.md$/, "");
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    body_md: content,
    tool: data.tool || "wage",
    status: data.draft ? "draft" : (data.status || "published"),
    published_at: data.published_at || (data.published ? `${data.published}T12:00:00Z` : new Date().toISOString()),
    content_updated_at: data.updated_at || (data.updated ? `${data.updated}T12:00:00Z` : undefined),
    author_slug: data.author_slug || "eren-simsir",
  };
}
