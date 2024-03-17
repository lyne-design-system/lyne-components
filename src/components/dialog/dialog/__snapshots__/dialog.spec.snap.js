/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-dialog renders an open dialog Dom"] = 
`<sbb-dialog
  data-state="opening"
  disable-animation=""
>
  <sbb-dialog-title
    aria-level="2"
    level="2"
    role="heading"
    slot="title"
    visual-level="3"
  >
    Title
  </sbb-dialog-title>
  <sbb-dialog-content slot="content">
    Content
  </sbb-dialog-content>
</sbb-dialog>
`;
/* end snapshot sbb-dialog renders an open dialog Dom */

snapshots["sbb-dialog renders an open dialog ShadowDom"] = 
`<div class="sbb-dialog__container">
  <div
    class="sbb-dialog"
    id="sbb-dialog-1"
  >
    <div class="sbb-dialog__wrapper">
      <slot name="title">
      </slot>
      <slot name="content">
      </slot>
      <slot name="actions">
      </slot>
    </div>
  </div>
</div>
<sbb-screenreader-only aria-live="polite">
</sbb-screenreader-only>
`;
/* end snapshot sbb-dialog renders an open dialog ShadowDom */

snapshots["sbb-dialog renders an open dialog A11y tree Chrome"] = 
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
      "name": "Close secondary window",
      "focused": true
    },
    {
      "role": "text",
      "name": "Content"
    },
    {
      "role": "text",
      "name": "Dialog, Title "
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog renders an open dialog A11y tree Chrome */

snapshots["sbb-dialog renders an open dialog A11y tree Firefox"] = 
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
      "name": "Close secondary window",
      "focused": true
    },
    {
      "role": "text leaf",
      "name": "Content"
    },
    {
      "role": "text leaf",
      "name": "Dialog, Title "
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog renders an open dialog A11y tree Firefox */

snapshots["sbb-dialog renders an open dialog A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Title",
      "level": 2
    },
    {
      "role": "text",
      "name": "Content"
    },
    {
      "role": "button",
      "name": "Close secondary window",
      "focused": true
    },
    {
      "role": "text",
      "name": "Dialog, Title "
    }
  ]
}
</p>
`;
/* end snapshot sbb-dialog renders an open dialog A11y tree Safari */

