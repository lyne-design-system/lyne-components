import type { Args, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import readme from './readme.md?raw';
import '../pearl-chain-vertical.js';
import './pearl-chain-vertical-item.js';

const Template = (args: Args): TemplateResult => {
  return html`
    <sbb-pearl-chain-vertical>
      <sbb-pearl-chain-vertical-item .pearlChainVerticalItemAttributes=${args}>
        <div
          slot="right"
          style="--sbb-pearl-chain-vertical-right-item-block-start: -10px; --sbb-pearl-chain-vertical-right-item-inline-start: 10px;"
        >
          slot for content
          <div>more</div>
          <div>more</div>
          <div>more</div>
          <div>more</div>
          <div>more</div>
        </div>
      </sbb-pearl-chain-vertical-item>
    </sbb-pearl-chain-vertical>
  `;
};

export const pearlChainItem: StoryObj = {
  render: Template,
  args: {
    lineType: 'standard',
    lineColor: 'default',
    bulletType: 'default',
    minHeight: '100',
    hideLine: false,
    bulletSize: 'start-end',
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  argTypes: {
    lineType: {
      options: ['dotted', 'standard', 'thin'],
      control: { type: 'select' },
    },
    lineColor: {
      options: ['default', 'disruption', 'past', 'sky'],
      control: { type: 'select' },
    },
    bulletType: {
      options: ['default', 'disruption', 'past', 'irrelevant', 'skipped'],
      control: { type: 'select' },
    },
    bulletSize: {
      options: ['start-end', 'stop'],
      control: { type: 'select' },
    },
  },
  title: 'experimental/sbb-pearl-chain-vertical-item',
};

export default meta;
