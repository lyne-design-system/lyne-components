import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbCardElement } from '../card.js';

import { SbbCardLinkElement } from './card-link.js';

import '../card.js';

describe(`sbb-card-link ${fixture.name}`, () => {
  let root: SbbCardElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-card>
          <sbb-card-link
            href="https://github.com/sbb-design-systems/lyne-components"
            target="_blank"
            >Follow me</sbb-card-link
          >
          Content text
        </sbb-card>
      `,
      { modules: ['../card.js', './card-link.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-card-link'), SbbCardLinkElement);
  });
});
