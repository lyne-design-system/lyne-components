/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-alert should render default properties"] = 
`<div class="sbb-alert__transition-wrapper">
  <div class="sbb-alert__transition-sub-wrapper">
    <div class="sbb-alert">
      <span class="sbb-alert__icon">
        <slot name="icon">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="info"
            role="img"
          >
          </sbb-icon>
        </slot>
      </span>
      <span class="sbb-alert__content">
        <sbb-title
          aria-level="3"
          class="sbb-alert__title"
          level="3"
          negative=""
          role="heading"
          visual-level="5"
        >
          <slot name="title">
            Interruption
          </slot>
        </sbb-title>
        <p class="sbb-alert__content-slot">
          <slot>
          </slot>
        </p>
      </span>
      <span class="sbb-alert__close-button-wrapper">
        <sbb-divider
          aria-orientation="vertical"
          class="sbb-alert__close-button-divider"
          negative=""
          orientation="vertical"
          role="separator"
        >
        </sbb-divider>
        <sbb-transparent-button
          aria-label="Close message"
          class="sbb-alert__close-button"
          data-action=""
          data-button=""
          data-sbb-button=""
          dir="ltr"
          icon-name="cross-small"
          negative=""
          role="button"
          size="m"
          tabindex="0"
        >
        </sbb-transparent-button>
      </span>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-alert should render default properties */

snapshots["sbb-alert should render customized properties"] = 
`<div class="sbb-alert__transition-wrapper">
  <div class="sbb-alert__transition-sub-wrapper">
    <div class="sbb-alert">
      <span class="sbb-alert__icon">
        <slot name="icon">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="disruption"
            role="img"
          >
          </sbb-icon>
        </slot>
      </span>
      <span class="sbb-alert__content">
        <sbb-title
          aria-level="2"
          class="sbb-alert__title"
          level="2"
          negative=""
          role="heading"
          visual-level="3"
        >
          <slot name="title">
            Interruption
          </slot>
        </sbb-title>
        <p class="sbb-alert__content-slot">
          <slot>
          </slot>
        </p>
        <sbb-link
          accessibility-label="label"
          data-action=""
          data-link=""
          data-sbb-link=""
          data-slot-names="unnamed"
          dir="ltr"
          href="https://www.sbb.ch"
          negative=""
          rel="noopener"
          size="s"
          target="_blank"
        >
          Show much more
        </sbb-link>
      </span>
      <span class="sbb-alert__close-button-wrapper">
        <sbb-divider
          aria-orientation="vertical"
          class="sbb-alert__close-button-divider"
          negative=""
          orientation="vertical"
          role="separator"
        >
        </sbb-divider>
        <sbb-transparent-button
          aria-label="Close message"
          class="sbb-alert__close-button"
          data-action=""
          data-button=""
          data-sbb-button=""
          dir="ltr"
          icon-name="cross-small"
          negative=""
          role="button"
          size="m"
          tabindex="0"
        >
        </sbb-transparent-button>
      </span>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-alert should render customized properties */

snapshots["sbb-alert A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Interruption",
      "level": 3
    },
    {
      "role": "text",
      "name": "Alert content "
    },
    {
      "role": "link",
      "name": "test-a11y-label"
    },
    {
      "role": "button",
      "name": "Close message"
    }
  ]
}
</p>
`;
/* end snapshot sbb-alert A11y tree Chrome */

snapshots["sbb-alert A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Interruption",
      "level": 3
    },
    {
      "role": "text leaf",
      "name": "Alert content "
    },
    {
      "role": "link",
      "name": "test-a11y-label",
      "value": "https://www.sbb.ch/"
    },
    {
      "role": "button",
      "name": "Close message"
    }
  ]
}
</p>
`;
/* end snapshot sbb-alert A11y tree Firefox */

