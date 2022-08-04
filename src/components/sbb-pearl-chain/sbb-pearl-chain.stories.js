import { h } from 'jsx-dom';
// import isChromatic from 'chromatic/isChromatic';
import readme from './readme.md';

const Template = (args) => {
  return <sbb-pearl-chain legs={args.legs} />;
};

export const NoStops = Template.bind({});
export const ManyStops = Template.bind({});
export const Cancelled = Template.bind({});
export const CancelledManyStops = Template.bind({});

NoStops.documentation = {
  title: 'No stops',
};

NoStops.args = {
  legs: [
    {
      duration: 300,
    },
  ],
};

ManyStops.args = {
  legs: [
    {
      duration: 300,
    },
    {
      duration: 300,
    },
    {
      duration: 300,
    },
    {
      duration: 300,
    },
  ],
};

Cancelled.args = {
  legs: [
    {
      duration: 300,
      serviceJourney: {
        serviceAlteration: {
          cancelled: false,
        },
      },
    },
  ],
};

CancelledManyStops.args = {
  legs: [
    {
      duration: 300,
      serviceJourney: {
        serviceAlteration: {
          cancelled: false,
        },
      },
    },
    {
      duration: 300,
      serviceJourney: {
        serviceAlteration: {
          cancelled: false,
        },
      },
    },
    {
      duration: 211,
      serviceJourney: {
        serviceAlteration: {
          cancelled: true,
        },
      },
    },
    {
      duration: 300,
      serviceJourney: {
        serviceAlteration: {
          cancelled: true,
        },
      },
    },
    {
      duration: 300,
      serviceJourney: {
        serviceAlteration: {
          cancelled: false,
        },
      },
    },
  ],
};

export default {
  decorators: [
    (Story) => (
      <div style={'max-width: 20rem;'}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-pearl-chain (Unfinished)',
};
