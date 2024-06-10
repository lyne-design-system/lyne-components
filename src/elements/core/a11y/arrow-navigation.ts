import { getDocumentWritingMode } from '../dom.js';

interface PrevAndNextKeys {
  prevKey: string;
  nextKey: string;
}

function getPrevAndNextKeys(): PrevAndNextKeys {
  if (getDocumentWritingMode() === 'rtl') {
    return { prevKey: 'ArrowRight', nextKey: 'ArrowLeft' };
  } else {
    return { prevKey: 'ArrowLeft', nextKey: 'ArrowRight' };
  }
}

/**
 * Check if the key pressed is among those allowed for navigation.
 * @param event The keyboard event to check.
 */
export function isArrowKeyPressed(event: KeyboardEvent): boolean {
  return ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key);
}

/**
 * Check if the key pressed should move the navigation to the next element.
 * @param event The keyboard event to check.
 */
export function isPreviousArrowKeyPressed(event: KeyboardEvent): boolean {
  return event.key === 'ArrowUp' || event.key === getPrevAndNextKeys().prevKey;
}

/**
 * Check if the key pressed should move the navigation to the next element.
 * @param event The keyboard event to check.
 */
export function isNextArrowKeyPressed(event: KeyboardEvent): boolean {
  return event.key === 'ArrowDown' || event.key === getPrevAndNextKeys().nextKey;
}

/**
 * Check if the key pressed is among those allowed for navigation.
 * @param event The keyboard event to check.
 */
export function isArrowKeyOrPageKeysPressed(event: KeyboardEvent): boolean {
  return isArrowKeyPressed(event) || ['PageUp', 'PageDown', 'Home', 'End'].includes(event.key);
}

/**
 * Calculate the index of the next element based on the given offset.
 * @param currentIndex The index of the current element.
 * @param maxIndex The maximum permitted value (e.g. array size).
 * @param offset The amount to move by.
 */
function calcNextIndexInRange(currentIndex: number, maxIndex: number, offset: number): number {
  return (currentIndex + offset + maxIndex) % maxIndex;
}

function getLastIndex(size: number): number {
  return size - 1;
}

const firstIndex = 0;

/**
 * Gets the index of the element to move to, based on the keyboard input, the current element in the list and the list size.
 * @param event The keyboard event to check.
 * @param current The index of the current element in the list.
 * @param size The size of the list.
 * @returns if it is a 'previous' event, returns the index of the previous element,
 * or the index of the last one if the current element is the first in the list;
 * if it is a 'next' event, returns the index of the next element,
 * or the index of the first one, if the current is the last in the list.
 */
export function getNextElementIndex(event: KeyboardEvent, current: number, size: number): number {
  const { prevKey, nextKey } = getPrevAndNextKeys();

  if (event.key === prevKey || event.key === 'ArrowUp') {
    return current < firstIndex ? getLastIndex(size) : calcNextIndexInRange(current, size, -1);
  } else if (event.key === nextKey || event.key === 'ArrowDown') {
    return current >= size ? firstIndex : calcNextIndexInRange(current, size, 1);
  }
  return current;
}
