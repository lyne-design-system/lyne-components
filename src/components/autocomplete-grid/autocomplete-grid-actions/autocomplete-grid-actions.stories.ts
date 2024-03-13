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
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../core/dom';

import readme from './readme.md?raw';
import './autocomplete-grid-actions';
import '../autocomplete-grid-button';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
});

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

const defaultArgTypes: ArgTypes = {
  numberOfButtons,
  negative,
};

const defaultArgs: Args = {
  numberOfButtons: 1,
  negative: false,
};

const Template = ({ numberOfButtons, ...args }: Args): TemplateResult => html`
  <sbb-autocomplete-grid-actions>
    ${repeat(
      new Array(numberOfButtons),
      (_, i) => html`
        <sbb-autocomplete-grid-button
          ${sbbSpread(args)}
          icon-name=${i === 0 ? 'pen-small' : i === 1 ? 'trash-small' : 'rss-small'}
        ></sbb-autocomplete-grid-button>
      `,
    )}
  </sbb-autocomplete-grid-actions>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Multiple: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfButtons: 3 },
};

const meta: Meta = {
  decorators: [
    (story, context) => html`
      <div style=${styleMap({ ...wrapperStyle(context), padding: '2rem' })}>${story()}</div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: ['click'],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid-actions',
};

export default meta;
