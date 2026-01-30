import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .slice()
    .sort((a, b) => {
      const ad = (a.data.updatedDate ?? a.data.pubDate).valueOf();
      const bd = (b.data.updatedDate ?? b.data.pubDate).valueOf();
      return bd - ad;
    })
    .slice(0, 50);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? post.data.description ?? '',
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
