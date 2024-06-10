import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbNavigationMarkerElement } from './navigation-marker.js';

import '../navigation-button.js';

describe(`sbb-navigation-marker ${fixture.name}`, () => {
  let root: SbbNavigationMarkerElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-navigation-marker size="l">
        <sbb-navigation-button id="nav-1" size="s">Tickets & Offers</sbb-navigation-button>
        <sbb-navigation-button id="nav-2">Vacations & Recreation</sbb-navigation-button>
        <sbb-navigation-button id="nav-3">Travel information</sbb-navigation-button>
        <sbb-navigation-button id="nav-4">Help & Contact</sbb-navigation-button>
      </sbb-navigation-marker>`,
      { modules: ['./navigation-marker.js', '../navigation-button.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbNavigationMarkerElement);
  });
});
