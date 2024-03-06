import {
  type CSSResultGroup,
  LitElement,
  type PropertyValueMap,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { getNextElementIndex, isArrowKeyPressed, sbbInputModalityDetector } from '../../core/a11y';
import {
  hostAttributes,
  SbbNamedSlotListElementMixin,
  type WithListChildren,
} from '../../core/common-behaviors';
import { LanguageController } from '../../core/common-behaviors';
import { setAttribute } from '../../core/dom';
import { ConnectedAbortController } from '../../core/eventing';
import { i18nBreadcrumbEllipsisButtonLabel } from '../../core/i18n';
import { AgnosticResizeObserver } from '../../core/observers';
import type { SbbBreadcrumbElement } from '../breadcrumb';

import style from './breadcrumb-group.scss?lit&inline';

import '../../icon';

/**
 * It can be used as a container for one or more `sbb-breadcrumb` component.
 *
 * @slot - Use the unnamed slot to add `sbb-breadcrumb` elements.
 */
@hostAttributes({
  role: 'navigation',
})
@customElement('sbb-breadcrumb-group')
export class SbbBreadcrumbGroupElement extends SbbNamedSlotListElementMixin<
  SbbBreadcrumbElement,
  typeof LitElement
>(LitElement) {
  public static override styles: CSSResultGroup = style;
  protected override readonly listChildTagNames = ['SBB-BREADCRUMB'];

  @state() private _state?: 'collapsed' | 'manually-expanded';

  private _resizeObserver = new AgnosticResizeObserver(() => this._evaluateCollapsedState());
  private _abort = new ConnectedAbortController(this);
  private _language = new LanguageController(this);
  private _markForFocus = false;

  private _handleKeyDown(evt: KeyboardEvent): void {
    if (
      !this.listChildren.length ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this && (evt.target as HTMLElement).parentElement !== this)
    ) {
      return;
    }

    if (isArrowKeyPressed(evt)) {
      if (this._state === 'collapsed') {
        return this._focusNextCollapsed(evt);
      }
      this._focusNext(evt);
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._resizeObserver.observe(this);
    this.toggleAttribute('data-loaded', true);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  protected override willUpdate(changedProperties: PropertyValueMap<WithListChildren<this>>): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has('listChildren')) {
      this._syncBreadcrumbs();
    }
  }

  protected override updated(changedProperties: PropertyValueMap<WithListChildren<this>>): void {
    super.updated(changedProperties);
    if (changedProperties.has('listChildren')) {
      Promise.resolve().then(() => this._evaluateCollapsedState());
    }
    if (this._markForFocus && sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      this.listChildren[1]?.focus();

      // Reset mark for focus
      this._markForFocus = false;
    }
  }

  /** Apply the aria-current attribute to the last sbb-breadcrumb element. */
  private _syncBreadcrumbs(): void {
    this.listChildren
      .slice(0, -1)
      .filter((c) => c.hasAttribute('aria-current'))
      .forEach((c) => c.removeAttribute('aria-current'));
    this.listChildren[this.listChildren.length - 1]?.setAttribute('aria-current', 'page');

    // If it is not expandable, reset state
    if (this.listChildren.length < 3) {
      this._state = undefined;
    }
  }

  /**
   * Sets the focus on the correct element when the ellipsis breadcrumb is displayed and the user is navigating with keyboard's arrows.
   */
  private _focusNextCollapsed(evt: KeyboardEvent): void {
    const arrayCollapsed: SbbBreadcrumbElement[] = [
      this.listChildren[0],
      this.shadowRoot!.querySelector('#sbb-breadcrumb-ellipsis') as SbbBreadcrumbElement,
      this.listChildren[this.listChildren.length - 1],
    ];
    this._focusNext(evt, arrayCollapsed);
  }

  private _focusNext(
    evt: KeyboardEvent,
    breadcrumbs: SbbBreadcrumbElement[] = this.listChildren,
  ): void {
    const current: number = breadcrumbs.findIndex(
      (e) => e === document.activeElement || e === this.shadowRoot!.activeElement,
    );
    const nextIndex: number = getNextElementIndex(evt, current, breadcrumbs.length);
    breadcrumbs[nextIndex]?.focus();
    evt.preventDefault();
  }

  /**
   * Note: due to @State annotation on _state, this method triggers a new render; as a consequence, the focus is moved
   * to the `body`, so if the ellipsis element has focus, it's asynchronously forced to the first element.
   */
  private _expandBreadcrumbs(): void {
    this._state = 'manually-expanded';
    this._markForFocus = true;
  }

  /** Evaluate if the expanded breadcrumb element fits in page width, otherwise it needs ellipsis */
  private _evaluateCollapsedState(): void {
    if (!this._state && this.scrollWidth > this.offsetWidth) {
      this._state = 'collapsed';
      this._resizeObserver.disconnect();
    }
  }

  private _renderCollapsed(): TemplateResult {
    return html`
      <li class="sbb-breadcrumb-group__item">
        <slot name="li-0"></slot>
      </li>
      <li class="sbb-breadcrumb-group__item" id="sbb-breadcrumb-group-ellipsis">
        <sbb-icon
          name="chevron-small-right-small"
          class="sbb-breadcrumb-group__divider-icon"
        ></sbb-icon>
        <button
          type="button"
          id="sbb-breadcrumb-ellipsis"
          aria-label=${i18nBreadcrumbEllipsisButtonLabel[this._language.current]}
          aria-expanded="false"
          @click=${() => this._expandBreadcrumbs()}
        >
          ...
        </button>
      </li>
      <li class="sbb-breadcrumb-group__item">
        <sbb-icon
          name="chevron-small-right-small"
          class="sbb-breadcrumb-group__divider-icon"
        ></sbb-icon>
        <slot name=${`li-${this.listChildren.length - 1}`}></slot>
      </li>
    `;
  }

  private _renderExpanded(): TemplateResult[] {
    return this.listSlotNames().map(
      (name, index, array) => html`
        <li class="sbb-breadcrumb-group__item">
          <slot name=${name}></slot>
          ${index !== array.length - 1
            ? html`<sbb-icon
                name="chevron-small-right-small"
                class="sbb-breadcrumb-group__divider-icon"
              ></sbb-icon>`
            : nothing}
        </li>
      `,
    );
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-state', this._state);

    return html`
      <ol class="sbb-breadcrumb-group">
        ${this._state === 'collapsed' ? this._renderCollapsed() : this._renderExpanded()}
      </ol>
      ${this.renderHiddenSlot()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-breadcrumb-group': SbbBreadcrumbGroupElement;
  }
}
