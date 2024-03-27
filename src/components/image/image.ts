import { spread } from '@open-wc/lit-helpers';
import {
  SbbBreakpointZeroMin,
  SbbBreakpointZeroMax,
  SbbBreakpointMicroMin,
  SbbBreakpointMicroMax,
  SbbBreakpointSmallMin,
  SbbBreakpointSmallMax,
  SbbBreakpointMediumMin,
  SbbBreakpointMediumMax,
  SbbBreakpointLargeMin,
  SbbBreakpointLargeMax,
  SbbBreakpointWideMin,
  SbbBreakpointWideMax,
  SbbBreakpointUltraMin,
  SbbBreakpointUltraMax,
  SbbTypoScaleDefault,
} from '@sbb-esta/lyne-design-tokens';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref } from 'lit/directives/ref.js';

import { hostContext, isBrowser } from '../core/dom';

import type {
  InterfaceImageAttributes,
  InterfaceImageAttributesSizesConfigBreakpoint,
  InterfaceImageAttributesSizesConfigMediaQuery,
} from './image.helper';
import imageHelperGetBreakpoints from './image.helper';
import style from './image.scss?lit&inline';

const eventListenerOptions = {
  once: true,
  passive: true,
};

const pxToRem = (px: number): number => {
  return px / SbbTypoScaleDefault;
};

const breakpointMap: Record<string, number> = {
  'sbb-breakpoint-zero-min': pxToRem(SbbBreakpointZeroMin),
  'sbb-breakpoint-zero-max': pxToRem(SbbBreakpointZeroMax),
  'sbb-breakpoint-micro-min': pxToRem(SbbBreakpointMicroMin),
  'sbb-breakpoint-micro-max': pxToRem(SbbBreakpointMicroMax),
  'sbb-breakpoint-small-min': pxToRem(SbbBreakpointSmallMin),
  'sbb-breakpoint-small-max': pxToRem(SbbBreakpointSmallMax),
  'sbb-breakpoint-medium-min': pxToRem(SbbBreakpointMediumMin),
  'sbb-breakpoint-medium-max': pxToRem(SbbBreakpointMediumMax),
  'sbb-breakpoint-large-min': pxToRem(SbbBreakpointLargeMin),
  'sbb-breakpoint-large-max': pxToRem(SbbBreakpointLargeMax),
  'sbb-breakpoint-wide-min': pxToRem(SbbBreakpointWideMin),
  'sbb-breakpoint-wide-max': pxToRem(SbbBreakpointWideMax),
  'sbb-breakpoint-ultra-min': pxToRem(SbbBreakpointUltraMin),
  'sbb-breakpoint-ultra-max': pxToRem(SbbBreakpointUltraMax),
};

/**
 * It displays an image.
 */
@customElement('sbb-image')
export class SbbImageElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  private _captionElement?: HTMLElement;
  private _linksInCaption?: NodeListOf<HTMLLinkElement>;
  private _config = {
    nonRetinaQuality: '45',
    retinaQuality: '20',
  };
  private _variantTeaser = false;

  @state() private _loaded = false;

  /**
   * An alt text is not always necessary (e.g. in teaser cards when
   * additional link text is provided). In this case we can leave
   * the value of the alt attribute blank, but the attribute itself
   * still needs to be present. That way we can signal assistive
   * technology, that they can skip the image.
   */
  @property() public alt?: string;

  /**
   * If set to false, we show a blurred version of the image as
   * placeholder before the actual image shows up. This will help
   * to improve the perceived loading performance. Read more about
   * the idea of lqip here:
   * https://medium.com/@imgix/lqip-your-images-for-fast-loading-2523d9ee4a62
   */
  @property({ attribute: 'skip-lqip', type: Boolean }) public skipLqip = false;

  /**
   * A caption can provide additional context to the image (e.g.
   * descriptions and the like).
   * Links will automatically receive tabindex=-1 if hideFromScreenreader
   * is set to true. That way they will no longer become focusable.
   */
  @property() public caption?: string;

  /**
   * If a copyright text is provided, we will add it to the caption
   * and create a structured data json-ld block with the copyright
   * information.
   */
  @property() public copyright?: string;

  /**
   * Copyright holder can either be an Organization or a Person
   */
  @property({ attribute: 'copyright-holder' })
  public copyrightHolder: InterfaceImageAttributes['copyrightHolder'] = 'Organization';

  /**
   * Set this to true, if you want to pass a custom focal point
   * for the image. See full documentation here:
   * https://docs.imgix.com/apis/rendering/focalpoint-crop
   */
  @property({ attribute: 'custom-focal-point', type: Boolean }) public customFocalPoint = false;

  /**
   * If the lazy property is set to true, the module will automatically
   * change the decoding to async, otherwise the decoding is set to auto
   * which leaves the handling up to the browser. Read more about the
   * decoding attribute here:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding
   */
  @property() public decoding: InterfaceImageAttributes['decoding'] = 'auto';

  /**
   * Set this to true, to receive visual guidance where the custom focal
   * point is currently set.
   */
  @property({ attribute: 'focal-point-debug', type: Boolean }) public focalPointDebug = false;

  /**
   * Pass in a floating number between 0 (left) and 1 (right).
   */
  @property({ attribute: 'focal-point-x', type: Number }) public focalPointX = 1;

  /**
   * Pass in a floating number between 0 (top) and 1 (bottom).
   */
  @property({ attribute: 'focal-point-y', type: Number }) public focalPointY = 1;

  /**
   * Right now the module is heavily coupled with the image delivery
   * service imgix and depends on the original files being stored
   * inside AEM. You can pass in any https://cdn.img.sbb.ch img
   * src address you find on sbb.ch to play around with it. Just
   * strip the url parameters and paste in the plain file address.
   * If you want to know how to best work with this module with
   * images coming from a different source, please contact the
   * LYNE Core Team.
   */
  @property({ attribute: 'image-src' }) public imageSrc?: string;

  /**
   * The importance attribute is fairly new attribute which should
   * help the browser decide which resources it should prioritise
   * during page load. We will set the attribute value based on the
   * value, we receive in the loading attribute. 'eager', which we use
   * for the largest image within the initial viewport, will set the
   * attribute value to 'high'. 'lazy', which we use for images below
   * the fold, will set the attribute value to 'low'.
   */
  @property() public importance: InterfaceImageAttributes['importance'] = 'high';

  /**
   * With the support of native image lazy loading, we can now
   * decide whether we want to load the image immediately or only
   * once it is close to the visible viewport. The value eager is
   * best used for images within the initial viewport. We want to
   * load these images as fast as possible to improve the Core Web
   * Vitals values. lazy on the other hand works best for images
   * which are further down the page or invisible during the loading
   * of the initial viewport.
   */
  @property() public loading: InterfaceImageAttributes['loading'] = 'eager';

  /**
   * With performance.mark you can log a timestamp associated with
   * the name you define in performanceMark when a certain event is
   * happening. In our case we will log the performance.mark into
   * the PerformanceEntry API once the image is fully loaded.
   * Performance monitoring tools like SpeedCurve or Lighthouse are
   * then able to grab these entries from the PerformanceEntry API
   * and give us additional information and insights about our page
   * loading behaviour. We are then also able to monitor these
   * values over a long period to see if our performance
   * increases or decreases over time. Best to use lowercase strings
   * here, separate words with underscores or dashes.
   */
  @property({ attribute: 'performance-mark' }) public performanceMark?: string;

  /**
   * With the pictureSizesConfig object, you can pass in information
   * into image about what kind of source elements should get
   * rendered. mediaQueries accepts multiple Media Query entries
   * which can get combined by defining a conditionOperator.
   * Type is: stringified InterfaceImageAttributesSizesConfig-Object
   * An example could look like this:
   * {
   *    "breakpoints": [
   *      {
   *        "image": {
   *          "height": "675",
   *          "width": "1200"
   *        },
   *        "mediaQueries": [
   *          {
   *            "conditionFeature": "min-width",
   *            "conditionFeatureValue": {
   *              "lyneDesignToken": true,
   *              "value": "sbb-breakpoint-large-min"
   *            },
   *            "conditionOperator": false
   *          }
   *        ]
   *      },
   *      {
   *        "image": {
   *          "height": "549",
   *          "width": "976"
   *        },
   *        "mediaQueries": [
   *          {
   *            "conditionFeature": "min-width",
   *            "conditionFeatureValue": {
   *              "lyneDesignToken": true,
   *              "value": "sbb-breakpoint-small-min"
   *            },
   *            "conditionOperator": false
   *          }
   *        ]
   *      },
   *      {
   *        "image": {
   *          "height": "180",
   *          "width": "320"
   *        },
   *        "mediaQueries": [
   *          {
   *            "conditionFeature": "max-width",
   *            "conditionFeatureValue": {
   *              "lyneDesignToken": true,
   *              "value": "sbb-breakpoint-micro-max"
   *            },
   *            "conditionOperator": "and"
   *          },
   *          {
   *            "conditionFeature": "orientation",
   *            "conditionFeatureValue": {
   *              "lyneDesignToken": false,
   *              "value": "landscape"
   *            },
   *            "conditionOperator": false
   *          }
   *        ]
   *      }
   *    ]
   *  }
   */
  @property({ attribute: 'picture-sizes-config' }) public pictureSizesConfig?: string;

  /**
   * Border radius of the image. Choose between a default radius, no radius and a completely round image.
   */
  @property({ attribute: 'border-radius' }) public borderRadius: 'default' | 'none' | 'round' =
    'default';

  /**
   * Set an aspect ratio
   * default is '16-9' (16/9)
   * other values: 'free', '1-1', '1-2', '2-1', '2-3', '3-2', '3-4', '4-3', '4-5', '5-4', '9-16'
   */
  @property({ attribute: 'aspect-ratio' })
  public aspectRatio: InterfaceImageAttributes['aspectRatio'] = '16-9';

  private _logPerformanceMarks(): void {
    if (this.performanceMark) {
      performance.clearMarks(this.performanceMark);
      performance.mark(this.performanceMark);
    }
  }

  private _matchMediaQueryDesignToken(breakpointSizeName: string): string {
    const value = breakpointMap[breakpointSizeName];
    return value ? `${value}rem` : '';
  }

  private _addFocusAbilityToLinksInCaption(): void {
    this._linksInCaption?.forEach((link) => {
      link.removeAttribute('tabindex');
    });
  }

  private _prepareImageUrl(baseUrl: string | undefined, lquip = false): string {
    if (!baseUrl || baseUrl === '' || !isBrowser()) {
      return '';
    }

    const imageUrlObj = new URL(baseUrl);

    if (lquip) {
      // blur and size: ?blur=100&w=100&h=56
      imageUrlObj.searchParams.append('blur', '100');
      imageUrlObj.searchParams.append('w', '100');
      imageUrlObj.searchParams.append('h', '56');
    } else {
      // CDN Information: https://docs.imgix.com/apis/rendering
      // param.auto: ?auto=format,compress,cs=tinysrgb
      imageUrlObj.searchParams.append('auto', 'format,compress,cs=tinysrgb');
    }

    if (this.customFocalPoint) {
      // crop: `&fit=crop&crop=focalpoint&fp-x=${this.focalPointX}&fp-y=${this.focalPointY}&fp-z=1`,
      imageUrlObj.searchParams.append('fit', 'crop');
      imageUrlObj.searchParams.append('crop', 'focalpoint');
      imageUrlObj.searchParams.append('fp-x', this.focalPointX.toString(10));
      imageUrlObj.searchParams.append('fp-y', this.focalPointY.toString(10));
      imageUrlObj.searchParams.append('fp-z', '1');
    }

    if (this.focalPointDebug) {
      // focalPointDebug: '&fp-debug=true'
      imageUrlObj.searchParams.append('fp-debug', 'true');
    }

    return imageUrlObj.href;
  }

  private _preparePictureSizeConfigs(): InterfaceImageAttributesSizesConfigBreakpoint[] {
    let pictureSizesConfig;

    if (this.pictureSizesConfig) {
      pictureSizesConfig = this.pictureSizesConfig;
    } else {
      // default config
      pictureSizesConfig = `{
        "breakpoints": [
          {
            "image": {
              "height": 675,
              "width": 1200
            },
            "mediaQueries": [
              {
                "conditionFeature": "min-width",
                "conditionFeatureValue": {
                  "lyneDesignToken": true,
                  "value": "sbb-breakpoint-large-min"
                },
                "conditionOperator": false
              }
            ]
          },
          {
            "image": {
              "height": 549,
              "width": 976
            },
            "mediaQueries": [
              {
                "conditionFeature": "min-width",
                "conditionFeatureValue": {
                  "lyneDesignToken": true,
                  "value": "sbb-breakpoint-small-min"
                },
                "conditionOperator": false
              }
            ]
          },
          {
            "image": {
              "height": 180,
              "width": 320
            },
            "mediaQueries": [
              {
                "conditionFeature": "max-width",
                "conditionFeatureValue": {
                  "lyneDesignToken": true,
                  "value": "sbb-breakpoint-micro-max"
                },
                "conditionOperator": false
              }
            ]
          }
        ]
      }`;
    }

    return imageHelperGetBreakpoints(pictureSizesConfig);
  }

  private _createMediaQueryString(
    mediaQueries: InterfaceImageAttributesSizesConfigMediaQuery[],
  ): string {
    let mediaQuery = '';

    mediaQueries.forEach((mq) => {
      const mqCondition = mq.conditionFeature;
      let mqValue;

      if (mq.conditionFeatureValue.lyneDesignToken) {
        mqValue = this._matchMediaQueryDesignToken(mq.conditionFeatureValue.value);
      } else {
        mqValue = mq.conditionFeatureValue.value;
      }

      const mqCombiner = mq.conditionOperator ? ` ${mq.conditionOperator} ` : '';

      mediaQuery += `(${mqCondition}: ${mqValue})${mqCombiner}`;
    });

    return mediaQuery;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    // Check if the current element is nested in an `<sbb-teaser-hero>` element on in an `<sbb-teaser-paid>` element.
    this._variantTeaser =
      !!hostContext('sbb-teaser-hero', this) || !!this.closest('sbb-teaser-paid');
  }

  protected override render(): TemplateResult {
    let { caption } = this;
    let schemaData = '';

    const attributes: {
      role?: string;
    } = {};

    const imageUrlLQIP = this._prepareImageUrl(this.imageSrc, true);
    const imageUrlWithParams = this._prepareImageUrl(this.imageSrc, false);

    if (this.loading === 'lazy') {
      this.decoding = 'async';
      this.importance = 'low';
    }

    if (this.copyright) {
      caption = `${this.caption} ©${this.copyright}`;
      schemaData = `{
        "@context": "https://schema.org",
        "@type": "Photograph",
        "image": "${this.imageSrc}",
        "copyrightHolder": {
          "@type": "${this.copyrightHolder}",
          "name": "${this.copyright}"
        }
      }`;
    }

    const pictureSizeConfigs = this._preparePictureSizeConfigs();

    return html`
      <figure
        class=${classMap({
          image__figure: true,
          [`image__figure--teaser`]: this._variantTeaser,
          [`image__figure--no-radius`]: this.borderRadius === 'none' || this._variantTeaser,
          [`image__figure--round`]: this.borderRadius === 'round' && !this._variantTeaser,
          [`image__figure--ratio-${this.aspectRatio}`]: true,
          [`image__figure--loaded`]: this._loaded,
        })}
        ${spread(attributes)}
      >
        <div class="image__wrapper">
          ${!this.skipLqip
            ? html`<img
                alt=""
                class="image__blur-hash"
                src=${imageUrlLQIP}
                width="1000"
                height="562"
                loading=${this.loading ?? nothing}
                decoding=${this.decoding ?? nothing}
              />`
            : nothing}

          <picture>
            <!-- render picture element sources -->
            ${pictureSizeConfigs.map((config) => {
              const imageHeight = config.image.height;
              const imageWidth = config.image.width;
              const mediaQuery = this._createMediaQueryString(config.mediaQueries);
              return [
                html` <source
                  media=${`${mediaQuery}`}
                  sizes=${`${imageWidth}px`}
                  srcset=${
                    `${imageUrlWithParams}&w=${imageWidth}&h=${imageHeight}&q=${this._config.nonRetinaQuality} ${imageWidth}w, ` +
                    `${imageUrlWithParams}&w=${imageWidth * 2}&h=${imageHeight * 2}&q=${
                      this._config.retinaQuality
                    } ${imageWidth * 2}w`
                  }
                ></source>`,
              ];
            })}
            <img
              alt=${this.alt || nothing}
              @load=${this._imageLoaded}
              class="image__img"
              src=${this.imageSrc!}
              width="1000"
              height="562"
              loading=${this.loading ?? nothing}
              decoding=${this.decoding ?? nothing}
              importance=${this.importance ?? nothing}
            />
          </picture>
        </div>
        ${caption
          ? html`<figcaption
              class="image__caption"
              .innerHTML=${caption}
              ${ref((el): void => {
                this._captionElement = el as HTMLElement;
              })}
            ></figcaption>`
          : nothing}
        ${schemaData
          ? html`<script type="application/ld+json" .innerHTML=${schemaData}></script>`
          : nothing}
      </figure>
    `;
  }

  protected override updated(): void {
    if (!this._captionElement) {
      return;
    }

    this._linksInCaption = this._captionElement.querySelectorAll<HTMLLinkElement>('a');

    if (!this._linksInCaption) {
      return;
    }

    this._addFocusAbilityToLinksInCaption();
  }

  @eventOptions(eventListenerOptions)
  private _imageLoaded(): void {
    this._logPerformanceMarks();
    this._loaded = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-image': SbbImageElement;
  }
}
