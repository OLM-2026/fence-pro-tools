export interface Tool {
  id: number
  name: string
  slug: string
  tagline?: string | null
  description?: string | null
  category_slug: string
  pricing?: string | null
  pricing_model?: string | null
  pricing_starts_at?: string | null
  affiliate_url?: string | null
  website_url?: string | null
  logo_url?: string | null
  featured: boolean
  rating?: number | null
  review_count?: number | null
  pros?: string[] | null
  cons?: string[] | null
  features?: string[] | null
  best_for?: string | null
  free_trial?: boolean | null
  mobile_app?: boolean | null
}

export interface Category {
  id: number
  slug: string
  name: string
  description?: string | null
  icon?: string | null
  sort_order?: number | null
}
