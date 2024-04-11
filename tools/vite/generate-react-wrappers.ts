/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  statSync,
  rmSync,
  unlinkSync,
} from 'fs';
import { pathToFileURL } from 'node:url';

import type {
  Package,
  Export,
  CustomElementDeclaration,
  Module,
  ClassField,
  ClassDeclaration,
  Declaration,
} from 'custom-elements-manifest';
import type { PluginOption } from 'vite';

import { distDir } from './build-meta.js';
import { resolveEntryPoints } from './resolve-entry-points.js';

export function generateReactWrappers(): PluginOption {
  const manifestPath = new URL('./components/custom-elements.json', distDir);
  let manifest: Package;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.error(
      `Failed to read manifest at ${manifestPath}. Please run 'yarn build:components' or 'yarn docs:manifest' first!`,
    );
    process.exit(1);
  }

  const generatedPaths: URL[] = [];
  function createDir(dir: URL): void {
    if (!existsSync(dir)) {
      createDir(new URL('..', dir));
      generatedPaths.push(dir);
      mkdirSync(dir);
    }
  }
  return {
    name: 'generate-react-wrappers',
    config(config) {
      const packageRoot = pathToFileURL(config.root!);
      const declarations = manifest.modules
        .filter((m) => m.kind === 'javascript-module' && m.declarations?.length)
        .reduce((current, next) => current.concat(next.declarations ?? []), [] as Declaration[]);
      const exports = manifest.modules.reduce(
        (current, next) => current.concat(next.exports ?? []),
        [] as Export[],
      );
      for (const module of manifest.modules.filter((m) => !m.path.startsWith('core/'))) {
        for (const declaration of module.declarations?.filter(
          (d): d is CustomElementDeclaration => 'customElement' in d && d.customElement,
        ) ?? []) {
          const targetPath = new URL(`./${module.path}/index.ts`, packageRoot);
          createDir(new URL('.', targetPath));
          const reactTemplate = renderTemplate(declaration, declarations, module, exports);
          generatedPaths.push(targetPath);
          writeFileSync(targetPath, reactTemplate, 'utf8');
        }
      }

      for (const dirent of readdirSync(packageRoot, { withFileTypes: true }).filter((d) =>
        d.isDirectory(),
      )) {
        const dir = new URL(`./${dirent.name}/`, packageRoot);
        const dirIndex = new URL('./index.ts', dir);
        if (!existsSync(dirIndex)) {
          generatedPaths.push(dirIndex);
          const dirInfo = readdirSync(dir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => `export * from './${d.name}';\n`)
            .join('');
          writeFileSync(new URL('./index.ts', dir), dirInfo, 'utf8');
        }
      }

      config.build!.lib = {
        ...(config.build!.lib ? config.build!.lib : {}),
        entry: resolveEntryPoints(packageRoot),
      };
    },
    closeBundle() {
      for (const path of generatedPaths.sort((a, b) => b.pathname.length - a.pathname.length)) {
        try {
          if (statSync(path).isDirectory()) {
            rmSync(path, { recursive: true, force: true });
          } else {
            unlinkSync(path);
          }
        } catch {
          /* empty */
        }
      }
    },
  };
}

function renderTemplate(
  declaration: CustomElementDeclaration,
  declarations: Declaration[],
  module: Module,
  exports: Export[],
): string {
  const extensions = findExtensionUsage(declaration, declarations);
  const relativeCoreImportPath = `${'../'.repeat(module.path.split('/').length)}core`;
  const extensionImport = !extensions.size
    ? ''
    : `
  
  import { ${Array.from(extensions.keys()).join(', ')} } from '${relativeCoreImportPath}';`;
  const extension = [...extensions.values()].reduce(
    (current, next) => (v) => current(next(v)),
    (v: string) => v,
  );
  const componentsImports = new Map<string, string[]>().set(module.path, [declaration.name]);
  const customEventTypes =
    declaration.events
      ?.filter(
        (e) =>
          e.type.text.startsWith('CustomEvent<') &&
          ['void', '{', 'File'].every((m) => !e.type.text.includes(`<${m}`)),
      )
      .map((e) => e.type.text.substring(12).slice(0, -1))
      .sort()
      .filter((v, i, a) => a.indexOf(v) === i && v.length > 1) ?? [];
  // If a type or interface needs to be imported, the custom elements analyzer will not
  // detect/extract these and therefore we need to have a manual list of required
  // types/interfaces.
  const interfaces = new Map<string, string>().set('SbbValidationChangeEvent', 'core/interfaces');
  for (const customEventType of customEventTypes) {
    const exportModule = exports.find((e) => e.name === customEventType);
    if (exportModule) {
      if (!componentsImports.has(exportModule.declaration.module!)) {
        componentsImports.set(exportModule.declaration.module!, [`type ${customEventType}`]);
      } else {
        componentsImports.get(exportModule.declaration.module!)!.push(`type ${customEventType}`);
      }
    } else if (interfaces.has(customEventType)) {
      const moduleName = interfaces.get(customEventType)!;
      if (!componentsImports.has(moduleName)) {
        componentsImports.set(moduleName, [`type ${customEventType}`]);
      } else {
        componentsImports.get(moduleName)!.push(`type ${customEventType}`);
      }
    } else {
      componentsImports.get(module.path)!.push(`type ${customEventType}`);
    }
  }
  const reactTemplate = `/* autogenerated */
  import { createComponent${declaration.events?.length ? ', type EventName' : ''} } from '${relativeCoreImportPath}';
  ${Array.from(componentsImports)
    .map(
      ([key, imports]) =>
        `import { ${imports.join(', ')} } from '@sbb-esta/lyne-components/${key}';`,
    )
    .join('\n')}
  import react from 'react';${extensionImport}
  
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export const ${declaration.name.replace(/Element$/, '')} = ${extension(`createComponent({
    tagName: '${declaration.tagName}',
    elementClass: ${declaration.name},
    react,${
      declaration.events
        ? `
    events: {${declaration
      .events!.map(
        (e) =>
          `\n    'on${e.name.charAt(0).toUpperCase() + e.name.slice(1)}': '${e.name}' as EventName<${e.type.text.replace(
            '<T>',
            '<any>',
          )}>,`,
      )
      .join('')}
    },
  `
        : ''
    }
  })`)};
  `;
  return reactTemplate;
}

function findExtensionUsage(
  declaration: ClassDeclaration,
  declarations: Declaration[],
): Map<string, (_: string) => string> {
  const extensions = new Map<string, (_: string) => string>();
  if (usesSsrSlotState(declaration, declarations)) {
    extensions.set('withSsrDataSlotNames', (v) => `withSsrDataSlotNames(${v})`);
  }
  const childTypes = namedSlotListElements(declaration);
  if (childTypes.length) {
    extensions.set(
      'withSsrDataChildCount',
      (v) => `withSsrDataChildCount([${childTypes.map((t) => `'${t}'`).join(', ')}], ${v})`,
    );
  }
  return extensions;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
type ClassDeclarationSSR = ClassDeclaration & { _ssrslotstate?: boolean };
const ssrSlotStateKey = '_ssrslotstate';
function usesSsrSlotState(
  declaration: ClassDeclarationSSR | undefined,
  declarations: Declaration[],
): boolean {
  while (declaration) {
    if (
      declaration[ssrSlotStateKey] ||
      declaration.mixins?.some((m) =>
        declarations.find((d) => d.name === m.name && (d as ClassDeclarationSSR)[ssrSlotStateKey]),
      )
    ) {
      return true;
    }

    declaration = declarations.find(
      (d): d is ClassDeclarationSSR => d.name === declaration!.superclass?.name,
    );
  }

  return false;
}

function namedSlotListElements(declaration: ClassDeclaration): string[] {
  return (
    declaration.members
      ?.find(
        (m): m is ClassField =>
          m.inheritedFrom?.name === 'NamedSlotListElement' && m.name === 'listChildTagNames',
      )
      ?.default?.match(/([\w-]+)/g)
      ?.map((m) =>
        m
          .split('-')
          .map((s) => s[0] + s.substring(1).toLowerCase())
          .join(''),
      ) ?? []
  );
}
