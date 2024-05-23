import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';
import type { ITripItem, Notice, PtSituation } from '../core/timetable.js';

import type { SbbTimetableRowElement } from './timetable-row.js';
import { filterNotices, getCus, getHimIcon, sortSituation } from './timetable-row.js';
import {
  defaultTrip,
  busTrip,
  partiallyCancelled,
  walkTimeTrip,
  trainTrip,
} from './timetable-row.sample-data.js';

const now = new Date('2022-08-16T15:00:00Z').valueOf();

describe(`sbb-timetable-row`, () => {
  let element: SbbTimetableRowElement;

  describe('sbb-timetable-row with defaultTrip', () => {
    it('renders component with config', async () => {
      element = await fixture(html`<sbb-timetable-row data-now="${now}"></sbb-timetable-row>`);

      element.trip = defaultTrip as ITripItem;
      await waitForLitRender(element);

      expect(element).dom.to.be.equal(`
        <sbb-timetable-row data-now="1660662000000" role="rowgroup">
        </sbb-timetable-row>
      `);

      expect(element).shadowDom.to.be.equal(`
        <sbb-card
          color="white"
          data-action-role="button"
          data-has-action=""
          size="l"
        >
          <sbb-card-button
            data-action=""
            data-button=""
            dir="ltr"
            role="button"
            slot="action"
            tabindex="0"
          >
            Departure: 11:08,   Train,  IR 37,  Direction Basel SBB,       Arrival: 12:13,   Travel time 1 Hour 15 Minutes,
          </sbb-card-button>
          <div
            class="sbb-timetable__row"
            role="row"
          >
            <div
              class="sbb-timetable__row-header"
              role="gridcell"
            >
              <div class="sbb-timetable__row-details">
                <span class="sbb-timetable__row-transport-wrapper">
                  <sbb-icon
                    aria-hidden="true"
                    class="sbb-timetable__row-transport-icon"
                    data-namespace="picto"
                    name="picto:train-right"
                    role="img"
                  >
                  </sbb-icon>
                  <span class="sbb-screen-reader-only">
                    Train
                  </span>
                </span>
                <span class="sbb-timetable__row-transport">
                  <sbb-icon
                    aria-hidden="true"
                    data-namespace="default"
                    name="ir-37"
                    role="img"
                  >
                  </sbb-icon>
                  <span class="sbb-screen-reader-only">
                  </span>
                </span>
              </div>
              <p>
                Direction Basel SBB
              </p>
            </div>
            <sbb-pearl-chain-time
              data-now="1660662000000"
              role="gridcell"
            >
            </sbb-pearl-chain-time>
            <div
              class="sbb-timetable__row-footer"
              role="gridcell"
            >
              <time>
                <span class="sbb-screen-reader-only">
                  Travel time 1 Hour 15 Minutes
                </span>
                <span aria-hidden="true">
                  1 h 15 min
                </span>
              </time>
            </div>
          </div>
        </sbb-card>
      `);
    });
  });

  describe('sbb-timetable-row with platform', () => {
    it('renders component with config', async () => {
      element = await fixture(html`<sbb-timetable-row data-now="${now}"></sbb-timetable-row>`);

      element.trip = trainTrip as ITripItem;
      await waitForLitRender(element);

      expect(element).dom.to.be.equal(`
        <sbb-timetable-row data-now="1660662000000" role="rowgroup">
        </sbb-timetable-row>
      `);

      expect(element).shadowDom.to.be.equal(`
        <sbb-card
          color="white"
          data-action-role="button"
          data-has-action=""
          size="l"
        >
          <sbb-card-button
            data-action=""
            data-button=""
            dir="ltr"
            role="button"
            slot="action"
            tabindex="0"
          >
            Departure: 16:30,  on Pl. 4,  Train,  IR 35,  Direction Chur,       Arrival: 17:06,   Travel time 41 Minutes,  2 changes,  First Class Low to medium occupancy expected. Second Class High occupancy expected.
          </sbb-card-button>
          <div
            class="sbb-timetable__row"
            role="row"
          >
            <div
              class="sbb-timetable__row-header"
              role="gridcell"
            >
              <div class="sbb-timetable__row-details">
                <span class="sbb-timetable__row-transport-wrapper">
                  <sbb-icon
                    aria-hidden="true"
                    class="sbb-timetable__row-transport-icon"
                    data-namespace="picto"
                    name="picto:train-right"
                    role="img"
                  >
                  </sbb-icon>
                  <span class="sbb-screen-reader-only">
                    Train
                  </span>
                </span>
                <span class="sbb-timetable__row-transport">
                  <sbb-icon
                    aria-hidden="true"
                    data-namespace="default"
                    name="ic-35"
                    role="img"
                  >
                  </sbb-icon>
                  <span class="sbb-screen-reader-only">
                  </span>
                </span>
              </div>
              <p>
                Direction Chur
              </p>
            </div>
            <sbb-pearl-chain-time
              data-now="1660662000000"
              role="gridcell"
            >
            </sbb-pearl-chain-time>
            <div
              class="sbb-timetable__row-footer"
              role="gridcell"
            >
              <span>
                <span class="sbb-screen-reader-only">
                  Departure
                </span>
                <span class="sbb-timetable__row--quay">
                  <span class="sbb-screen-reader-only">
                    on Pl.
                  </span>
                  <span
                    aria-hidden="true"
                    class="sbb-timetable__row--quay-type"
                  >
                    Pl.
                  </span>
                </span>
                4
              </span>
              <sbb-timetable-occupancy>
              </sbb-timetable-occupancy>
              <time>
                <span class="sbb-screen-reader-only">
                  Travel time 41 Minutes
                </span>
                <span aria-hidden="true">
                  41 min
                </span>
              </time>
            </div>
          </div>
        </sbb-card>
      `);
    });
  });

  describe('sbb-timetable-row with BusTrip', () => {
    it('renders component with config', async () => {
      element = await fixture(html`<sbb-timetable-row data-now="${now}"></sbb-timetable-row>`);

      element.trip = busTrip as ITripItem;
      await waitForLitRender(element);

      expect(element).dom.to.be.equal(`
        <sbb-timetable-row data-now="1660662000000" role="rowgroup">
        </sbb-timetable-row>
      `);

      expect(element).shadowDom.to.be.equal(`
        <sbb-card color="white" data-action-role="button" data-has-action size="l">
          <sbb-card-button dir="ltr" role="button" slot="action" tabindex="0" data-action data-button>
            Departure: 16:30,  on Stand 4,  Bus,  B 19,  Direction Spiegel, Blinzern,       Arrival: 17:06,   Travel time 41 Minutes,  2 changes,  First Class Low to medium occupancy expected. Second Class High occupancy expected.
          </sbb-card-button>
          <div class="sbb-timetable__row" role="row">
            <div class="sbb-timetable__row-header" role="gridcell">
              <div class="sbb-timetable__row-details">
                <span class="sbb-timetable__row-transport-wrapper">
                  <sbb-icon aria-hidden="true" data-namespace="picto" role="img" class="sbb-timetable__row-transport-icon" name="picto:bus-right"></sbb-icon>
                  <span class="sbb-screen-reader-only">
                    Bus
                  </span>
                </span>
                <span class="sbb-timetable__row-transportnumber">
                  B 19
                </span>
              </div>
              <p>
                Direction Spiegel, Blinzern
              </p>
            </div>
            <sbb-pearl-chain-time data-now="1660662000000" role="gridcell"></sbb-pearl-chain-time>
            <div class="sbb-timetable__row-footer" role="gridcell">
              <span>
                <span class="sbb-screen-reader-only">
                  Departure
                </span>
                <span class="sbb-timetable__row--quay">
                  <span class="sbb-screen-reader-only">
                    on Stand
                  </span>
                  <span class="sbb-timetable__row--quay-type" aria-hidden="true">
                    Stand
                  </span>
                </span>
                4
              </span>
              <sbb-timetable-occupancy></sbb-timetable-occupancy>
              <time>
              <span class="sbb-screen-reader-only">
                Travel time 41 Minutes
              </span>
              <span aria-hidden="true">
              41 min
              </span>
            </time>
            </div>
          </div>
        </sbb-card>
      `);
    });
  });

  describe('sbb-timetable-row loading state', () => {
    it('renders loading state', async () => {
      element = await fixture(
        html`<sbb-timetable-row loading-trip loading-price data-now="${now}"></sbb-timetable-row>`,
      );

      element.loadingTrip = true;
      await waitForLitRender(element);

      expect(element).dom.to.be.equal(`
        <sbb-timetable-row loading-trip="" loading-price="" data-now="1660662000000">
        </sbb-timetable-row>
      `);

      expect(element).shadowDom.to.be.equal(`
        <sbb-card color="white" data-has-card-badge class="sbb-loading" size="l">
          <sbb-card-badge
            class="sbb-loading__badge"
            color="charcoal"
            dir="ltr"
            role="text"
            slot="badge"></sbb-card-badge>
          <div class="sbb-loading__wrapper">
            <div class="sbb-loading__row"></div>
            <div class="sbb-loading__row"></div>
            <div class="sbb-loading__row"></div>
          </div>
        </sbb-card>
      `);
    });
  });
});

describe('sortSituation', () => {
  it('should return sorted array', () => {
    expect(
      sortSituation([
        { cause: 'TRAIN_REPLACEMENT_BY_BUS', broadcastMessages: [] },
        { cause: 'DISTURBANCE', broadcastMessages: [] },
      ]),
    ).to.be.eql([
      { cause: 'DISTURBANCE', broadcastMessages: [] },
      { cause: 'TRAIN_REPLACEMENT_BY_BUS', broadcastMessages: [] },
    ]);
  });

  it('should return sorted array even with double causes', () => {
    expect(
      sortSituation([
        { cause: 'TRAIN_REPLACEMENT_BY_BUS', broadcastMessages: [] },
        { cause: 'DISTURBANCE', broadcastMessages: [] },
        { cause: 'DISTURBANCE', broadcastMessages: [] },
      ]),
    ).to.be.eql([
      { cause: 'DISTURBANCE', broadcastMessages: [] },
      { cause: 'DISTURBANCE', broadcastMessages: [] },
      { cause: 'TRAIN_REPLACEMENT_BY_BUS', broadcastMessages: [] },
    ]);
  });
});

describe(`getHimIcon`, () => {
  it('should return replacementbus', () => {
    const situation: PtSituation = {
      cause: 'TRAIN_REPLACEMENT_BY_BUS',
      broadcastMessages: [],
    };
    expect(getHimIcon(situation).name).to.be.equal('replacementbus');
    expect(getHimIcon(situation).text).to.be.equal('');
  });

  it('should return info', () => {
    const situation: PtSituation = {
      cause: null,
      broadcastMessages: [],
    };
    expect(getHimIcon(situation).name).to.be.equal('info');
  });
});

describe(`getCus`, () => {
  it('should return cancellation', () => {
    expect(getCus(partiallyCancelled as ITripItem, 'en')).to.be.eql({
      name: 'cancellation',
      text: undefined,
    });
  });
});

describe(`filterNotices`, () => {
  it('should return sa-rr', () => {
    expect(filterNotices(walkTimeTrip?.notices as Notice[])).to.be.eql([]);
  });
});
