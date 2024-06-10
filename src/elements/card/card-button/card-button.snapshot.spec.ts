import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import type { SbbCardElement } from '../card.js';

import '../card.js';
import './card-button.js';

describe(`sbb-card-button`, () => {
  let element: SbbCardElement;

  describe('renders', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-card><sbb-card-button active>Click me</sbb-card-button>Content</sbb-card>`,
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
