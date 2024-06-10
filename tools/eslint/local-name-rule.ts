import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/sbb-design-systems/lyne-components/blob/main/tools/eslint/${name}.ts`,
);

type MessageIds = 'useLocalName';

export const name = 'local-name-rule';
export const rule: TSESLint.RuleModule<MessageIds, never[]> = createRule<never[], MessageIds>({
  create(context) {
    return {
      ['MemberExpression > Identifier[name="tagName"]'](node: TSESTree.Identifier) {
        if (node.name === 'tagName') {
          context.report({
            node,
            messageId: 'useLocalName',
          });
        }
      },
    };
  },
  name,
  meta: {
    docs: {
      description: 'Avoid using `tagName`, use `localName` instead.',
      recommended: 'recommended',
    },
    messages: {
      useLocalName: 'Avoid using `tagName`, use `localName` instead.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
});
