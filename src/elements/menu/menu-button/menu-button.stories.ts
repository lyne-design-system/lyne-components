import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './menu-button.js';
import '../../icon.js';

const getBasicTemplate = (
  { text, ...args }: Args,
  id: number,
  iconSlot = false,
): TemplateResult => html`
  <sbb-menu-button ${sbbSpread(args)}>
    ${text} ${id} ${iconSlot ? html`<sbb-icon slot="icon" name="pie-small"></sbb-icon>` : nothing}
  </sbb-menu-button>
`;

const TemplateMenuAction = (args: Args): TemplateResult => html`
  ${getBasicTemplate(args, 1)} ${getBasicTemplate(args, 2)} ${getBasicTemplate(args, 3)}
`;

const TemplateMenuActionCustomIcon = (args: Args): TemplateResult => html`
  ${getBasicTemplate(args, 1, true)} ${getBasicTemplate(args, 2, false)}
  ${getBasicTemplate(args, 3, true)}
`;

const text: InputType = {
  control: {
    type: 'text',
  },
};

const amount: InputType = {
  control: {
    type: 'text',
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

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  text,
  amount,
  'icon-name': iconName,
  type,
  disabled,
  name,
  value,
  form,
  'aria-label': ariaLabel,
};

const defaultArgs: Args = {
  text: 'Details',
  amount: '99',
  'icon-name': 'tick-small',
  disabled: false,
  type: type.options![0],
  name: 'detail',
  value: 'Value',
  form: 'form-name',
  'aria-label': ariaLabel,
};

export const menuButton: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const menuButtonCustomIconNoAmount: StoryObj = {
  render: TemplateMenuActionCustomIcon,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    amount: undefined,
    'icon-name': undefined,
  },
};

export const menuButtonNoIconNoAmount: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': undefined, amount: undefined },
};

export const menuButtonDisabled: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const menuActionButtonEllipsis: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
};

const meta: Meta = {
  decorators: [
    (story) => html`<div style=${styleMap({ width: '256px' })}>${story()}</div>`,
    withActions as Decorator,
  ],
  parameters: {
    backgroundColor: () => 'var(--sbb-color-black)',
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-menu/sbb-menu-button',
};

export default meta;
