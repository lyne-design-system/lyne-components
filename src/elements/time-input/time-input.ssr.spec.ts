import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbTimeInputElement } from './time-input.js';

describe(`sbb-time-input ${fixture.name}`, () => {
  let root: SbbTimeInputElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-time-input input="input-1"></sbb-time-input>
        <input id="input-1" />
      `,
      { modules: ['./time-input.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTimeInputElement);
  });
});
