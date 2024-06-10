import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { waitForCondition, EventSpy } from '../../core/testing.js';

import { SbbAlertElement } from './alert.js';

describe(`sbb-alert`, () => {
  let alert: SbbAlertElement;

  it('renders', async () => {
    alert = await fixture(html`<sbb-alert></sbb-alert>`);
    assert.instanceOf(alert, SbbAlertElement);
  });

  it('should fire animation events', async () => {
    const willOpenSpy = new EventSpy(SbbAlertElement.events.willOpen);
    const didOpenSpy = new EventSpy(SbbAlertElement.events.didOpen);

    await fixture(html`<sbb-alert title-content="disruption">Interruption</sbb-alert>`);

    await waitForCondition(() => willOpenSpy.events.length === 1);
    expect(willOpenSpy.count).to.be.equal(1);
    await waitForCondition(() => didOpenSpy.events.length === 1);
    expect(didOpenSpy.count).to.be.equal(1);
  });

  it('should hide close button in readonly mode', async () => {
    alert = await fixture(
      html`<sbb-alert title-content="Interruption" readonly>Alert content</sbb-alert>`,
    );

    expect(alert.shadowRoot!.querySelector('.sbb-alert__close-button-wrapper')).to.be.null;
  });
});
