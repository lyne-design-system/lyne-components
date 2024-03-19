import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private';

import { SbbCardElement } from './card';

import '../card-badge';

describe(`sbb-card with ${fixture.name}`, () => {
  let element: SbbCardElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-card size="l" color="transparent-bordered"></sbb-card>`, {
      modules: ['./card.ts'],
    });
    assert.instanceOf(element, SbbCardElement);
  });

  it('should render with sbb-card-badge', async () => {
    element = await fixture(
      html`
        <sbb-card size="xl">
          <h2>Title</h2>
          Content text
          <sbb-card-badge>
            <span>%</span>
            <span>from CHF</span>
            <span>19.99</span>
          </sbb-card-badge>
        </sbb-card>
      `,
      { modules: ['./card.ts', '../card-badge/index.ts'] },
    );

    expect(
      getComputedStyle(
        element.shadowRoot!.querySelector<HTMLSpanElement>('.sbb-card__badge-wrapper')!,
      ).getPropertyValue('display'),
    ).not.to.be.equal('none');
    expect(element).to.have.attribute('data-has-card-badge');
  });

  it('should render without sbb-card-badge', async () => {
    element = await fixture(
      html` <sbb-card size="xl">
        <h2>Title</h2>
        Content text
      </sbb-card>`,
      { modules: ['./card.ts'] },
    );

    expect(
      getComputedStyle(
        element.shadowRoot!.querySelector<HTMLSpanElement>('.sbb-card__badge-wrapper')!,
      ).getPropertyValue('display'),
    ).to.be.equal('none');
    expect(element).not.to.have.attribute('data-has-card-badge');
  });

  it('should not render sbb-card-badge for small sizes', async () => {
    const root = await fixture(
      html` <sbb-card size="xs">
        <h2>Title</h2>
        Content text
        <sbb-card-badge>
          <span>%</span>
          <span>from CHF</span>
          <span>19.99</span>
        </sbb-card-badge>
      </sbb-card>`,
      { modules: ['./card.ts', '../card-badge/index.ts'] },
    );

    expect(root.shadowRoot!.querySelector('.sbb-card__badge-wrapper')).not.to.be.ok;
  });
});
