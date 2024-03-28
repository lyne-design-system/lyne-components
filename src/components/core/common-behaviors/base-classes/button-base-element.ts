import { isServer } from 'lit';
import { property } from 'lit/decorators.js';

import { isEventPrevented } from '../../eventing';
import { hostAttributes } from '../host-attributes';

import { SbbActionBaseElement } from './action-base-element';

/** Enumeration for type attribute in <button> HTML tag. */
export type SbbButtonType = 'button' | 'reset' | 'submit';

/** Button base class. */
@hostAttributes({
  role: 'button',
  tabindex: '0',
  'data-button': '',
})
export abstract class SbbButtonBaseElement extends SbbActionBaseElement {
  /** The type attribute to use for the button. */
  @property() public type: SbbButtonType = 'button';

  /** The name of the button element. */
  @property()
  public set name(name: string) {
    this.setAttribute('name', `${name}`);
  }
  public get name(): string {
    return this.getAttribute('name') ?? '';
  }

  /** The value of the button element. */
  @property()
  public set value(value: string) {
    this.setAttribute('value', `${value}`);
  }
  public get value(): string {
    return this.getAttribute('value') ?? '';
  }

  /** The <form> element to associate the button with. */
  @property() public form?: string;

  private _handleButtonClick = async (event: MouseEvent): Promise<void> => {
    if (this.type === 'button' || (await isEventPrevented(event))) {
      return;
    }

    // Use querySelector with form and id selector, as the form property must
    // reference a valid <form> element
    const form = this.form
      ? (this.ownerDocument.querySelector(`form#${this.form}`) as HTMLFormElement)
      : this.closest('form');
    if (!form) {
      return;
    } else if (this.type === 'submit') {
      // `form.requestSubmit(element);` seems not to work for CustomElements, so the `element` parameter has been removed;
      // TODO: Check if solved in any way, see https://github.com/WICG/webcomponents/issues/814#issuecomment-1218452137
      form.requestSubmit();
    } else if (this.type === 'reset') {
      form.reset();
    }
  };

  /**
   * Prevents scrolling from pressing Space, when the event target is an action element.
   * Also sets data-active attribute.
   * @param event The origin event.
   */
  private _preventScrollOnSpaceKeydown = (event: KeyboardEvent): void => {
    if (event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).dataset.active = '';
    }
  };

  private _removeActiveMarker = (event: Event): void => {
    delete (event.target as HTMLElement).dataset.active;
  };

  /**
   * Dispatches a 'click' PointerEvent if the original keyboard event is a 'Space' press.
   * As verified with the native button, when 'Space' is pressed, a 'click' event is dispatched
   * after the 'keyup' event.
   * @param event The origin event.
   */
  private _dispatchClickEventOnSpaceKeyup = (event: KeyboardEvent): void => {
    if (event.key === ' ') {
      this._removeActiveMarker(event);
      this.dispatchClickEvent(event);
    }
  };

  public constructor() {
    super();
    if (!isServer) {
      this.setupBaseEventHandlers();

      const passiveOptions = { passive: true };
      this.addEventListener('click', this._handleButtonClick);
      this.addEventListener('keydown', this._preventScrollOnSpaceKeydown);
      this.addEventListener('keyup', this._dispatchClickEventOnSpaceKeyup, passiveOptions);
      this.addEventListener('blur', this._removeActiveMarker, passiveOptions);
    }
  }
}
