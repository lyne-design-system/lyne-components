/**
 * Docs: https://custom-elements-manifest.open-wc.org/analyzer/getting-started/
 */
export default {
  litelement: true,
  globs: ['src/components/**/*.ts'],
  exclude: ['**/*.spec.ts', '**/*.e2e.ts', '**/*.stories.ts'],
  outdir: 'dist/components',
  dependencies: false,
  packagejson: false,
  plugins: [
    {
      packageLinkPhase({ customElementsManifest }) {
        for (const module of customElementsManifest.modules) {
          module.path = module.path.replace(/^src\/components\//, '').replace(/\/[^/.]+.ts$/, '');
          for (const declaration of module.declarations.filter((d) => d.kind === 'class')) {
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
      },
    },
  ],
};
