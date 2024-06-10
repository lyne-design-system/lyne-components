import type { CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';

import { hostAttributes } from '../../core/decorators.js';
import { i18nNextDay, i18nSelectNextDay } from '../../core/i18n.js';
import { SbbDatepickerButton } from '../common.js';
import { findNextAvailableDate, type SbbInputUpdateEvent } from '../datepicker.js';

import '../../icon.js';
import style from './datepicker-next-day.scss?lit&inline';

/**
 * Combined with a `sbb-datepicker`, it can be used to move the date ahead.
 */
@customElement('sbb-datepicker-next-day')
@hostAttributes({
  slot: 'suffix',
})
export class SbbDatepickerNextDayElement extends SbbDatepickerButton {
  public static override styles: CSSResultGroup = style;

  protected iconName: string = 'chevron-small-right-small';
  protected i18nOffBoundaryDay: Record<string, string> = i18nNextDay;
  protected i18nSelectOffBoundaryDay = i18nSelectNextDay;
  protected findAvailableDate = findNextAvailableDate;

  protected onInputUpdated(event: CustomEvent<SbbInputUpdateEvent>): void {
    if (this.boundary !== event.detail.max) {
      this.boundary = event.detail.max!;
      this.setDisabledState(this.datePickerElement!);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-datepicker-next-day': SbbDatepickerNextDayElement;
  }
}
