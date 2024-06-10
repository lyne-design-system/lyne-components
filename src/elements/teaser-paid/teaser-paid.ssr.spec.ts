import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbTeaserPaidElement } from './teaser-paid.js';

import '../chip.js';
import '../image.js';

describe(`sbb-teaser-paid ${fixture.name}`, () => {
  let root: SbbTeaserPaidElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-teaser-paid>
          <sbb-chip slot="chip">Label</sbb-chip>
          <sbb-image slot="image"></sbb-image>
        </sbb-teaser-paid>
      `,
      { modules: ['./teaser-paid.js', '../chip.js', '../image.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTeaserPaidElement);
  });
});
