import type { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import type { AbstractConstructor } from './constructor.js';

export declare class SbbDisabledMixinType {
  public set disabled(value: boolean);
  public get disabled(): boolean;
  protected isDisabledExternally(): boolean;
}

/**
 * Enhance your component with a disabled property.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbDisabledMixin = <T extends AbstractConstructor<LitElement>>(
  superClass: T,
): AbstractConstructor<SbbDisabledMixinType> & T => {
  abstract class SbbDisabledElement extends superClass implements Partial<SbbDisabledMixinType> {
    /** Whether the component is disabled. */
    @property({ reflect: true, type: Boolean })
    public set disabled(value: boolean) {
      // To provide the same behavior as the native disabled state,
      // any value is converted to a boolean.
      this._disabled = Boolean(value);
    }
    public get disabled(): boolean {
      return this._disabled || this.isDisabledExternally();
    }
    private _disabled: boolean = false;

    /**
     * Will be used as 'or' check to the current disabled state.
     * Can e.g. be used to read disabled state of a group.
     */
    protected isDisabledExternally(): boolean {
      return false;
    }
  }

  return SbbDisabledElement as unknown as AbstractConstructor<SbbDisabledMixinType> & T;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbDisabledTabIndexActionMixin = <T extends AbstractConstructor<LitElement>>(
  superClass: T,
): AbstractConstructor<SbbDisabledMixinType> & T => {
  abstract class SbbDisabledTabIndexAction
    extends SbbDisabledMixin(superClass)
    implements SbbDisabledMixinType
  {
    protected override willUpdate(changedProperties: PropertyValues<this>): void {
      super.willUpdate(changedProperties);

      if (!changedProperties.has('disabled')) {
        return;
      }

      // FIXME if tabindex is not needed in combination with aria-disabled,
      //  use the SbbDisabledMixin and implement a different willUpdate method.
      if (this.disabled) {
        this.setAttribute('aria-disabled', 'true');
        this.removeAttribute('tabindex');
      } else {
        this.removeAttribute('aria-disabled');
        this.setAttribute('tabindex', '0');
      }
    }
  }
  return SbbDisabledTabIndexAction as AbstractConstructor<SbbDisabledMixinType> & T;
};
