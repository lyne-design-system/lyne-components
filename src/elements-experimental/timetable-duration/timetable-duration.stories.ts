import type { Meta, StoryObj, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import readme from './readme.md?raw';
import sampleData from './timetable-duration.sample-data.js';
import './timetable-duration.js';

const Template = ({ config }: Args): TemplateResult => html`
  <sbb-timetable-duration config=${JSON.stringify(config)}></sbb-timetable-duration>
`;

const config: Args = {
  table: {
    disable: false,
  },
};

const defaultArgTypes = {
  config,
};

export const MinutesOnly: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    config: sampleData[0],
  },
};

export const OneHourOneMinute: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    config: sampleData[1],
  },
};

export const HoursAndMinutes: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    config: sampleData[2],
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'experimental/sbb-timetable-duration',
};

export default meta;
