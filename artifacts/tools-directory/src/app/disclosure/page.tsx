import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure – FenceProTools",
  description:
    "Full affiliate disclosure for FenceProTools. Learn how we earn revenue and how that affects our reviews and recommendations.",
  robots: { index: true, follow: true },
};

export default function DisclosurePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0d1f3c] text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Affiliate Disclosure
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="prose prose-gray max-w-none space-y-6 text-base text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium text-lg">
            FenceProTools participates in affiliate marketing programs. This means we may earn a
            commission when you click certain links and make a purchase, at no additional cost to you.
          </p>

          <h2 className="text-2xl font-extrabold text-[#0d1f3c] mt-8" style={{ fontFamily: "var(--app-font-display)" }}>
            How it works
          </h2>
          <p>
            When you click a link labeled &quot;Get Started&quot; or similar on our site and sign
            up for or purchase a software product, FenceProTools may receive a referral fee from the
            software company. This is a standard practice in online publishing and does not change
            your price.
          </p>

          <h2 className="text-2xl font-extrabold text-[#0d1f3c] mt-8" style={{ fontFamily: "var(--app-font-display)" }}>
            What we will never do
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Accept payment to feature a tool in our directory</li>
            <li>Write a positive review in exchange for compensation</li>
            <li>Rank a tool higher because it pays a higher commission</li>
            <li>Hide our affiliate relationships from readers</li>
          </ul>

          <h2 className="text-2xl font-extrabold text-[#0d1f3c] mt-8" style={{ fontFamily: "var(--app-font-display)" }}>
            Our editorial independence
          </h2>
          <p>
            Our reviews, ratings, and recommendations are based solely on our research, evaluation
            criteria, and the feedback of real fence contractors. Affiliate relationships do not
            influence our editorial content. Tools are listed because they are useful for fencing
            contractors, not because of any commercial arrangement.
          </p>

          <h2 className="text-2xl font-extrabold text-[#0d1f3c] mt-8" style={{ fontFamily: "var(--app-font-display)" }}>
            FTC compliance
          </h2>
          <p>
            In accordance with the Federal Trade Commission&apos;s guidelines (16 CFR Part 255),
            FenceProTools discloses any material connections between our site and the companies
            whose products or services we feature. This page, as well as disclosures on individual
            pages, serve that purpose.
          </p>

          <h2 className="text-2xl font-extrabold text-[#0d1f3c] mt-8" style={{ fontFamily: "var(--app-font-display)" }}>
            Questions
          </h2>
          <p>
            If you have any questions about this disclosure or our review process, you can reach us
            through the{" "}
            <Link href="/about" className="text-[#f5a623] underline underline-offset-2 hover:opacity-80 transition-opacity">
              About page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
