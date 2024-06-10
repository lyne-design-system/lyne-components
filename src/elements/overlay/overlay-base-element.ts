import { type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { SbbFocusHandler } from '../core/a11y.js';
import { SbbOpenCloseBaseElement } from '../core/base-elements.js';
import { SbbLanguageController } from '../core/controllers.js';
import { hostContext, SbbScrollHandler } from '../core/dom.js';
import { EventEmitter } from '../core/eventing.js';
import { i18nDialog } from '../core/i18n.js';
import type { SbbOverlayCloseEventDetails } from '../core/interfaces.js';
import { SbbNegativeMixin } from '../core/mixins.js';
import { applyInertMechanism, removeInertMechanism } from '../core/overlay.js';
import type { SbbScreenReaderOnlyElement } from '../screen-reader-only.js';

// A global collection of existing overlays.
export const overlayRefs: SbbOverlayBaseElement[] = [];

export abstract class SbbOverlayBaseElement extends SbbNegativeMixin(SbbOpenCloseBaseElement) {
  /** This will be forwarded as aria-label to the relevant nested element to describe the purpose of the overlay. */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /** Emits whenever the component is closed. */
  protected override didClose: EventEmitter<SbbOverlayCloseEventDetails> = new EventEmitter(
    this,
    SbbOverlayBaseElement.events.didClose,
  );

  // The last element which had focus before the component was opened.
  protected lastFocusedElement?: HTMLElement;
  protected overlayCloseElement?: HTMLElement;
  protected overlayController!: AbortController;
  protected openOverlayController!: AbortController;
  protected focusHandler = new SbbFocusHandler();
  protected scrollHandler = new SbbScrollHandler();
  protected returnValue: any;
  protected ariaLiveRefToggle = false;
  protected ariaLiveRef!: SbbScreenReaderOnlyElement;
  protected language = new SbbLanguageController(this);

  protected abstract onOverlayAnimationEnd(event: AnimationEvent): void;
  protected abstract setOverlayFocus(): void;
  protected abstract closeAttribute: string;

  /** Closes the component. */
  public close(result?: any, target?: HTMLElement): any {
    if (this.state !== 'opened') {
      return;
    }

    this.returnValue = result;
    this.overlayCloseElement = target;
    const eventData: SbbOverlayCloseEventDetails = {
      returnValue: this.returnValue,
      closeTarget: this.overlayCloseElement,
    };

    if (!this.willClose.emit(eventData)) {
      return;
    }
    this.state = 'closing';
    this.removeAriaLiveRefContent();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.overlayController?.abort();
    this.overlayController = new AbortController();

    if (this.state === 'opened') {
      applyInertMechanism(this);
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    this.ariaLiveRef =
      this.shadowRoot!.querySelector<SbbScreenReaderOnlyElement>('sbb-screen-reader-only')!;

    super.firstUpdated(changedProperties);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.overlayController?.abort();
    this.openOverlayController?.abort();
    this.focusHandler.disconnect();
    this.removeInstanceFromGlobalCollection();
    removeInertMechanism();
  }

  protected attachOpenOverlayEvents(): void {
    this.openOverlayController = new AbortController();
    // Remove overlay label as soon as it is not needed any more to prevent accessing it with browse mode.
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        this.removeAriaLiveRefContent();
        this.onKeydownEvent(event);
      },
      {
        signal: this.openOverlayController.signal,
      },
    );
    window.addEventListener('click', () => this.removeAriaLiveRefContent(), {
      signal: this.openOverlayController.signal,
    });
  }

  protected onKeydownEvent(event: KeyboardEvent): void {
    if (this.state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      overlayRefs[overlayRefs.length - 1].close();
      return;
    }
  }

  protected removeInstanceFromGlobalCollection(): void {
    overlayRefs.splice(overlayRefs.indexOf(this as SbbOverlayBaseElement), 1);
  }

  // Close the component on click of any element that has the `closeAttribute` attribute.
  protected closeOnSbbOverlayCloseClick(event: Event): void {
    const overlayCloseElement = event
      .composedPath()
      .filter((e): e is HTMLElement => e instanceof window.HTMLElement)
      .find(
        (target) => target.hasAttribute(this.closeAttribute) && !target.hasAttribute('disabled'),
      );

    if (!overlayCloseElement) {
      return;
    }

    // Check if the target is a submission element within a form and return the form, if present
    const closestForm =
      overlayCloseElement.getAttribute('type') === 'submit'
        ? (hostContext('form', overlayCloseElement) as HTMLFormElement)
        : undefined;
    overlayRefs[overlayRefs.length - 1].close(closestForm, overlayCloseElement);
  }

  protected removeAriaLiveRefContent(): void {
    this.ariaLiveRef.textContent = '';
  }

  protected setAriaLiveRefContent(label?: string): void {
    this.ariaLiveRefToggle = !this.ariaLiveRefToggle;

    // If the text content remains the same, on VoiceOver the aria-live region is not announced a second time.
    // In order to support reading on every opening, we toggle an invisible space.
    this.ariaLiveRef.textContent = `${i18nDialog[this.language.current]}${
      label ? `, ${label}` : ''
    }${this.ariaLiveRefToggle ? ' ' : ''}`;
  }
}
