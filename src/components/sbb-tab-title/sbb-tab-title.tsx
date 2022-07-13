import { Component, h, Host, Prop } from '@stencil/core';
import { InterfaceTabTitleAttributes } from './sbb-tab-title.custom';

/**
 * @slot unnamed - This slot will show the provided tab title.
 * @slot icon - Use this slot to display an icon to the left of the title, by providing the `sbb-icon` component.
 * @slot amount - Provide a `sbb-tab-amount` to show an amount to the right of the title.
 */

@Component({
  shadow: true,
  styleUrl: 'sbb-tab-title.scss',
  tag: 'sbb-tab-title',
})
export class SbbTabTitle {
  /** Title level */
  @Prop() public level?: InterfaceTabTitleAttributes['level'] = '1';

  /** Active tab boolean */
  @Prop()
  public active?: boolean;

  /** Disabled tab boolean */
  @Prop()
  public disabled?: boolean;

  public render(): JSX.Element {
    const TAGNAME = `h${Number(this.level) < 7 ? this.level : '1'}`;

    return (
      <Host>
        <TAGNAME
          class={`sbb-tab-title ${!this.disabled && this.active ? 'active' : ''} ${
            this.disabled ? 'disabled' : ''
          }`}
        >
          <slot name="icon"></slot>
          <span class="sbb-tab-title-text">
            <slot></slot>
          </span>
          <slot name="amount"></slot>
        </TAGNAME>
      </Host>
    );
  }
}
