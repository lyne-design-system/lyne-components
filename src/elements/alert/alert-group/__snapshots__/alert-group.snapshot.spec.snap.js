/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-alert-group should render with slots"] = 
`<sbb-alert-group
  accessibility-title-level="3"
  role="status"
>
  <span slot="accessibility-title">
    Interruptions
  </span>
  <sbb-alert
    animation="open"
    data-state="opening"
    href="https://www.sbb.ch"
    size="m"
    title-content="Interruption between Genève and Lausanne"
  >
    The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
  </sbb-alert>
</sbb-alert-group>
`;
/* end snapshot sbb-alert-group should render with slots */

snapshots["sbb-alert-group should render DOM"] = 
`<sbb-alert-group
  accessibility-title="Disruptions"
  accessibility-title-level="3"
  role="status"
>
  <sbb-alert
    animation="open"
    data-state="opening"
    href="https://www.sbb.ch"
    size="m"
    title-content="Interruption between Genève and Lausanne"
  >
    The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
  </sbb-alert>
</sbb-alert-group>
`;
/* end snapshot sbb-alert-group should render DOM */

snapshots["sbb-alert-group should render Shadow DOM"] = 
`<div class="sbb-alert-group">
  <h3 class="sbb-alert-group__title">
    <slot name="accessibility-title">
      Disruptions
    </slot>
  </h3>
  <slot>
  </slot>
</div>
`;
/* end snapshot sbb-alert-group should render Shadow DOM */

snapshots["sbb-alert-group should render A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Disruptions",
      "level": 3
    },
    {
      "role": "heading",
      "name": "Interruption between Genève and Lausanne",
      "level": 3
    },
    {
      "role": "text",
      "name": "The rail traffic between Allaman and Morges is interrupted. All trains are cancelled. "
    },
    {
      "role": "link",
      "name": "Find out more"
    },
    {
      "role": "button",
      "name": "Close message"
    }
  ]
}
</p>
`;
/* end snapshot sbb-alert-group should render A11y tree Chrome */

snapshots["sbb-alert-group should render A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Disruptions",
      "level": 3
    },
    {
      "role": "heading",
      "name": "Interruption between Genève and Lausanne",
      "level": 3
    },
    {
      "role": "text leaf",
      "name": "The rail traffic between Allaman and Morges is interrupted. All trains are cancelled. "
    },
    {
      "role": "link",
      "name": "Find out more",
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
/* end snapshot sbb-alert-group should render A11y tree Firefox */

