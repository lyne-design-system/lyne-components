import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import type { SbbFormErrorElement } from '../../form-error.js';
import { SbbStepElement } from '../step.js';

import readme from './readme.md?raw';

import './stepper.js';
import '../step-label.js';
import '../../link/block-link-button.js';
import '../../button/button.js';
import '../../button/secondary-button.js';
import '../../form-field.js';
import '../../form-error.js';
import '../../card.js';

const linear: InputType = {
  control: {
    type: 'boolean',
  },
};

const orientation: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['horizontal', 'vertical'],
};

const horizontalFrom: InputType = {
  control: {
    type: 'select',
  },
  options: ['unset', 'zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const defaultArgTypes: ArgTypes = {
  linear,
  orientation,
  'horizontal-from': horizontalFrom,
};

const defaultArgs: Args = {
  linear: false,
  orientation: 'horizontal',
  'horizontal-from': 'unset',
};

const codeStyle: Args = {
  padding: 'var(--sbb-spacing-fixed-1x) var(--sbb-spacing-fixed-2x)',
  borderRadius: 'var(--sbb-border-radius-4x)',
  backgroundColor: 'var(--sbb-color-smoke-alpha-20)',
};

const textBlock = (): TemplateResult => html`
  <sbb-card color="milk" style="margin-block-start: var(--sbb-spacing-fixed-8x)">
    Page content: lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
  </sbb-card>
`;

const WithSingleFormTemplate = (args: Args): TemplateResult => {
  document.querySelector('sbb-stepper')?.reset();
  document.querySelector('sbb-form-error')?.remove();
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'This is a required field.';

  return html`
    <form
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        for (const [name, value] of formData) {
          document.querySelector(`.text-block-${name}`)!.textContent = value.toString();
        }
      }}
      @reset=${() => {
        // This is needed to focus and trigger again the error on the first field
        // when getting back to it after resetting the stepper.
        setTimeout(() =>
          document.querySelector('input[name="name"]')?.dispatchEvent(new Event('input')),
        );
      }}
    >
      <sbb-stepper ${sbbSpread(args)} aria-label="Purpose of this flow" selected-index="0">
        <sbb-step-label icon-name="pen-small">Step 1</sbb-step-label>
        <sbb-step
          @validate=${(e: CustomEvent) => {
            if (e.detail.currentStep.querySelector('sbb-form-field').hasAttribute('data-invalid')) {
              e.preventDefault();
            }
          }}
        >
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
            <sbb-form-field error-space="reserve" size="m">
              <label>Name</label>
              <input
                @input=${(event: KeyboardEvent) => {
                  const input = event.currentTarget as HTMLInputElement;
                  if (input.value !== '') {
                    sbbFormError.remove();
                    input.classList.remove('sbb-invalid');
                  } else {
                    input.closest('sbb-form-field')!.append(sbbFormError);
                    input.classList.add('sbb-invalid');
                  }
                }}
                required
                placeholder="Your name"
                name="name"
                value="Christina Müller"
              />
            </sbb-form-field>
          </div>
          <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
        </sbb-step>

        <sbb-step-label>Step 2</sbb-step-label>
        <sbb-step>
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
            <sbb-form-field error-space="none" size="m">
              <label>Favorite number</label>
              <input type="number" placeholder="Your lucky number" name="number" value="75" />
            </sbb-form-field>
          </div>
          <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
          <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
        </sbb-step>

        <sbb-step-label>
          <sbb-icon slot="icon" name="dog-small"></sbb-icon>
          Step 3
        </sbb-step-label>
        <sbb-step>
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
            <sbb-form-field error-space="none" size="m">
              <label>Favorite animal</label>
              <select name="animal">
                <option>Panda 🐼</option>
                <option>Jellyfish 🪼</option>
                <option>Fox 🦊</option>
                <option>Dragon 🐲</option>
              </select>
            </sbb-form-field>
          </div>
          <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
          <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
        </sbb-step>

        <sbb-step-label icon-name="tick-small">Step 4</sbb-step-label>
        <sbb-step>
          <div
            tabindex="0"
            class="sbb-focus-outline"
            style="margin-block-end: var(--sbb-spacing-fixed-4x)"
            aria-live="polite"
          >
            You are now done.
          </div>
          <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
          <sbb-button type="submit" size="m" sbb-stepper-next>Submit</sbb-button>
          <sbb-block-link-button
            type="reset"
            style="display: inline-block; margin-inline-start: var(--sbb-spacing-fixed-2x); vertical-align: middle;"
            icon-name="arrow-circle-small"
            @click=${() => document.querySelector('sbb-stepper')?.reset()}
            >Reset</sbb-block-link-button
          >
        </sbb-step>
      </sbb-stepper>
    </form>
    <sbb-card color="milk" style="margin-block-start: var(--sbb-spacing-fixed-8x)">
      Hi <code style=${styleMap(codeStyle)} class="text-block-name">&nbsp; &nbsp;</code>! 👋 Your
      lucky number is
      <code style=${styleMap(codeStyle)} class="text-block-number">&nbsp; &nbsp;</code> 🍀 and your
      favourite animal is
      <code style=${styleMap(codeStyle)} class="text-block-animal">&nbsp; &nbsp;</code>.
    </sbb-card>
  `;
};

const WithMultipleFormsTemplate = (args: Args): TemplateResult => {
  document.querySelector('sbb-stepper')?.reset();
  document.querySelector('sbb-form-error')?.remove();
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'This is a required field.';

  return html`
    <sbb-stepper ${sbbSpread(args)} aria-label="Purpose of this flow" selected-index="0">
      <sbb-step-label icon-name="pen-small">Step 1</sbb-step-label>
      <sbb-step
        @validate=${(e: CustomEvent) => {
          if (e.detail.currentStep.querySelector('sbb-form-field').hasAttribute('data-invalid')) {
            e.preventDefault();
          }
        }}
      >
        <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
          <form
            @reset=${() => {
              // This is needed to focus and trigger again the error on the first field
              // when getting back to it after resetting the stepper.
              setTimeout(() =>
                document.querySelector('input[name="name"]')?.dispatchEvent(new Event('input')),
              );
            }}
          >
            <sbb-form-field error-space="reserve" size="m">
              <label>Name</label>
              <input
                @input=${(event: KeyboardEvent) => {
                  const input = event.currentTarget as HTMLInputElement;
                  if (input.value !== '') {
                    sbbFormError.remove();
                    input.classList.remove('sbb-invalid');
                  } else {
                    input.closest('sbb-form-field')!.append(sbbFormError);
                    input.classList.add('sbb-invalid');
                  }
                }}
                required
                placeholder="Your name"
                name="name"
                value="Christina Müller"
              />
            </sbb-form-field>
          </form>
        </div>
        <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
      </sbb-step>

      <sbb-step-label>Step 2</sbb-step-label>
      <sbb-step>
        <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
          <form>
            <sbb-form-field error-space="none" size="m">
              <label>Favorite number</label>
              <input type="number" placeholder="Your lucky number" name="number" value="75" />
            </sbb-form-field>
          </form>
        </div>
        <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
        <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
      </sbb-step>

      <sbb-step-label icon-name="dog-small">Step 3</sbb-step-label>
      <sbb-step>
        <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
          <form>
            <sbb-form-field error-space="none" size="m">
              <label>Favorite animal</label>
              <select name="animal">
                <option>Panda 🐼</option>
                <option>Jellyfish 🪼</option>
                <option>Fox 🦊</option>
                <option>Dragon 🐲</option>
              </select>
            </sbb-form-field>
          </form>
        </div>
        <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
        <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
      </sbb-step>

      <sbb-step-label icon-name="tick-small">Step 4</sbb-step-label>
      <sbb-step>
        <div
          tabindex="0"
          class="sbb-focus-outline"
          style="margin-block-end: var(--sbb-spacing-fixed-4x)"
          aria-live="polite"
        >
          You are now done.
        </div>
        <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
        <sbb-button size="m" sbb-stepper-next>Submit</sbb-button>
        <sbb-block-link-button
          style="display: inline-block; margin-inline-start: var(--sbb-spacing-fixed-2x); vertical-align: middle;"
          icon-name="arrow-circle-small"
          @click=${() => document.querySelector('sbb-stepper')?.reset()}
          >Reset</sbb-block-link-button
        >
      </sbb-step>
    </sbb-stepper>
    ${textBlock()}
  `;
};

const Template = ({ disabled, ...args }: Args): TemplateResult => html`
  <sbb-stepper ${sbbSpread(args)} aria-label="Purpose of this flow" selected-index="0">
    <sbb-step-label>Step 1</sbb-step-label>
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        First step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
        eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
        sanctus est Lorem ipsum dolor sit amet.
      </div>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label>Step 2</sbb-step-label>
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Second step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
        vero eos et accusam et justo duo dolores et ea rebum.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label icon-name="tick-small" ?disabled=${disabled}>Step 3</sbb-step-label>
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Third step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label>Step 4</sbb-step-label>
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Forth step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
        eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
        sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
        elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
        diam voluptua.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Submit</sbb-button>
    </sbb-step>
  </sbb-stepper>
  ${textBlock()}
`;

const LongLabelsTemplate = (args: Args): TemplateResult => html`
  <sbb-stepper ${sbbSpread(args)} aria-label="Purpose of this flow" selected-index="0">
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</sbb-step-label
    >
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        First step content.
      </div>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
      tempor.</sbb-step-label
    >
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Second step content.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</sbb-step-label
    >
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Third step content.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
      tempor.</sbb-step-label
    >
    <sbb-step>
      <div
        tabindex="0"
        class="sbb-focus-outline"
        style="margin-block-end: var(--sbb-spacing-fixed-4x)"
      >
        Forth step content.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Submit</sbb-button>
    </sbb-step>
  </sbb-stepper>
  ${textBlock()}
`;

export const WithSingleForm: StoryObj = {
  render: WithSingleFormTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const WithMultipleForms: StoryObj = {
  render: WithMultipleFormsTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Linear: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, linear: true },
};

export const WithDisabledStep: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const Vertical: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, orientation: orientation.options![1] },
};

export const HorizontalFromSmall: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    orientation: orientation.options![1],
    'horizontal-from': horizontalFrom.options![3],
  },
};

export const LongLabels: StoryObj = {
  render: LongLabelsTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const LongLabelsVertical: StoryObj = {
  render: LongLabelsTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, orientation: orientation.options![1] },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: [SbbStepElement.events.validate],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-stepper/sbb-stepper',
};

export default meta;
