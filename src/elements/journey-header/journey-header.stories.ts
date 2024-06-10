import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './journey-header.js';

const origin: InputType = {
  control: {
    type: 'text',
  },
};

const destination: InputType = {
  control: {
    type: 'text',
  },
};

const roundTrip: InputType = {
  control: {
    type: 'boolean',
  },
};

const level: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['1', '2', '3', '4', '5', '6'],
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['s', 'm', 'l'],
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  origin,
  destination,
  'round-trip': roundTrip,
  level,
  size,
  negative,
};

const defaultArgs: Args = {
  origin: 'La Chaux de Fonds',
  destination: 'Loèche-les-Bains',
  'round-trip': false,
  level: level.options![2],
  size: size.options![1],
  negative: false,
};

const Template = (args: Args): TemplateResult =>
  html`<sbb-journey-header ${sbbSpread(args)}></sbb-journey-header>`;

export const SizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const SizeMRoundTrip: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'round-trip': true },
};

export const SizeMNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
};

export const SizeMRoundTripShortText: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    origin: 'Bern',
    destination: 'Thun',
    'round-trip': true,
  },
};

export const SizeL: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![2] },
};

export const SizeLRoundTripShortText: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    origin: 'Bern',
    destination: 'Thun',
    'round-trip': true,
    size: size.options![2],
  },
};

export const SizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![0] },
};

export const SizeSRoundTripShortText: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    origin: 'Bern',
    destination: 'Thun',
    'round-trip': true,
    size: size.options![0],
  },
};

const meta: Meta = {
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-charcoal)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-journey-header',
};

export default meta;
