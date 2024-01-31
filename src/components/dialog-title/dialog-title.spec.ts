import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './dialog-title';

describe('sbb-dialog-title', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-title my-prop="Label"></sbb-dialog-title>`);

    expect(root).dom.to.be.equal(`<sbb-dialog-title my-prop="Label"></sbb-dialog-title>`);

    expect(root).shadowDom.to.be.equal(`
      <div class="sbb-dialog-title">
        Label
      </div>
    `);
  });
});
