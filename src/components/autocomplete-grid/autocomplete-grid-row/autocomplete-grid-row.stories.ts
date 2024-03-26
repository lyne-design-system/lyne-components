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
import { styleMap } from 'lit/directives/style-map.js';

import readme from './readme.md?raw';

import './autocomplete-grid-row';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-option';
import '../autocomplete-grid-button';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  negative,
};

const defaultArgs: Args = {
  negative: false,
};

const Template = ({ negative }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-row ?data-negative=${negative}>
    <sbb-autocomplete-grid-option>Opt 1</sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions>
      <sbb-autocomplete-grid-button
        icon-name="pie-small"
        ?negative=${negative}
      ></sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
  </sbb-autocomplete-grid-row>
  <sbb-autocomplete-grid-row ?data-negative=${negative}>
    <sbb-autocomplete-grid-option>Opt 2</sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions>
      <sbb-autocomplete-grid-button
        icon-name="dog-small"
        ?negative=${negative}
      ></sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
  </sbb-autocomplete-grid-row>
`;

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
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid-row',
};

export default meta;
