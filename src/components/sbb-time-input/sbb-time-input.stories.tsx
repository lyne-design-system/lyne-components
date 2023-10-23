/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { StoryContext } from '@storybook/web-components';
import { SbbTimeInput } from './sbb-time-input';
import './sbb-time-input';
import '../sbb-form-field';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative
    ? 'var(--sbb-color-black-default)'
    : 'var(--sbb-color-white-default)',
});

const formError = document.createElement('sbb-form-error');
formError.innerText = 'Time value is invalid';

const updateFormError = (valid: boolean): void => {
  if (!valid && !formError.isConnected) {
    document.getElementsByTagName('sbb-form-field')[0].append(formError);
  } else if (valid) {
    formError.remove();
  }
};

const changeEventHandler = async (event): Promise<void> => {
  const div = document.createElement('div');
  div.innerText = `value is: ${
    (document.getElementById('input-id') as HTMLInputElement).value
  }; valueAsDate is: ${await event.target.getValueAsDate()}.`;
  document.getElementById('container-value').append(div);
};

const setValueAsDate = async (): Promise<void> => {
  const timeInput = document.getElementsByTagName('sbb-time-input')[0];
  await timeInput.setValueAsDate(new Date());

  const input = document.getElementById('input-id');
  input.dispatchEvent(new Event('change')); // Trigger change to update invalid state
};

const setValue = (): void => {
  const input = document.getElementById('input-id') as HTMLInputElement;
  input.value = '00:00';
  input.dispatchEvent(new Event('change')); // Trigger change to update invalid state
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Native input attribute',
  },
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Native input attribute',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Native input attribute',
  },
};

const required: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Native input attribute',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 'l'],
  table: {
    category: 'Form-field attribute',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const label: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const optional: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const iconStart: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const iconEnd: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const basicArgTypes: ArgTypes = {
  value,
  disabled,
  readonly,
  required,
  negative,
};

const formFieldBasicArgsTypes: ArgTypes = {
  ...basicArgTypes,
  label,
  size,
  optional,
  borderless,
  iconStart,
  iconEnd,
};

const basicArgs: Args = {
  value: '12:00',
  disabled: false,
  readonly: false,
  required: false,
  negative: false,
};

const formFieldBasicArgs = {
  ...basicArgs,
  label: 'Label',
  size: size.options[0],
  optional: false,
  borderless: false,
  iconStart: undefined,
  iconEnd: undefined,
};

const formFieldBasicArgsWithIcons = {
  ...basicArgs,
  label: 'Label',
  size: size.options[0],
  optional: false,
  borderless: false,
  iconStart: 'clock-small',
  iconEnd: 'circle-information-small',
};

const TemplateSbbTimeInput = ({
  label,
  optional,
  borderless,
  negative,
  iconStart,
  iconEnd,
  size,
  ...args
}): JSX.Element => (
  <Fragment>
    <sbb-form-field
      size={size}
      label={label}
      optional={optional}
      borderless={borderless}
      negative={negative}
      width="collapse"
    >
      {iconStart && <sbb-icon slot="prefix" name={iconStart} />}
      <sbb-time-input
        onChange={(event) => changeEventHandler(event)}
        onValidationChange={(event) => updateFormError(event.detail.valid)}
      ></sbb-time-input>
      <input id="input-id" {...args} />
      {iconEnd && <sbb-icon slot="suffix" name={iconEnd} />}
    </sbb-form-field>
    <div style={{ display: 'flex', gap: '1em', 'margin-block-start': '2rem' }}>
      <sbb-button variant="secondary" size="m" onClick={() => setValueAsDate()}>
        Set valueAsDate to current datetime
      </sbb-button>
      <sbb-button variant="secondary" size="m" onClick={() => setValue()}>
        Set value to 00:00
      </sbb-button>
    </div>
    <div style={{ color: 'var(--sbb-color-smoke-default)' }}>
      <div style={{ 'margin-block-start': '1rem' }}>Change time in input:</div>
      <div id="container-value"></div>
    </div>
  </Fragment>
);

export const SbbTimeInputDefault: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs },
};

export const SbbTimeInputWithIcons: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgsWithIcons },
};

export const SbbTimeInputBorderless: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    borderless: true,
  },
};

export const SbbTimeInputDisabled: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    disabled: true,
  },
};

export const SbbTimeInputReadonly: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    readonly: true,
  },
};

export const SbbTimeInputWithError: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    value: '99:99',
  },
};

export const SbbTimeInputNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, negative: true },
};

export const SbbTimeInputWithIconsNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgsWithIcons, negative: true },
};

export const SbbTimeInputBorderlessNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    borderless: true,
    negative: true,
  },
};

export const SbbTimeInputDisabledNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    disabled: true,
    negative: true,
  },
};

export const SbbTimeInputReadonlyNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    readonly: true,
    negative: true,
  },
};

export const SbbTimeInputWithErrorNegative: StoryObj = {
  render: TemplateSbbTimeInput,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgsWithIcons,
    value: '99:99',
    negative: true,
  },
};

const meta: Meta = {
  decorators: [
    (Story, context) => (
      <div style={{ ...wrapperStyle(context), padding: '2rem' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: ['change', 'input', SbbTimeInput.events.validationChange],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-time-input',
};

export default meta;
