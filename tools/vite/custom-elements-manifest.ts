import { cli } from '@custom-elements-manifest/analyzer/cli';
import type { PluginOption } from 'vite';

import { root } from './build-meta';

export function customElementsManifest(): PluginOption {
  return {
    name: 'custom-elements-definition',
    closeBundle() {
      this.info(`Generating custom elements manifest`);
      return cli({
        argv: [
          'analyze',
          '--config',
          new URL('./tools/manifest/custom-elements-manifest.config.js', root).pathname,
        ],
        cwd: root.pathname,
      });
    },
  };
}
