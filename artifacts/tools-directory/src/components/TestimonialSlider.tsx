import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  tool: string;
  rating: number;
  source: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Jobber has completely changed how we run the business. Scheduling, invoicing, and client follow-up — all in one place. We stopped losing jobs because we forgot to follow up.",
    author: "Mike T.",
    role: "Owner, fence installation company",
    tool: "Jobber",
    rating: 5,
    source: "Google",
  },
  {
    quote: "ArcSite cut our estimating time in half. I can sketch a fence layout on-site and have a professional quote ready before I leave the customer's driveway. My close rate went up immediately.",
    author: "Dave R.",
    role: "Residential fence contractor",
    tool: "ArcSite",
    rating: 5,
    source: "Google",
  },
  {
    quote: "My crews actually use the Housecall Pro app in the field without me chasing them. That alone sold me. Everything syncs automatically and payments come in fast.",
    author: "Carlos M.",
    role: "3-crew fence company owner",
    tool: "Housecall Pro",
    rating: 5,
    source: "Google",
  },
  {
    quote: "We ordered 500 yard signs through Sticker Mule for about $200. Every job we finish gets a sign at the curb. We track at least 4-5 neighbor leads a month straight from those signs.",
    author: "Tom B.",
    role: "Residential fencing, Texas",
    tool: "Sticker Mule",
    rating: 5,
    source: "Google",
  },
  {
    quote: "Vistaprint door hangers for our neighborhood campaigns cost us almost nothing and they convert. We hit the streets around every finished job with a stack of 200.",
    author: "Jessica L.",
    role: "Fence company marketing manager",
    tool: "Vistaprint",
    rating: 4,
    source: "Google",
  },
  {
    quote: "My accountant insisted on QuickBooks and I'm glad she did. Once I connected it to Jobber, I can see exactly which jobs are profitable and which ones I was undercharging on.",
    author: "Ray G.",
    role: "Fence contractor, 8 years in business",
    tool: "QuickBooks Online",
    rating: 5,
    source: "Google",
  },
  {
    quote: "We tried Estimate Rocket for quoting and it's clean and simple. Clients sign electronically, which saves us the run-around of waiting for a signed contract to schedule the job.",
    author: "Brendan W.",
    role: "Solo fence contractor",
    tool: "Estimate Rocket",
    rating: 4,
    source: "Capterra",
  },
  {
    quote: "Custom Ink made it painless to get 24 polos for our crew. The design tool is actually usable — I'm not a designer and I had a proof approved in 20 minutes.",
    author: "Angela S.",
    role: "Operations manager, fence company",
    tool: "Custom Ink",
    rating: 5,
    source: "Google",
  },
];

interface TestimonialSliderProps {
  variant?: "light" | "dark";
  title?: string;
  subtitle?: string;
}

export function TestimonialSlider({
  variant = "light",
  title = "What fence contractors are saying",
  subtitle = "Real reviews from fencing business owners using these software tools.",
}: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = TESTIMONIALS.length;
  const VISIBLE = 3;
  const pages = Math.ceil(total / VISIBLE);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((c) => (c + dir + pages) % pages);
      setTimeout(() => setIsAnimating(false), 350);
    },
    [isAnimating, pages]
  );

  useEffect(() => {
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go]);

  const slice = TESTIMONIALS.slice(current * VISIBLE, current * VISIBLE + VISIBLE);

  const isDark = variant === "dark";

  return (
    <div className={isDark ? "bg-[#0d1f3c] py-16" : "bg-white py-16 border-t"}>
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">Verified reviews</p>
            <h2
              className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-[#0d1f3c]"}`}
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              {title}
            </h2>
            <p className={`mt-2 text-sm font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>{subtitle}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className={`w-9 h-9 rounded-sm border-2 flex items-center justify-center transition-colors ${
                isDark
                  ? "border-white/20 text-white/50 hover:border-[#f5a623] hover:text-[#f5a623]"
                  : "border-gray-200 text-gray-400 hover:border-[#f5a623] hover:text-[#f5a623]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className={`w-9 h-9 rounded-sm border-2 flex items-center justify-center transition-colors ${
                isDark
                  ? "border-white/20 text-white/50 hover:border-[#f5a623] hover:text-[#f5a623]"
                  : "border-gray-200 text-gray-400 hover:border-[#f5a623] hover:text-[#f5a623]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          {slice.map((t, i) => (
            <div
              key={`${current}-${i}`}
              className={`flex flex-col p-6 rounded-sm border-2 shadow-md ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-[#f5a623]/40"
                  : "bg-white border-gray-100 hover:border-[#f5a623]/50 hover:shadow-lg"
              } transition-all duration-200`}
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                ))}
              </div>
              <p className={`text-sm leading-relaxed flex-grow mb-5 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-current/10">
                <div>
                  <p className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0d1f3c]"}`}>{t.author}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>{t.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#f5a623] bg-[#f5a623]/10 px-2 py-1 rounded-sm">
                    {t.tool}
                  </span>
                  <p className={`text-xs mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>via {t.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!isAnimating) { setIsAnimating(true); setCurrent(i); setTimeout(() => setIsAnimating(false), 350); } }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-[#f5a623]"
                  : isDark
                  ? "w-1.5 bg-white/20"
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
