import { Leg } from '../../global/interfaces/pearl-chain-properties';

export interface InterfaceSbbJourneySummaryAttributes {
  legs: Leg[];
  vias?: string[];
  origin: string;
  destination: string;
  arrivalWalk?: number;
  departure: string;
  arrival: string;
  departureWalk?: number;
  duration?: number;
}
