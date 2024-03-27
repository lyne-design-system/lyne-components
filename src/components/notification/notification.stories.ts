import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import type { SbbSecondaryButtonElement } from '../button';
import { sbbSpread } from '../core/dom';

import { SbbNotificationElement } from './notification';
import readme from './readme.md?raw';
import '../button/secondary-button';
import '../link/link';

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

const basicArgTypes: ArgTypes = {
  'title-content': titleContent,
  type: type,
  readonly: readonly,
};

const basicArgs: Args = {
  'title-content': 'Title',
  type: type.options[0],
  readonly: false,
};

const appendNotification = (event: Event, args: Args): void => {
  const newNotification = document.createElement('sbb-notification');
  newNotification.style.setProperty(
    '--sbb-notification-margin',
    '0 0 var(--sbb-spacing-fixed-4x) 0',
  );
  newNotification.setAttribute('class', 'sbb-animate');
  newNotification.titleContent = args['title-content'];
  newNotification.type = args['type'];
  newNotification.readonly = args['readonly'];
  newNotification.innerHTML =
    'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';
  (event.target as SbbSecondaryButtonElement).parentElement
    ?.querySelector('.notification-container')
    ?.append(newNotification);
};

const trigger = (args: Args): TemplateResult => html`
  <sbb-secondary-button
    size="m"
    style="max-width: fit-content"
    @click=${(event: Event) => appendNotification(event, args)}
    icon-name="circle-plus-small"
  >
    Add notification
  </sbb-secondary-button>
`;

const simpleNotification = (type: string, title: string): TemplateResult => html`
  <sbb-notification
    type="${type}"
    title-content="${title}"
    style="--sbb-notification-margin: 0 0 var(--sbb-spacing-fixed-4x) 0;"
  >
    This is a ${type} notification.
  </sbb-notification>
`;

const pageContent = (): TemplateResult => html`
  <p style="margin: 0;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis
    <sbb-link href="/"> link </sbb-link>
    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
`;

const DefaultTemplate = (args: Args): TemplateResult => html`
  <sbb-notification
    ${sbbSpread(args)}
    style="--sbb-notification-margin: 0 0 var(--sbb-spacing-fixed-4x) 0;"
  >
    The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
    dog.&nbsp;<sbb-link href="/"> Link one</sbb-link>
    <sbb-link href="/"> Link two</sbb-link>
    <sbb-link href="/"> Link three</sbb-link>
  </sbb-notification>
`;

const MultipleNotificationsTemplate = (args: Args): TemplateResult => html`
  <sbb-notification
    ${sbbSpread(args)}
    style="--sbb-notification-margin: 0 0 var(--sbb-spacing-fixed-4x) 0;"
  >
    The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
    dog.&nbsp;<sbb-link href="/"> Link one</sbb-link>
    <sbb-link href="/"> Link two</sbb-link>
    <sbb-link href="/"> Link three</sbb-link>
  </sbb-notification>

  ${simpleNotification('success', 'Success')} ${simpleNotification('warn', 'Warn')}
  ${simpleNotification('error', 'Error')}
`;

const SlottedTitleTemplate = (args: Args): TemplateResult => html`
  <sbb-notification
    ${sbbSpread(args)}
    style="--sbb-notification-margin: 0 0 var(--sbb-spacing-fixed-4x) 0;"
  >
    <span slot="title">Slotted title</span>
    The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.&nbsp;
    <sbb-link href="/"> Link one </sbb-link>
    <sbb-link href="/"> Link two </sbb-link>
    <sbb-link href="/"> Link three </sbb-link>
  </sbb-notification>
`;

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

export const MultipleNotifications: StoryObj = {
  render: MultipleNotificationsTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

// We set the height of the div in Chromatic to avoid cropped snapshots
const meta: Meta = {
  decorators: [
    (story, context) =>
      html`<div
        style="padding: 2rem;display: flex;gap: var(--sbb-spacing-fixed-4x);flex-direction: column;"
      >
        ${trigger(context.args)}
        <div
          class="notification-container"
          style="display: flex; flex-direction: column;"
          aria-live="polite"
        >
          ${story()}
        </div>
        ${pageContent()}
      </div>`,
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { fixedHeight: '7500px' },
    actions: {
      handles: [
        SbbNotificationElement.events.didOpen,
        SbbNotificationElement.events.didClose,
        SbbNotificationElement.events.willOpen,
        SbbNotificationElement.events.willClose,
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
