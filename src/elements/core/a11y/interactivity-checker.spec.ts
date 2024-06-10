import { expect } from '@open-wc/testing';

import { InteractivityChecker } from './interactivity-checker.js';

describe('InteractivityChecker', () => {
  let testContainerElement: HTMLElement;
  let checker: InteractivityChecker;

  beforeEach(() => {
    testContainerElement = document.createElement('div');
    document.body.appendChild(testContainerElement);
    checker = new InteractivityChecker();
  });

  afterEach(() => {
    testContainerElement.remove();
    testContainerElement.innerHTML = '';
  });

  describe('isVisible', () => {
    it('should return false for a `display: none` element', () => {
      testContainerElement.innerHTML = `<input style="display: none;">`;
      const input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input)).to.be.equal(false);
    });

    it('should return false for the child of a `display: none` element', () => {
      testContainerElement.innerHTML = `<div style="display: none;">
           <input>
         </div>`;
      const input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input)).to.be.equal(false);
    });

    it('should return false for a `visibility: hidden` element', () => {
      testContainerElement.innerHTML = `<input style="visibility: hidden;">`;
      const input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input)).to.be.equal(false);
    });

    it('should return false for the child of a `visibility: hidden` element', () => {
      testContainerElement.innerHTML = `<div style="visibility: hidden;">
           <input>
         </div>`;
      const input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input)).to.be.equal(false);
    });

    it('should return true for an element with `visibility: hidden` ancestor and *closer* `visibility: visible` ancestor', () => {
      testContainerElement.innerHTML = `<div style="visibility: hidden;">
           <div style="visibility: visible;">
             <input>
           </div>
         </div>`;
      const input = testContainerElement.querySelector('input') as HTMLElement;

      expect(checker.isVisible(input)).to.be.equal(true);
    });

    it('should return true for an element without visibility modifiers', () => {
      const input = document.createElement('input');
      testContainerElement.appendChild(input);

      expect(checker.isVisible(input)).to.be.equal(true);
    });
  });
});
