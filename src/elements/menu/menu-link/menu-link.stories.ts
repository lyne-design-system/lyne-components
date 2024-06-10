import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './menu-link.js';
import '../../icon.js';

const getBasicTemplate = (
  { text, ...args }: Args,
  id: number,
  iconSlot = false,
): TemplateResult => html`
  <sbb-menu-link ${sbbSpread(args)}>
    ${text} ${id} ${iconSlot ? html`<sbb-icon slot="icon" name="pie-small"></sbb-icon>` : nothing}
  </sbb-menu-link>
`;

const TemplateMenuAction = (args: Args): TemplateResult => html`
  ${getBasicTemplate(args, 1)} ${getBasicTemplate(args, 2)} ${getBasicTemplate(args, 3)}
`;

const TemplateMenuActionCustomIcon = (args: Args): TemplateResult => html`
  ${getBasicTemplate(args, 1, true)} ${getBasicTemplate(args, 2, false)}
  ${getBasicTemplate(args, 3, true)}
`;

const text: InputType = {
  control: {
    type: 'text',
  },
};

const amount: InputType = {
  control: {
    type: 'text',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Icon',
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

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Button',
  },
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  text,
  amount,
  'icon-name': iconName,
  href,
  target,
  rel,
  download,
  disabled,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  text: 'Details',
  amount: '99',
  'icon-name': 'tick-small',
  href: href.options![0],
  target: '_blank',
  rel: undefined,
  download: false,
  disabled: false,
  'accessibility-label': accessibilityLabel,
};

export const menuLink: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const menuLinkCustomIconNoAmount: StoryObj = {
  render: TemplateMenuActionCustomIcon,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    amount: undefined,
    'icon-name': undefined,
  },
};

export const menuLinkNoIconNoAmount: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': undefined, amount: undefined },
};

export const menuLinkStatic: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, href: undefined },
};

export const menuLinkDisabled: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const menuLinkButtonEllipsis: StoryObj = {
  render: TemplateMenuAction,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
};

const meta: Meta = {
  decorators: [
    (story) => html`<div style=${styleMap({ width: '256px' })}>${story()}</div>`,
    withActions as Decorator,
  ],
  parameters: {
    backgroundColor: () => 'var(--sbb-color-black)',
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-menu/sbb-menu-link',
};

export default meta;
