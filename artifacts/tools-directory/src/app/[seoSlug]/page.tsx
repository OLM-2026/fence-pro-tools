import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryContent } from "@/components/CategoryContent";
import { SEO_TO_DB, SEO_H1, DB_TO_SEO, RELATED_CATEGORIES } from "@/lib/seo-slugs";
import { getCategories, getTools } from "@/lib/api";
import { categoryUrl } from "@/lib/seo-slugs";

interface PageProps {
  params: Promise<{ seoSlug: string }>;
}

const SEO_DESCRIPTIONS: Record<string, string> = {
  "estimating-software":
    "Compare the best fence estimating software tools. Reviewed for accuracy, ease of use on job sites, and integration with invoicing. Independent and updated for 2025.",
  "crm":
    "The best CRM software for fence contractors. Track leads, follow up automatically, and close more jobs. Independent reviews, no paid placements.",
  "field-service":
    "Top field service software for fence companies. Schedule crews, dispatch jobs, and manage customers from any device. Compare top picks for 2025.",
  "invoicing":
    "Best invoicing software for fence contractors. Send professional invoices, collect payments faster, and integrate with QuickBooks. Reviewed for fencing businesses.",
  "scheduling":
    "Best scheduling software for fence companies. Manage crew schedules, customer appointments, and job sequences. Independent reviews for 2025.",
  "project-management":
    "Best project management software for fence contractors. Track jobs, manage subcontractors, and keep clients updated. Reviews for fencing businesses.",
  "marketing":
    "Top marketing tools for fence contractors. Get more reviews, run local ads, and grow your fence business. Compared independently for 2025.",
  "accounting":
    "Best accounting software for fence companies. Track expenses, manage payroll, and prepare for tax season. Independent reviews for fencing contractors.",
  "branded-materials-swag":
    "Best branded materials and uniforms for fence contractors. Yard signs, crew polos, door hangers, and promo items reviewed for fence companies.",
};

export async function generateStaticParams() {
  return Object.keys(SEO_TO_DB).map((seoSlug) => ({ seoSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const dbSlug = SEO_TO_DB[seoSlug];
  if (!dbSlug) return { title: "Not Found" };

  const h1 = SEO_H1[dbSlug] ?? `Best Software for Fence Contractors – ${seoSlug.replace(/-/g, " ")}`;
  const description = SEO_DESCRIPTIONS[dbSlug] ?? `Independent reviews of the best ${seoSlug.replace(/-/g, " ")} for fencing contractors. Updated ${new Date().getFullYear()}.`;
  const canonicalUrl = DB_TO_SEO[dbSlug] ?? `/category/${dbSlug}`;

  return {
    title: h1,
    description,
    openGraph: {
      title: h1,
      description,
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function SeoSlugPage({ params }: PageProps) {
  const { seoSlug } = await params;
  const dbSlug = SEO_TO_DB[seoSlug];

  if (!dbSlug) notFound();

  const [allTools, categories] = await Promise.all([getTools(), getCategories()]);

  const tools = allTools.filter((t) => t.category === dbSlug);
  const category = categories.find((c) => c.slug === dbSlug) ?? null;
  const h1 = SEO_H1[dbSlug] ?? `Best ${seoSlug.replace(/-/g, " ")} for Fence Contractors`;

  const relatedCatSlugs = RELATED_CATEGORIES[dbSlug] ?? [];
  const relatedCategories = categories.filter((c) => relatedCatSlugs.includes(c.slug));

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">
              {category?.name ?? seoSlug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#0d1f3c] text-white py-14">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to directory
          </Link>
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            {tools.length} tools reviewed
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            {h1}
          </h1>
          {category?.description && (
            <p className="text-white/60 max-w-2xl text-lg font-medium leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Tool list (client component for filters/sort) */}
      <CategoryContent tools={tools} category={category} title={h1} />

      {/* Related categories */}
      {relatedCategories.length > 0 && (
        <section className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
              Explore more
            </p>
            <h2
              className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Related software categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={categoryUrl(cat.slug)}
                  className="px-5 py-3 border-2 rounded-sm font-semibold text-sm hover:border-[#f5a623] hover:text-[#f5a623] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
