import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';
import type { PtRideLeg } from '../core/timetable.js';

import type { SbbPearlChainElement } from './pearl-chain.js';

import './pearl-chain.js';

const now = new Date('2022-08-16T15:00:00Z').valueOf();

describe(`sbb-pearl-chain`, () => {
  describe('sbb-pearl-chain with one leg', () => {
    it('renders component with config', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T05:00' },
          departure: { time: '2022-08-18T04:00' },
        } as PtRideLeg,
      ];
      await waitForLitRender(element);
      expect(element).dom.to.be.equal(`<sbb-pearl-chain></sbb-pearl-chain>`);
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past" style="--sbb-pearl-chain-leg-width:100%;"></div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
        </div>
      `);
    });
  });

  describe('sbb-pearl-chain with two legs', () => {
    it('renders component with config', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T05:00' },
          departure: { time: '2022-08-18T04:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T16:00' },
          departure: { time: '2022-08-18T05:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
      ];
      await waitForLitRender(element);
      expect(element).dom.to.be.equal(`<sbb-pearl-chain></sbb-pearl-chain>`);
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past" style="--sbb-pearl-chain-leg-width:8.333333333333332%;"></div>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past" style="--sbb-pearl-chain-leg-width:91.66666666666666%;">
            <span class="sbb-pearl-chain__stop"></span>
          </div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
        </div>
      `);
    });
  });

  describe('sbb-pearl-chain with skipped stops', () => {
    it('renders component with departure skipped', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T05:00' },
          departure: { time: '2022-08-18T04:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T16:00' },
          departure: { time: '2022-08-18T05:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
            stopPoints: [
              {
                stopStatus: 'NOT_SERVICED',
              },
              {
                stopStatus: 'PLANNED',
              },
            ],
          },
        } as PtRideLeg,
      ];
      await waitForLitRender(element);
      expect(element).dom.to.be.equal(`<sbb-pearl-chain></sbb-pearl-chain>`);
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past" style="--sbb-pearl-chain-leg-width:8.333333333333332%;"></div>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--skipped" style="--sbb-pearl-chain-leg-width:91.66666666666666%;">
            <span class="sbb-pearl-chain__stop sbb-pearl-chain__stop--departure-skipped"></span>
          </div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
        </div>
      `);
    });

    it('renders component with arrival skipped', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T05:00' },
          departure: { time: '2022-08-18T04:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-18T16:00' },
          departure: { time: '2022-08-18T05:00' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
            stopPoints: [
              {
                stopStatus: 'PLANNED',
              },
              {
                stopStatus: 'NOT_SERVICED',
              },
            ],
          },
        } as PtRideLeg,
      ];
      await waitForLitRender(element);
      expect(element).dom.to.be.equal(`<sbb-pearl-chain></sbb-pearl-chain>`);
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past" style="--sbb-pearl-chain-leg-width:8.333333333333332%;"></div>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--skipped" style="--sbb-pearl-chain-leg-width:91.66666666666666%;">
            <span class="sbb-pearl-chain__stop"></span>
          </div>
          <span class="sbb-pearl-chain--arrival-skipped sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
        </div>
      `);
    });
  });

  describe('sbb-pearl-chain with cancelled legs', () => {
    it('renders component with progress leg', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain data-now="${now}"></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-16T16:00:00Z' },
          departure: { time: '2022-08-16T14:00:00Z' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-16T18:00:00Z' },
          departure: { time: '2022-08-16T17:00:00Z' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
      ];

      await waitForLitRender(element);
      expect(element).dom.to.be.equal(
        `<sbb-pearl-chain data-now="1660662000000"></sbb-pearl-chain>`,
      );
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--progress"></span>
          <div
            class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past"
            style="--sbb-pearl-chain-leg-width:66.66666666666666%;"
          >
          </div>
          <div
            class="sbb-pearl-chain__leg sbb-pearl-chain__leg--future"
            style="--sbb-pearl-chain-leg-width:33.33333333333333%;"
          >
            <span class="sbb-pearl-chain__stop">
            </span>
          </div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--future">
          </span>
        </div>
      `);
    });

    it('renders component with cancelled instead of progress leg', async () => {
      const element = await fixture<SbbPearlChainElement>(
        html`<sbb-pearl-chain data-now="${now}"></sbb-pearl-chain>`,
      );
      element.legs = [
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-16T16:00:00Z' },
          departure: { time: '2022-08-16T14:00:00Z' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
            stopPoints: [
              {
                stopStatus: 'NOT_SERVICED',
              },
              {
                stopStatus: 'PLANNED',
              },
            ],
          },
        } as PtRideLeg,
        {
          __typename: 'PTRideLeg',
          arrival: { time: '2022-08-16T18:00:00Z' },
          departure: { time: '2022-08-16T17:00:00Z' },
          serviceJourney: {
            serviceAlteration: {
              cancelled: false,
            },
          },
        } as PtRideLeg,
      ];

      await waitForLitRender(element);
      expect(element).dom.to.be.equal(
        `<sbb-pearl-chain data-now="1660662000000"></sbb-pearl-chain>`,
      );
      expect(element).shadowDom.to.be.equal(`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain--departure-skipped sbb-pearl-chain__bullet sbb-pearl-chain__bullet--progress"></span>
          <div
            class="sbb-pearl-chain__leg sbb-pearl-chain__leg--skipped"
            style="--sbb-pearl-chain-leg-width:66.66666666666666%;"
          >
          </div>
          <div
            class="sbb-pearl-chain__leg sbb-pearl-chain__leg--future"
            style="--sbb-pearl-chain-leg-width:33.33333333333333%;"
          >
            <span class="sbb-pearl-chain__stop">
            </span>
          </div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain__bullet--future">
          </span>
        </div>
      `);
    });
  });
});
