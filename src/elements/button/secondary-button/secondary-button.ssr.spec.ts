import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbSecondaryButtonElement } from './secondary-button.js';

describe(`sbb-secondary-button ${fixture.name}`, () => {
  let root: SbbSecondaryButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-secondary-button>Button</sbb-secondary-button>`, {
      modules: ['./secondary-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbSecondaryButtonElement);
  });
});
