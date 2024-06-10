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

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready.js';
import { waitForStablePosition } from '../../../storybook/testing/wait-for-stable-position.js';

import readme from './readme.md?raw';

import './header.js';
import '../header-button.js';
import '../header-link.js';
import '../../divider.js';
import '../../menu.js';

const LoremIpsumTemplate = (): TemplateResult => html`
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet malesuada augue. Morbi
    eget tristique nisl, sit amet dapibus erat. Donec tempor, metus et aliquam ultrices, nulla mi
    mollis urna, a lacinia mauris risus mattis massa. Quisque cursus sollicitudin enim in malesuada.
    Maecenas nec hendrerit augue. Duis porttitor mattis molestie. Sed imperdiet velit at dui
    ultrices, viverra scelerisque nisi dapibus. Nulla urna lectus, gravida eu dapibus vel, mattis
    non turpis. Nunc interdum et justo sed faucibus. Vestibulum interdum commodo mi, sed eleifend
    odio posuere in. Nunc non dui venenatis, eleifend est ut, varius odio. Quisque augue ante,
    mollis eu lorem id, commodo cursus risus.
  </div>
  <br />
`;

const HeaderBasicTemplate = (
  { attributes, ...args }: Args,
  template: TemplateResult,
): TemplateResult => html`
  <sbb-header ${sbbSpread(args)}>
    <sbb-header-button icon-name="hamburger-menu-small" expand-from="small">
      Menu
    </sbb-header-button>
    <div class="sbb-header-spacer"></div>
    <sbb-header-link href="https://www.sbb.ch" target="_blank" icon-name="magnifying-glass-small"
      >Search</sbb-header-link
    >
    ${template}
    <sbb-header-button icon-name="globe-small" id="language-menu-trigger" class="last-element">
      English
    </sbb-header-button>
    <sbb-menu trigger="language-menu-trigger">
      <sbb-menu-button>Deutsch</sbb-menu-button>
      <sbb-menu-button>Français</sbb-menu-button>
      <sbb-menu-button>Italiano</sbb-menu-button>
      <sbb-menu-button icon-name="tick-small">English</sbb-menu-button>
    </sbb-menu>
  </sbb-header>
  <div ${sbbSpread(attributes)}>${new Array(12).fill(null).map(LoremIpsumTemplate)}</div>
`;

const Template = (args: Args): TemplateResult => html`
  ${HeaderBasicTemplate(
    args,
    html`
      <sbb-header-button icon-name="user-small" class="sbb-header-shrinkable">
        Sign in
      </sbb-header-button>
    `,
  )}
`;

const TemplateWithUserMenu = (args: Args): TemplateResult => html`
  ${HeaderBasicTemplate(
    args,
    html`
      <sbb-header-button
        icon-name="user-small"
        id="user-menu-trigger"
        data-testid="user-menu-trigger"
        class="sbb-header-shrinkable"
      >
        Christina Müller
      </sbb-header-button>
      <sbb-menu trigger="user-menu-trigger" data-testid="user-menu">
        <sbb-menu-link icon-name="user-small" href="/"> Account </sbb-menu-link>
        <sbb-menu-button icon-name="tickets-class-small">Tickets</sbb-menu-button>
        <sbb-menu-button icon-name="shopping-cart-small" amount="1">
          Shopping cart
        </sbb-menu-button>
        <sbb-divider></sbb-divider>
        <sbb-menu-button icon-name="exit-small">Sign out</sbb-menu-button>
      </sbb-menu>
    `,
  )}
`;

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('user-menu').shadowRoot!.querySelector('.sbb-menu'),
  );

  await waitForStablePosition(() => canvas.getByTestId('user-menu-trigger'));

  const button = canvas.getByTestId('user-menu-trigger');
  await userEvent.click(button);
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Header attribute',
  },
};

const hideOnScroll: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Header attribute',
  },
};

const scrollOrigin: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Header attribute',
  },
};

const argTypes: ArgTypes = {
  expanded,
  'hide-on-scroll': hideOnScroll,
  'scroll-origin': scrollOrigin,
};

const basicArgs: Args = {
  expanded: false,
  'hide-on-scroll': false,
  'scroll-origin': undefined,
  attributes: { class: 'sbb-page-spacing' },
};

export const Basic: StoryObj = {
  render: Template,
  argTypes,
  args: basicArgs,
};

export const Expanded: StoryObj = {
  render: Template,
  argTypes,
  args: {
    ...basicArgs,
    expanded: true,
    attributes: { class: 'sbb-page-spacing-expanded' },
  },
};

export const WithUserMenu: StoryObj = {
  render: TemplateWithUserMenu,
  argTypes,
  args: basicArgs,
  play: isChromatic() ? playStory : undefined,
};

export const BasicScrollHide: StoryObj = {
  render: Template,
  argTypes,
  args: { ...basicArgs, 'hide-on-scroll': true },
};

export const ExpandedScrollHide: StoryObj = {
  render: Template,
  argTypes,
  args: {
    ...basicArgs,
    expanded: true,
    'hide-on-scroll': true,
    attributes: { class: 'sbb-page-spacing-expanded' },
  },
};

export const ContainerScrollOriginScrollHide: StoryObj = {
  render: Template,
  argTypes,
  args: {
    ...basicArgs,
    'hide-on-scroll': true,
    'scroll-origin': 'container',
    attributes: {
      id: 'container',
      class: 'sbb-page-spacing',
      style: 'height: 200px; overflow: auto;',
    },
  },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: ['click'],
    },
    docs: {
      story: {
        inline: false,
        // Setting the iFrame height ensures that the story has enough space when used in the docs section.
        iframeHeight: '250px',
      },
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'elements/sbb-header/sbb-header',
};

export default meta;
