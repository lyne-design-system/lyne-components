import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonSlottedIconTestTemplate, buttonTestTemplate } from '../common/button-test-utils.js';

import type { SbbTertiaryButtonStaticElement } from './tertiary-button-static.js';
import './tertiary-button-static.js';

describe(`sbb-tertiary-button-static`, () => {
  let element: SbbTertiaryButtonStaticElement;

  describe('renders a sbb-secondary-button-static without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonTestTemplate('sbb-tertiary-button-static', true));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders a sbb-tertiary-button-static with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonSlottedIconTestTemplate('sbb-tertiary-button-static'));
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
