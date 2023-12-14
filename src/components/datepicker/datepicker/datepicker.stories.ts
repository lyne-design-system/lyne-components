import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, within } from '@storybook/testing-library';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { StoryContext } from '@storybook/web-components';
import isChromatic from 'chromatic';
import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready';
import { waitForStablePosition } from '../../../storybook/testing/wait-for-stable-position';
import { sbbSpread } from '../../core/dom';

import { SbbDatepickerElement } from './datepicker';
import readme from './readme.md?raw';

import '../datepicker-next-day';
import '../datepicker-previous-day';
import '../datepicker-toggle';
import '../../form-field';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative
    ? 'var(--sbb-color-black-default)'
    : 'var(--sbb-color-white-default)',
});

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const required: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const form: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const min: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const max: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Input datepicker attribute',
  },
};

const wide: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Datepicker attribute',
  },
};

const filterFunctions = [
  () => true,
  (d) => d.getDay() !== 6 && d.getDay() !== 0,
  (d) => d.getDate() % 2 === 1,
  (d) => d.getFullYear() % 2 === 0,
  (d) => d.getMonth() > 6,
];
const dateFilter: InputType = {
  options: Object.keys(filterFunctions),
  mapping: filterFunctions,
  control: {
    type: 'select',
    labels: {
      0: 'No dateFilter function.',
      1: 'The dateFilter function includes only working days.',
      2: 'The dateFilter function excludes even days.',
      3: 'The dateFilter function excludes odd years.',
      4: 'The dateFilter function excludes months from January to July',
    },
  },
  table: {
    category: 'Datepicker attribute',
  },
};

const handlingFunctions = [
  { dateParser: undefined, format: undefined },
  {
    dateParser: (s) => new Date(s),
    format: (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`,
  },
  {
    dateParser: (s) =>
      new Date(+s.substring(4, s.length), +s.substring(2, 4) - 1, +s.substring(0, 2)),
    format: (d) =>
      `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(
        2,
        '0',
      )}${d.getFullYear()}`,
  },
];
const dateHandling: InputType = {
  name: 'Date Handling',
  description:
    'Change the default date handling option with a combination of `dateParser` and `format` properties.',
  options: Object.keys(filterFunctions),
  mapping: handlingFunctions,
  control: {
    type: 'select',
    labels: {
      0: 'Default',
      1: 'ISO String (YYYY-MM-DD)',
      2: 'Business (DDMMYY)',
    },
  },
  table: {
    category: 'Datepicker attribute',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Datepicker attribute',
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

const dataNow: InputType = {
  control: {
    type: 'date',
  },
  table: {
    category: 'Testing',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Testing',
  },
};

const basicArgTypes: ArgTypes = {
  value,
  form,
  disabled,
  readonly,
  required,
  min,
  max,
  wide,
  dateFilter,
  dateHandling,
  'aria-label': ariaLabel,
  'data-now': dataNow,
  disableAnimation,
};

const basicArgs: Args = {
  value: `15.02.2023`,
  form: undefined,
  disabled: false,
  readonly: false,
  required: false,
  min: undefined,
  max: undefined,
  wide: false,
  dateFilter: dateFilter.options[0],
  dateHandling: dateHandling.options[0],
  'aria-label': undefined,
  disableAnimation: isChromatic(),
  dataNow: isChromatic() ? new Date(2023, 0, 12, 0, 0, 0).valueOf() : undefined,
};

const formFieldBasicArgsTypes: ArgTypes = {
  ...basicArgTypes,
  label,
  size,
  negative,
  optional,
  borderless,
};

const formFieldBasicArgs = {
  ...basicArgs,
  label: 'Label',
  size: size.options[0],
  negative: false,
  optional: false,
  borderless: false,
};

const getInputAttributes = (min, max): Record<string, number> => {
  const attr: Record<string, number> = {};
  if (min) {
    attr.min = new Date(min).getTime() / 1000;
  }
  if (max) {
    attr.max = new Date(max).getTime() / 1000;
  }
  return attr;
};

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('toggle').shadowRoot!.querySelector('sbb-tooltip-trigger'),
  );

  await waitForStablePosition(
    () => canvas.getByTestId('toggle').shadowRoot!.querySelector('sbb-tooltip-trigger')!,
  );

  const toggle = await canvas
    .getByTestId('toggle')
    .shadowRoot!.querySelector('sbb-tooltip-trigger')!;
  userEvent.click(toggle);
};

const changeEventHandler = (event): void => {
  const div = document.createElement('div');
  div.innerText = `valueAsDate is: ${event.target.valueAsDate}.`;
  document.getElementById('container-value')?.append(div);
};

const Template = ({
  min,
  max,
  wide,
  dateFilter,
  'data-now': dataNow,
  disableAnimation,
  ...args
}: Args): TemplateResult => {
  return html`
    <div style=${styleMap({ display: 'flex', gap: '0.25rem' })}>
      <sbb-datepicker-previous-day date-picker="datepicker"></sbb-datepicker-previous-day>
      <sbb-datepicker-toggle
        date-picker="datepicker"
        data-testid="toggle"
        ?disable-animation=${disableAnimation}
      ></sbb-datepicker-toggle>
      <input ${sbbSpread(args)} id="datepicker-input" ${sbbSpread(getInputAttributes(min, max))} />
      <sbb-datepicker
        id="datepicker"
        input="datepicker-input"
        .dateFilter=${dateFilter}
        ?wide=${wide}
        @change=${(event) => changeEventHandler(event)}
        data-now=${dataNow}
      ></sbb-datepicker>
      <sbb-datepicker-next-day date-picker="datepicker"></sbb-datepicker-next-day>
    </div>
    <div
      id="container-value"
      style=${styleMap({ 'margin-block-start': '1rem', color: 'var(--sbb-color-smoke-default)' })}
    >
      Change date to get the latest value:
    </div>
  `;
};

const TemplateFormField = ({
  min,
  max,
  label,
  optional,
  borderless,
  size,
  negative,
  wide,
  dateFilter,
  dateHandling,
  'data-now': dataNow,
  disableAnimation,
  ...args
}: Args): TemplateResult => {
  return html`
    <sbb-form-field
      size=${size}
      ?negative=${negative}
      label=${label}
      ?optional=${optional}
      ?borderless=${borderless}
      width="collapse"
    >
      <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
      <sbb-datepicker-next-day></sbb-datepicker-next-day>
      <sbb-datepicker-toggle
        data-testid="toggle"
        ?disable-animation=${disableAnimation}
      ></sbb-datepicker-toggle>
      <input ${sbbSpread(args)} ${sbbSpread(getInputAttributes(min, max))} />
      <sbb-datepicker
        .dateFilter=${dateFilter}
        .dateParser=${dateHandling.dateParser}
        .format=${dateHandling.format}
        ?wide=${wide}
        @change=${(event) => changeEventHandler(event)}
        data-now=${dataNow}
      ></sbb-datepicker>
    </sbb-form-field>
    <div
      id="container-value"
      style=${styleMap({ 'margin-block-start': '1rem', color: 'var(--sbb-color-smoke-default)' })}
    >
      Change date to get the latest value:
    </div>
  `;
};

export const InFormField: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const InFormFieldDisabled: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, disabled: true },
};

export const InFormFieldReadonly: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, readonly: true },
};

export const InFormFieldNegative: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, negative: true },
};

export const InFormFieldDisabledNegative: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, disabled: true, negative: true },
};

export const InFormFieldReadonlyNegative: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, readonly: true, negative: true },
};

export const InFormFieldWide: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, wide: true },
};

export const InFormFieldWithMinAndMax: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: {
    ...formFieldBasicArgs,
    min: new Date(2023, 1, 8),
    max: new Date(2023, 1, 22),
  },
};

export const InFormFieldWithDateFilter: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, dateFilter: dateFilter.options[1] },
};

export const InFormFieldWithDateParser: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, value: '2023-02-12', dateHandling: dateHandling.options[1] },
};

export const InFormFieldLarge: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, size: size.options[1] },
};

export const InFormFieldOptional: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, optional: true },
};

export const InFormFieldBorderless: StoryObj = {
  render: TemplateFormField,
  argTypes: { ...formFieldBasicArgsTypes },
  args: { ...formFieldBasicArgs, borderless: true },
};

export const WithoutFormField: StoryObj = {
  render: Template,
  argTypes: { ...basicArgTypes },
  args: { ...basicArgs },
};

const meta: Meta = {
  decorators: [
    (story, context) => html`
      <div
        style=${styleMap({
          ...wrapperStyle(context),
          padding: '2rem',
          'min-height': isChromatic() ? '100vh' : undefined,
        })}
      >
        ${story()}
      </div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: ['input', 'change', SbbDatepickerElement.events.validationChange],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      story: { inline: false, iframeHeight: '600px' },

      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-datepicker/sbb-datepicker',
};

export default meta;
