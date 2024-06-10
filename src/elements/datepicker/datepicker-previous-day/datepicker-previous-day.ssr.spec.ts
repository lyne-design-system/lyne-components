import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDatepickerPreviousDayElement } from './datepicker-previous-day.js';

describe(`sbb-datepicker-previous-day ${fixture.name}`, () => {
  let root: SbbDatepickerPreviousDayElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-datepicker-previous-day></sbb-datepicker-previous-day>`, {
      modules: ['./datepicker-previous-day.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDatepickerPreviousDayElement);
  });
});
