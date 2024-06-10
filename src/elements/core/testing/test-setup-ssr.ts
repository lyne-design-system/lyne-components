import { isServer } from 'lit';

import type { SbbIconConfig } from '../config.js';
import { mergeConfig } from '../config.js';

if (isServer) {
  function setupIconConfig(): void {
    const testNamespaces = ['default', 'picto'];
    const icon: SbbIconConfig = {
      interceptor: ({ namespace, name, request }) => {
        if (testNamespaces.includes(namespace)) {
          const dimension = name.endsWith('-large') ? 48 : name.endsWith('-medium') ? 36 : 24;
          return Promise.resolve(
            `<svg-fake
    data-name="${name}"
    height="${dimension}"
    style="width:${dimension}px;height:${dimension}px"
    width="${dimension}"
  >
  </svg-fake>`,
          );
        }
        return request();
      },
    };

    mergeConfig({
      icon,
    });
  }

  setupIconConfig();
}
