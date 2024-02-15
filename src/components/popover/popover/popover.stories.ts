import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, within } from '@storybook/testing-library';
import type { InputType } from '@storybook/types';
import type {
  Args,
  ArgTypes,
  Decorator,
  Meta,
  StoryContext,
  StoryObj,
} from '@storybook/web-components';
import isChromatic from 'chromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { waitForStablePosition } from '../../../storybook/testing/wait-for-stable-position';
import { sbbSpread } from '../../core/dom';

import { SbbPopoverElement } from './popover';
import readme from './readme.md?raw';
import '../../link';
import '../../title';
import '../popover-trigger';

async function commonPlayStory(canvasElement: HTMLElement): Promise<Element> {
  const canvas = within(canvasElement);

  await customElements.whenDefined('sbb-link');
  await customElements.whenDefined('sbb-popover');
  await customElements.whenDefined('sbb-popover-trigger');
  await customElements.whenDefined('sbb-title');

  await waitForStablePosition(() => canvas.getByTestId('popover-trigger'));

  return canvas.getByTestId('popover-trigger');
}

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const button = await commonPlayStory(canvasElement);
  await userEvent.click(button);
};

// Hover story interaction executed after the story renders
const playStoryHover = async ({ canvasElement }: StoryContext): Promise<void> => {
  const button = await commonPlayStory(canvasElement);
  await userEvent.hover(button);
};

const hoverTrigger: InputType = {
  control: {
    type: 'boolean',
  },
};

const hideCloseButton: InputType = {
  control: { type: 'boolean' },
};

const openDelay: InputType = {
  control: {
    type: 'number',
  },
};

const closeDelay: InputType = {
  control: {
    type: 'number',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  'hover-trigger': hoverTrigger,
  'hide-close-button': hideCloseButton,
  'open-delay': openDelay,
  'close-delay': closeDelay,
  'disable-animation': disableAnimation,
};

const defaultArgs: Args = {
  'hover-trigger': false,
  'hide-close-button': false,
  'open-delay': undefined,
  'close-delay': undefined,
  'disable-animation': isChromatic(),
};

const popoverTrigger = (position: Record<string, string>): TemplateResult => html`
  <sbb-popover-trigger
    data-testid="popover-trigger"
    style=${styleMap({
      'margin-inline': '2rem',
      position: 'absolute',
      cursor: 'pointer',
      ...position,
    })}
    id="popover-trigger"
  ></sbb-popover-trigger>
`;

const popover = (args: Args): TemplateResult => html`
  <sbb-popover data-testid="popover" trigger="popover-trigger" ${sbbSpread(args)}>
    <sbb-title level="2" visual-level="6" style="margin-block-start: 0"> Title. </sbb-title>
    <p style="margin: 0" class="sbb-text-s">
      Some content.
      <sbb-link
        size="s"
        variant="block"
        icon-name="chevron-small-right-small"
        icon-placement="end"
        sbb-popover-close
      >
        Learn More
      </sbb-link>
    </p>
  </sbb-popover>
`;

const simplePopover = (args: Args): TemplateResult => html`
  <sbb-popover data-testid="popover" trigger="popover-trigger" ${sbbSpread(args)}>
    <sbb-title level="2" visual-level="6" style="margin-block-start: 0">
      Simple popover without any interactive content but a list.
    </sbb-title>
    <ul aria-label="Colors">
      <li>Red</li>
      <li>Green</li>
      <li>Blue</li>
    </ul>
  </sbb-popover>
`;

const StartBelowTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': '2rem' })} ${popover(args)}
`;

const CenterBelowTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': 'calc(50% - 44px)' })} ${popover(args)}
`;

const EndBelowTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-end': '2rem' })} ${popover(args)}
`;

const StartAboveTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-block-end': '2rem' })} ${popover(args)}
`;

const CenterAboveTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': 'calc(50% - 44px)', 'inset-block-end': '2rem' })}
  ${popover(args)}
`;

const EndAboveTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-end': '2rem', 'inset-block-end': '2rem' })} ${popover(args)}
`;

const LongContentTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': '2rem' })}
  <sbb-popover data-testid="popover" trigger="popover-trigger" ${sbbSpread(args)}>
    <sbb-title level="2" visual-level="6" style="margin-block-start: 0">
      Popover with long content.
    </sbb-title>
    <p style="margin: 0;" class="sbb-text-s">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </sbb-popover>
`;

const HoverTriggerTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': '2rem' })} ${popover(args)}
`;

const WithoutCloseButtonTemplate = (args: Args): TemplateResult => html`
  ${popoverTrigger({ 'inset-inline-start': '2rem' })} ${simplePopover(args)}
`;

export const StartBelow: StoryObj = {
  render: StartBelowTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const CenterBelow: StoryObj = {
  render: CenterBelowTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const EndBelow: StoryObj = {
  render: EndBelowTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const StartAbove: StoryObj = {
  render: StartAboveTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const CenterAbove: StoryObj = {
  render: CenterAboveTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const EndAbove: StoryObj = {
  render: EndAboveTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const HoverTrigger: StoryObj = {
  render: HoverTriggerTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'hover-trigger': true,
    'open-delay': 0,
    'close-delay': 0,
  },
  play: isChromatic() ? playStoryHover : undefined,
};

export const WithoutCloseButton: StoryObj = {
  render: WithoutCloseButtonTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'hide-close-button': true,
  },
  play: isChromatic() ? playStory : undefined,
};

export const WithoutCloseButtonHover: StoryObj = {
  render: WithoutCloseButtonTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'hide-close-button': true,
    'hover-trigger': true,
  },
  play: isChromatic() ? playStoryHover : undefined,
};

const meta: Meta = {
  decorators: [
    (story) => html`
      <div style="padding: 2rem; position: relative; min-height: calc(100vh - 2rem);">
        ${story()}
      </div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbPopoverElement.events.willOpen,
        SbbPopoverElement.events.didOpen,
        SbbPopoverElement.events.didClose,
        SbbPopoverElement.events.willClose,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      story: { inline: false, iframeHeight: '250px' },
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'components/sbb-popover/sbb-popover',
};

export default meta;
