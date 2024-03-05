import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../core/dom';

import readme from './readme.md?raw';
import './checkbox';
import '../../card';
import '../../button/button';

const longLabelText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim elit, ultricies in tincidunt
quis, mattis eu quam. Nulla sit amet lorem fermentum, molestie nunc ut, hendrerit risus. Vestibulum rutrum elit et
lacus sollicitudin, quis malesuada lorem vehicula. Suspendisse at augue quis tellus vulputate tempor. Vivamus urna
velit, varius nec est ac, mollis efficitur lorem. Quisque non nisl eget massa interdum tempus. Praesent vel feugiat
metus. Donec pharetra odio at turpis bibendum, vel commodo dui vulputate. Aenean congue nec nisl vel bibendum.
Praesent sit amet lorem augue. Suspendisse ornare a justo sagittis fermentum.`;

/* ************************************************* */
/* Storybook controls                                */
/* ************************************************* */

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
};

const defaultArgs: Args = {
  size: size.options[1],
  checked: false,
  indeterminate: false,
  disabled: false,
  label: 'Label',
  value: 'Value',
  name: 'name',
  'icon-name': undefined,
  'icon-placement': undefined,
  'aria-label': undefined,
};

/* ************************************************* */
/* Storybook templates                               */
/* ************************************************* */

const Template = ({ label, ...args }: Args): TemplateResult => html`
  <sbb-checkbox ${sbbSpread(args)}>${label}</sbb-checkbox>
`;

const TemplateWithForm = ({ label, ...args }: Args): TemplateResult => html`
  <form
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = (e.target as HTMLFormElement)!;
      form.querySelector('#form-data')!.innerHTML = JSON.stringify(
        Object.fromEntries(new FormData(form)),
      );
    }}
  >
    <p class="sbb-text-s">In a fieldset:</p>
    <fieldset>
      <sbb-checkbox ${sbbSpread(args)}>${label}</sbb-checkbox>
    </fieldset>

    <p class="sbb-text-s">In a disabled fieldset:</p>
    <fieldset disabled>
      <sbb-checkbox ${sbbSpread({ ...args, name: 'disabled' })}>${label}</sbb-checkbox>
    </fieldset>
    <div style="margin-block: var(--sbb-spacing-responsive-s)">
      <sbb-button type="reset" variant="secondary">Reset</sbb-button>
      <sbb-button type="submit">Submit</sbb-button>
    </div>
    <p class="sbb-text-s">Form-Data after click submit:</p>
    <sbb-card color="milk" id="form-data"></sbb-card>
  </form>
`;

export const defaultUnchecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};
export const defaultChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
  },
};
export const defaultIndeterminate: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    indeterminate: true,
  },
};
export const sizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    size: size.options[0],
  },
};
export const longLabel: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    label: longLabelText,
  },
};
export const withIconEnd: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'icon-name': 'tickets-class-small',
  },
};
export const checkedWithIconStart: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
    'icon-name': 'tickets-class-small',
    'icon-placement': iconPlacement.options[0],
  },
};
export const disabledChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    disabled: true,
    checked: true,
  },
};
export const disabledUnchecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    disabled: true,
  },
};
export const disabledIndeterminate: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    disabled: true,
    indeterminate: true,
  },
};

export const withForm: StoryObj = {
  render: TemplateWithForm,
  argTypes: defaultArgTypes,
  args: defaultArgs,
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style=${styleMap({ padding: '2rem' })}>${story()}</div> `,
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: ['change', 'input'],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-checkbox/sbb-checkbox',
};

export default meta;
