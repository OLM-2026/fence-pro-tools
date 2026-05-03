import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-bold text-white text-xl mb-3">PRO FENCE TOOLS</p>
            <p className="text-sm leading-relaxed">
              Curated software for fencing contractors. Built for the trade.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white text-sm mb-3">Directory</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/field-service" className="hover:text-gold transition-colors">Field Service</Link></li>
              <li><Link href="/category/estimating-software" className="hover:text-gold transition-colors">Estimating</Link></li>
              <li><Link href="/category/accounting" className="hover:text-gold transition-colors">Accounting</Link></li>
              <li><Link href="/category/crm" className="hover:text-gold transition-colors">CRM</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white text-sm mb-3">Compare</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/compare/jobber-vs-housecall-pro" className="hover:text-gold transition-colors">Jobber vs Housecall Pro</Link></li>
              <li><Link href="/compare/arcsite-vs-estimate-rocket" className="hover:text-gold transition-colors">ArcSite vs Estimate Rocket</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white text-sm mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/disclosure" className="hover:text-gold transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-center">
          <p>
            © {new Date().getFullYear()} Pro Fence Tools. Some links are affiliate links.{' '}
            <Link href="/disclosure" className="underline hover:text-gold">
              Learn more
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
