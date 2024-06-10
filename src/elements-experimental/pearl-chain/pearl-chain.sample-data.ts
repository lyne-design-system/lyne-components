const past2 = '2022-11-30T12:13:00+01:00';
const past = '2022-12-04T12:13:00+01:00';
const future = '2022-12-07T12:11:00+01:00';
const future2 = '2022-12-11T12:13:00+01:00';

const defaultService = {
  serviceAlteration: {
    cancelled: false,
    delayText: 'string',
    reachable: true,
    unplannedStopPointsText: '',
  },
};
const cancelledService = { serviceAlteration: { cancelled: true } };
const delayedService = { serviceAlteration: { delay: true } };
const isNotReachableService = { serviceAlteration: { reachable: false } };
const unplannedStopService = { serviceAlteration: { unplannedStopPointsText: 'unplannedStop' } };
const redirectedService = { serviceAlteration: { redirectedText: 'Ausnahmsweise kein Halt' } };
const departureNotServiced = {
  stopPoints: [{ stopStatus: 'NOT_SERVICED' }, { stopStatus: 'PLANNED' }],
};
const arrivalNotServiced = {
  stopPoints: [{ stopStatus: 'PLANNED' }, { stopStatus: 'NOT_SERVICED' }],
};

export const futureLeg: any = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: defaultService,
};

export const extendedLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: {
    ...defaultService,
    notices: [{ name: 'CI', text: { template: "Extended boarding time (45')" } }],
  },
};

export const longFutureLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: defaultService,
};

export const cancelledLeg: any = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: cancelledService,
};

export const progressLeg: any = {
  __typename: 'PTRideLeg',
  arrival: { time: future },
  departure: { time: past },
  serviceJourney: defaultService,
};

export const pastLeg: any = {
  __typename: 'PTRideLeg',
  arrival: { time: past },
  departure: { time: past2 },
  serviceJourney: defaultService,
};

export const delayedLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: delayedService,
};

export const notReachableLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: isNotReachableService,
};

export const unplannedStopLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: unplannedStopService,
};

export const redirectedOnDepartureLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: {
    ...redirectedService,
    ...departureNotServiced,
  },
};

export const redirectedOnArrivalLeg = {
  __typename: 'PTRideLeg',
  arrival: { time: future2 },
  departure: { time: future },
  serviceJourney: { ...redirectedService, ...arrivalNotServiced },
};
