import type { PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbIconBase } from './icon-base.js';

/**
 * It displays an icon loaded from a registered namespace.
 */
@customElement('sbb-icon')
export class SbbIconElement extends SbbIconBase {
  /**
   * The provided name consisting of the namespace and the name of the icon.
   * If the namespace is missing, the default namespace "sbb" will be used.
   * E.g. `name` (will use "sbb" as namespace) or `namespace:name`.
   */
  @property({ reflect: true }) public name!: string;

  private _defaultAriaLabel = '';

  protected override async fetchSvgIcon(namespace: string, name: string): Promise<string> {
    // If the icon is changing, and we were using the defaultAriaLabel, reset it
    if (this.getAttribute('aria-label') === this._defaultAriaLabel) {
      this.removeAttribute('aria-label');
    }

    this._defaultAriaLabel = `Icon ${name.replace(/-/g, ' ')}`;

    // generate a default label in case user does not provide their own
    // and aria-hidden is set to "false"
    if (this.getAttribute('aria-hidden') === 'false' && !this.hasAttribute('aria-label') && name) {
      this.setAttribute('aria-label', this._defaultAriaLabel);
    }

    return super.fetchSvgIcon(namespace, name);
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('name')) {
      this.loadSvgIcon(this.name);
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-icon': SbbIconElement;
  }
}
