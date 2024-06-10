import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './navigation-link.js';

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 'm', 's'],
};

const accessibilityLabel: InputType = {
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

const download: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Link',
  },
};

const defaultArgTypes: ArgTypes = {
  size,
  href,
  target,
  rel,
  download,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  size: size.options![0],
  href: href.options![0],
  target: '_blank',
  rel: undefined,
  download: false,
  'accessibility-label': undefined,
};

const Template = (args: Args): TemplateResult => html`
  <sbb-navigation-link ${sbbSpread(args)}>Label</sbb-navigation-link>
`;

export const SizeL: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const SizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const SizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![2] },
};

const meta: Meta = {
  parameters: {
    backgroundColor: () => 'var(--sbb-color-midnight)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-navigation/sbb-navigation-link',
};

export default meta;
