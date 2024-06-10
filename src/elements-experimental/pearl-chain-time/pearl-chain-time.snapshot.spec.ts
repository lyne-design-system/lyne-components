import { expect } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { waitForLitRender } from '@sbb-esta/lyne-elements/core/testing.js';
import { html } from 'lit/static-html.js';

import type { PtRideLeg } from '../core/timetable.js';

import type { SbbPearlChainTimeElement } from './pearl-chain-time.js';

import './pearl-chain-time.js';

const now = '2022-08-16T15:00:00Z';

describe(`sbb-pearl-chain-time`, () => {
  it('should render component with time', async () => {
    const element = await fixture<SbbPearlChainTimeElement>(html`
      <sbb-pearl-chain-time
        departure-time="2022-08-16T12:00:00"
        arrival-time="2022-08-16T15:00:00"
        .now="${now}"
      >
      </sbb-pearl-chain-time>
    `);
    element.legs = [
      {
        __typename: 'PTRideLeg',
      } as PtRideLeg,
    ];
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-time arrival-time="2022-08-16T15:00:00" departure-time="2022-08-16T12:00:00">
      </sbb-pearl-chain-time>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain__time">
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T12:00:00">
          <span class="sbb-screen-reader-only">
            Departure:
          </span>
          12:00
        </time>
        <sbb-pearl-chain class="sbb-pearl-chain__time-chain"></sbb-pearl-chain>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T15:00:00">
          <span class="sbb-screen-reader-only">
            Arrival:
          </span>
          15:00
        </time>
      </div>
    `);
  });

  it('should render component with departure walk', async () => {
    const element = await fixture<SbbPearlChainTimeElement>(html`
      <sbb-pearl-chain-time
        departure-time="2022-08-16T12:00:00"
        arrival-time="2022-08-16T15:00:00"
        departure-walk="10"
        .now="${now}"
      >
      </sbb-pearl-chain-time>
    `);
    element.legs = [
      {
        __typename: 'PTRideLeg',
      } as PtRideLeg,
    ];
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-time departure-time='2022-08-16T12:00:00' arrival-time='2022-08-16T15:00:00' departure-walk="10">
      </sbb-pearl-chain-time>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain__time">
        <span class="sbb-pearl-chain__time-walktime sbb-pearl-chain__time-walktime--left">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="walk-small"
            role="img"
          ></sbb-icon>
          <time datetime="10M">
            <span class="sbb-screen-reader-only">
              minutes of walking time before departure:
            </span>
            10
            <span class="sbb-pearl-chain__time-walktime-prime-symbol" aria-hidden="true">
              '
            </span>
          </time>
        </span>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T12:00:00">
          <span class="sbb-screen-reader-only">
            Departure:
          </span>
          12:00
        </time>
        <sbb-pearl-chain class="sbb-pearl-chain__time-chain"></sbb-pearl-chain>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T15:00:00">
          <span class="sbb-screen-reader-only">
            Arrival:
          </span>
          15:00
        </time>
      </div>
    `);
  });

  it('should render component with arrival walk', async () => {
    const element = await fixture<SbbPearlChainTimeElement>(html`
      <sbb-pearl-chain-time
        departure-time="2022-08-16T12:00:00"
        arrival-time="2022-08-16T15:00:00"
        arrival-walk="10"
        .now="${now}"
      >
      </sbb-pearl-chain-time>
    `);
    element.legs = [
      {
        __typename: 'PTRideLeg',
      } as PtRideLeg,
    ];
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-time arrival-time="2022-08-16T15:00:00" departure-time="2022-08-16T12:00:00" arrival-walk="10">
      </sbb-pearl-chain-time>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain__time">
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T12:00:00">
          <span class="sbb-screen-reader-only">
            Departure:
          </span>
          12:00
        </time>
        <sbb-pearl-chain class="sbb-pearl-chain__time-chain"></sbb-pearl-chain>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T15:00:00">
          <span class="sbb-screen-reader-only">
            Arrival:
          </span>
          15:00
        </time>
        <span class="sbb-pearl-chain__time-walktime sbb-pearl-chain__time-walktime--right">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="walk-small"
            role="img"
          ></sbb-icon>
          <time datetime="10M">
            <span class="sbb-screen-reader-only">
              minutes of walking time after arrival:
            </span>
            10
            <span class="sbb-pearl-chain__time-walktime-prime-symbol" aria-hidden="true">
              '
            </span>
          </time>
        </span>
      </div>
    `);
  });

  it('should render component with departure and arrival walk', async () => {
    const element = await fixture<SbbPearlChainTimeElement>(html`
      <sbb-pearl-chain-time
        departure-time="2022-08-16T12:00:00"
        arrival-time="2022-08-16T15:00:00"
        departure-walk="20"
        arrival-walk="10"
        .now="${now}"
      >
      </sbb-pearl-chain-time>
    `);
    element.legs = [
      {
        __typename: 'PTRideLeg',
      } as PtRideLeg,
    ];
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-time arrival-time="2022-08-16T15:00:00" departure-time="2022-08-16T12:00:00" departure-walk="20" arrival-walk="10">
      </sbb-pearl-chain-time>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain__time">
        <span class="sbb-pearl-chain__time-walktime sbb-pearl-chain__time-walktime--left">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="walk-small"
            role="img"
          ></sbb-icon>
          <time datetime="20M">
            <span class="sbb-screen-reader-only">
              minutes of walking time before departure:
            </span>
            20
            <span class="sbb-pearl-chain__time-walktime-prime-symbol" aria-hidden="true">
              '
            </span>
          </time>
        </span>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T12:00:00">
          <span class="sbb-screen-reader-only">
            Departure:
          </span>
          12:00
        </time>
        <sbb-pearl-chain class="sbb-pearl-chain__time-chain"></sbb-pearl-chain>
        <time class="sbb-pearl-chain__time-time" datetime="2022-08-16T15:00:00">
          <span class="sbb-screen-reader-only">
            Arrival:
          </span>
          15:00
        </time>
        <span class="sbb-pearl-chain__time-walktime sbb-pearl-chain__time-walktime--right">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="walk-small"
            role="img"
          ></sbb-icon>
          <time datetime="10M">
            <span class="sbb-screen-reader-only">
              minutes of walking time after arrival:
            </span>
            10
            <span class="sbb-pearl-chain__time-walktime-prime-symbol" aria-hidden="true">
              '
            </span>
          </time>
        </span>
      </div>
    `);
  });
});
