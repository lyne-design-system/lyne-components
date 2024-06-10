import type { InputType, StoryContext } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import type { SbbLoadingIndicatorElement } from './loading-indicator.js';
import readme from './readme.md?raw';

import './loading-indicator.js';
import '../button/button.js';
import '../title.js';
import '../card.js';

const createLoadingIndicator = (event: Event, args: Args): void => {
  const loader: SbbLoadingIndicatorElement = document.createElement('sbb-loading-indicator');
  const container = (event.currentTarget as HTMLElement).parentElement!.querySelector(
    '.loader-container',
  )!;
  loader.setAttribute('aria-label', 'Loading, please wait');
  loader.size = args['size'];
  loader.variant = args['variant'];
  container.append(loader);
  setTimeout(() => {
    const p = document.createElement('p');
    p.textContent = "Loading complete. Here's your data: ...";
    container.append(p);
    loader.remove();
  }, 5000);
};

const TemplateAccessibility = (args: Args): TemplateResult => html`
  <sbb-card color="milk">
    Turn on your screen-reader and click the button to make the loading indicator appear.
  </sbb-card>
  <br />
  <sbb-button data-testid="trigger" @click=${(event: Event) => createLoadingIndicator(event, args)}>
    Show loader
  </sbb-button>
  <div class="loader-container" aria-live="polite"></div>
`;

const Template = (args: Args): TemplateResult => html`
  <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator>
`;

const CircleTemplate = (args: Args): TemplateResult => html`
  <p><sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Inline loading indicator</p>
  <sbb-title level="4">
    <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Adaptive to font size
  </sbb-title>
`;

const variant: InputType = {
  control: {
    type: 'select',
  },
  options: ['window', 'circle'],
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['s', 'l'],
};

const color: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['default', 'smoke', 'white'],
};

const defaultArgTypes: ArgTypes = {
  variant,
  size,
  color,
};

const defaultArgs: Args = {
  variant: variant.options![0],
  size: size.options![0],
  color: color.options![0],
};

export const WindowSmallDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const WindowSmallSmoke: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1] },
};

export const WindowSmallWhite: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2] },
};

export const WindowLargeDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const WindowLargeSmoke: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1], size: size.options![1] },
};

export const WindowLargeWhite: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2], size: size.options![1] },
};

export const CircleDefault: StoryObj = {
  render: CircleTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options![1] },
};

export const CircleSmoke: StoryObj = {
  render: CircleTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1], variant: variant.options![1] },
};

export const CircleWhite: StoryObj = {
  render: CircleTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![2], variant: variant.options![1] },
  decorators: [
    (story) =>
      html`<div
        style="color: var(--sbb-color-white); --sbb-title-text-color-normal-override: var(--sbb-color-white)"
      >
        ${story()}
      </div>`,
  ],
};

export const Accessibility: StoryObj = {
  render: TemplateAccessibility,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

const meta: Meta = {
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.color === 'white' ? 'var(--sbb-color-iron)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-loading-indicator',
};

export default meta;
