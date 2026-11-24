import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

import { flowdeskFeatures } from './src/config/flowdesk';

export const docs = defineDocs({
  dir: 'content/docs',
});

export const pages = defineDocs({
  dir: 'content/pages',
});

export const posts = defineDocs({
  dir: 'content/posts',
  docs: {
    files: flowdeskFeatures.showScaffoldEntries
      ? ['**/*.mdx']
      : ['**/*.mdx', '!what-is-xxx*.mdx'],
  },
});

export const logs = defineDocs({
  dir: 'content/logs',
  docs: {
    files: flowdeskFeatures.showScaffoldEntries
      ? ['**/*.mdx']
      : ['**/*.mdx', '!v[12].0*.mdx'],
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Use defaultLanguage for unknown language codes
      defaultLanguage: 'plaintext',
    },
  },
});
