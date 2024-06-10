import { html, type LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

import { getLocalName } from '../dom.js';

import type { AbstractConstructor } from './constructor.js';
import { SbbHydrationMixin, type SbbHydrationMixinType } from './hydration-mixin.js';

import '../../screen-reader-only.js';

const SSR_CHILD_COUNT_ATTRIBUTE = 'data-ssr-child-count';
const SLOTNAME_PREFIX = 'li';

/**
 * Helper type for willUpdate or similar checks.
 * Allows the usage of the string literal 'listChildren'.
 *
 * @example
 * protected override willUpdate(changedProperties: PropertyValues<WithListChildren<this>>): void {
 *   if (changedProperties.has('listChildren')) {
 *     ...
 *   }
 * }
 */
export type WithListChildren<
  T extends SbbNamedSlotListMixinType<C>,
  C extends HTMLElement = HTMLElement,
> = T & { listChildren: C[] };

export declare abstract class SbbNamedSlotListMixinType<
  C extends HTMLElement,
> extends SbbHydrationMixinType {
  protected abstract readonly listChildLocalNames: string[];
  @state() protected listChildren: C[];
  protected renderList(attributes?: {
    class?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
  }): TemplateResult;
  protected listSlotNames(): string[];
  protected renderHiddenSlot(): TemplateResult;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbNamedSlotListMixin = <
  C extends HTMLElement,
  T extends AbstractConstructor<LitElement>,
>(
  superClass: T,
): AbstractConstructor<SbbNamedSlotListMixinType<C>> & T => {
  /**
   * This base class provides named slot list observer functionality.
   * This allows using the pattern of rendering a named slot for each child, which allows
   * wrapping children in a ul/li list.
   */
  abstract class NamedSlotListElement<C extends HTMLElement = HTMLElement>
    extends SbbHydrationMixin(superClass)
    implements Partial<SbbNamedSlotListMixinType<C>>
  {
    /** A list of upper-cased tag names to match against. (e.g. SBB-LINK) */
    protected abstract readonly listChildLocalNames: string[];

    /**
     * A list of children with the defined tag names.
     * This array is only updated, if there is an actual change
     * to the child elements.
     */
    @state() protected listChildren: C[] = [];

    public override connectedCallback(): void {
      super.connectedCallback();
      this.shadowRoot?.addEventListener('slotchange', this._handleSlotchange, { passive: true });
    }

    public override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.shadowRoot?.removeEventListener('slotchange', this._handleSlotchange);
    }

    private _handleSlotchange = (): void => {
      const listChildren = Array.from(this.children ?? []).filter((e): e is C =>
        this.listChildLocalNames.includes(e.localName),
      );
      // If the slotted child instances have not changed, we can skip syncing and updating
      // the link reference list.
      if (
        listChildren.length === this.listChildren.length &&
        this.listChildren.every((e, i) => listChildren[i] === e)
      ) {
        return;
      }

      this.listChildren
        .filter((c) => !listChildren.includes(c))
        .forEach((c) => c.removeAttribute('slot'));
      this.listChildren = listChildren;
      this.listChildren.forEach((c, index) =>
        c.setAttribute('slot', `${SLOTNAME_PREFIX}-${index}`),
      );

      // Remove the ssr attribute, once we have actually initialized the children elements.
      this.removeAttribute(SSR_CHILD_COUNT_ATTRIBUTE);
    };

    /**
     * Renders list and list slots for slotted children or an amount of list slots
     * corresponding to the `data-ssr-child-count` attribute value.
     *
     * This is a possible optimization for SSR, as in an SSR Lit environment
     * other elements are not available, but might be available in the meta
     * framework wrapper (like e.g. React). This allows to provide the amount of
     * children to be passed via the `data-ssr-child-count` attribute value.
     */
    protected renderList(
      attributes: { class?: string; ariaLabel?: string; ariaLabelledby?: string } = {},
    ): TemplateResult {
      const listSlotNames = this.listSlotNames();

      if (listSlotNames.length >= 2) {
        return html`
          <ul
            class=${attributes.class || (this.localName ?? getLocalName(this))}
            aria-label=${attributes.ariaLabel || nothing}
            aria-labelledby=${attributes.ariaLabelledby || nothing}
          >
            ${listSlotNames.map((name) => html`<li><slot name=${name}></slot></li>`)}
          </ul>
          ${this.renderHiddenSlot()}
        `;
      } else if (listSlotNames.length === 1) {
        return html`<sbb-screen-reader-only>${attributes.ariaLabel}</sbb-screen-reader-only>
          <span class=${attributes.class || (this.localName ?? getLocalName(this))}>
            <span><slot name=${listSlotNames[0]}></slot></span>
          </span>
          ${this.renderHiddenSlot()} `;
      } else {
        return this.renderHiddenSlot();
      }
    }

    /**
     * Returns an array of list slot names with the length corresponding to the amount of matched
     * children or the `data-ssr-child-count` attribute value.
     *
     * This is a possible optimization for SSR, as in an SSR Lit environment
     * other elements are not available, but might be available in the meta
     * framework wrapper (like e.g. React). This allows to provide the amount of
     * children to be passed via the `data-ssr-child-count` attribute value.
     */
    protected listSlotNames(): string[] {
      const listChildren = this.listChildren.length
        ? this.listChildren
        : Array.from({ length: +(this.getAttribute(SSR_CHILD_COUNT_ATTRIBUTE) ?? 0) });
      return listChildren.map((_, i) => `${SLOTNAME_PREFIX}-${i}`);
    }

    /**
     * Returns a hidden slot, which is intended as the children change detection.
     * When an element without a slot attribute is slotted to the element, it triggers
     * the slotchange event, which can be used to assign it to the appropriate named slot.
     */
    protected renderHiddenSlot(): TemplateResult {
      return html`<span hidden><slot></slot></span>`;
    }
  }

  return NamedSlotListElement as unknown as AbstractConstructor<SbbNamedSlotListMixinType<C>> & T;
};
