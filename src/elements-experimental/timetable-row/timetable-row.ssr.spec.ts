import { assert } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit';

import { SbbTimetableRowElement } from './timetable-row.js';

describe(`sbb-timetable-row ${fixture.name}`, () => {
  let root: SbbTimetableRowElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-timetable-row></sbb-timetable-row>`, {
      modules: ['./timetable-row.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTimetableRowElement);
  });
});
