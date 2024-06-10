import { expect } from '@open-wc/testing';

import { hostContext } from './host-context.js';

describe('hostContext', () => {
  it('should travers shadow dom boundaries', async () => {
    // <a><span><span></span></span></a>
    const tagName = 'a';
    const tag = document.createElement(tagName);
    const host = document.createElement('span');
    const shadow = host.attachShadow({ mode: 'open' });
    const divElementShadowDom = document.createElement('span');
    shadow.appendChild(divElementShadowDom);
    tag.appendChild(host);

    expect(hostContext(tagName, divElementShadowDom)).to.be.equal(tag);
  });

  it('should not find element itself', async () => {
    // <div><div></div></div>
    const tagName = 'div';
    const outer = document.createElement(tagName);
    const inner = document.createElement(tagName);
    outer.appendChild(inner);

    expect(hostContext(tagName, inner)).to.be.equal(outer);
  });
});
