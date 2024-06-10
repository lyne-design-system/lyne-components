import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonSlottedIconTestTemplate, buttonTestTemplate } from '../common/button-test-utils.js';

import type { SbbTertiaryButtonElement } from './tertiary-button.js';
import './tertiary-button.js';

describe(`sbb-tertiary-button`, () => {
  let element: SbbTertiaryButtonElement;

  describe('renders a sbb-tertiary-button without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonTestTemplate('sbb-tertiary-button'));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders a sbb-tertiary-button with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonSlottedIconTestTemplate('sbb-tertiary-button'));
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
