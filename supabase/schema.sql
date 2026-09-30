-- Hand of Kraus — database schema for the admin panel.
--
-- Run this ONCE in your Supabase project: Dashboard → SQL Editor → New
-- query → paste this whole file → Run. Then run supabase/seed.sql the same
-- way to copy the existing paintings and tarot cards into the database.

-- ─── Paintings ───────────────────────────────────────────────────────────
create table if not exists public.paintings (
  -- Slug used in URLs (/shop/prints/<id>) and stored in customers' carts,
  -- so it never changes after a painting is created.
  id                text primary key,
  title             text        not null,
  -- Either a path inside /public (e.g. "/paintings/Dead_Sea.jpg") for the
  -- original pieces, or a full Supabase Storage URL for anything uploaded
  -- through the admin panel.
  image             text        not null,
  medium            text        not null default 'Ink on paper',
  size              text        not null default '',
  year              text        not null default '',
  price             numeric     not null check (price >= 0),
  available         boolean     not null default true,
  featured          boolean     not null default false,
  -- false = can't be sold as the one-of-one original, only as prints.
  original_for_sale boolean     not null default true,
  -- Shows the piece at double width in the gallery grids.
  wide              boolean     not null default false,
  -- Optional per-painting print sizes: [{ id, label, dims, price }].
  -- null / empty = use the site-wide A4/A5 defaults from lib/pricing.ts.
  print_sizes       jsonb,
  -- Lower numbers show first on the site.
  sort_order        integer     not null default 0,
  created_at        timestamptz not null default now()
);

-- ─── Tarot cards ─────────────────────────────────────────────────────────
create table if not exists public.tarot_cards (
  id                  text primary key,
  title               text        not null,
  -- Kept for compatibility; tarot prints are actually priced by the
  -- site-wide A4/A5 sizes in lib/pricing.ts.
  price               numeric     not null default 35,
  -- The finished, framed card.
  image               text        not null,
  -- The raw sketch version (optional). Cards with a sketch show the
  -- hover-fan animation and a "choose a version" step.
  preview_image       text,
  -- Optional small versions for the grid. Only the original cards have
  -- these (in /public/tarot-thumbs); uploaded cards leave them empty and
  -- next/image resizes the full image instead.
  image_thumb         text,
  preview_image_thumb text,
  sort_order          integer     not null default 0,
  created_at          timestamptz not null default now()
);

-- ─── Security ────────────────────────────────────────────────────────────
-- RLS on, with NO policies: nobody using the public/anon key can read or
-- write these tables. The website reads and the admin panel writes only
-- from the server, using the secret service-role key, which bypasses RLS.
alter table public.paintings   enable row level security;
alter table public.tarot_cards enable row level security;

-- ─── Image storage ───────────────────────────────────────────────────────
-- Public bucket: anyone can VIEW images (the site needs that), but only the
-- server (service-role key) can create upload links, so only the admin
-- panel can add files.
insert into storage.buckets (id, name, public)
values ('art', 'art', true)
on conflict (id) do nothing;
