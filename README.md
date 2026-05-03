# Pro Fence Tools

Curated software directory for fencing contractors. Built with Next.js 14 + Supabase.

## Setup

### 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in your project's SQL editor
3. Add your tools and categories data

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel deployment, add these same variables in your project settings.

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

Connect this repo in [vercel.com](https://vercel.com), add the two environment variables, and deploy.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with categories + featured tools |
| `/category/[slug]` | All tools in a category |
| `/tool/[slug]` | Individual tool review |
| `/compare/[slug]` | Side-by-side comparison (e.g. `/compare/jobber-vs-housecall-pro`) |
| `/about` | About page |
| `/disclosure` | Affiliate disclosure |
