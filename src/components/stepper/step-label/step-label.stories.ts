import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import { sbbSpread } from '../../core/dom';

import readme from './readme.md?raw';
import './step-label';

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  disabled,
  'icon-name': iconName,
};

const defaultArgs: Args = {
  disabled: false,
  'icon-name': 'tick-small',
};

const Template = (args: Args): TemplateResult =>
  html`<sbb-step-label ${sbbSpread(args)}>Label</sbb-step-label>`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Selected: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'data-selected': true },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style="padding: 2rem;">${story()}</div> `,
    withActions as Decorator,
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-stepper/sbb-step-label',
};

export default meta;
