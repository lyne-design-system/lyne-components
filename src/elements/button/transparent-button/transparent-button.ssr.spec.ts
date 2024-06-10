import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTransparentButtonElement } from './transparent-button.js';

describe(`sbb-transparent-button ${fixture.name}`, () => {
  let root: SbbTransparentButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-transparent-button>Button</sbb-transparent-button>`, {
      modules: ['./transparent-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTransparentButtonElement);
  });
});
