import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTool } from '@/lib/data'

export const revalidate = 3600
export const dynamicParams = true

const PRESET_COMPARISONS = [
  'jobber-vs-housecall-pro',
  'arcsite-vs-estimate-rocket',
  'quickbooks-online-vs-freshbooks',
  'jobber-vs-servicetitan',
]

export function generateStaticParams() {
  return PRESET_COMPARISONS.map((slug) => ({ slug }))
}

function parseSlug(slug: string): [string, string] | null {
  const match = slug.match(/^(.+)-vs-(.+)$/)
  if (!match) return null
  return [match[1], match[2]]
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const parsed = parseSlug(params.slug)
  if (!parsed) return { title: 'Compare Tools' }
  const [t1, t2] = await Promise.all([getTool(parsed[0]), getTool(parsed[1])])
  if (!t1 || !t2) return { title: 'Compare Tools' }
  return {
    title: `${t1.name} vs ${t2.name} for Fence Contractors | Pro Fence Tools`,
    description: `Compare ${t1.name} and ${t2.name} side by side — pricing, features, pros and cons for fencing contractors.`,
  }
}

export default async function ComparePage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug)
  if (!parsed) notFound()

  const [tool1, tool2] = await Promise.all([getTool(parsed[0]), getTool(parsed[1])])
  if (!tool1 || !tool2) notFound()

  const winner =
    (Number(tool1.rating) || 0) >= (Number(tool2.rating) || 0) ? tool1 : tool2

  const rows = [
    { label: 'Starting price', v1: tool1.pricing_starts_at, v2: tool2.pricing_starts_at },
    { label: 'Pricing model', v1: tool1.pricing_model, v2: tool2.pricing_model },
    { label: 'Best for', v1: tool1.best_for, v2: tool2.best_for },
    {
      label: 'Free trial',
      v1: tool1.free_trial == null ? null : tool1.free_trial ? '✓ Yes' : '✕ No',
      v2: tool2.free_trial == null ? null : tool2.free_trial ? '✓ Yes' : '✕ No',
    },
    {
      label: 'Mobile app',
      v1: tool1.mobile_app == null ? null : tool1.mobile_app ? '✓ Yes' : '✕ No',
      v2: tool2.mobile_app == null ? null : tool2.mobile_app ? '✓ Yes' : '✕ No',
    },
    {
      label: 'Rating',
      v1: tool1.rating != null ? `${Number(tool1.rating).toFixed(1)} / 5` : null,
      v2: tool2.rating != null ? `${Number(tool2.rating).toFixed(1)} / 5` : null,
    },
  ].filter((r) => r.v1 != null || r.v2 != null)

  return (
    <div>
      {/* Header */}
      <div className="bg-navy text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="text-white/60 text-sm hover:text-gold transition-colors mb-6 inline-block"
          >
            ← Back to directory
          </Link>

          <div className="flex items-center gap-5 mb-6 flex-wrap">
            <ToolLogo tool={tool1} />
            <span className="font-display font-bold text-3xl text-gold">VS</span>
            <ToolLogo tool={tool2} />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl">
            {tool1.name} vs {tool2.name}{' '}
            <span className="text-gold">for Fence Contractors</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Winner banner */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              Our pick
            </p>
            <p className="font-display font-bold text-2xl text-navy">{winner.name}</p>
            {winner.tagline && (
              <p className="text-sm text-gray-500 mt-1">{winner.tagline}</p>
            )}
          </div>
          <a
            href={winner.affiliate_url ?? winner.website_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy/80 transition-colors whitespace-nowrap"
          >
            Try {winner.name} →
          </a>
        </div>

        {/* Comparison table */}
        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left p-4 font-semibold text-sm w-1/3">Feature</th>
                  <th className="text-center p-4 font-semibold">
                    {tool1.name}
                    {tool1 === winner && <span className="text-gold ml-1">★</span>}
                  </th>
                  <th className="text-center p-4 font-semibold">
                    {tool2.name}
                    {tool2 === winner && <span className="text-gold ml-1">★</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 text-sm font-medium text-gray-500 border-b border-gray-100">
                      {row.label}
                    </td>
                    <td className="p-4 text-sm text-center font-semibold text-gray-800 border-b border-gray-100">
                      {row.v1 ?? '—'}
                    </td>
                    <td className="p-4 text-sm text-center font-semibold text-gray-800 border-b border-gray-100">
                      {row.v2 ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProsCons tool={tool1} />
          <ProsCons tool={tool2} />
        </div>

        {/* CTA row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[tool1, tool2].map((tool) => (
            <a
              key={tool.slug}
              href={tool.affiliate_url ?? tool.website_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block text-center bg-gold text-navy font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Get Started with {tool.name} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolLogo({ tool }: { tool: { name: string; logo_url?: string | null } }) {
  return (
    <div className="flex items-center gap-3">
      {tool.logo_url ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
          <Image src={tool.logo_url} alt={tool.name} fill className="object-contain p-1" unoptimized />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0">
          {tool.name[0]}
        </div>
      )}
      <span className="font-display font-bold text-xl">{tool.name}</span>
    </div>
  )
}

function ProsCons({
  tool,
}: {
  tool: { name: string; pros?: string[] | null; cons?: string[] | null }
}) {
  if (!tool.pros?.length && !tool.cons?.length) return null
  return (
    <div>
      <h3 className="font-display font-bold text-navy text-xl mb-4">{tool.name}</h3>
      {tool.pros && tool.pros.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Pros</p>
          <ul className="space-y-1.5">
            {tool.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 flex-shrink-0">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tool.cons && tool.cons.length > 0 && (
        <div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">Cons</p>
          <ul className="space-y-1.5">
            {tool.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0">✕</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
