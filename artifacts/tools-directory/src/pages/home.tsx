import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  Search,
  ChevronRight,
  Mail,
  Loader2,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ToolCard";
import { CompareWidget } from "@/components/CompareWidget";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import {
  useListCategories,
  useGetFeaturedTools,
  useGetNewTools,
  useGetStats,
  useSubscribe,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_ICONS: Record<string, string> = {
  "estimating-software": "📐",
  "crm": "📋",
  "field-service": "⚙️",
  "invoicing": "💳",
  "scheduling": "📅",
  "project-management": "📌",
  "marketing": "📣",
  "accounting": "📊",
  "branded-materials-swag": "👕",
};

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
    subscribeMutation.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          toast({ title: "You're in.", description: "We'll send the weekly Fence Software Roundup to your inbox." });
          setEmail("");
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <Helmet>
        <title>FenceProTools — Software Directory for Fencing Contractors</title>
        <meta
          name="description"
          content="22 legit software tools reviewed for fencing contractors. Estimating, scheduling, CRM, invoicing, marketing and more — built for the trade."
        />
      </Helmet>

      {/* ── HERO ── */}
      <section
        className="bg-[#0d1f3c] text-white py-20 lg:py-28 relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, #162d54 0%, #0d1f3c 70%)" }}
      >
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <img src="/logo.png" alt="FenceProTools" className="h-28 md:h-36 w-auto mb-6 drop-shadow-2xl" />

          <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/30 text-[#f5a623] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm mb-8">
            <Shield className="w-3.5 h-3.5" />
            Built for the trade — not just any small business
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none max-w-4xl mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Starting a fence company?
            <br />
            <span className="text-[#f5a623]">Here are the top 22 software tools</span>
            <br />
            you need to run it.
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 font-medium">
            We reviewed every major software tool across every part of a fencing
            business — estimating, scheduling, CRM, invoicing, marketing, and more.
            No fluff. Just what actually works in the field.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-2xl flex relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search software tools, categories..."
              className="h-14 pl-12 pr-36 rounded-sm text-base bg-white text-gray-900 border-2 border-transparent focus-visible:border-[#f5a623] shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-1 top-1 bottom-1 rounded-sm bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] px-6 font-bold"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {stats?.totalTools ?? 22} software tools reviewed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {stats?.totalCategories ?? 9} areas of your business covered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              100% independent — no paid placements
            </span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-[#f5a623] py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[#0d1f3c] font-bold text-sm uppercase tracking-wider">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Estimating software reviewed</span>
            <span className="text-[#0d1f3c]/30 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> CRM &amp; lead tracking</span>
            <span className="text-[#0d1f3c]/30 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Invoicing &amp; payments</span>
            <span className="text-[#0d1f3c]/30 hidden sm:block">|</span>
            <span className="flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Scheduling &amp; dispatch</span>
          </div>
        </div>
      </section>

      {/* ── WHAT'S COVERED ── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">Every area of your business</p>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                We've got software tools for all of it
              </h2>
            </div>
            <Link href="/category/all">
              <Button variant="ghost" className="hidden sm:flex group font-bold">
                Browse all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories?.map((cat, i) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="block group">
                  <div
                    className="p-5 rounded-sm border-2 bg-card hover:border-[#f5a623] hover:shadow-md transition-all duration-200 flex items-center gap-4"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="text-2xl shrink-0">{CATEGORY_ICONS[cat.slug] ?? "🔧"}</span>
                    <div>
                      <h3 className="font-bold group-hover:text-[#f5a623] transition-colors leading-tight">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{cat.toolCount} software tool{cat.toolCount === 1 ? "" : "s"}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center sm:hidden">
            <Link href="/category/all">
              <Button variant="outline" className="w-full rounded-sm font-bold">Browse all categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARE WIDGET ── */}
      <section className="py-20 bg-[#0d1f3c] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">Head-to-head</p>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Compare any two fence software tools
          </h2>
          <p className="text-white/60 max-w-xl mb-10 font-medium">
            Pick two software tools and see a side-by-side breakdown of pricing,
            features, free trial, and mobile app support. No sales pitch — just the facts.
          </p>

          <CompareWidget />

          <Link href="/compare" className="mt-8">
            <Button
              variant="ghost"
              className="text-white/50 hover:text-white font-semibold text-sm group"
            >
              See all popular comparisons
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── TOP PICKS ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">Editor's picks</p>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Top-rated software tools for fence companies
            </h2>
            <p className="text-muted-foreground mt-2">Highly rated across the most important categories.</p>
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
                <div
                  key={tool.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link href="/category/all">
              <Button className="rounded-sm font-bold bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white px-8 h-12">
                Browse all 22 software tools <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (1) ── */}
      <TestimonialSlider
        variant="light"
        title="What fence contractors are saying"
        subtitle="Real reviews from fencing business owners using these software tools."
      />

      {/* ── NEW THIS WEEK ── */}
      {newTools && newTools.length > 0 && (
        <section className="py-16 bg-muted/20 border-t">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">Just added</p>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                New software tools this week
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTools.slice(0, 3).map((tool, i) => (
                <div
                  key={tool.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY TRUST US ── */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">Why FenceProTools</p>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            We only cover what fence contractors actually need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
            No generic small-business software lists. Every software tool in this directory
            was evaluated specifically for fencing — residential, commercial, and multi-crew operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Independent reviews",
                body: "No paid placements. Tools are listed because they're useful, not because they paid us. Affiliate links are disclosed on every page.",
              },
              {
                title: "Fencing-specific criteria",
                body: "We evaluate every software tool on job site usability, material takeoff accuracy, crew scheduling, and real-world fit for fence installation workflows.",
              },
              {
                title: "Kept current",
                body: "Pricing, features, and availability change. We check every listing regularly so you're not acting on outdated information.",
              },
            ].map((item) => (
              <div key={item.title} className="border-2 rounded-sm p-6">
                <div className="w-1 h-6 bg-[#f5a623] mb-4" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (2) ── */}
      <TestimonialSlider
        variant="dark"
        title="Trusted by fence contractors across the US"
        subtitle="Here's what real fence company owners have to say about the tools in this directory."
      />

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-[#0d1f3c] text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 max-w-xl relative z-10">
          <Mail className="w-10 h-10 text-[#f5a623] mx-auto mb-5" />
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            The weekly Fence Software Roundup
          </h2>
          <p className="text-white/60 mb-8 font-medium">
            New software tools, pricing updates, and tips for running a more efficient
            fence company — straight to your inbox every week.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white text-gray-900 border-0 rounded-sm font-medium"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm whitespace-nowrap"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe free"}
            </Button>
          </form>
          <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe any time.</p>
        </div>
      </section>
    </div>
  );
}
