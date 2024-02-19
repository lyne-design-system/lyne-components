import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import '../navigation-button';
import { waitForLitRender } from '../../core/testing';

import { SbbNavigationMarkerElement } from './navigation-marker';
import '.';

describe('sbb-navigation-marker', () => {
  let element: SbbNavigationMarkerElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-navigation-marker size="l">
        <sbb-navigation-button id="nav-1" size="s">Tickets & Offers</sbb-navigation-button>
        <sbb-navigation-button id="nav-2">Vacations & Recreation</sbb-navigation-button>
        <sbb-navigation-button id="nav-3">Travel information</sbb-navigation-button>
        <sbb-navigation-button id="nav-4">Help & Contact</sbb-navigation-button>
      </sbb-navigation-marker>`,
    );
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbNavigationMarkerElement);
  });

  it('selects action on click', async () => {
    const firstAction = element.querySelector('sbb-navigation-button#nav-1') as HTMLElement;
    const secondAction = element.querySelector('sbb-navigation-button#nav-2') as HTMLElement;

    secondAction.click();
    await waitForLitRender(element);

    expect(secondAction).to.have.attribute('active');
    expect(firstAction).not.to.have.attribute('active');

    firstAction.click();
    await waitForLitRender(element);

    expect(firstAction).to.have.attribute('active');
    expect(secondAction).not.to.have.attribute('active');
  });

  it('automatic list generation', () => {
    const list = element.shadowRoot!.querySelector('ul')!;
    expect(list.className).to.be.equal('sbb-navigation-marker');

    const listItems = list.querySelectorAll('li');
    expect(listItems.length).to.equal(4);
  });

  it('force size on children elements', () => {
    const firstAction = element.querySelector('sbb-navigation-button#nav-1');
    expect(firstAction).to.have.attribute('size', 'l');
  });
});
