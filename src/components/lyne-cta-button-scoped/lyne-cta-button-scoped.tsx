import {
  Component,
  Element,
  h,
  Prop
} from '@stencil/core';
import ButtonIcon from 'lyne-icons/dist/icons/service-bell-small.svg';
import events from './lyne-cta-button-scoped.events';

@Component({
  scoped: true,
  shadow: false,
  styleUrl: 'lyne-cta-button-scoped.scss',
  tag: 'lyne-cta-button-scoped'
})

export class LyneCtaButtonScoped {

  /**
   * @sampleDocTag sampleName - sampleValue
   * @sampleDocTag2 sampleName2 - sampleValue2
   */
  @Prop() public samplePropForJSDocs = 'sample prop';

  /** Label text to show on the button */
  @Prop() public label = 'Default button text';

  /** Id which is send in the click event payload */
  @Prop() public eventId?: string;

  @Element() private _element: HTMLElement;

  private _buttonClick = (): void => {
    let eventDetail;

    if (this.eventId) {
      eventDetail = this.eventId;
    }

    const event = new CustomEvent(events.click, {
      bubbles: true,
      composed: true,
      detail: eventDetail
    });

    this._element.dispatchEvent(event);
  };

  public render(): JSX.Element {
    return <button class='button' onClick={this._buttonClick}>
      <span class='label'>{this.label}</span>
      <span class='arrow' innerHTML={ButtonIcon} />
    </button>;
  }
}
