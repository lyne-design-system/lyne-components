import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbOverlayElement } from './overlay.js';

describe(`sbb-overlay ${fixture.name}`, () => {
  let root: SbbOverlayElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-overlay id="my-overlay-1" accessibility-label="Label">
          <p>Overlay content</p>
        </sbb-overlay>
      `,
      { modules: ['./overlay.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbOverlayElement);
  });
});
