import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit/static-html.js';

import { SbbJourneySummaryElement } from './journey-summary.js';

describe(`sbb-journey-summary`, () => {
  it('renders', async () => {
    const element = await fixture(html`<sbb-journey-summary></sbb-journey-summary>`);
    assert.instanceOf(element, SbbJourneySummaryElement);
  });
});
