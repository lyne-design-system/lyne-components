import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbNavigationListElement } from './navigation-list.js';

import './navigation-list.js';
import '../navigation-button.js';

describe(`sbb-navigation-list`, () => {
  let element: SbbNavigationListElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-navigation-list>
          <sbb-navigation-button>Tickets & Offers</sbb-navigation-button>
          <sbb-navigation-button>Vacations & Recreation</sbb-navigation-button>
          <sbb-navigation-button>Travel information</sbb-navigation-button>
          <sbb-navigation-button>Help & Contact</sbb-navigation-button>
        </sbb-navigation-list>`,
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

  describe('should render named slots if data-ssr-child-count attribute is set', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-navigation-list data-ssr-child-count="3"></sbb-navigation-list>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
