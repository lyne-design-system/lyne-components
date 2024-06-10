import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbLinkStaticElement } from './link-static.js';

import './link-static.js';

describe(`sbb-link-static`, () => {
  let element: SbbLinkStaticElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-link-static size="m"> Travelcards &amp; tickets. </sbb-link-static>`,
    );
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
