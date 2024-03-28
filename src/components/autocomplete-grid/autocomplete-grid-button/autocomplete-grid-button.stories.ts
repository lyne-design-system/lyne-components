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
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../core/dom';

import readme from './readme.md?raw';
import '../autocomplete-grid-row';
import '../autocomplete-grid-actions';
import './autocomplete-grid-button';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

const type: InputType = {
  control: {
    type: 'select',
  },
  options: ['button', 'reset', 'submit'],
  table: {
    category: 'Button',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Button',
  },
};

const name: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const form: InputType = {
  control: {
    type: 'text',
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
  type,
  disabled,
  name,
  value,
  form,
  negative,
  'icon-name': iconName,
  'aria-label': ariaLabel,
  active,
  focusVisible,
};

const defaultArgs: Args = {
  type: type.options[0],
  disabled: false,
  name: 'Button Name',
  value: undefined,
  form: undefined,
  negative: false,
  'icon-name': 'arrow-right-small',
  'aria-label': 'arrow-right-small',
  active: false,
  focusVisible: false,
};

const Template = ({ active, focusVisible, ...args }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-row ?data-negative=${args.negative}>
    <sbb-autocomplete-grid-actions>
      <sbb-autocomplete-grid-button
        ${sbbSpread(args)}
        ?data-active=${active}
        ?data-focus-visible=${focusVisible}
      ></sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
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
  decorators: [
    (story, context) => html`
      <div style=${styleMap({ ...wrapperStyle(context), padding: '2rem' })}>${story()}</div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: ['click'],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid-button',
};

export default meta;
