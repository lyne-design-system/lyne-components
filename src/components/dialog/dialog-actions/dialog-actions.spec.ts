import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';
import './dialog-actions';

describe('sbb-dialog-actions', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-dialog-actions></sbb-dialog-actions>`);

    await expect(root).dom.to.equalSnapshot();

    expect(root).shadowDom.to.be.equal(`
      <div class="sbb-dialog-actions">
        <div class="sbb-action-group">
          <slot>
          </slot>
        </div>
      </div>
    `);
  });

  testA11yTreeSnapshot(html`<sbb-dialog-actions></sbb-dialog-actions>`);
});
