// This file is freely inspired by Angular Material solution.
// Reference: https://github.com/angular/components/blob/main/src/cdk/platform/platform.ts
import { isServer } from 'lit';

// Whether the current platform supports the V8 Break Iterator. The V8 check
// is necessary to detect all Blink based browsers.
let hasV8BreakIterator: boolean;

// We need a try/catch around the reference to `Intl`, because accessing it in some cases can
// cause IE to throw. These cases are tied to particular versions of Windows and can happen if
// the consumer is providing a polyfilled `Map`. See:
// https://github.com/Microsoft/ChakraCore/issues/3189
// https://github.com/angular/components/issues/15687
try {
  hasV8BreakIterator = typeof Intl !== 'undefined' && (Intl as any).v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}

/** Whether the current browser is Microsoft Edge. */
export const isEdge = !isServer && /(edge)/i.test(navigator.userAgent);

/** Whether the current rendering engine is Microsoft Trident. */
export const isTrident = !isServer && /(msie|trident)/i.test(navigator.userAgent);

// EdgeHTML and Trident mock Blink specific things and need to be excluded from this check.
/** Whether the current rendering engine is Blink. */
export const isBlink =
  !isServer &&
  !!((window as any).chrome || hasV8BreakIterator) &&
  typeof CSS !== 'undefined' &&
  !isEdge &&
  !isTrident;

// Webkit is part of the userAgent in EdgeHTML, Blink and Trident. Therefore, we need to
// ensure that Webkit runs standalone and is not used as another engine's base.
/** Whether the current rendering engine is WebKit. */
export const isWebkit =
  !isServer && /AppleWebKit/i.test(navigator.userAgent) && !isBlink && !isEdge && !isTrident;

/** Whether the current platform is Apple iOS. */
export const isIOS =
  !isServer && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

// It's difficult to detect the plain Gecko engine, because most of the browsers identify
// them self as Gecko-like browsers and modify the userAgent's according to that.
// Since we only cover one explicit Firefox case, we can simply check for Firefox
// instead of having an unstable check for Gecko.
/** Whether the current browser is Firefox. */
export const isFirefox = !isServer && /(firefox|minefield)/i.test(navigator.userAgent);

/** Whether the current platform is Android. */
// Trident on mobile adds the android platform to the userAgent to trick detections.
export const isAndroid = !isServer && /android/i.test(navigator.userAgent) && !isTrident;

// Safari browsers will include the Safari keyword in their userAgent. Some browsers may fake
// this and just place the Safari keyword in the userAgent. To be more safe about Safari every
// Safari browser should also use Webkit as its layout engine.
/** Whether the current browser is Safari. */
export const isSafari = !isServer && /safari/i.test(navigator.userAgent) && isWebkit;

/**
 * Note: `userAgentData` is still experimental. If possible, avoid to use it.
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
 */
export const isChromium =
  !isServer &&
  (navigator as any).userAgentData?.brands?.some((data: any) => data.brand == 'Chromium');

/** Whether the application is being rendered in a Next.js environment. */
export const isNextjs = (): boolean => !!(globalThis as { next?: object }).next;
