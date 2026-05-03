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
        <title>Pro Fence Tools: Best Software for Fencing Contractors (2025 Directory)</title>
        <meta
          name="description"
          content={`The only independent software directory built for fencing contractors. Compare ${stats?.totalTools ?? ""} tools across estimating, scheduling, CRM, invoicing, and marketing. No paid placements, just what works in the field.`}
        />
        <meta property="og:title" content="Pro Fence Tools: Best Software for Fencing Contractors" />
        <meta property="og:description" content={`${stats?.totalTools ?? ""} software tools reviewed specifically for fence companies. Save time, win more jobs, and make more money. Independent, no paid placements.`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Best Software Tools for Fencing Contractors",
          "description": "Independent directory of software tools reviewed for fence company owners.",
          "numberOfItems": stats?.totalTools ?? 22,
          "url": "/"
        })}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section
        className="bg-[#0d1f3c] text-white py-20 lg:py-28 relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, #162d54 0%, #0d1f3c 70%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <img src="/logo.png" alt="Pro Fence Tools" className="h-28 md:h-36 w-auto mb-6 drop-shadow-2xl" />

          <div className="inline-flex items-center gap-2 bg-[#f5a623] text-[#0d1f3c] text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-sm mb-6 shadow-lg">
            <Zap className="w-3.5 h-3.5 fill-current" />
            1% better every day starts today
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none max-w-4xl mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Save time. Make more money.
            <br />
            <span className="text-[#f5a623]">Run a smarter fence company.</span>
          </h1>

          <p className="text-base md:text-lg text-white/60 font-semibold mb-2 uppercase tracking-widest">
            Built for the trade, not just any small business
          </p>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mb-10 font-medium leading-relaxed">
            Here are the top {stats?.totalTools ?? ""} software tools you need to run it. Whether you're just starting out,
            already running a crew, or took over an existing business, the right software does
            the work of 5 people, down to 1.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-2xl flex relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search tools, categories... (e.g. estimating, CRM, invoicing)"
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

          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {stats?.totalTools ?? 22} software tools reviewed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {stats?.totalCategories ?? 9} departments of your business covered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              100% independent, no paid placements
            </span>
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="py-14 bg-white border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            Find your starting point
          </p>
          <h2
            className="text-center text-2xl md:text-3xl font-extrabold text-[#0d1f3c] mb-10 tracking-tight"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Where are you in your fence business journey?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                emoji: "🚀",
                heading: "Starting a fence company",
                body: "You're setting up from scratch and want to start right. We'll show you exactly which tools to set up first — estimating, quoting, and getting paid.",
                cta: "Start here",
                href: "/category/estimating-software",
                color: "border-[#f5a623]",
              },
              {
                emoji: "⚙️",
                heading: "Already running a crew, want to go digital",
                body: "You're busy, maybe still doing things manually, and you know there's a smarter way. Find the one tool that solves your biggest time drain.",
                cta: "Streamline your workflow",
                href: "/category/field-service",
                color: "border-[#0d1f3c]",
              },
              {
                emoji: "🏢",
                heading: "Took over or bought a fence business",
                body: "You inherited systems (or no systems). Get a full picture of every software category and decide what to keep, upgrade, or replace.",
                cta: "See all categories",
                href: "/category/all",
                color: "border-gray-200",
              },
            ].map((card) => (
              <Link key={card.heading} href={card.href} className="block group">
                <div className={`p-6 rounded-sm border-2 ${card.color} hover:border-[#f5a623] hover:shadow-lg transition-all duration-200 h-full flex flex-col bg-white`}>
                  <span className="text-3xl mb-4 block">{card.emoji}</span>
                  <h3 className="font-extrabold text-[#0d1f3c] text-lg mb-2 leading-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                    {card.heading}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-4">{card.body}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#f5a623] group-hover:gap-2 transition-all">
                    {card.cta} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE WORK OF 5, DOWN TO 1 ── */}
      <section className="py-16 bg-[#0d1f3c] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">Why this matters</p>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Good software doesn't just save time.
              <br />
              <span className="text-[#f5a623]">It makes you money.</span>
            </h2>
            <p className="text-white/65 text-lg leading-relaxed font-medium">
              Start with one problem you're trying to solve — a quote that takes too long, invoices that never get paid,
              crews that don't know where to be. The right software turns the work of 5 people into the work of 1.
              Every hour you save is an hour you can spend on another job, with your family, or just not thinking about
              work at the end of the day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: "📐",
                problem: "Quoting takes hours",
                solution: "Estimating software cuts it to 20 minutes, on-site, before you leave the driveway.",
                impact: "Win more jobs",
                categorySlug: "/fence-estimating-software",
                primaryTool: { slug: "arcsite", name: "ArcSite" },
                secondaryTools: [
                  { slug: "estimate-rocket", name: "Estimate Rocket" },
                ],
                compareSlug: "/compare/arcsite/estimate-rocket",
              },
              {
                icon: "💳",
                problem: "Chasing unpaid invoices",
                solution: "Automated invoicing and payment links mean you get paid faster, without the follow-up calls.",
                impact: "Improve cash flow",
                categorySlug: "/fence-invoicing-software",
                primaryTool: { slug: "invoice-ninja", name: "Invoice Ninja" },
                secondaryTools: [
                  { slug: "quickbooks-online", name: "QuickBooks Online" },
                ],
                compareSlug: "/compare/invoice-ninja/quickbooks-online",
              },
              {
                icon: "📅",
                problem: "Missed jobs and dispatch confusion",
                solution: "Scheduling software keeps your crew in sync, no more double bookings or no-shows.",
                impact: "Run a tighter crew",
                categorySlug: "/fence-scheduling-software",
                primaryTool: { slug: "jobber", name: "Jobber" },
                secondaryTools: [
                  { slug: "housecall-pro", name: "Housecall Pro" },
                ],
                compareSlug: "/compare/jobber/housecall-pro",
              },
              {
                icon: "📋",
                problem: "Leads falling through the cracks",
                solution: "A CRM automatically follows up with every lead so no job opportunity is ever lost.",
                impact: "Grow your revenue",
                categorySlug: "/fence-crm-software",
                primaryTool: { slug: "hubspot-crm", name: "HubSpot CRM" },
                secondaryTools: [
                  { slug: "markate", name: "Markate" },
                ],
                compareSlug: "/compare/hubspot-crm/markate",
              },
            ].map((item) => (
              <div key={item.problem} className="bg-white/5 border border-white/10 rounded-sm p-5 hover:border-[#f5a623]/40 transition-colors flex flex-col">
                <span className="text-2xl block mb-3">{item.icon}</span>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">The problem</p>
                <p className="text-white font-bold mb-3 leading-tight">{item.problem}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{item.solution}</p>
                <Link href={item.categorySlug}>
                  <span className="inline-block text-xs font-black text-[#0d1f3c] bg-[#f5a623] px-2 py-1 rounded-sm uppercase tracking-wide cursor-pointer hover:bg-[#f5a623]/80 transition-colors">
                    {item.impact}
                  </span>
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Top picks</p>
                  <Link href={`/tool/${item.primaryTool.slug}`} className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] shrink-0" />
                    <span className="text-white/70 text-xs font-semibold group-hover:text-[#f5a623] transition-colors">{item.primaryTool.name}</span>
                  </Link>
                  {item.secondaryTools.map((t) => (
                    <Link key={t.slug} href={`/tool/${t.slug}`} className="flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                      <span className="text-white/50 text-xs font-semibold group-hover:text-white/80 transition-colors">{t.name}</span>
                    </Link>
                  ))}
                  <Link href={item.compareSlug} className="flex items-center gap-1 mt-2 text-[10px] font-bold text-white/30 hover:text-[#f5a623] uppercase tracking-wider transition-colors">
                    <ArrowRight className="w-3 h-3" /> Compare these tools
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-8 font-medium italic">
            This stuff is easier than you think. You don't need to hire someone to set it up. Pick one tool, try it free, and start today.
          </p>
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
            Compare fence software tools side by side
          </h2>
          <p className="text-white/60 max-w-xl mb-10 font-medium">
            Pick two or three software tools and see a side-by-side breakdown of pricing,
            features, free trial, and mobile app support. No sales pitch, just the facts.
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
                Browse all {stats?.totalTools ?? ""} software tools <ArrowRight className="w-4 h-4 ml-2" />
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
            was evaluated specifically for fencing: residential, commercial, and multi-crew operations.
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
            fence company, straight to your inbox every week.
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
