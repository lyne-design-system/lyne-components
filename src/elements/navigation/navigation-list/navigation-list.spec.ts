import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import { SbbNavigationListElement } from './navigation-list.js';

import '../navigation-button.js';

describe(`sbb-navigation-list`, () => {
  let element: SbbNavigationListElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-navigation-list>
        <sbb-navigation-button>Label</sbb-navigation-button>
        <sbb-navigation-button>Label 2</sbb-navigation-button>
      </sbb-navigation-list>
    `);
  });

  it('renders', () => {
    assert.instanceOf(element, SbbNavigationListElement);
  });

  it('automatic list generation', () => {
    const list = element.shadowRoot!.querySelector('ul')!;
    expect(list.className).to.be.equal('sbb-navigation-list__content');

    const listItems = list.querySelectorAll('li');
    expect(listItems.length).to.equal(2);
  });

  it('force size on children elements', () => {
    const action = element.querySelector('sbb-navigation-button');
    expect(action).to.have.attribute('size', 'm');
  });
});
