import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ExternalLink, CheckCircle2, XCircle, ArrowLeft, Building2, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useGetToolBySlug, useListTools, getGetToolBySlugQueryKey } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";

export default function ToolDetail() {
  const { slug } = useParams();

  const { data: tool, isLoading: isLoadingTool } = useGetToolBySlug(slug || "", {
    query: { enabled: !!slug, queryKey: getGetToolBySlugQueryKey(slug || "") }
  });

  const { data: relatedTools, isLoading: isLoadingRelated } = useListTools({
    category: tool?.category,
  });

  if (isLoadingTool) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-32 h-32 rounded-sm" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/">
          <Button className="rounded-sm font-bold">Return Home</Button>
        </Link>
      </div>
    );
  }

  const otherRelated = relatedTools?.filter(t => t.id !== tool.id).slice(0, 3) || [];

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>{tool.name} for Fence Companies: Review, Pricing and Features | Pro Fence Tools</title>
        <meta name="description" content={`Is ${tool.name} the right choice for your fence company? Read our independent review covering pricing, pros, cons, and how it fits fence contractor workflows. ${tool.pricingStartsAt ? `Starts at ${tool.pricingStartsAt}.` : ""}`} />
        <meta property="og:title" content={`${tool.name}: Is It Right for Your Fence Company?`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="article" />
        {tool.logoUrl && <meta property="og:image" content={tool.logoUrl} />}
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "applicationCategory": "BusinessApplication",
          "offers": tool.pricingStartsAt ? {
            "@type": "Offer",
            "price": tool.pricingStartsAt,
            "priceCurrency": "USD"
          } : undefined,
          "url": tool.affiliateUrl || undefined
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {tool.category}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8 border-b pb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border rounded-sm p-4 flex items-center justify-center shrink-0 shadow-sm">
                {tool.logoUrl ? (
                  <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="font-bold rounded-sm">{tool.category}</Badge>
                  {tool.featured && <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-bold border-accent">Top Pick</Badge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">{tool.name}</h1>
              </div>
              
              <div className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-sm shadow-sm" asChild>
                  <a href={tool.affiliateUrl || `https://${tool.website}`} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Starting Price</div>
                <div className="font-bold text-lg">{tool.pricingStartsAt || "Contact Sales"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Free Trial</div>
                <div className="font-bold text-lg">{tool.freeTrial ? "Yes" : "No"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Mobile App</div>
                <div className="font-bold text-lg">{tool.mobileApp ? "Yes" : "No"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Best For</div>
                <div className="font-bold text-lg">{tool.bestFor || "All sizes"}</div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Overview</h2>
              <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                {tool.description}
              </p>
            </div>

            {(tool.integrations && tool.integrations.length > 0) && (
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((int, idx) => (
                    <Badge key={idx} variant="outline" className="font-medium bg-card text-sm py-1 px-3 rounded-sm">
                      {int}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mt-12 border-t pt-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros && tool.pros.length > 0 ? tool.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground italic">No pros listed</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" /> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons && tool.cons.length > 0 ? tool.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground italic">No cons listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Related */}
          <div className="w-full lg:w-80 shrink-0 space-y-8">
            <div className="bg-card border rounded-sm p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-6 border-b pb-2">Alternatives to consider</h3>
              {isLoadingRelated ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-sm" />
                  <Skeleton className="h-20 w-full rounded-sm" />
                </div>
              ) : otherRelated.length > 0 ? (
                <div className="space-y-4">
                  {otherRelated.map(related => (
                    <Link key={related.id} href={`/tool/${related.slug}`} className="group block border rounded-sm p-3 hover:border-accent hover:shadow-sm transition-all bg-background">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center shrink-0 border">
                          {related.logoUrl ? (
                            <img src={related.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="font-bold text-xs">{related.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-1">{related.name}</h4>
                          <p className="text-xs font-medium text-muted-foreground line-clamp-1">{related.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-4 border-t mt-4">
                    <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                      <Button variant="outline" className="w-full text-sm font-bold rounded-sm">View all in {tool.category}</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">No alternatives found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}