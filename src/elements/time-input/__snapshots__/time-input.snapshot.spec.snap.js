/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-time-input renders"] = 
`<span>
  <sbb-time-input input="id-1">
  </sbb-time-input>
  <input
    data-sbb-time-input=""
    id="id-1"
    inputmode="numeric"
    maxlength="5"
    placeholder="HH:MM"
    type="text"
  >
</span>
`;
/* end snapshot sbb-time-input renders */

snapshots["sbb-time-input A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "textbox",
      "name": "HH:MM"
    }
  ]
}
</p>
`;
/* end snapshot sbb-time-input A11y tree Chrome */

snapshots["sbb-time-input A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "textbox",
      "name": "HH:MM"
    }
  ]
}
</p>
`;
/* end snapshot sbb-time-input A11y tree Firefox */

