import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbLeadContainerElement } from './lead-container.js';

import '../image.js';

describe(`sbb-lead-container ${fixture.name}`, () => {
  let root: SbbLeadContainerElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-lead-container>
        <sbb-image slot="image"></sbb-image>
      </sbb-lead-container>`,
      { modules: ['./lead-container.js', '../image.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbLeadContainerElement);
  });
});
