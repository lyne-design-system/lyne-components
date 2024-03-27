import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForCondition, waitForLitRender } from '../../core/testing';
import { fixture } from '../../core/testing/private';

import { SbbNavigationSectionElement } from './navigation-section';

import '../navigation';
import '../navigation-list';
import '../navigation-button';

describe(`sbb-navigation-section with ${fixture.name}`, () => {
  let element: SbbNavigationSectionElement;

  beforeEach(async () => {
    const root = await fixture(
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
          '../navigation/index.ts',
          './navigation-section.ts',
          '../navigation-list/index.ts',
          '../navigation-button/index.ts',
        ],
      },
    );
    element = root.querySelector<SbbNavigationSectionElement>('sbb-navigation-section')!;
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbNavigationSectionElement);
  });

  it('opens the section', async () => {
    element.open();
    await waitForLitRender(element);

    await waitForCondition(() => element.getAttribute('data-state') === 'opened');
    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('closes the section', async () => {
    element.open();
    await waitForLitRender(element);

    await waitForCondition(() => element.getAttribute('data-state') === 'opened');
    expect(element).to.have.attribute('data-state', 'opened');

    element.close();
    await waitForLitRender(element);

    await waitForCondition(() => element.getAttribute('data-state') === 'closed');
    expect(element).to.have.attribute('data-state', 'closed');
  });
});
