import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './header-button.js';

const TemplateSingle = (args: Args): TemplateResult => html`
  <sbb-header-button ${sbbSpread(args)}>${args.text}</sbb-header-button>
`;

const TemplateMultiple = (args: Args): TemplateResult => html`
  <div style=${styleMap({ display: 'flex', gap: '2rem' })}>
    <sbb-header-button ${sbbSpread(args)}>${args.text} 1</sbb-header-button>
    <sbb-header-button ${sbbSpread(args)}>${args.text} 2</sbb-header-button>
    <sbb-header-button ${sbbSpread(args)}>${args.text} 3</sbb-header-button>
  </div>
`;

const text: InputType = {
  control: {
    type: 'text',
  },
};

const expandFrom: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const type: InputType = {
  control: {
    type: 'select',
  },
  options: ['button', 'reset', 'submit'],
  table: {
    category: 'Button',
  },
};

const name: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const form: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const ariaLabel: InputType = {
  control: { type: 'text' },
};

const basicArgTypes: ArgTypes = {
  text,
  'expand-from': expandFrom,
  'icon-name': iconName,
  type,
  name,
  value,
  form,
  'aria-label': ariaLabel,
};

const basicArgs: Args = {
  text: 'Menu',
  'expand-from': expandFrom.options![0],
  'icon-name': 'hamburger-menu-small',
  type: type.options![0],
  name: 'header-button',
  value: 'value',
  form: 'form',
  'aria-label': undefined,
};

export const sbbHeaderActionButton: StoryObj = {
  render: TemplateSingle,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const sbbHeaderActionButtonMultiple: StoryObj = {
  render: TemplateMultiple,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-header/sbb-header-button',
};

export default meta;
