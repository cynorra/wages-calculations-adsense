import { SITE, AUTHOR } from "../site.config.js";

const abs = (path) => new URL(path, SITE.url).href;

export const personRef = { "@id": `${SITE.url}/author/${AUTHOR.slug}/#person` };
export const orgRef = { "@id": `${SITE.url}/#organization` };

// 1. Breadcrumbs
export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

// 2. Technical Article Schema
export function articleSchema({ title, description, path, published, updated }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    datePublished: published ? new Date(published).toISOString().slice(0, 10) : undefined,
    dateModified: updated ? new Date(updated).toISOString().slice(0, 10) : published ? new Date(published).toISOString().slice(0, 10) : undefined,
    author: personRef,
    publisher: orgRef,
    inLanguage: SITE.language,
  };
}

// 3. Web Application / Calculator Schema
export function calculatorSchema({ name, description, path, updated }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: abs(path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (browser-based)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: personRef,
    publisher: orgRef,
    dateModified: updated || new Date().toISOString().slice(0, 10),
  };
}

// 4. FAQ Schema
export function faqSchema(items) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
