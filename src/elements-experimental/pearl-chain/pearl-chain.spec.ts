import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit/static-html.js';

import { SbbPearlChainElement } from './pearl-chain.js';

describe(`sbb-pearl-chain`, () => {
  let element: SbbPearlChainElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-pearl-chain></sbb-pearl-chain>`);
    assert.instanceOf(element, SbbPearlChainElement);
  });
});
