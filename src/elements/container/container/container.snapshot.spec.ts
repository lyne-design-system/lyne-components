import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import './container.js';

describe(`sbb-container`, () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-container></sbb-container>`);

    expect(root).dom.to.be.equal(`<sbb-container color="white"></sbb-container>`);

    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-container></sbb-container>`);
});
