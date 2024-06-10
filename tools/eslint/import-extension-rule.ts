import { existsSync, statSync } from 'fs';
import { dirname, resolve } from 'path';

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/sbb-design-systems/lyne-components/blob/main/tools/eslint/${name}.ts`,
);

type MessageIds = 'importExtensionRule' | 'importIndexExtensionRule';

export const name = 'import-extension-rule';
export const rule: TSESLint.RuleModule<MessageIds, never[]> = createRule<never[], MessageIds>({
  create(context) {
    function rule(originalNode: TSESTree.Node): void {
      const node = originalNode as
        | TSESTree.ExportAllDeclaration
        | TSESTree.ExportNamedDeclarationWithSource
        | TSESTree.ImportDeclaration;
      const value = node.source?.value.replace(/\?.*$/, '');
      if (!value || !value.startsWith('.') || value.endsWith('.js')) {
        return;
      }

      const path = resolve(dirname(context.filename), value);
      if (!existsSync(path)) {
        context.report({
          node,
          messageId: 'importExtensionRule',
          data: { import: value },
          fix: !node.source.value.includes('?')
            ? (fixer) => fixer.replaceText(node.source, `'${node.source.value}.js'`)
            : undefined,
        });
      } else if (existsSync(path) && statSync(path).isDirectory()) {
        context.report({
          node,
          messageId: 'importExtensionRule',
          data: { import: value },
          fix: (fixer) => fixer.replaceText(node.source, `'${node.source.value}/index.js'`),
        });
      }
    }

    return {
      DeclareExportDeclaration: rule,
      DeclareExportAllDeclaration: rule,
      ExportAllDeclaration: rule,
      ExportNamedDeclaration: rule,
      ImportDeclaration: rule,
    };
  },
  name,
  meta: {
    docs: {
      description: 'Relative imports and exports must end with .js',
      recommended: 'recommended',
    },
    messages: {
      importExtensionRule: 'Missing .js extension in import/export path ({{ import }})',
      importIndexExtensionRule: 'Missing index.js in import/export path ({{ import }})',
    },
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
});
