import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/sbb-design-systems/lyne-components/blob/main/tools/eslint/${name}.ts`,
);

type MessageIds = 'customElementClassName';

export const name = 'custom-element-class-name-rule';
export const rule: TSESLint.RuleModule<'customElementClassName', never[]> = createRule<
  never[],
  MessageIds
>({
  create(context) {
    return {
      ['ClassDeclaration > Decorator[expression.callee.name="customElement"]'](
        node: TSESTree.Decorator,
      ) {
        const isClassDeclaration = (node: TSESTree.Node): node is TSESTree.ClassDeclaration => {
          return node.type === AST_NODE_TYPES.ClassDeclaration;
        };

        const getClassName = (node: TSESTree.Node): string | undefined => {
          if (isClassDeclaration(node)) {
            return node.id?.name;
          }
          if (node.parent) {
            return getClassName(node.parent);
          }
          return undefined;
        };

        const classParent = node.parent as TSESTree.ClassDeclaration;
        const className = getClassName(classParent);

        if (!className || !className.startsWith('Sbb') || !className.endsWith('Element')) {
          context.report({
            node: classParent.id ? classParent.id : classParent,
            messageId: 'customElementClassName',
          });
        }
      },
    };
  },
  name,
  meta: {
    docs: {
      description: 'Components class name should start with `Sbb` and end with `Element`',
      recommended: 'recommended',
    },
    messages: {
      customElementClassName:
        'Components class name should start with `Sbb` and end with `Element`',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
});
