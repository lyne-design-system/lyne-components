import type { Args, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './train-blocked-passage.js';

const Template = (args: Args): TemplateResult => html`
  <sbb-train-blocked-passage ${sbbSpread(args)}></sbb-train-blocked-passage>
`;

export const blockedPassage: StoryObj = {
  render: Template,
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/timetable/sbb-train-blocked-passage',
};

export default meta;
