import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonSlottedIconTestTemplate, buttonTestTemplate } from '../common/button-test-utils.js';

import type { SbbTransparentButtonElement } from './transparent-button.js';
import './transparent-button.js';

describe(`sbb-transparent-button`, () => {
  let element: SbbTransparentButtonElement;

  describe('renders a sbb-transparent-button without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonTestTemplate('sbb-transparent-button'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders a sbb-transparent-button with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonSlottedIconTestTemplate('sbb-transparent-button'));
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
