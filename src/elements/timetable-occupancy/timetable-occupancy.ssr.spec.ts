import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbTimetableOccupancyElement } from './timetable-occupancy.js';

describe(`sbb-timetable-occupancy ${fixture.name}`, () => {
  let root: SbbTimetableOccupancyElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-timetable-occupancy first-class-occupancy="high"></sbb-timetable-occupancy> `,
      { modules: ['./timetable-occupancy.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTimetableOccupancyElement);
  });
});
