import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbScreenReaderOnlyElement } from './screen-reader-only.js';

import './screen-reader-only.js';

describe(`sbb-screen-reader-only`, () => {
  describe('renders', async () => {
    let root: SbbScreenReaderOnlyElement;

    beforeEach(async () => {
      root = await fixture(html`<sbb-screen-reader-only></sbb-screen-reader-only>`);
    });

    it('with Light DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('with Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });
});
