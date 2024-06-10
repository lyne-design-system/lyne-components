export type SbbLanguage = 'de' | 'en' | 'fr' | 'it';

export type SbbDateLike<T = Date> = T | string | number;

export type SbbTime = `${number}:${number}:${number}`;

export type SbbHorizontalFrom = 'zero' | 'micro' | 'small' | 'medium' | 'large' | 'wide' | 'ultra';

export type SbbIconPlacement = 'start' | 'end';

export type SbbOccupancy = 'high' | 'medium' | 'low' | 'none';

export type SbbOrientation = 'horizontal' | 'vertical';

export type SbbProtectiveRoom = 'none' | 'minimal' | 'ideal';

export type SbbStateChange = SbbCheckedStateChange | SbbDisabledStateChange | SbbValueStateChange;

export type SbbTimetableAppearance = 'first-level' | 'second-level';

export type SbbOpenedClosedState = 'closed' | 'opening' | 'opened' | 'closing';

export interface SbbCheckedStateChange {
  type: 'checked';
  checked: boolean;
}

export interface SbbDisabledStateChange {
  type: 'disabled';
  disabled: boolean;
}

export interface SbbValueStateChange {
  type: 'value';
  value: string | null;
}

declare global {
  interface GlobalEventHandlersEventMap {
    stateChange: CustomEvent<SbbStateChange>;
  }
}
