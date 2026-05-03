import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, BarChart3, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About FenceProTools – Independent Software Reviews for Fence Contractors",
  description:
    "FenceProTools is an independent software directory built specifically for fencing contractors. Learn about our review process, our affiliate disclosure policy, and how we choose what to feature.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#0d1f3c] text-white py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-4">
            About us
          </p>
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Built for the trade, not just any small business.
          </h1>
          <p className="text-white/70 text-xl font-medium leading-relaxed">
            FenceProTools is the only curated software directory built specifically for fencing
            contractors — residential, commercial, and multi-crew operations. We review tools the
            way a fence company owner would, not a generic tech reviewer.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Mission */}
        <section className="mb-16">
          <h2
            className="text-3xl font-extrabold text-[#0d1f3c] mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Why we built this
          </h2>
          <div className="prose prose-gray max-w-none text-base leading-relaxed space-y-4 text-muted-foreground">
            <p>
              Fence contractors are some of the hardest-working people in the trades. You're
              juggling estimates, scheduling crews, managing materials, invoicing, and trying to
              market your business — all at once. The right software can replace 2-3 extra hires.
              The wrong one is expensive and wastes months.
            </p>
            <p>
              Most "small business software" directories are written for any business. We write for
              fence companies specifically: wood, vinyl, chain-link, ornamental iron, gate
              operators, and the unique workflow that comes with fence installation.
            </p>
            <p>
              We evaluate every tool on how it works for <em>you</em> — not a plumber, not a
              landscaper, not an HVAC tech. You.
            </p>
          </div>
        </section>

        {/* How we review */}
        <section className="mb-16">
          <h2
            className="text-3xl font-extrabold text-[#0d1f3c] mb-8"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            How we evaluate software
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <Shield className="w-5 h-5 text-[#f5a623]" />,
                title: "Job site usability",
                body: "Does it work on a phone with muddy fingers? Can your crew use it without training? Real-world field test criteria.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-[#f5a623]" />,
                title: "Fencing-specific workflow",
                body: "Can it handle material takeoffs, linear footage estimates, gate specs, and multi-crew scheduling? We check for fence-specific fit.",
              },
              {
                icon: <Zap className="w-5 h-5 text-[#f5a623]" />,
                title: "Pricing transparency",
                body: "We verify current pricing, report on contract requirements, and flag hidden fees. We update listings when prices change.",
              },
              {
                icon: <Award className="w-5 h-5 text-[#f5a623]" />,
                title: "Real contractor reviews",
                body: "We source verified reviews from Capterra, G2, and Google from contractors in field service and construction trades.",
              },
            ].map((item) => (
              <div key={item.title} className="border-2 rounded-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  {item.icon}
                  <h3 className="font-bold text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate disclosure */}
        <section className="mb-16 bg-muted/30 border-2 rounded-sm p-8">
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Our affiliate disclosure policy
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            FenceProTools earns affiliate commissions when you click certain links and make a
            purchase, at no additional cost to you. This helps us maintain the directory, research
            new tools, and keep everything free to access.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            <strong>What we never do:</strong> accept payment to feature a tool, write positive
            reviews in exchange for compensation, or hide our affiliate relationships. Every page
            with affiliate links is clearly labeled.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our rankings are based on research, contractor feedback, and our own evaluation
            criteria. Affiliate relationships do not influence which tools we recommend or how we
            rank them.
          </p>
          <Link
            href="/disclosure"
            className="inline-block mt-5 text-sm font-bold text-[#f5a623] underline underline-offset-2 hover:text-[#f5a623]/80 transition-colors"
          >
            Read our full affiliate disclosure →
          </Link>
        </section>

        {/* CTA */}
        <section className="text-center border-t pt-12">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-3">
            Get started
          </p>
          <h2
            className="text-3xl font-extrabold text-[#0d1f3c] mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Find the right software for your fence company
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse all {22}+ tools or compare your top picks side by side.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
            >
              <Link href="/category/all">Browse all tools</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-sm border-2">
              <Link href="/compare">Compare tools</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
