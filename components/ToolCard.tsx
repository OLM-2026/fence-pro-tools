import Link from 'next/link'
import Image from 'next/image'
import type { Tool } from '@/lib/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{Number(rating).toFixed(1)}</span>
    </div>
  )
}

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-gold hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {tool.logo_url ? (
          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={tool.logo_url}
              alt={tool.name}
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-navy flex items-center justify-center text-white font-display font-bold text-xl">
            {tool.name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-display font-bold text-navy text-lg leading-tight group-hover:text-gold transition-colors">
              {tool.name}
            </h3>
            {tool.featured && (
              <span className="text-xs bg-gold/20 text-gold font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Top Pick
              </span>
            )}
          </div>
          {tool.tagline && (
            <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
          )}
          {tool.pricing_starts_at && (
            <p className="text-sm font-semibold text-gray-700 mt-1">
              From {tool.pricing_starts_at}
            </p>
          )}
        </div>
      </div>

      {tool.rating != null && (
        <div className="mt-3">
          <StarRating rating={Number(tool.rating)} />
        </div>
      )}
    </Link>
  )
}
