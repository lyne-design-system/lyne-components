import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType, StoryContext } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './timetable-occupancy-icon.js';

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const occupancy: InputType = {
  control: {
    type: 'select',
  },
  options: ['high', 'medium', 'low', 'none'],
};

const defaultArgTypes: ArgTypes = {
  negative,
  occupancy,
};

const defaultArgs: Args = {
  negative: false,
  occupancy: occupancy.options![0],
};

const Template = (args: Args): TemplateResult => html`
  <sbb-timetable-occupancy-icon ${sbbSpread(args)}></sbb-timetable-occupancy-icon>
`;

export const HighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const MediumOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, occupancy: occupancy.options![1] },
};

export const LowOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, occupancy: occupancy.options![2] },
};

export const NoneOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, occupancy: occupancy.options![3] },
};

export const HighOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
};

export const MediumOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, occupancy: occupancy.options![1] },
};

export const LowOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, occupancy: occupancy.options![2] },
};

export const NoneOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true, occupancy: occupancy.options![3] },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/timetable/sbb-timetable-occupancy-icon',
};

export default meta;
