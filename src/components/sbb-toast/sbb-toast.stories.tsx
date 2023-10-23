/** @jsx h */
import './sbb-toast';
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';
import isChromatic from 'chromatic';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { within } from '@storybook/testing-library';
import { waitForComponentsReady } from '../../global/testing/wait-for-components-ready';
import { SbbToast } from './sbb-toast';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('sbb-toast').shadowRoot!.querySelector('.sbb-toast'),
  );

  const toast = canvas.getByTestId('sbb-toast') as SbbToast;
  toast.open();
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const position: InputType = {
  control: {
    type: 'select',
  },
  options: [
    'top-left',
    'top-center',
    'top-right',
    'top-start',
    'top-end',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'bottom-start',
    'bottom-end',
  ],
};

const dismissible: InputType = {
  control: {
    type: 'boolean',
  },
};

const timeout: InputType = {
  control: {
    type: 'number',
    step: 500,
  },
};

const politeness: InputType = {
  control: {
    type: 'select',
  },
  options: ['assertive', 'polite', 'off'],
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  position,
  dismissible,
  timeout,
  politeness,
  'icon-name': iconName,
  'disable-animation': disableAnimation,
};

const defaultArgs: Args = {
  position: 'bottom-center',
  dismissible: false,
  timeout: 6000,
  politeness: 'polite',
  'icon-name': 'circle-tick-small',
  'disable-animation': isChromatic(),
};

const toastTemplate = (args, action, contentLength = 's'): JSX.Element => (
  <Fragment>
    <sbb-button onClick={() => document.querySelector('sbb-toast').open()}>Show toast</sbb-button>
    <sbb-toast {...args} data-testid="sbb-toast">
      {contentLength === 's'
        ? 'Lorem ipsum dolor'
        : 'Lorem ipsum dolor sit amet, ipsum consectetur adipiscing elit.'}

      {action === 'button' && (
        <sbb-button
          slot="action"
          icon-name="clock-small"
          aria-label="Remind me later"
          sbb-toast-close
        ></sbb-button>
      )}

      {action === 'link' && (
        <sbb-link slot="action" sbb-toast-close>
          Link action
        </sbb-link>
      )}
    </sbb-toast>
  </Fragment>
);

const Template = (args): JSX.Element => toastTemplate(args, null, 's');

const LongContentTemplate = (args): JSX.Element => toastTemplate(args, 'button', 'l');

const ActionButtonTemplate = (args): JSX.Element => toastTemplate(args, 'button', 's');

const ActionLinkTemplate = (args): JSX.Element => toastTemplate(args, 'link', 's');

export const Basic: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() && playStory,
};

export const Dismissible: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, dismissible: true },
  play: isChromatic() && playStory,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() && playStory,
};

export const WithActionButton: StoryObj = {
  render: ActionButtonTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() && playStory,
};

export const WithActionLink: StoryObj = {
  render: ActionLinkTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() && playStory,
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '2rem',
          height: 'calc(100vh - 2rem)',
        }}
      >
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbToast.events.willOpen,
        SbbToast.events.didOpen,
        SbbToast.events.willClose,
        SbbToast.events.didClose,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-toast',
};

export default meta;
