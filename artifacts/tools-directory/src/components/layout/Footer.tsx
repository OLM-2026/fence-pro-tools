import { Link } from "wouter";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";

export function Footer() {
  return (
    <>
    <footer className="bg-primary text-primary-foreground border-t py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex mb-4">
            <img src="/logo.png" alt="FenceProTools" className="h-14 w-auto" />
          </Link>
          <p className="text-primary-foreground/70 max-w-md text-sm leading-relaxed">
            The definitive no-BS resource for fence company owners who want to run a better business. Built by people who've actually been on a jobsite.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent">Directory</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/" className="hover:text-white transition-colors">All Tools</Link></li>
            <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Tool</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/10 text-sm text-primary-foreground/50 text-center">
        &copy; {new Date().getFullYear()} FenceProTools. All rights reserved.
      </div>
    </footer>
    <AffiliateDisclosure variant="footer" />
    </>
  );
}