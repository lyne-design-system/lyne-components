import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type {
  Args,
  ArgTypes,
  Decorator,
  Meta,
  StoryContext,
  StoryObj,
} from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import '../autocomplete-grid-row.js';
import './autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';

const numberOfButtons: InputType = {
  control: {
    type: 'number',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  numberOfButtons,
  negative,
  disabled,
};

const defaultArgs: Args = {
  numberOfButtons: 1,
  negative: false,
  disabled: false,
};

const Template = ({ numberOfButtons, ...args }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-row ?data-negative=${args.negative}>
    ${repeat(
      new Array(numberOfButtons),
      (_, i) => html`
        <sbb-autocomplete-grid-cell>
          <sbb-autocomplete-grid-button
            ${sbbSpread(args)}
            icon-name=${i === 0 ? 'star-small' : i === 1 ? 'pen-small' : 'trash-small'}
          ></sbb-autocomplete-grid-button>
        </sbb-autocomplete-grid-cell>
      `,
    )}
  </sbb-autocomplete-grid-row>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Negative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const DisabledNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true, negative: true },
};

export const Multiple: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfButtons: 3 },
};

export const MultipleNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfButtons: 3, negative: true },
};

export const MultipleDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfButtons: 3, disabled: true },
};

export const MultipleDisabledNegative: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfButtons: 3, disabled: true, negative: true },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['click'],
    },
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-autocomplete-grid/sbb-autocomplete-grid-cell',
};

export default meta;
