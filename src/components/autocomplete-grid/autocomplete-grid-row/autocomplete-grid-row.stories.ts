import { withActions } from '@storybook/addon-actions/decorator';
import type { Args, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import { sbbSpread } from '../../core/dom';

import readme from './readme.md?raw';

import './autocomplete-grid-row';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-option';
import '../../button/mini-button';

const Template = (args: Args): TemplateResult => html`
  <sbb-autocomplete-grid-row ${sbbSpread(args)}>
    <sbb-autocomplete-grid-option>Opt 1</sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions>
      <sbb-mini-button icon-name="pie-small"></sbb-mini-button>
    </sbb-autocomplete-grid-actions>
  </sbb-autocomplete-grid-row>
  <sbb-autocomplete-grid-row ${sbbSpread(args)}>
    <sbb-autocomplete-grid-option>Opt 2</sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions>
      <sbb-mini-button icon-name="dog-small"></sbb-mini-button>
    </sbb-autocomplete-grid-actions>
  </sbb-autocomplete-grid-row>
`;

export const Default: StoryObj = {
  render: Template,
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style="padding: 2rem;">${story()}</div> `,
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
