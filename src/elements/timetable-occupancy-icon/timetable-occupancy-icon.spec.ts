import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import type { SinonStub } from 'sinon';
import { stub } from 'sinon';

import { i18nOccupancy } from '../core/i18n.js';
import { fixture } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';

import { SbbTimetableOccupancyIconElement } from './timetable-occupancy-icon.js';

describe(`sbb-timetable-occupancy-icon`, () => {
  let matchMediaStub: SinonStub<[query: string], MediaQueryList>;
  const mediaQueryListArgs: MediaQueryList = {
    matches: false,
    media: '',
    onchange: stub(),
    addListener: stub(), // deprecated
    removeListener: stub(), // deprecated
    addEventListener: stub(),
    removeEventListener: stub(),
    dispatchEvent: stub(),
  };

  beforeEach(() => {
    matchMediaStub = stub(window, 'matchMedia');
  });

  afterEach(() => {
    matchMediaStub.restore();
  });

  it('renders', async () => {
    matchMediaStub.withArgs('(forced-colors: active)').returns({
      ...mediaQueryListArgs,
      matches: false,
      media: '(forced-colors: active)',
    });
    matchMediaStub.withArgs('(prefer-color-scheme: dark)').returns({
      ...mediaQueryListArgs,
      matches: false,
      media: '(prefer-color-scheme: dark)',
    });
    const element: SbbTimetableOccupancyIconElement = await fixture(
      html` <sbb-timetable-occupancy-icon occupancy="low"></sbb-timetable-occupancy-icon>`,
    );
    assert.instanceOf(element, SbbTimetableOccupancyIconElement);
    expect(element.getAttribute('aria-label')).to.equal(i18nOccupancy.low.en);
    await waitForLitRender(element);
    expect(element.shadowRoot!.querySelector('svg-fake')).to.have.attribute(
      'data-name',
      'utilization-low',
    );
  });

  it('renders high contrast mode', async () => {
    matchMediaStub.withArgs('(forced-colors: active)').returns({
      ...mediaQueryListArgs,
      matches: true,
      media: '(forced-colors: active)',
    });
    matchMediaStub.withArgs('(prefer-color-scheme: dark)').returns({
      ...mediaQueryListArgs,
      matches: false,
      media: '(prefer-color-scheme: dark)',
    });
    const element: SbbTimetableOccupancyIconElement = await fixture(
      html` <sbb-timetable-occupancy-icon occupancy="medium"></sbb-timetable-occupancy-icon>`,
    );
    assert.instanceOf(element, SbbTimetableOccupancyIconElement);
    expect(element.getAttribute('aria-label')).to.equal(i18nOccupancy.medium.en);
    await waitForLitRender(element);
    expect(element.shadowRoot!.querySelector('svg-fake')).to.have.attribute(
      'data-name',
      'utilization-medium-high-contrast',
    );
  });

  it('renders negative', async () => {
    matchMediaStub.withArgs('(forced-colors: active)').returns({
      ...mediaQueryListArgs,
      matches: false,
      media: '(forced-colors: active)',
    });
    matchMediaStub.withArgs('(prefer-color-scheme: dark)').returns({
      ...mediaQueryListArgs,
      matches: true,
      media: '(prefer-color-scheme: dark)',
    });
    const element: SbbTimetableOccupancyIconElement = await fixture(
      html` <sbb-timetable-occupancy-icon occupancy="medium"></sbb-timetable-occupancy-icon>`,
    );
    assert.instanceOf(element, SbbTimetableOccupancyIconElement);
    expect(element.getAttribute('aria-label')).to.equal(i18nOccupancy.medium.en);
    await waitForLitRender(element);
    expect(element.shadowRoot!.querySelector('svg-fake')).to.have.attribute(
      'data-name',
      'utilization-medium-negative',
    );
  });
});
