import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import './navigation.js';
import '../navigation-button.js';
import '../navigation-marker.js';
import '../../button/button.js';
import type { SbbNavigationElement } from './navigation.js';

describe(`sbb-navigation`, () => {
  describe('renders', async () => {
    let element: SbbNavigationElement;

    beforeEach(async () => {
      const textFixture = await fixture(
        html`<div>
          <sbb-button id="nav-trigger">Navigation trigger</sbb-button>
          <sbb-navigation trigger="nav-trigger">
            <sbb-navigation-marker>
              <sbb-navigation-button id="nav-1">Tickets & Offers</sbb-navigation-button>
              <sbb-navigation-button id="nav-2">Vacations & Recreation</sbb-navigation-button>
            </sbb-navigation-marker>
          </sbb-navigation>
        </div> `,
      );
      element = textFixture.querySelector('sbb-navigation')!;
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
