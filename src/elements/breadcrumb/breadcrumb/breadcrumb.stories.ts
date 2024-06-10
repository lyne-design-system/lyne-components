import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';

import './breadcrumb.js';

const text: InputType = {
  control: {
    type: 'text',
  },
};

const hrefs = ['https://www.sbb.ch', 'https://github.com/sbb-design-systems/lyne-components'];
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
};

const rel: InputType = {
  control: {
    type: 'text',
  },
};

const download: InputType = {
  control: {
    type: 'boolean',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  text,
  href,
  target,
  rel,
  download,
  'icon-name': iconName,
};

const defaultArgs: Args = {
  text: 'Breadcrumb',
  href: href.options![0],
  target: '_blank',
  rel: undefined,
  download: false,
  'icon-name': undefined,
};

const Template = ({ text, ...args }: Args): TemplateResult => html`
  <sbb-breadcrumb ${sbbSpread(args)}>${text}</sbb-breadcrumb>
`;

const SlottedIconTemplate = ({
  text,
  'icon-name': iconName,
  ...args
}: Args): TemplateResult => html`
  <sbb-breadcrumb ${sbbSpread(args)}>
    ${text}
    <sbb-icon slot="icon" name=${iconName}></sbb-icon>
  </sbb-breadcrumb>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Icon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    text: undefined,
    'icon-name': 'house-small',
  },
};

export const IconAndText: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'icon-name': 'house-small',
  },
};

export const SlottedIconAndText: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'icon-name': 'globe-small',
    text: 'Custom slotted icon',
  },
};

export const LongContent: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'icon-name': 'house-small',
    text: 'This label name is so long that it needs ellipsis to fit.',
  },
  decorators: [(story) => html`<div style="max-width: 200px;">${story()}</div>`],
};

export const NoLink: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, href: undefined, target: undefined },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-breadcrumb/sbb-breadcrumb',
};

export default meta;
