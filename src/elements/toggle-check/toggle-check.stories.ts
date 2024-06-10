import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './toggle-check.js';
import '../button/button.js';
import '../button/secondary-button.js';
import '../card.js';
import '../icon.js';
import '../title.js';

const longLabel = `For this example we need a very long label, like lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras nec dolor eget leo porttitor ultrices. Mauris sed erat nec justo posuere elementum.
  In pharetra ante vel fringilla tincidunt. Fusce congue accumsan arcu dictum porttitor.
  Pellentesque urna justo, lacinia at velit eu, sagittis tempus nibh.
  Quisque vitae massa et turpis fermentum tristique.`;

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['s', 'm'],
};

const checked: InputType = {
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

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const labelPosition: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['before', 'after'],
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  size,
  checked,
  disabled,
  label,
  value,
  name,
  'icon-name': iconName,
  'label-position': labelPosition,
  'aria-label': ariaLabel,
};

const defaultArgs: Args = {
  size: size.options![0],
  checked: false,
  disabled: false,
  label: 'Label',
  value: 'Value',
  name: 'name',
  'icon-name': undefined,
  'label-position': labelPosition.options![1],
  'aria-label': undefined,
};

// We use property and attribute for `checked` to provide consistency to storybook controls.
// Otherwise, after first user manipulation, the storybook control gets ignored.
// If only using property, the reset mechanism does not work as expected.

const Template = ({ label, checked, ...args }: Args): TemplateResult => html`
  <sbb-toggle-check .checked=${checked} ?checked=${checked} ${sbbSpread(args)}
    >${label}</sbb-toggle-check
  >
`;

const CustomIconTemplate = ({ label, checked, ...args }: Args): TemplateResult => html`
  <sbb-toggle-check .checked=${checked} ?checked=${checked} ${sbbSpread(args)}>
    <sbb-icon slot="icon" name="eye-small"></sbb-icon>
    ${label}
  </sbb-toggle-check>
`;

const BlockVariantTemplate = ({ checked, ...args }: Args): TemplateResult => html`
  <div>
    <sbb-toggle-check
      .checked=${checked}
      ?checked=${checked}
      ${sbbSpread(args)}
      style="display: block;"
    >
      <sbb-title level="5" style="margin: 0;"> Accessible Connection. </sbb-title>
      <span class="sbb-text-s" style="color: var(--sbb-color-iron);">
        Show connections for accessible journeys.
      </span>
    </sbb-toggle-check>
    <p class="sbb-text-xs">
      In this example <code>&lt;sbb-toggle-check&gt;</code> is converted to a block element by
      setting <code>display: block</code>.
    </p>
  </div>
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

export const SbbToggleCheckDefault: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

export const SbbToggleCheckDefaultSizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    size: size.options![1],
  },
};

export const SbbToggleCheckDefaultChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
  },
};

export const SbbToggleCheckDefaultLongLabel: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    label: longLabel,
  },
};

export const SbbToggleCheckDefaultLongLabelSizeM: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    label: longLabel,
    size: size.options![1],
  },
};

export const SbbToggleCheckLabelBefore: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'label-position': 'before',
  },
};

export const SbbToggleCheckWithoutLabel: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    label: undefined,
  },
};

export const SbbToggleCheckDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    disabled: true,
  },
};

export const SbbToggleCheckDisabledChecked: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    disabled: true,
    checked: true,
  },
};

export const SbbToggleCheckCustomIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
    'icon-name': 'face-smiling-small',
  },
};

export const SbbToggleCheckCustomIconSlotted: StoryObj = {
  render: CustomIconTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    checked: true,
    iconName: undefined,
  },
};

export const SbbToggleCheckBlockVariant: StoryObj = {
  render: BlockVariantTemplate,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    'label-position': 'before',
    label: undefined,
  },
};

export const withForm: StoryObj = {
  render: TemplateWithForm,
  argTypes: defaultArgTypes,
  args: defaultArgs,
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
  title: 'elements/sbb-toggle/sbb-toggle-check',
};

export default meta;
