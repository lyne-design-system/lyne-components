import { withActions } from '@storybook/addon-actions/decorator';
import type {
  Args,
  ArgTypes,
  Decorator,
  Meta,
  StoryContext,
  StoryObj,
} from '@storybook/web-components';

import {
  inline,
  inlineNegative,
  linkDefaultArgs,
  linkDefaultArgTypes,
} from '../common/link-common-stories.js';

import readme from './readme.md?raw';
import './link.js';

const defaultArgTypes: ArgTypes = {
  ...linkDefaultArgTypes,
};

const defaultArgs: Args = {
  ...linkDefaultArgs,
  tag: 'sbb-link',
};

export const Inline: StoryObj = inline;
export const InlineNegative: StoryObj = inlineNegative;

const meta: Meta = {
  argTypes: defaultArgTypes,
  args: defaultArgs,
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-charcoal)' : 'var(--sbb-color-white)',
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-link/sbb-link',
};

export default meta;
