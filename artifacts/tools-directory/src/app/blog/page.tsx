import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Fence Contractor Resources & Software Guides – FenceProTools",
  description:
    "Guides, comparisons, and tips for fence contractors on choosing and using the right software for their business. Updated regularly.",
};

const ARTICLES = [
  {
    slug: "best-fence-estimating-software",
    title: "The 6 Best Fence Estimating Software Tools in 2025",
    category: "Estimating",
    date: "2025-01-15",
    excerpt:
      "Stop guessing on quotes. These six estimating tools help fence contractors produce accurate, professional estimates faster — some in under 15 minutes per job.",
    readTime: "8 min read",
  },
  {
    slug: "jobber-vs-housecall-pro",
    title: "Jobber vs Housecall Pro: Which Is Better for Fence Contractors?",
    category: "CRM & Scheduling",
    date: "2025-01-10",
    excerpt:
      "Both are popular field service platforms. But which one actually works better for fencing operations? We break down pricing, scheduling, invoicing, and real contractor feedback.",
    readTime: "10 min read",
  },
  {
    slug: "how-to-automate-fence-business",
    title: "How to Automate Your Fence Business (Even With a Small Crew)",
    category: "Operations",
    date: "2025-01-05",
    excerpt:
      "You don't need 10 employees to run an efficient fence company. The right software stack — estimating, scheduling, invoicing, and CRM — can replace your biggest time drains.",
    readTime: "12 min read",
  },
  {
    slug: "fence-crm-software-guide",
    title: "Do Fence Contractors Really Need a CRM? (Yes. Here's Why.)",
    category: "CRM",
    date: "2024-12-28",
    excerpt:
      "Most fence companies lose 20-30% of their leads to poor follow-up. A simple CRM fixes that. Here's what to look for and which ones work best for fencing.",
    readTime: "7 min read",
  },
  {
    slug: "fence-business-software-stack-2025",
    title: "The Complete Fence Business Software Stack for 2025",
    category: "Guides",
    date: "2024-12-20",
    excerpt:
      "What software should a fence company run? Estimating, scheduling, CRM, invoicing, accounting, and marketing — here's exactly what we'd set up for a fence business today.",
    readTime: "15 min read",
  },
  {
    slug: "arcsite-review-fence-contractors",
    title: "ArcSite Review: Is It Worth It for Fence Estimating?",
    category: "Estimating",
    date: "2024-12-15",
    excerpt:
      "ArcSite lets you sketch a fence layout on a satellite image and get a material list automatically. But is it accurate enough for real-world fence jobs? Our honest review.",
    readTime: "9 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0d1f3c] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#f5a623]" />
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs">
              Resources & guides
            </p>
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Everything you need to run a smarter fence business
          </h1>
          <p className="text-white/60 max-w-2xl text-lg font-medium">
            Guides, comparisons, and tools for fence contractors who want to work smarter, not harder.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col border-2 rounded-sm hover:border-[#f5a623] hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#f5a623] bg-[#f5a623]/10 px-2 py-1 rounded-sm uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h2 className="font-bold text-lg text-[#0d1f3c] group-hover:text-[#f5a623] transition-colors mb-3 leading-tight">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center gap-1 text-sm font-bold text-[#f5a623]">
                  Read article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
