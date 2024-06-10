import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import { nothing, type TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';

import '../clock.js';
import '../button.js';
import '../divider.js';
import '../link.js';
import '../link-list.js';
import '../title.js';
import './footer.js';

const variant: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['default', 'clock-columns'],
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const accessibilityTitle: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  variant,
  negative,
  expanded,
  'accessibility-title': accessibilityTitle,
};

const defaultArgs: Args = {
  variant: variant.options![1],
  negative: false,
  expanded: false,
  'accessibility-title': 'Footer',
};

const TemplateDefault = (args: Args): TemplateResult => html`
  <sbb-footer ${sbbSpread(args)}>
    <sbb-link-list horizontal-from="large" ?negative=${args.negative}>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Refunds
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Lost property office
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Complaints
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Praise
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Report property damage
      </sbb-block-link>
    </sbb-link-list>
  </sbb-footer>
`;

const TemplateClockColumns = ({ ...args }): TemplateResult => html`
  <sbb-footer ${sbbSpread(args)}>
    <div class="sbb-link-list-button-group">
      <sbb-link-list title-level="2" title-content="Help &amp; Contact." ?negative=${args.negative}>
        <sbb-block-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          ?negative=${args.negative}
        >
          Refunds
        </sbb-block-link>
        <sbb-block-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          ?negative=${args.negative}
        >
          Lost property office
        </sbb-block-link>
        <sbb-block-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          ?negative=${args.negative}
        >
          Complaints
        </sbb-block-link>
        <sbb-block-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          ?negative=${args.negative}
        >
          Praise
        </sbb-block-link>
        <sbb-block-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          ?negative=${args.negative}
        >
          Report property damage
        </sbb-block-link>
      </sbb-link-list>
      <sbb-button-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        size="m"
      >
        All help topics
      </sbb-button-link>
    </div>
    <sbb-link-list title-level="2" title-content="More SBB." ?negative=${args.negative}>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Jobs & careers
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Rail traffic information
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        SBB News
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        SBB Community
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Company
      </sbb-block-link>
    </sbb-link-list>
    <div class="sbb-link-list-button-group">
      <span>
        <sbb-title
          level="2"
          visual-level="5"
          ?negative=${args.negative}
          style=${styleMap({ margin: '0 0 var(--sbb-spacing-fixed-3x)' })}
        >
          Newsletter.
        </sbb-title>
        <p style=${styleMap({ margin: '0' })}>
          Our newsletter regularly informs you of attractive offers from SBB via e-mail.
        </p>
      </span>
      <sbb-secondary-button-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        size="m"
      >
        Subscribe
      </sbb-secondary-button-link>
    </div>
    <sbb-clock now=${isChromatic() ? '01:59:27' : nothing}></sbb-clock>
    <sbb-divider ?negative=${args.negative}></sbb-divider>
    <sbb-link-list horizontal-from="large" ?negative=${args.negative}>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Refunds
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Lost property office
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Complaints
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Praise
      </sbb-block-link>
      <sbb-block-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        ?negative=${args.negative}
      >
        Report property damage
      </sbb-block-link>
    </sbb-link-list>
  </sbb-footer>
`;

/* ************************************************* */
/* The Stories                                       */
/* ************************************************* */

export const FooterClockColumns: StoryObj = {
  render: TemplateClockColumns,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const FooterClockColumnsNegative: StoryObj = {
  render: TemplateClockColumns,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    negative: true,
  },
};

export const FooterClockColumnsExpanded: StoryObj = {
  render: TemplateClockColumns,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true },
};

export const FooterDefault: StoryObj = {
  render: TemplateDefault,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    variant: variant.options![0],
  },
};

export const FooterDefaultNegative: StoryObj = {
  render: TemplateDefault,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    variant: variant.options![0],
    negative: true,
  },
};

export const FooterDefaultExpanded: StoryObj = {
  render: TemplateDefault,
  argTypes: defaultArgTypes,
  args: {
    ...defaultArgs,
    variant: variant.options![0],
    expanded: true,
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'elements/sbb-footer',
};

export default meta;
