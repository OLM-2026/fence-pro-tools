import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryContent } from "@/components/CategoryContent";
import { getCategories, getTools } from "@/lib/api";
import { DB_TO_SEO, categoryUrl } from "@/lib/seo-slugs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const name = category?.name ?? slug.replace(/-/g, " ");

  return {
    title: `Best ${name} for Fence Contractors`,
    description:
      category?.description ??
      `Independent reviews of the best ${name} for fencing contractors.`,
    alternates: {
      canonical: DB_TO_SEO[slug] ?? `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Redirect to SEO URL if one exists
  if (DB_TO_SEO[slug]) {
    redirect(DB_TO_SEO[slug]);
  }

  const [allTools, categories] = await Promise.all([getTools(), getCategories()]);

  const isAll = slug === "all";
  const tools = isAll ? allTools : allTools.filter((t) => t.category === slug);
  const category = isAll ? null : (categories.find((c) => c.slug === slug) ?? null);
  const title = isAll
    ? "All Software Tools for Fence Contractors"
    : category?.name
    ? `Best ${category.name} for Fence Contractors`
    : `${slug.replace(/-/g, " ")} Tools`;

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 border-b py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {isAll ? "All Tools" : category?.name ?? slug}
            </span>
          </nav>
        </div>
      </div>

      <div className="bg-[#0d1f3c] text-white py-14">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to directory
          </Link>
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} reviewed
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            {title}
          </h1>
          {category?.description && (
            <p className="text-white/60 max-w-2xl text-lg font-medium leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <CategoryContent tools={tools} category={category} title={title} />
    </div>
  );
}
