"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, CheckCircle2, AlertCircle, RefreshCw, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface Tool {
  id: number;
  name: string;
  slug: string;
  category: string;
  logoUrl?: string | null;
  featured: boolean;
  affiliateUrl?: string | null;
  pricingStartsAt?: string | null;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tool>>({});

  const loadTools = async (t: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tools", {
        headers: { "x-admin-token": t },
      });
      if (!res.ok) throw new Error("Unauthorized or failed");
      const data = await res.json();
      setTools(data);
      setAuthed(true);
    } catch {
      toast.error("Invalid token or could not load tools.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loadTools(token);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: Partial<Tool> }) => {
      const res = await fetch(`/api/admin/tools/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: (updated) => {
      setTools((prev) => prev.map((t) => (t.slug === updated.slug ? { ...t, ...updated } : t)));
      toast.success("Tool updated successfully");
      setEditingSlug(null);
    },
    onError: () => {
      toast.error("Update failed. Check your token and try again.");
    },
  });

  const handleEdit = (tool: Tool) => {
    setEditingSlug(tool.slug);
    setEditForm({
      name: tool.name,
      logoUrl: tool.logoUrl ?? "",
      affiliateUrl: tool.affiliateUrl ?? "",
      pricingStartsAt: tool.pricingStartsAt ?? "",
      featured: tool.featured,
    });
  };

  const handleSave = (slug: string) => {
    updateMutation.mutate({ slug, data: editForm });
  };

  const bulkLogoUpdate = useMutation({
    mutationFn: async () => {
      const results = [];
      for (const tool of tools) {
        if (!tool.logoUrl || !tool.logoUrl.includes("google.com")) {
          const domain = tool.websiteUrl
            ? new URL(tool.websiteUrl).hostname
            : `${tool.slug}.com`;
          const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          try {
            const res = await fetch(`/api/admin/tools/${tool.slug}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-admin-token": token,
              },
              body: JSON.stringify({ logoUrl }),
            });
            if (res.ok) results.push(tool.slug);
          } catch {}
        }
      }
      return results;
    },
    onSuccess: (updated) => {
      toast.success(`Updated logos for ${updated.length} tools`);
      loadTools(token);
    },
    onError: () => {
      toast.error("Bulk logo update failed");
    },
  });

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="w-full max-w-sm p-8 border-2 rounded-sm bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#f5a623]" />
            <h1 className="text-xl font-bold text-[#0d1f3c]">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#0d1f3c] mb-1">Admin token</label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token"
                required
                autoFocus
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access admin panel"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="bg-[#0d1f3c] text-white py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FenceProTools Admin</h1>
            <p className="text-white/50 text-sm mt-1">{tools.length} tools in directory</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadTools(token)}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkLogoUpdate.mutate()}
              disabled={bulkLogoUpdate.isPending}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {bulkLogoUpdate.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                "Bulk update logos"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full border-2 rounded-sm overflow-hidden bg-white text-sm">
            <thead className="bg-[#0d1f3c] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-3">Tool</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Logo URL</th>
                <th className="text-left p-3">Affiliate URL</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Featured</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.slug} className="border-t hover:bg-muted/20 transition-colors">
                  {editingSlug === tool.slug ? (
                    <>
                      <td className="p-3 font-semibold text-[#0d1f3c]">{tool.name}</td>
                      <td className="p-3 text-muted-foreground capitalize">
                        {tool.category.replace(/-/g, " ")}
                      </td>
                      <td className="p-3">
                        <Input
                          value={editForm.logoUrl ?? ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, logoUrl: e.target.value }))
                          }
                          className="h-8 text-xs"
                          placeholder="Logo URL"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={editForm.affiliateUrl ?? ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, affiliateUrl: e.target.value }))
                          }
                          className="h-8 text-xs"
                          placeholder="Affiliate URL"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={editForm.pricingStartsAt ?? ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, pricingStartsAt: e.target.value }))
                          }
                          className="h-8 text-xs"
                          placeholder="$29/mo"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={editForm.featured ?? false}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, featured: e.target.checked }))
                          }
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-[#f5a623] text-[#0d1f3c] font-bold"
                            onClick={() => handleSave(tool.slug)}
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => setEditingSlug(null)}
                          >
                            <AlertCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {tool.logoUrl && (
                            <img
                              src={tool.logoUrl}
                              alt={tool.name}
                              className="w-6 h-6 rounded-sm object-contain border"
                            />
                          )}
                          <span className="font-semibold text-[#0d1f3c]">{tool.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground capitalize">
                        {tool.category.replace(/-/g, " ")}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">
                        {tool.logoUrl || <span className="text-red-400">—</span>}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">
                        {tool.affiliateUrl || <span className="text-red-400">—</span>}
                      </td>
                      <td className="p-3 text-xs">{tool.pricingStartsAt || "—"}</td>
                      <td className="p-3">
                        {tool.featured ? (
                          <Badge className="bg-[#f5a623] text-[#0d1f3c] text-xs">Featured</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleEdit(tool)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
