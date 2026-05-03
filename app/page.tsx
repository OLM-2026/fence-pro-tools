import Link from 'next/link'
import ToolCard from '@/components/ToolCard'
import { getCategories, getFeaturedTools } from '@/lib/data'

export const revalidate = 3600

export default async function HomePage() {
  const [categories, featuredTools] = await Promise.all([
    getCategories(),
    getFeaturedTools(6),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-display font-bold text-sm tracking-widest uppercase mb-4">
            Built for the trade
          </p>
          <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
            Save time. Make more money.
            <br />
            <span className="text-gold">Run a smarter fence company.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The best software tools for fencing contractors — curated, reviewed, and compared
            for the trade. Not just any small business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#categories"
              className="bg-gold text-navy font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Browse Directory
            </Link>
            <Link
              href="/about"
              className="border border-white/30 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              How We Review
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mb-2">
            Browse by category
          </h2>
          <p className="text-gray-500 mb-8">Software sorted by what your business needs most.</p>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gold hover:shadow-md transition-all group"
                >
                  {cat.icon && <span className="text-2xl mb-2 block">{cat.icon}</span>}
                  <h3 className="font-display font-bold text-navy text-lg group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-lg mb-2">No data yet</p>
              <p className="text-gray-400 text-sm">
                Add your Supabase credentials to load tools and categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mb-2">
              Top picks
            </h2>
            <p className="text-gray-500 mb-8">
              The tools we recommend most to fence contractors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Affiliate note */}
      <div className="bg-gray-50 py-6 px-4 text-center text-xs text-gray-400 border-t border-gray-100">
        Some links on this site are affiliate links.{' '}
        <Link href="/disclosure" className="underline hover:text-gray-600">
          Learn more
        </Link>
        .
      </div>
    </div>
  )
}
