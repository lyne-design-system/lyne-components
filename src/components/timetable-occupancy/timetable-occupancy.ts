import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbLanguageController } from '../core/controllers/index.js';
import { i18nClass } from '../core/i18n/index.js';
import type { SbbOccupancy } from '../core/interfaces/index.js';
import { SbbNegativeMixin } from '../core/mixins/index.js';

import style from './timetable-occupancy.scss?lit&inline';

import '../screen-reader-only/index.js';
import '../timetable-occupancy-icon/index.js';

/**
 * Used in `sbb-timetable-row`, it displays information about wagon occupancy.
 */
@customElement('sbb-timetable-occupancy')
export class SbbTimetableOccupancyElement extends SbbNegativeMixin(LitElement) {
  public static override styles: CSSResultGroup = style;

  /** Occupancy for first class wagons. */
  @property({ attribute: 'first-class-occupancy' }) public firstClassOccupancy?: SbbOccupancy;

  /** Occupancy for second class wagons. */
  @property({ attribute: 'second-class-occupancy' }) public secondClassOccupancy?: SbbOccupancy;

  private _language = new SbbLanguageController(this);

  protected override render(): TemplateResult {
    return html` ${(this.firstClassOccupancy || this.secondClassOccupancy) &&
    html`
      <ul
        class="sbb-timetable-occupancy__list"
        role=${!this.firstClassOccupancy || !this.secondClassOccupancy ? 'presentation' : nothing}
      >
        ${[this.firstClassOccupancy, this.secondClassOccupancy].map(
          (occupancy?: string, index?: number) =>
            occupancy &&
            html`
              <li class="sbb-timetable-occupancy__list-item">
                <span class="sbb-timetable-occupancy__list-item-class" aria-hidden="true">
                  ${this.firstClassOccupancy && index === 0 ? '1' : '2'}.
                </span>
                <sbb-screen-reader-only>
                  ${`${
                    i18nClass[this.firstClassOccupancy && index === 0 ? 'first' : 'second'][
                      this._language.current
                    ]
                  }.`}
                </sbb-screen-reader-only>
                <sbb-timetable-occupancy-icon
                  class="sbb-timetable-occupancy__list-item-icon"
                  ?negative=${this.negative}
                  .occupancy=${occupancy}
                >
                </sbb-timetable-occupancy-icon>
              </li>
            `,
        )}
      </ul>
    `}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-timetable-occupancy': SbbTimetableOccupancyElement;
  }
}
