import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private';

import type { SbbAutocompleteGridActionsElement } from './autocomplete-grid-actions';
import '../autocomplete-grid';
import '../autocomplete-grid-row';
import './autocomplete-grid-actions';
import '../autocomplete-grid-button';

describe('sbb-autocomplete-grid-actions', () => {
  let root: SbbAutocompleteGridActionsElement;
  beforeEach(async () => {
    root = (
      await fixture(html`
        <sbb-autocomplete-grid origin="anchor">
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-actions>
              <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-actions>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid>
        <div id="anchor"></div>
      `)
    ).querySelector('sbb-autocomplete-grid-actions')!;
  });

  it('Dom', async () => {
    await expect(root).dom.to.be.equalSnapshot();
  });

  it('ShadowDom', async () => {
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('id check', () => {
    expect(root.id).to.be.equal('sbb-autocomplete-grid-item-3x1');
    expect(root.querySelector('sbb-autocomplete-grid-button')!.id).to.be.equal(
      'sbb-autocomplete-grid-item-3x1x0',
    );
  });

  testA11yTreeSnapshot(html`
    <sbb-autocomplete-grid-actions>
      <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
  `);
});
