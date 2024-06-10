import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';

import './card-badge.js';
import '../card.js';

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const color: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['charcoal', 'white'],
};

const defaultArgTypes: ArgTypes = {
  'aria-label': ariaLabel,
  color,
};

const defaultArgs: Args = {
  'aria-label': 'Super saver sales ticket price starts at CHF 92.50 Black Friday Special',
  color: color.options![0],
};

const Template = (args: Args): TemplateResult => html`
  <sbb-card color="milk">
    <sbb-card-badge ${sbbSpread(args)}>
      <span>%</span>
      <span>from CHF</span>
      <span>92.50</span>
      <span> <time datetime="2021-11-25">Black Friday</time> Special </span>
    </sbb-card-badge>
  </sbb-card>
`;

export const Charcoal: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

export const White: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    color: color.options![1],
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-card/sbb-card-badge',
};

export default meta;
