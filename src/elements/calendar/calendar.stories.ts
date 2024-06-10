import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../storybook/helpers/spread.js';
import { defaultDateAdapter } from '../core/datetime.js';

import { SbbCalendarElement } from './calendar.js';
import readme from './readme.md?raw';

const getCalendarAttr = (min: number | string, max: number | string): Record<string, string> => {
  const attr: Record<string, string> = {};
  if (min) {
    attr.min = defaultDateAdapter.toIso8601(new Date(min));
  }
  if (max) {
    attr.max = defaultDateAdapter.toIso8601(new Date(max));
  }
  return attr;
};

const Template = ({ min, max, selected, dateFilter, now, ...args }: Args): TemplateResult => html`
  <sbb-calendar
    .selected=${new Date(selected)}
    .now=${new Date(now)}
    .dateFilter=${dateFilter}
    ${sbbSpread(getCalendarAttr(min, max))}
    ${sbbSpread(args)}
  ></sbb-calendar>
`;

const TemplateDynamicWidth = ({
  min,
  max,
  selected,
  dateFilter,
  now,
  ...args
}: Args): TemplateResult => html`
  <sbb-calendar
    style=${styleMap({ width: '900px' })}
    .selected=${new Date(selected)}
    .now=${new Date(now)}
    .dateFilter=${dateFilter}
    ${sbbSpread(getCalendarAttr(min, max))}
    ${sbbSpread(args)}
  ></sbb-calendar>
`;

const wide: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Calendar',
  },
};

const selected: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Calendar',
  },
};

const min: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Date filters',
  },
};

const max: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Date filters',
  },
};

const now: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Testing',
  },
};

const filterFunctions = [
  undefined,
  (d: Date): boolean => d.getDay() !== 6 && d.getDay() !== 0,
  (d: Date): boolean => d.getDate() % 2 === 1,
  (d: Date): boolean => d.getFullYear() % 2 === 0,
  (d: Date): boolean => d.getMonth() > 6,
];
const dateFilter: InputType = {
  options: Object.keys(filterFunctions),
  mapping: filterFunctions,
  control: {
    type: 'select',
    labels: {
      0: 'No dateFilter function.',
      1: 'The dateFilter function includes only working days.',
      2: 'The dateFilter function excludes even days.',
      3: 'The dateFilter function excludes odd years.',
      4: 'The dateFilter function excludes months from January to July',
    },
  },
  table: {
    category: 'Date filters',
  },
};

const defaultArgTypes: ArgTypes = {
  wide,
  selected,
  min,
  max,
  dateFilter,
  now,
};

const today = new Date();
today.setDate(today.getDate() >= 15 ? 8 : 18);

const defaultArgs: Args = {
  wide: false,
  selected: isChromatic() ? new Date(2023, 0, 20) : today,
  now: isChromatic() ? new Date(2023, 0, 12, 0, 0, 0).valueOf() : undefined,
};

export const Calendar: StoryObj = {
  render: Template,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs },
};

export const CalendarWithMinAndMax: StoryObj = {
  render: Template,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    min: isChromatic() ? new Date(2023, 0, 9) : new Date(today.getFullYear(), today.getMonth(), 5),
    max: isChromatic()
      ? new Date(2023, 0, 29)
      : new Date(today.getFullYear(), today.getMonth(), 29),
  },
};

export const CalendarWide: StoryObj = {
  render: Template,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, wide: true },
};

export const CalendarFilterFunction: StoryObj = {
  render: Template,
  argTypes: { ...defaultArgTypes, dateFilter },
  args: {
    ...defaultArgs,
    // Workaround: On Chromatic mapping functions do not work, so we remove it.
    // TODO: Check if condition can be removed after refactoring Chromatic generation @kyubisation
    dateFilter: isChromatic() ? filterFunctions[1] : dateFilter.options![2],
  },
};

export const CalendarDynamicWidth: StoryObj = {
  render: TemplateDynamicWidth,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs },
};

export const CalendarWideDynamicWidth: StoryObj = {
  render: TemplateDynamicWidth,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, wide: true },
};

const meta: Meta = {
  excludeStories: /.*DynamicWidth$/,
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: [SbbCalendarElement.events.dateSelected],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-datepicker/sbb-calendar',
};

export default meta;
