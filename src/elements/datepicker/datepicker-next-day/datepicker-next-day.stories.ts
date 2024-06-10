import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type {
  Meta,
  StoryObj,
  Decorator,
  StoryContext,
  Args,
  ArgTypes,
} from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './datepicker-next-day.js';
import '../../form-field.js';
import '../datepicker.js';

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  negative,
};

const defaultArgs: Args = {
  negative: false,
};

const BaseTemplate = (args: Args, picker: string | undefined = undefined): TemplateResult => html`
  <sbb-datepicker-next-day ${sbbSpread(args)} .datePicker=${picker}></sbb-datepicker-next-day>
`;

const StandaloneTemplate = (args: Args): TemplateResult => html` ${BaseTemplate(args)} `;

const PickerAndButtonTemplate = (args: Args): TemplateResult => html`
  <div style=${styleMap({ display: 'flex', gap: '1em' })}>
    <sbb-datepicker
      id="datepicker"
      input="datepicker-input"
      now="2023-01-12T00:00:00Z"
    ></sbb-datepicker>
    <input value="15.02.2023" id="datepicker-input" />
    ${BaseTemplate(args, 'datepicker')}
  </div>
`;

const FormFieldTemplate = (args: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    <input value="15.02.2023" />
    <sbb-datepicker></sbb-datepicker>
    ${BaseTemplate(args)}
  </sbb-form-field>
`;

const EmptyFormFieldTemplate = (args: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    <input />
    <sbb-datepicker></sbb-datepicker>
    ${BaseTemplate(args)}
  </sbb-form-field>
`;

export const Standalone: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const StandaloneNegative: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
};

export const WithPicker: StoryObj = {
  render: PickerAndButtonTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const InFormField: StoryObj = {
  render: FormFieldTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const EmptyFormField: StoryObj = {
  render: EmptyFormFieldTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    actions: {
      handles: ['click', 'change', 'input'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-datepicker/sbb-datepicker-next-day',
};

export default meta;
