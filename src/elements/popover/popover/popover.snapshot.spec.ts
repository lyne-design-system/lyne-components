import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import './popover.js';

describe(`sbb-popover`, () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-popover></sbb-popover>`);

    expect(root).dom.to.be.equal(
      `<sbb-popover data-state="closed" id="sbb-popover-1"></sbb-popover>`,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-popover></sbb-popover>`);
});
