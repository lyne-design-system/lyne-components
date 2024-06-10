import { expect } from '@open-wc/testing';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { buttonSlottedIconTestTemplate, buttonTestTemplate } from '../common/button-test-utils.js';

import type { SbbSecondaryButtonStaticElement } from './secondary-button-static.js';
import './secondary-button-static.js';

describe(`sbb-secondary-button-static`, () => {
  let element: SbbSecondaryButtonStaticElement;

  describe('renders a sbb-secondary-button-static without icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonTestTemplate('sbb-secondary-button-static', true));
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders a sbb-secondary-button-static with slotted icon', async () => {
    beforeEach(async () => {
      element = await fixture(buttonSlottedIconTestTemplate('sbb-secondary-button-static'));
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
