import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './tag.js';

const checked: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const label: InputType = {
  control: {
    type: 'text',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
};

const icon: InputType = {
  control: {
    type: 'text',
  },
};

const amount: InputType = {
  control: {
    type: 'number',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['s', 'm'],
};

const defaultArgTypes: ArgTypes = {
  checked,
  disabled,
  label,
  value,
  'icon-name': icon,
  amount,
  'aria-label': ariaLabel,
  size,
};

const defaultArgs: Args = {
  checked: false,
  disabled: false,
  label: 'Label',
  value: 'Value',
  'icon-name': undefined,
  amount: undefined,
  'aria-label': undefined,
  size: size.options![1],
};

const defaultArgsIconAndAmount: Args = {
  ...defaultArgs,
  amount: 123,
  'icon-name': 'dog-small',
};

const Template = ({ label, ...args }: Args): TemplateResult =>
  html`<sbb-tag ${sbbSpread(args)}>${label}</sbb-tag>`;

const TemplateSlottedIconAndAmount = ({ label, ...args }: Args): TemplateResult => html`
  <sbb-tag ${sbbSpread(args)}>
    <sbb-icon slot="icon" name="pie-small"></sbb-icon>
    ${label}
    <span slot="amount">999</span>
  </sbb-tag>
`;

export const basicTag: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const checkedTag: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true },
};

export const disabledTag: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const checkedAndDisabledTag: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true, disabled: true },
};

export const basicTagSizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![0] },
};

export const withAmount: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, amount: 123 },
};

export const withIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': 'dog-small' },
};

export const withAmountAndIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgsIconAndAmount },
};

export const withAmountAndIconSlotted: StoryObj = {
  render: TemplateSlottedIconAndAmount,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const withAmountAndIconChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgsIconAndAmount, checked: true },
};

export const withAmountAndIconDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgsIconAndAmount, disabled: true },
};

export const withAmountAndIconCheckedAndDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgsIconAndAmount,
    checked: true,
    disabled: true,
  },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['input', 'change'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-tag/sbb-tag',
};

export default meta;
