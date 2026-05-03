import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ToolCard from '@/components/ToolCard'
import { getCategories, getCategory, getToolsByCategory } from '@/lib/data'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const category = await getCategory(params.slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `Best ${category.name} for Fencing Contractors | Pro Fence Tools`,
    description:
      category.description ??
      `Compare the top ${category.name.toLowerCase()} tools for fencing contractors.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, tools] = await Promise.all([
    getCategory(params.slug),
    getToolsByCategory(params.slug),
  ])

  if (!category) notFound()

  return (
    <div>
      <div className="bg-navy text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-white/60 text-sm hover:text-gold transition-colors mb-5 inline-block"
          >
            ← Back to directory
          </Link>
          {category.icon && <span className="text-4xl mb-3 block">{category.icon}</span>}
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">
            Best {category.name} for Fence Contractors
          </h1>
          {category.description && (
            <p className="text-white/70 text-lg max-w-2xl">{category.description}</p>
          )}
          <p className="text-gold font-semibold mt-4 text-sm">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} reviewed
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-20">No tools in this category yet.</p>
        )}
      </div>

      <div className="border-t border-gray-100 py-4 px-4 text-center text-xs text-gray-400">
        Some links are affiliate links.{' '}
        <Link href="/disclosure" className="underline hover:text-gray-600">
          Learn more
        </Link>
        .
      </div>
    </div>
  )
}
