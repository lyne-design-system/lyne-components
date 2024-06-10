import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbToggleElement } from './toggle.js';

import '../toggle-option.js';

describe(`sbb-toggle ${fixture.name}`, () => {
  let root: SbbToggleElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-toggle value="Value one">
          <sbb-toggle-option id="sbb-toggle-option-1" value="Value one">
            Value one
          </sbb-toggle-option>
          <sbb-toggle-option id="sbb-toggle-option-2" value="Value two">
            Value two
          </sbb-toggle-option>
        </sbb-toggle>
      `,
      { modules: ['./toggle.js', '../toggle-option.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbToggleElement);
  });
});
