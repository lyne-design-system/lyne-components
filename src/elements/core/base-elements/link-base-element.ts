import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { SbbLanguageController } from '../controllers.js';
import { hostAttributes } from '../decorators.js';
import { getLocalName } from '../dom.js';
import { i18nTargetOpensInNewWindow } from '../i18n.js';

import { SbbActionBaseElement } from './action-base-element.js';

import '../../screen-reader-only.js';

/** Enumeration for 'target' attribute in <a> HTML tag. */
export type LinkTargetType = '_blank' | '_self' | '_parent' | '_top';

/** Link base class. */
@hostAttributes({
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

  /** This will be forwarded as aria-label to the inner anchor element. */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  protected language = new SbbLanguageController(this);

  public constructor() {
    super();
    if (!isServer) {
      this.setupBaseEventHandlers();
    }
  }

  /** @internal */
  public override focus(options?: FocusOptions | undefined): void {
    this.shadowRoot!.querySelector<HTMLAnchorElement>('a')?.focus(options);
  }

  /** @internal */
  public override blur(): void {
    this.shadowRoot!.querySelector<HTMLAnchorElement>('a')?.blur();
  }

  /** @internal */
  public override click(): void {
    this.shadowRoot!.querySelector<HTMLAnchorElement>('a')?.click();
  }

  private _evaluateRelAttribute = (): string | typeof nothing => {
    return this.rel ? this.rel : this.target === '_blank' ? 'external noopener nofollow' : nothing;
  };

  /** Default render method for link-like components. Can be overridden if the LinkRenderVariables are not needed. */
  protected override render(): TemplateResult {
    return html`
      <a
        class="sbb-action-base ${this.localName ?? getLocalName(this)}"
        href=${this.href || nothing}
        ?download=${this.download}
        target=${this.target || nothing}
        rel=${this._evaluateRelAttribute()}
        aria-label=${this.accessibilityLabel || nothing}
        tabindex=${this.maybeDisabled ? '-1' : nothing}
        aria-disabled=${this.maybeDisabled ? 'true' : nothing}
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
