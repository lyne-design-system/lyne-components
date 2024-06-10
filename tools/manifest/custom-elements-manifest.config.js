/**
 * Docs: https://custom-elements-manifest.open-wc.org/analyzer/getting-started/
 */
export function createManifestConfig(library = '') {
  return {
    litelement: true,
    globs: [`src/${library}/**/*.ts`],
    exclude: [
      '**/*[.-]{stories,spec,test-utils}.ts',
      '**/private/*',
      '**/private.ts',
      'vite.config.ts',
    ],
    outdir: `dist/${library}`,
    dependencies: false,
    packagejson: false,
    /** @type {import('@custom-elements-manifest/analyzer').Plugin[]} */
    plugins: [
      {
        analyzePhase({ ts, node, moduleDoc }) {
          if (
            ts.isNewExpression(node) &&
            node.expression.getText() === 'NamedSlotStateController'
          ) {
            let classNode = node;
            while (classNode) {
              if (ts.isClassDeclaration(classNode)) {
                const className = classNode.name.getText();
                const classDoc = moduleDoc.declarations.find(
                  (declaration) => declaration.name === className,
                );
                classDoc['_ssrslotstate'] = true;
              }
              classNode = classNode.parent;
            }
          }
        },
        packageLinkPhase({ customElementsManifest }) {
          function fixModulePaths(node, pathAction) {
            for (const [key, value] of Object.entries(node)) {
              if (Array.isArray(value)) {
                value.forEach((v) => fixModulePaths(v, pathAction));
              } else if (typeof value === 'object') {
                fixModulePaths(value, pathAction);
              } else if (key === 'module' || key === 'path') {
                node[key] = pathAction(value);
              }
            }
          }
          const fixTsPathsReg = new RegExp(`^\\/?src\\/${library}\\/`);
          const fixTsPaths = (value) => value.replace(fixTsPathsReg, '').replace(/.ts$/, '.js');
          for (const module of customElementsManifest.modules) {
            fixModulePaths(module, fixTsPaths);
            for (const declaration of module.declarations.filter((d) => d.kind === 'class')) {
              if (declaration.name === 'SbbIconBase') {
                delete declaration.customElement;
              }
              for (const member of declaration.members) {
                if (member.name.startsWith('_') && member.default) {
                  const publicName = member.name.replace(/^_/, '');
                  const publicMember = declaration.members.find((m) => m.name === publicName);
                  if (publicMember) {
                    publicMember.default = member.default;
                  }
                }
              }
            }
          }
          const reexportModules = [];
          const moduleMapping = new Map();
          for (const moduleEntry of customElementsManifest.modules) {
            if (
              !reexportModules.includes(moduleEntry) &&
              moduleEntry.exports?.length &&
              moduleEntry.exports.some((e) => e.name !== '*')
            ) {
              const reexportPath = moduleEntry.path.replace(/\/[\w-]+\.js/, '.js');
              const reexportModule = customElementsManifest.modules.find(
                (m) => m.path === reexportPath,
              );
              if (reexportModule) {
                moduleMapping.set(moduleEntry.path, reexportModule.path);
                reexportModules.push(reexportModule);
                reexportModule.declarations.push(...moduleEntry.declarations);
                for (const entry of moduleEntry.exports) {
                  entry.declaration.module = reexportModule.path;
                }
                reexportModule.exports = reexportModule.exports.filter(
                  (e) =>
                    e.name !== '*' ||
                    moduleEntry.path ===
                      reexportModule.path.replace(/\/[\w-]+\.js/, '') +
                        e.declaration.package.substring(2),
                );
                reexportModule.exports.push(...moduleEntry.exports);
                customElementsManifest.modules = customElementsManifest.modules.filter(
                  (m) => m !== moduleEntry,
                );
              }
            }
          }
          fixModulePaths(customElementsManifest, (value) => moduleMapping.get(value) ?? value);
        },
      },
    ],
  };
}
