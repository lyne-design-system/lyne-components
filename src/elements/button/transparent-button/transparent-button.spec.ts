import { expect } from '@open-wc/testing';

import { fixture } from '../../core/testing/private.js';
import {
  buttonIconTestTemplate,
  buttonSpaceIconTestTemplate,
} from '../common/button-test-utils.js';
import './transparent-button.js';

describe(`sbb-transparent-button`, () => {
  it('should detect icon in sbb-transparent-button', async () => {
    const root = await fixture(buttonIconTestTemplate('sbb-transparent-button'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });

  it('should detect icon in sbb-transparent-button when there is space around icon', async () => {
    const root = await fixture(buttonSpaceIconTestTemplate('sbb-transparent-button'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });
});
