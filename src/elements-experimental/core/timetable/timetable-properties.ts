/* eslint-disable @typescript-eslint/naming-convention */

export interface ScheduledStopPointDetail {
  /** delay at arrival/departure (in minutes) */
  delay?: number;
  /** reason for delayed arrival/departure */
  delayText?: string | null;
  /** True if platform change (de:Gleis-/Kante-/Steg-Änderung) */
  quayChanged: boolean;
  /** Enduser text, saying whether there is a Quay change */
  quayChangedText?: string | null;
  /** A Quay (or platform or track) for any means of transport-mode / VehicleMode (train, bus, boat, etc.). */
  quayFormatted?: string | null;
  /** planned arrival/departure time */
  time: string;
}

export interface ServiceAlteration {
  /** If (partially) cancelled, enduser cancellation info. */
  cancelledText?: string | null;
  /** true: Journey is (partially) cancelled (default=false) */
  cancelled: boolean;
  /**
   * Enduser text, saying whether there is a delay on PTRideLeg (referring to first/last Stop).
   *
   */
  delayText: string;

  /** Journey is partially cancelled at beginning or end */
  partiallyCancelled: boolean;

  /** If partiallyCancelled, enduser info */
  partiallyCancelledText?: string | null;

  /** Enduser text, saying whether there is a Quay change */
  quayChangedText?: string | null;

  /** true: journey is redirected */
  redirected: boolean;
  redirectedFormatted?: string | null;
  redirectedText: string;

  /**
   * true: transport-product change from PTRideLeg to PTRideLeg is reachable
   * (de: Anschluss kann gehalten werden, see Trip::valid);
   * false: de:nicht mehr erreichbare Fahrt
   *
   */
  reachable: boolean;
  reachableText?: string | null;

  /** Text intended for passengers about an additional non-planned stop at a station */
  unplannedStopPointsText?: string | null;
}

/** Text template with optional formattable parameters. Useful to represent in UIs as clickable features like an e-Mail, phone or URL. */
export type LinkedText = {
  /** End-user text. */
  template?: string | null;
};

/** vehicle journeys stop point state */
export type StopStatusEnum =
  | 'BEGIN_PARTIAL_CANCELLATION'
  | 'CANCELLED'
  | 'END_PARTIAL_CANCELLATION'
  | 'NOT_SERVICED'
  | 'PLANNED'
  | 'UNPLANNED';

/** Stop point on a vehicle journey */
export interface ScheduledStopPoint {
  stopStatus?: StopStatusEnum;
}

/** Most critical boarding/alighting accessibility */
export type BoardingAlightingAccessibilityEnum =
  | 'BOARDING_ALIGHTING_BY_CREW'
  | 'BOARDING_ALIGHTING_BY_NOTIFICATION'
  | 'BOARDING_ALIGHTING_NOT_POSSIBLE'
  | 'BOARDING_ALIGHTING_SELF';

/** A classification of what caused a Situation (HIM category) */
export type PtSituationCauseEnum =
  | 'CONSTRUCTION_SITE'
  | 'DELAY'
  | 'DISTURBANCE'
  | 'END_MESSAGE'
  | 'INFORMATION'
  | 'TRAIN_REPLACEMENT_BY_BUS';

export type OccupancyEnum = 'HIGH' | 'LOW' | 'MEDIUM' | 'UNKNOWN';

/** Type of Notice */
export type NoticeTypeEnum = 'ATTRIBUTE' | 'INFO';

/** Mode of public transportation */
export type VehicleModeEnum =
  | 'BUS'
  | 'CABLEWAY'
  | 'CHAIRLIFT'
  | 'COG_RAILWAY'
  | 'ELEVATOR'
  | 'GONDOLA'
  | 'METRO'
  | 'PLANE'
  | 'SHIP'
  | 'TAXI'
  | 'TRAIN'
  | 'TRAMWAY'
  | 'UNKNOWN';

export type Leg = {
  /** duration from previous transfer point to current in minutes */
  duration?: number | null;
  /** Unique Index ordered within Trip */
  id: string;
};

/** Wrapper for a Notice with image/picto name and text */
export type Notice = {
  __typename?: 'Notice';
  /** Hint whether a passenger should see such a Notice being advertised */
  advertised?: boolean | null;
  /**
   * A two letter key, that might relate to MERITS codes for e.g. UIC Code 916-1 'reservation system code',
   * though they are specified by SBB Data-Mgmt.
   */
  name: string;
  /** Priority - A lower priority value means a higher importance */
  priority: number;
  /** Text format with linkable parameters */
  text?: LinkedText | null;
  /** Type of Notice */
  type: NoticeTypeEnum;
};

/** A period during which the situation should be published. */
export type PublicationWindow = {
  /** Situation within this publication window. */
  dailyDuration?: string | null;
  dailyStartingAt?: string | null;
  /** Local end date of situation */
  endDate?: string | null;
  endTime?: string | null;
  /** Local start date of situation */
  startDate?: string | null;
  startTime?: string | null;
};

/** A public transportation situation broadcast message affecting the planned PT operation */
export type PtSituationMessage = {
  /** Complete Footer/text of message */
  detail: string;
  /** Abbreviated Footer/text of message */
  detailShort?: string | null;
  /** A period during which the situation should be published. */
  distributionPeriod?: PublicationWindow | null;
  id: string;
  /** Priority rank: default = 100, low = 80, medium = 60, high = 40, de:Großereignis = 20 */
  priority: number;
  /** Heading of message */
  title: string;
};

/** A public transportation situation message affecting the planned PT operation */
export type PtSituation = {
  /** Index of first involved StopPoint in the PT situation */
  affectedStopPointFromIdx?: number | null;
  /** Index of last involved StopPoint in the PT situation */
  affectedStopPointToIdx?: number | null;
  /** Priority value: lowest = 80, medium = 60, highest = 40, de: Großereignis = 20 */
  broadcastMessages: PtSituationMessage[];
  /** A classification of what caused the SITUATION (HIM category) */
  cause?: PtSituationCauseEnum | null;
};

export type Occupancy = {
  /** occupancy first class */
  firstClass?: OccupancyEnum | null;
  /** occupancy second class */
  secondClass?: OccupancyEnum | null;
};

/**
 * A passenger carrying Service (physical public transport vehicle)
 * provided and operated by a certain Operator allocated to a concrete ServiceJourney
 */
export type ServiceProduct = {
  /** Icon-identifier to represent the specific submode  e.g. the symbol for an EC 1 */
  corporateIdentityIcon?: string | null;

  /** Corporate Identity Pictogram for e.g. Train 'SBB_oev_b_t02' */
  corporateIdentityPictogram?: string;
  /**
   * Usually referring to a specific commercial PT route (where direction might be either way), shown on vehicle displays. If this value is missing, it is probably a single-journey (de:Einzelfahrt)
   * example: 1
   */
  line?: string | null;
  /** Product name for e.g. "IC 1 753" */
  name: string;
  /**
   * Unique per OperatingDay and name (where 'IC 1' can run several times per day in either of opposite directions)
   * example: 753
   */
  number?: string | null;
  /** Defines the first ScheduledStop::routeIndex where this product is valid on a Line, null if unknown. */
  routeIndexFrom?: number | null;
  /** Defines the last ScheduledStop::routeIndex where this product is valid on a Line, null if unknown. */
  routeIndexTo?: number | null;
  /** A characterisation of the public transport operation according to the means of transport. */
  vehicleMode: VehicleModeEnum;
  /**
   * Short, displayable name of product-category (related to Vehicle).
   * example: IC
   */
  vehicleSubModeShortName?: string | null;
};

/** Realtime status of a Trip */
export type TripStatus = {
  /** false: Planned connection; true: Realtime alternative */
  alternative: boolean;
  /** Text intended for passengers about an alternative Trip, relates to alternative. */
  alternativeText?: string | null;
  /** PTRideLeg cancelled (de:Ausfall) */
  cancelled: boolean;
  /** reason for cancellation */
  cancelledText?: string | null;
  /** Contains at least one delay (de:Verspätung) on any PTRideLeg. */
  delayed: boolean;
  /** Contains at lease one unknown delay (de:Unbestimmte Verspätung) on any PTRideLeg. */
  delayedUnknown: boolean;
  /** PTRideLeg partially cancelled (de:Teilausfall). */
  partiallyCancelled: boolean;
  /** Contains at least one platform change (de:Gleis-/Kante-/Steg-Änderung) on any PTRideLeg */
  quayChanged: boolean;
};

/** Summary of most relevant aspects of the given Trip */
export type TripSummary = {
  arrival?: ScheduledStopPointDetail | null;
  /** minutes to walk from arrival station to home/searched arrival */
  arrivalWalk: number;
  /** Most critical boarding/alighting accessibility over all PTRideLeg boarding/alighting ScheduledStopPoints */
  boardingAlightingAccessibility?: BoardingAlightingAccessibilityEnum | null;
  departure?: ScheduledStopPointDetail | null;
  /** minutes to walk from home/start point to departure station */
  departureWalk: number;
  /** Direction of first Leg/ServiceJourney */
  direction?: string | null;
  /** duration in minutes */
  duration: number;
  /** Highest occupancyAverage on any PTRideLeg */
  occupancy: Occupancy;
  /** Passenger carrying Service for first Leg/ServiceJourney */
  product?: ServiceProduct | null;
  /** Overall Realtime status */
  tripStatus: TripStatus;
};

/** public transport journey connection */
export type ITripItem = {
  /** contains all info for ZVS::Reise to get TripOffer price from NOVA */
  id: string;
  /** List of transfer points */
  legs: Leg[];
  /**
   * List of legs travel hints
   * Useful for level 1, may be useful for legend, in bottom of results, in level 2
   */
  notices: Notice[];
  /** A hint/explanation is given if Trip was not found by a direct (first) search. In such a case origin/destination might not match exactly to request parameters. */
  searchHint?: string | null;
  /**
   * List of legs situation messages
   * Useful for level 1, may not be needed for level 2
   */
  situations: PtSituation[];
  /**
   * Summary of most relevant aspects of the given Trip and its PTRideLeg's
   * Useful for level 1, not needed for level 2
   */
  summary?: TripSummary | null;
  /** Rideable whole Trip should be true to book, otherwise TariffOffer makes no sense */
  valid: boolean;
};

/** Country of start and end Stop */
export type LegCountryCodes = {
  __typename?: 'LegCountryCodes';
  end?: string | null;
  start?: string | null;
};

export type Coordinate = {
  __typename?: 'Coordinate';
  latitude: number;
  longitude: number;
};

export type Place = {
  centroid?: Coordinate | null;
  id: string;
  name: string;
};

/** Public Transport Leg */
export type PtRideLeg = Leg & {
  __typename?: 'PTRideLeg';
  /** arrival time and quay */
  arrival: ScheduledStopPointDetail;
  /** Country of first and last Stop */
  countryCodes: LegCountryCodes;
  /** departure time and quay */
  departure: ScheduledStopPointDetail;
  /** duration from previous transfer point to current in minutes */
  duration?: number | null;
  /** End point */
  end?: Place | null;
  /** Unique Index ordered within Trip */
  id: string;
  /** (partial) journey details */
  serviceJourney: ServiceJourney;
  /** Start point */
  start?: Place | null;
};

export type StopPlace = Place & {
  __typename?: 'StopPlace';
  centroid?: Coordinate | null;
  id: string;
  name: string;
};

/** StopPlace to StopPlace transfer (up to passenger to find a proper service). */
export type PtConnectionLeg = Leg & {
  __typename?: 'PTConnectionLeg';
  /** Duration of LEG in minutes */
  duration?: number | null;
  /** Stop point */
  end?: StopPlace | null;
  /** Unique Index ordered within Trip */
  id: string;
  /** List of ServiceProduct attributes and journey hints */
  notices: Notice[];
  /** Start point */
  start?: StopPlace | null;
};

/** A passenger carrying vehicle journey for one specified operation day */
export type ServiceJourney = {
  /** (last) Direction information correlating to vehicle or perron (platform) display */
  direction?: string | null;
  /** ServiceJourney ID */
  id: string;
  /** List of ServiceProduct attributes and journey hints */
  notices: Notice[];
  /** Depending on a train, ship or whatever Vehicle there is a specific terminology for its appropriate quay-name. */
  quayTypeName?: string | null;
  /** Abbreviation for related quayTypeName. */
  quayTypeShortName?: string | null;
  /** Status (realtime changes) to Journey. */
  serviceAlteration: ServiceAlteration;
  /** Line operated by Vehicle operator(s) (list represents partial changes on the Line like Line::number, Line::operator). */
  serviceProducts: ServiceProduct[];
  /** List of situation messages */
  situations: PtSituation[];
  /** List of stop points */
  stopPoints: ScheduledStopPoint[];
};
