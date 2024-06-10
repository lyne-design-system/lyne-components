import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbButtonElement } from './button.js';

describe(`sbb-button ${fixture.name}`, () => {
  let root: SbbButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-button>I am a button</sbb-button>`, {
      modules: ['./button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbButtonElement);
  });
});
