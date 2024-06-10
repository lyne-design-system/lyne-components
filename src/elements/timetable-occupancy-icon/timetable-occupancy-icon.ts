import type { CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbConnectedAbortController, SbbLanguageController } from '../core/controllers.js';
import { setOrRemoveAttribute } from '../core/dom.js';
import { i18nOccupancy } from '../core/i18n.js';
import type { SbbOccupancy } from '../core/interfaces.js';
import { SbbNegativeMixin } from '../core/mixins.js';
import { SbbIconBase } from '../icon.js';

import style from './timetable-occupancy-icon.scss?lit&inline';

/**
 * It displays a wagon's occupancy icon.
 */
@customElement('sbb-timetable-occupancy-icon')
export class SbbTimetableOccupancyIconElement extends SbbNegativeMixin(SbbIconBase) {
  public static override styles: CSSResultGroup = [SbbIconBase.styles, style];

  /** Wagon occupancy. */
  @property() public occupancy!: SbbOccupancy;

  private _abort = new SbbConnectedAbortController(this);
  private _language = new SbbLanguageController(this).withHandler(() => this._setAriaLabel());

  private async _setNameAndAriaLabel(): Promise<void> {
    if (!this.occupancy) {
      return;
    }

    let icon = `utilization-${this.occupancy}`;
    if (globalThis.window?.matchMedia('(forced-colors: active)').matches) {
      // high contrast
      icon += '-high-contrast';
    } else if (
      this.negative ||
      globalThis.window?.matchMedia('(prefer-color-scheme: dark)').matches
    ) {
      // dark
      icon += '-negative';
    }

    await this.loadSvgIcon(icon);
  }

  protected override async fetchSvgIcon(namespace: string, name: string): Promise<string> {
    this._setAriaLabel();
    return super.fetchSvgIcon(namespace, name);
  }

  private _setAriaLabel(): void {
    const label = (i18nOccupancy[this.occupancy] as Record<string, string>)?.[
      this._language.current
    ];
    setOrRemoveAttribute(this, 'aria-label', label);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    window
      .matchMedia('(forced-colors: active)')
      .addEventListener('change', () => this._setNameAndAriaLabel(), {
        signal: this._abort.signal,
      });
    window
      .matchMedia('(prefer-color-scheme: dark)')
      .addEventListener('change', () => this._setNameAndAriaLabel(), {
        signal: this._abort.signal,
      });
    this._setNameAndAriaLabel();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('occupancy') || changedProperties.has('negative')) {
      this._setNameAndAriaLabel();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-timetable-occupancy-icon': SbbTimetableOccupancyIconElement;
  }
}
