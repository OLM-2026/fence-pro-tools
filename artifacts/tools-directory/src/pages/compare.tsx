import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, Minus, ExternalLink, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareTools, getCompareToolsQueryKey } from "@workspace/api-client-react";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { categoryUrl } from "@/lib/seo-slugs";
import type { Tool } from "@workspace/api-client-react";

/* ── Scoring helpers ── */
function parsePriceScore(pricingStr: string | null | undefined): number {
  if (!pricingStr) return 3;
  const lower = pricingStr.toLowerCase();
  if (lower.includes("free")) return 5;
  const match = pricingStr.match(/\$?([\d,.]+)/);
  if (!match) return 3;
  const price = parseFloat(match[1].replace(",", ""));
  if (price === 0) return 5;
  if (price <= 20) return 4.5;
  if (price <= 50) return 4;
  if (price <= 100) return 3.5;
  if (price <= 200) return 3;
  return 2.5;
}

function easeScore(tool: Tool): number {
  let s = 3.5;
  if (tool.freeTrial) s += 0.5;
  if (tool.mobileApp) s += 0.5;
  return Math.min(5, s);
}

function featuresScore(tool: Tool): number {
  const prosCount = tool.pros?.length ?? 0;
  return Math.min(5, 2.5 + prosCount * 0.4);
}

function supportScore(tool: Tool): number {
  const intCount = tool.integrations?.length ?? 0;
  return Math.min(5, 3 + intCount * 0.2);
}

function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score - full >= 0.4;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < full
              ? "fill-[#f5a623] text-[#f5a623]"
              : i === full && half
              ? "fill-[#f5a623]/50 text-[#f5a623]"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-muted-foreground">{score.toFixed(1)}</span>
    </span>
  );
}

type ScoreDimension = { label: string; score1: number; score2: number };

function winner(s1: number, s2: number): "left" | "right" | "tie" {
  if (Math.abs(s1 - s2) < 0.15) return "tie";
  return s1 > s2 ? "left" : "right";
}

export default function CompareTools() {
  const { slug1, slug2 } = useParams();

  const { data, isLoading } = useCompareTools(slug1 || "", slug2 || "", {
    query: {
      enabled: !!(slug1 && slug2),
      queryKey: getCompareToolsQueryKey(slug1 || "", slug2 || ""),
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparison not found</h1>
        <Link href="/">
          <Button className="rounded-sm font-bold">Return Home</Button>
        </Link>
      </div>
    );
  }

  const { tool1, tool2 } = data;

  // Compute scores
  const scores: ScoreDimension[] = [
    { label: "Price / Value", score1: parsePriceScore(tool1.pricingStartsAt), score2: parsePriceScore(tool2.pricingStartsAt) },
    { label: "Ease of Use", score1: easeScore(tool1 as Tool), score2: easeScore(tool2 as Tool) },
    { label: "Features", score1: featuresScore(tool1 as Tool), score2: featuresScore(tool2 as Tool) },
    { label: "Integrations & Support", score1: supportScore(tool1 as Tool), score2: supportScore(tool2 as Tool) },
  ];

  const totalScore1 = scores.reduce((a, s) => a + s.score1, 0) / scores.length;
  const totalScore2 = scores.reduce((a, s) => a + s.score2, 0) / scores.length;
  const overallWinner = winner(totalScore1, totalScore2);
  const recommendedTool = overallWinner === "left" ? tool1 : overallWinner === "right" ? tool2 : null;

  // Boolean feature rows
  const featureRows = [
    { label: "Free Trial", v1: tool1.freeTrial, v2: tool2.freeTrial },
    { label: "Mobile App", v1: tool1.mobileApp, v2: tool2.mobileApp },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>{tool1.name} vs {tool2.name} for Fence Companies — Side-by-Side Comparison | Pro Fence Tools</title>
        <meta name="description" content={`${tool1.name} vs ${tool2.name}: Which is better for fencing contractors? Side-by-side comparison of pricing, ease of use, features, and support. Independent, no sponsored results.`} />
        <meta property="og:title" content={`${tool1.name} vs ${tool2.name} — Fence Company Software Comparison`} />
        <meta property="og:description" content={`Compare ${tool1.name} and ${tool2.name} side-by-side for fencing contractors. Scored on price, ease of use, features, and support with a clear recommendation.`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${tool1.name} vs ${tool2.name} for Fencing Contractors (${new Date().getFullYear()})`,
          "description": `Independent comparison of ${tool1.name} and ${tool2.name} for fence company owners. Scored on price/value, ease of use, features, and integrations/support.`,
          "author": { "@type": "Organization", "name": "Pro Fence Tools" },
          "publisher": { "@type": "Organization", "name": "Pro Fence Tools" },
          "dateModified": new Date().toISOString().split("T")[0],
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href={categoryUrl(tool1.category)} className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {tool1.category?.replace(/-/g, " ")}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <AffiliateDisclosure variant="page-top" />
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* H1 */}
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-2"
          style={{ fontFamily: "var(--app-font-display)" }}
        >
          {tool1.name}{" "}
          <span className="text-muted-foreground font-normal text-3xl">vs</span>{" "}
          {tool2.name}
        </h1>
        <p className="text-center text-muted-foreground mb-10 font-medium">
          For fencing contractors — scored on price, ease of use, features, and support.
        </p>

        {/* Winner callout */}
        {recommendedTool && (
          <div className="bg-[#0d1f3c] border-2 border-[#f5a623]/40 rounded-sm p-6 max-w-2xl mx-auto mb-10 text-center shadow-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#f5a623]" />
              <span className="text-[#f5a623] font-bold text-sm uppercase tracking-wider">Our pick for fence contractors</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
              {recommendedTool.name}
            </h2>
            <p className="text-white/60 text-sm mb-4">
              Scored higher on overall value, ease of use, and features for fencing workflows.
            </p>
            <a
              href={recommendedTool.affiliateUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold px-6 py-2.5 rounded-sm transition-colors"
            >
              Try {recommendedTool.name} free <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* ── SCORED COMPARISON TABLE ── */}
        <div className="border-2 rounded-sm bg-card shadow-sm overflow-x-auto mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="p-5 bg-muted/50 w-1/4 text-xs font-bold uppercase tracking-wider text-muted-foreground" />
                <th className="p-5 border-l-2 w-[37.5%]">
                  <div className="flex flex-col items-start gap-3">
                    {tool1.logoUrl && (
                      <div className="h-10 w-full flex items-center">
                        <img src={tool1.logoUrl} alt={tool1.name} className="max-h-full object-contain" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{tool1.name}</h2>
                    <a
                      href={tool1.affiliateUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white text-sm font-bold px-4 py-2 rounded-sm transition-colors"
                    >
                      Visit {tool1.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </th>
                <th className="p-5 border-l-2 w-[37.5%]">
                  <div className="flex flex-col items-start gap-3">
                    {tool2.logoUrl && (
                      <div className="h-10 w-full flex items-center">
                        <img src={tool2.logoUrl} alt={tool2.name} className="max-h-full object-contain" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{tool2.name}</h2>
                    <a
                      href={tool2.affiliateUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white text-sm font-bold px-4 py-2 rounded-sm transition-colors"
                    >
                      Visit {tool2.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {/* Pricing row */}
              <tr className="border-b bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Starting Price</td>
                <td className="p-4 border-l-2 font-bold text-base">{tool1.pricingStartsAt || "Contact Sales"}</td>
                <td className="p-4 border-l-2 font-bold text-base">{tool2.pricingStartsAt || "Contact Sales"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Best For</td>
                <td className="p-4 border-l-2">{tool1.bestFor || "All sizes"}</td>
                <td className="p-4 border-l-2">{tool2.bestFor || "All sizes"}</td>
              </tr>

              {/* Boolean features */}
              {featureRows.map((row) => (
                <tr key={row.label} className="border-b bg-muted/5">
                  <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">{row.label}</td>
                  <td className="p-4 border-l-2">
                    {row.v1 ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground/40" />}
                  </td>
                  <td className="p-4 border-l-2">
                    {row.v2 ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground/40" />}
                  </td>
                </tr>
              ))}

              {/* ── SCORED ROWS ── */}
              <tr className="border-b-2 border-t-2 bg-[#0d1f3c]/5">
                <td colSpan={3} className="p-3 text-xs font-black uppercase tracking-widest text-[#0d1f3c] text-center">
                  Scored criteria — Pro Fence Tools independent assessment
                </td>
              </tr>
              {scores.map((s) => {
                const w = winner(s.score1, s.score2);
                return (
                  <tr key={s.label} className="border-b">
                    <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-middle">{s.label}</td>
                    <td className={`p-4 border-l-2 ${w === "left" ? "bg-[#f5a623]/5" : ""}`}>
                      <div className="flex items-center gap-2">
                        <Stars score={s.score1} />
                        {w === "left" && <Trophy className="w-3.5 h-3.5 text-[#f5a623]" />}
                      </div>
                    </td>
                    <td className={`p-4 border-l-2 ${w === "right" ? "bg-[#f5a623]/5" : ""}`}>
                      <div className="flex items-center gap-2">
                        <Stars score={s.score2} />
                        {w === "right" && <Trophy className="w-3.5 h-3.5 text-[#f5a623]" />}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Overall score */}
              <tr className="border-b-2 bg-muted/20 font-bold">
                <td className="p-4 text-xs font-black uppercase tracking-wider">Overall Score</td>
                <td className={`p-4 border-l-2 ${overallWinner === "left" ? "bg-[#f5a623]/10" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Stars score={totalScore1} />
                    {overallWinner === "left" && (
                      <span className="text-[10px] font-black bg-[#f5a623] text-[#0d1f3c] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Winner</span>
                    )}
                  </div>
                </td>
                <td className={`p-4 border-l-2 ${overallWinner === "right" ? "bg-[#f5a623]/10" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Stars score={totalScore2} />
                    {overallWinner === "right" && (
                      <span className="text-[10px] font-black bg-[#f5a623] text-[#0d1f3c] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Winner</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Pros */}
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Pros</td>
                <td className="p-4 border-l-2 align-top">
                  <ul className="space-y-2">
                    {tool1.pros?.map((pro, i) => (
                      <li key={i} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span>{pro}</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-l-2 align-top">
                  <ul className="space-y-2">
                    {tool2.pros?.map((pro, i) => (
                      <li key={i} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span>{pro}</span></li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Cons */}
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Cons</td>
                <td className="p-4 border-l-2 align-top">
                  <ul className="space-y-2">
                    {tool1.cons?.map((con, i) => (
                      <li key={i} className="flex gap-2 text-sm"><Minus className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> <span>{con}</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-l-2 align-top">
                  <ul className="space-y-2">
                    {tool2.cons?.map((con, i) => (
                      <li key={i} className="flex gap-2 text-sm"><Minus className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> <span>{con}</span></li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Integrations */}
              <tr>
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Integrations</td>
                <td className="p-4 border-l-2 align-top">
                  <div className="flex flex-wrap gap-1">
                    {tool1.integrations?.map((int, i) => (
                      <Badge key={i} variant="secondary" className="font-normal text-xs">{int}</Badge>
                    ))}
                  </div>
                </td>
                <td className="p-4 border-l-2 align-top">
                  <div className="flex flex-wrap gap-1">
                    {tool2.integrations?.map((int, i) => (
                      <Badge key={i} variant="secondary" className="font-normal text-xs">{int}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        {recommendedTool && (
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4 font-medium">
              Based on our independent scoring, <strong>{recommendedTool.name}</strong> is the better fit for most fencing contractors.
            </p>
            <a
              href={recommendedTool.affiliateUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold px-8 py-3 rounded-sm transition-colors text-base"
            >
              Get started with {recommendedTool.name} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
