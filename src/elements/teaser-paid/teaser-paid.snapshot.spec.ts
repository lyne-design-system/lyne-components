import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import './teaser-paid.js';

import type { SbbTeaserPaidElement } from './teaser-paid.js';

describe(`sbb-teaser-paid`, () => {
  let element: SbbTeaserPaidElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-teaser-paid
        accessibility-label="label"
        href="https://www.sbb.ch"
        rel="external"
        target="_blank"
      ></sbb-teaser-paid>`,
    );
  });

  it('DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
