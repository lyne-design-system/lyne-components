import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isFirefox } from '../core/dom.js';
import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';
import { describeIf } from '../core/testing.js';

import type { SbbToastElement } from './toast.js';

import './toast.js';

describe(`sbb-toast`, () => {
  describe('renders', () => {
    let elem: SbbToastElement;

    beforeEach(async () => {
      elem = await fixture(html`
        <sbb-toast icon-name="circle-tick-small" dismissible> 'Lorem ipsum dolor' </sbb-toast>
      `);
    });

    describeIf(!isFirefox, 'Chrome-Safari', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    describeIf(isFirefox, 'Firefox', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    testA11yTreeSnapshot();
  });
});
