import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/sbb-design-systems/lyne-components/blob/main/tools/eslint/${name}.ts`,
);

type MessageIds = 'customElementDecoratorPosition';

export const name = 'custom-element-decorator-position-rule';
export const rule: TSESLint.RuleModule<MessageIds, never[]> = createRule<never[], MessageIds>({
  create(context) {
    return {
      ['ClassDeclaration > Decorator[expression.callee.name="customElement"]'](
        node: TSESTree.Decorator,
      ) {
        const classParent = node.parent as TSESTree.ClassDeclaration;

        if (classParent.decorators![0] !== node) {
          context.report({
            node: classParent.id ? classParent.id : classParent,
            messageId: 'customElementDecoratorPosition',
          });
        }
      },
    };
  },
  name,
  meta: {
    docs: {
      description:
        '@customElement decorator must be the first in order before all custom decorators',
      recommended: 'recommended',
    },
    messages: {
      customElementDecoratorPosition:
        '@customElement decorator must be the first in order before all custom decorators',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
});
