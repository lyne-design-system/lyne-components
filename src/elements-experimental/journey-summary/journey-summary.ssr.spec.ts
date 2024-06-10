import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit';

import { SbbJourneySummaryElement } from './journey-summary.js';

describe(`sbb-journey-summary ${fixture.name}`, () => {
  let root: SbbJourneySummaryElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-journey-summary></sbb-journey-summary>`, {
      modules: ['./journey-summary.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbJourneySummaryElement);
  });
});
