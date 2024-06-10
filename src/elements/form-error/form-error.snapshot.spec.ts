import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbFormErrorElement } from './form-error.js';

import './form-error.js';

describe(`sbb-form-error`, () => {
  let element: SbbFormErrorElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-form-error>Required</sbb-form-error>`);
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
