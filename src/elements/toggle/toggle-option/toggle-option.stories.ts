import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './toggle-option.js';

const label: InputType = {
  control: {
    type: 'text',
  },
};

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

const iconName: InputType = {
  control: {
    type: 'select',
  },
  options: ['arrow-right-small', 'app-icon-small', 'train-small', 'swisspass-small'],
};

const value: InputType = {
  control: {
    type: 'text',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const defaultArgTypes: ArgTypes = {
  label,
  value,
  checked,
  disabled,
  'icon-name': iconName,
  'aria-label': ariaLabel,
};

const defaultArgs: Args = {
  label: 'Option',
  value: 'Value',
  checked: false,
  disabled: false,
  'icon-name': undefined,
  'aria-label': undefined,
};

const DefaultTemplate = ({ label, ...args }: Args): TemplateResult => html`
  <sbb-toggle-option ${sbbSpread(args)}>${label}</sbb-toggle-option>
`;

const SlottedIconTemplate = ({
  label,
  'icon-name': iconName,
  ...args
}: Args): TemplateResult => html`
  <sbb-toggle-option ${sbbSpread(args)}>
    <sbb-icon slot="icon" name=${iconName}></sbb-icon>
    ${label}
  </sbb-toggle-option>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs },
};

export const IconOnly: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, label: undefined, 'icon-name': iconName.options![1] },
};

export const LabelAndIcon: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, 'icon-name': iconName.options![1] },
};

export const IconOnlySlotted: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, label: undefined, 'icon-name': iconName.options![1] },
};

export const LabelAndIconSlotted: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, 'icon-name': iconName.options![1] },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['input'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-toggle/sbb-toggle-option',
};

export default meta;
