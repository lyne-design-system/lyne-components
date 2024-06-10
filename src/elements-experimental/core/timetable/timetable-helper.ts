/* eslint-disable @typescript-eslint/naming-convention */

import type { Leg, Notice } from './timetable-properties.js';

export const isRideLeg = (leg: any): leg is Extract<Leg, { __typename: 'PTRideLeg' }> => {
  return leg?.__typename === 'PTRideLeg';
};

export const isConnectionLeg = (
  leg: any,
): leg is Extract<Leg, { __typename: 'PTConnectionLeg' }> => {
  return leg?.__typename === 'PTConnectionLeg';
};

export const extractTimeAndStringFromNoticeText = (
  notice?: Notice,
): { duration: number; text: string } => {
  const firstIndex = notice?.text?.template && notice.text.template.indexOf('(') + 1;
  const noticeDuration = notice?.text?.template?.substring(
    firstIndex || 0,
    notice?.text?.template.indexOf(')'),
  );

  return {
    duration: (noticeDuration && +noticeDuration.substring(0, noticeDuration.length - 1)) || 0,
    text: notice?.text?.template?.split('(')[0] || '',
  };
};
