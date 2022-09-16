/* eslint-disable max-len */
import { SbbColorCharcoalDefault, SbbColorWhiteDefault } from '@sbb-esta/lyne-design-tokens';
import { h } from 'jsx-dom';
import readme from './readme.md';

/* ************************************************* */
/* Documentation platform container                  */
/* ************************************************* */

const documentationPlatformContainerStyle = (context) => {
  const variantsOnDarkBg = ['primary-negative'];

  if (variantsOnDarkBg.indexOf(context.args.appearance) === -1) {
    return {};
  }

  return {
    'background-color': SbbColorCharcoalDefault,
  };
};

/* ************************************************* */
/* Storybook component wrapper, used in Storybook    */
/* ************************************************* */

const wrapperStyle = (context) => {
  const variantsOnDarkBg = ['primary-negative'];

  if (variantsOnDarkBg.indexOf(context.args.appearance) === -1) {
    return `background-color: ${SbbColorWhiteDefault};`;
  }

  // return `background-color: ${ColorWhiteDefault};`;
  return `background-color: ${SbbColorCharcoalDefault};`;
};

/* ************************************************* */
/* Storybook controls                                */
/* ************************************************* */

const appearance = {
  control: {
    type: 'select',
  },
  options: ['primary', 'primary-negative'],
  table: {
    category: 'Appearance',
  },
};

const defaultArgTypes = {
  appearance,
};

const defaultArgs = {
  appearance: appearance.options[0],
};

/* ************************************************* */
/* Storybook template                                */
/* ************************************************* */

const Template = (args) => (
  <div>
    {/* *************************************************
    Header section
    ************************************************* */}
    <sbb-header shadow={true}>
      <sbb-header-action>
        <span slot="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 4H20V6H4V4ZM4 18H20V20H4V18ZM20 11H4V13H20V11Z"
              fill="black"
            />
          </svg>
        </span>
        Menu
      </sbb-header-action>
      <sbb-header-action>
        <span slot="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.16699 10.5C4.16699 7.46298 6.62903 5 9.66699 5C12.705 5 15.167 7.46298 15.167 10.5C15.167 13.5381 12.7051 16 9.66699 16C6.62891 16 4.16699 13.5381 4.16699 10.5ZM9.66699 3C5.52423 3 2.16699 6.35865 2.16699 10.5C2.16699 14.6426 5.52434 18 9.66699 18C11.3669 18 12.9345 17.4347 14.1922 16.4818L20.3492 21.7593L21.6508 20.2407L15.6161 15.0681C16.5887 13.8032 17.167 12.2192 17.167 10.5C17.167 6.35865 13.8098 3 9.66699 3Z"
              fill="black"
            />
          </svg>
        </span>
        Suchen
      </sbb-header-action>
      <sbb-header-action>
        <span slot="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.5 7.5C10.5 5.96908 11.5344 5 12.5 5C13.4656 5 14.5 5.96908 14.5 7.5C14.5 9.03092 13.4656 10 12.5 10C11.5344 10 10.5 9.03092 10.5 7.5ZM12.5 3C10.1516 3 8.5 5.16492 8.5 7.5C8.5 8.33369 8.71053 9.14569 9.08814 9.84522C7.85262 10.6722 6.92654 11.9814 6.28392 13.3533C5.44378 15.1469 5 17.2274 5 19.0003V20.0003H6H19H20V19.0003C20 17.2177 19.5553 15.1344 18.7137 13.3414C18.0711 11.9722 17.1457 10.6679 15.9122 9.84467C16.2896 9.14526 16.5 8.33347 16.5 7.5C16.5 5.16492 14.8484 3 12.5 3ZM14.5646 11.3633C13.9754 11.7638 13.2757 12 12.5 12C11.7243 12 11.0246 11.7638 10.4354 11.3633C9.5237 11.8789 8.71424 12.8799 8.09508 14.2017C7.53377 15.4 7.18008 16.7582 7.05302 18.0003H17.9474C17.8205 16.7512 17.4658 15.3898 16.9033 14.1912C16.284 12.8718 15.475 11.8754 14.5646 11.3633Z"
              fill="black"
            />
          </svg>
        </span>
        Anmelden
      </sbb-header-action>
      <sbb-header-action>
        <span slot="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.5 12C19.5 7.582 15.918 4 11.5 4C7.082 4 3.5 7.582 3.5 12C3.5 16.418 7.082 20 11.5 20C15.918 20 19.5 16.418 19.5 12Z"
              stroke="black"
              stroke-width="2"
            />
            <path
              d="M10 19.4998C8.77764 17.6984 8 15.0088 8 12.0003C8 8.99071 8.77764 6.30111 10 4.49976"
              stroke="black"
              stroke-width="2"
            />
            <path
              d="M13 4.49976C14.2228 6.30011 15 8.99071 15 11.9993C15 15.0088 14.2228 17.6974 13 19.4998"
              stroke="black"
              stroke-width="2"
            />
            <path d="M4 9.49976L19 9.49976" stroke="black" stroke-width="2" />
            <path d="M19 14.4998L4 14.4998" stroke="black" stroke-width="2" />
          </svg>
        </span>
        Deutsch
      </sbb-header-action>
    </sbb-header>

    {/* *************************************************
    Timetable input section
    ************************************************* */}
    <sbb-section
      width="page-spacing"
      style="background-color: var(--sbb-color-red-default); max-width: 1440px; margin-inline-start: auto; margin-inline-end: auto;"
    >
      <sbb-grid slot="full-width" variant="base--eight-columns-centered">
        <sbb-stack
          slot="eight-columns-centered"
          stack-width="100%"
          space-leading="responsive-xl"
          gap-vertical="fixed-4x"
          appearance="vertical--centered"
        >
          <sbb-link-button
            href-value="https://github.com/lyne-design-system/lyne-components"
            text="Timetable toggle pretender"
            variant="secondary"
          ></sbb-link-button>
          <sbb-stack
            gap-vertical="fixed-4x"
            appearance="vertical--centered"
            style="background-color: white; border-radius: 16px; max-width: 842px; height: 21vh; width: 100%; margin-bottom: -7vh; box-shadow: var(--sbb-shadow-elevation-level-9-shadow-2-offset-x) var(--sbb-shadow-elevation-level-9-shadow-2-offset-y) var(--sbb-shadow-elevation-level-9-shadow-2-blur) var(--sbb-shadow-elevation-level-9-shadow-2-spread) var(--sbb-shadow-elevation-level-9-hard-2-color), var(--sbb-shadow-elevation-level-9-shadow-1-offset-x) var(--sbb-shadow-elevation-level-9-shadow-1-offset-y) var(--sbb-shadow-elevation-level-9-shadow-1-blur) var(--sbb-shadow-elevation-level-9-shadow-1-spread) var(--sbb-shadow-elevation-level-5-hard-1-color)"
          ></sbb-stack>
        </sbb-stack>
      </sbb-grid>
    </sbb-section>

    {/* *************************************************
    Top products section
    ************************************************* */}

    <sbb-section width="page-spacing" style="padding-block-start: 7vh;">
      <sbb-stack
        slot="full-width"
        gap-vertical="responsive-m"
        space-leading="responsive-l"
        space-trailing="responsive-l"
      >
        <sbb-title level="2">Top Produkte.</sbb-title>
        <sbb-grid variant="base--top-products">
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-1"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="standard"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="icon">
              <svg width="36" height="36" viewBox="0,0,36,36" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="m3.25,6.24951h29.5v6.99999h-.5c-2.2739,0-4,1.7262-4,4,0,2.2739,1.7261,4,4,4h.5v7H3.25V6.24951zm1,1V27.2495h27.5v-5.023c-2.5785-.2395-4.5-2.32-4.5-4.977s1.9215-4.7375,4.5-4.977V7.24951H4.25zm10.9501,8.67479c.3869.2079.8295.3259,1.2999.3259,1.5181,0,2.75-1.2318,2.75-2.75,0-1.5198-1.2321-2.75-2.75-2.75-1.5196,0-2.75,1.2304-2.75,2.75,0,.6876.2524,1.3164.6697,1.7988l-2.6206,3.2764c-.387-.2079-.8293-.3259-1.2991-.3259-1.51986,0-2.75,1.2321-2.75,2.75s1.23014,2.75,2.75,2.75c1.5181,0,2.75-1.2318,2.75-2.75,0-.6877-.2528-1.3167-.6704-1.799l2.6205-3.2762zM14.75,13.5002c0-.9673.7826-1.75,1.75-1.75.9661,0,1.75.7829,1.75,1.75,0,.9659-.7841,1.75-1.75,1.75-.9671,0-1.75-.7839-1.75-1.75zm-4.25,5.7493c-.96714,0-1.75.7839-1.75,1.75s.78286,1.75,1.75,1.75c.9659,0,1.75-.7841,1.75-1.75,0-.9658-.7841-1.75-1.75-1.75zM24.25,7.49951v.4875h1v-.4875h-1zm0,1.4625v.975h1v-.975h-1zm0,1.94999v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zM24.25,26.512v.4875h1v-.4875h-1z"
                ></path>
              </svg>
            </div>
            <div slot="title">
              <sbb-title level="2" visual-level="6">
                Tageskarte
              </sbb-title>
            </div>
            <div slot="text">
              <span>Gültig heute</span>
            </div>
            <div slot="action">
              <sbb-button
                label="Kaufen"
                size="small"
                variant="secondary"
                visual-button-only=""
              ></sbb-button>
            </div>
          </sbb-card-product>
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-2"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="standard"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="icon">
              <svg width="36" height="36" viewBox="0,0,36,36" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="m24.75,9.24902H19.5v.99998h4.3157l-2.3333,3.5h-8.3326l-.1197.3292-1.0424,2.8666c-.4747-.1272-.9734-.195-1.4877-.195-3.17114,0-5.75,2.5788-5.75,5.75,0,3.1711,2.57886,5.75,5.75,5.75,3.1711,0,5.75-2.5789,5.75-5.75,0-2.3043-1.3617-4.2959-3.3228-5.2125l.923-2.5383h7.5779l1.2476,2.7436c-1.7451.9882-2.9242,2.8622-2.9242,5.0072,0,3.171,2.5772,5.75,5.75,5.75,3.1711,0,5.75-2.5789,5.75-5.75,0-3.1712-2.5789-5.75-5.75-5.75-.6716,0-1.3166.1155-1.916.3278l-1.2653-2.7825,2.8458-4.2687.5183-.77738H24.75zM20.7515,22.4998c0-1.7403.9403-3.2651,2.3401-4.0924l1.9547,4.2986.9104-.4139-1.9553-4.2998c.4717-.1573.9761-.2425,1.5001-.2425,2.6188,0,4.75,2.1311,4.75,4.75,0,2.6188-2.1312,4.75-4.75,4.75-2.6203,0-4.75-2.1311-4.75-4.75zm-9.1072-4.6107-1.6142,4.4391.9398.3417,1.6139-4.4381c1.5774.7734,2.6662,2.3961,2.6662,4.268,0,2.6188-2.1311,4.75-4.75,4.75-2.61886,0-4.75-2.1312-4.75-4.75,0-2.6189,2.13114-4.75,4.75-4.75.3944,0,.7777.0483,1.1443.1393zm-.8316-6.1393h4.188v-1h-4.188v1z"
                ></path>
              </svg>
            </div>
            <div slot="title">
              <sbb-title level="2" visual-level="6">
                Velo Tageskarte
              </sbb-title>
            </div>
            <div slot="text">
              <span>Gültig heute</span>
            </div>
            <div slot="action">
              <sbb-button
                label="Kaufen"
                size="small"
                variant="secondary"
                visual-button-only=""
              ></sbb-button>
            </div>
          </sbb-card-product>
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-3"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="standard"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="icon">
              <svg width="36" height="36" viewBox="0,0,36,36" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="m3.25,6.24951h29.5v6.99999h-.5c-2.2739,0-4,1.7262-4,4,0,2.2739,1.7261,4,4,4h.5v7H3.25V6.24951zm1,1V27.2495h27.5v-5.023c-2.5785-.2395-4.5-2.32-4.5-4.977s1.9215-4.7375,4.5-4.977V7.24951H4.25zm10.9501,8.67479c.3869.2079.8295.3259,1.2999.3259,1.5181,0,2.75-1.2318,2.75-2.75,0-1.5198-1.2321-2.75-2.75-2.75-1.5196,0-2.75,1.2304-2.75,2.75,0,.6876.2524,1.3164.6697,1.7988l-2.6206,3.2764c-.387-.2079-.8293-.3259-1.2991-.3259-1.51986,0-2.75,1.2321-2.75,2.75s1.23014,2.75,2.75,2.75c1.5181,0,2.75-1.2318,2.75-2.75,0-.6877-.2528-1.3167-.6704-1.799l2.6205-3.2762zM14.75,13.5002c0-.9673.7826-1.75,1.75-1.75.9661,0,1.75.7829,1.75,1.75,0,.9659-.7841,1.75-1.75,1.75-.9671,0-1.75-.7839-1.75-1.75zm-4.25,5.7493c-.96714,0-1.75.7839-1.75,1.75s.78286,1.75,1.75,1.75c.9659,0,1.75-.7841,1.75-1.75,0-.9658-.7841-1.75-1.75-1.75zM24.25,7.49951v.4875h1v-.4875h-1zm0,1.4625v.975h1v-.975h-1zm0,1.94999v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zM24.25,26.512v.4875h1v-.4875h-1z"
                ></path>
              </svg>
            </div>
            <div slot="title">
              <sbb-title level="2" visual-level="6">
                Libero Kurzstrecke
              </sbb-title>
            </div>
            <div slot="text">
              <span>Gültig heute</span>
            </div>
            <div slot="action">
              <sbb-button
                label="Kaufen"
                size="small"
                variant="secondary"
                visual-button-only=""
              ></sbb-button>
            </div>
          </sbb-card-product>
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-4"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="standard"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="icon">
              <svg width="36" height="36" viewBox="0,0,36,36" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="m3.25,6.24951h29.5v6.99999h-.5c-2.2739,0-4,1.7262-4,4,0,2.2739,1.7261,4,4,4h.5v7H3.25V6.24951zm1,1V27.2495h27.5v-5.023c-2.5785-.2395-4.5-2.32-4.5-4.977s1.9215-4.7375,4.5-4.977V7.24951H4.25zm10.9501,8.67479c.3869.2079.8295.3259,1.2999.3259,1.5181,0,2.75-1.2318,2.75-2.75,0-1.5198-1.2321-2.75-2.75-2.75-1.5196,0-2.75,1.2304-2.75,2.75,0,.6876.2524,1.3164.6697,1.7988l-2.6206,3.2764c-.387-.2079-.8293-.3259-1.2991-.3259-1.51986,0-2.75,1.2321-2.75,2.75s1.23014,2.75,2.75,2.75c1.5181,0,2.75-1.2318,2.75-2.75,0-.6877-.2528-1.3167-.6704-1.799l2.6205-3.2762zM14.75,13.5002c0-.9673.7826-1.75,1.75-1.75.9661,0,1.75.7829,1.75,1.75,0,.9659-.7841,1.75-1.75,1.75-.9671,0-1.75-.7839-1.75-1.75zm-4.25,5.7493c-.96714,0-1.75.7839-1.75,1.75s.78286,1.75,1.75,1.75c.9659,0,1.75-.7841,1.75-1.75,0-.9658-.7841-1.75-1.75-1.75zM24.25,7.49951v.4875h1v-.4875h-1zm0,1.4625v.975h1v-.975h-1zm0,1.94999v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zm0,1.95v.975h1v-.975h-1zM24.25,26.512v.4875h1v-.4875h-1z"
                ></path>
              </svg>
            </div>
            <div slot="title">
              <sbb-title level="2" visual-level="6">
                Streckenkarte
              </sbb-title>
            </div>
            <div slot="text">
              <span>Für regelmässige Streckenfahrten</span>
            </div>
            <div slot="action">
              <sbb-button
                label="Kaufen"
                size="small"
                variant="secondary"
                visual-button-only=""
              ></sbb-button>
            </div>
          </sbb-card-product>
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-subscription-1"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="loose"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="title">
              <sbb-title level="2" visual-level="1">
                GA
              </sbb-title>
            </div>
            <div slot="lead">
              <sbb-title level="3" visual-level="6">
                Mit dem Generalabonnement geniessen Sie freie Fahrt.
              </sbb-title>
            </div>
            <div slot="action">
              <sbb-button
                label="Alle GA im Überblick"
                variant="secondary"
                visual-button-only="true"
              ></sbb-button>
            </div>
          </sbb-card-product>
          <sbb-card-product
            style="height: 100%;"
            slot="top-product-subscription-2"
            appearance="primary"
            accessibility-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
            layout="loose"
            href-value="https://github.com/lyne-design-system/lyne-components"
          >
            <div slot="title">
              <sbb-title level="2" visual-level="1">
                1/2
              </sbb-title>
            </div>
            <div slot="lead">
              <sbb-title level="3" visual-level="6">
                Mit dem Halbtax zum halben Preis fahren.
              </sbb-title>
            </div>
            <div slot="action">
              <sbb-button
                label="Zum halben Preis fahren"
                variant="secondary"
                visual-button-only=""
              ></sbb-button>
            </div>
          </sbb-card-product>
        </sbb-grid>
        <sbb-stack
          appearance="horizontal--start"
          collapse-horizontal-below="small"
          gap-horizontal="fixed-4x"
          gap-vertical="fixed-2x"
        >
          <sbb-link-button
            href-value="https://github.com/lyne-design-system/lyne-components"
            icon="user-small"
            icon-placement="start"
            text="Meine Billette &amp; Abos"
            variant="primary"
          >
            <span slot="icon">
              <svg width="24" height="24" viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="m9.5,8.99976c0-1.73197,1.1887-3,2.5-3s2.5,1.26803,2.5,3c0,1.73194-1.1887,3.00004-2.5,3.00004s-2.5-1.2681-2.5-3.00004zm2.5-4c-2.00269,0-3.5,1.86596-3.5,4,0,.92922.28389,1.80764.76978,2.50324C6.47282,12.9019,5,16.3669,5,19.5v.5h14v-.5c0-3.1497-1.4746-6.6059-4.2697-7.997.4858-.6957.7697-1.57405.7697-2.50324,0-2.13404-1.4973-4-3.5-4zm2.0156,7.27454c-.5617.4541-1.2519.7255-2.0156.7255-.7639,0-1.4543-.2716-2.01615-.7259C7.61923,13.2905,6.16607,16.1356,6.01337,19H17.9868c-.1522-2.8799-1.6079-5.7167-3.9712-6.7257z"
                ></path>
              </svg>
            </span>
          </sbb-link-button>
          <sbb-link-button
            href-value="https://github.com/lyne-design-system/lyne-components"
            text="Alle Produkte"
            variant="secondary"
          ></sbb-link-button>
        </sbb-stack>
      </sbb-stack>
    </sbb-section>

    {/* *************************************************
    Hero Teaser section
    ************************************************* */}
    <sbb-section width="full-bleed--until-ultra" {...args}>
      <sbb-stack slot="full-width" space-leading="responsive-l" space-trailing="responsive-l">
        <sbb-teaser-hero
          link-content="Mehr erfahren"
          image-src="https://cdn.img.sbb.ch/content/dam/internet/lyne/Billetkontrolle.jpg"
          href="https://www.sbb.ch"
        >
          Rücksichtsvoll mit SBB Green Class.
        </sbb-teaser-hero>
      </sbb-stack>
    </sbb-section>

    {/* *************************************************
    Footer section
    ************************************************* */}
    <sbb-footer accessibility-title="Footer" {...args}>
      <div slot="col-1">
        <sbb-stack>
          <sbb-link-list
            textsize="s"
            title-level="2"
            title-text="Help &amp; Contact."
            variant="positive"
          >
            <li class="link-list__item" slot="link-list__item">
              <sbb-link
                href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
                text="Rückerstattungen"
                text-size="s"
                variant="positive"
              ></sbb-link>
            </li>
            <li class="link-list__item" slot="link-list__item">
              <sbb-link
                href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
                text="Fundbüro"
                text-size="s"
                variant="positive"
              ></sbb-link>
            </li>
            <li class="link-list__item" slot="link-list__item">
              <sbb-link
                href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
                text="Beschwerden"
                text-size="s"
                variant="positive"
              ></sbb-link>
            </li>
            <li class="link-list__item" slot="link-list__item">
              <sbb-link
                href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
                text="Lob aussprechen"
                text-size="s"
                variant="positive"
              ></sbb-link>
            </li>
            <li class="link-list__item" slot="link-list__item">
              <sbb-link
                href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
                text="Sachbeschädigung melden"
                text-size="s"
                variant="positive"
              ></sbb-link>
            </li>
          </sbb-link-list>
          <sbb-stack space-leading="fixed-3x">
            <sbb-link-button
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="All help topics"
              variant="primary"
            ></sbb-link-button>
          </sbb-stack>
        </sbb-stack>
      </div>
      <div slot="col-2">
        <sbb-link-list textsize="s" title-level="2" title-text="More SBB." variant="positive">
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Jobs & careers"
              text-size="s"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Rail traffic information"
              text-size="s"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="SBB News"
              text-size="s"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="SBB Community"
              text-size="s"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Company"
              text-size="s"
              variant="positive"
            ></sbb-link>
          </li>
        </sbb-link-list>
      </div>
      <div slot="col-3">
        <sbb-stack>
          <sbb-title level="2" visual-level="5">
            Newsletter.
          </sbb-title>
          <p>Our newsletter regularly informs you of attractive offers from SBB via e-mail.</p>
          <sbb-stack space-leading="fixed-3x">
            <sbb-link-button
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Subscribe"
              variant="secondary"
            ></sbb-link-button>
          </sbb-stack>
        </sbb-stack>
      </div>
      <div slot="clock">
        <sbb-clock initial-time="now" class="chromatic-ignore"></sbb-clock>
      </div>
      <div slot="bottom">
        <sbb-link-list
          textsize="xs"
          title-level="2"
          title-text=""
          list-direction="horizontal-from-large"
          variant="positive"
        >
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Rückerstattungen"
              text-size="xs"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Fundbüro"
              text-size="xs"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Beschwerden"
              text-size="xs"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Lob aussprechen"
              text-size="xs"
              variant="positive"
            ></sbb-link>
          </li>
          <li class="link-list__item" slot="link-list__item">
            <sbb-link
              href-value="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
              text="Sachbeschädigung melden"
              text-size="xs"
              variant="positive"
            ></sbb-link>
          </li>
        </sbb-link-list>
      </div>
    </sbb-footer>
  </div>
);

/* ************************************************* */
/* The Stories                                       */
/* ************************************************* */

/* --- Home ------------------------ */
export const home = Template.bind({});

home.argTypes = defaultArgTypes;
home.args = JSON.parse(JSON.stringify(defaultArgs));
home.documentation = {
  container: {
    styles: (context) => documentationPlatformContainerStyle(context),
  },
  title: 'Home 2.0',
};

/* ************************************************* */
/* Render storybook section and stories              */
/* ************************************************* */

export default {
  decorators: [
    (Story, context) => (
      <div style={`${wrapperStyle(context)}`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'pages/home',
};
