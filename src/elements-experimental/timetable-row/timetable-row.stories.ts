import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import { nothing, type TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import {
  defaultTrip,
  progressTrip,
  cancelledTrip,
  partiallyCancelled,
  pastTrip,
  disturbanceTrip,
  trainTrip,
  busTrip,
  quayChangeTrip,
  shipTrip,
  walkTimeTrip,
  extendedEnterTimeTrip,
  noticesTrip,
  skippedDepartureStopTrip,
  skippedArrivalStopTrip,
  skippedFirstDepartureStopTrip,
  skippedLastArrivalStopTrip,
} from './timetable-row.sample-data.js';
import './timetable-row.js';

const cardActionLabel: InputType = {
  control: {
    type: 'text',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const loadingTrip: InputType = {
  control: {
    type: 'boolean',
  },
};

const loadingPrice: InputType = {
  control: {
    type: 'boolean',
  },
};

const accessibilityExpanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const active: InputType = {
  control: {
    type: 'boolean',
  },
};

const now: InputType = {
  control: {
    type: 'date',
  },
};

const boarding: InputType = {
  control: {
    type: 'object',
  },
};

const price: InputType = {
  control: {
    type: 'object',
  },
  table: {
    disable: false,
  },
};

const defaultArgTypes: ArgTypes = {
  'card-action-label': cardActionLabel,
  'disable-animation': disableAnimation,
  'loading-trip': loadingTrip,
  'loading-price': loadingPrice,
  'accessibility-expanded': accessibilityExpanded,
  active,
  now,
  boarding,
  price,
};

const defaultArgs: Args = {
  'card-action-label': '',
  'disable-animation': isChromatic(),
  'loading-trip': false,
  'loading-price': false,
  'accessibility-expanded': false,
  active: false,
  now: new Date('2022-12-01T12:11:00').valueOf(),
  trip: defaultTrip,
  boarding: undefined,
  price: undefined,
};

const Template = ({ trip, price, boarding, now, ...args }: Args): TemplateResult =>
  html`<sbb-timetable-row
    .trip=${trip}
    .price=${price}
    .boarding=${boarding}
    now=${now ? now / 1000 : nothing}
    ${sbbSpread(args)}
  ></sbb-timetable-row>`;

export const Basic: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

export const Active: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    active: true,
  },
};

export const Price: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    price: { price: '39.90', text: 'ab CHF', isDiscount: false },
  },
};

export const Discount: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    price: { isDiscount: true },
  },
};

export const discountPrice: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    price: { price: '39.90', text: 'ab CHF', isDiscount: true },
  },
};

export const LoadingPrice: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'loading-price': true,
    price: { price: '39.90', text: 'ab CHF', isDiscount: true },
  },
};

export const AriaExpanded: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'accessibility-expanded': true,
  },
};

export const LoadingTrip: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'loading-trip': true,
  },
};

export const LoadingTripPrice: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'loading-trip': true,
    'loading-price': true,
    price: { price: '39.90', text: 'ab CHF', isDiscount: true },
  },
};

export const Position: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: progressTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const PositionDisabledAnimation: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'disable-animation': true,
    trip: progressTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const Cancelled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: cancelledTrip,
  },
};

export const PartiallyCancelled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: partiallyCancelled,
  },
};

export const Past: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: pastTrip,
    now: new Date('2023-12-01T12:11:00').valueOf(),
  },
};

export const Disturbance: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: disturbanceTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const SkippedDepartureStop: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: skippedDepartureStopTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const SkippedArrivalStop: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: skippedArrivalStopTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const SkippedLastArrivalStop: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: skippedLastArrivalStopTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const SkippedFirstDepartureStop: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: skippedFirstDepartureStopTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const QuayChanged: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: quayChangeTrip,
    now: new Date('2022-12-05T12:11:00').valueOf(),
  },
};

export const Train: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: trainTrip,
  },
};

export const Bus: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: busTrip,
  },
};

export const Ship: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: shipTrip,
  },
};

export const WalkTime: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: walkTimeTrip,
  },
};

export const ExtendedEnterTime: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: extendedEnterTimeTrip,
  },
};

export const Notices: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    trip: noticesTrip,
    boarding: { name: 'sa-rs', text: 'boarding' },
  },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'experimental/sbb-timetable-row',
};

export default meta;
