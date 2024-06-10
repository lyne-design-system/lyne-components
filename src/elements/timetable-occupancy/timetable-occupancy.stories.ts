import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, Args, StoryContext, ArgTypes } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import './timetable-occupancy.js';

import readme from './readme.md?raw';

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const firstClassOccupancy: Args = {
  table: {
    disable: false,
  },
};

const secondClassOccupancy: Args = {
  table: {
    disable: false,
  },
};

const defaultArgTypes: ArgTypes = {
  negative,
  'first-class-occupancy': firstClassOccupancy,
  'second-class-occupancy': secondClassOccupancy,
};

const defaultArgs: Args = {
  negative: false,
};

const Template = ({ ...args }: Args): TemplateResult => html`
  <sbb-timetable-occupancy ${sbbSpread(args)}></sbb-timetable-occupancy>
`;

export const NoneNoneOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'none', 'second-class-occupancy': 'none' },
};

export const NoneLowOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'none', 'second-class-occupancy': 'low' },
};

export const NoneMediumOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'none', 'second-class-occupancy': 'medium' },
};

export const NoneHighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'none', 'second-class-occupancy': 'high' },
};

export const LowLowOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'low', 'second-class-occupancy': 'low' },
};

export const LowMediumOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'low', 'second-class-occupancy': 'medium' },
};

export const LowHighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'low', 'second-class-occupancy': 'high' },
};

export const MediumMediumOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'medium', 'second-class-occupancy': 'medium' },
};

export const MediumHighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'medium', 'second-class-occupancy': 'high' },
};

export const HighHighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'first-class-occupancy': 'high', 'second-class-occupancy': 'high' },
};

export const NoneNoneOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'none',
    'second-class-occupancy': 'none',
    negative: true,
  },
};

export const NoneLowOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'none',
    'second-class-occupancy': 'low',
    negative: true,
  },
};

export const NoneMediumOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'none',
    'second-class-occupancy': 'medium',
    negative: true,
  },
};

export const NoneHighOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'none',
    'second-class-occupancy': 'high',
    negative: true,
  },
};

export const LowLowOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'low',
    'second-class-occupancy': 'low',
    negative: true,
  },
};

export const LowMediumOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'low',
    'second-class-occupancy': 'medium',
    negative: true,
  },
};

export const LowHighOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'low',
    'second-class-occupancy': 'high',
    negative: true,
  },
};

export const MediumMediumOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'medium',
    'second-class-occupancy': 'medium',
    negative: true,
  },
};

export const MediumHighOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'medium',
    'second-class-occupancy': 'high',
    negative: true,
  },
};

export const HighHighOccupancyNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'first-class-occupancy': 'high',
    'second-class-occupancy': 'high',
    negative: true,
  },
};

const meta: Meta = {
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
    chromatic: { disableSnapshot: true },
  },
  title: 'elements/timetable/sbb-timetable-occupancy',
};

export default meta;
