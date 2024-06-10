import { assert, expect } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbImageElement } from './image.js';

describe(`sbb-image ${fixture.name}`, () => {
  let root: SbbImageElement;
  const url = import.meta.resolve('../clock/assets/sbb_clock_face.svg');

  it('renders', async () => {
    root = await fixture(html`<sbb-image image-src=${url}></sbb-image>`, {
      modules: ['./image.js'],
    });
    assert.instanceOf(root, SbbImageElement);
  });

  const urls = [
    { name: 'fully qualified url', url },
    { name: 'local url', url: 'src/elements/clock/assets/sbb_clock_face.svg' },
    { name: 'local root url', url: '/src/elements/clock/assets/sbb_clock_face.svg' },
  ];
  for (const { name, url } of urls) {
    it(`should work with ${name}`, async () => {
      root = await fixture(html`<sbb-image image-src=${url}></sbb-image>`, {
        modules: ['./image.js'],
      });
      const sources = Array.from(root.shadowRoot!.querySelectorAll('source'));
      expect(sources.length).greaterThan(0);
      for (const source of sources) {
        expect(source.srcset.startsWith(url)).to.be.true;
      }
    });
  }
});
