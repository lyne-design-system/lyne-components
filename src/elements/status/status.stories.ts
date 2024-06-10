import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';

import './status.js';

const type: InputType = {
  control: {
    type: 'select',
  },
  options: ['info', 'success', 'warning', 'error'],
};

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const text: InputType = {
  control: {
    type: 'text',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  type,
  'title-content': titleContent,
  text,
  'icon-name': iconName,
};

const defaultArgs: Args = {
  type: 'info',
  'title-content': undefined,
  text: 'Status info text',
  'icon-name': undefined,
};

const Template = ({ text, ...args }: Args): TemplateResult => html`
  <sbb-status ${sbbSpread(args)}>${text}</sbb-status>
`;

const TemplateIconSlot = ({ text, 'icon-name': iconName, ...args }: Args): TemplateResult => html`
  <sbb-status ${sbbSpread(args)}>
    ${text}<sbb-icon name=${iconName} slot="icon"></sbb-icon>
  </sbb-status>
`;

export const info: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const success: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'success' },
};

export const warning: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'warning' },
};

export const error: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'error' },
};

export const infoWithTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'title-content': 'Title' },
};

export const successWithTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'success', 'title-content': 'Success!' },
};

export const warningWithTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'warning', 'title-content': 'Warning!' },
};

export const errorWithTitle: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'error', 'title-content': 'Error!' },
};

export const successWithCustomIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    type: 'success',
    'icon-name': 'pen-small',
    'title-content': 'In progress',
  },
};

export const successWithCustomIconSlotted: StoryObj = {
  render: TemplateIconSlot,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, type: 'success', 'icon-name': 'globe-small' },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-status',
};

export default meta;
