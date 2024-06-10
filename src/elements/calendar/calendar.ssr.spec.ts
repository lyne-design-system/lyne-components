import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbCalendarElement } from './calendar.js';

describe(`sbb-calendar ${fixture.name}`, () => {
  let root: SbbCalendarElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-calendar now="2023-01-04T00:00:00" selected="2023-01-20T00:00:00"></sbb-calendar>`,
      { modules: ['./calendar.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbCalendarElement);
  });
});
