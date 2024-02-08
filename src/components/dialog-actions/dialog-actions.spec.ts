import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './dialog-actions';

describe('sbb-dialog-actions', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-actions></sbb-dialog-actions>`);

    expect(root).dom.to.be.equal(`
      <sbb-dialog-actions
        align-group="start"
        button-size="l"
        horizontal-from="medium"
        link-size="m"
        orientation="horizontal"
        slot="actions"
      ></sbb-dialog-actions>
    `);

    expect(root).shadowDom.to.be.equal(`
      <div class="sbb-dialog-actions">
        <div class="sbb-action-group">
          <slot>
          </slot>
        </div>
      </div>
    `);
  });
});
