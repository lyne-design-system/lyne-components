/** @jsx h */
import readme from './readme.md?raw';
import { h, JSX } from 'jsx-dom';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { SbbAlert } from './sbb-alert';
import './sbb-alert';

const Default = ({ 'content-slot-text': contentSlotText, ...args }): JSX.Element => (
  <sbb-alert {...args}>{contentSlotText}</sbb-alert>
);

const DefaultWithOtherContent = (args): JSX.Element => {
  return (
    <div>
      <Default {...args}></Default>
      <p>Other Content on the page.</p>
      {!args.readonly && (
        <p>
          Dismissal event of the alert has to be caught by the consumer and the alert has to be
          manually removed from DOM. See `sbb-alert-group` for demonstration.
        </p>
      )}
    </div>
  );
};

const CustomSlots = ({
  'title-content': titleContent,
  'content-slot-text': contentSlotText,
  ...args
}): JSX.Element => (
  <sbb-alert {...args}>
    <sbb-icon name="disruption" slot="icon"></sbb-icon>
    <span slot="title">{titleContent}</span>
    {contentSlotText}
  </sbb-alert>
);

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [1, 2, 3, 4, 5, 6],
};

const size: InputType = {
  control: {
    type: 'select',
  },
  options: ['m', 'l'],
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

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const contentSlotText: InputType = {
  control: {
    type: 'text',
  },
};

const linkContent: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const hrefs = ['https://www.sbb.ch', 'https://github.com/lyne-design-system/lyne-components'];
const href: InputType = {
  options: Object.keys(hrefs),
  mapping: hrefs,
  control: {
    type: 'select',
    labels: {
      0: 'sbb.ch',
      1: 'GitHub Lyne Components',
    },
  },
  table: {
    category: 'Link',
  },
};

const target: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const rel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const defaultArgTypes: ArgTypes = {
  'title-content': titleContent,
  'title-level': titleLevel,
  size,
  readonly,
  'disable-animation': disableAnimation,
  'icon-name': iconName,
  'content-slot-text': contentSlotText,
  'link-content': linkContent,
  href,
  target,
  rel,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  'title-content': 'Interruption between Berne and Olten',
  'title-level': 3,
  size: size.options[0],
  readonly: false,
  'disable-animation': false,
  'icon-name': 'info',
  'content-slot-text':
    "Between Berne and Olten from 03.11.2021 to 05.12.2022 each time from 22:30 to 06:00 o'clock construction work will take place. You have to expect changed travel times and changed connections.",
  'link-content': undefined,
  href: href.options[0],
  target: undefined,
  rel: undefined,
  'accessibility-label': undefined,
};

export const defaultAlert: StoryObj = {
  render: DefaultWithOtherContent,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const sizeL: StoryObj = {
  render: Default,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: 'l' },
};

export const withoutCloseButton: StoryObj = {
  render: Default,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, readonly: true },
};

export const withDisabledAnimation: StoryObj = {
  render: Default,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'disable-animation': true },
};

export const withoutLink: StoryObj = {
  render: Default,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, href: undefined },
};

export const withCustomLinkText: StoryObj = {
  render: Default,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, ['link-content']: 'Follow this link (custom text)' },
};

export const iconAndTitleAsSlot: StoryObj = {
  render: CustomSlots,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

// Remove icon name as it has no purpose in slotted variant
delete iconAndTitleAsSlot.argTypes['icon-name'];

// Remove icon name as it has no purpose in slotted variant
delete iconAndTitleAsSlot.args['icon-name'];

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
        SbbAlert.events.willPresent,
        SbbAlert.events.didPresent,
        SbbAlert.events.dismissalRequested,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-alert/sbb-alert',
};

export default meta;
