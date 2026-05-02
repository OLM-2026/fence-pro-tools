import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftRight, Check, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListTools } from "@workspace/api-client-react";

const PRESETS = [
  { slug1: "jobber", slug2: "housecall-pro" },
  { slug1: "arcsite", slug2: "estimate-rocket" },
  { slug1: "quickbooks-online", slug2: "invoice-ninja" },
];

export function CompareWidget() {
  const { data: tools = [] } = useListTools();
  const [, navigate] = useLocation();

  const [slug1, setSlug1] = useState("jobber");
  const [slug2, setSlug2] = useState("housecall-pro");

  const tool1 = tools.find((t) => t.slug === slug1);
  const tool2 = tools.find((t) => t.slug === slug2);

  const handleCompare = () => {
    if (slug1 && slug2 && slug1 !== slug2) navigate(`/compare/${slug1}/${slug2}`);
  };

  const rows = [
    { label: "Starting price", val: (t: typeof tool1) => t?.pricingStartsAt || "Contact" },
    { label: "Best for", val: (t: typeof tool1) => t?.bestFor || "All sizes" },
    {
      label: "Free trial",
      val: (t: typeof tool1) =>
        t?.freeTrial ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
        ),
    },
    {
      label: "Mobile app",
      val: (t: typeof tool1) =>
        t?.mobileApp ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
        ),
    },
  ];

  return (
    <div className="bg-[#0d1f3c] border-2 border-[#f5a623]/30 rounded-sm p-6 md:p-8 max-w-3xl mx-auto w-full">
      {/* Selector row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
        <select
          value={slug1}
          onChange={(e) => setSlug1(e.target.value)}
          className="flex-1 bg-white/10 text-white border border-white/20 rounded-sm px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#f5a623]"
        >
          {tools.map((t) => (
            <option key={t.slug} value={t.slug} disabled={t.slug === slug2} className="bg-[#0d1f3c]">
              {t.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => { setSlug1(slug2); setSlug2(slug1); }}
          className="flex items-center justify-center shrink-0 w-10 h-10 rounded-sm bg-white/10 hover:bg-[#f5a623]/20 transition-colors self-center"
          aria-label="Swap tools"
        >
          <ArrowLeftRight className="w-4 h-4 text-[#f5a623]" />
        </button>

        <select
          value={slug2}
          onChange={(e) => setSlug2(e.target.value)}
          className="flex-1 bg-white/10 text-white border border-white/20 rounded-sm px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#f5a623]"
        >
          {tools.map((t) => (
            <option key={t.slug} value={t.slug} disabled={t.slug === slug1} className="bg-[#0d1f3c]">
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mini comparison table */}
      {tool1 && tool2 && (
        <div className="border border-white/10 rounded-sm overflow-hidden mb-6">
          <div className="grid grid-cols-3 bg-white/5">
            <div className="p-3 text-xs font-bold uppercase tracking-wider text-white/40"></div>
            <div className="p-3 text-sm font-bold text-[#f5a623] border-l border-white/10 text-center">{tool1.name}</div>
            <div className="p-3 text-sm font-bold text-[#f5a623] border-l border-white/10 text-center">{tool2.name}</div>
          </div>
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-t border-white/10 ${i % 2 === 0 ? "bg-white/[0.03]" : ""}`}>
              <div className="p-3 text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center">{row.label}</div>
              <div className="p-3 border-l border-white/10 flex items-center justify-center text-sm text-white font-medium">
                {row.val(tool1)}
              </div>
              <div className="p-3 border-l border-white/10 flex items-center justify-center text-sm text-white font-medium">
                {row.val(tool2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => {
          const t1 = tools.find((t) => t.slug === p.slug1);
          const t2 = tools.find((t) => t.slug === p.slug2);
          if (!t1 || !t2) return null;
          const active = slug1 === p.slug1 && slug2 === p.slug2;
          return (
            <button
              key={`${p.slug1}-${p.slug2}`}
              onClick={() => { setSlug1(p.slug1); setSlug2(p.slug2); }}
              className={`text-xs px-3 py-1.5 rounded-sm border font-semibold transition-colors ${
                active
                  ? "bg-[#f5a623] text-[#0d1f3c] border-[#f5a623]"
                  : "text-white/60 border-white/20 hover:border-[#f5a623]/50 hover:text-white"
              }`}
            >
              {t1.name} vs {t2.name}
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleCompare}
        disabled={!slug1 || !slug2 || slug1 === slug2}
        className="w-full bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold text-base rounded-sm h-12 flex items-center justify-center gap-2"
      >
        See full comparison <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
