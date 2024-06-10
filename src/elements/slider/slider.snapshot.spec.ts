import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbSliderElement } from './slider.js';

import './slider.js';

describe(`sbb-slider`, () => {
  let element: SbbSliderElement;

  describe('should render', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-slider value="1"></sbb-slider>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('should render with properties', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-slider
          start-icon="walk-slow-small"
          end-icon="walk-fast-small"
          min="0"
          max="500"
          value="100"
        ></sbb-slider>`,
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

  describe('should render disabled', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-slider
          start-icon="walk-slow-small"
          end-icon="walk-fast-small"
          min="0"
          max="500"
          value="100"
          disabled
        ></sbb-slider>`,
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

  describe('should render readonly', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-slider
          start-icon="walk-slow-small"
          end-icon="walk-fast-small"
          min="0"
          max="500"
          value="100"
          readonly
        ></sbb-slider>`,
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
