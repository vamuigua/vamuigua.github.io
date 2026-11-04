// @ts-check
import { defineConfig } from 'astro/config';

// Served from GitHub Pages at https://vamuigua.github.io/devfolio/
export default defineConfig({
  site: 'https://vamuigua.github.io',
  base: '/devfolio',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
});
