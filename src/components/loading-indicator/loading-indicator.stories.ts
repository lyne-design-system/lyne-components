import { userEvent, within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import isChromatic from 'chromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../core/dom';

import type { SbbLoadingIndicatorElement } from './loading-indicator';
import readme from './readme.md?raw';
import '../button/button';
import './loading-indicator';

const textBlockStyle: Args = {
  marginBlock: '1rem',
  padding: '1rem',
  backgroundColor: 'var(--sbb-color-milk)',
  border: 'var(--sbb-border-width-1x) solid var(--sbb-color-cloud)',
  borderRadius: 'var(--sbb-border-radius-4x)',
};

const negativeBlockStyle: Args = {
  backgroundColor: 'var(--sbb-color-iron)',
  color: 'var(--sbb-color-white)',
  padding: '2rem',
};

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
    p.textContent = "Loading complete. Here's your data: . . . ";
    container.append(p);
    loader.remove();
  }, 5000);
};

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  await userEvent.click(within(canvasElement).getByTestId('trigger'));
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const TemplateAccessibility = (args: Args): TemplateResult => html`
  <div style=${styleMap(textBlockStyle)}>
    Turn on your screen-reader and click the button to make the loading indicator appear.
  </div>
  <sbb-button data-testid="trigger" @click=${(event: Event) => createLoadingIndicator(event, args)}>
    Show loader
  </sbb-button>
  <div class="loader-container" aria-live="polite"></div>
`;

const Template = (args: Args): TemplateResult => html`
  <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator>
`;

const NegativeTemplate = (args: Args): TemplateResult => html`
  <div style=${styleMap(negativeBlockStyle)}>
    <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator>
  </div>
`;

const InlineTemplate = (args: Args): TemplateResult => html`
  <div>
    <p>
      <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Inline loading indicator
    </p>
    <h2>
      <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Adaptive to font size
    </h2>
  </div>
`;

const NegativeInlineTemplate = (args: Args): TemplateResult => html`
  <div style=${styleMap(negativeBlockStyle)}>
    <p>
      <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Inline loading indicator
    </p>
    <h2>
      <sbb-loading-indicator ${sbbSpread(args)}></sbb-loading-indicator> Adaptive to font size
    </h2>
  </div>
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
  options: ['small', 'large'],
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
  variant: variant.options[0],
  size: size.options[0],
  color: color.options[0],
};

export const WindowSmallDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const WindowSmallSmoke: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[1] },
};

export const WindowSmallWhite: StoryObj = {
  render: NegativeTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[2] },
};

export const WindowLargeDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options[1] },
};

export const WindowLargeSmoke: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[1], size: size.options[1] },
};

export const WindowLargeWhite: StoryObj = {
  render: NegativeTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[2], size: size.options[1] },
};

export const CircleDefault: StoryObj = {
  render: InlineTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options[1] },
};

export const CircleSmoke: StoryObj = {
  render: InlineTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[1], variant: variant.options[1] },
};

export const CircleWhite: StoryObj = {
  render: NegativeInlineTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[2], variant: variant.options[1] },
};

export const Accessibility: StoryObj = {
  render: TemplateAccessibility,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options[1] },
  play: isChromatic() ? playStory : undefined,
};

const meta: Meta = {
  decorators: [(story) => html` <div style=${styleMap({ padding: '2rem' })}>${story()}</div> `],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-loading-indicator',
};

export default meta;
