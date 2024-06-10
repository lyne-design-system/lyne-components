import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './radio-button.js';

const longLabel: string =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";

const value: InputType = {
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

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's'],
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const labelBoldClass: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  value,
  checked,
  disabled,
  size,
  'aria-label': ariaLabel,
  labelBoldClass,
};

const defaultArgs: Args = {
  value: 'First value',
  checked: false,
  disabled: false,
  size: size.options![0],
  'aria-label': undefined,
  labelBoldClass: false,
};

const DefaultTemplate = ({ labelBoldClass, ...args }: Args): TemplateResult =>
  html`<sbb-radio-button ${sbbSpread(args)}>
    ${labelBoldClass ? html`<span class="sbb-text--bold">Value</span>` : 'Value'}
  </sbb-radio-button>`;

const MultilineLabelTemplate = ({ labelBoldClass, ...args }: Args): TemplateResult => html`
  <sbb-radio-button ${sbbSpread(args)}>
    ${labelBoldClass ? html`<span class="sbb-text--bold">${longLabel}</span>` : longLabel}
  </sbb-radio-button>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const SizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const Checked: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true },
};

export const Disabled: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const CheckedDisabled: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true, disabled: true },
};

export const MultilineLabel: StoryObj = {
  render: MultilineLabelTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true },
};

export const DefaultBold: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, labelBoldClass: true },
};

export const CheckedBold: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true, labelBoldClass: true },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-radio-button/sbb-radio-button',
};

export default meta;
