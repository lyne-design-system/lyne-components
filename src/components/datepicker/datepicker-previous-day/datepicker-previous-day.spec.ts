import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';
import type { SbbFormFieldElement } from '../../form-field';

import type { SbbDatepickerPreviousDayElement } from './datepicker-previous-day';

import '../datepicker';
import './datepicker-previous-day';

describe('sbb-datepicker-previous-day', () => {
  it('renders', async () => {
    const page: SbbDatepickerPreviousDayElement = await fixture(
      html`<sbb-datepicker-previous-day></sbb-datepicker-previous-day>`,
    );

    await expect(page).dom.to.equalSnapshot();

    expect(page).shadowDom.to.equal(`
      <span class="sbb-datepicker-previous-day">
        <sbb-icon aria-hidden="true" data-namespace="default" name="chevron-small-left-small" role="img"></sbb-icon>
      </span>
    `);
  });

  it('renders with connected datepicker', async () => {
    const page = await fixture(html`
      <div>
        <input id="datepicker-input" value="31-12-2022" />
        <sbb-datepicker-previous-day date-picker="datepicker"></sbb-datepicker-previous-day>
        <sbb-datepicker id="datepicker" input="datepicker-input"></sbb-datepicker>
      </div>
    `);

    const element: SbbDatepickerPreviousDayElement =
      page.querySelector<SbbDatepickerPreviousDayElement>('sbb-datepicker-previous-day')!;

    await expect(element).dom.to.be.equalSnapshot();

    expect(element).shadowDom.to.be.equal(`
      <span class="sbb-datepicker-previous-day">
        <sbb-icon aria-hidden="true" data-namespace="default" name="chevron-small-left-small" role="img"></sbb-icon>
      </span>
    `);
  });

  it('renders with datepicker and input disabled', async () => {
    const page: SbbFormFieldElement = await fixture(html`
      <sbb-form-field>
        <input disabled="" />
        <sbb-datepicker></sbb-datepicker>
        <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
      </sbb-form-field>
    `);

    const element: SbbDatepickerPreviousDayElement =
      page.querySelector<SbbDatepickerPreviousDayElement>('sbb-datepicker-previous-day')!;
    expect(element).to.have.attribute('data-disabled');
  });

  it('renders with datepicker and input readonly', async () => {
    const page: SbbFormFieldElement = await fixture(html`
      <sbb-form-field>
        <input readonly="" />
        <sbb-datepicker></sbb-datepicker>
        <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
      </sbb-form-field>
    `);

    const element: SbbDatepickerPreviousDayElement =
      page.querySelector<SbbDatepickerPreviousDayElement>('sbb-datepicker-previous-day')!;
    expect(element).to.have.attribute('data-disabled');
  });

  testA11yTreeSnapshot(
    undefined,
    html`<sbb-datepicker-previous-day></sbb-datepicker-previous-day>`,
  );
});
