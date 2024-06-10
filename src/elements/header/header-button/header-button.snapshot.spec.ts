import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbHeaderButtonElement } from './header-button.js';
import './header-button.js';

describe(`sbb-header-button`, () => {
  describe('renders the component as a button with icon', () => {
    let element: SbbHeaderButtonElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-header-button
          icon-name="pie-small"
          name="test"
          type="reset"
          value="value"
          expand-from="zero"
          aria-label="a11y label"
        >
          Action
        </sbb-header-button>
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
});
