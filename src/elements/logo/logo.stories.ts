import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './logo.js';

const Template = (args: Args): TemplateResult => html`<sbb-logo ${sbbSpread(args)}></sbb-logo>`;

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const protectiveRoom: InputType = {
  control: {
    type: 'select',
  },
  options: ['none', 'minimal', 'ideal'],
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  negative,
  'protective-room': protectiveRoom,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  negative: false,
  'protective-room': protectiveRoom.options![0],
  'accessibility-label': undefined,
};

export const NoProtectiveRoom: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const MinimalProtectiveRoom: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'protective-room': protectiveRoom.options![1] },
};

export const IdealProtectiveRoom: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'protective-room': protectiveRoom.options![2] },
};

export const Negative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    negative: true,
    'protective-room': protectiveRoom.options![2],
  },
};

const meta: Meta = {
  decorators: [(story) => html`<div style=${styleMap({ 'max-width': '300px' })}>${story()}</div>`],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-charcoal)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
    chromatic: {
      viewports: [320],
    },
  },
  title: 'elements/sbb-logo',
};

export default meta;
