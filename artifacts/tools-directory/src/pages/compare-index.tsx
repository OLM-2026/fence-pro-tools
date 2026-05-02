import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListTools } from "@workspace/api-client-react";

const POPULAR = [
  {
    slug1: "jobber",
    slug2: "housecall-pro",
    label1: "Jobber",
    label2: "Housecall Pro",
    category: "Field Service",
    note: "The two most popular all-in-one platforms for small fence crews.",
  },
  {
    slug1: "arcsite",
    slug2: "estimate-rocket",
    label1: "ArcSite",
    label2: "Estimate Rocket",
    category: "Estimating",
    note: "Field-sketch takeoffs vs. clean proposal templates — which fits your workflow?",
  },
  {
    slug1: "jobber",
    slug2: "servicetitan",
    label1: "Jobber",
    label2: "ServiceTitan",
    category: "Field Service",
    note: "Affordable simplicity vs. enterprise power. Know when to upgrade.",
  },
  {
    slug1: "hubspot-crm",
    slug2: "markate",
    label1: "HubSpot CRM",
    label2: "Markate",
    category: "CRM / Marketing",
    note: "General-purpose CRM vs. a tool built specifically for home service businesses.",
  },
  {
    slug1: "housecall-pro",
    slug2: "mhelpdesk",
    label1: "Housecall Pro",
    label2: "mHelpDesk",
    category: "Scheduling",
    note: "Both handle scheduling and invoicing — here's which wins for fence contractors.",
  },
  {
    slug1: "quickbooks-online",
    slug2: "invoice-ninja",
    label1: "QuickBooks Online",
    label2: "Invoice Ninja",
    category: "Accounting / Invoicing",
    note: "Industry standard accounting vs. a free alternative. Worth paying for?",
  },
  {
    slug1: "broadly",
    slug2: "markate",
    label1: "Broadly",
    label2: "Markate",
    category: "Marketing",
    note: "Two reputation and lead-gen tools built for local service businesses.",
  },
  {
    slug1: "servicetitan",
    slug2: "buildertrend",
    label1: "ServiceTitan",
    label2: "Buildertrend",
    category: "Enterprise",
    note: "Two heavy-duty platforms for larger fence operations and commercial jobs.",
  },
];

export default function CompareIndex() {
  const { data: tools = [] } = useListTools();
  const [, navigate] = useLocation();
  const [tool1, setTool1] = useState("");
  const [tool2, setTool2] = useState("");

  const handleCustomCompare = () => {
    if (tool1 && tool2 && tool1 !== tool2) {
      navigate(`/compare/${tool1}/${tool2}`);
    }
  };

  const toolOptions = tools.map((t) => ({ slug: t.slug, name: t.name }));

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>Compare Fencing Software Tools - FenceProTools</title>
        <meta
          name="description"
          content="Side-by-side comparisons of the best software for fencing contractors. Compare pricing, features, free trials, and mobile app support."
        />
      </Helmet>

      <div className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Compare fencing software side-by-side
          </h1>
          <p className="text-primary-foreground/75 text-lg font-medium">
            Pick any two tools and see a full breakdown of pricing, features, pros, cons, and integrations. No sales pitch — just the facts.
          </p>
        </div>
      </div>

      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">
            Build a custom comparison
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select
              className="flex-1 border-2 rounded-sm px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:border-primary"
              value={tool1}
              onChange={(e) => setTool1(e.target.value)}
            >
              <option value="">Select first tool...</option>
              {toolOptions.map((t) => (
                <option key={t.slug} value={t.slug} disabled={t.slug === tool2}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <select
              className="flex-1 border-2 rounded-sm px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:border-primary"
              value={tool2}
              onChange={(e) => setTool2(e.target.value)}
            >
              <option value="">Select second tool...</option>
              {toolOptions.map((t) => (
                <option key={t.slug} value={t.slug} disabled={t.slug === tool1}>
                  {t.name}
                </option>
              ))}
            </select>

            <Button
              className="rounded-sm font-bold bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              disabled={!tool1 || !tool2 || tool1 === tool2}
              onClick={handleCustomCompare}
            >
              Compare
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-xl font-bold mb-1">Popular comparisons</h2>
        <p className="text-muted-foreground text-sm font-medium mb-8">
          The questions we hear most from fence contractors.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {POPULAR.map((pair) => (
            <Link
              key={`${pair.slug1}-${pair.slug2}`}
              href={`/compare/${pair.slug1}/${pair.slug2}`}
            >
              <div className="group border-2 rounded-sm p-5 bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base">{pair.label1}</span>
                    <span className="text-muted-foreground text-sm font-medium">vs</span>
                    <span className="font-bold text-base">{pair.label2}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
                <Badge variant="secondary" className="self-start mb-3 text-xs font-semibold rounded-sm">
                  {pair.category}
                </Badge>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-auto">
                  {pair.note}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
