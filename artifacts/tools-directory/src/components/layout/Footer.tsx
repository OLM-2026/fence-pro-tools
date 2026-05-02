import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent text-accent-foreground rounded flex items-center justify-center font-bold text-xl">
              T
            </div>
            <span className="font-bold text-xl">Tools for Home Services</span>
          </Link>
          <p className="text-primary-foreground/70 max-w-md text-sm leading-relaxed">
            The definitive index of software tools for home service businesses. Find the right CRM, field service management, or estimating software for your trade.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent">Directory</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/" className="hover:text-white transition-colors">All Categories</Link></li>
            <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Tool</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/10 text-sm text-primary-foreground/50 text-center">
        &copy; {new Date().getFullYear()} Tools for Home Services. All rights reserved.
      </div>
    </footer>
  );
}
