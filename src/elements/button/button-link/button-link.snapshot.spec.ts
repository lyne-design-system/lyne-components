import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonLinkIconTestTemplate, buttonLinkTestTemplate } from '../common/button-test-utils.js';

import type { SbbButtonLinkElement } from './button-link.js';
import './button-link.js';

describe(`sbb-button-link`, () => {
  let element: SbbButtonLinkElement;

  describe('renders a sbb-button-link without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonLinkTestTemplate('sbb-button-link'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders a disabled sbb-button-link with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonLinkIconTestTemplate('sbb-button-link'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
