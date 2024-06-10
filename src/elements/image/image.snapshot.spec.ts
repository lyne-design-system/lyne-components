import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { waitForImageReady } from '../core/testing.js';

import { SbbImageElement } from './image.js';

const imageUrl = import.meta.resolve('../clock/assets/sbb_clock_face.svg');

describe(`sbb-image`, () => {
  let element: SbbImageElement;

  describe('should render', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-image image-src=${imageUrl}></sbb-image>`);
      await waitForImageReady(element);

      assert.instanceOf(element, SbbImageElement);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['image-src'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot({
        ignoreAttributes: ['src', 'srcset', 'fetchpriority'],
      });
    });
  });
});
