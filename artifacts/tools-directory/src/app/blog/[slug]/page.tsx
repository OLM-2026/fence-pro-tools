import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
}

const ARTICLES: Article[] = [
  {
    slug: "best-fence-estimating-software",
    title: "The 6 Best Fence Estimating Software Tools in 2025",
    category: "Estimating",
    date: "2025-01-15",
    readTime: "8 min read",
    excerpt:
      "Stop guessing on quotes. These six estimating tools help fence contractors produce accurate, professional estimates faster — some in under 15 minutes per job.",
    content: `
Accurate estimates win jobs. Slow, inaccurate estimates lose them. If you're still building quotes in Excel or worse — writing them by hand — you're leaving money on the table and burning time you don't have.

Here are the six best fence estimating software tools we've reviewed for 2025, ranked by ease of use, accuracy, and fit for fencing operations.

## 1. ArcSite — Best for on-site sketching and material takeoff

ArcSite lets you draw a fence directly on a satellite image of the job site. The software automatically calculates linear footage, gates, corners, and generates a material list. Most estimators can produce a complete quote in 15 minutes or less.

**Best for:** Companies that want to close jobs on-site. Sales teams that do estimates on an iPad.

**Starting price:** ~$49/month per user

## 2. Jobber — Best all-in-one for small to mid-size operations

Jobber isn't a dedicated estimating tool, but its quoting features are strong enough for most fence contractors. You can build templates, send digital quotes, and track when clients open them. The big advantage: it's connected to your scheduling, invoicing, and CRM in one place.

**Best for:** Operations that want one platform for the whole business.

**Starting price:** From $69/month

## 3. Estimate Rocket — Best for clean, professional proposals

Estimate Rocket focuses on making proposals look professional and making it easy for clients to approve electronically. It's simpler than ArcSite but works well for fence companies that want to standardize their quoting process.

**Best for:** Small crews focused on residential fencing.

**Starting price:** From $59/month

## 4. Housecall Pro — Best for residential fence companies

Housecall Pro combines quoting, scheduling, and invoicing in one platform. The mobile app is genuinely good, making it practical for estimators who do on-site visits.

**Best for:** Residential fence operations with 1-10 crews.

**Starting price:** From $79/month

## 5. ServiceTitan — Best for large commercial operations

ServiceTitan is enterprise-grade and built for companies doing significant revenue ($2M+). The estimating features are powerful but require more setup and training.

**Best for:** Established fence companies with dedicated operations staff.

**Starting price:** Custom pricing, typically $200+/month

## 6. QuickBooks Online — Best as an invoicing companion to other tools

QuickBooks isn't really an estimating tool, but its estimate-to-invoice workflow is reliable and widely used. Best combined with a dedicated estimating tool like ArcSite or Estimate Rocket.

**Best for:** Companies already on QuickBooks who want basic quote functionality.

**Starting price:** From $35/month

---

The right estimating tool depends on your operation size, how many estimates you produce per week, and whether you want an all-in-one platform or a dedicated estimating tool. Browse each tool's full review for more detail.
    `,
  },
  {
    slug: "jobber-vs-housecall-pro",
    title: "Jobber vs Housecall Pro: Which Is Better for Fence Contractors?",
    category: "CRM & Scheduling",
    date: "2025-01-10",
    readTime: "10 min read",
    excerpt:
      "Both are popular field service platforms. But which one actually works better for fencing operations?",
    content: `
Jobber and Housecall Pro are the two most popular field service platforms for fence contractors. Both handle quotes, scheduling, invoicing, and customer communication. But they're not identical — and depending on your operation, one will fit significantly better.

## The short answer

- **Jobber** is better for operations that want a cleaner interface, stronger client communication, and slightly more flexibility in pricing.
- **Housecall Pro** is better if you need a powerful scheduling board and want consumers to be able to book online.

## Pricing comparison

| | Jobber | Housecall Pro |
|---|---|---|
| Starting price | $69/mo | $79/mo |
| Mid-tier | $169/mo | $169/mo |
| Annual discount | Yes | Yes |
| Free trial | 14 days | 14 days |

## Scheduling

Housecall Pro's drag-and-drop scheduling board is one of its best features. Dispatchers can see every crew, every job, and move things around visually. Jobber's scheduling is solid but slightly less visual.

**Edge: Housecall Pro**

## Quoting and estimates

Both platforms allow digital quotes with e-signatures. Jobber's quote templates are more flexible. Housecall Pro's are simpler to build but less customizable.

**Edge: Jobber**

## Mobile app

Both have strong mobile apps. Housecall Pro's field app is well-reviewed by crews for its simplicity. Jobber's app has more features but slightly more complexity.

**Edge: Tie**

## Customer communication

Jobber's client hub is a standout feature. Customers get a portal to approve quotes, pay invoices, and request work without calling. This can significantly reduce office workload.

**Edge: Jobber**

## Online booking

Housecall Pro has a robust online booking widget that lets customers book directly on your website. Jobber has a basic version. If lead generation via your website matters to you, Housecall Pro is ahead.

**Edge: Housecall Pro**

## Our pick

For most fence contractors — especially those running 1-5 crews — **Jobber** is the slightly stronger choice. The client hub alone can save significant office time. But if you dispatch a lot of crews and want powerful scheduling, Housecall Pro is excellent.
    `,
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) notFound();

  const lines = article.content.trim().split("\n");

  return (
    <div className="min-h-screen">
      <div className="bg-[#0d1f3c] text-white py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to resources
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-[#f5a623] bg-[#f5a623]/10 px-2 py-1 rounded-sm uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            {article.title}
          </h1>
          <p className="text-white/60 text-lg font-medium">{article.excerpt}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <article className="prose prose-gray max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-2xl font-extrabold text-[#0d1f3c] mt-10 mb-4"
                  style={{ fontFamily: "var(--app-font-display)" }}
                >
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("**Best for:**")) {
              return (
                <p key={i} className="text-sm font-semibold text-[#0d1f3c] my-1">
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            }
            if (line.startsWith("**")) {
              const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
              if (boldMatch) {
                return (
                  <p key={i} className="text-sm text-muted-foreground my-1">
                    <strong className="text-foreground">{boldMatch[1]}</strong>
                    {boldMatch[2]}
                  </p>
                );
              }
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="text-muted-foreground text-sm ml-4">
                  {line.replace("- ", "")}
                </li>
              );
            }
            if (line.startsWith("---")) {
              return <hr key={i} className="my-8 border-border" />;
            }
            if (line.startsWith("|") && line.endsWith("|")) {
              return null;
            }
            if (line.trim() === "") {
              return <div key={i} className="h-3" />;
            }
            return (
              <p key={i} className="text-muted-foreground text-base leading-relaxed">
                {line}
              </p>
            );
          })}
        </article>

        <div className="mt-14 border-t pt-10">
          <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
            Ready to compare tools?
          </p>
          <h2
            className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            Browse the full software directory
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
            >
              <Link href="/category/all">Browse all tools</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-sm border-2">
              <Link href="/compare">Compare tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
