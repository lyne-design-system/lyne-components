import { resolve } from 'path';

import postcssLit from 'rollup-plugin-postcss-lit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // We apply the postcssLit plugin (which transforms .scss files to Lit
    // css tagged templates) as this should apply in almost all cases.
    postcssLit({ exclude: ['**/core/styles/**/*', '**/storybook/**/*'] }),
  ],
  resolve: {
    // Alias used for test and storybook environments
    alias: [
      { find: '@sbb-esta/lyne-elements', replacement: resolve(__dirname, 'src/elements') },
      {
        find: '@sbb-esta/lyne-elements-experimental',
        replacement: resolve(__dirname, 'src/elements-experimental'),
      },
    ],
  },
});
