import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDatepickerNextDayElement } from './datepicker-next-day.js';

describe(`sbb-datepicker-next-day ${fixture.name}`, () => {
  let root: SbbDatepickerNextDayElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-datepicker-next-day></sbb-datepicker-next-day>`, {
      modules: ['./datepicker-next-day.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDatepickerNextDayElement);
  });
});
