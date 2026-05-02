import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareTools, getCompareToolsQueryKey } from "@workspace/api-client-react";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";

export default function CompareTools() {
  const { slug1, slug2 } = useParams();

  const { data, isLoading } = useCompareTools(slug1 || "", slug2 || "", {
    query: { 
      enabled: !!(slug1 && slug2), 
      queryKey: getCompareToolsQueryKey(slug1 || "", slug2 || "") 
    }
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

  // Determine "winner" for recommendation (very simple logic for mockup)
  const getRecommendation = () => {
    if (tool1.freeTrial && !tool2.freeTrial) return tool1;
    if (tool2.freeTrial && !tool1.freeTrial) return tool2;
    if (tool1.mobileApp && !tool2.mobileApp) return tool1;
    return null;
  };

  const recommendedTool = getRecommendation();

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>Compare {tool1.name} vs {tool2.name} - FenceProTools</title>
        <meta name="description" content={`Compare features, pricing, and reviews for ${tool1.name} and ${tool2.name}.`} />
      </Helmet>

      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href={`/category/${encodeURIComponent(tool1.category)}`} className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <AffiliateDisclosure variant="page-top" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-center">
          {tool1.name} <span className="text-muted-foreground mx-4 font-normal">vs</span> {tool2.name}
        </h1>

        {recommendedTool && (
          <div className="bg-accent/10 border-2 border-accent rounded-sm p-6 max-w-3xl mx-auto mb-12 text-center shadow-sm">
            <Badge className="bg-accent text-accent-foreground border-accent font-bold mb-3">Our Recommendation</Badge>
            <h2 className="text-xl font-bold text-foreground mb-2">We recommend {recommendedTool.name}</h2>
            <p className="font-medium text-muted-foreground">Based on the feature set and value provided.</p>
          </div>
        )}

        <div className="max-w-5xl mx-auto border-2 rounded-sm bg-card shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="p-6 bg-muted/50 w-1/4"></th>
                <th className="p-6 border-l-2 w-[37.5%]">
                  <div className="flex flex-col items-start gap-4">
                    {tool1.logoUrl && (
                      <div className="h-12 w-full flex items-center justify-start">
                        <img src={tool1.logoUrl} alt={tool1.name} className="max-h-full object-contain" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold">{tool1.name}</h2>
                    <Button className="w-full rounded-sm font-bold bg-primary" asChild>
                      <a href={tool1.affiliateUrl || `https://${tool1.website}`} target="_blank" rel="noopener noreferrer">
                        Visit {tool1.name} <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </th>
                <th className="p-6 border-l-2 w-[37.5%]">
                  <div className="flex flex-col items-start gap-4">
                    {tool2.logoUrl && (
                      <div className="h-12 w-full flex items-center justify-start">
                        <img src={tool2.logoUrl} alt={tool2.name} className="max-h-full object-contain" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold">{tool2.name}</h2>
                    <Button className="w-full rounded-sm font-bold bg-primary" asChild>
                      <a href={tool2.affiliateUrl || `https://${tool2.website}`} target="_blank" rel="noopener noreferrer">
                        Visit {tool2.name} <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm">
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider">Pricing Starts At</td>
                <td className="p-4 border-l font-bold text-base">{tool1.pricingStartsAt || "Contact Sales"}</td>
                <td className="p-4 border-l font-bold text-base">{tool2.pricingStartsAt || "Contact Sales"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider">Best For</td>
                <td className="p-4 border-l">{tool1.bestFor || "All sizes"}</td>
                <td className="p-4 border-l">{tool2.bestFor || "All sizes"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider">Free Trial</td>
                <td className="p-4 border-l">
                  {tool1.freeTrial ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
                </td>
                <td className="p-4 border-l">
                  {tool2.freeTrial ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider">Mobile App</td>
                <td className="p-4 border-l">
                  {tool1.mobileApp ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
                </td>
                <td className="p-4 border-l">
                  {tool2.mobileApp ? <Check className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider align-top">Pros</td>
                <td className="p-4 border-l align-top">
                  <ul className="space-y-2">
                    {tool1.pros?.map((pro, i) => (
                      <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span>{pro}</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-l align-top">
                  <ul className="space-y-2">
                    {tool2.pros?.map((pro, i) => (
                      <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> <span>{pro}</span></li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider align-top">Cons</td>
                <td className="p-4 border-l align-top">
                  <ul className="space-y-2">
                    {tool1.cons?.map((con, i) => (
                      <li key={i} className="flex gap-2"><Minus className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> <span>{con}</span></li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-l align-top">
                  <ul className="space-y-2">
                    {tool2.cons?.map((con, i) => (
                      <li key={i} className="flex gap-2"><Minus className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> <span>{con}</span></li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="p-4 bg-muted/20 font-bold text-muted-foreground uppercase tracking-wider align-top">Integrations</td>
                <td className="p-4 border-l align-top">
                  <div className="flex flex-wrap gap-1">
                    {tool1.integrations?.map((int, i) => (
                      <Badge key={i} variant="secondary" className="font-normal text-xs">{int}</Badge>
                    ))}
                  </div>
                </td>
                <td className="p-4 border-l align-top">
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
      </div>
    </div>
  );
}