import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, Filter, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListTools, useGetCategoryBySlug, useListCategories, getGetCategoryBySlugQueryKey } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Category() {
  const { slug } = useParams();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const initialSearch = queryParams.get('search') || "";
  
  const isAll = slug === "all";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [freeTrial, setFreeTrial] = useState(false);
  const [mobileApp, setMobileApp] = useState(false);
  const [bestFor, setBestFor] = useState<string>("");

  const { data: category, isLoading: isLoadingCategory } = useGetCategoryBySlug(slug || "", {
    query: { enabled: !isAll && !!slug, queryKey: getGetCategoryBySlugQueryKey(slug || "") }
  });

  const { data: categories } = useListCategories();

  const { data: tools, isLoading: isLoadingTools } = useListTools({
    category: isAll ? undefined : slug,
    search: debouncedSearch || undefined,
    freeTrial: freeTrial ? true : undefined,
    mobileApp: mobileApp ? true : undefined,
    bestFor: bestFor !== "all" && bestFor !== "" ? bestFor : undefined,
  });

  const title = isAll ? "All Software Tools" : category?.name || "Loading...";
  const description = isAll 
    ? "Browse our complete directory of software tools for fencing contractors."
    : category?.description || `Find the best ${category?.name} software for your fencing business.`;

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 animate-in fade-in duration-300">
      <Helmet>
        <title>{title} - FenceProTools</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {isLoadingCategory && !isAll ? (
              <Skeleton className="h-10 w-64 bg-primary-foreground/20 mb-4" />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            )}
            
            {isLoadingCategory && !isAll ? (
              <Skeleton className="h-6 w-96 bg-primary-foreground/20" />
            ) : (
              <p className="text-lg text-primary-foreground/80">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
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
          
          <div className="bg-card border rounded-sm p-5 space-y-6">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="free-trial" className="cursor-pointer">Free Trial Available</Label>
                  <Switch id="free-trial" checked={freeTrial} onCheckedChange={setFreeTrial} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-app" className="cursor-pointer">Mobile App</Label>
                  <Switch id="mobile-app" checked={mobileApp} onCheckedChange={setMobileApp} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="best-for">Best For Size</Label>
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
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">
                Categories
              </h3>
              <div className="space-y-1">
                <Link href="/category/all">
                  <Button variant={isAll ? "secondary" : "ghost"} className="w-full justify-start h-8 px-2 font-medium rounded-sm">
                    All Categories
                  </Button>
                </Link>
                {categories?.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Button 
                      variant={slug === cat.slug ? "secondary" : "ghost"} 
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

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold">
              {isLoadingTools ? "Loading tools..." : `${tools?.length || 0} tools found`}
            </h2>
          </div>

          {isLoadingTools ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-sm bg-card" />
              ))}
            </div>
          ) : tools?.length === 0 ? (
            <div className="text-center py-20 bg-card border rounded-sm">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any tools matching your criteria. Try adjusting your filters.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFreeTrial(false);
                  setMobileApp(false);
                  setBestFor("all");
                }}
                className="rounded-sm font-bold"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tools?.map((tool, i) => (
                <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 50}ms` }}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}