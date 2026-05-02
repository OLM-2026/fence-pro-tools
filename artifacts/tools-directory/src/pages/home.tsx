import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { useListCategories, useGetFeaturedTools, useGetStats } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: featuredTools, isLoading: isLoadingFeatured } = useGetFeaturedTools();
  const { data: stats } = useGetStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // we'll navigate to a category page or search results? 
      // For now, let's just make a general search by redirecting to a search page or keeping it simple
      setLocation(`/category/all?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Helmet>
        <title>Tools for Home Services - The Software Directory for Trades</title>
        <meta name="description" content="Find the best CRM, estimating, and field service software for plumbers, HVAC, contractors, and home service pros." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mb-6">
            The software directory for <span className="text-accent">home service pros.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10">
            No fluff. No marketing speak. Just the best field service management, estimating, and CRM tools indexed for your trade.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              type="search" 
              placeholder="Search for tools, features, or trades..." 
              className="h-14 pl-12 pr-32 rounded-full text-lg bg-background text-foreground border-2 border-transparent focus-visible:border-accent shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="lg" className="absolute right-1 top-1 bottom-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 font-semibold">
              Search
            </Button>
          </form>
          
          {stats && (
            <div className="mt-8 text-sm font-medium text-primary-foreground/60 flex items-center gap-6">
              <span>{stats.totalTools} Tools indexed</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{stats.totalCategories} Categories</span>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Browse by Trade</h2>
              <p className="text-muted-foreground">Find software built specifically for your business.</p>
            </div>
            <Link href="/category/all">
              <Button variant="ghost" className="hidden sm:flex group">
                View all categories <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories?.slice(0, 8).map((cat, i) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="block group">
                  <div className="p-6 rounded-lg border bg-card hover:border-accent/50 hover:shadow-md transition-all duration-300 flex items-center justify-between" style={{ animationDelay: `${i * 50}ms` }}>
                    <div>
                      <h3 className="font-semibold group-hover:text-accent transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.toolCount} tools</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex justify-center sm:hidden">
            <Link href="/category/all">
              <Button variant="outline" className="w-full">View all categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Top Rated Tools</h2>
            <p className="text-muted-foreground">The most recommended software by home service professionals.</p>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools?.map((tool, i) => (
                <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
