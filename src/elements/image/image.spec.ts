import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { spy } from 'sinon';

import { fixture } from '../core/testing/private.js';
import { waitForCondition } from '../core/testing.js';

import './image.js';

const imageUrl = import.meta.resolve('../clock/assets/sbb_clock_face.svg');

describe(`sbb-image`, () => {
  it('should trigger load event', async () => {
    const loadSpy = spy();
    const errorSpy = spy();

    await fixture(
      html`<sbb-image
        image-src=${imageUrl}
        @load=${(e: Event) => loadSpy(e)}
        @error=${(e: Event) => errorSpy(e)}
      ></sbb-image>`,
    );

    await waitForCondition(() => loadSpy.called);

    expect(loadSpy).to.have.been.called;
    expect(errorSpy).not.to.have.been.called;
  });

  it('should trigger error event', async () => {
    const loadSpy = spy();
    const errorSpy = spy();

    await fixture(
      html`<sbb-image
        image-src="http://localhost/dummy.png"
        @load=${(e: Event) => loadSpy(e)}
        @error=${(e: Event) => errorSpy(e)}
      ></sbb-image>`,
    );

    await waitForCondition(() => errorSpy.called);

    expect(loadSpy).not.to.have.been.called;
    expect(errorSpy).to.have.been.called;
  });
});
