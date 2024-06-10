import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbChipElement } from './chip.js';

describe(`sbb-chip ${fixture.name}`, () => {
  let root: SbbChipElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-chip>Label</sbb-chip>`, {
      modules: ['./chip.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbChipElement);
  });
});
