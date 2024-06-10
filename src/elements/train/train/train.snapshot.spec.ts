import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import type { SbbTrainElement } from './train.js';

import './train.js';

describe(`sbb-train`, () => {
  let element: SbbTrainElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-train direction-label="Driving direction" station="Bern"></sbb-train>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
