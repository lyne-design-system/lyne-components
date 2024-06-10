import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbNavigationButtonElement } from './navigation-button.js';

import './navigation-button.js';

describe(`sbb-navigation-button`, () => {
  let element: SbbNavigationButtonElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-navigation-button>Button</sbb-navigation-button>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });
});
