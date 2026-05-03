import { supabase } from './supabase'
import type { Tool, Category } from './types'

export async function getTools(): Promise<Tool[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('tools')
    .select('*')
    .order('featured', { ascending: false })
  return data ?? []
}

export async function getTool(slug: string): Promise<Tool | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()
  return data ?? null
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('category_slug', categorySlug)
    .order('featured', { ascending: false })
  return data ?? []
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function getCategory(slug: string): Promise<Category | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data ?? null
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('featured', true)
    .limit(limit)
  return data ?? []
}
