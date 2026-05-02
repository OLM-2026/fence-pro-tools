import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ExternalLink, CheckCircle2, XCircle, ArrowLeft, Building2 } from "lucide-react";
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
          <Skeleton className="w-32 h-32 rounded-xl" />
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
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  // Filter out current tool from related
  const otherRelated = relatedTools?.filter(t => t.id !== tool.id).slice(0, 3) || [];

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>{tool.name} - Reviews, Pricing & Features | Tools for Home Services</title>
        <meta name="description" content={tool.description} />
        <meta property="og:title" content={`${tool.name} for Home Services`} />
        <meta property="og:description" content={tool.description} />
        {tool.logoUrl && <meta property="og:image" content={tool.logoUrl} />}
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground">
          <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {tool.category}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border rounded-xl p-4 flex items-center justify-center shrink-0 shadow-sm">
                {tool.logoUrl ? (
                  <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="font-normal">{tool.category}</Badge>
                  {tool.featured && <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">Top Pick</Badge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">{tool.name}</h1>
                <p className="text-lg text-muted-foreground font-medium">Pricing from: {tool.pricingStartsAt || "Contact sales"}</p>
              </div>
              
              <div className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                  <a href={tool.affiliateUrl || `https://${tool.website}`} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            <Separator className="my-10" />

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {tool.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-green-800 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" /> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros && tool.pros.length > 0 ? tool.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground italic">No pros listed</li>
                  )}
                </ul>
              </div>

              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-red-800 dark:text-red-400">
                  <XCircle className="w-5 h-5" /> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons && tool.cons.length > 0 ? tool.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
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
            <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-6">Similar to {tool.name}</h3>
              {isLoadingRelated ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : otherRelated.length > 0 ? (
                <div className="space-y-4">
                  {otherRelated.map(related => (
                    <Link key={related.id} href={`/tool/${related.slug}`} className="group block border rounded-lg p-3 hover:border-accent hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 border">
                          {related.logoUrl ? (
                            <img src={related.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="font-bold text-xs">{related.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm group-hover:text-accent transition-colors line-clamp-1">{related.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{related.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                    <Button variant="ghost" className="w-full text-sm mt-2">View all in {tool.category}</Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No similar tools found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
