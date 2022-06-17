import { EventEmitter } from '@stencil/core';
import { AnimationBuilder } from '../animations/animation-interface';

export interface InterfaceOverlayEventDetail<T = any> {
  data?: T;
  role?: string;
}

export interface InterfaceOverlay {
  el: HTMLElement;
  disableAnimation: boolean;
  keyboardClose: boolean;
  overlayIndex: number;
  presented: boolean;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  willPresent: EventEmitter<void>;
  didPresent: EventEmitter<void>;
  willDismiss: EventEmitter<InterfaceOverlayEventDetail>;
  didDismiss: EventEmitter<InterfaceOverlayEventDetail>;

  present(): Promise<void>;
  dismiss(data?: any, role?: string): Promise<boolean>;
  onDidDismiss<T>(): Promise<InterfaceOverlayEventDetail<T>>;
  onWillDismiss<T>(): Promise<InterfaceOverlayEventDetail<T>>;
}

export interface InterfaceHTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}

export interface InterfaceHTMLSbbOverlayElement extends InterfaceHTMLStencilElement {
  overlayIndex: number;
  backdropDismiss?: boolean;
  lastFocus?: HTMLElement;

  dismiss(data?: any, role?: string): Promise<boolean>;
}

export interface InterfaceOverlayController {
  create(opts?: any): Promise<HTMLElement>;
  dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
  getTop(): InterfaceHTMLSbbOverlayElement;
}
