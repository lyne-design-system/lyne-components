import type { LibraryOptions, PluginOption, ResolvedConfig } from 'vite';

export function generateRootEntryPoint(): PluginOption {
  let viteConfig: ResolvedConfig;
  return {
    name: 'package-json-templating',
    configResolved(config) {
      viteConfig = config;
    },
    async generateBundle() {
      if (viteConfig.command !== 'build') {
        return;
      }
      const entry = (viteConfig.build.lib as LibraryOptions).entry as Record<string, string>;
      const classNameMap: Record<string, string> = {
        SbbOptgroupElement: 'SbbOptGroupElement',
      };
      const toElementName = (key: string): string => {
        const className = `sbb-${key.split('/').reverse()[0]}-element`.replace(/(^\w|-\w)/g, (m) =>
          m.replace(/-/, '').toUpperCase(),
        );
        return classNameMap[className] ?? className;
      };
      const keys = Object.keys(entry)
        .filter(
          (e, _, a) =>
            a.every((iv) => !iv.startsWith(e + '/')) &&
            !e.startsWith('core/') &&
            !e.endsWith('/common'),
        )
        .sort()
        .map((e) => ({ path: `./${e}.js`, symbol: toElementName(e) }))
        .filter((v, i, a) => a.findIndex((iv) => iv.symbol === v.symbol) === i);
      const imports = keys.map((e) => `import { ${e.symbol} } from "${e.path}";\n`).join('');
      this.emitFile({
        type: 'asset',
        fileName: 'index.js',
        source: `${imports}\n${keys.map((e) => `globalThis.${e.symbol} = ${e.symbol};\n`).join('')}\nexport {}\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'index.d.ts',
        source: `${imports}\ndeclare global {\n${keys.map((e) => `  var ${e.symbol}: ${e.symbol};\n`).join('')}}\n\nexport {}\n`,
      });
    },
  };
}
