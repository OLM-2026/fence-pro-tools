import { Router, type IRouter } from "express";
import { db, toolsTable, categoriesTable } from "@workspace/db";

const router: IRouter = Router();

const DB_TO_SEO: Record<string, string> = {
  "estimating-software": "/fence-estimating-software",
  "crm": "/fence-crm-software",
  "field-service": "/fence-field-service-software",
  "invoicing": "/fence-invoicing-software",
  "scheduling": "/fence-scheduling-software",
  "project-management": "/fence-project-management-software",
  "marketing": "/fence-marketing-software",
  "accounting": "/fence-accounting-software",
  "branded-materials-swag": "/fence-branded-materials",
};

function getBaseUrl(): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const first = domains.split(",")[0].trim();
    return `https://${first}`;
  }
  return "https://fenceprotools.com";
}

function urlEntry(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
}

router.get("/sitemap.xml", async (_req, res): Promise<void> => {
  const base = getBaseUrl();
  const today = new Date().toISOString().split("T")[0];

  const tools = await db.select({ slug: toolsTable.slug, createdAt: toolsTable.createdAt }).from(toolsTable);

  const staticPages = [
    urlEntry(`${base}/`, "1.0", "weekly", today),
    urlEntry(`${base}/compare`, "0.8", "weekly", today),
    urlEntry(`${base}/category/all`, "0.8", "weekly", today),
    urlEntry(`${base}/about`, "0.5", "monthly", today),
    urlEntry(`${base}/resources`, "0.6", "weekly", today),
  ];

  const categoryPages = Object.values(DB_TO_SEO).map(path =>
    urlEntry(`${base}${path}`, "0.9", "weekly", today)
  );

  const toolPages = tools.map(t => {
    const lastmod = t.createdAt instanceof Date
      ? t.createdAt.toISOString().split("T")[0]
      : today;
    return urlEntry(`${base}/tool/${t.slug}`, "0.8", "monthly", lastmod);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...categoryPages, ...toolPages].join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/robots.txt", (_req, res): void => {
  const base = getBaseUrl();
  const txt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml`;
  res.setHeader("Content-Type", "text/plain");
  res.send(txt);
});

export default router;
