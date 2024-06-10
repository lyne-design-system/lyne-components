import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import '../link/block-link.js';
import './link-list.js';

const LinkTemplate = (args: Args): TemplateResult => html`
  <sbb-block-link
    href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
  >
    ${args.linkTitle}
  </sbb-block-link>
`;

const links = ['Refunds', 'Lost property office', 'Complaints', 'Praise', 'Report property damage'];

// SlottedTitle
const TemplateSlottedTitle = ({
  'title-content': titleContent,
  ...args
}: Args): TemplateResult => html`
  <sbb-link-list ${sbbSpread(args)}>
    <span slot="title">${titleContent}</span>
    ${links.map((linkTitle) => html` ${LinkTemplate({ linkTitle })} `)}
  </sbb-link-list>
`;

// TitleAsProperty
const Template = (args: Args): TemplateResult => html`
  <sbb-link-list ${sbbSpread(args)}>
    ${links.map((linkTitle) => html` ${LinkTemplate({ linkTitle })} `)}
  </sbb-link-list>
`;

const orientation: InputType = {
  control: {
    type: 'select',
  },
  options: ['vertical', 'horizontal'],
};

const horizontalFrom: InputType = {
  control: {
    type: 'select',
  },
  options: ['zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
  options: [true, false],
};

const size: InputType = {
  control: {
    type: 'select',
  },
  options: ['xs', 's', 'm'],
};

const titleContent: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'List Title',
  },
};

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [2, 3, 4, 5, 6],
  table: {
    category: 'List Title',
  },
};

const defaultArgTypes: ArgTypes = {
  orientation,
  'horizontal-from': horizontalFrom,
  size,
  negative,
  'title-level': titleLevel,
  'title-content': titleContent,
};

const defaultArgs: Args = {
  orientation: orientation.options![0],
  'horizontal-from': undefined,
  size: size.options![1],
  negative: false,
  'title-level': titleLevel.options![0],
  'title-content': 'Help & Contact',
};

export const LinkListDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

export const LinkListXS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    size: size.options![0],
  },
};

export const LinkListNoTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'title-content': undefined,
  },
};

export const LinkListNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    negative: true,
  },
};

export const LinkListHorizontalFrom: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'horizontal-from': 'medium',
  },
};

export const LinkListWithSlottedTitle: StoryObj = {
  render: TemplateSlottedTitle,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

const meta: Meta = {
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-charcoal)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-link-list',
};

export default meta;
