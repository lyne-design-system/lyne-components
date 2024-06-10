import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbMapContainerElement } from './map-container.js';

import '../title.js';

describe(`sbb-map-container ${fixture.name}`, () => {
  let root: SbbMapContainerElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-map-container>
        <div>
          <sbb-title level="4">Operations & Disruptions</sbb-title>
          <div><p>Situation 1</p></div>
          <div><p>Situation 2</p></div>
          <div><p>Situation 3</p></div>
          <div><p>Situation 4</p></div>
          <div><p>Situation 5</p></div>
          <div><p>Situation 6</p></div>
          <div><p>Situation 7</p></div>
          <div><p>Situation 8</p></div>
        </div>
        <div slot="map">
          <div style="height: 1200px">map</div>
        </div>
      </sbb-map-container>`,
      { modules: ['./map-container.js', '../title.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbMapContainerElement);
  });
});
