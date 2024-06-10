import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import type { StyleInfo } from 'lit/directives/style-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../storybook/helpers/spread.js';
import type { SbbFormErrorElement } from '../form-error.js';
import type {
  SbbRadioButtonGroupElement,
  SbbRadioButtonGroupEventDetail,
} from '../radio-button.js';

import readme from './readme.md?raw';
import { SbbSelectionPanelElement } from './selection-panel.js';
import '../card.js';
import '../checkbox.js';
import '../divider.js';
import '../form-error.js';
import '../icon.js';
import '../link/block-link-button.js';
import '../radio-button.js';
import '../popover.js';
import '../title.js';

const color: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['white', 'milk'],
};

const forceOpen: InputType = {
  control: {
    type: 'boolean',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
};

const checkedInput: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input',
  },
};

const disabledInput: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Input',
  },
};

const basicArgTypes: ArgTypes = {
  color: color,
  'force-open': forceOpen,
  borderless: borderless,
  checkedInput,
  disabledInput,
};

const basicArgs: Args = {
  color: color.options![0],
  'force-open': false,
  borderless: false,
  checkedInput: false,
  disabledInput: false,
};

const suffixStyle: Readonly<StyleInfo> = {
  display: 'flex',
  alignItems: 'center',
};

const cardBadge = (): TemplateResult => html`<sbb-card-badge>%</sbb-card-badge>`;

const suffixAndSubtext = (): TemplateResult => html`
  <span slot="subtext">Subtext</span>
  <span slot="suffix" style="margin-inline-start: auto;">
    <span style=${styleMap(suffixStyle)}>
      <sbb-icon name="diamond-small" style="margin-inline: var(--sbb-spacing-fixed-2x);"></sbb-icon>
      <span class="sbb-text-m sbb-text--bold">
        <span class="sbb-text-xs sbb-text--bold">CHF</span> 40.00
      </span>
    </span>
  </span>
`;

const innerContent = (): TemplateResult => html`
  <div slot="content">
    Inner Content
    <sbb-block-link-button icon-name="chevron-small-right-small" icon-placement="end">
      Link
    </sbb-block-link-button>
  </div>
`;

const WithCheckboxTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-selection-panel ${sbbSpread(args)}>
    ${cardBadge()}
    <sbb-checkbox ?checked=${checkedInput} ?disabled=${disabledInput}>
      Value one ${suffixAndSubtext()}
    </sbb-checkbox>
    ${innerContent()}
  </sbb-selection-panel>
`;

const WithRadioButtonTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-selection-panel ${sbbSpread(args)}>
    ${cardBadge()}
    <sbb-radio-button value="Value one" ?checked=${checkedInput} ?disabled=${disabledInput}>
      Value one ${suffixAndSubtext()}
    </sbb-radio-button>
    ${innerContent()}
  </sbb-selection-panel>
`;

const WithCheckboxGroupTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-checkbox-group orientation="vertical" horizontal-from="large">
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-checkbox ?checked=${checkedInput}> Value one ${suffixAndSubtext()} </sbb-checkbox>
      ${innerContent()}
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-checkbox ?disabled=${disabledInput}> Value two ${suffixAndSubtext()} </sbb-checkbox>
      ${innerContent()}
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-checkbox> Value three ${suffixAndSubtext()} </sbb-checkbox>
      ${innerContent()}
    </sbb-selection-panel>
  </sbb-checkbox-group>
`;

const WithRadioButtonGroupTemplate = ({
  checkedInput,
  disabledInput,
  allowEmptySelection,
  ...args
}: Args): TemplateResult => html`
  <sbb-radio-button-group
    orientation="vertical"
    horizontal-from="large"
    ?allow-empty-selection=${allowEmptySelection}
  >
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value one" ?checked=${checkedInput}>
        Value one ${suffixAndSubtext()}
      </sbb-radio-button>
      ${innerContent()}
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value two" ?disabled=${disabledInput}>
        Value two ${suffixAndSubtext()}
      </sbb-radio-button>
      ${innerContent()}
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value three"> Value three ${suffixAndSubtext()} </sbb-radio-button>
      ${innerContent()}
    </sbb-selection-panel>
  </sbb-radio-button-group>
`;

const TicketsOptionsExampleTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-checkbox-group orientation="vertical" horizontal-from="large">
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-checkbox ?checked=${checkedInput}> Saving ${suffixAndSubtext()} </sbb-checkbox>
      <div slot="content">
        <sbb-radio-button-group orientation="vertical" value="non-flex">
          <sbb-radio-button value="non-flex" style="width: 100%;">
            Non-Flex
            <span slot="subtext">No refund possible</span>
            <span slot="suffix" style="margin-inline-start: auto; color: var(--sbb-color-granite);">
              <span style=${styleMap(suffixStyle)}>
                <span class="sbb-text-m"> <span class="sbb-text-xxs">CHF</span> 0.00 </span>
              </span>
            </span>
          </sbb-radio-button>
          <sbb-radio-button value="semi-flex" style="width: 100%;">
            Semi-Flex
            <span slot="subtext">Partial refund possible</span>
            <span slot="suffix" style="margin-inline-start: auto; color: var(--sbb-color-granite);">
              <span style=${styleMap(suffixStyle)}>
                <span class="sbb-text-m"> <span class="sbb-text-xxs">+ CHF</span> 5.00 </span>
              </span>
            </span>
          </sbb-radio-button>
        </sbb-radio-button-group>
        <sbb-divider style="margin-block: var(--sbb-spacing-responsive-xxs);"></sbb-divider>
        <span style="color: var(--sbb-color-granite);">
          <div style="display: flex; align-items: center; gap: var(--sbb-spacing-fixed-1x);">
            1 x 0 x Supersaver ticket, Half-Fare Card${' '}
            <sbb-popover-trigger
              id="popover-trigger-1"
              icon-name="circle-information-small"
            ></sbb-popover-trigger>
          </div>
          <div>Valid: Thu., 03.11.2022 until Fri., 04.11.2022 05:00</div>
        </span>
        <sbb-popover trigger="popover-trigger-1" hover-trigger>
          <sbb-title level="2" visual-level="6" style="margin-block-start: 0"
            >Popover title.</sbb-title
          >
          <span class="sbb-text-s">Simple popover</span>
        </sbb-popover>
      </div>
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-checkbox ?disabled=${disabledInput}> City offer ${suffixAndSubtext()} </sbb-checkbox>
      <div slot="content">
        <sbb-checkbox-group orientation="vertical">
          <sbb-checkbox value="option-1" style="width: 100%;">
            Option one
            <span slot="suffix" style="margin-inline-start: auto; color: var(--sbb-color-granite);">
              <span style=${styleMap(suffixStyle)}>
                <span class="sbb-text-m"> <span class="sbb-text-xxs">CHF</span> 0.00 </span>
              </span>
            </span>
          </sbb-checkbox>
          <sbb-checkbox value="option-2" style="width: 100%;">
            Option two
            <span slot="suffix" style="margin-inline-start: auto; color: var(--sbb-color-granite);">
              <span style=${styleMap(suffixStyle)}>
                <span class="sbb-text-m"> <span class="sbb-text-xxs">+ CHF</span> 5.00 </span>
              </span>
            </span>
          </sbb-checkbox>
        </sbb-checkbox-group>
        <sbb-divider style="margin-block: var(--sbb-spacing-responsive-xxs);"></sbb-divider>
        <span style="color: var(--sbb-color-granite);">
          <div style="display: flex; align-items: center; gap: var(--sbb-spacing-fixed-1x);">
            1 x 0 x City Ticket incl. City Supplement City, Half-Fare Card${' '}
            <sbb-popover-trigger
              id="popover-trigger-2"
              icon-name="circle-information-small"
            ></sbb-popover-trigger>
          </div>
          <div>Valid: Thu., 03.11.2022 until Fri., 04.11.2022 05:00</div>
        </span>
        <sbb-popover trigger="popover-trigger-2" hover-trigger>
          <sbb-title level="2" visual-level="6" style="margin-block-start: 0"
            >Popover title.</sbb-title
          >
          <span class="sbb-text-s">Simple popover</span>
        </sbb-popover>
      </div>
    </sbb-selection-panel>
  </sbb-checkbox-group>
`;

const NestedRadioTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-radio-button-group orientation="vertical" horizontal-from="large">
    <sbb-selection-panel ${sbbSpread(args)}>
      <sbb-radio-button value="mainoption1" ?checked=${checkedInput}>
        Main Option 1
      </sbb-radio-button>
      <sbb-radio-button-group orientation="vertical" value="suboption1" slot="content">
        <sbb-radio-button value="suboption1">Suboption 1</sbb-radio-button>
        <sbb-radio-button value="suboption2">Suboption 2</sbb-radio-button>
      </sbb-radio-button-group>
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      <sbb-radio-button value="mainoption2" ?disabled=${disabledInput}>
        Main Option 2
      </sbb-radio-button>
      <sbb-radio-button-group orientation="vertical" value="suboption2" slot="content">
        <sbb-radio-button value="suboption1">Suboption 1</sbb-radio-button>
        <sbb-radio-button value="suboption2">Suboption 2</sbb-radio-button>
      </sbb-radio-button-group>
    </sbb-selection-panel>
  </sbb-radio-button-group>
`;

const NestedCheckboxTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-checkbox-group orientation="vertical" horizontal-from="large">
    <sbb-selection-panel ${sbbSpread(args)}>
      <sbb-checkbox value="mainoption1" ?checked=${checkedInput}> Main Option 1 </sbb-checkbox>
      <sbb-checkbox-group orientation="vertical" slot="content">
        <sbb-checkbox value="suboption1">Suboption 1</sbb-checkbox>
        <sbb-checkbox value="suboption2">Suboption 2</sbb-checkbox>
      </sbb-checkbox-group>
    </sbb-selection-panel>

    <sbb-selection-panel ${sbbSpread(args)}>
      <sbb-checkbox value="mainoption2" ?disabled=${disabledInput}> Main Option 2 </sbb-checkbox>
      <sbb-checkbox-group orientation="vertical" slot="content">
        <sbb-checkbox value="suboption1">Suboption 1</sbb-checkbox>
        <sbb-checkbox value="suboption2">Suboption 2</sbb-checkbox>
      </sbb-checkbox-group>
    </sbb-selection-panel>
  </sbb-checkbox-group>
`;

const WithCheckboxesErrorMessageTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'This is a required field.';

  return html`
    <sbb-checkbox-group
      orientation="vertical"
      horizontal-from="large"
      @change=${(event: Event) => {
        const checkboxGroup = event.currentTarget as HTMLElement;
        const hasChecked = Array.from(checkboxGroup.querySelectorAll('sbb-checkbox')).some(
          (el) => el.checked,
        );
        if (hasChecked) {
          sbbFormError.remove();
        } else {
          checkboxGroup.append(sbbFormError);
        }
      }}
    >
      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-checkbox ?checked=${checkedInput}> Value one ${suffixAndSubtext()} </sbb-checkbox>
        ${innerContent()}
      </sbb-selection-panel>

      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-checkbox ?disabled=${disabledInput}> Value two ${suffixAndSubtext()} </sbb-checkbox>
        ${innerContent()}
      </sbb-selection-panel>

      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-checkbox> Value three ${suffixAndSubtext()} </sbb-checkbox>
        ${innerContent()}
      </sbb-selection-panel>
      ${sbbFormError}
    </sbb-checkbox-group>
  `;
};

const WithRadiosErrorMessageTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'This is a required field.';

  return html`
    <sbb-radio-button-group
      orientation="vertical"
      horizontal-from="large"
      allow-empty-selection
      id="sbb-radio-group"
      @change=${(event: CustomEvent<SbbRadioButtonGroupEventDetail>) => {
        if (event.detail.value) {
          sbbFormError.remove();
        } else {
          (event.currentTarget as SbbRadioButtonGroupElement).append(sbbFormError);
        }
      }}
    >
      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-radio-button value="Value one" ?checked=${checkedInput}>
          Value one ${suffixAndSubtext()}
        </sbb-radio-button>
        ${innerContent()}
      </sbb-selection-panel>

      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-radio-button value="Value two" ?disabled=${disabledInput}>
          Value two ${suffixAndSubtext()}
        </sbb-radio-button>
        ${innerContent()}
      </sbb-selection-panel>

      <sbb-selection-panel ${sbbSpread(args)}>
        ${cardBadge()}
        <sbb-radio-button value="Value three"> Value three ${suffixAndSubtext()} </sbb-radio-button>
        ${innerContent()}
      </sbb-selection-panel>
      ${sbbFormError}
    </sbb-radio-button-group>
  `;
};

const WithNoContentTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-selection-panel
    ${sbbSpread(args)}
    style="display: block; margin-block-end: var(--sbb-spacing-fixed-4x);"
  >
    ${cardBadge()}
    <sbb-checkbox ?checked=${checkedInput} ?disabled=${disabledInput}>
      Value one ${suffixAndSubtext()}
    </sbb-checkbox>
  </sbb-selection-panel>
  <sbb-selection-panel ${sbbSpread(args)}>
    ${cardBadge()}
    <sbb-radio-button value="Value one" ?disabled=${disabledInput}>
      Value one ${suffixAndSubtext()}
    </sbb-radio-button>
  </sbb-selection-panel>
`;

const WithNoContentGroupTemplate = ({
  checkedInput,
  disabledInput,
  ...args
}: Args): TemplateResult => html`
  <sbb-radio-button-group orientation="vertical" horizontal-from="large">
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value one" ?disabled=${disabledInput}>
        Value one ${suffixAndSubtext()}
      </sbb-radio-button>
    </sbb-selection-panel>
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value two" ?checked=${checkedInput}>
        Value two ${suffixAndSubtext()}
      </sbb-radio-button>
    </sbb-selection-panel>
    <sbb-selection-panel ${sbbSpread(args)}>
      ${cardBadge()}
      <sbb-radio-button value="Value three"> Value three ${suffixAndSubtext()} </sbb-radio-button>
    </sbb-selection-panel>
  </sbb-radio-button-group>
`;

export const WithCheckbox: StoryObj = {
  render: WithCheckboxTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const WithRadioButton: StoryObj = {
  render: WithRadioButtonTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const WithCheckboxChecked: StoryObj = {
  render: WithCheckboxTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const WithRadioButtonChecked: StoryObj = {
  render: WithRadioButtonTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const WithCheckboxDisabled: StoryObj = {
  render: WithCheckboxTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabledInput: true },
};

export const WithRadioButtonDisabled: StoryObj = {
  render: WithRadioButtonTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, disabledInput: true },
};

export const WithCheckboxCheckedDisabled: StoryObj = {
  render: WithCheckboxTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true, disabledInput: true },
};

export const WithRadioButtonCheckedDisabled: StoryObj = {
  render: WithRadioButtonTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true, disabledInput: true },
};

export const WithCheckboxGroup: StoryObj = {
  render: WithCheckboxGroupTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true, disabledInput: true },
};

export const WithRadioButtonGroup: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true, disabledInput: true },
};

export const WithCheckboxGroupForceOpen: StoryObj = {
  render: WithCheckboxGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'force-open': true,
    checkedInput: true,
    disabledInput: true,
  },
};

export const WithRadioButtonGroupForceOpen: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'force-open': true,
    checkedInput: true,
    disabledInput: true,
  },
};

export const WithRadioButtonGroupAllowEmpty: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    allowEmptySelection: true,
    checkedInput: true,
    disabledInput: true,
  },
};

export const WithCheckboxGroupMilk: StoryObj = {
  render: WithCheckboxGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    color: color.options![1],
    checkedInput: true,
    disabledInput: true,
  },
};

export const WithRadioButtonGroupMilk: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    color: color.options![1],
    checkedInput: true,
    disabledInput: true,
  },
};

export const WithCheckboxBorderless: StoryObj = {
  render: WithCheckboxGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    checkedInput: true,
    disabledInput: true,
    borderless: true,
  },
};

export const WithRadioButtonBorderless: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    checkedInput: true,
    disabledInput: true,
    borderless: true,
  },
};

export const WithCheckboxGroupMilkBorderless: StoryObj = {
  render: WithCheckboxGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    color: color.options![1],
    checkedInput: true,
    disabledInput: true,
    borderless: true,
  },
};

export const WithRadioButtonGroupMilkBorderless: StoryObj = {
  render: WithRadioButtonGroupTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    color: color.options![1],
    checkedInput: true,
    disabledInput: true,
    borderless: true,
  },
};

export const WithCheckboxesErrorMessage: StoryObj = {
  render: WithCheckboxesErrorMessageTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'force-open': true,
    disabledInput: true,
  },
};

export const WithRadiosErrorMessage: StoryObj = {
  render: WithRadiosErrorMessageTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'force-open': true,
    disabledInput: true,
  },
};

export const WithNoContent: StoryObj = {
  render: WithNoContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const WithNoContentCheckedDisabled: StoryObj = {
  render: WithNoContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true, disabledInput: true },
};

export const WithNoContentGroup: StoryObj = {
  render: WithNoContentGroupTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const TicketsOptionsExample: StoryObj = {
  render: TicketsOptionsExampleTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const NestedRadios: StoryObj = {
  render: NestedRadioTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

export const NestedCheckboxes: StoryObj = {
  render: NestedCheckboxTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, checkedInput: true },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    chromatic: { delay: 9000, fixedHeight: '14500px' },
    actions: {
      handles: [
        SbbSelectionPanelElement.events.didOpen,
        SbbSelectionPanelElement.events.didClose,
        SbbSelectionPanelElement.events.willOpen,
        SbbSelectionPanelElement.events.willClose,
      ],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-selection-panel',
};

export default meta;
