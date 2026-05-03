/** Maps SEO-friendly URL segment → DB category slug */
export const SEO_TO_DB: Record<string, string> = {
  "fence-estimating-software": "estimating-software",
  "fence-crm-software": "crm",
  "fence-field-service-software": "field-service",
  "fence-invoicing-software": "invoicing",
  "fence-scheduling-software": "scheduling",
  "fence-project-management-software": "project-management",
  "fence-marketing-software": "marketing",
  "fence-accounting-software": "accounting",
  "fence-branded-materials": "branded-materials-swag",
};

/** Maps DB category slug → SEO-friendly URL path */
export const DB_TO_SEO: Record<string, string> = {
  "estimating-software": "/fence-estimating-software",
  "crm": "/fence-crm-software",
  "field-service": "/fence-field-service-software",
  "invoicing": "/fence-invoicing-software",
  "scheduling": "/fence-scheduling-software",
  "project-management": "/fence-project-management-software",
  "marketing": "/fence-marketing-software",
  "accounting": "/fence-accounting-software",
  "branded-materials-swag": "/fence-branded-materials",
};

/** Related category slugs (DB slugs) for internal linking */
export const RELATED_CATEGORIES: Record<string, string[]> = {
  "estimating-software": ["crm", "field-service"],
  "crm": ["estimating-software", "marketing"],
  "field-service": ["scheduling", "estimating-software"],
  "invoicing": ["accounting", "crm"],
  "scheduling": ["field-service", "crm"],
  "project-management": ["scheduling", "field-service"],
  "marketing": ["crm", "branded-materials-swag"],
  "accounting": ["invoicing", "crm"],
  "branded-materials-swag": ["marketing", "crm"],
};

/** Human-readable SEO H1 per DB category slug */
export const SEO_H1: Record<string, string> = {
  "estimating-software": "Best Fence Estimating Software for Fencing Contractors",
  "crm": "Best Fence CRM Software for Fencing Contractors",
  "field-service": "Best Field Service Software for Fence Companies",
  "invoicing": "Best Fence Invoicing Software for Fence Companies",
  "scheduling": "Best Scheduling Software for Fence Contractors",
  "project-management": "Best Project Management Software for Fence Companies",
  "marketing": "Best Marketing Software for Fencing Contractors",
  "accounting": "Best Accounting Software for Fence Companies",
  "branded-materials-swag": "Best Branded Materials & Uniforms for Fence Companies",
};

/** Canonical URL for a category slug — uses SEO path if available, else /category/:slug */
export function categoryUrl(slug: string): string {
  return DB_TO_SEO[slug] ?? `/category/${slug}`;
}
