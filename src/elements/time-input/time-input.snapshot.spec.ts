import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import './time-input.js';

describe(`sbb-time-input`, () => {
  it('renders', async () => {
    const root = await fixture(
      html` <span>
        <sbb-time-input input="id-1"></sbb-time-input>
        <input id="id-1" />
      </span>`,
    );
    const elem = root.querySelector('sbb-time-input');

    await expect(root).dom.to.be.equalSnapshot();
    expect(elem).shadowDom.to.be.equal(`
      <p role="status"></p>
    `);
  });

  testA11yTreeSnapshot(
    html` <span>
      <sbb-time-input input="id-1"></sbb-time-input>
      <input id="id-1" />
    </span>`,
  );
});
