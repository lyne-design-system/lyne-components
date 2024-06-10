import { expect } from '@open-wc/testing';

import { extractTimeAndStringFromNoticeText } from './timetable-helper.js';
import type { Notice } from './timetable-properties.js';

describe('timetable-helper', () => {
  it('should return duration and text from notice', () => {
    const notice = {
      text: {
        template: 'The trip will start (10x)',
      },
    };
    const result = extractTimeAndStringFromNoticeText(notice as Notice);

    expect(result.duration).to.be.equal(10);
    expect(result.text).to.be.equal('The trip will start ');
  });

  it('should return default values when notice is undefined', () => {
    const result = extractTimeAndStringFromNoticeText(undefined);

    expect(result.duration).to.be.equal(0);
    expect(result.text).to.be.equal('');
  });
});
