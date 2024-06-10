import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbBlockLinkStaticElement } from './block-link-static.js';

describe(`sbb-block-link-static ${fixture.name}`, () => {
  let root: SbbBlockLinkStaticElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-block-link-static icon-placement="end" size="m">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="chevron-small-right-small"
          role="img"
          slot="icon"
        ></sbb-icon>
        Travelcards &amp; tickets.
      </sbb-block-link-static>`,
      { modules: ['./block-link-static.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbBlockLinkStaticElement);
  });
});
