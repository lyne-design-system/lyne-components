import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbMenuButtonElement } from './menu-button.js';

import './menu-button.js';

describe(`sbb-menu-button`, () => {
  describe('renders', () => {
    let element: SbbMenuButtonElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-menu-button form="formid" name="name" type="submit" aria-label="a11y label">
          <span>Action</span>
        </sbb-menu-button>
      `);
    });

    it('Light DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders component with icon and amount', () => {
    let element: SbbMenuButtonElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-menu-button icon-name="menu-small" amount="123456">
          <span>Action</span>
        </sbb-menu-button>
      `);
    });

    it('Light DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
