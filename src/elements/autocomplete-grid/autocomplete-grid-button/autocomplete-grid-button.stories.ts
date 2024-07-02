import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type {
  Args,
  ArgTypes,
  Decorator,
  Meta,
  StoryContext,
  StoryObj,
} from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-cell.js';
import './autocomplete-grid-button.js';

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Button',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Icon',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const active: InputType = {
  control: {
    type: 'boolean',
  },
};

const focusVisible: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  disabled,
  negative,
  'icon-name': iconName,
  'aria-label': ariaLabel,
  active,
  focusVisible,
};

const defaultArgs: Args = {
  disabled: false,
  negative: false,
  'icon-name': 'arrow-right-small',
  'aria-label': 'arrow-right-small',
  active: false,
  focusVisible: false,
};

const Template = ({ active, focusVisible, ...args }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-row ?data-negative=${args.negative}>
    <sbb-autocomplete-grid-cell>
      <sbb-autocomplete-grid-button
        ${sbbSpread(args)}
        ?data-active=${active}
        ?data-focus-visible=${focusVisible}
      ></sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-cell>
  </sbb-autocomplete-grid-row>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Negative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const Active: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, active: true },
};

export const FocusVisible: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, focusVisible: true },
};

export const NegativeDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, disabled: true },
};

export const NegativeActive: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, active: true },
};

export const NegativeFocusVisible: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, focusVisible: true },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['click'],
    },
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-autocomplete-grid/sbb-autocomplete-grid-button',
};

export default meta;
