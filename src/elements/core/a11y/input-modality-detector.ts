// This implementation is inspired by https://github.com/angular/components/blob/main/src/cdk/a11y/input-modality/input-modality-detector.ts

import { isServer } from 'lit';

import { getEventTarget } from '../eventing.js';

import {
  isFakeMousedownFromScreenReader,
  isFakeTouchstartFromScreenReader,
} from './fake-event-detection.js';

export type SbbInputModality = 'touch' | 'mouse' | 'keyboard' | 'program' | null;

/** Options to configure the behavior of the SbbInputModalityDetector. */
interface SbbInputModalityDetectorOptions {
  /** Keys to ignore when detecting keyboard input modality. */
  ignoreKeys?: number[];
}

const SHIFT = 16;
const CONTROL = 17;
const ALT = 18;
const META = 91; // WIN_KEY_LEFT
const MAC_META = 224;

/**
 * Default options for the SbbInputModalityDetector.
 *
 * Modifier keys are ignored by default (i.e. when pressed won't cause the service to detect
 * keyboard input modality) for two reasons:
 *
 * 1. Modifier keys are commonly used with mouse to perform actions such as 'right click' or 'open
 *    in new tab', and are thus less representative of actual keyboard interaction.
 * 2. VoiceOver triggers some keyboard events when linearly navigating with Control + Option (but
 *    confusingly not with Caps Lock). Thus, to have parity with other screen readers, we ignore
 *    these keys so, as to not update the input modality.
 *
 * Note that we do not by default ignore the right Meta key on Safari because it has the same key
 * code as the ContextMenu key on other browsers. When we switch to using event.key, we can
 * distinguish between the two.
 */
const inputModalityDetectorOptions: SbbInputModalityDetectorOptions = {
  ignoreKeys: [ALT, CONTROL, MAC_META, META, SHIFT],
};

/**
 * The amount of time needed to pass after a touchstart event in order for a subsequent mousedown
 * event to be attributed as mouse and not touch.
 *
 * Through trial and error it was found that a value of around 650ms seems appropriate.
 */
const touchBufferMs = 650;

/**
 * Event listener options that enable capturing and also mark the listener as passive if the browser
 * supports it.
 */
const modalityEventListenerOptions = {
  passive: true,
  capture: true,
};

/**
 * Service that detects the user's input modality.
 *
 * This service does not update the input modality when a user navigates with a screen reader
 * (e.g. linear navigation with VoiceOver, object navigation / browse mode with NVDA, virtual PC
 * cursor mode with JAWS). This is in part due to technical limitations (i.e. keyboard events do not
 * fire as expected in these modes) but is also arguably the correct behavior. Navigating with a
 * screen reader is akin to visually scanning a page, and should not be interpreted as actual user
 * input interaction.
 *
 * When a user is not navigating but *interacting* with a screen reader, this service attempts to
 * update the input modality to keyboard, but in general this service's behavior is largely
 * undefined.
 */
class SbbInputModalityDetector {
  /** The most recently detected input modality. */
  public get mostRecentModality(): SbbInputModality | null {
    return this._mostRecentModality;
  }

  public reset(): void {
    this._mostRecentModality = 'mouse';
    this._mostRecentTarget = null;
    this._lastTouchMs = 0;
  }

  /**
   * The most recent modality must be initialised with the value 'mouse' to cover the case where an action is
   * performed but no mouse or keyboard event has yet occurred on the page (e.g. `sbb-popover` with hover trigger).
   */
  private _mostRecentModality: SbbInputModality | null = 'mouse';

  /**
   * The most recently detected input modality event target. Is null if no input modality has been
   * detected or if the associated event target is null for some unknown reason.
   */
  public get mostRecentTarget(): HTMLElement | null {
    return this._mostRecentTarget;
  }
  private _mostRecentTarget: HTMLElement | null = null;

  /** Options for this SbbInputModalityDetector. */
  private readonly _options: SbbInputModalityDetectorOptions = {
    ...inputModalityDetectorOptions,
  };

  /**
   * The timestamp of the last touch input modality. Used to determine whether mousedown events
   * should be attributed to mouse or touch.
   */
  private _lastTouchMs = 0;

  /**
   * Handles keydown events. Must be an arrow function in order to preserve the context when it gets
   * bound.
   */
  private _onKeydown = (event: KeyboardEvent): void => {
    // If this is one of the keys we should ignore, then ignore it and don't update the input
    // modality to keyboard.
    if (this._options?.ignoreKeys?.some((keyCode) => keyCode === event.keyCode)) {
      return;
    }

    this._mostRecentModality = 'keyboard';
    this._mostRecentTarget = getEventTarget(event);
  };

  /**
   * Handles mousedown events. Must be an arrow function in order to preserve the context when it
   * gets bound.
   */
  private _onMousedown = (event: MouseEvent): void => {
    // Touches trigger both touch and mouse events, so we need to distinguish between mouse events
    // that were triggered via mouse vs touch. To do so, check if the mouse event occurs closely
    // after the previous touch event.
    if (Date.now() - this._lastTouchMs < touchBufferMs) {
      return;
    }

    // Fake mousedown events are fired by some screen readers when controls are activated by the
    // screen reader. Attribute them to keyboard input modality.
    this._mostRecentModality = isFakeMousedownFromScreenReader(event) ? 'keyboard' : 'mouse';
    this._mostRecentTarget = getEventTarget(event);
  };

  /**
   * Handles touchstart events. Must be an arrow function in order to preserve the context when it
   * gets bound.
   */
  private _onTouchstart = (event: TouchEvent): void => {
    // Same scenario as mentioned in _onMousedown, but on touch screen devices, fake touchstart
    // events are fired. Again, attribute to keyboard input modality.
    if (isFakeTouchstartFromScreenReader(event)) {
      this._mostRecentModality = 'keyboard';
      this._mostRecentTarget = getEventTarget(event);
      return;
    }

    // Store the timestamp of this touch event, as it's used to distinguish between mouse events
    // triggered via mouse vs touch.
    this._lastTouchMs = Date.now();

    this._mostRecentModality = 'touch';
    this._mostRecentTarget = getEventTarget(event);
  };

  public constructor() {
    if (!isServer) {
      document.addEventListener('keydown', this._onKeydown, modalityEventListenerOptions);
      document.addEventListener('mousedown', this._onMousedown, modalityEventListenerOptions);
      document.addEventListener('touchstart', this._onTouchstart, modalityEventListenerOptions);
    }
  }
}

export const sbbInputModalityDetector = new SbbInputModalityDetector();

// Set the input modality in order to avoid showing the outline in Safari.
export function setModalityOnNextFocus(elementToFocus: HTMLElement | null | undefined): void {
  if (!elementToFocus) {
    return;
  }

  const mostRecentModality = sbbInputModalityDetector.mostRecentModality;

  // Set focus origin to element which should receive focus
  if (!(elementToFocus && mostRecentModality !== null)) {
    return;
  }
  elementToFocus.addEventListener(
    'focus',
    () => {
      elementToFocus.setAttribute('data-focus-origin', mostRecentModality);
      elementToFocus.addEventListener(
        'blur',
        () => elementToFocus.removeAttribute('data-focus-origin'),
        {
          once: true,
        },
      );
    },
    { once: true },
  );
}
