import { isServer, type ReactiveController, type ReactiveControllerHost } from 'lit';

import { readConfig } from '../config.js';
import { AgnosticMutationObserver } from '../observers.js';

/**
 * The LanguageController is a reactive controller that observes the "lang" attribute
 * of the <html> tag.
 * On change of the "lang" attribute, it will request an update of connected
 * components.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
 */
export class SbbLanguageController implements ReactiveController {
  private static readonly _defaultLanguage = 'en';
  private static readonly _supportedLocales = ['en', 'de', 'fr', 'it'];

  /** A set of connected components that should be notified on language change. */
  private static readonly _listeners = new Set<SbbLanguageController>();

  /** MutationObserver that observes the "lang" attribute of the <html> element. */
  private static readonly _observer = new AgnosticMutationObserver((mutations) => {
    if (mutations[0].oldValue !== document.documentElement.getAttribute('lang')) {
      SbbLanguageController._listeners.forEach((l) => l._callHandlers());
    }
  });
  private static readonly _observerConfig = {
    attributeFilter: ['lang'],
    attributeOldValue: true,
  };

  /** Get the current language. */
  public static get current(): string {
    const language =
      (readConfig().language ??
        (isServer
          ? SbbLanguageController._defaultLanguage
          : document.documentElement.getAttribute('lang'))) ||
      SbbLanguageController._defaultLanguage;

    // Support e.g. cases like `de-ch`.
    const langAttributeNormalized = language.split('-')[0];
    return SbbLanguageController._supportedLocales.includes(langAttributeNormalized)
      ? langAttributeNormalized
      : SbbLanguageController._defaultLanguage;
  }

  /** Get the current language. */
  public get current(): string {
    return SbbLanguageController.current;
  }

  private _previousLanguage?: string;
  private _handlers: (() => void)[] = [];

  public constructor(private _host: ReactiveControllerHost) {
    this._host.addController(this);
  }

  /** Add a language change handler. */
  public withHandler(handler: () => void): this {
    // We use unshift here, to prepend additional handlers.
    // This ensures that requestUpdate is called after the other handlers.
    this._handlers.unshift(handler);
    return this;
  }

  public hostConnected(): void {
    if (!SbbLanguageController._listeners.size) {
      SbbLanguageController._observer.observe(
        document.documentElement,
        SbbLanguageController._observerConfig,
      );
    }

    SbbLanguageController._listeners.add(this);
    if (this._previousLanguage !== this.current) {
      this._callHandlers(this._previousLanguage !== undefined);
    }
  }

  public hostDisconnected(): void {
    this._previousLanguage = this.current;
    SbbLanguageController._listeners.delete(this);
    if (!SbbLanguageController._listeners.size) {
      SbbLanguageController._observer.disconnect();
    }
  }

  private _callHandlers(requestUpdate = true): void {
    this._handlers.forEach((h) => h());
    if (requestUpdate) {
      this._host.requestUpdate();
    }
  }
}
