import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Submit a Software Tool – FenceProTools",
  description:
    "Know a software tool that fence contractors should know about? Submit it to FenceProTools for review.",
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0d1f3c] text-white py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-4">
            Software consideration
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Submit a tool for review
          </h1>
          <p className="text-white/60 text-lg font-medium">
            Know a software tool that fence contractors should be using? Tell us about it and we&apos;ll
            evaluate it for the directory.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-2xl">
        <div className="border-2 rounded-sm p-8 mb-8">
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-2"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Our review process
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We evaluate every submission against our fencing-specific criteria. We check job site
            usability, pricing transparency, customer reviews, and fit for fence installation
            workflows. If a tool makes the cut, we&apos;ll add it to the directory with a full review.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#f5a623] font-bold shrink-0 mt-0.5">→</span>
              All submissions are reviewed independently. Submission does not guarantee inclusion.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f5a623] font-bold shrink-0 mt-0.5">→</span>
              We do not accept payment for inclusion or placement in the directory.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f5a623] font-bold shrink-0 mt-0.5">→</span>
              Review timeline is typically 2–4 weeks.
            </li>
          </ul>
        </div>

        <div className="border-2 rounded-sm p-8">
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Submit a tool
          </h2>
          <form
            action="mailto:hello@fenceprotools.com"
            method="get"
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-[#0d1f3c] mb-1">
                Software name *
              </label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. FieldPulse, Commusoft..."
                className="w-full h-11 px-4 border-2 rounded-sm text-sm focus:outline-none focus:border-[#f5a623] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0d1f3c] mb-1">
                Your name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full h-11 px-4 border-2 rounded-sm text-sm focus:outline-none focus:border-[#f5a623] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0d1f3c] mb-1">
                Why should fence contractors use this tool?
              </label>
              <textarea
                name="body"
                rows={5}
                placeholder="Tell us what makes this tool useful for fence contractors specifically..."
                className="w-full px-4 py-3 border-2 rounded-sm text-sm focus:outline-none focus:border-[#f5a623] transition-colors resize-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm h-12"
            >
              Submit for review
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Have a question?{" "}
          <Link href="/about" className="text-[#f5a623] underline underline-offset-2 font-medium">
            Visit our about page
          </Link>{" "}
          for more information about our process.
        </p>
      </div>
    </div>
  );
}
