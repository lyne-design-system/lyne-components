import { addMinutes, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { readDataNow, removeTimezoneFromISOTimeString } from '../core/datetime.js';
import type { Leg, PtRideLeg } from '../core/timetable.js';
import { isRideLeg } from '../core/timetable.js';

import style from './pearl-chain.scss?lit&inline';

type Status = 'progress' | 'future' | 'past';
type Time = {
  time?: Date;
  delay: number;
};

/**
 * It visually displays journey information.
 */
@customElement('sbb-pearl-chain')
export class SbbPearlChainElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /**
   * Define the legs of the pearl-chain.
   * Format:
   * `{"legs": [{"duration": 25}, ...]}`
   * `duration` in minutes. Duration of the leg is relative
   * to the total travel time. Example: departure 16:30, change at 16:40,
   * arrival at 17:00. So the change should have a duration of 33.33%.
   */
  @property({ type: Array }) public legs?: (Leg | PtRideLeg)[];

  /**
   * Per default, the current location has a pulsating animation. You can
   * disable the animation with this property.
   */
  @property({ attribute: 'disable-animation', type: Boolean }) public disableAnimation?: boolean;

  private _now(): number {
    const dataNow = readDataNow(this);
    return isNaN(dataNow) ? Date.now() : dataNow;
  }

  private _getAllDuration(legs: PtRideLeg[]): number {
    return legs?.reduce((sum: number, leg) => {
      const arrivalNoTz = removeTimezoneFromISOTimeString(leg.arrival?.time);
      const departureNoTz = removeTimezoneFromISOTimeString(leg.departure?.time);
      if (arrivalNoTz && departureNoTz) {
        return (
          sum +
          differenceInMinutes(
            removeTimezoneFromISOTimeString(leg.arrival.time)!,
            removeTimezoneFromISOTimeString(leg.departure.time)!,
          )
        );
      }
      return sum;
    }, 0);
  }

  private _isAllCancelled(legs: PtRideLeg[]): boolean {
    return legs?.some(
      (leg) =>
        leg?.serviceJourney?.serviceAlteration?.cancelled ||
        leg?.serviceJourney?.serviceAlteration?.partiallyCancelled,
    );
  }

  private _getRelativeDuration(legs: PtRideLeg[], leg: PtRideLeg): number {
    const arrivalNoTz = removeTimezoneFromISOTimeString(leg.arrival?.time);
    const departureNoTz = removeTimezoneFromISOTimeString(leg.departure?.time);
    if (arrivalNoTz && departureNoTz) {
      const duration = differenceInMinutes(
        removeTimezoneFromISOTimeString(leg.arrival.time)!,
        removeTimezoneFromISOTimeString(leg.departure.time)!,
      );
      const allDurations = this._getAllDuration(legs);

      if (allDurations === 0) return 100;

      return (duration / allDurations) * 100;
    }
    return 0;
  }

  private _getProgress(start?: Time, end?: Time): number {
    if (!start?.time || !end?.time) {
      return 0;
    }

    const startWithDelay = addMinutes(start.time, start.delay);
    const endWithDelay = addMinutes(end.time, end.delay);
    const total = differenceInMinutes(endWithDelay, startWithDelay);
    const progress = differenceInMinutes(this._now(), startWithDelay);

    return total && (progress / total) * 100;
  }

  private _getStatus(start?: Time, end?: Time): Status {
    const startWithDelay = start && start.time && addMinutes(start.time, start.delay);
    const endWithDelay = end && end.time && addMinutes(end.time, end.delay);

    if (
      startWithDelay &&
      isBefore(startWithDelay, this._now()) &&
      endWithDelay &&
      isAfter(endWithDelay, this._now())
    ) {
      return 'progress';
    } else if (endWithDelay && isBefore(endWithDelay, this._now())) {
      return 'past';
    }
    return 'future';
  }

  private _renderPosition(start?: Time, end?: Time): TemplateResult | undefined {
    const currentPosition = this._getProgress(start, end);
    if (currentPosition < 0 && currentPosition > 100) return undefined;

    const statusStyle = (): Record<string, string> => {
      return {
        '--sbb-pearl-chain-status-position': `${currentPosition}%`,
        ...(currentPosition >= 50 ? { transform: `translateX(-100%)` } : {}),
      };
    };

    const animation = this.disableAnimation ? 'sbb-pearl-chain__position--no-animation' : '';

    return html`<span
      style=${styleMap(statusStyle())}
      class="sbb-pearl-chain__position ${animation}"
    ></span>`;
  }

  protected override render(): TemplateResult {
    const rideLegs: PtRideLeg[] = this.legs?.filter((leg) => isRideLeg(leg)) as PtRideLeg[];

    const departureTime =
      rideLegs?.length && removeTimezoneFromISOTimeString(rideLegs[0]?.departure?.time);
    const departureWithDelay = departureTime && {
      time: departureTime,
      delay: rideLegs[0].departure.delay || 0,
    };

    const arrivalTime =
      rideLegs?.length &&
      removeTimezoneFromISOTimeString(rideLegs[rideLegs?.length - 1].arrival?.time);
    const arrivalTimeDelay = arrivalTime && {
      time: arrivalTime,
      delay: rideLegs.at(-1)?.arrival.delay || 0,
    };

    const departureNotServiced = ((): string => {
      return rideLegs &&
        rideLegs[0]?.serviceJourney?.stopPoints &&
        rideLegs[0]?.serviceJourney?.stopPoints[0].stopStatus === 'NOT_SERVICED'
        ? 'sbb-pearl-chain--departure-skipped'
        : '';
    })();

    const arrivalNotServiced = ((): string => {
      const lastLeg = rideLegs && rideLegs[rideLegs.length - 1];
      const stops = lastLeg && lastLeg.serviceJourney?.stopPoints;

      return stops && stops[stops.length - 1].stopStatus === 'NOT_SERVICED'
        ? 'sbb-pearl-chain--arrival-skipped'
        : '';
    })();

    const departureCancelClass = ((): string => {
      return rideLegs && rideLegs[0]?.serviceJourney?.serviceAlteration?.cancelled
        ? 'sbb-pearl-chain--departure-disruption'
        : '';
    })();

    const arrivalCancelClass = ((): string => {
      return rideLegs && rideLegs[rideLegs.length - 1]?.serviceJourney?.serviceAlteration?.cancelled
        ? 'sbb-pearl-chain--arrival-disruption'
        : '';
    })();

    const status =
      departureWithDelay &&
      arrivalTimeDelay &&
      this._getStatus(departureWithDelay, arrivalTimeDelay);

    const statusClassDeparture =
      rideLegs && status && !departureCancelClass ? 'sbb-pearl-chain__bullet--' + status : '';

    const statusClassArrival =
      rideLegs && status && !arrivalCancelClass
        ? 'sbb-pearl-chain__bullet--' + this._getStatus(undefined, arrivalTimeDelay)
        : '';

    if (this._isAllCancelled(rideLegs)) {
      return html`
        <div class="sbb-pearl-chain">
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain--departure-disruption"></span>
          <div class="sbb-pearl-chain__leg sbb-pearl-chain__leg--disruption"></div>
          <span class="sbb-pearl-chain__bullet sbb-pearl-chain--departure-disruption"></span>
        </div>
      `;
    }

    return html`
      <div class="sbb-pearl-chain">
        <span
          class="sbb-pearl-chain__bullet ${statusClassDeparture} ${departureNotServiced} ${departureCancelClass}"
        ></span>
        ${rideLegs?.map((leg: PtRideLeg, index: number) => {
          const { stopPoints, serviceAlteration } = leg?.serviceJourney || {};

          const duration = this._getRelativeDuration(rideLegs, leg);
          const departure = removeTimezoneFromISOTimeString(leg.departure?.time);
          const arrival = removeTimezoneFromISOTimeString(leg.arrival?.time);

          const isArrivalNotServiced =
            stopPoints && stopPoints[stopPoints.length - 1]?.stopStatus === 'NOT_SERVICED';
          const isArrivalPlanned =
            stopPoints && stopPoints[stopPoints.length - 1]?.stopStatus === 'PLANNED';
          const isDepartureNotServiced = stopPoints && stopPoints[0]?.stopStatus === 'NOT_SERVICED';

          const stopPointsBefore = index > 0 && rideLegs[index - 1].serviceJourney.stopPoints;
          const isBeforeLegArrivalNotServiced =
            stopPointsBefore &&
            stopPointsBefore[stopPointsBefore.length - 1]?.stopStatus === 'NOT_SERVICED';

          const skippedLeg =
            isArrivalNotServiced || (isDepartureNotServiced && isArrivalPlanned)
              ? 'sbb-pearl-chain__leg--skipped'
              : '';
          const departureSkippedBullet =
            isDepartureNotServiced || isBeforeLegArrivalNotServiced
              ? 'sbb-pearl-chain__stop--departure-skipped'
              : '';

          const cancelled = serviceAlteration?.cancelled ? 'sbb-pearl-chain__leg--disruption' : '';

          const legDepartureWithDelay = { time: departure, delay: leg.departure.delay || 0 };
          const legArrivalWithDelay = { time: arrival, delay: leg.arrival.delay || 0 };
          const status = this._getStatus(legDepartureWithDelay, legArrivalWithDelay);

          const legStatus =
            !cancelled &&
            !skippedLeg &&
            this._getStatus(legDepartureWithDelay, legArrivalWithDelay) &&
            'sbb-pearl-chain__leg--' + status;

          const legStyle = (): Record<string, string> => {
            return {
              '--sbb-pearl-chain-leg-width': `${duration}%`,
              ...(status === 'progress' && !cancelled && !skippedLeg
                ? {
                    '--sbb-pearl-chain-leg-status': `${this._getProgress(legDepartureWithDelay, legArrivalWithDelay)}%`,
                  }
                : {}),
            };
          };

          return html` <div
            class="sbb-pearl-chain__leg ${legStatus} ${cancelled} ${skippedLeg}"
            style=${styleMap(legStyle())}
          >
            ${index > 0 && index < rideLegs.length
              ? html`<span class="sbb-pearl-chain__stop ${departureSkippedBullet}"></span>`
              : nothing}
            ${status === 'progress' && !cancelled && !skippedLeg
              ? this._renderPosition(legDepartureWithDelay, legArrivalWithDelay)
              : nothing}
          </div>`;
        })}
        <span
          class="sbb-pearl-chain__bullet ${statusClassArrival} ${arrivalNotServiced} ${arrivalCancelClass}"
        ></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-pearl-chain': SbbPearlChainElement;
  }
}
