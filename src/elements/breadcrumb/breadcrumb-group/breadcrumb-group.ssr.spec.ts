import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbBreadcrumbGroupElement } from './breadcrumb-group.js';

import '../breadcrumb.js';

describe(`sbb-breadcrumb-group ${fixture.name}`, () => {
  let root: SbbBreadcrumbGroupElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-breadcrumb-group>
          <sbb-breadcrumb href="#" icon-name="house-small" id="breadcrumb-0"></sbb-breadcrumb>
          <sbb-breadcrumb href="#" id="breadcrumb-1">One</sbb-breadcrumb>
          <sbb-breadcrumb href="#" id="breadcrumb-2">Two</sbb-breadcrumb>
        </sbb-breadcrumb-group>
      `,
      { modules: ['./breadcrumb-group.js', '../breadcrumb.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbBreadcrumbGroupElement);
  });
});
