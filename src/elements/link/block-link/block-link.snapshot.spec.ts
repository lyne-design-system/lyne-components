import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbBlockLinkElement } from './block-link.js';

import './block-link.js';

describe(`sbb-block-link`, () => {
  let element: SbbBlockLinkElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-block-link
        href="https://github.com/sbb-design-systems/lyne-components"
        size="m"
        download
        accessibility-label="Travelcards &amp; tickets"
      >
        Travelcards &amp; tickets.
      </sbb-block-link>
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
