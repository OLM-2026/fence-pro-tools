const INTERNAL = process.env.INTERNAL_API_URL ?? "http://localhost:8080";

export interface Tool {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  category: string;
  categoryName?: string | null;
  pricing?: string | null;
  pricingModel?: string | null;
  pricingStartsAt?: string | null;
  affiliateUrl?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  featured: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  pros?: string[] | null;
  cons?: string[] | null;
  features?: string[] | null;
  bestFor?: string | null;
  freeTrial?: boolean | null;
  mobileApp?: boolean | null;
  createdAt?: string | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  toolCount?: number | null;
}

async function apiFetch<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${INTERNAL}/api${path}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getTools(): Promise<Tool[]> {
  return apiFetch<Tool[]>("/tools");
}

export async function getTool(slug: string): Promise<Tool | null> {
  try {
    return await apiFetch<Tool>(`/tools/${slug}`);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  return apiFetch<Tool[]>(`/tools?category=${categorySlug}`);
}
