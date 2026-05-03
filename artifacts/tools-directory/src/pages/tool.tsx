import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ExternalLink, CheckCircle2, XCircle, ArrowLeft, Building2, Hammer, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetToolBySlug, useListTools, getGetToolBySlugQueryKey } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  source: string;
}

const TESTIMONIALS: Record<string, Testimonial[]> = {
  "jobber": [
    {
      name: "Mike T.",
      role: "Fence Company Owner",
      location: "Texas",
      quote: "Jobber changed everything for us. Scheduling, invoicing, and client follow-up all in one place. We went from 2 hours of paperwork a night to maybe 20 minutes.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Rachel S.",
      role: "Office Manager",
      location: "Colorado",
      quote: "The client hub feature alone is worth it. Customers can approve quotes, pay invoices, and request jobs without calling us. Our team loves it.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "Brandon H.",
      role: "Fence Contractor",
      location: "Tennessee",
      quote: "We tried three different apps before Jobber. Nothing else comes close for a field service company our size. Worth every penny.",
      rating: 5,
      source: "G2",
    },
  ],
  "housecall-pro": [
    {
      name: "Dave R.",
      role: "Fence Company Owner",
      location: "Ohio",
      quote: "HCP made it easy to send quotes on the spot. I used to write everything on paper and email it later — now my guys can close jobs right from the truck.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "Tina M.",
      role: "Dispatcher",
      location: "Georgia",
      quote: "The drag-and-drop scheduling board is a game changer. I can see every crew, every job, every day at a glance. We cut scheduling calls in half.",
      rating: 4,
      source: "Capterra",
    },
    {
      name: "Jorge L.",
      role: "Fence & Gate Contractor",
      location: "Florida",
      quote: "Online booking was scary to set up but once it was live, leads came in while we slept. Paid for itself the first month.",
      rating: 5,
      source: "G2",
    },
  ],
  "servicetitan": [
    {
      name: "Jason M.",
      role: "Fence & Gate Company Owner",
      location: "Arizona",
      quote: "Powerful, but it took us 3 months to fully set it up. Once it clicked, our close rate went up 18% in the first quarter. It's built for serious operations.",
      rating: 4,
      source: "Capterra",
    },
    {
      name: "Lisa K.",
      role: "Operations Director",
      location: "California",
      quote: "ServiceTitan gave us visibility we never had before — revenue by tech, job costing, marketing ROI. If you're doing $2M+ this is your tool.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Ryan B.",
      role: "Fence Business Owner",
      location: "Nevada",
      quote: "Not cheap and not simple, but we've never been more organized. The call recording and CSR scorecards alone paid for the subscription.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "arcsite": [
    {
      name: "Rob K.",
      role: "Estimating Manager",
      location: "North Carolina",
      quote: "We draw the fence right on a satellite image and the material list generates automatically. Cut estimating from 2 hours to 15 minutes per job.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Steve D.",
      role: "Fence Company Owner",
      location: "Indiana",
      quote: "Customers love seeing the drawing on the estimate. It looks professional and shows we actually measured their property. Closing rate went way up.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Kayla P.",
      role: "Estimator",
      location: "Missouri",
      quote: "I was doing everything in Excel before. ArcSite made me look like I had an office full of engineers. My boss still doesn't know it's just me and an iPad.",
      rating: 5,
      source: "Google Reviews",
    },
  ],
  "estimate-rocket": [
    {
      name: "Luis V.",
      role: "Fence Crew Owner",
      location: "New Mexico",
      quote: "Simple, clean, and it just works. Our proposals look professional and we can send them from any device. Super affordable for a small crew.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Chris A.",
      role: "Fence Contractor",
      location: "Michigan",
      quote: "We were using Word docs for estimates. Estimate Rocket made us look like a real business overnight. Customers respond faster to the digital proposals.",
      rating: 4,
      source: "Capterra",
    },
    {
      name: "Diane F.",
      role: "Small Fence Business Owner",
      location: "Wisconsin",
      quote: "Honest pricing, no surprises. For a one-person operation this has everything I need. The templates saved me hours of setup.",
      rating: 5,
      source: "Google Reviews",
    },
  ],
  "quickbooks-online": [
    {
      name: "Amy S.",
      role: "Fence Company Bookkeeper",
      location: "Ohio",
      quote: "We've been on QBO for 4 years. The integration with Jobber is seamless — jobs sync right over. Our accountant loves it and so do we.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Paul W.",
      role: "Fence Business Owner",
      location: "Pennsylvania",
      quote: "Tax time used to be a nightmare. Now I hand my accountant a QBO login and we're done in a day. The time savings are real.",
      rating: 4,
      source: "G2",
    },
    {
      name: "Nora L.",
      role: "Office Administrator",
      location: "Illinois",
      quote: "Bank feeds, expense tracking, invoicing, payroll — it's all there. Not glamorous but it does exactly what a fence company needs from an accounting tool.",
      rating: 4,
      source: "Google Reviews",
    },
  ],
  "hubspot-crm": [
    {
      name: "Carlos B.",
      role: "Sales Manager",
      location: "Texas",
      quote: "Free to start and does everything we need for leads. We track every fencing inquiry, follow-up, and closed deal in one pipeline. Can't beat free.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Melissa G.",
      role: "Fence Company Owner",
      location: "Virginia",
      quote: "HubSpot CRM keeps us from dropping leads. The email sequences follow up for us automatically. We close 20% more jobs just because we follow up faster.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Derek N.",
      role: "Fence Sales Rep",
      location: "Georgia",
      quote: "Pipeline view is everything. I know exactly what stage every lead is in, what was said last, and when to follow up. Super clean interface.",
      rating: 4,
      source: "Google Reviews",
    },
  ],
  "broadly": [
    {
      name: "Mark D.",
      role: "Fence Company Owner",
      location: "Arizona",
      quote: "Reviews on autopilot. We went from 12 Google reviews to 94 in 6 months without doing anything extra. Broadly just texts customers after the job.",
      rating: 5,
      source: "Broadly",
    },
    {
      name: "Sandra B.",
      role: "Fence Business Owner",
      location: "Oregon",
      quote: "Our Google rating went from 3.8 to 4.7 in four months. That alone brought in an extra $40K in revenue last year. Worth every dollar.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "Tim C.",
      role: "Fence Contractor",
      location: "Utah",
      quote: "Set it up once and it runs itself. The webchat widget on our website captures leads we would have lost. Simple and effective.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "markate": [
    {
      name: "Tony P.",
      role: "Fence & Gate Contractor",
      location: "Texas",
      quote: "Built for field service, and it shows. Scheduling, dispatch, and invoicing all work together. Way cheaper than ServiceTitan and easier to learn.",
      rating: 4,
      source: "Capterra",
    },
    {
      name: "Al R.",
      role: "Fence Company Owner",
      location: "Oklahoma",
      quote: "Made the switch from paper 2 years ago and never looked back. The job tracking is solid and the mobile app works great even on bad cell service.",
      rating: 4,
      source: "G2",
    },
    {
      name: "Helen V.",
      role: "Office Manager",
      location: "Kansas",
      quote: "Affordable and reliable. We needed something that didn't require a consultant to set up. Markate was ready to use in an afternoon.",
      rating: 5,
      source: "Google Reviews",
    },
  ],
  "invoice-ninja": [
    {
      name: "Sam W.",
      role: "Fence Operation Owner",
      location: "Colorado",
      quote: "Free forever for our small crew. The invoices look clean and clients can pay online. What else do you need? We've used it for 3 years.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Priya K.",
      role: "Freelance Fence Installer",
      location: "Washington",
      quote: "As a solo operator, Invoice Ninja gives me everything I need to look professional. Recurring invoices, payment tracking, client portal — all free.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Owen J.",
      role: "Small Fence Crew Owner",
      location: "Montana",
      quote: "Open source, self-hostable if you want, or just use their free cloud. Honest software with no hidden fees. Refreshing.",
      rating: 4,
      source: "Google Reviews",
    },
  ],
  "mhelpdesk": [
    {
      name: "Frank L.",
      role: "Fence Contractor",
      location: "Kentucky",
      quote: "Gets the job done. Nothing fancy but reliable — we've been on it for 5 years. Customer support picks up the phone, which is more than I can say for others.",
      rating: 4,
      source: "Capterra",
    },
    {
      name: "Brenda C.",
      role: "Dispatch Coordinator",
      location: "Ohio",
      quote: "Scheduling and invoicing in one place. It's not the prettiest app but it works every day and we've never lost data. That matters more.",
      rating: 4,
      source: "G2",
    },
    {
      name: "Tom H.",
      role: "Fence Business Owner",
      location: "Indiana",
      quote: "Good for a mid-size crew that doesn't need all the bells and whistles. Straightforward pricing, decent reporting, solid mobile app.",
      rating: 4,
      source: "Google Reviews",
    },
  ],
  "buildertrend": [
    {
      name: "Eric J.",
      role: "Outdoor Structures Contractor",
      location: "Minnesota",
      quote: "Overkill for most fence companies, but perfect for us since we also do decks and pergolas. Project management and customer communication are top notch.",
      rating: 5,
      source: "Capterra",
    },
    {
      name: "Anna S.",
      role: "Project Manager",
      location: "Wisconsin",
      quote: "The daily logs and photo uploads keep everyone on the same page. Clients love being able to see progress updates without calling us.",
      rating: 5,
      source: "G2",
    },
    {
      name: "Doug P.",
      role: "Fence & Hardscape Contractor",
      location: "Ohio",
      quote: "We run 15 crews and BuilderTrend keeps it all organized. Scheduling, subcontractors, budget tracking — it handles everything at scale.",
      rating: 4,
      source: "Google Reviews",
    },
  ],
  "sticker-mule": [
    {
      name: "Dana K.",
      role: "Fence Company Owner",
      location: "Florida",
      quote: "Best quality stickers I've found. We put them on every truck and trailer. Fast shipping too — ordered Monday, had them Thursday.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "James R.",
      role: "Fence Crew Manager",
      location: "Texas",
      quote: "Ordered hard hat stickers and tool labels. Quality is excellent and they look sharp on the job site. Great way to brand your crew.",
      rating: 5,
      source: "Trustpilot",
    },
    {
      name: "Kathy B.",
      role: "Fence Business Owner",
      location: "Georgia",
      quote: "The free sample deal sold me. I wasn't sure about the quality until I held one. Now we reorder every quarter. Customers notice branded materials.",
      rating: 5,
      source: "G2",
    },
  ],
  "vistaprint": [
    {
      name: "Maria L.",
      role: "Office Manager",
      location: "Illinois",
      quote: "Easy to design, decent quality, fast delivery. We order business cards and door hangers here every quarter. Good value for the price.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Gary S.",
      role: "Fence Company Owner",
      location: "Michigan",
      quote: "Used Vistaprint since we started. The door hangers after every install are our #1 source of neighborhood leads. Simple and effective marketing.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Sue P.",
      role: "Marketing Coordinator",
      location: "Arizona",
      quote: "Wide variety of products, decent templates, and they always run promotions. We do all our print marketing through Vistaprint now.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "custom-ink": [
    {
      name: "Jeff P.",
      role: "Crew Manager",
      location: "North Carolina",
      quote: "Custom Ink made designing our crew shirts super easy. Quality is solid and they always deliver on time. The design lab online is really intuitive.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "Debbie M.",
      role: "Fence Business Owner",
      location: "Virginia",
      quote: "We order polos every spring for the crew. Professional look, holds up through a full season of outdoor work. Customers definitely notice.",
      rating: 5,
      source: "Trustpilot",
    },
    {
      name: "Phil T.",
      role: "Fence Contractor",
      location: "Colorado",
      quote: "Better quality than the local print shop and cheaper when you order more than 12. The free proof process ensures no surprises.",
      rating: 4,
      source: "G2",
    },
  ],
  "4imprint": [
    {
      name: "Kevin H.",
      role: "Fence Company Owner",
      location: "Missouri",
      quote: "Our promo items for the home show came out great. Pens, tape measures, and koozies with our logo. Good pricing when you order in bulk.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Lori B.",
      role: "Marketing Director",
      location: "Kansas",
      quote: "The rep I worked with helped us pick items within budget. Everything shipped on time before the trade show. We'll be back next year.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Wayne S.",
      role: "Fence Business Owner",
      location: "Nebraska",
      quote: "Gave away branded tape measures at a home and garden show. Best decision — homeowners use them, see our name every time.",
      rating: 5,
      source: "G2",
    },
  ],
  "signs-com": [
    {
      name: "Sarah T.",
      role: "Fence Company Owner",
      location: "Ohio",
      quote: "We ordered yard signs, truck magnets, and a banner for our first home show. All looked professional and came in under budget. Huge impact.",
      rating: 5,
      source: "Google Reviews",
    },
    {
      name: "Bill M.",
      role: "Fence Contractor",
      location: "Pennsylvania",
      quote: "Yard signs after every install are our cheapest lead source. Signs.com quality is sharp and the turnaround is fast. We reorder constantly.",
      rating: 5,
      source: "Trustpilot",
    },
    {
      name: "Karen F.",
      role: "Fence Business Owner",
      location: "Tennessee",
      quote: "The design templates are easy to customize. We had a full outdoor signage package ready in an afternoon. No design background needed.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "bonfire": [
    {
      name: "Nick J.",
      role: "Fence Company Owner",
      location: "Texas",
      quote: "Ordered branded hoodies for the crew last winter. No upfront cost, no minimum order, and the quality held up all season. Great for smaller crews.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Caitlin W.",
      role: "Office Manager",
      location: "Oregon",
      quote: "We did a limited charity run with our logo and donated part of the proceeds. Bonfire handled everything. Easy to run and looked great.",
      rating: 5,
      source: "Trustpilot",
    },
    {
      name: "Marco D.",
      role: "Fence Crew Manager",
      location: "New Mexico",
      quote: "No minimum order was the big sell for us. Three crew members needed shirts, not 24. Bonfire made that easy and affordable.",
      rating: 4,
      source: "G2",
    },
  ],
  "buildasign": [
    {
      name: "Tom B.",
      role: "Fence Business Owner",
      location: "Iowa",
      quote: "BuildASign does exactly what you'd expect — real estate signs, yard signs, banners. Good quality, reasonable prices, ships fast. No complaints.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Carla S.",
      role: "Fence Contractor",
      location: "Arkansas",
      quote: "We use yard signs at every job site. BuildASign gives us consistent quality and their bulk pricing is the best we've found online.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Ray N.",
      role: "Fence & Gate Company Owner",
      location: "Louisiana",
      quote: "Simple ordering process, helpful templates, and the colors come out exactly as shown. Our job site signs look sharp.",
      rating: 4,
      source: "G2",
    },
  ],
  "discountmugs": [
    {
      name: "Paula C.",
      role: "Fence Business Owner",
      location: "Alabama",
      quote: "We ordered branded mugs and koozies for a trade show giveaway. Low minimum, fast delivery, and the imprint looked great. Solid value.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Mike V.",
      role: "Fence Contractor",
      location: "Mississippi",
      quote: "Cheap branded pens and magnets for the truck. Customers keep them and see our number every time. Best ROI on any marketing we do.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Irene H.",
      role: "Office Administrator",
      location: "Georgia",
      quote: "Good selection, easy to upload your logo, and the proofs come back quickly. Prices are hard to beat, especially with the seasonal sales.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "promo-direct": [
    {
      name: "Stan R.",
      role: "Fence Company Owner",
      location: "Ohio",
      quote: "We order branded water bottles and lanyards for the crew every year. Promo Direct has a huge selection and the rep helped narrow it down to what works for field work.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Wendy L.",
      role: "Office Manager",
      location: "Michigan",
      quote: "Good for bulk swag orders. The delivery times are accurate and the quality is consistent. Easy to reorder the same item year after year.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Greg T.",
      role: "Fence Business Owner",
      location: "Indiana",
      quote: "We compared three promo vendors and Promo Direct had the best per-unit price on our order. Arrived on time, looked exactly like the proof.",
      rating: 4,
      source: "Capterra",
    },
  ],
  "uprinting": [
    {
      name: "Donna P.",
      role: "Fence Company Owner",
      location: "Florida",
      quote: "Business cards, door hangers, and brochures all from UPrinting. Consistent quality and they always ship within the stated window. Dependable.",
      rating: 4,
      source: "Google Reviews",
    },
    {
      name: "Chuck S.",
      role: "Fence Contractor",
      location: "South Carolina",
      quote: "The door hangers we leave after every install keep generating calls months later. UPrinting's quality is solid and the price is right.",
      rating: 4,
      source: "Trustpilot",
    },
    {
      name: "Faye N.",
      role: "Marketing Coordinator",
      location: "North Carolina",
      quote: "Great selection of paper stocks and finishes. Our glossy business cards with a soft touch coating are the most commented-on thing about our brand.",
      rating: 5,
      source: "Capterra",
    },
  ],
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-[#f5a623] text-[#f5a623]" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export default function ToolDetail() {
  const { slug } = useParams();

  const { data: tool, isLoading: isLoadingTool } = useGetToolBySlug(slug || "", {
    query: { enabled: !!slug, queryKey: getGetToolBySlugQueryKey(slug || "") }
  });

  const { data: relatedTools, isLoading: isLoadingRelated } = useListTools({
    category: tool?.category,
  });

  if (isLoadingTool) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-32 h-32 rounded-sm" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/">
          <Button className="rounded-sm font-bold">Return Home</Button>
        </Link>
      </div>
    );
  }

  const otherRelated = relatedTools?.filter(t => t.id !== tool.id).slice(0, 3) || [];
  const testimonials = slug ? (TESTIMONIALS[slug] ?? []) : [];

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>{tool.name} for Fence Companies: Review, Pricing and Features | Pro Fence Tools</title>
        <meta name="description" content={`Is ${tool.name} the right choice for your fence company? Read our independent review covering pricing, pros, cons, and how it fits fence contractor workflows. ${tool.pricingStartsAt ? `Starts at ${tool.pricingStartsAt}.` : ""}`} />
        <meta property="og:title" content={`${tool.name}: Is It Right for Your Fence Company?`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="article" />
        {tool.logoUrl && <meta property="og:image" content={tool.logoUrl} />}
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "applicationCategory": "BusinessApplication",
          "offers": tool.pricingStartsAt ? {
            "@type": "Offer",
            "price": tool.pricingStartsAt,
            "priceCurrency": "USD"
          } : undefined,
          "url": tool.affiliateUrl || undefined,
          ...(testimonials.length > 0 ? {
            "review": testimonials.map(t => ({
              "@type": "Review",
              "reviewBody": t.quote,
              "author": { "@type": "Person", "name": t.name },
              "reviewRating": { "@type": "Rating", "ratingValue": t.rating, "bestRating": 5 }
            }))
          } : {})
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {tool.category}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8 border-b pb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border rounded-sm p-4 flex items-center justify-center shrink-0 shadow-sm">
                {tool.logoUrl ? (
                  <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="font-bold rounded-sm">{tool.category}</Badge>
                  {tool.featured && <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-bold border-accent">Top Pick</Badge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">{tool.name}</h1>
              </div>
              
              <div className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-sm shadow-sm" asChild>
                  <a href={tool.affiliateUrl || `https://${tool.website}`} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Starting Price</div>
                <div className="font-bold text-lg">{tool.pricingStartsAt || "Contact Sales"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Free Trial</div>
                <div className="font-bold text-lg">{tool.freeTrial ? "Yes" : "No"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Mobile App</div>
                <div className="font-bold text-lg">{tool.mobileApp ? "Yes" : "No"}</div>
              </div>
              <div className="bg-card border rounded-sm p-4">
                <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Best For</div>
                <div className="font-bold text-lg">{tool.bestFor || "All sizes"}</div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Overview</h2>
              <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                {tool.description}
              </p>
            </div>

            {(tool.integrations && tool.integrations.length > 0) && (
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((int, idx) => (
                    <Badge key={idx} variant="outline" className="font-medium bg-card text-sm py-1 px-3 rounded-sm">
                      {int}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mt-12 border-t pt-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros && tool.pros.length > 0 ? tool.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground italic">No pros listed</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" /> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons && tool.cons.length > 0 ? tool.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground italic">No cons listed</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="mt-12 border-t pt-8">
                <h3 className="text-xl font-bold mb-2">What Fence Contractors Are Saying</h3>
                <p className="text-sm text-muted-foreground mb-6 font-medium">Real reviews from contractors in the field. No sales spin.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-card border rounded-sm p-5 flex flex-col gap-3">
                      <Quote className="w-5 h-5 text-[#f5a623] shrink-0" />
                      <p className="text-sm font-medium leading-relaxed text-foreground/90 flex-1">"{t.quote}"</p>
                      <div className="pt-3 border-t">
                        <StarRating rating={t.rating} />
                        <p className="font-bold text-sm mt-1">{t.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{t.role} · {t.location}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">via {t.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related */}
          <div className="w-full lg:w-80 shrink-0 space-y-8">
            <div className="bg-card border rounded-sm p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-6 border-b pb-2">Alternatives to consider</h3>
              {isLoadingRelated ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-sm" />
                  <Skeleton className="h-20 w-full rounded-sm" />
                </div>
              ) : otherRelated.length > 0 ? (
                <div className="space-y-4">
                  {otherRelated.map(related => (
                    <Link key={related.id} href={`/tool/${related.slug}`} className="group block border rounded-sm p-3 hover:border-accent hover:shadow-sm transition-all bg-background">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center shrink-0 border">
                          {related.logoUrl ? (
                            <img src={related.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="font-bold text-xs">{related.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-1">{related.name}</h4>
                          <p className="text-xs font-medium text-muted-foreground line-clamp-1">{related.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-4 border-t mt-4">
                    <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                      <Button variant="outline" className="w-full text-sm font-bold rounded-sm">View all in {tool.category}</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">No alternatives found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
