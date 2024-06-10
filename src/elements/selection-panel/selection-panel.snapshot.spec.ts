import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbSelectionPanelElement } from './selection-panel.js';
import './selection-panel.js';
import '../card/card-badge.js';
import '../checkbox.js';

describe(`sbb-selection-panel`, () => {
  let element: SbbSelectionPanelElement;

  beforeEach(async () => {
    // Note: for easier testing, we add the slot="badge"
    // to <sbb-card-badge> which would not be needed in real.
    element = await fixture(html`
      <sbb-selection-panel>
        <sbb-card-badge slot="badge">
          <span>%</span>
          <span>from CHF</span>
          <span>19.99</span>
        </sbb-card-badge>
        <sbb-checkbox>
          Value one
          <span slot="subtext">Subtext</span>
          <span slot="suffix">Suffix</span>
        </sbb-checkbox>
        <div slot="content">Inner content</div>
      </sbb-selection-panel>
    `);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
