import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbSelectElement } from './select.js';
import '../option.js';

describe(`sbb-select ${fixture.name}`, () => {
  let root: SbbSelectElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-select placeholder="Placeholder">
          <sbb-option id="option-1" value="1">First</sbb-option>
          <sbb-option id="option-2" value="2">Second</sbb-option>
          <sbb-option id="option-3" value="3">Third</sbb-option>
        </sbb-select>
      `,
      { modules: ['./select.js', '../option.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbSelectElement);
  });
});
