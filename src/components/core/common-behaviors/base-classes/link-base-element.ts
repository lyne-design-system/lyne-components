import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { getLocalName } from '../../dom';
import { isEventPrevented } from '../../eventing';
import { i18nTargetOpensInNewWindow } from '../../i18n';
import { LanguageController } from '../controllers';
import { hostAttributes } from '../host-attributes';

import { SbbActionBaseElement } from './action-base-element';

import '../../../screen-reader-only';

/** Enumeration for 'target' attribute in <a> HTML tag. */
export type LinkTargetType = '_blank' | '_self' | '_parent' | '_top';

/** Link base class. */
@hostAttributes({
  role: 'link',
  tabindex: '0',
  'data-link': '',
})
export abstract class SbbLinkBaseElement extends SbbActionBaseElement {
  /** The href value you want to link to. */
  @property() public href?: string;

  /** Where to display the linked URL. */
  @property() public target?: LinkTargetType | string;

  /** The relationship of the linked URL as space-separated link types. */
  @property() public rel?: string;

  /** Whether the browser will show the download dialog on click. */
  @property({ type: Boolean }) public download?: boolean;

  protected language = new LanguageController(this);

  public constructor() {
    super();
    if (!isServer) {
      this.setupBaseEventHandlers();
      this.addEventListener('click', this._triggerAnchorWhenNecessary);
    }
  }

  /**
   * Trigger an anchor element click after the event has finished the bubbling phase and
   * preventDefault() has not been called for the event.
   */
  private async _triggerAnchorWhenNecessary(event: MouseEvent): Promise<void> {
    const target = event.target as Element;
    const composedTarget = event.composedPath()[0] as Element;
    // We only want to trigger a click event on the inner anchor element, if the host element is the
    // event origin, which means the inner anchor element has not actually been activated/clicked.
    if (
      !this.href ||
      !target.tagName.startsWith('SBB-') ||
      target !== composedTarget ||
      (await isEventPrevented(event))
    ) {
      return;
    }

    // We are using dispatchEvent here, instead of just .click() in order to
    // prevent another click event from bubbling up the DOM tree.
    // TODO: The CTRL case does not work exactly the same as with a use interaction PointerEvent
    //  as the newly created tab immediately receives focus, instead of remaining on the current page.
    const { altKey, ctrlKey, metaKey, shiftKey } = event;
    target.shadowRoot?.querySelector('a')?.dispatchEvent(
      // We need to use a MouseEvent here, as PointerEvent does not work on Firefox.
      new MouseEvent('click', {
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
      }),
    );
  }

  private _evaluateRelAttribute = (): string | typeof nothing => {
    return this.rel ? this.rel : this.target === '_blank' ? 'external noopener nofollow' : nothing;
  };

  /** Default render method for link-like components. Can be overridden if the LinkRenderVariables are not needed. */
  protected override render(): TemplateResult {
    return html`
      <a
        class="sbb-action-base ${this.localName ?? getLocalName(this)}"
        role="presentation"
        tabindex="-1"
        href=${this.href ?? nothing}
        ?download=${this.download}
        target=${this.target ?? nothing}
        rel=${this._evaluateRelAttribute()}
      >
        ${this.renderTemplate()}
        ${!!this.href && this.target === '_blank'
          ? html`<sbb-screen-reader-only
              >. ${i18nTargetOpensInNewWindow[this.language.current]}</sbb-screen-reader-only
            >`
          : nothing}
      </a>
    `;
  }
}
