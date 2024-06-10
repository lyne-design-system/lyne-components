import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbToggleCheckElement } from './toggle-check.js';

import './toggle-check.js';

describe(`sbb-toggle-check`, () => {
  describe('should render', async () => {
    let element: SbbToggleCheckElement;

    beforeEach(async () => {
      element = await fixture(html`<sbb-toggle-check checked></sbb-toggle-check>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(html`<sbb-toggle-check></sbb-toggle-check>`);
});
