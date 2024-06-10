import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbSliderElement } from './slider.js';

describe(`sbb-slider ${fixture.name}`, () => {
  let root: SbbSliderElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-slider
          start-icon="walk-slow-small"
          end-icon="walk-fast-small"
          max="500"
          min="100"
          value="400"
        ></sbb-slider>
      `,
      { modules: ['./slider.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbSliderElement);
  });
});
