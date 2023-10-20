import { SbbDatepickerPreviousDay } from './sbb-datepicker-previous-day';

import '../sbb-form-field/sbb-form-field';
import '../sbb-datepicker/sbb-datepicker';

import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { SbbFormField } from '../sbb-form-field/sbb-form-field';

describe('sbb-datepicker-previous-day', () => {
  it('renders', async () => {
    const page: SbbDatepickerPreviousDay = await fixture(
      html`<sbb-datepicker-previous-day></sbb-datepicker-previous-day>`,
    );

    expect(page).dom.to.equal(`
      <sbb-datepicker-previous-day slot="prefix" dir="ltr" role="button" slot="prefix" tabindex="0"></sbb-datepicker-previous-day>
    `);

    expect(page).shadowDom.to.equal(`
    <span class="sbb-datepicker-previous-day">
      <sbb-icon name="chevron-small-left-small" />
    </span>`);
  });

  it('renders with datepicker and input disabled', async () => {
    const page: SbbFormField = await fixture(html`
      <sbb-form-field>
        <input disabled="" />
        <sbb-datepicker></sbb-datepicker>
        <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
      </sbb-form-field>
    `);

    const element: SbbDatepickerPreviousDay = page.querySelector('sbb-datepicker-previous-day');
    expect(element).to.have.attribute('data-disabled');
  });

  it('renders with datepicker and input readonly', async () => {
    const page: SbbFormField = await fixture(html`
      <sbb-form-field>
        <input readonly="" />
        <sbb-datepicker></sbb-datepicker>
        <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
      </sbb-form-field>
    `);

    const element: SbbDatepickerPreviousDay = page.querySelector('sbb-datepicker-previous-day');
    expect(element).to.have.attribute('data-disabled');
  });
});
