import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, Minus, ExternalLink, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareTools, getCompareToolsQueryKey, useGetToolBySlug, getGetToolBySlugQueryKey } from "@workspace/api-client-react";
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

function totalScore(tool: Tool): number {
  return (
    parsePriceScore(tool.pricingStartsAt) +
    easeScore(tool) +
    featuresScore(tool) +
    supportScore(tool)
  ) / 4;
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

type ScoreDimension = {
  label: string;
  scores: number[];
};

function winnerIdx(scores: number[]): number | null {
  const max = Math.max(...scores);
  const maxCount = scores.filter((s) => Math.abs(s - max) < 0.15).length;
  if (maxCount > 1) return null;
  return scores.findIndex((s) => Math.abs(s - max) < 0.15);
}

/* ── Tool header cell ── */
function ToolHeader({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {/* Logo */}
      <div className="h-12 w-full flex items-center">
        {tool.logoUrl ? (
          <img src={tool.logoUrl} alt={`${tool.name} logo`} className="max-h-full max-w-[120px] object-contain" />
        ) : (
          <div className="h-12 w-12 rounded-sm bg-[#0d1f3c] flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-[#f5a623]">{tool.name[0]}</span>
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold leading-tight">{tool.name}</h2>
      <a
        href={tool.affiliateUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white text-sm font-bold px-4 py-2 rounded-sm transition-colors"
      >
        Visit {tool.name} <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export default function CompareTools() {
  const { slug1, slug2, slug3 } = useParams<{ slug1?: string; slug2?: string; slug3?: string }>();

  const { data, isLoading: isLoading12 } = useCompareTools(slug1 || "", slug2 || "", {
    query: {
      enabled: !!(slug1 && slug2),
      queryKey: getCompareToolsQueryKey(slug1 || "", slug2 || ""),
    },
  });

  const { data: tool3Data, isLoading: isLoading3 } = useGetToolBySlug(slug3 || "", {
    query: {
      enabled: !!slug3,
      queryKey: getGetToolBySlugQueryKey(slug3 || ""),
    },
  });

  const isLoading = isLoading12 || (!!slug3 && isLoading3);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          {slug3 && <Skeleton className="h-96 w-full" />}
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

  const tool1 = data.tool1 as Tool;
  const tool2 = data.tool2 as Tool;
  const tool3 = tool3Data as Tool | undefined;

  const tools: Tool[] = [tool1, tool2, ...(tool3 ? [tool3] : [])];
  const colCount = tools.length; // 2 or 3

  const scores: ScoreDimension[] = [
    { label: "Price / Value", scores: tools.map((t) => parsePriceScore(t.pricingStartsAt)) },
    { label: "Ease of Use", scores: tools.map(easeScore) },
    { label: "Features", scores: tools.map(featuresScore) },
    { label: "Integrations and Support", scores: tools.map(supportScore) },
  ];

  const overallScores = tools.map(totalScore);
  const overallWinnerIdx = winnerIdx(overallScores);
  const recommendedTool = overallWinnerIdx !== null ? tools[overallWinnerIdx] : null;

  const featureRows = [
    { label: "Free Trial", vals: tools.map((t) => t.freeTrial) },
    { label: "Mobile App", vals: tools.map((t) => t.mobileApp) },
  ];

  const titleNames = tools.map((t) => t.name).join(" vs ");
  const colWidth = colCount === 3 ? "w-[28%]" : "w-[37.5%]";

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>{titleNames} for Fence Companies: Side-by-Side Comparison | Pro Fence Tools</title>
        <meta name="description" content={`${titleNames}: Which is better for fencing contractors? Side-by-side comparison of pricing, ease of use, features, and support. Independent, no sponsored results.`} />
        <meta property="og:title" content={`${titleNames}: Fence Company Software Comparison`} />
        <meta property="og:description" content={`Compare ${titleNames} side by side for fencing contractors. Scored on price, ease of use, features, and support with a clear recommendation.`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${titleNames} for Fencing Contractors (${new Date().getFullYear()})`,
          "description": `Independent comparison of ${titleNames} for fence company owners. Scored on price/value, ease of use, features, and integrations/support.`,
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
          {tools.map((t, i) => (
            <span key={t.id}>
              {i > 0 && <span className="text-muted-foreground font-normal text-3xl mx-2">vs</span>}
              {t.name}
            </span>
          ))}
        </h1>
        <p className="text-center text-muted-foreground mb-10 font-medium">
          For fencing contractors, scored on price, ease of use, features, and support.
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
              Scored highest on overall value, ease of use, and features for fencing workflows.
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

        {/* ── COMPARISON TABLE ── */}
        <div className="border-2 rounded-sm bg-card shadow-sm overflow-x-auto mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="p-5 bg-muted/50 w-1/4 text-xs font-bold uppercase tracking-wider text-muted-foreground" />
                {tools.map((tool) => (
                  <th key={tool.id} className={`p-5 border-l-2 ${colWidth}`}>
                    <ToolHeader tool={tool} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {/* Starting Price */}
              <tr className="border-b bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Starting Price</td>
                {tools.map((t) => (
                  <td key={t.id} className="p-4 border-l-2 font-bold text-base">{t.pricingStartsAt || "Contact Sales"}</td>
                ))}
              </tr>

              {/* Best For */}
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Best For</td>
                {tools.map((t) => (
                  <td key={t.id} className="p-4 border-l-2">{t.bestFor || "All sizes"}</td>
                ))}
              </tr>

              {/* Boolean feature rows */}
              {featureRows.map((row) => (
                <tr key={row.label} className="border-b bg-muted/5">
                  <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">{row.label}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} className="p-4 border-l-2">
                      {v ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground/40" />}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Scored criteria header */}
              <tr className="border-b-2 border-t-2 bg-[#0d1f3c]/5">
                <td colSpan={tools.length + 1} className="p-3 text-xs font-black uppercase tracking-widest text-[#0d1f3c] text-center">
                  Scored criteria: Pro Fence Tools independent assessment
                </td>
              </tr>

              {/* Scored rows */}
              {scores.map((s) => {
                const wi = winnerIdx(s.scores);
                return (
                  <tr key={s.label} className="border-b">
                    <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-middle">{s.label}</td>
                    {s.scores.map((sc, i) => (
                      <td key={i} className={`p-4 border-l-2 ${wi === i ? "bg-[#f5a623]/5" : ""}`}>
                        <div className="flex items-center gap-2">
                          <Stars score={sc} />
                          {wi === i && <Trophy className="w-3.5 h-3.5 text-[#f5a623]" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Overall score */}
              <tr className="border-b-2 bg-muted/20 font-bold">
                <td className="p-4 text-xs font-black uppercase tracking-wider">Overall Score</td>
                {overallScores.map((sc, i) => (
                  <td key={i} className={`p-4 border-l-2 ${overallWinnerIdx === i ? "bg-[#f5a623]/10" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Stars score={sc} />
                      {overallWinnerIdx === i && (
                        <span className="text-[10px] font-black bg-[#f5a623] text-[#0d1f3c] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Winner</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Pros */}
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Pros</td>
                {tools.map((t) => (
                  <td key={t.id} className="p-4 border-l-2 align-top">
                    <ul className="space-y-2">
                      {t.pros?.map((pro, i) => (
                        <li key={i} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span>{pro}</span></li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Cons */}
              <tr className="border-b">
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Cons</td>
                {tools.map((t) => (
                  <td key={t.id} className="p-4 border-l-2 align-top">
                    <ul className="space-y-2">
                      {t.cons?.map((con, i) => (
                        <li key={i} className="flex gap-2 text-sm"><Minus className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> <span>{con}</span></li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Integrations */}
              <tr>
                <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-xs align-top">Integrations</td>
                {tools.map((t) => (
                  <td key={t.id} className="p-4 border-l-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {t.integrations?.map((int, i) => (
                        <Badge key={i} variant="secondary" className="font-normal text-xs">{int}</Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Winner Section */}
        {recommendedTool && (
          <div className="bg-[#0d1f3c] rounded-sm overflow-hidden shadow-xl">
            {/* Gold top bar */}
            <div className="bg-[#f5a623] px-6 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#0d1f3c]" />
              <span className="text-[#0d1f3c] font-black text-xs uppercase tracking-widest">Our pick for fence contractors</span>
            </div>

            <div className="p-8 flex flex-col sm:flex-row items-center gap-8">
              {/* Logo */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                {recommendedTool.logoUrl ? (
                  <div className="bg-white rounded-sm p-4 w-28 h-20 flex items-center justify-center">
                    <img
                      src={recommendedTool.logoUrl}
                      alt={`${recommendedTool.name} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-[#f5a623] rounded-sm w-20 h-20 flex items-center justify-center">
                    <span className="text-4xl font-black text-[#0d1f3c]">{recommendedTool.name[0]}</span>
                  </div>
                )}
              </div>

              {/* Text + CTA */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--app-font-display)" }}>
                  {recommendedTool.name}
                </h3>
                <p className="text-white/60 text-sm mb-1 font-medium">
                  {recommendedTool.pricingStartsAt && `Starting at ${recommendedTool.pricingStartsAt}`}
                  {recommendedTool.freeTrial && " · Free trial available"}
                </p>
                <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-md">
                  Based on our independent scoring, <strong className="text-white">{recommendedTool.name}</strong> is the best fit for most fencing contractors on price, ease of use, and features.
                </p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <a
                    href={recommendedTool.affiliateUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-black px-8 py-3.5 rounded-sm transition-colors text-base"
                  >
                    Try {recommendedTool.name} free <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link href={`/tool/${recommendedTool.slug}`} className="text-white/40 hover:text-white text-sm font-semibold transition-colors underline underline-offset-2">
                    Read full review
                  </Link>
                </div>
                <p className="text-white/20 text-xs mt-3 font-medium">
                  Affiliate link. We may earn a commission at no cost to you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
