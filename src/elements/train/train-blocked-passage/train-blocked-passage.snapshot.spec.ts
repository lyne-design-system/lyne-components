import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import './train-blocked-passage.js';

describe(`sbb-train-blocked-passage`, () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-train-blocked-passage></sbb-train-blocked-passage>`);

    expect(root).dom.to.be.equal(
      `
        <sbb-train-blocked-passage>
        </sbb-train-blocked-passage>
      `,
    );
    expect(root).shadowDom.to.be.equal(
      `
        <span class="sbb-train-blocked-passage">
          <span class="sbb-train-blocked-passage__wrapper">
            <span class="sbb-train-blocked-passage__icon"></span>
          </span>
        </span>
      `,
    );
  });
});
