const isStr = (val: any): val is string => typeof val === 'string';

/**
 * Sanitizes the SVG element and all its child nodes.
 * Does not allow `<script>` elements, or any attributes that start with `on`, such as `onclick`.
 */
export const isValid = (elm: HTMLElement): boolean => {
  if (elm.nodeType === 1) {
    // is an Element node like <div>, <p> or <svg>
    if (elm.nodeName.toLowerCase() === 'script') {
      return false;
    }

    // do not allow attributes starting with `on`
    for (let i = 0; i < elm.attributes.length; i++) {
      const val = elm.attributes[i].name;
      if (isStr(val) && val.toLowerCase().indexOf('on') === 0) {
        return false;
      }
    }

    for (let i = 0; i < elm.childNodes.length; i++) {
      if (!isValid(elm.childNodes[i] as any)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Validates the SVG content by checking that it has only one root element `<svg>`,
 * adding the `color-immutable` class if the `colorImmutable` option is set to `true`,
 * and sanitizing the provided content as long as the `sanitize` property is not explicitly set to `false`.
 */
export const validateContent = (
  svgContent: string,
  sanitize = true,
  colorImmutable = false,
): string => {
  const div = document.createElement('div');
  div.innerHTML = svgContent;

  for (let i = div.childNodes.length - 1; i >= 0; i--) {
    if (div.childNodes[i].nodeName.toLowerCase() !== 'svg') {
      div.removeChild(div.childNodes[i]);
    }
  }

  // must only have 1 root element
  const svgElm = div.firstElementChild;

  if (svgElm && svgElm.nodeName.toLowerCase() === 'svg') {
    if (colorImmutable && !svgElm.classList.contains('color-immutable')) {
      svgElm.classList.add('color-immutable');
    }

    // do not sanitize the svg element
    if (sanitize === false) {
      return div.innerHTML;
    }

    // sanitize the svg element
    if (isValid(svgElm as any)) {
      return div.innerHTML;
    }
  }
  return '';
};
