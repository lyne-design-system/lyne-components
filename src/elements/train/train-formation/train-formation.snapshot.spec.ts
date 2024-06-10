import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import './train-formation.js';
import '../train.js';
import '../train-wagon.js';

describe(`sbb-train-formation`, () => {
  it('should render with one train', async () => {
    const root = await fixture(
      html`<sbb-train-formation>
        <sbb-train>
          <sbb-train-wagon></sbb-train-wagon>
        </sbb-train>
      </sbb-train-formation>`,
    );

    expect(root).dom.to.be.equal(
      `
        <sbb-train-formation>
          <sbb-train direction="left" slot="li-0">
            <sbb-train-wagon data-has-visible-wagon-content type="wagon" slot="li-0"></sbb-train-wagon>
          </sbb-train>
        </sbb-train-formation>
      `,
    );
    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('should render with multiple trains', async () => {
    const root = await fixture(
      html`<sbb-train-formation>
        <sbb-train>
          <sbb-train-wagon></sbb-train-wagon>
        </sbb-train>
        <sbb-train>
          <sbb-train-wagon></sbb-train-wagon>
        </sbb-train>
      </sbb-train-formation>`,
    );

    expect(root).dom.to.be.equal(
      `
        <sbb-train-formation>
          <sbb-train direction="left" slot="li-0">
            <sbb-train-wagon data-has-visible-wagon-content type="wagon" slot="li-0"></sbb-train-wagon>
          </sbb-train>
          <sbb-train direction="left" slot="li-1">
            <sbb-train-wagon data-has-visible-wagon-content type="wagon" slot="li-0"></sbb-train-wagon>
          </sbb-train>
        </sbb-train-formation>
      `,
    );
    await expect(root).shadowDom.to.equalSnapshot();
  });
});
