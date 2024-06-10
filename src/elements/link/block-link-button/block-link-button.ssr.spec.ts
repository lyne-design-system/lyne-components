import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbBlockLinkButtonElement } from './block-link-button.js';

describe(`sbb-block-link-button ${fixture.name}`, () => {
  let root: SbbBlockLinkButtonElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-block-link-button
        icon-placement="end"
        size="m"
        negative
        name="name"
        type="submit"
        form="formid"
      >
        <sbb-icon name="chevron-small-right-small" slot="icon"></sbb-icon>
        Travelcards &amp; tickets.
      </sbb-block-link-button>`,
      { modules: ['./block-link-button.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbBlockLinkButtonElement);
  });
});
