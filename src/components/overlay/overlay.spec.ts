import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../core/testing';
import { fixture, testA11yTreeSnapshot } from '../core/testing/private';

import type { SbbOverlayElement } from './overlay';
import './overlay';

describe('sbb-overlay', () => {
  let root: SbbOverlayElement;
  beforeEach(async () => {
    root = await fixture(html`<sbb-overlay disable-animation></sbb-overlay>`);
    root.open();
    await waitForLitRender(root);
  });
  it('renders - Dom', async () => {
    await expect(root).dom.to.be.equalSnapshot();
  });
  it('renders - ShadowDom', async () => {
    await expect(root).shadowDom.to.be.equalSnapshot();
  });
  testA11yTreeSnapshot();
});
