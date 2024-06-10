import { expect } from '@open-wc/testing';

import {
  getNextElementIndex,
  isArrowKeyPressed,
  isNextArrowKeyPressed,
  isPreviousArrowKeyPressed,
} from './arrow-navigation.js';

describe('isArrowKeyPressed', () => {
  it('should return false', () => {
    const event = new KeyboardEvent('keydown', { key: 'Test' });
    expect(isArrowKeyPressed(event)).to.be.equal(false);
  });

  it('should return true', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    expect(isArrowKeyPressed(event)).to.be.equal(true);
  });
});

describe('isPreviousArrowKeyPressed', () => {
  describe('ltr', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'ltr');
    });

    it('should return false', () => {
      const testEvent = new KeyboardEvent('keydown', { key: 'Test' });
      expect(isPreviousArrowKeyPressed(testEvent)).to.be.equal(false);
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      expect(isPreviousArrowKeyPressed(downEvent)).to.be.equal(false);
      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(isPreviousArrowKeyPressed(rightEvent)).to.be.equal(false);
    });

    it('should return true', () => {
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      expect(isPreviousArrowKeyPressed(upEvent)).to.be.equal(true);
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(isPreviousArrowKeyPressed(leftEvent)).to.be.equal(true);
    });
  });

  describe('rtl', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'rtl');
    });

    it('should return false', () => {
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(isPreviousArrowKeyPressed(leftEvent)).to.be.equal(false);
    });

    it('should return true', () => {
      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(isPreviousArrowKeyPressed(rightEvent)).to.be.equal(true);
    });
  });
});

describe('isNextArrowKeyPressed', () => {
  describe('ltr', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'ltr');
    });

    it('should return false', () => {
      const testEvent = new KeyboardEvent('keydown', { key: 'Test' });
      expect(isNextArrowKeyPressed(testEvent)).to.be.equal(false);
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      expect(isNextArrowKeyPressed(upEvent)).to.be.equal(false);
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(isNextArrowKeyPressed(leftEvent)).to.be.equal(false);
    });

    it('should return true', () => {
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      expect(isNextArrowKeyPressed(downEvent)).to.be.equal(true);
      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(isNextArrowKeyPressed(rightEvent)).to.be.equal(true);
    });
  });

  describe('rtl', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'rtl');
    });

    it('should return false', () => {
      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(isNextArrowKeyPressed(rightEvent)).to.be.equal(false);
    });

    it('should return true', () => {
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(isNextArrowKeyPressed(leftEvent)).to.be.equal(true);
    });
  });
});

describe('getNextElementIndex', () => {
  describe('ltr', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'ltr');
    });

    it('should return the next element', function () {
      const size = 10;
      const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const eventRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(getNextElementIndex(eventDown, 0, size)).to.be.equal(1);
      expect(getNextElementIndex(eventRight, 1, size)).to.be.equal(2);
      expect(getNextElementIndex(eventDown, size - 2, size)).to.be.equal(9);
      expect(getNextElementIndex(eventRight, size - 1, size)).to.be.equal(0);

      // current out of bound tests
      expect(getNextElementIndex(eventDown, -1, size)).to.be.equal(0);
      expect(getNextElementIndex(eventRight, size, size)).to.be.equal(0);
    });

    it('should return the previous element', function () {
      const size = 10;
      const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const eventLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(getNextElementIndex(eventUp, size - 1, size)).to.be.equal(8);
      expect(getNextElementIndex(eventLeft, size - 2, size)).to.be.equal(7);
      expect(getNextElementIndex(eventUp, 1, size)).to.be.equal(0);
      expect(getNextElementIndex(eventLeft, 0, size)).to.be.equal(9);

      // current out of bound tests
      expect(getNextElementIndex(eventUp, -1, size)).to.be.equal(size - 1);
      expect(getNextElementIndex(eventLeft, size, size)).to.be.equal(size - 1);
    });
  });

  describe('rtl', () => {
    beforeEach(() => {
      document.querySelector('html')!.setAttribute('dir', 'rtl');
    });

    it('should return the next element', function () {
      const size = 10;
      const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const eventLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      expect(getNextElementIndex(eventDown, 0, size)).to.be.equal(1);
      expect(getNextElementIndex(eventLeft, 1, size)).to.be.equal(2);
      expect(getNextElementIndex(eventDown, size - 2, size)).to.be.equal(9);
      expect(getNextElementIndex(eventLeft, size - 1, size)).to.be.equal(0);
    });

    it('should return the previous element', function () {
      const size = 10;
      const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const eventRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      expect(getNextElementIndex(eventUp, size - 1, size)).to.be.equal(8);
      expect(getNextElementIndex(eventRight, size - 2, size)).to.be.equal(7);
      expect(getNextElementIndex(eventUp, 1, size)).to.be.equal(0);
      expect(getNextElementIndex(eventRight, 0, size)).to.be.equal(9);
    });
  });
});
