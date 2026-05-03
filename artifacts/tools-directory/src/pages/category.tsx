import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, Filter, Hammer, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListTools, useGetCategoryBySlug, useListCategories, getGetCategoryBySlugQueryKey } from "@workspace/api-client-react";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { useDebounce } from "@/hooks/use-debounce";
import { SEO_TO_DB, RELATED_CATEGORIES, SEO_H1, categoryUrl, DB_TO_SEO } from "@/lib/seo-slugs";

const CATEGORY_ICONS: Record<string, string> = {
  "estimating-software": "📐",
  "crm": "📋",
  "field-service": "⚙️",
  "invoicing": "💳",
  "scheduling": "📅",
  "project-management": "📌",
  "marketing": "📣",
  "accounting": "📊",
  "branded-materials-swag": "👕",
};

export default function Category() {
  const params = useParams<{ slug?: string }>();
  const [location] = useLocation();

  // Derive the DB slug from either /category/:slug or /fence-crm-software style URLs
  const pathSegment = location.replace(/^\//, "").split("?")[0];
  const dbSlug: string = params.slug ?? SEO_TO_DB[pathSegment] ?? pathSegment;
  const isAll = dbSlug === "all";

  // Canonical URL: prefer SEO URL over /category/:slug
  const canonicalPath = isAll ? "/category/all" : (DB_TO_SEO[dbSlug] ?? `/category/${dbSlug}`);

  const queryParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const initialSearch = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [freeTrial, setFreeTrial] = useState(false);
  const [mobileApp, setMobileApp] = useState(false);
  const [bestFor, setBestFor] = useState<string>("");

  const { data: category, isLoading: isLoadingCategory } = useGetCategoryBySlug(dbSlug, {
    query: { enabled: !isAll && !!dbSlug, queryKey: getGetCategoryBySlugQueryKey(dbSlug) },
  });

  const { data: categories } = useListCategories();

  const { data: tools, isLoading: isLoadingTools } = useListTools({
    category: isAll ? undefined : dbSlug,
    search: debouncedSearch || undefined,
    freeTrial: freeTrial ? true : undefined,
    mobileApp: mobileApp ? true : undefined,
    bestFor: bestFor !== "all" && bestFor !== "" ? bestFor : undefined,
  });

  // Related categories for internal linking
  const relatedSlugs: string[] = (!isAll && RELATED_CATEGORIES[dbSlug]) ? RELATED_CATEGORIES[dbSlug] : [];
  const relatedCategories = categories?.filter((c) => relatedSlugs.includes(c.slug)) ?? [];

  // SEO copy
  const seoH1 = isAll
    ? "All Fencing Contractor Software Tools"
    : SEO_H1[dbSlug] ?? `Best ${category?.name ?? ""} Software for Fence Companies`;
  const seoTitle = isAll
    ? "All Fencing Contractor Software | Pro Fence Tools Directory"
    : `${seoH1} (${new Date().getFullYear()}) | Pro Fence Tools`;
  const seoDescription = isAll
    ? `Browse all ${tools?.length ?? 22} software tools reviewed for fencing contractors: estimating, CRM, scheduling, invoicing, marketing, and more. Independent, no paid placements.`
    : `Compare the top ${tools?.length ?? ""} ${category?.name ?? ""} software options for fencing contractors. Independent reviews, pricing, pros/cons, and a clear recommendation. No paid placements.`;

  // JSON-LD ItemList schema
  const itemListSchema = tools?.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    description: t.description,
    url: `/tool/${t.slug}`,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 animate-in fade-in duration-300">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalPath} />
        {itemListSchema && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": seoH1,
            "description": seoDescription,
            "numberOfItems": tools?.length ?? 0,
            "itemListElement": itemListSchema,
          })}</script>
        )}
      </Helmet>

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0d1f3c] text-white py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{isAll ? "All Tools" : (category?.name ?? dbSlug)}</span>
          </div>

          {isLoadingCategory && !isAll ? (
            <Skeleton className="h-10 w-96 bg-white/10 mb-4" />
          ) : (
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              {seoH1}
            </h1>
          )}

          <p className="text-white/65 max-w-2xl text-base font-medium leading-relaxed">
            {seoDescription}
          </p>

          {/* Related categories internal links */}
          {relatedCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Also see:</span>
              {relatedCategories.map((rc) => (
                <Link key={rc.id} href={categoryUrl(rc.slug)}>
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-[#f5a623]/20 hover:text-[#f5a623] text-white/70 border border-white/20 hover:border-[#f5a623]/40 px-3 py-1.5 rounded-sm transition-all cursor-pointer">
                    {CATEGORY_ICONS[rc.slug] ?? "🔧"} {rc.name}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        <AffiliateDisclosure variant="page-top" />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="pl-9 bg-background rounded-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-card border-2 rounded-sm p-5 space-y-6">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2 text-sm uppercase tracking-wider">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Filters
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="free-trial" className="cursor-pointer font-medium">Free Trial</Label>
                  <Switch id="free-trial" checked={freeTrial} onCheckedChange={setFreeTrial} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-app" className="cursor-pointer font-medium">Mobile App</Label>
                  <Switch id="mobile-app" checked={mobileApp} onCheckedChange={setMobileApp} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best-for" className="font-medium">Best For</Label>
                  <Select value={bestFor} onValueChange={setBestFor}>
                    <SelectTrigger id="best-for" className="rounded-sm">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any size</SelectItem>
                      <SelectItem value="Solo">Solo</SelectItem>
                      <SelectItem value="Small Crew">Small Crew</SelectItem>
                      <SelectItem value="Mid-Size">Mid-Size</SelectItem>
                      <SelectItem value="Large Crew">Large Crew</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 border-b pb-2 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-1">
                <Link href="/category/all">
                  <Button variant={isAll ? "secondary" : "ghost"} className="w-full justify-start h-8 px-2 font-medium rounded-sm">
                    All Categories
                  </Button>
                </Link>
                {categories?.map((cat) => (
                  <Link key={cat.id} href={categoryUrl(cat.slug)}>
                    <Button
                      variant={dbSlug === cat.slug ? "secondary" : "ghost"}
                      className="w-full justify-between h-8 px-2 font-medium rounded-sm"
                    >
                      <span className="truncate">{cat.name}</span>
                      <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 border-muted-foreground/30">
                        {cat.toolCount}
                      </Badge>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <p className="text-sm font-semibold text-muted-foreground">
              {isLoadingTools
                ? "Loading..."
                : `${tools?.length ?? 0} software tool${(tools?.length ?? 0) === 1 ? "" : "s"} found`}
            </p>
          </div>

          {isLoadingTools ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-sm bg-card" />
              ))}
            </div>
          ) : tools?.length === 0 ? (
            <div className="text-center py-20 bg-card border-2 rounded-sm">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(""); setFreeTrial(false); setMobileApp(false); setBestFor("all"); }}
                className="rounded-sm font-bold"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tools?.map((tool, i) => (
                <div
                  key={tool.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* H2 = tool name for SEO hierarchy — passed via headingLevel prop */}
                  <ToolCard tool={tool} headingLevel="h2" />
                </div>
              ))}
            </div>
          )}

          {/* Internal linking — compare prompt */}
          {!isAll && tools && tools.length >= 2 && (
            <div className="mt-12 border-2 border-[#f5a623]/30 bg-[#f5a623]/5 rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-extrabold text-[#0d1f3c] text-lg mb-1" style={{ fontFamily: "var(--app-font-display)" }}>
                  Not sure which one to pick?
                </p>
                <p className="text-sm text-gray-600">
                  Compare two or three {category?.name ?? "software"} tools side by side: pricing, features, free trial, mobile app, and a clear winner recommendation.
                </p>
              </div>
              <Link href="/compare">
                <Button className="shrink-0 bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white font-bold rounded-sm">
                  Compare tools <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
