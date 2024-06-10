import { expect } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { waitForLitRender } from '@sbb-esta/lyne-elements/core/testing.js';
import { html } from 'lit/static-html.js';

import type { PtRideLeg } from '../core/timetable.js';

import type { SbbPearlChainElement } from './pearl-chain.js';

import './pearl-chain.js';

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
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past sbb-pearl-chain__leg--skipped" style="--sbb-pearl-chain-leg-width:91.66666666666666%;">
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
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--past sbb-pearl-chain__leg--skipped" style="--sbb-pearl-chain-leg-width:91.66666666666666%;">
            <span class="sbb-pearl-chain__stop"></span>
          </div>
          <span class="sbb-pearl-chain--arrival-skipped sbb-pearl-chain__bullet sbb-pearl-chain__bullet--past"></span>
        </div>
      `);
    });
  });
});
