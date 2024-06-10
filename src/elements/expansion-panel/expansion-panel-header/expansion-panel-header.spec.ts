import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { EventSpy } from '../../core/testing.js';

import { SbbExpansionPanelHeaderElement } from './expansion-panel-header.js';

describe(`sbb-expansion-panel-header`, () => {
  let element: SbbExpansionPanelHeaderElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-expansion-panel-header>Header</sbb-expansion-panel-header>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbExpansionPanelHeaderElement);
  });

  it('should emit event on click', async () => {
    const spy = new EventSpy(SbbExpansionPanelHeaderElement.events.toggleExpanded);
    element.click();
    expect(spy.count).to.be.greaterThan(0);
  });

  it('should not emit event on click if disabled', async () => {
    element = await fixture(
      html`<sbb-expansion-panel-header disabled>Header</sbb-expansion-panel-header>`,
    );
    const spy = new EventSpy(SbbExpansionPanelHeaderElement.events.toggleExpanded);
    element.click();
    expect(spy.count).not.to.be.greaterThan(0);
  });
});
