import { getCollection } from 'astro:content';
import { slugify } from '../utils/slug';
import { withBase } from '../utils/url';

const toUrl = (site: URL, path: string) => new URL(path, site).toString();

export async function GET(context) {
  const site = context.site;
  if (!site) {
    return new Response('Missing site config', { status: 500 });
  }

  const posts = await getCollection('blog');
  const seriesSet = new Set<string>();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const s of post.data.series ?? []) seriesSet.add(String(s).trim());
    for (const t of post.data.tags ?? []) tagSet.add(String(t).trim());
  }

  const urls = new Set<string>();

  const addPath = (path: string) => urls.add(toUrl(site, withBase(path)));

  addPath('/');
  addPath('/blog/');
  addPath('/series/');
  addPath('/tags/');

  for (const post of posts) {
    addPath(`/blog/${post.id}/`);
  }

  for (const name of seriesSet) {
    if (!name) continue;
    addPath(`/series/${slugify(name)}/`);
  }

  for (const tag of tagSet) {
    if (!tag) continue;
    addPath(`/tags/${slugify(tag)}/`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
  .map((loc) => `  <url><loc>${loc}</loc></url>`)
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
