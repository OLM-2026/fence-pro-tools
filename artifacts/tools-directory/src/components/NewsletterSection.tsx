"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const subscribeMutation = useMutation({
    mutationFn: async (emailAddr: string) => {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddr }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      return res.json();
    },
    onSuccess: () => {
      toast.success("You're subscribed! Check your inbox soon.");
      setEmail("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) subscribeMutation.mutate(email);
  };

  return (
    <section className="py-20 bg-[#0d1f3c] text-white text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="container mx-auto px-4 max-w-xl relative z-10">
        <Mail className="w-10 h-10 text-[#f5a623] mx-auto mb-5" />
        <h2
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--app-font-display)" }}
        >
          The weekly Fence Software Roundup
        </h2>
        <p className="text-white/60 mb-8 font-medium">
          New software tools, pricing updates, and tips for running a more efficient fence company,
          straight to your inbox every week.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-white text-gray-900 border-0 rounded-sm font-medium"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm whitespace-nowrap"
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe free"
            )}
          </Button>
        </form>
        <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
}
