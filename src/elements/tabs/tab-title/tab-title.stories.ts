import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import '../../icon.js';
import './tab-title.js';

const Template = ({ iconSlot, label, amountSlot, ...args }: Args): TemplateResult => html`
  <sbb-tab-title ${sbbSpread(args)}>
    ${iconSlot ? html`<sbb-icon slot="icon" name=${iconSlot}></sbb-icon>` : nothing} ${label}
    ${amountSlot ? html`<span slot="amount">${amountSlot}</span>` : nothing}
  </sbb-tab-title>
`;

const label: InputType = {
  control: {
    type: 'text',
  },
};

const iconName: InputType = {
  control: {
    type: 'select',
  },
  options: ['app-icon-small', 'train-small', 'swisspass-small', 'pie-small'],
};

const amount: InputType = {
  control: {
    type: 'number',
  },
};

const amountSlot: InputType = {
  control: {
    type: 'number',
  },
};

const activeArg: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Tab State',
  },
};

const disabledArg: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Tab State',
  },
};

const basicArgTypes: ArgTypes = {
  label,
  'icon-name': iconName,
  iconSlot: iconName,
  amount,
  amountSlot,
  active: activeArg,
  disabled: disabledArg,
};

const basicArgs: Args = {
  label: 'Tab title',
  'icon-name': iconName.options![0],
  iconSlot: undefined,
  amount: 123,
  amountSlot: undefined,
  active: false,
  disabled: false,
};

export const Default: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const Active: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, active: true },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const ActiveAndDisabled: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, active: true },
};

export const WithoutIcon: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'icon-name': undefined },
};

export const WithoutAmount: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: undefined },
};

export const WithoutIconAndWithoutAmount: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: undefined, 'icon-name': undefined },
};

export const SlottedIcon: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'icon-name': undefined,
    iconSlot: 'train-small',
  },
};

export const SlottedAmount: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: undefined, amountSlot: 123 },
};

export const SlottedAmountDisabled: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: undefined, amountSlot: 123, disabled: true },
};

export const WithEllipsis: StoryObj = {
  render: Template,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    label: `A very long label which gets ellipsis when there is no more space to display it`,
  },
  decorators: [(story) => html`<div style="max-width: 400px;">${story()}</div>`],
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-tab/sbb-tab-title',
};

export default meta;
