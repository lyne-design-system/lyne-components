import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './step-label.js';

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
  html`<sbb-step-label slot="step-label" ${sbbSpread(args)}>Label</sbb-step-label>`;

const LongLabelTemplate = (args: Args): TemplateResult =>
  html`<sbb-step-label slot="step-label" ${sbbSpread(args)}
    >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua.</sbb-step-label
  >`;

const SlottedIconTemplate = (args: Args): TemplateResult =>
  html`<sbb-step-label slot="step-label" ${sbbSpread(args)}>
    <sbb-icon slot="icon" name="pen-small"></sbb-icon>
    Label
  </sbb-step-label>`;

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

export const LongLabelVertical: StoryObj = {
  render: LongLabelTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'data-selected': true },
};

export const LongLabelHorizontal: StoryObj = {
  render: LongLabelTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'data-selected': true, 'data-orientation': 'horizontal' },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const SlottedIcon: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': undefined },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-stepper/sbb-step-label',
};

export default meta;
