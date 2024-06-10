import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Meta, StoryObj } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import { html, nothing, type TemplateResult } from 'lit';

import readme from './readme.md?raw';

import '../../action-group.js';
import '../../button/button.js';
import '../../button/secondary-button.js';
import '../../link.js';
import '../../title.js';
import '../container.js';
import './sticky-bar.js';

const containerColor: InputType = {
  name: 'color',
  control: {
    type: 'select',
  },
  table: {
    category: 'Container',
  },
  options: ['transparent', 'white', 'milk'],
};

const containerExpanded: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Container',
  },
};

const containerBackgroundExpanded: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Container',
  },
};

const color: InputType = {
  control: {
    type: 'select',
  },
  table: {
    category: 'Sticky Bar',
  },
  options: ['unset', 'white', 'milk'],
};

const defaultArgTypes: ArgTypes = {
  containerColor,
  containerExpanded,
  containerBackgroundExpanded,
  color,
};

const defaultArgs: Args = {
  containerColor: containerColor.options![0],
  containerExpanded: false,
  containerBackgroundExpanded: false,
  color: color.options![0],
};

const actionGroup = (): TemplateResult => html`
  <sbb-action-group
    align-group="stretch"
    orientation="vertical"
    horizontal-from="medium"
    style="width:100%;"
  >
    <sbb-block-link
      align-self="start"
      icon-name="chevron-small-left-small"
      href="https://www.sbb.ch/en/"
    >
      Link
    </sbb-block-link>
    <sbb-secondary-button>Cancel</sbb-secondary-button>
    <sbb-button>Confirm</sbb-button>
  </sbb-action-group>
`;

const containerContent = (title: string): TemplateResult => html`
  <sbb-title level="4">${title}</sbb-title>
  <p class="sbb-text-s">The container component will give its content the correct spacing.</p>
  <p class="sbb-text-s">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </p>
  <sbb-secondary-button style="margin-block-end: 0.75rem;">See more</sbb-secondary-button>
`;

const containerContentChromatic = (title: string): TemplateResult => html`
  <sbb-title level="4">${title}</sbb-title>
  <p class="sbb-text-s">The container component will give its content the correct spacing.</p>
  <sbb-secondary-button style="margin-block-end: 0.75rem;" size="m">See more</sbb-secondary-button>
`;

const Template = (): TemplateResult =>
  html` <sbb-sticky-bar>
    <sbb-secondary-button>Example</sbb-secondary-button>
  </sbb-sticky-bar>`;

const DefaultTemplate = ({
  color,
  containerExpanded,
  containerColor,
  containerBackgroundExpanded,
}: Args): TemplateResult => html`
  <sbb-container
    color=${containerColor}
    ?expanded=${containerExpanded}
    ?background-expanded=${containerBackgroundExpanded}
  >
    ${containerContent('Example title')} ${containerContent('Another one')}
    ${containerContent('And another one')} ${containerContent('And a last one')}

    <sbb-sticky-bar color=${color !== 'unset' ? color : nothing}> ${actionGroup()} </sbb-sticky-bar>
  </sbb-container>
`;

const ShortTemplate = ({
  color,
  containerExpanded,
  containerColor,
  containerBackgroundExpanded,
}: Args): TemplateResult => html`
  <sbb-container
    color=${containerColor}
    ?expanded=${containerExpanded}
    ?background-expanded=${containerBackgroundExpanded}
  >
    ${isChromatic()
      ? containerContentChromatic('Example title')
      : containerContent('Example title')}

    <sbb-sticky-bar color=${color !== 'unset' ? color : nothing}> ${actionGroup()} </sbb-sticky-bar>
  </sbb-container>
`;

const WithContentAfterTemplate = ({
  color,
  containerExpanded,
  containerColor,
  containerBackgroundExpanded,
}: Args): TemplateResult => html`
  <sbb-container
    color=${containerColor}
    ?expanded=${containerExpanded}
    ?background-expanded=${containerBackgroundExpanded}
    style=${isChromatic() ? 'max-height: 400px; overflow-y: scroll;' : nothing}
  >
    ${containerContent('Example title')} ${containerContent('Another one')}
    ${containerContent('And another one')} ${containerContent('And a last one')}

    <sbb-sticky-bar
      color=${color !== 'unset' ? color : nothing}
      style="--sbb-sticky-bar-bottom-overlapping-height: var(--sbb-spacing-responsive-l);"
    >
      ${actionGroup()}
    </sbb-sticky-bar>
  </sbb-container>
  <sbb-container
    color=${containerColor}
    ?expanded=${containerExpanded}
    ?background-expanded=${containerBackgroundExpanded}
    aria-hidden="true"
  >
    <div style="height: var(--sbb-spacing-responsive-l);"></div>
  </sbb-container>
  <sbb-container
    color="white"
    ?expanded=${containerExpanded}
    ?background-expanded=${containerBackgroundExpanded}
  >
    <div style="padding-block: 4rem;">
      ${containerContent('Content after first container')} ${containerContent('Another one')}
    </div>
  </sbb-container>
`;

export const Standalone: StoryObj = {
  render: Template,
};

export const ShortContent: StoryObj = {
  render: ShortTemplate,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};
export const ShortContentMilk: StoryObj = {
  render: ShortTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, containerColor: 'milk' },
};

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};

export const Expanded: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true },
};

export const White: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1] },
};

export const Milk: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2] },
};

export const WithContentAfter: StoryObj = {
  render: WithContentAfterTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, containerColor: 'milk', color: 'white' },
};

export const MilkContainer: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, containerColor: color.options![2] },
};

export const MilkContainerWhiteStickyBar: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, containerColor: color.options![2], color: color.options![1] },
};

export const MilkContainerBackgroundExpanded: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, containerColor: color.options![2], containerBackgroundExpanded: true },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'elements/sbb-container/sbb-sticky-bar',
};

export default meta;
