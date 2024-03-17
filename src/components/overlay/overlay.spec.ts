import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../core/testing/a11y-tree-snapshot';

import '.';

describe('sbb-overlay', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-overlay></sbb-overlay>`);

    expect(root).dom.to.be.equal(`<sbb-overlay data-state="closed"></sbb-overlay>`);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-overlay></sbb-overlay>`);
});
