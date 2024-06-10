/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-datepicker-toggle renders"] = 
`<sbb-popover-trigger
  aria-controls="sbb-popover-1"
  aria-disabled="true"
  aria-expanded="false"
  aria-haspopup="dialog"
  aria-label="Show calendar"
  data-action=""
  data-button=""
  data-icon-small=""
  dir="ltr"
  disabled=""
  icon-name="calendar-small"
  role="button"
>
</sbb-popover-trigger>
<sbb-popover
  data-state="closed"
  hide-close-button=""
  id="sbb-popover-1"
>
  <sbb-calendar>
  </sbb-calendar>
</sbb-popover>
`;
/* end snapshot sbb-datepicker-toggle renders */

snapshots["sbb-datepicker-toggle renders in form-field renders in form-field"] = 
`<sbb-popover-trigger
  aria-controls="sbb-popover-2"
  aria-expanded="false"
  aria-haspopup="dialog"
  aria-label="Show calendar"
  data-action=""
  data-button=""
  data-icon-small=""
  dir="ltr"
  icon-name="calendar-small"
  role="button"
  tabindex="0"
>
</sbb-popover-trigger>
<sbb-popover
  data-state="closed"
  hide-close-button=""
  id="sbb-popover-2"
>
  <sbb-calendar>
  </sbb-calendar>
</sbb-popover>
`;
/* end snapshot sbb-datepicker-toggle renders in form-field renders in form-field */

snapshots["sbb-datepicker-toggle renders in form-field renders in disabled form-field"] = 
`<sbb-popover-trigger
  aria-controls="sbb-popover-3"
  aria-disabled="true"
  aria-expanded="false"
  aria-haspopup="dialog"
  aria-label="Show calendar"
  data-action=""
  data-button=""
  data-icon-small=""
  dir="ltr"
  disabled=""
  icon-name="calendar-small"
  role="button"
>
</sbb-popover-trigger>
<sbb-popover
  data-state="closed"
  hide-close-button=""
  id="sbb-popover-3"
>
  <sbb-calendar>
  </sbb-calendar>
</sbb-popover>
`;
/* end snapshot sbb-datepicker-toggle renders in form-field renders in disabled form-field */

snapshots["sbb-datepicker-toggle renders in form-field renders in form-field with calendar parameters"] = 
`<sbb-popover-trigger
  aria-controls="sbb-popover-4"
  aria-expanded="false"
  aria-haspopup="dialog"
  aria-label="Show calendar"
  data-action=""
  data-button=""
  data-icon-small=""
  dir="ltr"
  icon-name="calendar-small"
  role="button"
  tabindex="0"
>
</sbb-popover-trigger>
<sbb-popover
  data-state="closed"
  hide-close-button=""
  id="sbb-popover-4"
>
  <sbb-calendar wide="">
  </sbb-calendar>
</sbb-popover>
`;
/* end snapshot sbb-datepicker-toggle renders in form-field renders in form-field with calendar parameters */

snapshots["sbb-datepicker-toggle A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Show calendar",
      "disabled": true,
      "haspopup": "dialog"
    }
  ]
}
</p>
`;
/* end snapshot sbb-datepicker-toggle A11y tree Chrome */

snapshots["sbb-datepicker-toggle A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Show calendar",
      "disabled": true,
      "haspopup": "dialog"
    }
  ]
}
</p>
`;
/* end snapshot sbb-datepicker-toggle A11y tree Firefox */

