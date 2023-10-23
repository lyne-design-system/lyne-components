/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import isChromatic from 'chromatic/isChromatic';
import { SbbNotification } from './sbb-notification';
import './sbb-notification';
import '../sbb-button';
import '../sbb-link';

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const type: InputType = {
  control: {
    type: 'select',
  },
  options: ['info', 'success', 'warn', 'error'],
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const basicArgTypes: ArgTypes = {
  'title-content': titleContent,
  type: type,
  readonly: readonly,
  'disable-animation': disableAnimation,
};

const basicArgs: Args = {
  'title-content': 'Title',
  type: type.options[0],
  readonly: false,
  'disable-animation': isChromatic(),
};

const appendNotification = (args): void => {
  const newNotification = document.createElement('SBB-NOTIFICATION') as HTMLSbbNotificationElement;
  newNotification.style.setProperty(
    '--sbb-notification-margin',
    '0 0 var(--sbb-spacing-fixed-4x) 0',
  );
  newNotification.titleContent = args['title-content'];
  newNotification.type = args['type'];
  newNotification.readonly = args['readonly'];
  newNotification.disableAnimation = args['disable-animation'];
  newNotification.innerHTML =
    'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';
  document.querySelector('.notification-container').append(newNotification);
};

const trigger = (args): JSX.Element => (
  <sbb-button
    size="m"
    variant="secondary"
    style={{ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' }}
    onClick={() => appendNotification(args)}
    icon-name="circle-plus-small"
  >
    Add notification
  </sbb-button>
);

const notification = (args): JSX.Element => (
  <sbb-notification
    {...args}
    disable-animation
    style={{ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' }}
    ref={(notification) =>
      notification.addEventListener(
        'did-open',
        () => (notification.disableAnimation = args['disable-animation']),
        {
          once: true,
        },
      )
    }
  >
    The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.&nbsp;
    <sbb-link href="/" variant="block">
      Link one
    </sbb-link>
    &nbsp;
    <sbb-link href="/" variant="inline">
      Link two
    </sbb-link>
    &nbsp;
    <sbb-link href="/" variant="inline">
      Link three
    </sbb-link>
  </sbb-notification>
);

const pageContent = (): JSX.Element => (
  <p style={{ margin: '0' }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis{' '}
    <sbb-link href="/" variant="inline">
      link
    </sbb-link>{' '}
    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
);

const DefaultTemplate = (args): JSX.Element => (
  <Fragment>
    {trigger(args)}
    <div class="notification-container" style={{ display: 'flex', 'flex-direction': 'column' }}>
      {notification(args)}
    </div>
    {pageContent()}
  </Fragment>
);

const SlottedTitleTemplate = (args): JSX.Element => (
  <Fragment>
    {trigger(args)}
    <div class="notification-container" style={{ display: 'flex', 'flex-direction': 'column' }}>
      <sbb-notification
        {...args}
        disable-animation
        style={{ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' }}
        ref={(notification) =>
          notification.addEventListener(
            'did-open',
            () => (notification.disableAnimation = args['disable-animation']),
            {
              once: true,
            },
          )
        }
      >
        <span slot="title">Slotted title</span>
        The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
        dog.&nbsp;
        <sbb-link href="/" variant="block">
          Link one
        </sbb-link>
        &nbsp;
        <sbb-link href="/" variant="inline">
          Link two
        </sbb-link>
        &nbsp;
        <sbb-link href="/" variant="inline">
          Link three
        </sbb-link>
      </sbb-notification>
    </div>
    {pageContent()}
  </Fragment>
);

export const Info: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const Success: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, type: type.options[1] },
};

export const Warn: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, type: type.options[2] },
};

export const Error: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, type: type.options[3] },
};

export const Readonly: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, readonly: true },
};

export const NoTitle: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'title-content': undefined },
};

export const ReadonlyNoTitle: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'title-content': undefined, readonly: true },
};

export const SlottedTitle: StoryObj = {
  render: SlottedTitleTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'title-content': undefined },
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: [
        SbbNotification.events.didOpen,
        SbbNotification.events.didClose,
        SbbNotification.events.willOpen,
        SbbNotification.events.willClose,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-notification',
};

export default meta;
