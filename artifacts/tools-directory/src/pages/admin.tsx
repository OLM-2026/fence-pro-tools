import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, ChevronDown, ChevronUp, ExternalLink, Lock, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListTools } from "@workspace/api-client-react";
import type { Tool } from "@workspace/api-client-react";

const SESSION_KEY = "admin_token";
const DEFAULT_SECRET = "fenceprotools-admin";

/* ── Helpers ── */
function arrayField(val: string[] | null | undefined) {
  return (val ?? []).join("\n");
}
function parseArray(val: string): string[] {
  return val.split("\n").map((s) => s.trim()).filter(Boolean);
}

/* ── Tool editor ── */
function ToolEditor({ tool, token, onSaved }: { tool: Tool; token: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: tool.name ?? "",
    description: tool.description ?? "",
    pricingStartsAt: tool.pricingStartsAt ?? "",
    affiliateUrl: tool.affiliateUrl ?? "",
    logoUrl: tool.logoUrl ?? "",
    bestFor: tool.bestFor ?? "",
    rating: tool.rating ?? "",
    featured: tool.featured ?? false,
    isNew: tool.isNew ?? false,
    freeTrial: tool.freeTrial ?? false,
    mobileApp: tool.mobileApp ?? false,
    pros: arrayField(tool.pros),
    cons: arrayField(tool.cons),
    integrations: arrayField(tool.integrations),
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (key: keyof typeof form) => () =>
    setForm((f) => ({ ...f, [key]: !f[key] }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/tools/${tool.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          ...form,
          pros: parseArray(form.pros),
          cons: parseArray(form.cons),
          integrations: parseArray(form.integrations),
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? "Failed to save");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onSaved();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Row header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        {/* Logo / initial */}
        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#0d1f3c] rounded-sm">
          {tool.logoUrl ? (
            <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-contain p-1 rounded-sm" />
          ) : (
            <span className="text-base font-black text-[#f5a623]">{tool.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">{tool.name}</p>
          <p className="text-xs text-muted-foreground truncate">{tool.affiliateUrl || <span className="text-red-500 font-semibold">No affiliate URL set</span>}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {tool.featured && <Badge className="bg-[#f5a623] text-[#0d1f3c] text-[10px] font-black">Featured</Badge>}
          {tool.affiliateUrl && <Badge variant="outline" className="text-green-700 border-green-300 text-[10px]">Has affiliate URL</Badge>}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Edit form */}
      {open && (
        <div className="border-t p-5 bg-muted/10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            <Field label="Name" value={form.name} onChange={set("name")} />
            <Field label="Affiliate URL" value={form.affiliateUrl} onChange={set("affiliateUrl")} placeholder="https://..." hint="This is the link used on Compare and tool pages." />
            <Field label="Logo URL" value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://..." />
            <Field label="Pricing (e.g. $49/month)" value={form.pricingStartsAt} onChange={set("pricingStartsAt")} />
            <Field label="Best For" value={form.bestFor} onChange={set("bestFor")} placeholder="Solo, Small crew, Enterprises..." />
            <Field label="Rating (e.g. 4.5)" value={form.rating} onChange={set("rating")} />

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(["featured", "isNew", "freeTrial", "mobileApp"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={toggle(k)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form[k] ? "bg-[#0d1f3c] border-[#0d1f3c]" : "border-muted-foreground/40"}`}
                  >
                    {form[k] && <Check className="w-3 h-3 text-white" />}
                  </button>
                  {k === "isNew" ? "Is New" : k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <TextArea label="Description" value={form.description} onChange={set("description")} rows={4} />
            <TextArea label="Pros (one per line)" value={form.pros} onChange={set("pros")} rows={4} placeholder="Easy to use&#10;Great mobile app&#10;..." />
            <TextArea label="Cons (one per line)" value={form.cons} onChange={set("cons")} rows={3} placeholder="No offline mode&#10;..." />
            <TextArea label="Integrations (one per line)" value={form.integrations} onChange={set("integrations")} rows={3} placeholder="QuickBooks&#10;Stripe&#10;..." />
          </div>

          {/* Save bar */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white font-bold rounded-sm px-6"
            >
              {saving ? "Saving..." : saved ? <><Check className="w-4 h-4 mr-1" /> Saved</> : <><Save className="w-4 h-4 mr-1" /> Save changes</>}
            </Button>
            {tool.affiliateUrl && (
              <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold">
                Test affiliate link <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#0d1f3c]/20 focus:border-[#0d1f3c]"
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function TextArea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows ?? 3}
        placeholder={placeholder}
        className="w-full border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#0d1f3c]/20 focus:border-[#0d1f3c] resize-y font-mono"
      />
    </div>
  );
}

/* ── Login screen ── */
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    onLogin(pin);
    setError("Incorrect password. Try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1f3c]">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-[#0d1f3c] flex items-center justify-center mx-auto mb-4">
          <Lock className="w-5 h-5 text-[#f5a623]" />
        </div>
        <h1 className="text-xl font-extrabold mb-1">Admin Panel</h1>
        <p className="text-muted-foreground text-sm mb-6">Pro Fence Tools</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="w-full border-2 rounded-sm px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0d1f3c] text-center tracking-widest"
          />
          {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}
          <Button type="submit" className="w-full bg-[#0d1f3c] hover:bg-[#0d1f3c]/90 text-white font-bold rounded-sm h-11">
            Sign in
          </Button>
        </form>
        <p className="text-[11px] text-muted-foreground mt-4">Default: <code>fenceprotools-admin</code> (set ADMIN_SECRET env var to change)</p>
      </div>
    </div>
  );
}

/* ── Main admin page ── */
export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? "");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { data: tools = [], isLoading, refetch } = useListTools();
  const [search, setSearch] = useState("");

  const handleLogin = async (t: string) => {
    // Test the token against the API
    const res = await fetch("/api/admin/tools/__test__", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": t },
      body: JSON.stringify({}),
    });
    if (res.status === 401) {
      setAuthError(true);
      return;
    }
    // 400 (no fields) or 404 (tool not found) = token accepted
    sessionStorage.setItem(SESSION_KEY, t);
    setToken(t);
    setAuthed(true);
    setAuthError(false);
  };

  useEffect(() => {
    if (token) handleLogin(token);
  }, []);

  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const missingAffiliate = tools.filter((t) => !t.affiliateUrl).length;

  if (!authed) {
    return (
      <div>
        <Helmet><title>Admin - Pro Fence Tools</title><meta name="robots" content="noindex" /></Helmet>
        <LoginScreen onLogin={handleLogin} />
        {authError && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-sm flex items-center gap-2">
            <X className="w-4 h-4" /> Incorrect password
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Helmet><title>Admin - Pro Fence Tools</title><meta name="robots" content="noindex" /></Helmet>

      {/* Top bar */}
      <div className="bg-[#0d1f3c] text-white py-4 px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#f5a623]" />
          <span className="font-black text-sm uppercase tracking-widest">Pro Fence Tools Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {missingAffiliate > 0 && (
            <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-sm">
              {missingAffiliate} tools missing affiliate URL
            </span>
          )}
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); setToken(""); }}
            className="text-white/50 hover:text-white text-xs font-semibold transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold">Tool Directory</h1>
            <p className="text-muted-foreground text-sm font-medium mt-0.5">{tools.length} tools total. Click any row to edit.</p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or category..."
            className="border rounded-sm px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0d1f3c]/20"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total tools", value: tools.length },
            { label: "Featured", value: tools.filter((t) => t.featured).length },
            { label: "Has affiliate URL", value: tools.filter((t) => t.affiliateUrl).length },
            { label: "Missing affiliate URL", value: missingAffiliate, highlight: missingAffiliate > 0 },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg border p-4 text-center ${s.highlight ? "border-red-300 bg-red-50" : "bg-white"}`}>
              <p className={`text-2xl font-extrabold ${s.highlight ? "text-red-600" : "text-[#0d1f3c]"}`}>{s.value}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tool list */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm font-medium">Loading tools...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((tool) => (
              <ToolEditor key={tool.id} tool={tool} token={token} onSaved={() => refetch()} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
