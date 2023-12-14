import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../core/dom';

import readme from './readme.md?raw';
import './map-container';
import '../form-field';
import '../icon';
import '../title';
import '../header';

// FIXME remove before merge on main
import '../datepicker';

const hideScrollUpButton: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  'hide-scroll-up-button': hideScrollUpButton,
};

const defaultArgs: Args = {
  'hide-scroll-up-button': false,
};

const Template = (args): TemplateResult => html`
  <sbb-map-container ${sbbSpread(args)}>
    <div style=${styleMap({ padding: 'var(--sbb-spacing-fixed-4x)' })}>
      <sbb-form-field style=${styleMap({ width: '100%' })}>
        <!-- FIXME remove before merge on main -->
        <input />
        <sbb-datepicker wide></sbb-datepicker>
        <sbb-datepicker-toggle></sbb-datepicker-toggle>
        <!-- -->
      </sbb-form-field>
      <sbb-title level="4">Operations & Disruptions</sbb-title>
      ${[...Array(10).keys()].map(
        (value) => html`
          <div
            style=${styleMap({
              'background-color': 'var(--sbb-color-milk-default)',
              height: '116px',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'border-radius': 'var(--sbb-border-radius-4x)',
              'margin-block-end': 'var(--sbb-spacing-fixed-4x)',
            })}
          >
            <p>Situation ${value}</p>
          </div>
        `,
      )}
    </div>

    <div slot="map" style=${styleMap({ height: '100%' })}>
      <div
        style=${styleMap({
          'background-color': 'grey',
          height: '100%',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        })}
      >
        map
      </div>
    </div>
  </sbb-map-container>
`;

export const MapContainer: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
  },
};

const meta: Meta = {
  decorators: [
    (story) => html`
      <div>
        <sbb-header expanded hide-on-scroll>
          <sbb-header-action icon-name="hamburger-menu-small" expand-from="small">
            Menu
          </sbb-header-action>
        </sbb-header>
        ${story()}
      </div>
    `,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'components/sbb-map-container',
};

export default meta;
