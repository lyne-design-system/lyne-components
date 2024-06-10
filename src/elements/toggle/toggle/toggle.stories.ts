import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './toggle.js';
import '../toggle-option.js';

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Toggle',
  },
};

const even: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Toggle',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's'],
  table: {
    category: 'Toggle',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Toggle',
  },
};

const label: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Toggle Option',
  },
};

const labelTwo: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Toggle Option',
  },
};

const iconName: InputType = {
  control: {
    type: 'select',
  },
  options: ['arrow-right-small', 'app-icon-small', 'train-small', 'swisspass-small'],
  table: {
    category: 'Toggle Option',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const defaultArgTypes: ArgTypes = {
  disabled,
  even,
  size,
  value,
  label,
  labelTwo,
  iconName,
  ariaLabel,
};

const defaultArgs: Args = {
  disabled: false,
  even: false,
  size: size.options![0],
  value: 'Value 1',
  label: 'Bern',
  labelTwo: 'Zürich',
  iconName: undefined,
  ariaLabel: undefined,
};

const DefaultTemplate = ({
  label,
  labelTwo,
  iconName,
  ariaLabel,
  ...args
}: Args): TemplateResult => html`
  <sbb-toggle ${sbbSpread(args)}>
    <sbb-toggle-option icon-name=${iconName} aria-label=${ariaLabel} value="Value 1">
      ${label}
    </sbb-toggle-option>
    <sbb-toggle-option icon-name=${iconName && 'arrows-right-left-small'} value="Value 2">
      ${labelTwo}
    </sbb-toggle-option>
  </sbb-toggle>
`;

const SlottedIconTemplate = ({
  label,
  labelTwo,
  iconName,
  ariaLabel,
  ...args
}: Args): TemplateResult => html`
  <sbb-toggle ${sbbSpread(args)}>
    <sbb-toggle-option value="Value 1" aria-label=${ariaLabel}>
      <sbb-icon slot="icon" name=${iconName}></sbb-icon>
      ${label}
    </sbb-toggle-option>

    <sbb-toggle-option value="Value 2">
      <sbb-icon slot="icon" name=${iconName && 'arrows-right-left-small'}></sbb-icon>
      ${labelTwo}
    </sbb-toggle-option>
  </sbb-toggle>
`;

export const SizeM: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs },
};

export const SizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, size: size.options![1] },
};

export const Disabled: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, disabled: true },
};

export const DisabledSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, disabled: true, size: size.options![1] },
};

export const Even: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, even: true },
};

export const EvenSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, even: true, size: size.options![1] },
};

export const LabelAndIcon: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, iconName: iconName.options![0] },
};

export const LabelAndIconSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, iconName: iconName.options![0], size: size.options![1] },
};

export const LabelAndIconSlotted: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: { ...defaultArgTypes },
  args: { ...defaultArgs, iconName: iconName.options![1] },
};

export const IconsOnly: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    iconName: iconName.options![0],
    label: undefined,
    labelTwo: undefined,
  },
};

export const IconsOnlySizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    iconName: iconName.options![0],
    size: size.options![1],
    label: undefined,
    labelTwo: undefined,
  },
};

export const IconsOnlySlotted: StoryObj = {
  render: SlottedIconTemplate,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    iconName: iconName.options![1],
    label: undefined,
    labelTwo: undefined,
  },
};

export const DynamicWidth: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    label: 'Zürich',
    labelTwo: 'Schwarzenbach SG, Schloss Schwarzenbach, Wilerstrasse',
    iconName: iconName.options![1],
  },
};

export const DynamicWidthSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: { ...defaultArgTypes },
  args: {
    ...defaultArgs,
    size: size.options![1],
    label: 'Zürich',
    labelTwo: 'Schwarzenbach SG, Schloss Schwarzenbach, Wilerstrasse',
    iconName: iconName.options![1],
  },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['change', 'input'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-toggle/sbb-toggle',
};

export default meta;
