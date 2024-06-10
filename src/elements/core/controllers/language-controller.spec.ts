import { aTimeout, expect } from '@open-wc/testing';
import type { ReactiveControllerHost } from 'lit';

import { SbbLanguageController } from './language-controller.js';

describe('LanguageController', () => {
  let controller: SbbLanguageController;
  let host: ReactiveControllerHost & { requestUpdateCounter: number };

  beforeEach(() => {
    document.documentElement.removeAttribute('lang');
    host = {
      requestUpdateCounter: 0,
      addController() {},
      removeController() {},
      requestUpdate() {
        this.requestUpdateCounter += 1;
      },
      updateComplete: Promise.resolve(true),
    };
    controller = new SbbLanguageController(host);
    controller.hostConnected();
  });

  afterEach(() => {
    controller.hostDisconnected();
  });

  it('should match static and instance values', () => {
    expect(controller.current).to.equal(SbbLanguageController.current);
  });

  it('should not trigger requestUpdate without language change', () => {
    expect(host.requestUpdateCounter).to.equal(0);
  });

  it('should trigger requestUpdate on language change', async () => {
    document.documentElement.setAttribute('lang', 'de');
    await aTimeout(0);
    expect(host.requestUpdateCounter).to.equal(1);
  });

  it('should detect language of html tag', async () => {
    document.documentElement.setAttribute('lang', 'de');
    await aTimeout(0);
    expect(controller.current).to.equal('de');
  });

  it('should fallback to English if no lang attribute is present', async () => {
    document.documentElement.removeAttribute('lang');
    await aTimeout(0);
    expect(controller.current).to.equal('en');
  });

  it('should extract language from composed language key', async () => {
    document.documentElement.setAttribute('lang', 'fr-ch');
    await aTimeout(0);
    expect(controller.current).to.equal('fr');
  });

  it('should fallback to English if language is unknown', async () => {
    document.documentElement.setAttribute('lang', 'foo');
    await aTimeout(0);
    expect(controller.current).to.equal('en');
  });

  it('should call custom handler on connected and after change', async () => {
    const state = { counter: 0 };
    controller = new SbbLanguageController(host).withHandler(() => (state.counter += 1));
    expect(state.counter).to.equal(0);
    controller.hostConnected();
    expect(state.counter).to.equal(1);
    document.documentElement.setAttribute('lang', 'de');
    await aTimeout(0);
    expect(state.counter).to.equal(2);
  });

  // This test can only be run in isolation, as LanguageController has global state.
  // It is possible to verify this test by switching it to it.only.
  // eslint-disable-next-line no-constant-condition
  if (!'must be run in isolation') {
    it('should only update language if connected', async () => {
      document.documentElement.setAttribute('lang', 'fr');
      await aTimeout(0);
      expect(controller.current).to.equal('fr', 'Language should be detected when connected');
      controller.hostDisconnected();

      document.documentElement.setAttribute('lang', 'en');
      await aTimeout(0);

      expect(controller.current).to.equal('fr', 'Language should not be update when disconnected');

      controller.hostConnected();
      expect(controller.current).to.equal(
        'en',
        'Language should immediately be update when connected',
      );
    });
  }
});
