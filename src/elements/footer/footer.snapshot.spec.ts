import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbFooterElement } from './footer.js';

import './footer.js';

describe(`sbb-footer`, () => {
  it('renders', async () => {
    const element: SbbFooterElement = await fixture(
      html`<sbb-footer accessibility-title="Footer"></sbb-footer>`,
    );

    expect(element).dom.to.be.equal(
      `
        <sbb-footer accessibility-title="Footer" variant="default"></sbb-footer>
      `,
    );
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-footer accessibility-title="Footer"></sbb-footer>`);
});
