import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import type { SbbFormErrorElement } from '../../form-error.js';

import readme from './readme.md?raw';
import './radio-button-group.js';
import '../radio-button.js';
import '../../form-error.js';

const value: InputType = {
  control: {
    type: 'text',
  },
};

const required: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const allowEmptySelection: InputType = {
  control: {
    type: 'boolean',
  },
};

const orientation: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['horizontal', 'vertical'],
};

const horizontalFrom: InputType = {
  control: {
    type: 'select',
  },
  options: ['unset', 'zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's'],
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  value,
  required,
  disabled,
  'allow-empty-selection': allowEmptySelection,
  orientation,
  'horizontal-from': horizontalFrom,
  size,
  'aria-label': ariaLabel,
};

const defaultArgs: Args = {
  value: 'Value two',
  required: false,
  disabled: false,
  'allow-empty-selection': false,
  orientation: orientation.options![0],
  'horizontal-from': undefined,
  size: size.options![0],
  'aria-label': undefined,
};

const radioButtons = (): TemplateResult => html`
  <sbb-radio-button value="Value one">Value one</sbb-radio-button>
  <sbb-radio-button value="Value two">Value two</sbb-radio-button>
  <sbb-radio-button value="Value three" disabled> Value three </sbb-radio-button>
  <sbb-radio-button value="Value four">Value four</sbb-radio-button>
`;

const DefaultTemplate = (args: Args): TemplateResult => html`
  <sbb-radio-button-group ${sbbSpread(args)}>${radioButtons()}</sbb-radio-button-group>
`;

const ErrorMessageTemplate = (args: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'This is a required field.';

  return html`
    <sbb-radio-button-group
      ${sbbSpread(args)}
      @change=${(event: CustomEvent) => {
        if (event.detail.value) {
          sbbFormError.remove();
        } else if (args.required) {
          (event.target as HTMLElement).closest('sbb-radio-button-group')?.append(sbbFormError);
        }
      }}
    >
      ${radioButtons()} ${args.required && sbbFormError}
    </sbb-radio-button-group>
  `;
};

export const Horizontal: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Vertical: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, orientation: orientation.options![1] },
};

export const VerticalToHorizontal: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    orientation: orientation.options![1],
    'horizontal-from': horizontalFrom.options![4],
  },
};

export const HorizontalSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const VerticalSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, orientation: orientation.options![1], size: size.options![1] },
};

export const Disabled: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const AllowEmptySelection: StoryObj = {
  render: DefaultTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, value: undefined, 'allow-empty-selection': true },
};

export const ErrorMessage: StoryObj = {
  render: ErrorMessageTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    value: undefined,
    required: true,
    'allow-empty-selection': true,
  },
};

export const ErrorMessageVertical: StoryObj = {
  render: ErrorMessageTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    value: undefined,
    required: true,
    orientation: orientation.options![1],
    'allow-empty-selection': true,
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
  title: 'elements/sbb-radio-button/sbb-radio-button-group',
};

export default meta;
