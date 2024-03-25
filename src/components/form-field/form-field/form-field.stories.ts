import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, StoryContext } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../core/dom';
import type { SbbFormErrorElement } from '../../form-error';

import readme from './readme.md?raw';
import './form-field';
import '../form-field-clear';
import '../../button/mini-button';
import '../../form-error';
import '../../link';
import '../../popover';
import '../../title';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

const PopoverTrigger = (): TemplateResult => html`
  <sbb-popover-trigger
    slot="suffix"
    id="popover-trigger"
    icon-name="circle-information-small"
  ></sbb-popover-trigger>
  <sbb-popover data-testid="popover" trigger="popover-trigger">
    <sbb-title level="2" visual-level="6" style="margin-block-start: 0"
      >Simple info popover.</sbb-title
    >
    <span id="popover-content" class="sbb-text-s">
      Some content.
      <sbb-block-link icon-name="chevron-small-right-small" icon-placement="end" sbb-popover-close>
        Learn More
      </sbb-block-link>
    </span>
  </sbb-popover>
`;

const TemplateBasicInput = ({
  cssClass,
  placeholder,
  disabled,
  readonly,
  value,
}: Args): TemplateResult => html`
  <input
    class=${cssClass}
    placeholder=${placeholder}
    ?disabled=${disabled}
    ?readonly=${readonly}
    value=${value}
  />
`;

const TemplateBasicSelect = ({ cssClass, disabled }: Args): TemplateResult => html`
  <select class=${cssClass} ?disabled=${disabled}>
    <option value="1">Value 1</option>
    <option value="2">Value 2</option>
    <option value="3">Value 3</option>
  </select>
`;

const TemplateInput = ({
  'error-space': errorSpace,
  label,
  optional,
  size,
  borderless,
  width,
  negative,
  'hidden-label': hiddenLabel,
  'floating-label': floatingLabel,
  ...args
}: Args): TemplateResult => html`
  <sbb-form-field
    error-space=${errorSpace}
    label=${label || nothing}
    ?optional=${optional}
    size=${size}
    ?borderless=${borderless}
    width=${width}
    ?hidden-label=${hiddenLabel}
    ?floating-label=${floatingLabel}
    ?negative=${negative}
  >
    ${TemplateBasicInput(args)}
  </sbb-form-field>
`;

const TemplateInputWithSlottedLabel = ({
  'error-space': errorSpace,
  label,
  optional,
  size,
  borderless,
  width,
  negative,
  'hidden-label': hiddenLabel,
  'floating-label': floatingLabel,
  ...args
}: Args): TemplateResult => html`
  <sbb-form-field
    error-space=${errorSpace}
    ?optional=${optional}
    size=${size}
    ?borderless=${borderless}
    width=${width}
    ?hidden-label=${hiddenLabel}
    ?floating-label=${floatingLabel}
    ?negative=${negative}
  >
    <span slot="label">${label}</span>
    ${TemplateBasicInput(args)}
  </sbb-form-field>
`;

const TemplateInputWithErrorSpace = (args: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = args.errorText;

  return html`
    <form>
      <div>
        <sbb-form-field
          error-space=${args['error-space']}
          label=${args.label}
          ?optional=${args.optional}
          size=${args.size}
          ?borderless=${args.borderless}
          width=${args.width}
          ?hidden-label=${args['hidden-label']}
          ?floating-label=${args['floating-label']}
          ?negative=${args.negative}
        >
          <input
            @keyup=${(event: KeyboardEvent) => {
              const input = event.currentTarget as HTMLInputElement;
              if (input.value !== '') {
                sbbFormError.remove();
                input.classList.remove(args.cssClass);
              } else {
                input.closest('sbb-form-field')!.append(sbbFormError);
                input.classList.add(args.cssClass);
              }
            }}
            class=${args.cssClass}
            placeholder=${args.placeholder}
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
          />
          ${sbbFormError}
        </sbb-form-field>
      </div>
      <div style="color: var(--sbb-color-smoke);">
        Some text, right below the form-field, inside a div.
      </div>
    </form>
  `;
};

const TemplateInputWithIcons = (args: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    <sbb-icon slot="prefix" name="pie-small"></sbb-icon>
    ${TemplateBasicInput(args)} ${PopoverTrigger()}
  </sbb-form-field>
`;

const TemplateInputWithMiniButton = ({
  disabled,
  readonly,
  active,
  ...args
}: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    ${TemplateBasicInput({ disabled, readonly, ...args })}
    <sbb-mini-button
      slot="suffix"
      icon-name="pie-small"
      ?disabled=${disabled || readonly}
      aria-label="Input button"
      ?data-active=${active}
    ></sbb-mini-button>
  </sbb-form-field>
`;

const TemplateInputWithClearButton = ({
  disabled,
  readonly,
  active,
  ...args
}: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    ${TemplateBasicInput({ disabled, readonly, ...args })}
    <sbb-form-field-clear ?data-active=${active}></sbb-form-field-clear>
  </sbb-form-field>
`;

const TemplateSelect = (args: Args): TemplateResult => html`
  <sbb-form-field
    error-space=${args['error-space']}
    label=${args.label}
    ?optional=${args.optional}
    size=${args.size}
    ?borderless=${args.borderless}
    width=${args.width}
    ?hidden-label=${args['hidden-label']}
    ?floating-label=${args['floating-label']}
    ?negative=${args.negative}
  >
    ${TemplateBasicSelect(args)}
  </sbb-form-field>
`;

const TemplateSelectWithErrorSpace = (args: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = args.errorText;

  return html`
    <form>
      <div>
        <sbb-form-field
          error-space=${args['error-space']}
          label=${args.label}
          ?optional=${args.optional}
          size=${args.size}
          ?borderless=${args.borderless}
          width=${args.width}
          ?hidden-label=${args['hidden-label']}
          ?floating-label=${args['floating-label']}
          ?negative=${args.negative}
        >
          <select
            @change=${(event: Event) => {
              const select = event.currentTarget as HTMLSelectElement;
              if (select.value !== '0') {
                sbbFormError.remove();
                select.classList.remove(args.cssClass);
              } else {
                select.closest('sbb-form-field')!.append(sbbFormError);
                select.classList.add(args.cssClass);
              }
            }}
            class=${args.cssClass}
            ?disabled=${args.disabled}
          >
            <option value="0"></option>
            <option value="1">Value 1</option>
            <option value="2">Value 2</option>
            <option value="3">Value 3</option>
          </select>
          ${sbbFormError}
        </sbb-form-field>
      </div>
      <div>
        <div style=${styleMap({ color: 'var(--sbb-color-smoke)' })}>
          Some text, right below the form-field, inside a div.
        </div>
      </div>
    </form>
  `;
};

const TemplateSelectWithIcons = (args: Args): TemplateResult => html`
  <sbb-form-field ${sbbSpread(args)}>
    <span slot="prefix">
      <sbb-icon name="pie-small"></sbb-icon>
    </span>
    ${TemplateBasicSelect(args)}
    <span slot="suffix">${PopoverTrigger()}</span>
  </sbb-form-field>
`;

const placeholder: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Input attribute',
  },
};

const cssClass: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Input attribute',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input attribute',
  },
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input attribute',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Input attribute',
  },
};

const errorText: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Error slot',
  },
};

const errorSpace: InputType = {
  control: {
    type: 'select',
  },
  options: ['none', 'reserve'],
  table: {
    category: 'Form-field attribute',
  },
};

const width: InputType = {
  control: {
    type: 'select',
  },
  options: ['default', 'collapse'],
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

const hiddenLabel: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form-field attribute',
  },
};

const floatingLabel: InputType = {
  control: {
    type: 'boolean',
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

const active: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    disable: true,
  },
};

const basicArgTypes: ArgTypes = {
  'error-space': errorSpace,
  label,
  'hidden-label': hiddenLabel,
  'floating-label': floatingLabel,
  optional,
  borderless,
  size,
  negative,
  cssClass,
  placeholder,
  disabled,
  readonly,
  value,
  errorText,
  width,
  active,
};

const basicArgs: Args = {
  'error-space': 'none',
  label: 'Input name',
  'hidden-label': false,
  'floating-label': false,
  optional: false,
  borderless: false,
  size: size.options[0],
  negative: false,
  cssClass: '',
  placeholder: 'Input placeholder',
  value: 'Input value',
  disabled: false,
  readonly: false,
  errorText: 'This is a required field.',
  width: width.options[0],
  active: false,
};

export const Input: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, value: 'This input value is so long that it needs ellipsis to fit.' },
};

export const InputSizeL: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    value: 'This input value is so long that it needs ellipsis to fit.',
    size: 'l',
  },
};

export const InputNoLabel: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, label: undefined },
};

export const InputHiddenLabel: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'hidden-label': true },
};

export const InputWithSlottedLabel: StoryObj = {
  render: TemplateInputWithSlottedLabel,
  argTypes: basicArgTypes,
  args: { ...basicArgs, value: 'Random value' },
};

export const InputWithoutBorder: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, borderless: true },
};

export const InputDisabled: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const InputReadonly: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, readonly: true },
};

export const InputOptionalAndIcons: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, optional: true },
};

export const InputWithMiniButton: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const InputWithMiniButtonDisabled: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const InputWithMiniButtonActive: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, active: true },
};

export const InputWithClearButton: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const InputWithClearButtonDisabled: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const InputWithClearButtonActive: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, active: true },
};

export const InputLongLabelAndErrorSpace: StoryObj = {
  render: TemplateInputWithErrorSpace,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'error-space': 'reserve',
    cssClass: 'sbb-invalid',
    label: 'This label name is so long that it needs ellipsis to fit.',
    value: 'This input value is so long that it needs ellipsis to fit.',
  },
};

export const InputFloatingLabel: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'floating-label': true, value: undefined },
};

export const InputFloatingLongLabel: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'floating-label': true,
    value: undefined,
    label: 'This is a very long label which receives ellipsis',
  },
};

export const InputFloatingWithIcons: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'floating-label': true,
    value: undefined,
  },
};

export const Select: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const SelectWithoutBorder: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs, borderless: true },
};

export const SelectDisabled: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const SelectErrorSpace: StoryObj = {
  render: TemplateSelectWithErrorSpace,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'error-space': 'reserve', cssClass: 'sbb-invalid' },
};

export const SelectFloatingLabel: StoryObj = {
  render: TemplateSelectWithErrorSpace,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'floating-label': true, value: undefined },
};

export const SelectOptionalAndIcons: StoryObj = {
  render: TemplateSelectWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, optional: true },
};

export const InputCollapsedWidth: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, width: width.options[1] },
};

export const InputWithIconsDisabled: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true },
};

export const InputNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    value: 'This input value is so long that it needs ellipsis to fit.',
    negative: true,
  },
};

export const InputWithSlottedLabelNegative: StoryObj = {
  render: TemplateInputWithSlottedLabel,
  argTypes: basicArgTypes,
  args: { ...basicArgs, value: 'Random value', negative: true },
};

export const InputWithoutBorderNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, borderless: true, negative: true },
};

export const InputDisabledNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, negative: true },
};

export const InputReadonlyNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, readonly: true, negative: true },
};

export const InputOptionalAndIconsNegative: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, optional: true, negative: true },
};

export const InputWithMiniButtonNegative: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, negative: true },
};

export const InputWithMiniButtonDisabledNegative: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, negative: true },
};

export const InputWithMiniButtonActiveNegative: StoryObj = {
  render: TemplateInputWithMiniButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, active: true, negative: true },
};

export const InputWithClearButtonNegative: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, negative: true },
};

export const InputWithClearButtonDisabledNegative: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, negative: true },
};

export const InputWithClearButtonActiveNegative: StoryObj = {
  render: TemplateInputWithClearButton,
  argTypes: basicArgTypes,
  args: { ...basicArgs, active: true, negative: true },
};

export const InputLongLabelAndErrorSpaceNegative: StoryObj = {
  render: TemplateInputWithErrorSpace,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'error-space': 'reserve',
    cssClass: 'sbb-invalid',
    label: 'This label name is so long that it needs ellipsis to fit.',
    value: 'This input value is so long that it needs ellipsis to fit.',
    negative: true,
  },
};

export const InputFloatingLabelNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'floating-label': true, value: undefined, negative: true },
};

export const InputFloatingLongLabelNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'floating-label': true,
    value: undefined,
    label: 'This is a very long label which receives ellipsis',
    negative: true,
  },
};

export const InputFloatingWithIconsNegative: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'floating-label': true,
    value: undefined,
    negative: true,
  },
};

export const SelectNegative: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs, negative: true },
};

export const SelectWithoutBorderNegative: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs, borderless: true, negative: true },
};

export const SelectDisabledNegative: StoryObj = {
  render: TemplateSelect,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, negative: true },
};

export const SelectErrorSpaceNegative: StoryObj = {
  render: TemplateSelectWithErrorSpace,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'error-space': 'reserve', cssClass: 'sbb-invalid', negative: true },
};

export const SelectFloatingLabelNegative: StoryObj = {
  render: TemplateSelectWithErrorSpace,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'floating-label': true, value: undefined, negative: true },
};

export const SelectOptionalAndIconsNegative: StoryObj = {
  render: TemplateSelectWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, optional: true, negative: true },
};

export const InputCollapsedWidthNegative: StoryObj = {
  render: TemplateInput,
  argTypes: basicArgTypes,
  args: { ...basicArgs, width: width.options[1], negative: true },
};

export const InputWithIconsDisabledNegative: StoryObj = {
  render: TemplateInputWithIcons,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabled: true, negative: true },
};

const meta: Meta = {
  excludeStories: /.*(Active|ActiveNegative)$/,
  decorators: [
    (story, context) => html`
      <div style=${styleMap({ ...wrapperStyle(context), padding: '2rem' })}>${story()}</div>
    `,
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-form-field/sbb-form-field',
};

export default meta;
