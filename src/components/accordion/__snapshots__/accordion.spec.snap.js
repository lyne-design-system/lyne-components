/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-accordion renders - Dom"] = 
`<sbb-accordion>
  <sbb-expansion-panel
    data-accordion=""
    data-accordion-first=""
  >
    <sbb-expansion-panel-header
      aria-controls="sbb-expansion-panel-content-1"
      aria-expanded="false"
      data-action=""
      data-button=""
      data-slot-names="unnamed"
      dir="ltr"
      id="sbb-expansion-panel-header-1"
      role="button"
      slot="header"
      tabindex="0"
    >
      Header 1
    </sbb-expansion-panel-header>
    <sbb-expansion-panel-content
      aria-hidden="true"
      aria-labelledby="sbb-expansion-panel-header-1"
      id="sbb-expansion-panel-content-1"
      role="region"
      slot="content"
    >
      Content 1
    </sbb-expansion-panel-content>
  </sbb-expansion-panel>
  <sbb-expansion-panel
    data-accordion=""
    data-accordion-last=""
  >
    <sbb-expansion-panel-header
      aria-controls="sbb-expansion-panel-content-2"
      aria-expanded="false"
      data-action=""
      data-button=""
      data-slot-names="unnamed"
      dir="ltr"
      id="sbb-expansion-panel-header-2"
      role="button"
      slot="header"
      tabindex="0"
    >
      Header 2
    </sbb-expansion-panel-header>
    <sbb-expansion-panel-content
      aria-hidden="true"
      aria-labelledby="sbb-expansion-panel-header-2"
      id="sbb-expansion-panel-content-2"
      role="region"
      slot="content"
    >
      Content 2
    </sbb-expansion-panel-content>
  </sbb-expansion-panel>
</sbb-accordion>
`;
/* end snapshot sbb-accordion renders - Dom */

snapshots["sbb-accordion renders - ShadowDom"] = 
`<div class="sbb-accordion">
  <slot>
  </slot>
</div>
`;
/* end snapshot sbb-accordion renders - ShadowDom */

snapshots["sbb-accordion A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Header 1"
    },
    {
      "role": "button",
      "name": "Header 2"
    }
  ]
}
</p>
`;
/* end snapshot sbb-accordion A11y tree Chrome */

snapshots["sbb-accordion A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Header 1"
    },
    {
      "role": "button",
      "name": "Header 2"
    }
  ]
}
</p>
`;
/* end snapshot sbb-accordion A11y tree Firefox */

