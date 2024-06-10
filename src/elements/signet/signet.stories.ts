import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './signet.js';

const Template = (args: Args): TemplateResult => html`<sbb-signet ${sbbSpread(args)}></sbb-signet>`;

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
  'protective-room': protectiveRoom,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  'protective-room': protectiveRoom.options![0],
  'accessibility-label': undefined,
};

export const NoProtectiveRoom: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'protective-room': protectiveRoom.options![0] },
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

const meta: Meta = {
  decorators: [(story) => html`<div style="max-width: 300px;">${story()}</div>`],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    chromatic: {
      viewports: [320],
    },
  },
  title: 'elements/sbb-signet',
};

export default meta;
