import { expect } from '@open-wc/testing';

import { fixture } from '../../core/testing/private.js';
import {
  buttonIconTestTemplate,
  buttonSpaceIconTestTemplate,
} from '../common/button-test-utils.js';
import './secondary-button-static.js';

describe(`sbb-secondary-button-static`, () => {
  it('should detect icon in sbb-secondary-button-static', async () => {
    const root = await fixture(buttonIconTestTemplate('sbb-secondary-button-static'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });

  it('should detect icon in sbb-secondary-button-static when there is space around icon', async () => {
    const root = await fixture(buttonSpaceIconTestTemplate('sbb-secondary-button-static'));
    const dataSlots = root.getAttribute('data-slot-names');
    expect(dataSlots).to.contain('icon');
    expect(dataSlots).not.to.contain('unnamed');
  });
});
