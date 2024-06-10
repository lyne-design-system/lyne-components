import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit';

import { SbbPearlChainElement } from './pearl-chain.js';

describe(`sbb-pearl-chain ${fixture.name}`, () => {
  let root: SbbPearlChainElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-pearl-chain></sbb-pearl-chain>`, {
      modules: ['./pearl-chain.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbPearlChainElement);
  });
});
