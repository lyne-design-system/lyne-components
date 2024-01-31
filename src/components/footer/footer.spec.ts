import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../core/testing/a11y-tree-snapshot';

import type { SbbFooterElement } from './footer';

import './footer';

describe('sbb-footer', () => {
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

  testA11yTreeSnapshot(undefined, html`<sbb-footer accessibility-title="Footer"></sbb-footer>`);
});
