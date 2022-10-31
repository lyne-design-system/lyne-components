import { h } from 'jsx-dom';
import readme from './readme.md';
import {
  config,
  configPosition,
  configMinimal,
  configCancelled,
  configCancelledStops,
  configPast,
} from './sbb-timetable-row.sample-data';
import events from './sbb-timetable-row.events';
import isChromatic from 'chromatic/isChromatic';

const accessibilityLabel = {
  control: {
    type: 'text',
  },
};

const disableAnimation = {
  control: {
    type: 'boolean',
  },
};

const loadingTrip = {
  control: {
    type: 'boolean',
  },
};

const loadingPrice = {
  control: {
    type: 'boolean',
  },
};

const active = {
  control: {
    type: 'boolean',
  },
};

const now = {
  control: {
    type: 'date',
  },
};

const defaultArgTypes = {
  'accessibility-label': accessibilityLabel,
  'disable-animation': disableAnimation,
  'loading-trip': loadingTrip,
  'loading-price': loadingPrice,
  active,
  'data-now': now,
};

const defaultArgs = {
  'accessibility-label': 'Aria Label',
  'loading-price': config.loadingPrice,
  'loading-trip': config.loadingTrip,
  trip: config.trip,
  price: config.price,
  'data-now': undefined,
};

// TEMPLATES
const Template = (args) => (
  <sbb-timetable-row {...args} disable-animation={isChromatic()}></sbb-timetable-row>
);

/* ************************************************* */
/* The Stories                                       */
/* ************************************************* */
export const SbbTimetableRow = Template.bind({});
SbbTimetableRow.argTypes = defaultArgTypes;
SbbTimetableRow.args = defaultArgs;

export const SbbTimetableRowActive = Template.bind({});
SbbTimetableRowActive.argTypes = defaultArgTypes;
SbbTimetableRowActive.args = {
  ...defaultArgs,
  active: true,
};

export const SbbTimetableRowPriceLoading = Template.bind({});
SbbTimetableRowPriceLoading.argTypes = defaultArgTypes;
SbbTimetableRowPriceLoading.args = {
  ...defaultArgs,
  'loading-price': true,
  'loading-trip': config.loadingTrip,
  price: config.price,
};

export const SbbTimetableRowPosition = Template.bind({});
SbbTimetableRowPosition.argTypes = defaultArgTypes;
SbbTimetableRowPosition.args = {
  'disable-animation': false,
  trip: configPosition.trip,
  'data-now': new Date('2024-06-21T02:29').valueOf(),
};

export const SbbTimetableRowPositionDisabledAnimation = Template.bind({});
SbbTimetableRowPositionDisabledAnimation.argTypes = defaultArgTypes;
SbbTimetableRowPositionDisabledAnimation.args = {
  'disable-animation': true,
  trip: configPosition.trip,
  'data-now': new Date('2023-12-31T10:00').valueOf(),
};

export const SbbTimetableRowMinimal = Template.bind({});
SbbTimetableRowMinimal.argTypes = defaultArgTypes;
SbbTimetableRowMinimal.args = {
  trip: configMinimal.trip,
  'data-now': new Date('2022-06-30T10:00').valueOf(),
};

export const SbbTimetableRowCancelled = Template.bind({});
SbbTimetableRowCancelled.argTypes = defaultArgTypes;
SbbTimetableRowCancelled.args = {
  trip: configCancelled.trip,
};

export const SbbTimetableRowCancelledStops = Template.bind({});
SbbTimetableRowCancelledStops.argTypes = defaultArgTypes;
SbbTimetableRowCancelledStops.args = {
  trip: configCancelledStops.trip,
};

export const SbbTimetableRowPast = Template.bind({});
SbbTimetableRowPast.argTypes = defaultArgTypes;
SbbTimetableRowPast.args = {
  trip: configPast.trip,
  'data-now': new Date('2022-10-30T17:00:00').valueOf(),
};

export const SbbTimetableRowLoading = Template.bind({});
SbbTimetableRowLoading.argTypes = defaultArgTypes;
SbbTimetableRowLoading.args = {
  'loading-trip': true,
  trip: config.trip,
  price: config.price,
};

SbbTimetableRow.documentation = {
  title: 'SBB Timetable Row',
};

export default {
  decorators: [
    (Story) => (
      <div style="background: #f6f6f6; padding: 2rem;">
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: {
      handles: [events.sbbClick],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/timetable/sbb-timetable-row',
};
