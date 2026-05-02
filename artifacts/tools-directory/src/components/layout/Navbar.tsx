import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="FenceProTools" className="h-12 w-auto" />
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition-colors">Directory</Link>
          <Link href="/compare" className="hover:text-accent transition-colors">Compare</Link>
          <Link href="/blog" className="hover:text-accent transition-colors">Resources</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary" size="sm" className="hidden sm:flex">
            <Link href="/submit">Submit Tool</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}