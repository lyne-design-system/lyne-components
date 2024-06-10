import { existsSync } from 'node:fs';
import { Readable } from 'node:stream';
import type * as streamWeb from 'node:stream/web';

import type { TestRunnerPlugin } from '@web/test-runner';
import { createServer, type ViteDevServer } from 'vite';

// Reference: https://github.com/remcovaes/web-test-runner-vite-plugin
export function vitePlugin(): TestRunnerPlugin {
  let viteServer: ViteDevServer;

  return {
    name: 'vite-plugin',

    async serverStart({ app, fileWatcher }) {
      const externals = [
        // @web/test-runner-commands needs to establish a web-socket
        // connection. It expects a file to be served from the
        // @web/dev-server. So it should be ignored by Vite.
        '/__web-dev-server__web-socket.js',
      ];

      viteServer = await createServer({
        clearScreen: false,
        plugins: [
          {
            name: 'file-name',
            transform(_src, id) {
              const file = id.split('?')[0];
              if (!file.startsWith('\0') && existsSync(file)) {
                fileWatcher.add(id);
              }
            },
          },
          {
            name: 'mark-external',
            resolveId: (id) => (externals.includes(id) ? { id, external: true } : undefined),
          },
        ],
        // Disable hmr in favor of the @web/test-runner to take care of restarts.
        server: { hmr: false },
        // This configuration is necessary, as vite will otherwise detect dependencies
        // that can be optimized. This will cause vite to reload, which leads to
        // 'Could not import your test module.' errors, that happen randomly.
        // Disabling discovery prevents this from happening at the cost of slightly
        // increased test times.
        optimizeDeps: {
          noDiscovery: true,
        },
      });
      await viteServer.listen();

      const baseUrl = `http${viteServer.config.server.https ? 's' : ''}://localhost:${viteServer.config.server.port}`;
      app.use(async (ctx) => {
        const url = baseUrl + ctx.originalUrl;
        // Retry once on failure.
        // This can happen when too many http requests are being handled by the operating system.
        const response = await fetch(url).catch(() => Promise.resolve().then(() => fetch(url)));
        ctx.body = Readable.fromWeb(response.body as streamWeb.ReadableStream);
        ctx.set(Object.fromEntries(response.headers));
        ctx.status = response.status;
      });
    },
    async serverStop() {
      return await viteServer.close();
    },
  };
}
