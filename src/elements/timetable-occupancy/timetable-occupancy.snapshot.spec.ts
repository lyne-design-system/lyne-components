import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbTimetableOccupancyElement } from './timetable-occupancy.js';

import './timetable-occupancy.js';

describe(`sbb-timetable-occupancy`, () => {
  let element: SbbTimetableOccupancyElement;

  describe('renders', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <sbb-timetable-occupancy
          first-class-occupancy="high"
          second-class-occupancy="high"
        ></sbb-timetable-occupancy>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders negative', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <sbb-timetable-occupancy
          first-class-occupancy="low"
          second-class-occupancy="medium"
          negative
        ></sbb-timetable-occupancy>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders only first class wagon', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <sbb-timetable-occupancy first-class-occupancy="low"></sbb-timetable-occupancy>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders only second class wagon', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <sbb-timetable-occupancy second-class-occupancy="none"></sbb-timetable-occupancy>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
