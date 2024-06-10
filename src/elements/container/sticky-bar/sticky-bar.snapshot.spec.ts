import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import './sticky-bar.js';

describe(`sbb-sticky-bar`, () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-sticky-bar></sbb-sticky-bar>`);

    expect(root).dom.to.be.equal(`<sbb-sticky-bar slot="sticky-bar"></sbb-sticky-bar>`);

    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-sticky-bar></sbb-sticky-bar>`);
});
