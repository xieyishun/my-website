import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://xieyishun.github.io',
  base: '/my-website',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [mdx(), sitemap()],
});
