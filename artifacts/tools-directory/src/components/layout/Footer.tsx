import { Link } from "wouter";
import { Zap } from "lucide-react";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { categoryUrl } from "@/lib/seo-slugs";

export function Footer() {
  return (
    <>
    <footer className="bg-primary text-primary-foreground border-t mt-16">
      {/* Tagline bar */}
      <div className="bg-[#f5a623] py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-[#0d1f3c] font-black text-sm uppercase tracking-widest">
          <Zap className="w-4 h-4 fill-current" />
          1% better every day starts today
          <Zap className="w-4 h-4 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex mb-4">
            <img src="/logo.png" alt="Pro Fence Tools" className="h-14 w-auto" />
          </Link>
          <p className="text-primary-foreground/70 max-w-md text-sm leading-relaxed">
            The definitive independent resource for fence company owners who want to save time, make more money, and run a smarter fence business. Built for the trade, not just any small business.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-[#f5a623] uppercase tracking-wider text-xs">Software by Category</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href={categoryUrl("estimating-software")} className="hover:text-white transition-colors">Estimating Software</Link></li>
            <li><Link href={categoryUrl("crm")} className="hover:text-white transition-colors">CRM Software</Link></li>
            <li><Link href={categoryUrl("field-service")} className="hover:text-white transition-colors">Field Service Software</Link></li>
            <li><Link href={categoryUrl("invoicing")} className="hover:text-white transition-colors">Invoicing Software</Link></li>
            <li><Link href={categoryUrl("scheduling")} className="hover:text-white transition-colors">Scheduling Software</Link></li>
            <li><Link href={categoryUrl("marketing")} className="hover:text-white transition-colors">Marketing Tools</Link></li>
            <li><Link href={categoryUrl("accounting")} className="hover:text-white transition-colors">Accounting Software</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-[#f5a623] uppercase tracking-wider text-xs">Directory</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/category/all" className="hover:text-white transition-colors">All Tools</Link></li>
            <li><Link href="/compare" className="hover:text-white transition-colors">Compare Tools</Link></li>
            <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Tool</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Resources</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primary-foreground/40">
        <span>&copy; {new Date().getFullYear()} Pro Fence Tools. All rights reserved.</span>
        <span className="text-xs">Independent directory. Not affiliated with any software company.</span>
      </div>
    </footer>
    <AffiliateDisclosure variant="footer" />
    </>
  );
}
