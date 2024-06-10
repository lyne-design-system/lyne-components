import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbContainerElement } from '../container.js';

import { SbbStickyBarElement } from './sticky-bar.js';

import '../container.js';

describe(`sbb-sticky-bar ${fixture.name}`, () => {
  let root: SbbContainerElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-container>
          <div><p>Situation 1</p></div>
          <div><p>Situation 2</p></div>
          <div><p>Situation 3</p></div>
          <div><p>Situation 4</p></div>
          <div><p>Situation 5</p></div>
          <div><p>Situation 6</p></div>
          <div><p>Situation 7</p></div>
          <div><p>Situation 8</p></div>
          <div><p>Situation 9</p></div>
          <div><p>Situation 10</p></div>
          <div><p>Situation 11</p></div>
          <div><p>Situation 12</p></div>
          <sbb-sticky-bar></sbb-sticky-bar>
        </sbb-container>
      `,
      { modules: ['../container.js', './sticky-bar.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-sticky-bar'), SbbStickyBarElement);
  });
});
