import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit';

import { SbbPearlChainTimeElement } from './pearl-chain-time.js';

const now = '2022-08-16T15:00:00Z';

describe(`sbb-pearl-chain-time ${fixture.name}`, () => {
  let root: SbbPearlChainTimeElement;

  beforeEach(async () => {
    root = await fixture<SbbPearlChainTimeElement>(
      html`
        <sbb-pearl-chain-time
          departure-time="2022-08-16T12:00:00"
          arrival-time="2022-08-16T15:00:00"
          now=${now}
        >
        </sbb-pearl-chain-time>
      `,
      { modules: ['./pearl-chain-time.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbPearlChainTimeElement);
  });
});
