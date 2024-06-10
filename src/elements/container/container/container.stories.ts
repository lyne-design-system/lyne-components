import type { InputType } from '@storybook/types';
import type { ArgTypes, Args, Meta, StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import '../../button/secondary-button.js';
import '../../title.js';
import './container.js';

import readme from './readme.md?raw';

const containerContent = (title: string, last = false): TemplateResult => html`
  <sbb-title level="4">${title}</sbb-title>
  <p class="sbb-text-s">The container component will give its content the correct spacing.</p>
  <p class="sbb-text-s">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </p>
  <sbb-secondary-button style=${last ? 'margin-block-end: 3rem;' : nothing}
    >See more</sbb-secondary-button
  >
`;

const color: InputType = {
  control: {
    type: 'select',
  },
  options: ['white', 'transparent', 'milk'],
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const backgroundExpanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  color,
  expanded,
  'background-expanded': backgroundExpanded,
};

const defaultArgs: Args = {
  color: color.options![0],
  expanded: false,
  'background-expanded': false,
};

const DefaultTemplate = (args: Args): TemplateResult => html`
  <sbb-container ${sbbSpread(args)}>
    ${containerContent('Example title')} ${containerContent('Another one')}
    ${containerContent('And another one', true)}
  </sbb-container>
`;

// Only for visual regression
const NestedContainerTemplate = (): TemplateResult => html`
  <sbb-container color="white">
    ${containerContent('Example title')}
    <div style="background-color: var(--sbb-color-milk);">
      <sbb-container color="transparent">
        ${containerContent('And another one', true)}
      </sbb-container>
    </div>
  </sbb-container>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Transparent: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1] },
};

export const Milk: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2] },
};

export const Expanded: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true },
};

export const NestedContainer: StoryObj = {
  render: NestedContainerTemplate,
  argTypes: { defaultArgTypes },
  args: { ...defaultArgs, expanded: true },
};

export const MilkBackgroundExpanded: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2], 'background-expanded': true },
};

const meta: Meta = {
  excludeStories: /^(NestedContainer)$/,
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'elements/sbb-container/sbb-container',
};

export default meta;
