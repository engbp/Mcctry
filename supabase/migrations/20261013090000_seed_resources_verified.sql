-- Resource import (approved scope: the three verified external links only).
-- Values copied verbatim from lib/data.ts — titles, descriptions, URLs, and
-- icons are unchanged. Slugs are derived from titles to satisfy the
-- resources_slug_format constraint and to serve as the idempotency key.
-- Idempotent: upsert keyed on resources.slug. No deletes, no destructive SQL,
-- no changes to any other row or table. published = true per approval.

insert into public.resources (slug, title, description, link, external, category, icon, published, position)
values
  (
    'microsoft-learn',
    'Microsoft Learn',
    'Use Microsoft Learn as a reference for technical concepts and guided training paths.',
    'https://learn.microsoft.com',
    true,
    'Learning',
    'BookOpen',
    true,
    10
  ),
  (
    'github',
    'GitHub',
    'Explore repositories, documentation, and open-source workflows on the world''s largest code host.',
    'https://github.com',
    true,
    'Development',
    'Code2',
    true,
    20
  ),
  (
    'fluent-2-design-system',
    'Fluent 2 Design System',
    'Reference Microsoft''s design language and interface patterns for building coherent experiences.',
    'https://fluent2.microsoft.design',
    true,
    'Design',
    'Layers',
    true,
    30
  )
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  link        = excluded.link,
  external    = excluded.external,
  category    = excluded.category,
  icon        = excluded.icon,
  published   = excluded.published,
  position    = excluded.position,
  updated_at  = now();
