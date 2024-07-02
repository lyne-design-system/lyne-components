import type { InputType } from '@storybook/types';
import type {
  Meta,
  StoryObj,
  ArgTypes,
  Args,
  Decorator,
  StoryContext,
} from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import type { StyleInfo } from 'lit/directives/style-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import { SbbOptionElement } from './option.js';
import readme from './readme.md?raw';

import '../../form-field.js';
import '../../select.js';
import '../../autocomplete.js';

const preserveIconSpace: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Wrapper property',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
};

const active: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const numberOfOptions: InputType = {
  control: {
    type: 'number',
  },
};

const defaultArgTypes: ArgTypes = {
  value,
  'icon-name': iconName,
  active,
  disabled,
  numberOfOptions,
  preserveIconSpace,
};

const defaultArgs: Args = {
  value: 'Value',
  'icon-name': undefined,
  active: false,
  disabled: false,
  numberOfOptions: 5,
  preserveIconSpace: false,
};

const createOptions = ({
  value,
  active,
  disabled,
  numberOfOptions,
  preserveIconSpace,
  ...args
}: Args): TemplateResult[] => {
  const style: Readonly<StyleInfo> = preserveIconSpace
    ? { '--sbb-option-icon-container-display': 'block' }
    : {};
  return [
    ...new Array(numberOfOptions).fill(null).map((_, i) => {
      return html`
        <sbb-option
          style=${styleMap(style)}
          ?active=${active && i === 0}
          ?disabled=${disabled && i === 0}
          value=${`${value} ${i + 1}`}
          ${sbbSpread(args)}
          >${`${value} ${i + 1}`}</sbb-option
        >
      `;
    }),
    html`
      <sbb-option style=${styleMap(style)} ${sbbSpread(args)} value="long-value">
        Option Lorem ipsum dolor sit amet.
      </sbb-option>
    `,
  ];
};

const StandaloneTemplate = (args: Args): TemplateResult => html`${createOptions(args)}`;

const AutocompleteTemplate = (args: Args): TemplateResult => html`
  <sbb-form-field ?negative=${args.negative}>
    <label>sbb-autocomplete</label>
    <input placeholder="Please select." />
    <sbb-autocomplete>${createOptions(args)}</sbb-autocomplete>
  </sbb-form-field>
`;

const SelectTemplate = (args: Args): TemplateResult => html`
  <sbb-form-field ?negative=${args.negative}>
    <label>sbb-select</label>
    <sbb-select placeholder="Please select.">${createOptions(args)}</sbb-select>
  </sbb-form-field>
`;

const borderDecorator: Decorator = (story) => html`
  <div
    style="border-width: var(--sbb-spacing-fixed-2x); border-style: dashed; border-color: #ad00ff; width: 350px;"
  >
    ${story()}
  </div>
`;

export const Standalone: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  decorators: [borderDecorator],
};

export const WithIcon: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': 'clock-small' },
  decorators: [borderDecorator],
};

export const WithDisabledState: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
  decorators: [borderDecorator],
};

export const WithActiveState: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, active: true },
  decorators: [borderDecorator],
};

export const WithIconSpace: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, preserveIconSpace: true },
  decorators: [borderDecorator],
};

export const Autocomplete: StoryObj = {
  render: AutocompleteTemplate,
  argTypes: { ...defaultArgTypes, negative },
  args: { ...defaultArgs, negative: false },
};

export const Select: StoryObj = {
  render: SelectTemplate,
  argTypes: { ...defaultArgTypes, negative },
  args: { ...defaultArgs, negative: false },
};

const meta: Meta = {
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    actions: {
      handles: [SbbOptionElement.events.selectionChange, SbbOptionElement.events.optionSelected],
    },
    docs: {
      // Setting the iFrame height ensures that the story has enough space when used in the docs section.
      story: { inline: false, iframeHeight: '500px' },
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-option/sbb-option',
};

export default meta;
