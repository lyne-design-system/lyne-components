import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit';

import { SbbPearlChainVerticalItemElement } from './pearl-chain-vertical-item.js';

describe(`sbb-pearl-chain-vertical-item ${fixture.name}`, () => {
  let root: SbbPearlChainVerticalItemElement;

  beforeEach(async () => {
    root = await fixture<SbbPearlChainVerticalItemElement>(
      html`<sbb-pearl-chain-vertical-item></sbb-pearl-chain-vertical-item>`,
      { modules: ['./pearl-chain-vertical-item.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbPearlChainVerticalItemElement);
  });
});
