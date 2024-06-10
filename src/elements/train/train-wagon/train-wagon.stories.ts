import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './train-wagon.js';

const Template = (args: Args): TemplateResult =>
  html`<sbb-train-wagon ${sbbSpread(args)}></sbb-train-wagon>`;

const WagonIconsTemplate = (args: Args): TemplateResult => html`
  <sbb-train-wagon ${sbbSpread(args)}>
    <sbb-icon aria-hidden="false" aria-label="wheelchair space" name="sa-rs"></sbb-icon>
    <sbb-icon aria-hidden="false" aria-label="low-floor entry" name="sa-nf"></sbb-icon>
    <sbb-icon
      aria-hidden="false"
      aria-label="Business zone in 1st class: Reservation possible"
      name="sa-bz"
    ></sbb-icon>
  </sbb-train-wagon>
`;

const WagonOneIconTemplate = (args: Args): TemplateResult => html`
  <sbb-train-wagon ${sbbSpread(args)}>
    <sbb-icon
      aria-hidden="false"
      aria-label="Business zone in 1st class: Reservation possible"
      name="sa-bz"
    ></sbb-icon>
  </sbb-train-wagon>
`;

const label: InputType = {
  control: {
    type: 'text',
  },
};

const additionalAccessibilityText: InputType = {
  control: {
    type: 'text',
  },
};

const occupancy: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['high', 'medium', 'low', 'none'],
};

const type: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['locomotive', 'closed', 'wagon'],
};

const wagonClass: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['1', '2'],
};

const defaultArgTypes: ArgTypes = {
  occupancy,
  type,
  label,
  'wagon-class': wagonClass,
  'additional-accessibility-text': additionalAccessibilityText,
};

const defaultArgs: Args = {
  label: '36',
  type: type.options![2],
  occupancy: occupancy.options![2],
  'wagon-class': wagonClass.options![1],
  'additional-accessibility-text': undefined,
};

export const wagonLowOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};

export const wagonMediumOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    occupancy: occupancy.options![1],
  },
};

export const wagonHighOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    occupancy: occupancy.options![0],
  },
};

export const wagonNoneOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    occupancy: occupancy.options![3],
  },
};

export const wagonUndefinedOccupancy: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    occupancy: '',
  },
};

export const wagonOneIcon: StoryObj = {
  render: WagonOneIconTemplate,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};

export const wagonMultipleIcons: StoryObj = {
  render: WagonIconsTemplate,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};

export const wagonFirstClass: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'wagon-class': wagonClass.options![0],
  },
};

export const wagonUndefinedClass: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'wagon-class': undefined,
  },
};

export const locomotive: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    type: type.options![0],
  },
};

export const closed: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    type: type.options![1],
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/timetable/sbb-train-wagon',
};

export default meta;
