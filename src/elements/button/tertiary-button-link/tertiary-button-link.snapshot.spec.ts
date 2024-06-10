import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonLinkIconTestTemplate, buttonLinkTestTemplate } from '../common/button-test-utils.js';

import type { SbbTertiaryButtonLinkElement } from './tertiary-button-link.js';
import './tertiary-button-link.js';

describe(`sbb-tertiary-button-link`, () => {
  let element: SbbTertiaryButtonLinkElement;

  describe('renders a sbb-tertiary-button-link without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonLinkTestTemplate('sbb-tertiary-button-link'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders a disabled sbb-tertiary-button-link with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonLinkIconTestTemplate('sbb-tertiary-button-link'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
