import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbCardElement } from './card.js';

import './card.js';
import '../card-badge.js';

describe(`sbb-card`, () => {
  let element: SbbCardElement;

  beforeEach(async () => {
    // Note: for easier testing, we add the slot="badge"
    // to <sbb-card-badge> which would not be needed in real.
    element = await fixture(html`
      <sbb-card size="xl">
        <h2>Title</h2>
        Content text
        <sbb-card-badge slot="badge">
          <span>%</span>
          <span>from CHF</span>
          <span>19.99</span>
        </sbb-card-badge>
      </sbb-card>
    `);
  });

  it('should render with sbb-card-badge - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('should render with sbb-card-badge - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
