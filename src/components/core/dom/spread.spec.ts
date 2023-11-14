import { expect, fixture } from '@open-wc/testing';
import { html, render, TemplateResult } from 'lit';

import { sbbSpread } from './spread';

describe('sbbSpread', () => {
  it('should spread attributes', async () => {
    const attributes: Record<string, any> = {
      truthy: true,
      'true-string': 'true',
      'false-string': 'false',
      words: 'This value is a string',
      numeric: 1,
      'boolean-false': false,
      nullish: null,
      'not-defined': undefined,
      zero: 0,
    };

    const element = await fixture(html` <div ${sbbSpread(attributes)}>Test element</div> `);

    expect(element).to.have.attribute('truthy');
    expect(element).to.have.attribute('words', 'This value is a string');
    expect(element).to.have.attribute('true-string', 'true');
    expect(element).to.have.attribute('false-string', 'false');
    expect(element).to.have.attribute('numeric', '1');
    expect(element).not.to.have.attribute('boolean-false');
    expect(element).not.to.have.attribute('zero');
    expect(element).not.to.have.attribute('nullish');
    expect(element).not.to.have.attribute('not-defined');
  });

  it('should groom attributes', async () => {
    const element: HTMLDivElement = await fixture(html`<div></div>`);

    const binding = (spreadAttributes: Record<string, any>): TemplateResult =>
      html`<span id="content" ${sbbSpread(spreadAttributes)}></span>`;

    const attributes: Record<string, any> = {
      'is-truthy': false,
      words: 'This value is a string',
      numeric: 1,
    };
    render(binding(attributes), element);

    const span: HTMLSpanElement = element.querySelector('#content');
    expect(span).not.to.have.attribute('is-truthy');
    expect(span).to.have.attribute('words', 'This value is a string');
    expect(span).to.have.attribute('numeric', '1');

    const groomAttributes: Record<string, any> = {
      'is-truthy': true,
      words: 'This value is a string',
      numeric: 0,
    };
    render(binding(groomAttributes), element);

    expect(span).to.have.attribute('is-truthy');
    expect(span).to.have.attribute('words', 'This value is a string');
    expect(span).not.to.have.attribute('numeric');
  });

  describe('binding order', () => {
    it('overrides attributes added before (both interpolated and not)', async () => {
      const element: HTMLDivElement = await fixture(html`<div></div>`);
      const attributes: Record<string, any> = {
        'is-truthy': false,
        words: null,
        numeric: 1,
      };

      const binding = (spreadAttributes: Record<string, any>): TemplateResult =>
        html`<span
          id="content"
          words="Two words"
          .numeric=${'99'}
          ${sbbSpread(spreadAttributes)}
        ></span>`;

      render(binding(attributes), element);

      const span: HTMLSpanElement = element.querySelector('#content');
      expect(span).not.to.have.attribute('is-truthy');
      expect(span).not.to.have.attribute('words');
      expect(span).to.have.attribute('numeric', '1');
    });

    it('overrides non-interpolated attributes added after', async () => {
      const element: HTMLDivElement = await fixture(html`<div></div>`);
      const attributes: Record<string, any> = {
        'is-truthy': false,
        words: 'This value is a string',
        numeric: 1,
      };

      const binding = (spreadAttributes: Record<string, any>): TemplateResult =>
        html`<span id="content" ${sbbSpread(spreadAttributes)} numeric=${'99'} words="ii"></span>`;

      render(binding(attributes), element);

      const span: HTMLSpanElement = element.querySelector('#content');
      expect(span).not.to.have.attribute('is-truthy');
      expect(span).to.have.attribute('words', 'This value is a string');
      expect(span).to.have.attribute('numeric', '99');
    });
  });
});
