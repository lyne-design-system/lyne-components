import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbHeaderLinkElement } from './header-link.js';
import './header-link.js';

describe(`sbb-header-link`, () => {
  describe('renders the component as a button with icon', () => {
    let element: SbbHeaderLinkElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-header-link
          expand-from="small"
          href="https://github.com/sbb-design-systems/lyne-components"
          target="_blank"
          icon-name="pie-small"
          accessibility-label="a11y label"
          >Action</sbb-header-link
        >`,
      );
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
