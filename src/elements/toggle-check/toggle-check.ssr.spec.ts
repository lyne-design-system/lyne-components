import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbToggleCheckElement } from './toggle-check.js';

describe(`sbb-toggle-check ${fixture.name}`, () => {
  let root: SbbToggleCheckElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-toggle-check id="focus-id" name="name" value="value"></sbb-toggle-check>`,
      {
        modules: ['./toggle-check.js'],
      },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbToggleCheckElement);
  });
});
