import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type {
  Meta,
  StoryObj,
  ArgTypes,
  Args,
  Decorator,
  StoryContext,
} from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready.js';
import { waitForStablePosition } from '../../../storybook/testing/wait-for-stable-position.js';

import { SbbMenuElement } from './menu.js';
import readme from './readme.md?raw';

import '../../button/button.js';
import '../../divider.js';
import '../../link.js';
import '../menu-button.js';
import '../menu-link.js';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('menu').shadowRoot!.querySelector('.sbb-menu'),
  );

  await waitForStablePosition(() => canvas.getByTestId('menu-trigger'));

  const button = canvas.getByTestId('menu-trigger');
  await userEvent.click(button);
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Menu action',
  },
};

const amount: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Menu action',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Menu action',
  },
};

const defaultArgTypes: ArgTypes = {
  'icon-name': iconName,
  amount,
  disabled,
};

const defaultArgs: Args = {
  'icon-name': 'link-small',
  amount: '123',
  disabled: false,
};

const userNameStyle: Args = {
  fontWeight: 'bold',
  fontSize: 'var(--sbb-font-size-text-xs)',
  marginTop: 'var(--sbb-spacing-fixed-1x)',
};

const userInfoStyle: Args = {
  color: 'var(--sbb-color-graphite)',
  fontSize: 'var(--sbb-font-size-text-xxs)',
};

const triggerButton = (id: string): TemplateResult => html`
  <sbb-button data-testid="menu-trigger" id=${id} size="m"> Menu trigger </sbb-button>
`;

const DefaultTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('menu-trigger-1')}
  <sbb-menu trigger="menu-trigger-1" data-testid="menu">
    <sbb-menu-link icon-name=${args['icon-name']} href="https://www.sbb.ch/en">
      View
    </sbb-menu-link>
    <sbb-menu-button icon-name="pen-small" amount="16" ?disabled=${args.disabled}>
      Edit
    </sbb-menu-button>
    <sbb-menu-button icon-name="swisspass-small" amount=${args.amount}> Details </sbb-menu-button>
    <sbb-divider></sbb-divider>
    <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
  </sbb-menu>
`;

const ListTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('menu-trigger-1')}
  <sbb-menu trigger="menu-trigger-1" data-testid="menu">
    <sbb-menu-link icon-name=${args['icon-name']} href="https://www.sbb.ch/en">
      View
    </sbb-menu-link>
    <sbb-menu-button icon-name="pen-small" amount="16" ?disabled=${args.disabled}>
      Edit
    </sbb-menu-button>
    <sbb-menu-button icon-name="swisspass-small" amount=${args.amount}> Details </sbb-menu-button>
    <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
  </sbb-menu>
`;

const CustomContentTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('menu-trigger-2')}
  <sbb-menu trigger="menu-trigger-2" data-testid="menu">
    <div style=${styleMap(userNameStyle)}>Christina Müller</div>
    <span style=${styleMap(userInfoStyle)}>UIS9057</span>
    <sbb-block-link href="https://www.sbb.ch/en" negative size="xs"> Profile </sbb-block-link>
    <sbb-divider></sbb-divider>
    <sbb-menu-link icon-name=${args['icon-name']} href="https://www.sbb.ch/en">
      View
    </sbb-menu-link>
    <sbb-menu-button icon-name="tickets-class-small" ?disabled=${args.disabled}>
      Tickets
    </sbb-menu-button>
    <sbb-menu-button icon-name="shopping-cart-small" amount=${args.amount}> Cart </sbb-menu-button>
    <sbb-divider></sbb-divider>
    <sbb-menu-button icon-name="exit-small">Log Out</sbb-menu-button>
  </sbb-menu>
`;

const LongContentTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('menu-trigger-3')}
  <sbb-menu trigger="menu-trigger-3" data-testid="menu">
    <sbb-menu-button
      icon-name=${args['icon-name']}
      ?disabled=${args.disabled}
      amount=${args.amount}
    >
      English
    </sbb-menu-button>
    <sbb-menu-button>Deutsch</sbb-menu-button>
    <sbb-menu-button>Français</sbb-menu-button>
    <sbb-menu-button>Italiano</sbb-menu-button>
    <sbb-menu-button>Rumantsch</sbb-menu-button>
    <sbb-menu-button>Español</sbb-menu-button>
    <sbb-menu-button>Português</sbb-menu-button>
    <sbb-menu-button>日本語</sbb-menu-button>
    <sbb-menu-button>한국어</sbb-menu-button>
    <sbb-menu-button>广州话</sbb-menu-button>
    <sbb-menu-button>Afrikaans</sbb-menu-button>
    <sbb-menu-button>Svenska</sbb-menu-button>
    <sbb-menu-button>Dansk</sbb-menu-button>
    <sbb-menu-button>Nederlands</sbb-menu-button>
    <sbb-menu-button>Suomi</sbb-menu-button>
    <sbb-menu-button>українська мова</sbb-menu-button>
    <sbb-menu-button>አማርኛ</sbb-menu-button>
    <sbb-menu-button>ქართული ენა</sbb-menu-button>
    <sbb-menu-button>Afrikaans</sbb-menu-button>
    <sbb-menu-button>Svenska</sbb-menu-button>
    <sbb-menu-button>Dansk</sbb-menu-button>
    <sbb-menu-button>Nederlands</sbb-menu-button>
    <sbb-menu-button>Suomi</sbb-menu-button>
    <sbb-divider></sbb-divider>
    <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
  </sbb-menu>
`;

const EllipsisTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('menu-trigger-4')}
  <sbb-menu trigger="menu-trigger-4" data-testid="menu">
    <div style=${styleMap(userNameStyle)}>Christina Müller</div>
    <span style=${styleMap(userInfoStyle)}>UIS9057</span>
    <sbb-block-link href="https://www.sbb.ch/en" negative size="xs"> Profile </sbb-block-link>
    <sbb-divider></sbb-divider>
    <sbb-menu-link icon-name=${args['icon-name']} href="https://www.sbb.ch/en">
      View
    </sbb-menu-link>
    <sbb-menu-button icon-name="pen-small" ?disabled=${args.disabled}> Edit </sbb-menu-button>
    <sbb-menu-button icon-name="swisspass-small" amount=${args.amount}>
      Very long label that exceeds the maximum width of the menu, very long label that exceeds the
      maximum width of the menu, very long label that exceeds the maximum width of the menu
    </sbb-menu-button>
    <sbb-divider></sbb-divider>
    <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
  </sbb-menu>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
  play: isChromatic() ? playStory : undefined,
};

export const List: StoryObj = {
  render: ListTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
  play: isChromatic() ? playStory : undefined,
};

export const CustomContent: StoryObj = {
  render: CustomContentTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, amount: '2' },
  play: isChromatic() ? playStory : undefined,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': 'tick-small', amount: undefined },
  play: isChromatic() ? playStory : undefined,
};

export const Ellipsis: StoryObj = {
  render: EllipsisTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbMenuElement.events.willOpen,
        SbbMenuElement.events.didOpen,
        SbbMenuElement.events.didClose,
        SbbMenuElement.events.willClose,
      ],
    },
    docs: {
      // Setting the iFrame height ensures that the story has enough space when used in the docs section.
      story: { inline: false, iframeHeight: '400px' },
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-menu/sbb-menu',
};

export default meta;
