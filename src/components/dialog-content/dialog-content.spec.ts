import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './dialog-content';

describe('sbb-dialog-content', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-content my-prop="Label"></sbb-dialog-content>`);

    expect(root).dom.to.be.equal(`<sbb-dialog-content my-prop="Label"></sbb-dialog-content>`);

    expect(root).shadowDom.to.be.equal(`
      <div class="sbb-dialog-content">
        Label
      </div>
    `);
  });
});
