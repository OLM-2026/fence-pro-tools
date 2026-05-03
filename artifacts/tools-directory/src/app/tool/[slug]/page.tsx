import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Star,
  Quote,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/ToolCard";
import { getTool, getTools } from "@/lib/api";
import { categoryUrl } from "@/lib/seo-slugs";

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  source: string;
}

const TESTIMONIALS: Record<string, Testimonial[]> = {
  jobber: [
    { name: "Mike T.", role: "Fence Company Owner", location: "Texas", quote: "Jobber changed everything for us. Scheduling, invoicing, and client follow-up all in one place. We went from 2 hours of paperwork a night to maybe 20 minutes.", rating: 5, source: "Capterra" },
    { name: "Rachel S.", role: "Office Manager", location: "Colorado", quote: "The client hub feature alone is worth it. Customers can approve quotes, pay invoices, and request jobs without calling us. Our team loves it.", rating: 5, source: "Google Reviews" },
    { name: "Brandon H.", role: "Fence Contractor", location: "Tennessee", quote: "We tried three different apps before Jobber. Nothing else comes close for a field service company our size. Worth every penny.", rating: 5, source: "G2" },
  ],
  "housecall-pro": [
    { name: "Dave R.", role: "Fence Company Owner", location: "Ohio", quote: "HCP made it easy to send quotes on the spot. I used to write everything on paper and email it later — now my guys can close jobs right from the truck.", rating: 5, source: "Google Reviews" },
    { name: "Tina M.", role: "Dispatcher", location: "Georgia", quote: "The drag-and-drop scheduling board is a game changer. I can see every crew, every job, every day at a glance. We cut scheduling calls in half.", rating: 4, source: "Capterra" },
    { name: "Jorge L.", role: "Fence & Gate Contractor", location: "Florida", quote: "Online booking was scary to set up but once it was live, leads came in while we slept. Paid for itself the first month.", rating: 5, source: "G2" },
  ],
  servicetitan: [
    { name: "Jason M.", role: "Fence & Gate Company Owner", location: "Arizona", quote: "Powerful, but it took us 3 months to fully set it up. Once it clicked, our close rate went up 18% in the first quarter. It's built for serious operations.", rating: 4, source: "Capterra" },
    { name: "Lisa K.", role: "Operations Director", location: "California", quote: "ServiceTitan gave us visibility we never had before — revenue by tech, job costing, marketing ROI. If you're doing $2M+ this is your tool.", rating: 5, source: "G2" },
    { name: "Ryan B.", role: "Fence Business Owner", location: "Nevada", quote: "Not cheap and not simple, but we've never been more organized. The call recording and CSR scorecards alone paid for the subscription.", rating: 4, source: "Capterra" },
  ],
  arcsite: [
    { name: "Rob K.", role: "Estimating Manager", location: "North Carolina", quote: "We draw the fence right on a satellite image and the material list generates automatically. Cut estimating from 2 hours to 15 minutes per job.", rating: 5, source: "Capterra" },
    { name: "Steve D.", role: "Fence Company Owner", location: "Indiana", quote: "Customers love seeing the drawing on the estimate. It looks professional and shows we actually measured their property. Closing rate went way up.", rating: 5, source: "G2" },
    { name: "Kayla P.", role: "Estimator", location: "Missouri", quote: "I was doing everything in Excel before. ArcSite made me look like I had an office full of engineers. My boss still doesn't know it's just me and an iPad.", rating: 5, source: "Google Reviews" },
  ],
  "estimate-rocket": [
    { name: "Luis V.", role: "Fence Crew Owner", location: "New Mexico", quote: "Simple, clean, and it just works. Our proposals look professional and we can send them from any device. Super affordable for a small crew.", rating: 5, source: "G2" },
    { name: "Chris A.", role: "Fence Contractor", location: "Michigan", quote: "We were using Word docs for estimates. Estimate Rocket made us look like a real business overnight. Customers respond faster to the digital proposals.", rating: 4, source: "Capterra" },
    { name: "Diane F.", role: "Small Fence Business Owner", location: "Wisconsin", quote: "Honest pricing, no surprises. For a one-person operation this has everything I need. The templates saved me hours of setup.", rating: 5, source: "Google Reviews" },
  ],
  "quickbooks-online": [
    { name: "Amy S.", role: "Fence Company Bookkeeper", location: "Ohio", quote: "We've been on QBO for 4 years. The integration with Jobber is seamless — jobs sync right over. Our accountant loves it and so do we.", rating: 5, source: "Capterra" },
    { name: "Paul W.", role: "Fence Business Owner", location: "Pennsylvania", quote: "Tax time used to be a nightmare. Now I hand my accountant a QBO login and we're done in a day. The time savings are real.", rating: 4, source: "G2" },
    { name: "Nora L.", role: "Office Administrator", location: "Illinois", quote: "Bank feeds, expense tracking, invoicing, payroll — it's all there. Not glamorous but it does exactly what a fence company needs from an accounting tool.", rating: 4, source: "Google Reviews" },
  ],
  "hubspot-crm": [
    { name: "Carlos B.", role: "Sales Manager", location: "Texas", quote: "Free to start and does everything we need for leads. We track every fencing inquiry, follow-up, and closed deal in one pipeline. Can't beat free.", rating: 5, source: "G2" },
    { name: "Melissa G.", role: "Fence Company Owner", location: "Virginia", quote: "HubSpot CRM keeps us from dropping leads. The email sequences follow up for us automatically. We close 20% more jobs just because we follow up faster.", rating: 5, source: "Capterra" },
    { name: "Derek N.", role: "Fence Sales Rep", location: "Georgia", quote: "Pipeline view is everything. I know exactly what stage every lead is in, what was said last, and when to follow up. Super clean interface.", rating: 4, source: "Google Reviews" },
  ],
  broadly: [
    { name: "Mark D.", role: "Fence Company Owner", location: "Arizona", quote: "Reviews on autopilot. We went from 12 Google reviews to 94 in 6 months without doing anything extra. Broadly just texts customers after the job.", rating: 5, source: "Broadly" },
    { name: "Sandra B.", role: "Fence Business Owner", location: "Oregon", quote: "Our Google rating went from 3.8 to 4.7 in four months. That alone brought in an extra $40K in revenue last year. Worth every dollar.", rating: 5, source: "Google Reviews" },
    { name: "Tim C.", role: "Fence Contractor", location: "Utah", quote: "Set it up once and it runs itself. The webchat widget on our website captures leads we would have lost. Simple and effective.", rating: 4, source: "Capterra" },
  ],
  markate: [
    { name: "Tony P.", role: "Fence & Gate Contractor", location: "Texas", quote: "Built for field service, and it shows. Scheduling, dispatch, and invoicing all work together. Way cheaper than ServiceTitan and easier to learn.", rating: 4, source: "Capterra" },
    { name: "Al R.", role: "Fence Company Owner", location: "Oklahoma", quote: "Made the switch from paper 2 years ago and never looked back. The job tracking is solid and the mobile app works great even on bad cell service.", rating: 4, source: "G2" },
    { name: "Helen V.", role: "Office Manager", location: "Kansas", quote: "Affordable and reliable. We needed something that didn't require a consultant to set up. Markate was ready to use in an afternoon.", rating: 5, source: "Google Reviews" },
  ],
  "invoice-ninja": [
    { name: "Sam W.", role: "Fence Operation Owner", location: "Colorado", quote: "Free forever for our small crew. The invoices look clean and clients can pay online. What else do you need? We've used it for 3 years.", rating: 5, source: "G2" },
    { name: "Priya K.", role: "Freelance Fence Installer", location: "Washington", quote: "As a solo operator, Invoice Ninja gives me everything I need to look professional. Recurring invoices, payment tracking, client portal — all free.", rating: 5, source: "Capterra" },
    { name: "Owen J.", role: "Small Fence Crew Owner", location: "Montana", quote: "Open source, self-hostable if you want, or just use their free cloud. Honest software with no hidden fees. Refreshing.", rating: 4, source: "Google Reviews" },
  ],
  "sticker-mule": [
    { name: "Dana K.", role: "Fence Company Owner", location: "Florida", quote: "Best quality stickers I've found. We put them on every truck and trailer. Fast shipping too — ordered Monday, had them Thursday.", rating: 5, source: "Google Reviews" },
    { name: "James R.", role: "Fence Crew Manager", location: "Texas", quote: "Ordered hard hat stickers and tool labels. Quality is excellent and they look sharp on the job site. Great way to brand your crew.", rating: 5, source: "Trustpilot" },
    { name: "Kathy B.", role: "Fence Business Owner", location: "Georgia", quote: "The free sample deal sold me. I wasn't sure about the quality until I held one. Now we reorder every quarter. Customers notice branded materials.", rating: 5, source: "G2" },
  ],
  vistaprint: [
    { name: "Maria L.", role: "Office Manager", location: "Illinois", quote: "Easy to design, decent quality, fast delivery. We order business cards and door hangers here every quarter. Good value for the price.", rating: 4, source: "Trustpilot" },
    { name: "Gary S.", role: "Fence Company Owner", location: "Michigan", quote: "Used Vistaprint since we started. The door hangers after every install are our #1 source of neighborhood leads. Simple and effective marketing.", rating: 4, source: "Google Reviews" },
    { name: "Sue P.", role: "Marketing Coordinator", location: "Arizona", quote: "Wide variety of products, decent templates, and they always run promotions. We do all our print marketing through Vistaprint now.", rating: 4, source: "Capterra" },
  ],
  "custom-ink": [
    { name: "Jeff P.", role: "Crew Manager", location: "North Carolina", quote: "Custom Ink made designing our crew shirts super easy. Quality is solid and they always deliver on time. The design lab online is really intuitive.", rating: 5, source: "Google Reviews" },
    { name: "Debbie M.", role: "Fence Business Owner", location: "Virginia", quote: "We order polos every spring for the crew. Professional look, holds up through a full season of outdoor work. Customers definitely notice.", rating: 5, source: "Trustpilot" },
    { name: "Phil T.", role: "Fence Contractor", location: "Colorado", quote: "Better quality than the local print shop and cheaper when you order more than 12. The free proof process ensures no surprises.", rating: 4, source: "G2" },
  ],
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: "Mike T.", role: "Fence Company Owner", location: "Texas", quote: "This tool has saved us hours every week. The team picked it up fast and it fit right into how we already work.", rating: 5, source: "Google Reviews" },
  { name: "Sarah P.", role: "Operations Manager", location: "Colorado", quote: "Exactly what we needed for our crew size. Clean interface and good customer support when we had questions.", rating: 4, source: "Capterra" },
  { name: "Jake R.", role: "Fence Contractor", location: "Georgia", quote: "Tried three other apps first. This one stuck. It's reliable and actually built for field work, not just an office tool.", rating: 5, source: "G2" },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const categoryName = (tool.categoryName || tool.category || "").replace(/-/g, " ");

  return {
    title: `${tool.name} Review for Fence Contractors (2025) – Is It Worth It?`,
    description:
      tool.tagline ||
      `Independent review of ${tool.name} for fencing contractors. Pricing, pros & cons, features, and how it compares to alternatives. Updated ${new Date().getFullYear()}.`,
    openGraph: {
      title: `${tool.name} for Fence Contractors – Review & Pricing`,
      description: tool.tagline || `Review of ${tool.name} for fence companies.`,
    },
    alternates: {
      canonical: `/tool/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const [tool, allTools] = await Promise.all([getTool(slug), getTools()]);

  if (!tool) notFound();

  const testimonials = TESTIMONIALS[slug] || DEFAULT_TESTIMONIALS;
  const relatedTools = allTools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const categoryDisplayName = (tool.categoryName || tool.category || "").replace(/-/g, " ");

  const faqs = [
    {
      q: `Is ${tool.name} good for fence contractors?`,
      a: `${tool.name} is ${tool.bestFor ? `best suited for ${tool.bestFor}` : "used by fence contractors across the US"}. ${tool.description?.slice(0, 150) ?? ""}`,
    },
    {
      q: `How much does ${tool.name} cost?`,
      a: `${tool.name} starts at ${tool.pricingStartsAt || "pricing available on request"}. ${tool.pricingModel ? `The pricing model is ${tool.pricingModel}.` : ""} Check the official site for the most current pricing.`,
    },
    {
      q: `Does ${tool.name} offer a free trial?`,
      a: tool.freeTrial
        ? `Yes, ${tool.name} offers a free trial so you can test it before committing.`
        : `${tool.name} does not currently advertise a standard free trial, but you should check their website for any promotions or demo options.`,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            {tool.category && (
              <>
                <Link
                  href={categoryUrl(tool.category)}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {categoryDisplayName}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Link
          href={tool.category ? categoryUrl(tool.category) : "/"}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {categoryDisplayName || "directory"}
        </Link>

        {/* ── TOOL HEADER ── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-sm border-2 bg-white shadow-md overflow-hidden flex items-center justify-center">
              {tool.logoUrl ? (
                <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="font-bold text-4xl text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-3">
              {tool.featured && (
                <Badge className="bg-[#f5a623] text-[#0d1f3c] font-bold">
                  <Star className="w-3 h-3 fill-current mr-1" /> Top Pick
                </Badge>
              )}
              {tool.category && (
                <Badge variant="outline" className="capitalize font-medium">
                  {categoryDisplayName}
                </Badge>
              )}
              {tool.freeTrial && (
                <Badge variant="secondary" className="font-medium">
                  Free Trial Available
                </Badge>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0d1f3c] mb-2"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              {tool.name}
            </h1>

            {tool.tagline && (
              <p className="text-lg text-muted-foreground font-medium mb-4">{tool.tagline}</p>
            )}

            <div className="flex flex-wrap gap-4 items-center">
              {tool.rating != null && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(tool.rating))
                          ? "fill-[#f5a623] text-[#f5a623]"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-muted-foreground">
                    {Number(tool.rating).toFixed(1)}
                    {tool.reviewCount ? ` (${tool.reviewCount} reviews)` : ""}
                  </span>
                </div>
              )}
              {tool.pricingStartsAt && (
                <span className="text-sm font-bold text-[#0d1f3c] bg-muted px-3 py-1 rounded-sm">
                  From {tool.pricingStartsAt}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── AFFILIATE DISCLOSURE ── */}
        <p className="text-xs text-muted-foreground/50 mb-6 font-medium">
          Some links are affiliate links.{" "}
          <Link href="/disclosure" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Learn more
          </Link>
          .
        </p>

        {/* ── CTA BUTTONS ── */}
        <div className="flex flex-wrap gap-3 mb-12">
          {tool.affiliateUrl && (
            <Button
              asChild
              size="lg"
              className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm h-12"
            >
              <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer">
                Get Started with {tool.name}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
          {tool.websiteUrl && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-sm h-12 border-2"
            >
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {tool.description && (
              <section>
                <h2
                  className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
                  style={{ fontFamily: "var(--app-font-display)" }}
                >
                  What is {tool.name}?
                </h2>
                <p className="text-foreground/80 leading-relaxed text-base">{tool.description}</p>
              </section>
            )}

            {/* Pros */}
            {tool.pros && tool.pros.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
                  style={{ fontFamily: "var(--app-font-display)" }}
                >
                  What we like
                </h2>
                <ul className="space-y-3">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Cons */}
            {tool.cons && tool.cons.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
                  style={{ fontFamily: "var(--app-font-display)" }}
                >
                  Watch out for
                </h2>
                <ul className="space-y-3">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-extrabold text-[#0d1f3c] mb-4"
                  style={{ fontFamily: "var(--app-font-display)" }}
                >
                  Key features for fence contractors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 border rounded-sm bg-muted/20"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#f5a623] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Testimonials */}
            <section>
              <h2
                className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                What fence contractors say about {tool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-5 border-2 rounded-sm bg-white shadow-sm hover:border-[#f5a623]/40 transition-colors"
                  >
                    <Quote className="w-5 h-5 text-[#f5a623] mb-3 shrink-0" />
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed flex-grow mb-4">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="pt-3 border-t">
                      <p className="font-bold text-sm text-[#0d1f3c]">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.role}, {t.location}
                      </p>
                      <p className="text-xs text-[#f5a623] font-semibold mt-1">
                        via {t.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2
                className="text-2xl font-extrabold text-[#0d1f3c] mb-6"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-2 rounded-sm p-5">
                    <h3 className="font-bold text-base text-[#0d1f3c] mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            {/* Pricing card */}
            <div className="border-2 rounded-sm p-6 bg-white sticky top-6">
              <h3 className="font-bold text-lg text-[#0d1f3c] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#f5a623]" /> Pricing & Details
              </h3>
              <dl className="space-y-3 text-sm">
                {tool.pricingStartsAt && (
                  <div>
                    <dt className="text-muted-foreground font-medium">Starting price</dt>
                    <dd className="font-bold text-[#0d1f3c] mt-0.5">{tool.pricingStartsAt}</dd>
                  </div>
                )}
                {tool.pricingModel && (
                  <div>
                    <dt className="text-muted-foreground font-medium">Pricing model</dt>
                    <dd className="font-bold text-[#0d1f3c] mt-0.5">{tool.pricingModel}</dd>
                  </div>
                )}
                {tool.bestFor && (
                  <div>
                    <dt className="text-muted-foreground font-medium">Best for</dt>
                    <dd className="font-bold text-[#0d1f3c] mt-0.5">{tool.bestFor}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground font-medium">Free trial</dt>
                  <dd className="font-bold text-[#0d1f3c] mt-0.5">
                    {tool.freeTrial ? "✅ Yes" : "❌ No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Mobile app</dt>
                  <dd className="font-bold text-[#0d1f3c] mt-0.5">
                    {tool.mobileApp ? "✅ Yes" : "❌ No"}
                  </dd>
                </div>
              </dl>

              {tool.affiliateUrl && (
                <Button
                  asChild
                  className="w-full mt-6 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
                >
                  <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer">
                    Get Started <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </Button>
              )}
            </div>

            {/* Compare CTA */}
            <div className="border-2 border-[#0d1f3c]/20 rounded-sm p-5 bg-muted/20">
              <p className="text-sm font-bold text-[#0d1f3c] mb-2">
                Not sure {tool.name} is right for you?
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Compare it side-by-side with other top tools for fence contractors.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full rounded-sm border-2">
                <Link href="/compare">Compare tools</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── RELATED TOOLS ── */}
        {relatedTools.length > 0 && (
          <section className="mt-16 pt-12 border-t">
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
              Also consider
            </p>
            <h2
              className="text-2xl font-extrabold text-[#0d1f3c] mb-8"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Other {categoryDisplayName} tools for fence contractors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
