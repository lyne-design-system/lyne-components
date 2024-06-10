import { assert, expect } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import { waitForCondition, waitForLitRender } from '../../core/testing.js';
import type { SbbContainerElement } from '../container.js';

import { SbbStickyBarElement } from './sticky-bar.js';

import '../container.js';

describe(`sbb-sticky-bar`, () => {
  let container: SbbContainerElement;
  let stickyBar: SbbStickyBarElement;
  const getIsSticking = (): boolean => {
    return stickyBar.hasAttribute('data-sticking');
  };

  beforeEach(async () => {
    await setViewport({ width: 320, height: 500 });
    container = await fixture(html`
      <sbb-container>
        <div><p>Situation 1</p></div>
        <div><p>Situation 2</p></div>
        <div><p>Situation 3</p></div>
        <div><p>Situation 4</p></div>
        <div><p>Situation 5</p></div>
        <div><p>Situation 6</p></div>
        <div><p>Situation 7</p></div>
        <div><p>Situation 8</p></div>
        <div><p>Situation 9</p></div>
        <div><p>Situation 10</p></div>
        <div><p>Situation 11</p></div>
        <div><p>Situation 12</p></div>
        <sbb-sticky-bar></sbb-sticky-bar>
      </sbb-container>
    `);
    stickyBar = container.querySelector('sbb-sticky-bar')!;
  });

  it('renders', async () => {
    assert.instanceOf(stickyBar, SbbStickyBarElement);
  });

  it('stops sticking when scrolling to bottom', async () => {
    await waitForCondition(async () => getIsSticking());
    expect(getIsSticking()).to.equal(true);

    window.scrollTo(0, 400);

    await waitForCondition(async () => !getIsSticking());

    expect(getIsSticking()).to.equal(false);
  });

  it('is settled when content is not long enough', async () => {
    await setViewport({ width: 320, height: 600 });
    container = await fixture(html`
      <sbb-container>
        <button>Container button</button>
        <sbb-sticky-bar>
          <button>Sticky bar button</button>
        </sbb-sticky-bar>
      </sbb-container>
    `);
    stickyBar = container.querySelector('sbb-sticky-bar')!;

    await waitForCondition(async () => !getIsSticking());

    expect(getIsSticking()).to.equal(false);
  });

  it('renders with expanded layout', async () => {
    container = await fixture(html`
      <sbb-container expanded>
        <button>Container button</button>
        <sbb-sticky-bar>
          <button>Sticky bar button</button>
        </sbb-sticky-bar>
      </sbb-container>
    `);
    stickyBar = container.querySelector('sbb-sticky-bar')!;

    expect(stickyBar).to.have.attribute('data-expanded');
  });

  it('expands the sticky-bar when container is expanded', async () => {
    container.expanded = true;

    await waitForLitRender(container);

    expect(stickyBar).to.have.attribute('data-expanded');
  });
});
