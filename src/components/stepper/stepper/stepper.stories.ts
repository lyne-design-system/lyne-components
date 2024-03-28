import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../core/dom';
import type { SbbFormErrorElement } from '../../form-error';
import { SbbStepElement } from '../step';

import readme from './readme.md?raw';

import './stepper';
import '../step-label';
import '../../link/block-link-button';
import '../../button/button';
import '../../button/secondary-button';
import '../../form-field';
import '../../form-error';

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

const textBlockStyle: Args = {
  position: 'relative',
  marginBlockStart: 'var(--sbb-spacing-fixed-8x)',
  padding: 'var(--sbb-spacing-fixed-4x)',
  backgroundColor: 'var(--sbb-color-milk)',
  border: 'var(--sbb-border-width-1x) solid var(--sbb-color-cloud)',
  borderRadius: 'var(--sbb-border-radius-4x)',
  zIndex: '100',
};

const codeStyle: Args = {
  padding: 'var(--sbb-spacing-fixed-1x) var(--sbb-spacing-fixed-2x)',
  borderRadius: 'var(--sbb-border-radius-4x)',
  backgroundColor: 'var(--sbb-color-smoke-alpha-20)',
};

const textBlock = (): TemplateResult => html`
  <div style=${styleMap(textBlockStyle)}>
    Page content: lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
  </div>
`;

const WithSingleFormTemplate = (args: Args): TemplateResult => {
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
            <sbb-form-field error-space="reserve" label="Name" size="m">
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
                placeholder="Your name"
                name="name"
                class="sbb-invalid"
              />
              ${sbbFormError}
            </sbb-form-field>
          </div>
          <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
        </sbb-step>

        <sbb-step-label>Step 2</sbb-step-label>
        <sbb-step>
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
            <sbb-form-field error-space="none" label="Favorite number" size="m">
              <input type="number" placeholder="Your lucky number" name="number" value="75" />
            </sbb-form-field>
          </div>
          <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
          <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
        </sbb-step>

        <sbb-step-label icon-name="dog-small">Step 3</sbb-step-label>
        <sbb-step>
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
            <sbb-form-field error-space="none" label="Favorite animal" size="m">
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
          <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">You are now done.</div>
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
    <div style=${styleMap(textBlockStyle)}>
      Hi <code style=${styleMap(codeStyle)} class="text-block-name">&nbsp; &nbsp;</code>! 👋 Your
      lucky number is
      <code style=${styleMap(codeStyle)} class="text-block-number">&nbsp; &nbsp;</code> 🍀 and your
      favourite animal is
      <code style=${styleMap(codeStyle)} class="text-block-animal">&nbsp; &nbsp;</code>.
    </div>
  `;
};

const WithMultipleFormsTemplate = (args: Args): TemplateResult => {
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
              setTimeout(() =>
                document.querySelector('input[name="name"]')?.dispatchEvent(new Event('input')),
              );
            }}
          >
            <sbb-form-field error-space="reserve" label="Name" size="m">
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
                placeholder="Your name"
                name="name"
                class="sbb-invalid"
              />
              ${sbbFormError}
            </sbb-form-field>
          </form>
        </div>
        <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
      </sbb-step>

      <sbb-step-label>Step 2</sbb-step-label>
      <sbb-step>
        <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
          <form>
            <sbb-form-field error-space="none" label="Favorite number" size="m">
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
            <sbb-form-field error-space="none" label="Favorite animal" size="m">
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
        <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">You are now done.</div>
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

const Template = (args: Args): TemplateResult => html`
  <sbb-stepper ${sbbSpread(args)} aria-label="Purpose of this flow" selected-index="0">
    <sbb-step-label>Step 1</sbb-step-label>
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
        First step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
        eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
        sanctus est Lorem ipsum dolor sit amet.
      </div>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label>Step 2</sbb-step-label>
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
        Second step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
        vero eos et accusam et justo duo dolores et ea rebum.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label icon-name="tick-small">Step 3</sbb-step-label>
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
        Third step content: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
      </div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>

    <sbb-step-label>Step 4</sbb-step-label>
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">
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
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">First step content.</div>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
      tempor.</sbb-step-label
    >
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">Second step content.</div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</sbb-step-label
    >
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">Third step content.</div>
      <sbb-secondary-button size="m" sbb-stepper-previous>Back</sbb-secondary-button>
      <sbb-button size="m" sbb-stepper-next>Next</sbb-button>
    </sbb-step>
    <sbb-step-label
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
      tempor.</sbb-step-label
    >
    <sbb-step>
      <div style="margin-block-end: var(--sbb-spacing-fixed-4x)">Forth step content.</div>
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

export const Vertical: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, orientation: orientation.options[1] },
};

export const HorizontalFromSmall: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    orientation: orientation.options[1],
    'horizontal-from': horizontalFrom.options[3],
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
  args: { ...defaultArgs, orientation: orientation.options[1] },
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style="padding: 2rem;">${story()}</div> `,
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: [SbbStepElement.events.validate],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-stepper/sbb-stepper',
};

export default meta;
