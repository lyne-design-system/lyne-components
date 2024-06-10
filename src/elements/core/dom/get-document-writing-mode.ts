import { isServer } from 'lit';

export const getDocumentWritingMode = (): string =>
  (!isServer && document.documentElement.getAttribute('dir')) || 'ltr';
