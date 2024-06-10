import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { sbbInputModalityDetector } from './input-modality-detector.js';

// Determine whether the element has a visible focus within.
export class SbbFocusVisibleWithinController implements ReactiveController {
  private _focusinHandler = (): void => {
    this._host.toggleAttribute(
      'data-has-visible-focus-within',
      sbbInputModalityDetector.mostRecentModality === 'keyboard',
    );
  };

  private _focusoutHandler = (): void => {
    this._host.removeAttribute('data-has-visible-focus-within');
  };

  public constructor(private _host: ReactiveControllerHost & HTMLElement) {
    this._host.addController(this);
  }

  public hostConnected(): void {
    this._host.addEventListener('focusin', this._focusinHandler);
    this._host.addEventListener('focusout', this._focusoutHandler);
  }

  public hostDisconnected(): void {
    this._host.removeEventListener('focusin', this._focusinHandler);
    this._host.removeEventListener('focusout', this._focusoutHandler);
  }
}
