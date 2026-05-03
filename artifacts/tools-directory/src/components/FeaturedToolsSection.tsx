"use client";

import { useState } from "react";
import { Tool } from "@/lib/api";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FeaturedToolsSectionProps {
  featuredTools: Tool[];
  allTools: Tool[];
}

export function FeaturedToolsSection({ featuredTools, allTools }: FeaturedToolsSectionProps) {
  const [search, setSearch] = useState("");

  const displayTools = search
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          t.category?.toLowerCase().includes(search.toLowerCase())
      )
    : featuredTools;

  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[#f5a623] font-bold uppercase tracking-widest text-xs mb-2">
              {search ? "Search results" : "Top picks"}
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              {search ? `Results for "${search}"` : "Top-rated tools for fence contractors"}
            </h2>
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 w-full"
            />
          </div>
        </div>

        {displayTools.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No tools found for &ldquo;{search}&rdquo;</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTools.map((tool, i) => (
              <div
                key={tool.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
