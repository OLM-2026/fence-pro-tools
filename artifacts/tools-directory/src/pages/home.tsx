import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, ChevronRight, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { useListCategories, useGetFeaturedTools, useGetNewTools, useGetStats, useSubscribe } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: featuredTools, isLoading: isLoadingFeatured } = useGetFeaturedTools();
  const { data: newTools, isLoading: isLoadingNew } = useGetNewTools();
  const { data: stats } = useGetStats();
  const subscribeMutation = useSubscribe();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/category/all?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ data: { email } }, {
      onSuccess: () => {
        toast({ title: "Subscribed!", description: "You'll receive the weekly Fence Tool Roundup." });
        setEmail("");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to subscribe. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Helmet>
        <title>FenceProTools - The Software Directory for Fencing Contractors</title>
        <meta name="description" content="The best software and tools for running a fencing business — reviewed by people who actually know the industry." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mb-6">
            The software directory for <span className="text-accent">fencing contractors.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10">
            The best software and tools for running a fencing business — reviewed by people who actually know the industry.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              type="search" 
              placeholder="Search for tools or categories..." 
              className="h-14 pl-12 pr-32 rounded-sm text-lg bg-background text-foreground border-2 border-transparent focus-visible:border-accent shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="lg" className="absolute right-1 top-1 bottom-1 rounded-sm bg-accent hover:bg-accent/90 text-accent-foreground px-8 font-semibold">
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
              <h2 className="text-2xl font-bold tracking-tight mb-2">Categories</h2>
              <p className="text-muted-foreground">Find the right tools for your specific needs.</p>
            </div>
            <Link href="/category/all">
              <Button variant="ghost" className="hidden sm:flex group font-bold">
                View all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.slice(0, 8).map((cat, i) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="block group">
                  <div className="p-6 rounded-sm border bg-card hover:border-accent/50 hover:shadow-sm transition-all duration-300 flex items-center justify-between" style={{ animationDelay: `${i * 50}ms` }}>
                    <div>
                      <h3 className="font-bold group-hover:text-accent transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.toolCount} tools</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex justify-center sm:hidden">
            <Link href="/category/all">
              <Button variant="outline" className="w-full rounded-sm font-bold">View all categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Top Picks</h2>
            <p className="text-muted-foreground">Highly recommended tools for fencing businesses.</p>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools?.slice(0, 6).map((tool, i) => (
                <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Tools Section */}
      <section className="py-16 bg-muted/20 border-t">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">New This Week</h2>
            <p className="text-muted-foreground">The latest software added to our directory.</p>
          </div>

          {isLoadingNew ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTools?.slice(0, 3).map((tool, i) => (
                <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Mail className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Get the weekly Fence Tool Roundup</h2>
          <p className="text-primary-foreground/80 mb-8">
            Join other fencing contractors who get our weekly email on new tools, software updates, and tips to run a better business.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background text-foreground border-0 rounded-sm"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-sm whitespace-nowrap"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}