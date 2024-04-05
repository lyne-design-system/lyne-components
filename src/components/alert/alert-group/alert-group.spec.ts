import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private/index.js';

import type { SbbAlertGroupElement } from './alert-group.js';
import './alert-group.js';
import '../alert/index.js';

describe(`sbb-alert-group`, () => {
  describe('should render', () => {
    let root: SbbAlertGroupElement;

    beforeEach(async () => {
      root = await fixture(html`
        <sbb-alert-group accessibility-title="Disruptions" accessibility-title-level="3">
          <sbb-alert
            title-content="Interruption between Genève and Lausanne"
            href="https://www.sbb.ch"
          >
            The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
          </sbb-alert>
        </sbb-alert-group>
      `);
    });

    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  it('should render with slots', async () => {
    const root = await fixture(html`
      <sbb-alert-group accessibility-title-level="3">
        <span slot="accessibility-title">Interruptions</span>
        <sbb-alert
          title-content="Interruption between Genève and Lausanne"
          href="https://www.sbb.ch"
          data-state="opening"
        >
          The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
        </sbb-alert>
      </sbb-alert-group>
    `);

    expect(root).dom.to.be.equal(
      `
        <sbb-alert-group accessibility-title-level='3' role='status'>
          <span slot="accessibility-title">
            Interruptions
          </span>
          <sbb-alert title-content='Interruption between Genève and Lausanne' href='https://www.sbb.ch' size="m" data-state="opening">
            The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
          </sbb-alert>
        </sbb-alert-group>
      `,
    );
    expect(root).shadowDom.to.be.equal(
      `
        <div class="sbb-alert-group">
          <h3 class="sbb-alert-group__title">
            <slot name="accessibility-title"></slot>
          </h3>
          <slot></slot>
        </div>
      `,
    );
  });
});
