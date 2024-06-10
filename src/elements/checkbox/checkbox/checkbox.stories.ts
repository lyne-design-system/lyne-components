import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './checkbox.js';
import '../../card.js';
import '../../button/button.js';
import '../../button/secondary-button.js';

const longLabelText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim elit, ultricies in tincidunt
quis, mattis eu quam. Nulla sit amet lorem fermentum, molestie nunc ut, hendrerit risus. Vestibulum rutrum elit et
lacus sollicitudin, quis malesuada lorem vehicula. Suspendisse at augue quis tellus vulputate tempor. Vivamus urna
velit, varius nec est ac, mollis efficitur lorem. Quisque non nisl eget massa interdum tempus. Praesent vel feugiat
metus. Donec pharetra odio at turpis bibendum, vel commodo dui vulputate. Aenean congue nec nisl vel bibendum.
Praesent sit amet lorem augue. Suspendisse ornare a justo sagittis fermentum.`;

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's'],
};

const checked: InputType = {
  control: {
    type: 'boolean',
  },
};

const indeterminate: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const label: InputType = {
  control: {
    type: 'text',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
};

const name: InputType = {
  control: {
    type: 'text',
  },
};

const icon: InputType = {
  control: {
    type: 'text',
  },
};

const iconPlacement: InputType = {
  control: {
    type: 'select',
  },
  options: ['start', 'end'],
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const labelBoldClass: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  size,
  checked,
  indeterminate,
  disabled,
  label,
  value,
  name,
  'icon-name': icon,
  'icon-placement': iconPlacement,
  'aria-label': ariaLabel,
  labelBoldClass,
};

const defaultArgs: Args = {
  size: size.options![1],
  checked: false,
  indeterminate: false,
  disabled: false,
  label: 'Label',
  value: 'Value',
  name: 'name',
  'icon-name': undefined,
  'icon-placement': undefined,
  'aria-label': undefined,
  labelBoldClass: false,
};

// We use property and attribute for `checked` to provide consistency to storybook controls.
// Otherwise, after first user manipulation, the storybook control gets ignored.
// If only using property, the reset mechanism does not work as expected.

const Template = ({ label, checked, labelBoldClass, ...args }: Args): TemplateResult => html`
  <sbb-checkbox .checked=${checked} ?checked=${checked} ${sbbSpread(args)}>
    ${labelBoldClass ? html`<span class="sbb-text--bold">${label}</span>` : label}
  </sbb-checkbox>
`;

const TemplateWithForm = (args: Args): TemplateResult => html`
  <form
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = (e.target as HTMLFormElement)!;
      form.querySelector('#form-data')!.innerHTML = JSON.stringify(
        Object.fromEntries(new FormData(form)),
      );
    }}
  >
    <fieldset>
      <legend class="sbb-text-s">&nbsp;fieldset&nbsp;</legend>
      ${Template(args)}
    </fieldset>

    <fieldset disabled>
      <legend class="sbb-text-s">&nbsp;disabled fieldset&nbsp;</legend>
      ${Template({ ...args, name: 'disabled' })}
    </fieldset>
    <div style="margin-block: var(--sbb-spacing-responsive-s)">
      <sbb-secondary-button type="reset">Reset</sbb-secondary-button>
      <sbb-button type="submit">Submit</sbb-button>
    </div>
    <p class="sbb-text-s">Form-Data after click submit:</p>
    <sbb-card color="milk" id="form-data"></sbb-card>
  </form>
`;

export const defaultUnchecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};
export const defaultChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true },
};
export const defaultIndeterminate: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, indeterminate: true },
};
export const sizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![0] },
};
export const longLabel: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, label: longLabelText },
};
export const withIconEnd: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': 'tickets-class-small' },
};
export const checkedWithIconStart: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
    'icon-name': 'tickets-class-small',
    'icon-placement': iconPlacement.options![0],
  },
};
export const disabledChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true, checked: true },
};
export const disabledUnchecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};
export const disabledIndeterminate: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true, indeterminate: true },
};

export const withForm: StoryObj = {
  render: TemplateWithForm,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const defaultUncheckedBold: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, labelBoldClass: true },
};

export const defaultCheckedBold: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, checked: true, labelBoldClass: true },
};

export const defaultIndeterminateBold: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, indeterminate: true, labelBoldClass: true },
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
  title: 'elements/sbb-checkbox/sbb-checkbox',
};

export default meta;
