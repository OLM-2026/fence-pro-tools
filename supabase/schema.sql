-- Pro Fence Tools — Supabase Schema
-- Run this in your Supabase project's SQL editor

create table if not exists categories (
  id          bigint primary key generated always as identity,
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

create table if not exists tools (
  id                bigint primary key generated always as identity,
  name              text not null,
  slug              text not null unique,
  tagline           text,
  description       text,
  category_slug     text not null references categories(slug),
  pricing           text,
  pricing_model     text,
  pricing_starts_at text,
  affiliate_url     text,
  website_url       text,
  logo_url          text,
  featured          boolean not null default false,
  rating            numeric(3,1),
  review_count      int,
  pros              text[],
  cons              text[],
  features          text[],
  best_for          text,
  free_trial        boolean,
  mobile_app        boolean,
  created_at        timestamptz default now()
);

-- Enable public read access (no auth required for a public directory)
alter table categories enable row level security;
alter table tools enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read tools" on tools for select using (true);
