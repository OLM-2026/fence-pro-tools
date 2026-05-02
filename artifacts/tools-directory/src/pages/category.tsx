import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { useListTools, useGetCategoryBySlug, useListCategories, getGetCategoryBySlugQueryKey } from "@workspace/api-client-react";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function Category() {
  const { slug } = useParams();
  const isAll = slug === "all";
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: category, isLoading: isLoadingCategory } = useGetCategoryBySlug(slug || "", {
    query: { enabled: !isAll && !!slug, queryKey: getGetCategoryBySlugQueryKey(slug || "") }
  });

  const { data: categories } = useListCategories();

  const { data: tools, isLoading: isLoadingTools } = useListTools({
    category: isAll ? undefined : slug,
    search: debouncedSearch || undefined,
  });

  const title = isAll ? "All Software Tools" : category?.name || "Loading...";
  const description = isAll 
    ? "Browse our complete directory of software tools for home services."
    : category?.description || `Find the best ${category?.name} software for your home service business.`;

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 animate-in fade-in duration-300">
      <Helmet>
        <title>{title} - Tools for Home Services</title>
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
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Categories
            </h3>
            <div className="space-y-1">
              <Link href="/category/all">
                <Button variant={isAll ? "secondary" : "ghost"} className="w-full justify-start h-8 px-2 font-normal">
                  All Categories
                </Button>
              </Link>
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Button 
                    variant={slug === cat.slug ? "secondary" : "ghost"} 
                    className="w-full justify-between h-8 px-2 font-normal"
                  >
                    <span className="truncate">{cat.name}</span>
                    <Badge variant="outline" className="ml-2 text-[10px] font-normal px-1.5 py-0">
                      {cat.toolCount}
                    </Badge>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {isLoadingTools ? "Loading tools..." : `${tools?.length || 0} tools found`}
            </h2>
          </div>

          {isLoadingTools ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl bg-card" />
              ))}
            </div>
          ) : tools?.length === 0 ? (
            <div className="text-center py-20 bg-card border rounded-xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any tools matching your criteria. Try adjusting your search or browse a different category.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
