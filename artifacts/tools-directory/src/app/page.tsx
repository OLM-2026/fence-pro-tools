import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ChevronRight, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { CompareWidget } from "@/components/CompareWidget";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { FeaturedToolsSection } from "@/components/FeaturedToolsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { getTools, getCategories } from "@/lib/api";
import { categoryUrl } from "@/lib/seo-slugs";

const CATEGORY_ICONS: Record<string, string> = {
  "estimating-software": "📐",
  crm: "📋",
  "field-service": "⚙️",
  invoicing: "💳",
  scheduling: "📅",
  "project-management": "📌",
  marketing: "📣",
  accounting: "📊",
  "branded-materials-swag": "👕",
};

export const metadata: Metadata = {
  title: "Pro Fence Tools: Best Software for Fencing Contractors (2025 Directory)",
  description:
    "The only independent software directory built for fencing contractors. Compare tools across estimating, scheduling, CRM, invoicing, and marketing. No paid placements, just what works in the field.",
  openGraph: {
    title: "Pro Fence Tools: Best Software for Fencing Contractors",
    description:
      "Software tools reviewed specifically for fence companies. Save time, win more jobs, and make more money. Independent, no paid placements.",
  },
};

export default async function HomePage() {
  const [tools, categories] = await Promise.all([getTools(), getCategories()]);

  const featuredTools = tools.filter((t) => t.featured);
  const newTools = [...tools]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 3);

  const totalTools = tools.length;
  const totalCategories = categories.length;

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* ── HERO ── */}
      <section
        className="bg-[#0d1f3c] text-white py-20 lg:py-28 relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(ellipse at 70% 50%, #162d54 0%, #0d1f3c 70%)",
        }}
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
          <img
            src="/logo.png"
            alt="Pro Fence Tools"
            className="h-28 md:h-36 w-auto mb-6 drop-shadow-2xl"
          />

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
            {`Here are the top ${totalTools} software tools you need to run it.`} Whether you&apos;re
            just starting out, already running a crew, or took over an existing business, the right
            software does the work of 5 people, down to 1.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm px-8"
            >
              <Link href="/category/all">Browse all {totalTools} tools</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-sm px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/compare">Compare top tools</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {totalTools} software tools reviewed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
              {totalCategories} departments covered
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
                href: categoryUrl("estimating-software"),
                color: "border-[#f5a623]",
              },
              {
                emoji: "⚙️",
                heading: "Already running a crew, want to go digital",
                body: "You're busy, maybe still doing things manually, and you know there's a smarter way. Find the one tool that solves your biggest time drain.",
                cta: "Streamline your workflow",
                href: categoryUrl("field-service"),
                color: "border-blue-400",
              },
              {
                emoji: "📈",
                heading: "Growing — need systems that scale",
                body: "Multiple crews, more jobs, more complexity. You need software that handles scheduling, job costing, and billing without slowing you down.",
                cta: "Scale your operation",
                href: categoryUrl("scheduling"),
                color: "border-green-400",
              },
            ].map((card) => (
              <Link
                key={card.heading}
                href={card.href}
                className={`group flex flex-col p-6 border-2 rounded-sm hover:shadow-lg transition-all duration-200 ${card.color}`}
              >
                <span className="text-4xl mb-4">{card.emoji}</span>
                <h3 className="font-bold text-lg text-[#0d1f3c] mb-2 group-hover:text-[#f5a623] transition-colors">
                  {card.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-grow">{card.body}</p>
                <span className="mt-5 text-sm font-bold text-[#f5a623] flex items-center gap-1">
                  {card.cta} <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-muted/20 border-t">
        <div className="container mx-auto px-4">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
            Browse by category
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Every part of your fence business, covered
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={categoryUrl(cat.slug)}
                className="group flex flex-col items-center p-4 sm:p-5 border-2 rounded-sm bg-white hover:border-[#f5a623] hover:shadow-md transition-all duration-200 text-center"
              >
                <span className="text-3xl mb-3">
                  {cat.icon || CATEGORY_ICONS[cat.slug] || "🔧"}
                </span>
                <span className="font-bold text-sm text-[#0d1f3c] group-hover:text-[#f5a623] transition-colors leading-tight">
                  {cat.name}
                </span>
                {cat.toolCount != null && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {cat.toolCount} {cat.toolCount === 1 ? "tool" : "tools"}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARE WIDGET ── */}
      <section className="py-16 border-t bg-[#0d1f3c]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
              Side-by-side
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Compare any two tools instantly
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              Pick two fence software tools and see how they stack up on pricing, features, and fit.
            </p>
          </div>
          <CompareWidget />
        </div>
      </section>

      {/* ── FEATURED TOOLS (client island with search) ── */}
      <FeaturedToolsSection featuredTools={featuredTools} allTools={tools} />

      {/* ── TESTIMONIALS (light) ── */}
      <TestimonialSlider
        variant="light"
        title="What fence contractors are saying"
        subtitle="Real reviews from fencing business owners using these software tools."
      />

      {/* ── NEW THIS WEEK ── */}
      {newTools.length > 0 && (
        <section className="py-16 bg-muted/20 border-t">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
                Just added
              </p>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                New software tools this week
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTools.map((tool, i) => (
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
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            Why FenceProTools
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            We only cover what fence contractors actually need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
            No generic small-business software lists. Every tool in this directory was evaluated
            specifically for fencing: residential, commercial, and multi-crew operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <Shield className="w-5 h-5 text-[#f5a623]" />,
                title: "Independent reviews",
                body: "No paid placements. Tools are listed because they're useful, not because they paid us. Affiliate links are disclosed on every page.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-[#f5a623]" />,
                title: "Fencing-specific criteria",
                body: "We evaluate every tool on job site usability, material takeoff accuracy, crew scheduling, and real-world fit for fence installation workflows.",
              },
              {
                icon: <Zap className="w-5 h-5 text-[#f5a623]" />,
                title: "Kept current",
                body: "Pricing, features, and availability change. We check every listing regularly so you're not acting on outdated information.",
              },
            ].map((item) => (
              <div key={item.title} className="border-2 rounded-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  {item.icon}
                  <div className="w-1 h-6 bg-[#f5a623]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (dark) ── */}
      <TestimonialSlider
        variant="dark"
        title="Trusted by fence contractors across the US"
        subtitle="Here's what real fence company owners have to say about the tools in this directory."
      />

      {/* ── NEWSLETTER ── */}
      <NewsletterSection />
    </div>
  );
}
