/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-dialog-title renders"] = 
`<div class="sbb-dialog__header">
  <h2
    class="sbb-title"
    role="presentation"
  >
    <slot>
    </slot>
  </h2>
  <sbb-secondary-button
    aria-label="Close secondary window"
    class="sbb-dialog__close"
    data-action=""
    data-button=""
    data-sbb-button=""
    dir="ltr"
    icon-name="cross-small"
    role="button"
    sbb-dialog-close=""
    size="m"
    tabindex="0"
    type="button"
  >
  </sbb-secondary-button>
</div>
`;
/* end snapshot sbb-dialog-title renders */

snapshots["sbb-dialog-title A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Title"
    },
    {
      "role": "button",
      "name": "Close secondary window"
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog-title A11y tree Chrome */

snapshots["sbb-dialog-title A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Title"
    },
    {
      "role": "button",
      "name": "Close secondary window"
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog-title A11y tree Firefox */

snapshots["sbb-dialog-title A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Title"
    },
    {
      "role": "button",
      "name": "Close secondary window"
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog-title A11y tree Safari */

