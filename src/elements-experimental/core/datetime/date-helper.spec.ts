import { expect } from '@open-wc/testing';

import { removeTimezoneFromISOTimeString, durationToTime } from './date-helper.js';

describe('removeTimezoneFromDate', () => {
  it('returns date in local timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00+03:00')).to.be.deep.equal(
      new Date('2022-10-28T21:16:00'),
    );
  });
  it('returns date with a negative timezone in local timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00-03:00')).to.be.deep.equal(
      new Date('2022-10-28T21:16:00'),
    );
  });
  it('returns date when date string has Z', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00Z')).to.be.deep.equal(
      new Date('2022-10-28T21:16:00'),
    );
  });
  it('returns undefined when date string is invalid', () => {
    expect(removeTimezoneFromISOTimeString('10-28T21:16:00+03:00')).to.be.undefined;
  });
  it('returns date when date string has no time', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28')).to.be.deep.equal(new Date('2022-10-28'));
  });
  it('returns date when date string has no timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00')).to.be.deep.equal(
      new Date('2022-10-28T21:16:00'),
    );
  });
});

describe('durationToTime', () => {
  it('should return only minutes', () => {
    expect(durationToTime(40, 'en')).to.be.deep.equal({ short: '40 min', long: '40 Minutes' });
  });

  it('should return day with hours', () => {
    expect(durationToTime(3000, 'en')).to.be.deep.equal({
      short: '2 d 2 h',
      long: '2 Days 2 Hours',
    });
  });

  it('should return hours', () => {
    expect(durationToTime(60, 'en')).to.be.deep.equal({ short: '1 h', long: '1 Hour' });
  });
});
