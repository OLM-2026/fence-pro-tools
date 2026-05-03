import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, Star, ExternalLink, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTool, getTools } from "@/lib/api";

interface PageProps {
  params: Promise<{ slug1: string; slug2: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug1, slug2 } = await params;
  const [tool1, tool2] = await Promise.all([getTool(slug1), getTool(slug2)]);
  if (!tool1 || !tool2) return { title: "Comparison Not Found" };

  return {
    title: `${tool1.name} vs ${tool2.name} for Fence Contractors (2025)`,
    description: `Compare ${tool1.name} vs ${tool2.name} for fence contractors. See pricing, features, pros and cons side by side. Which is better for your fence business?`,
    openGraph: {
      title: `${tool1.name} vs ${tool2.name} – Fence Contractor Software Comparison`,
      description: `Which is better for fence contractors: ${tool1.name} or ${tool2.name}? Full comparison.`,
    },
    alternates: {
      canonical: `/compare/${slug1}/${slug2}`,
    },
  };
}

export default async function CompareDetailPage({ params }: PageProps) {
  const { slug1, slug2 } = await params;

  if (slug1 === slug2) {
    notFound();
  }

  const [tool1, tool2, allTools] = await Promise.all([
    getTool(slug1),
    getTool(slug2),
    getTools(),
  ]);

  if (!tool1 || !tool2) notFound();

  // Score based on boolean fields
  let score1 = 0;
  let score2 = 0;
  if (tool1.freeTrial) score1++;
  if (tool2.freeTrial) score2++;
  if (tool1.mobileApp) score1++;
  if (tool2.mobileApp) score2++;
  if ((tool1.features?.length ?? 0) > (tool2.features?.length ?? 0)) score1++;
  else if ((tool2.features?.length ?? 0) > (tool1.features?.length ?? 0)) score2++;
  if ((tool1.rating ?? 0) > (tool2.rating ?? 0)) score1++;
  else if ((tool2.rating ?? 0) > (tool1.rating ?? 0)) score2++;

  const winner = score1 > score2 ? tool1 : score2 > score1 ? tool2 : null;

  type ToolType = typeof tool1;
  const rows: { label: string; val: (t: ToolType) => React.ReactNode }[] = [
    { label: "Starting price", val: (t) => t?.pricingStartsAt ?? "Contact" },
    { label: "Pricing model", val: (t) => t?.pricingModel ?? "—" },
    { label: "Best for", val: (t) => t?.bestFor ?? "All sizes" },
    {
      label: "Free trial",
      val: (t) =>
        t?.freeTrial ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 mx-auto" />
        ),
    },
    {
      label: "Mobile app",
      val: (t) =>
        t?.mobileApp ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 mx-auto" />
        ),
    },
  ];

  const otherTools = allTools
    .filter((t) => t.slug !== slug1 && t.slug !== slug2 && t.category === (tool1.category || tool2.category))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#0d1f3c] text-white py-14">
        <div className="container mx-auto px-4">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to comparisons
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-8 mb-4">
            {[tool1, tool2].map((tool, i) => (
              <div key={tool.slug} className="flex items-center gap-4">
                {i === 1 && (
                  <span
                    className="text-[#f5a623] font-black text-2xl hidden md:block"
                    style={{ fontFamily: "var(--app-font-display)" }}
                  >
                    VS
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-sm bg-white overflow-hidden flex items-center justify-center border-2 border-white/20">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="font-bold text-2xl text-gray-400">{tool.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white">{tool.name}</p>
                    {tool.pricingStartsAt && (
                      <p className="text-sm text-white/50">from {tool.pricingStartsAt}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            {tool1.name} vs {tool2.name}
            <span className="text-[#f5a623]"> for Fence Contractors</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Winner banner */}
        {winner && (
          <div className="bg-[#f5a623]/10 border-2 border-[#f5a623] rounded-sm p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Trophy className="w-8 h-8 text-[#f5a623] shrink-0" />
            <div className="flex-grow">
              <p className="font-bold text-lg text-[#0d1f3c]">
                Our pick:{" "}
                <span className="text-[#f5a623]">{winner.name}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {winner.name} edges out {winner.slug === slug1 ? tool2.name : tool1.name} on
                overall score for most fence contractors.{" "}
                {winner.bestFor ? `Best for: ${winner.bestFor}.` : ""}
              </p>
            </div>
            {winner.affiliateUrl && (
              <Button
                asChild
                className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm shrink-0"
              >
                <a href={winner.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  Try {winner.name} <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Comparison table */}
        <div className="border-2 rounded-sm overflow-hidden mb-12">
          <div className="grid grid-cols-3 bg-[#0d1f3c] text-white">
            <div className="p-4 text-sm font-bold uppercase tracking-wider text-white/50" />
            {[tool1, tool2].map((tool) => (
              <div
                key={tool.slug}
                className={`p-4 text-center border-l border-white/10 ${
                  winner?.slug === tool.slug ? "bg-[#f5a623]/20" : ""
                }`}
              >
                <p className="font-bold text-base">{tool.name}</p>
                {winner?.slug === tool.slug && (
                  <Badge className="mt-1 bg-[#f5a623] text-[#0d1f3c] text-xs">
                    <Trophy className="w-3 h-3 mr-1" /> Our pick
                  </Badge>
                )}
              </div>
            ))}
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t ${i % 2 === 0 ? "bg-muted/20" : "bg-white"}`}
            >
              <div className="p-4 text-sm font-semibold text-muted-foreground flex items-center">
                {row.label}
              </div>
              {[tool1, tool2].map((tool) => (
                <div
                  key={tool.slug}
                  className="p-4 border-l flex items-center justify-center text-sm font-medium"
                >
                  {row.val(tool)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Side by side pros/cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[tool1, tool2].map((tool) => (
            <div key={tool.slug} className="space-y-6">
              <h2
                className="text-2xl font-extrabold text-[#0d1f3c]"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                {tool.name}
              </h2>

              {tool.rating != null && (
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(tool.rating)) ? "fill-[#f5a623] text-[#f5a623]" : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-muted-foreground">
                    {Number(tool.rating).toFixed(1)}
                  </span>
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

              {tool.pros && tool.pros.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-green-600 mb-2">
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {tool.pros.slice(0, 4).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tool.cons && tool.cons.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-2">
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {tool.cons.slice(0, 4).map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tool.affiliateUrl && (
                <Button
                  asChild
                  className="w-full bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
                >
                  <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer">
                    Try {tool.name} <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Other tools in this category */}
        {otherTools.length > 0 && (
          <section className="border-t pt-12">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
              Also consider
            </p>
            <h2
              className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Other tools in this category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherTools.map((t) => (
                <div key={t.id} className="border-2 rounded-sm p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm border overflow-hidden shrink-0">
                    {t.logoUrl ? (
                      <img src={t.logoUrl} alt={t.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full font-bold text-muted-foreground">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <Link
                      href={`/tool/${t.slug}`}
                      className="font-bold text-sm text-[#0d1f3c] hover:text-[#f5a623] transition-colors"
                    >
                      {t.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{t.pricingStartsAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
