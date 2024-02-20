import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import '.';

describe('sbb-dialog', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog></sbb-dialog>`);

    expect(root).dom.to.be.equal(`<sbb-dialog data-state="closed"></sbb-dialog>`);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-dialog></sbb-dialog>`);
});
