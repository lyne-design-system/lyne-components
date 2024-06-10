import { expect } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { html } from 'lit/static-html.js';

import type {
  InterfaceSbbJourneySummaryAttributes,
  SbbJourneySummaryElement,
} from './journey-summary.js';

import './journey-summary.js';

const now = '2022-08-29T21:00:00Z';

const data: InterfaceSbbJourneySummaryAttributes = {
  legs: [],
  vias: ['via'],
  origin: '',
  destination: '',
  arrivalWalk: 0,
  departure: '2022-08-29T20:30:00',
  arrival: '2022-08-29T22:30:00',
  departureWalk: 0,
  duration: 60,
};

const dataWithoutVia: InterfaceSbbJourneySummaryAttributes = {
  legs: [],
  origin: '',
  vias: [],
  destination: '',
  arrivalWalk: 0,
  departure: '2022-08-29T20:30:00',
  arrival: '2022-08-29T22:30:00',
  departureWalk: 0,
  duration: 100,
};

describe(`sbb-journey-summary`, () => {
  it('renders', async () => {
    const root = (await fixture(
      html` <sbb-journey-summary .now=${now} .trip=${data}></sbb-journey-summary>`,
    )) as SbbJourneySummaryElement;

    expect(root).dom.to.be.equal(`
      <sbb-journey-summary>
      </sbb-journey-summary>`);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders without vias', async () => {
    const root = (await fixture(
      html` <sbb-journey-summary .now=${now} .trip=${dataWithoutVia}></sbb-journey-summary>`,
    )) as SbbJourneySummaryElement;

    expect(root).dom.to.be.equal(`
      <sbb-journey-summary>
      </sbb-journey-summary>`);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with second journey', async () => {
    const root = (await fixture(
      html`<sbb-journey-summary
        .now=${now}
        .trip=${dataWithoutVia}
        .tripBack=${data}
        round-trip
      ></sbb-journey-summary>`,
    )) as SbbJourneySummaryElement;

    expect(root).dom.to.be.equal(`<sbb-journey-summary round-trip></sbb-journey-summary>`);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });
});
