import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Pro Fence Tools',
  description: 'Our affiliate disclosure and editorial independence statement.',
}

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="text-gold font-display font-bold text-sm tracking-widest uppercase mb-3">
        Legal
      </p>
      <h1 className="font-display font-bold text-4xl md:text-5xl text-navy mb-8">
        Affiliate Disclosure
      </h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <p>
          Pro Fence Tools participates in affiliate marketing programs. This means we may
          earn a commission when you click on certain links and make a purchase or sign up
          for a service — at no additional cost to you.
        </p>

        <p>
          Affiliate links are marked with &ldquo;sponsored&rdquo; in the link rel attribute. We also
          note affiliate relationships on individual tool pages.
        </p>

        <p>
          Our editorial process is independent of our affiliate relationships. We do not
          accept payment for positive reviews, and tools are evaluated on merit alone.
          A tool with an affiliate link may receive a lower rating than a tool without one
          if that&apos;s what our evaluation finds.
        </p>

        <p>
          We strive to recommend only tools we would use ourselves or recommend to a
          fence contractor we know personally.
        </p>

        <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
          Last updated: May 2025
        </p>
      </div>
    </div>
  )
}
