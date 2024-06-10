import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import type { SbbNavigationSectionElement } from './navigation-section.js';

import './navigation-section.js';

describe(`sbb-navigation-section`, () => {
  let element: SbbNavigationSectionElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-navigation-section></sbb-navigation-section>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
