import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbNavigationElement } from '../navigation.js';

import { SbbNavigationSectionElement } from './navigation-section.js';

import '../navigation.js';
import '../navigation-list.js';
import '../navigation-button.js';

describe(`sbb-navigation-section ${fixture.name}`, () => {
  let root: SbbNavigationElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-navigation>
          <sbb-navigation-section>
            <sbb-navigation-list>
              <sbb-navigation-button>Tickets & Offers</sbb-navigation-button>
              <sbb-navigation-button>Vacations & Recreation</sbb-navigation-button>
              <sbb-navigation-button>Travel information</sbb-navigation-button>
              <sbb-navigation-button>Help & Contact</sbb-navigation-button>
            </sbb-navigation-list>
          </sbb-navigation-section>
        </sbb-navigation>
      `,
      {
        modules: [
          '../navigation.js',
          '../navigation-list.js',
          '../navigation-button.js',
          './navigation-section.js',
        ],
      },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-navigation-section'), SbbNavigationSectionElement);
  });
});
