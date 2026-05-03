import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListTools, useListCategories } from "@workspace/api-client-react";
import { categoryUrl } from "@/lib/seo-slugs";

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

export default function CompareIndex() {
  const { data: categories = [], isLoading: isLoadingCats } = useListCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: allTools = [], isLoading: isLoadingTools } = useListTools({
    category: selectedCategory || undefined,
  });
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [, navigate] = useLocation();

  const toggleTool = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, slug];
    });
  };

  const handleCompare = () => {
    if (selectedSlugs.length >= 2) {
      navigate(`/compare/${selectedSlugs.join("/")}`);
    }
  };

  const categoryTools = selectedCategory ? allTools : [];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>Compare Fencing Software by Category - Pro Fence Tools</title>
        <meta
          name="description"
          content="Compare fencing software tools side by side by category. Pick up to 3 tools and see a full feature checklist breakdown. Independent, no paid placements."
        />
      </Helmet>

      {/* Header */}
      <div className="bg-[#0d1f3c] text-white py-14">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Compare fencing software by category
          </h1>
          <p className="text-white/70 text-lg font-medium">
            Pick a department, select up to 3 tools, and see a full feature checklist side by side. No sales pitch, just the facts.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">

        {/* Step 1: Pick a category */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-full bg-[#0d1f3c] text-white text-xs font-black flex items-center justify-center shrink-0">1</span>
            <h2 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
              Choose a department
            </h2>
          </div>

          {isLoadingCats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-sm" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSelectedSlugs([]);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-sm border-2 text-left font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? "border-[#f5a623] bg-[#f5a623]/10 text-[#0d1f3c]"
                      : "border-border bg-card hover:border-[#0d1f3c]/40 text-foreground"
                  }`}
                >
                  <span className="text-xl shrink-0">{CATEGORY_ICONS[cat.slug] ?? "🔧"}</span>
                  <div>
                    <p className="text-sm font-bold leading-tight">{cat.name}</p>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">{cat.toolCount} tools</p>
                  </div>
                  {selectedCategory === cat.slug && <Check className="w-4 h-4 text-[#f5a623] ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Pick tools (shown once a category is selected) */}
        {selectedCategory && (
          <div className="mb-10 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-[#0d1f3c] text-white text-xs font-black flex items-center justify-center shrink-0">2</span>
              <h2 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                Select up to 3 tools to compare
              </h2>
              {selectedSlugs.length > 0 && (
                <Badge className="bg-[#f5a623] text-[#0d1f3c] font-black">
                  {selectedSlugs.length} selected
                </Badge>
              )}
            </div>

            {isLoadingTools ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-sm" />)}
              </div>
            ) : categoryTools.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tools found in this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryTools.map((tool) => {
                  const selected = selectedSlugs.includes(tool.slug);
                  const maxed = selectedSlugs.length >= 3 && !selected;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => !maxed && toggleTool(tool.slug)}
                      disabled={maxed}
                      className={`flex items-start gap-4 p-4 rounded-sm border-2 text-left transition-all ${
                        selected
                          ? "border-[#f5a623] bg-[#f5a623]/5"
                          : maxed
                          ? "border-border bg-muted/30 opacity-40 cursor-not-allowed"
                          : "border-border bg-card hover:border-[#0d1f3c]/50"
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`mt-0.5 w-5 h-5 rounded-sm border-2 shrink-0 flex items-center justify-center transition-colors ${
                        selected ? "bg-[#f5a623] border-[#f5a623]" : "border-muted-foreground/40"
                      }`}>
                        {selected && <Check className="w-3 h-3 text-[#0d1f3c]" />}
                      </div>

                      {/* Logo or initial */}
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted rounded-sm overflow-hidden">
                        {tool.logoUrl ? (
                          <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-base font-black text-muted-foreground">{tool.name[0]}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-tight">{tool.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{tool.pricingStartsAt || "Contact for pricing"}</p>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {tool.freeTrial && (
                            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-sm">Free trial</span>
                          )}
                          {tool.mobileApp && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-sm">Mobile app</span>
                          )}
                          {tool.bestFor && (
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{tool.bestFor}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Compare button */}
        {selectedSlugs.length >= 2 && (
          <div className="mb-12 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-[#f5a623] text-[#0d1f3c] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <h2 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                See the full comparison
              </h2>
            </div>
            <div className="bg-[#0d1f3c] rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">Comparing: {selectedSlugs.map((s) => allTools.find((t) => t.slug === s)?.name).filter(Boolean).join(" vs ")}</p>
                <p className="text-white/50 text-xs">Full feature checklist, pricing, pros and cons, and a clear winner recommendation.</p>
              </div>
              <Button
                onClick={handleCompare}
                className="shrink-0 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-black rounded-sm px-6 h-11"
              >
                Compare {selectedSlugs.length} tools <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Popular comparisons */}
        <div>
          <h2 className="text-xl font-bold mb-1">Popular comparisons</h2>
          <p className="text-muted-foreground text-sm font-medium mb-6">
            The questions we hear most from fence contractors.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { slug1: "jobber", slug2: "housecall-pro", label1: "Jobber", label2: "Housecall Pro", category: "Field Service", note: "The two most popular all-in-one platforms for small fence crews." },
              { slug1: "arcsite", slug2: "estimate-rocket", label1: "ArcSite", label2: "Estimate Rocket", category: "Estimating", note: "Field-sketch takeoffs vs. clean proposal templates. Which fits your workflow?" },
              { slug1: "jobber", slug2: "servicetitan", label1: "Jobber", label2: "ServiceTitan", category: "Field Service", note: "Affordable simplicity vs. enterprise power. Know when to upgrade." },
              { slug1: "quickbooks-online", slug2: "invoice-ninja", label1: "QuickBooks Online", label2: "Invoice Ninja", category: "Accounting / Invoicing", note: "Industry standard accounting vs. a free alternative. Worth paying for?" },
              { slug1: "housecall-pro", slug2: "mhelpdesk", label1: "Housecall Pro", label2: "mHelpDesk", category: "Scheduling", note: "Both handle scheduling and invoicing. Here's which wins for fence contractors." },
              { slug1: "broadly", slug2: "markate", label1: "Broadly", label2: "Markate", category: "Marketing", note: "Two reputation and lead-gen tools built for local service businesses." },
            ].map((pair) => (
              <Link key={`${pair.slug1}-${pair.slug2}`} href={`/compare/${pair.slug1}/${pair.slug2}`}>
                <div className="group border-2 rounded-sm p-5 bg-card hover:border-[#0d1f3c] hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">{pair.label1}</span>
                      <span className="text-muted-foreground text-sm font-medium">vs</span>
                      <span className="font-bold text-base">{pair.label2}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#0d1f3c] transition-colors shrink-0 mt-0.5" />
                  </div>
                  <Badge variant="secondary" className="self-start mb-3 text-xs font-semibold rounded-sm">{pair.category}</Badge>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-auto">{pair.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
