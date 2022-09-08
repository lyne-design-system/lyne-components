jest.mock('../../global/guid');

import { SbbLinkList } from './sbb-link-list';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-link-list', () => {
  it('rendered with a slotted title', async () => {
    const { root } = await newSpecPage({
      components: [SbbLinkList],
      html: `<sbb-link-list title-level="2">
              <span slot="title">Help &amp; Contact</span>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Rückerstattungen</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Fundbüro</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Beschwerden</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Lob aussprechen</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Sachbeschädigung melden</sbb-link>
            </sbb-link-list>`,
    });
    /*
    Due to the missing onSlotEvent the following content is missing in this test case.
    `
      ...
      <mock:shadow-root>
        <sbb-title level="2" visual-level="5">
          <slot name="title">Help &amp; Contact</slot>
        </sbb-title>
        <ul aria-labelledby="sbb-link-list-title-1" role="list">
      ...
    `
    */
    expect(root).toEqualHtml(`
        <sbb-link-list
            title-level="2">
          <mock:shadow-root>
            <div class="sbb-link-list">
              <ul role="list">
                <li><slot name="link-0"></slot></li>
                <li><slot name="link-1"></slot></li>
                <li><slot name="link-2"></slot></li>
                <li><slot name="link-3"></slot></li>
                <li><slot name="link-4"></slot></li>
              </ul>
              <span>
                <slot></slot>
              </span>
            </div>
          </mock:shadow-root>
          <span slot="title">Help &amp; Contact</span>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-0" text-size="s">Rückerstattungen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-1" text-size="s">Fundbüro</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-2" text-size="s">Beschwerden</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-3" text-size="s">Lob aussprechen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-4" text-size="s">Sachbeschädigung melden</sbb-link>
        </sbb-link-list>
      `);
  });
  it('rendered with a title from properties', async () => {
    const { root } = await newSpecPage({
      components: [SbbLinkList],
      html: `<sbb-link-list title-level="2" title-content="Help &amp; Contact">
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Rückerstattungen</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Fundbüro</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Beschwerden</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Lob aussprechen</sbb-link>
              <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Sachbeschädigung melden</sbb-link>
            </sbb-link-list>`,
    });

    expect(root).toEqualHtml(`
        <sbb-link-list
            title-level="2"
            title-content="Help &amp; Contact">
          <mock:shadow-root>
            <div class="sbb-link-list">
              <sbb-title level="2" titleid="sbb-link-list-title-2" visual-level="5">
                <slot name="title">
                Help &amp; Contact
              </sbb-title>
              <ul aria-labelledby="sbb-link-list-title-2" role="list">
                <li><slot name="link-0"></slot></li>
                <li><slot name="link-1"></slot></li>
                <li><slot name="link-2"></slot></li>
                <li><slot name="link-3"></slot></li>
                <li><slot name="link-4"></slot></li>
              </ul>
              <span>
                <slot></slot>
              </span>
            </div>
          </mock:shadow-root>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-0" text-size="s">Rückerstattungen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-1" text-size="s">Fundbüro</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-2" text-size="s">Beschwerden</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-3" text-size="s">Lob aussprechen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-4" text-size="s">Sachbeschädigung melden</sbb-link>
        </sbb-link-list>
      `);
  });
  it('rendered without a title', async () => {
    const { root } = await newSpecPage({
      components: [SbbLinkList],
      html: `<sbb-link-list>
             <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Rückerstattungen</sbb-link>
             <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Fundbüro</sbb-link>
             <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Beschwerden</sbb-link>
             <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Lob aussprechen</sbb-link>
             <sbb-link href='https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html' text-size='s'>Sachbeschädigung melden</sbb-link>
            </sbb-link-list>`,
    });

    expect(root).toEqualHtml(`
        <sbb-link-list>
          <mock:shadow-root>
            <div class="sbb-link-list">
              <ul role="list">
                <li><slot name="link-0"></slot></li>
                <li><slot name="link-1"></slot></li>
                <li><slot name="link-2"></slot></li>
                <li><slot name="link-3"></slot></li>
                <li><slot name="link-4"></slot></li>
              </ul>
              <span>
                <slot></slot>
              </span>
            </div>
          </mock:shadow-root>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-0" text-size="s">Rückerstattungen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-1" text-size="s">Fundbüro</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-2" text-size="s">Beschwerden</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-3" text-size="s">Lob aussprechen</sbb-link>
          <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html" slot="link-4" text-size="s">Sachbeschädigung melden</sbb-link>
        </sbb-link-list>
      `);
  });
});
