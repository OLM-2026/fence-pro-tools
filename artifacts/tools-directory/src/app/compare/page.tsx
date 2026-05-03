import type { Metadata } from "next";
import Link from "next/link";
import { CompareWidget } from "@/components/CompareWidget";
import { getTools } from "@/lib/api";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Compare Fence Contractor Software – Side-by-Side Tool Comparison",
  description:
    "Compare the top software tools for fencing contractors side by side. See pricing, features, pros and cons, and find the best fit for your fence business.",
};

const PRESET_COMPARISONS = [
  { slug1: "jobber", slug2: "housecall-pro", label: "Jobber vs Housecall Pro" },
  { slug1: "arcsite", slug2: "estimate-rocket", label: "ArcSite vs Estimate Rocket" },
  { slug1: "quickbooks-online", slug2: "invoice-ninja", label: "QuickBooks vs Invoice Ninja" },
  { slug1: "jobber", slug2: "servicetitan", label: "Jobber vs ServiceTitan" },
  { slug1: "hubspot-crm", slug2: "broadly", label: "HubSpot CRM vs Broadly" },
];

export default async function ComparePage() {
  const tools = await getTools();
  const featured = tools.filter((t) => t.featured).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#0d1f3c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            Compare tools
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Find the best software for your fence company
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-medium">
            Pick two tools and see how they compare on pricing, features, and fit for your operation.
          </p>
        </div>
      </div>

      {/* Compare Widget */}
      <div className="container mx-auto px-4 py-14">
        <CompareWidget />
      </div>

      {/* Preset comparisons */}
      <section className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
            Popular comparisons
          </p>
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Head-to-head matchups fence contractors search most
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_COMPARISONS.map((p) => {
              const t1 = tools.find((t) => t.slug === p.slug1);
              const t2 = tools.find((t) => t.slug === p.slug2);
              return (
                <Link
                  key={`${p.slug1}-${p.slug2}`}
                  href={`/compare/${p.slug1}/${p.slug2}`}
                  className="group flex items-center justify-between p-5 border-2 rounded-sm bg-white hover:border-[#f5a623] hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {t1?.logoUrl && (
                      <img
                        src={t1.logoUrl}
                        alt={t1.name}
                        className="w-8 h-8 rounded-sm object-contain border"
                      />
                    )}
                    <span className="font-bold text-sm text-[#0d1f3c] group-hover:text-[#f5a623] transition-colors">
                      {p.label}
                    </span>
                    {t2?.logoUrl && (
                      <img
                        src={t2.logoUrl}
                        alt={t2.name}
                        className="w-8 h-8 rounded-sm object-contain border"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top tools */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
            Our top picks
          </p>
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Top-rated tools for fence contractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
