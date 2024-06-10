import { within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';
import { waitForComponentsReady } from '../../storybook/testing/wait-for-components-ready.js';
import { waitForStablePosition } from '../../storybook/testing/wait-for-stable-position.js';

import readme from './readme.md?raw';

import './skiplink-list.js';
import '../link/block-link.js';
import '../title.js';

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [2, 3, 4, 5, 6],
};

const hrefs: string[] = [
  'https://www.sbb.ch',
  'https://www.sbb.ch/en/help-and-contact.html',
  'https://github.com/sbb-design-systems/lyne-components',
];
const labelFirstLink: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Links',
  },
};

const hrefFirstLink: InputType = {
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
    category: 'Links',
  },
};

const labelSecondLink: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Links',
  },
};

const hrefSecondLink: InputType = {
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
    category: 'Links',
  },
};

const defaultArgTypes: ArgTypes = {
  'title-level': titleLevel,
  'title-content': titleContent,
  labelFirstLink,
  hrefFirstLink,
  labelSecondLink,
  hrefSecondLink,
};

const defaultArgs: Args = {
  'title-level': undefined,
  'title-content': undefined,
  labelFirstLink: 'To content',
  hrefFirstLink: hrefFirstLink.options![0],
  labelSecondLink: 'To help',
  hrefSecondLink: hrefSecondLink.options![1],
};

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);
  await waitForComponentsReady(() =>
    canvas.getByTestId('skiplink')?.shadowRoot?.querySelectorAll('.sbb-skiplink-list__wrapper'),
  );
  await waitForStablePosition(() => canvas.getByTestId('skiplink'));
  document.querySelector('sbb-block-link')?.focus();
};

const Template = ({
  labelFirstLink,
  hrefFirstLink,
  labelSecondLink,
  hrefSecondLink,
  ...args
}: Args): TemplateResult => html`
  <sbb-skiplink-list ${sbbSpread(args)} data-testid="skiplink">
    <sbb-block-link href=${hrefFirstLink}>${labelFirstLink}</sbb-block-link>
    <sbb-block-link href=${hrefSecondLink}>${labelSecondLink}</sbb-block-link>
  </sbb-skiplink-list>
`;

export const SkiplinkList: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const SkiplinkListWithTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'title-level': titleLevel.options![0],
    'title-content': 'Skip',
  },
  play: isChromatic() ? playStory : undefined,
};

const meta: Meta = {
  decorators: [
    (story) => html`
      ${story()}
      <sbb-title level="4">Use TAB to see the skiplink box</sbb-title>
    `,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-skiplink-list',
};

export default meta;
