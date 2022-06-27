import { Component, h, Prop } from '@stencil/core';

import getDocumentLang from '../../global/helpers/get-document-lang';
import getDocumentWritingMode from '../../global/helpers/get-document-writing-mode';
import { InterfaceLinkAttributes } from './sbb-link.custom';
import { i18nTargetOpensInNewWindow } from '../../global/i18n';

/**
 * @slot icon - Slot used to display the icon, if one is set
 */

@Component({
  shadow: true,
  styleUrls: {
    default: 'styles/sbb-link.default.scss',
    shared: 'styles/sbb-link.shared.scss',
  },
  tag: 'sbb-link',
})
export class SbbLink {
  /**
   * If set to true, the browser will
   * show the download dialog on click.
   */
  @Prop() public download?: boolean;

  /** The href value you want to link to */
  @Prop() public hrefValue!: string;

  /**
   * The icon name we want to use,
   * choose from the small icon variants from
   * the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   * Inline variant doesn't support icons
   */
  @Prop() public icon?: string;

  /**
   * Pass in an id, if you need to identify
   * the link element.
   */
  @Prop() public idValue?: string;

  /**
   * Decide whether the icon should get flipped
   * horizontally if the document writing mode
   * is changed from ltr to rtl or vice versa.
   */
  @Prop() public iconFlip?: boolean;

  /**
   * The icon can either be place before or after
   * the text.
   */
  @Prop() public iconPlacement: InterfaceLinkAttributes['iconPlacement'] = 'start';

  /** The link text we want to visually show. */
  @Prop() public text!: string;

  /**
   * Text size, the link should get in the
   * non button variation.
   * With inline variant, the text size adapts to where it is used.
   */
  @Prop() public textSize: InterfaceLinkAttributes['textSize'] = 's';

  /**
   * Choose the link style variant.
   */
  @Prop() public variant: InterfaceLinkAttributes['variant'] = 'block';

  private get _inlineVariant(): boolean {
    return this.variant === 'inline' || this.variant === 'inline-negative';
  }

  public render(): JSX.Element {
    const textSizeClass = this._inlineVariant ? '' : ` sbb-link--text-${this.textSize}`;
    const currentLanguage = getDocumentLang();
    const currentWritingMode = getDocumentWritingMode();

    let openInNewWindow = false;

    if (!window.location.href.includes(this.hrefValue)) {
      openInNewWindow = true;
    }

    /**
     * Add additional CSS classes
     * ----------------------------------------------------------------
     */
    let iconPositionClass = '';

    if (this.icon) {
      iconPositionClass = ` sbb-link--icon-placement-${this.iconPlacement}`;
    }

    let iconFlipClass = '';

    if (this.icon && this.iconFlip) {
      iconFlipClass = ' sbb-link--icon-flip';
    }

    const variantClass = ` sbb-link--${this.variant}`;

    /**
     * Add additional attributes
     * ----------------------------------------------------------------
     */
    let additionalLinkAttributes = {};
    let ariaLabel = this.text;

    if (openInNewWindow) {
      additionalLinkAttributes = {
        rel: 'external noopener nofollow',
        target: '_blank',
      };
      ariaLabel += `. ${i18nTargetOpensInNewWindow[currentLanguage]}`;
    }

    if (this.idValue) {
      additionalLinkAttributes = {
        ...additionalLinkAttributes,
        id: this.idValue,
      };
    }

    return (
      <a
        aria-label={ariaLabel}
        class={`sbb-link
          ${textSizeClass}
          ${iconPositionClass}
          ${iconFlipClass}
          ${variantClass}`}
        download={this.download}
        dir={currentWritingMode}
        href={this.hrefValue}
        {...additionalLinkAttributes}
      >
        {this.icon && !this._inlineVariant ? (
          <span class="sbb-link__icon">
            <slot name="icon" />
          </span>
        ) : (
          ''
        )}

        <span class="sbb-link__text">{this.text}</span>
      </a>
    );
  }
}
