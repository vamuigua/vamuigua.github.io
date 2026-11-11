import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/missions/*/*.{png,jpg,jpeg}', { eager: true });

const bySlug = new Map<string, { n: number; img: ImageMetadata }[]>();
for (const [path, mod] of Object.entries(files)) {
  const m = path.match(/missions\/([^/]+)\/[^/]+-(\d+)\.\w+$/);
  if (!m) continue;
  const [, slug, n] = m;
  const list = bySlug.get(slug) ?? [];
  list.push({ n: Number(n), img: mod.default });
  bySlug.set(slug, list);
}

/** Screenshots for a mission, in numeric order. */
export function shotsFor(slug: string): ImageMetadata[] {
  return (bySlug.get(slug) ?? []).sort((a, b) => a.n - b.n).map((x) => x.img);
}
