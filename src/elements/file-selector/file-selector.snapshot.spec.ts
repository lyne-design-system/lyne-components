import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';

import './file-selector.js';

describe(`sbb-file-selector`, () => {
  it('renders default', async () => {
    const root = await fixture(html`<sbb-file-selector></sbb-file-selector>`);

    expect(root).dom.to.be.equal(`
      <sbb-file-selector size='m'>
      </sbb-file-selector>
    `);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with dropzone area and size s', async () => {
    const root = await fixture(
      html`<sbb-file-selector variant="dropzone" size="s"></sbb-file-selector>`,
    );

    await waitForLitRender(root);

    expect(root).dom.to.be.equal(`
      <sbb-file-selector variant='dropzone' size='s'>
      </sbb-file-selector>
    `);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  // We skip safari because it has an inconsistent behavior on ci environment
  testA11yTreeSnapshot(html`<sbb-file-selector></sbb-file-selector>`, undefined, { safari: true });
});
