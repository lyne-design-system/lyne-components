import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './dialog-title';

describe('sbb-dialog-title', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-title>Title</sbb-dialog-title>`);

    expect(root).dom.to.be.equal(`
      <sbb-dialog-title
       aria-level="2"
       level="2"
       role="heading"
       slot="title"
       visual-level="3">Title</sbb-dialog-title>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });
});
