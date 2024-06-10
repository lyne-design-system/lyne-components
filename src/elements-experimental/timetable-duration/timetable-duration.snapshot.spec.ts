import { expect } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private/fixture';
import { html } from 'lit/static-html.js';

import sampleData from './timetable-duration.sample-data.js';

import './timetable-duration.js';

const config = JSON.stringify(sampleData[0]);

describe(`sbb-timetable-duration`, () => {
  it('renders', async () => {
    const root = await fixture(
      html`<sbb-timetable-duration config="${config}"></sbb-timetable-duration>`,
    );

    expect(root).dom.to.be.equal(
      `
        <sbb-timetable-duration
            config="{&quot;hours&quot;:0,&quot;minutes&quot;:37}"
        >

        </sbb-timetable-duration>
      `,
    );
    expect(root).shadowDom.to.be.equal(
      `
            <p
                aria-label=" 37 Minutes."
                class="duration"
                role="text"
            >
                <span
                    aria-hidden="true"
                    class="duration__text--visual"
                    role="presentation"
                >
                    37 min
                </span>
                <span class="duration__text--visually-hidden">
                    37 Minutes.
                </span>
            </p>
          `,
    );
  });
});
