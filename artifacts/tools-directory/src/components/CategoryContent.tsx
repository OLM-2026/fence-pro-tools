"use client";

import { useState } from "react";
import { Tool, Category } from "@/lib/api";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import { AffiliateDisclosureBanner } from "@/components/AffiliateDisclosure";

type SortOption = "featured" | "name" | "rating" | "price";

interface CategoryContentProps {
  tools: Tool[];
  category: Category | null;
  title: string;
}

export function CategoryContent({ tools, category, title }: CategoryContentProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = tools
    .filter(
      (t) =>
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "price") {
        const pa = parseFloat(a.pricingStartsAt?.replace(/[^0-9.]/g, "") || "0");
        const pb = parseFloat(b.pricingStartsAt?.replace(/[^0-9.]/g, "") || "0");
        return pa - pb;
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <AffiliateDisclosureBanner />

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-8 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Search ${category?.name ?? "tools"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-11 px-3 border rounded-sm text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="featured">Sort: Top picks first</option>
          <option value="name">Sort: A–Z</option>
          <option value="rating">Sort: Highest rated</option>
          <option value="price">Sort: Price (low to high)</option>
        </select>

        <div className="flex border rounded-sm overflow-hidden shrink-0">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 transition-colors ${
              view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 transition-colors border-l ${
              view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
        {search ? ` for "${search}"` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-muted-foreground">
            No tools found{search ? ` for "${search}"` : ""}.
          </p>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")} className="mt-4">
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((tool, i) => (
            <div
              key={tool.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ToolCard tool={tool} headingLevel="h2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
