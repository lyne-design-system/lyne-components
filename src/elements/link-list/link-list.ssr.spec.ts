import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbLinkListElement } from './link-list.js';

import '../link.js';

describe(`sbb-link-list ${fixture.name}`, () => {
  let root: SbbLinkListElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-link-list title-level="2">
          <span slot="title">Help &amp; Contact</span>
          <sbb-block-link
            href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
            >Rückerstattungen</sbb-block-link
          >
          <sbb-block-link
            href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
            >Fundbüro</sbb-block-link
          >
          <sbb-block-link
            href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
            >Beschwerden</sbb-block-link
          >
          <sbb-block-link
            href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
            >Lob aussprechen</sbb-block-link
          >
          <sbb-block-link
            href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
            >Sachbeschädigung melden</sbb-block-link
          >
        </sbb-link-list>
      `,
      { modules: ['./link-list.js', '../link.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbLinkListElement);
  });
});
