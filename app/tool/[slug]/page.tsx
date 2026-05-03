import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTools, getTool } from '@/lib/data'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const tools = await getTools()
  return tools.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tool = await getTool(params.slug)
  if (!tool) return { title: 'Tool Not Found' }
  return {
    title: `${tool.name} Review for Fence Contractors | Pro Fence Tools`,
    description:
      tool.tagline ?? `Read our review of ${tool.name} for fencing contractors.`,
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-semibold text-gray-600 ml-1">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  )
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getTool(params.slug)
  if (!tool) notFound()

  const href = tool.affiliate_url ?? tool.website_url ?? '#'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="text-gray-400 text-sm hover:text-navy transition-colors mb-6 inline-block"
      >
        ← Back to directory
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8 flex-wrap sm:flex-nowrap">
        {tool.logo_url ? (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
            <Image
              src={tool.logo_url}
              alt={tool.name}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-navy flex items-center justify-center text-white font-display font-bold text-3xl flex-shrink-0">
            {tool.name[0]}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            {tool.featured && (
              <span className="bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">
                Top Pick
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-navy leading-tight">
            {tool.name}
          </h1>
          {tool.tagline && (
            <p className="text-gray-500 text-lg mt-1">{tool.tagline}</p>
          )}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {tool.rating != null && <Stars rating={Number(tool.rating)} />}
            {tool.pricing_starts_at && (
              <span className="text-sm font-bold text-navy bg-gray-100 px-3 py-1 rounded-lg">
                From {tool.pricing_starts_at}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mb-10">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Get Started with {tool.name}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <p className="text-xs text-gray-400 mt-2">
          Affiliate link.{' '}
          <Link href="/disclosure" className="underline hover:text-gray-600">
            Learn more
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {tool.description && (
            <div>
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                What is {tool.name}?
              </h2>
              <p className="text-gray-600 leading-relaxed">{tool.description}</p>
            </div>
          )}

          {((tool.pros?.length ?? 0) > 0 || (tool.cons?.length ?? 0) > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tool.pros && tool.pros.length > 0 && (
                <div className="bg-green-50 rounded-xl p-5">
                  <h3 className="font-bold text-green-800 mb-3">Pros</h3>
                  <ul className="space-y-2">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tool.cons && tool.cons.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-3">Cons</h3>
                  <ul className="space-y-2">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tool.features && tool.features.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-xl text-navy mb-3">Key features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 sticky top-20">
            <h3 className="font-display font-bold text-navy text-lg mb-4">Pricing & Details</h3>
            <div className="space-y-4 text-sm">
              {tool.pricing_starts_at && (
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide mb-0.5">
                    Starting price
                  </span>
                  <span className="font-bold text-navy text-base">{tool.pricing_starts_at}</span>
                </div>
              )}
              {tool.pricing_model && (
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide mb-0.5">
                    Pricing model
                  </span>
                  <span className="font-semibold">{tool.pricing_model}</span>
                </div>
              )}
              {tool.best_for && (
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide mb-0.5">
                    Best for
                  </span>
                  <span className="font-semibold">{tool.best_for}</span>
                </div>
              )}
              {tool.free_trial != null && (
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide mb-0.5">
                    Free trial
                  </span>
                  <span
                    className={`font-semibold ${tool.free_trial ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {tool.free_trial ? '✓ Yes' : '✕ No'}
                  </span>
                </div>
              )}
              {tool.mobile_app != null && (
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide mb-0.5">
                    Mobile app
                  </span>
                  <span
                    className={`font-semibold ${tool.mobile_app ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {tool.mobile_app ? '✓ Yes' : '✕ No'}
                  </span>
                </div>
              )}
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block mt-6 bg-gold text-navy font-bold text-center py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Visit {tool.name} →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
