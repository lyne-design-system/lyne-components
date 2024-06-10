import { expect } from '@open-wc/testing';

import { fixture } from '../../core/testing/private.js';
import {
  buttonIconTestTemplate,
  buttonSpaceIconTestTemplate,
} from '../common/button-test-utils.js';

import './tertiary-button.js';

describe(`sbb-tertiary-button`, () => {
  it('should detect icon in sbb-tertiary-button', async () => {
    const root = await fixture(buttonIconTestTemplate('sbb-tertiary-button'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });

  it('should detect icon in sbb-tertiary-button when there is space around icon', async () => {
    const root = await fixture(buttonSpaceIconTestTemplate('sbb-tertiary-button'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });
});
