import { expect } from '@open-wc/testing';

import { fixture } from '../../core/testing/private.js';
import {
  buttonIconTestTemplate,
  buttonSpaceIconTestTemplate,
} from '../common/button-test-utils.js';
import './transparent-button-static.js';

describe(`sbb-transparent-button-static`, () => {
  it('should detect icon in sbb-transparent-button-static', async () => {
    const root = await fixture(buttonIconTestTemplate('sbb-transparent-button-static'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });

  it('should detect icon in sbb-transparent-button-static when there is space around icon', async () => {
    const root = await fixture(buttonSpaceIconTestTemplate('sbb-transparent-button-static'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });
});
