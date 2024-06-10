import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import './expansion-panel-header.js';
import '../../icon.js';

describe(`sbb-expansion-panel-header`, () => {
  it('renders collapsed', async () => {
    const root = await fixture(
      html`<sbb-expansion-panel-header>Header</sbb-expansion-panel-header>`,
    );

    expect(root).dom.to.be.equal(
      `
        <sbb-expansion-panel-header slot='header' dir="ltr" role="button" slot="header" tabindex="0" data-slot-names="unnamed" data-action data-button>
          Header
        </sbb-expansion-panel-header>
      `,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with icon', async () => {
    const root = await fixture(
      html`<sbb-expansion-panel-header icon-name="pie-medium">Header</sbb-expansion-panel-header>`,
    );

    expect(root).dom.to.be.equal(
      `
        <sbb-expansion-panel-header
          slot='header'
          icon-name="pie-medium"
          dir="ltr"
          role="button"
          slot="header"
          tabindex="0"
          data-action
          data-button
          data-icon
          data-slot-names="unnamed"
        >
          Header
        </sbb-expansion-panel-header>
      `,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with slotted icon', async () => {
    const root = await fixture(html`
      <sbb-expansion-panel-header>
        <sbb-icon slot="icon" name="pie-medium"></sbb-icon>
        Header
      </sbb-expansion-panel-header>
    `);

    expect(root).dom.to.be.equal(
      `
        <sbb-expansion-panel-header slot='header' dir="ltr" role="button" slot="header" tabindex="0" data-icon data-slot-names="icon unnamed" data-action data-button>
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            role="img"
            slot='icon'
            name='pie-medium'></sbb-icon>
          Header
        </sbb-expansion-panel-header>
      `,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-expansion-panel-header>Header</sbb-expansion-panel-header>`);
});
