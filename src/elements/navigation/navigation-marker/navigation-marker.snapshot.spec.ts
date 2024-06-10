import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import type { SbbNavigationMarkerElement } from './navigation-marker.js';

import './navigation-marker.js';

describe(`sbb-navigation-marker`, () => {
  let element: SbbNavigationMarkerElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-navigation-marker size="l"></sbb-navigation-marker>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
