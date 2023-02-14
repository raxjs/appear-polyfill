import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['esm'],
  },
  bundle: {
    formats: ['umd', 'es2017'],
    minify: true,
  },
  plugins: [
    '@ice/pkg-plugin-docusaurus',
  ],
});