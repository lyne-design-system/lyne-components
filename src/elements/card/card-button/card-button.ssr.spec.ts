import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbCardElement } from '../card.js';

import { SbbCardButtonElement } from './card-button.js';

import '../card.js';

describe(`sbb-card-button ${fixture.name}`, () => {
  let root: SbbCardElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-card><sbb-card-button active>Click me</sbb-card-button>Content</sbb-card>`,
      { modules: ['../card.js', './card-button.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-card-button'), SbbCardButtonElement);
  });
});
