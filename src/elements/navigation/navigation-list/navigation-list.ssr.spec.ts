import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbNavigationListElement } from './navigation-list.js';

import '../navigation-button.js';

describe(`sbb-navigation-list ${fixture.name}`, () => {
  let root: SbbNavigationListElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-navigation-list>
          <sbb-navigation-button>Label</sbb-navigation-button>
          <sbb-navigation-button>Label 2</sbb-navigation-button>
        </sbb-navigation-list>
      `,
      { modules: ['./navigation-list.js', '../navigation-button.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbNavigationListElement);
  });
});
