# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### tools-directory (`@workspace/tools-directory`)
- **Framework**: Next.js 15 App Router (SSR/SSG)
- **Purpose**: FenceProTools — curated directory for fencing contractors
- **Brand**: Navy `#0d1f3c`, Gold `#f5a623`, Barlow Condensed display font
- **Routes**: Home `/`, tool detail `/tool/[slug]`, SEO category pages `/fence-[category]-software`, compare `/compare/[slug1]/[slug2]`, admin `/admin`, blog `/blog`
- **Data**: Server-side fetch from Express API server at `http://localhost:8080`
- **SEO slugs**: Defined in `src/lib/seo-slugs.ts` — maps DB category slugs to SEO-friendly URL paths
- **Key components**: `FeaturedToolsSection` (client, search), `CompareWidget` (client, react-query), `TestimonialSlider` (client, auto-advance), `CategoryContent` (client, filters+sort)
- **Workflow**: `artifacts/tools-directory: web` (port 25965)

### api-server (`@workspace/api-server`)
- Express 5 + Drizzle ORM
- Routes: `/api/tools`, `/api/categories`, `/api/tools/:slug`, `/api/admin/tools/:slug` (PATCH)
- Running on port 8080

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
