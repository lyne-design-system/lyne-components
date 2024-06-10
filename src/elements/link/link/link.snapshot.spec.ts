import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbLinkElement } from './link.js';

import './link.js';

describe(`sbb-link`, () => {
  let element: SbbLinkElement;

  beforeEach(async () => {
    element = await fixture(
      html` <sbb-link size="m" href="https://sbb.ch" target="_blank">
        Travelcards &amp; tickets.
      </sbb-link>`,
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
