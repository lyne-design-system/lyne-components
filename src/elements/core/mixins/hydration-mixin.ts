import { isServer, type LitElement, type PropertyValues } from 'lit';

import { forwardEventToHost } from '../eventing.js';

import type { AbstractConstructor } from './constructor.js';

// Define the interface for the mixin
export declare abstract class SbbHydrationMixinType {
  /**
   * Returns a Promise that resolves when the element has completed hydration.
   * The Promise value is a boolean that is `true` if the element required hydration
   * and `false` if not.
   *
   * @return A promise of a boolean that resolves to true once the hydration completed.
   */
  public get hydrationComplete(): Promise<boolean>;

  /**
   * Called only if Declarative Shadow DOM is detected, during the initialization stage
   * but before the hydration stage.
   * When using server side rendering, this is called in willUpdate.
   */
  protected recoverSsrState?(): void;

  /** Reads and removes an attribute with the given name. Either returns the attributte value or null. */
  protected getAndRemoveAttribute(name: string): string | null;
}

/**
 * The key for globalThis lit hydration function.
 * If this is defined, then lit hydration is enabled.
 *
 * @see https://github.com/lit/lit/blob/main/packages/labs/ssr-client/src/lit-element-hydrate-support.ts
 */
const litElementHydrateSupport = 'litElementHydrateSupport';

/**
 * This is a similar check as in core/testing, but we want to avoid an import to that module from
 * a production module.
 * TODO: Should this be solved in a different way or removed in a production build?
 */
const hydrationSuppressed = isServer || (globalThis as any).testGroup === 'ssr-non-hydrated';

/**
 * This mixin extends a base class with functionality to check if hydration is completed.
 * It also delays slotchange events until hydration is complete.
 *
 * @param base The class to extend.
 * @returns A class extended with the hydration check functionality.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbHydrationMixin = <T extends AbstractConstructor<LitElement>>(
  base: T,
): AbstractConstructor<SbbHydrationMixinType> & T => {
  abstract class SbbHydrationMixinClass extends base implements Partial<SbbHydrationMixinType> {
    private _hydrationRequired = false;
    private _hydrationComplete = new Promise<boolean>(
      (resolve) => (this._resolveHydration = resolve),
    );
    private _resolveHydration!: (hydrationRequired: boolean) => void;

    /**
     * Returns a Promise that resolves when the element has completed hydration.
     * The Promise value is a boolean that is `true` if the element required hydration
     * and `false` if not.
     *
     * @return A promise of a boolean that resolves to true once the hydration completed.
     * @internal
     */
    public get hydrationComplete(): Promise<boolean> {
      return this._hydrationComplete;
    }

    private _handleBeforeHydrationSlotchange = (event: Event): void => {
      if (!this._hydrationRequired) {
        return;
      }
      event.stopImmediatePropagation();
      const target = event.target as HTMLSlotElement;
      this.hydrationComplete.then(() => forwardEventToHost(event, target));
    };

    protected override createRenderRoot(): HTMLElement | DocumentFragment {
      // Check whether hydration is needed by checking whether the shadow root
      // is available before createRenderRoot is called.
      this._hydrationRequired =
        !!this.shadowRoot &&
        litElementHydrateSupport in globalThis &&
        (isServer || !hydrationSuppressed);
      if (!this._hydrationRequired) {
        this._resolveHydration(false);
      } else {
        const slots = this.shadowRoot?.querySelectorAll('slot');
        if (slots?.length) {
          slots.forEach((slot) =>
            slot.addEventListener('slotchange', this._handleBeforeHydrationSlotchange, {
              capture: true,
            }),
          );
          this.hydrationComplete.then(() =>
            slots.forEach((slot) =>
              slot.removeEventListener('slotchange', this._handleBeforeHydrationSlotchange),
            ),
          );
        }
        this.recoverSsrState?.();
      }
      return super.createRenderRoot();
    }

    protected override willUpdate(changedProperties: PropertyValues<this>): void {
      super.willUpdate(changedProperties);

      if (isServer) {
        this.recoverSsrState?.();
      }
    }

    protected override update(changedProperties: PropertyValues<this>): void {
      // When hydration is needed, we wait the hydration process to finish, which is patched
      // into the update method of the LitElement base class.
      super.update(changedProperties);

      if (this._hydrationRequired) {
        this._hydrationRequired = false;
        this._resolveHydration(true);
      }
    }

    /**
     * Called only if Declarative Shadow DOM is detected, during the initialization stage
     * but before the hydration stage.
     * When using server side rendering, this is called in willUpdate.
     */
    protected recoverSsrState?(): void;

    /** Reads and removes an attribute with the given name. Either returns the attributte value or null. */
    protected getAndRemoveAttribute(name: string): string | null {
      const value = this.getAttribute(name);
      this.removeAttribute(name);
      return value;
    }
  }
  return SbbHydrationMixinClass as unknown as AbstractConstructor<SbbHydrationMixinType> & T;
};
