import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-sm mb-6">
        404 – Page not found
      </div>
      <h1
        className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#0d1f3c] mb-4"
        style={{ fontFamily: "var(--app-font-display)" }}
      >
        Nothing here.
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-10 font-medium">
        The page you&apos;re looking for doesn&apos;t exist, or it may have moved. Head back to the
        directory to find what you need.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          asChild
          size="lg"
          className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#0d1f3c] font-bold rounded-sm"
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-sm border-2">
          <Link href="/category/all">
            <Search className="w-4 h-4 mr-2" />
            Browse all tools
          </Link>
        </Button>
      </div>
    </div>
  );
}
