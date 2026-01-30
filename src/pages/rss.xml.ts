import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context: any) {
  const posts = await getCollection('blog');

  // ✅ 最新在前
  const sorted = posts.sort(
    (a, b) =>
      (b.data.updatedDate ?? b.data.pubDate).valueOf() -
      (a.data.updatedDate ?? a.data.pubDate).valueOf()
  );

  // ✅ site + base 自动拼接绝对路径
  // 你的 astro.config.mjs:
  // site: https://xieyishun.github.io
  // base: /my-website/
  const site = context.site; // Astro 自动注入
  const base = import.meta.env.BASE_URL; // 自动带 /my-website/

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,

    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.summary ?? post.data.description ?? '',

      // ✅ 关键：RSS link 必须是绝对 URL
      link: `${base}blog/${post.id}/`,

      // （可选）如果你希望 RSS 里也体现更新时间：
      customData: post.data.updatedDate
        ? `<lastmod>${post.data.updatedDate.toISOString()}</lastmod>`
        : '',
    })),

    // ✅ 输出文件名保持不变
    stylesheet: false,
  });
}