import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './dialog-title';

describe('sbb-dialog-title', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-title>Title</sbb-dialog-title>`);

    expect(root).dom.to.be.equal(`
      <sbb-dialog-title
       aria-level="1"
       level="1"
       role="heading"
       slot="title"
       visual-level="3">Title</sbb-dialog-title>
    `);

    expect(root).shadowDom.to.be.equal(`
      <div class="sbb-dialog__header">
        <h1 class="sbb-title" role="presentation">
          <slot></slot>
        </h1>
        <sbb-button
          aria-label="Close secondary window"
          class="sbb-dialog__close"
          dir="ltr"
          icon-name="cross-small"
          role="button"
          sbb-dialog-close=""
          size="m"
          tabindex="0"
          type="button"
          variant="secondary"
        ></sbb-button>
      </div>
    `);
  });
});
