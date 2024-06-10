import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTertiaryButtonElement } from './tertiary-button.js';

describe(`sbb-tertiary-button ${fixture.name}`, () => {
  let root: SbbTertiaryButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-tertiary-button>Button</sbb-tertiary-button>`, {
      modules: ['./tertiary-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTertiaryButtonElement);
  });
});
