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
import { html, nothing, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { SbbAutocompleteGridOptionElement } from '../autocomplete-grid-option';

import { SbbAutocompleteGridElement } from './autocomplete-grid';
import readme from './readme.md?raw';
import '../autocomplete-grid-row';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';
import '../../form-field';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

const negative: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const readonly: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const preserveIconSpace: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form field',
  },
};

const floatingLabel: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Form field',
  },
};

const optionIconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Option',
  },
};

const buttonIconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const defaultArgTypes: ArgTypes = {
  // Form field args
  negative,
  borderless,
  floatingLabel,

  // Input args
  disabled,
  readonly,

  // Autocomplete args
  disableAnimation,
  preserveIconSpace,

  // Option args
  optionIconName,

  // Button args
  buttonIconName,
};

const defaultArgs: Args = {
  // Form field args
  negative: false,
  borderless: false,
  floatingLabel: false,

  // Input args
  disabled: false,
  readonly: false,

  // Autocomplete args
  disableAnimation: false,
  preserveIconSpace: true,

  // Option args
  optionIconName: 'clock-small',

  // Button args
  buttonIconName: 'pen-small',
};

const createRows1 = (optionIconName: string, buttonIconName: string): TemplateResult => html`
  ${repeat(
    new Array(3),
    (_, i: number) => html`
      <sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-option value=${`1-${i + 1}`} icon-name=${optionIconName || nothing}
          >${`Option 1-${i + 1}`}</sbb-autocomplete-grid-option
        >
        <sbb-autocomplete-grid-actions>
          <sbb-autocomplete-grid-button
            icon-name=${buttonIconName}
            aria-label=${buttonIconName}
          ></sbb-autocomplete-grid-button>
        </sbb-autocomplete-grid-actions>
      </sbb-autocomplete-grid-row>
    `,
  )}
`;

const createRows2 = (buttonIconName: string): TemplateResult => html`
  ${repeat(
    new Array(3),
    (_, i: number) => html`
      <sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-option value=${`2-${i + 1}`}
          >${`Option 2-${i + 1}`}</sbb-autocomplete-grid-option
        >
        <sbb-autocomplete-grid-actions>
          <sbb-autocomplete-grid-button
            icon-name=${buttonIconName}
            aria-label=${buttonIconName}
          ></sbb-autocomplete-grid-button>
          <sbb-autocomplete-grid-button
            icon-name="trash-small"
            aria-label="trash-small"
          ></sbb-autocomplete-grid-button>
        </sbb-autocomplete-grid-actions>
      </sbb-autocomplete-grid-row>
    `,
  )}
`;

const textBlockStyle: Args = {
  position: 'relative',
  marginBlockStart: '1rem',
  padding: '1rem',
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
    This text block has a <code style=${styleMap(codeStyle)}>z-index</code> greater than the form
    field, but it must always be covered by the autocomplete overlay.
  </div>
`;

const Template = (args: Args): TemplateResult => html`
  <div>
    <sbb-form-field
      label="Label"
      ?negative=${args.negative}
      ?borderless=${args.borderless}
      ?floating-label=${args.floatingLabel}
    >
      <input
        placeholder="Placeholder"
        data-testid="autocomplete-input"
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
      />
      <sbb-autocomplete-grid
        ?disable-animation=${args.disableAnimation}
        ?preserve-icon-space=${args.preserveIconSpace}
      >
        ${createRows1(args.optionIconName, args.buttonIconName)} ${createRows2(args.buttonIconName)}
      </sbb-autocomplete-grid>
    </sbb-form-field>
    ${textBlock()}
  </div>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

const meta: Meta = {
  decorators: [
    (story, context) => html`
      <div
        style=${styleMap({
          ...wrapperStyle(context),
          padding: '2rem',
          height: 'calc(100vh - 2rem)',
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
      handles: [
        SbbAutocompleteGridElement.events.willOpen,
        SbbAutocompleteGridElement.events.didOpen,
        SbbAutocompleteGridElement.events.didClose,
        SbbAutocompleteGridElement.events.willClose,
        'change',
        'click',
        SbbAutocompleteGridOptionElement.events.optionSelected,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      story: { inline: false, iframeHeight: '500px' },
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid',
};

export default meta;
