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
import { styleMap } from 'lit/directives/style-map.js';

import readme from './readme.md?raw';
import '../../form-field';
import './autocomplete-grid-optgroup';
import '../autocomplete-grid';
import '../autocomplete-grid-row';
import '../autocomplete-grid-option';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

const label: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Option group',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Option group',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Option',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Option',
  },
};

const disabledSingle: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Option',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Autocomplete',
  },
};

const numberOfOptions: InputType = {
  control: {
    type: 'number',
  },
};

const defaultArgTypes: ArgTypes = {
  label,
  'icon-name': iconName,
  value,
  disabled,
  disabledSingle,
  numberOfOptions,
  negative,
};

const defaultArgs: Args = {
  label: 'Option group',
  'icon-name': undefined,
  value: 'Option',
  disabled: false,
  disabledSingle: false,
  numberOfOptions: 3,
  negative: false,
};

const createOptions = (args: Args): TemplateResult[] =>
  new Array(args.numberOfOptions).fill(null).map((_, i) => {
    return html`
      <sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-option
          value=${`${args.value} ${i + 1}`}
          ?disabled=${args.disabledSingle && i === 0}
          icon-name=${args['icon-name'] || nothing}
          >${`${args.value} ${i + 1}`}</sbb-autocomplete-grid-option
        >
        <sbb-autocomplete-grid-actions>
          <sbb-autocomplete-grid-button
            icon-name="pie-small"
            ?disabled=${args.disabledSingle && i === 0}
          ></sbb-autocomplete-grid-button>
        </sbb-autocomplete-grid-actions>
      </sbb-autocomplete-grid-row>
    `;
  });

const TemplateOptgroup = ({ label, disabled, ...args }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-optgroup label=${label + ' 1'} ?disabled=${disabled}>
    ${createOptions(args)}
  </sbb-autocomplete-grid-optgroup>
  <sbb-autocomplete-grid-optgroup label=${label + ' 2'} ?disabled=${disabled}>
    ${createOptions(args)}
  </sbb-autocomplete-grid-optgroup>
`;

const Template = (args: Args): TemplateResult => {
  return html`
    <sbb-form-field ?negative=${args.negative}>
      <label>Autocomplete</label>
      <input placeholder="Placeholder" />
      <sbb-autocomplete-grid>${TemplateOptgroup(args)}</sbb-autocomplete-grid>
    </sbb-form-field>
  `;
};
export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

const meta: Meta = {
  decorators: [
    (story, context) => html`
      <div style=${styleMap({ ...wrapperStyle(context), padding: '2rem' })}>${story()}</div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid-optgroup',
};

export default meta;
