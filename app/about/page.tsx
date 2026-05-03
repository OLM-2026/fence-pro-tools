import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Pro Fence Tools — Software Reviews for Fencing Contractors',
  description:
    'We review and compare software tools specifically for fencing contractors. No generic small business lists — just tools built or suited for the fence trade.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="text-gold font-display font-bold text-sm tracking-widest uppercase mb-3">
        About us
      </p>
      <h1 className="font-display font-bold text-4xl md:text-5xl text-navy mb-6">
        Built for the fence trade.
      </h1>

      <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
        <p>
          Pro Fence Tools is a curated directory of software built for fencing contractors.
          We review, test, and compare tools that actually make sense for fence companies —
          from solo operators to crews of 20+.
        </p>

        <h2 className="font-display font-bold text-2xl text-navy mt-10 mb-3">
          How we review tools
        </h2>
        <p>
          Every tool in our directory is evaluated on the same criteria: ease of use for
          field crews, pricing transparency, mobile experience, customer support, and how
          well it handles the specific workflows of a fence business — quoting, job
          scheduling, material tracking, and client communication.
        </p>

        <h2 className="font-display font-bold text-2xl text-navy mt-10 mb-3">
          Affiliate disclosure
        </h2>
        <p>
          Some links on this site are affiliate links, meaning we may earn a commission
          if you sign up through our link — at no extra cost to you. This helps us keep
          the site free and independent. Our reviews are not influenced by affiliate
          relationships.{' '}
          <Link href="/disclosure" className="text-gold underline hover:text-yellow-600">
            Read our full disclosure
          </Link>
          .
        </p>

        <h2 className="font-display font-bold text-2xl text-navy mt-10 mb-3">
          Contact
        </h2>
        <p>
          Have a tool to suggest or a correction to report? Reach out at{' '}
          <a href="mailto:hello@profencetools.com" className="text-gold underline">
            hello@profencetools.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}
