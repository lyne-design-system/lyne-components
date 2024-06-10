import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import type { SbbToggleElement } from '../toggle.js';

import './toggle.js';
import '../toggle-option.js';

describe(`sbb-toggle`, () => {
  let element: SbbToggleElement;

  describe('renders', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-toggle>
          <sbb-toggle-option value="Value one">Value one</sbb-toggle-option>
          <sbb-toggle-option value="Value two">Value two</sbb-toggle-option>
        </sbb-toggle>`,
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
});
