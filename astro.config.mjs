// @ts-check
import { defineConfig } from 'astro/config';

// Served from GitHub Pages at https://vamuigua.github.io/ (user site, repo vamuigua/vamuigua.github.io)
export default defineConfig({
  site: 'https://vamuigua.github.io',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
});
