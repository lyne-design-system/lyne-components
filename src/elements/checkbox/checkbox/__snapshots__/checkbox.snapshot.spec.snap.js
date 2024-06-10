/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-checkbox should render unchecked DOM"] = 
`<sbb-checkbox
  data-slot-names="unnamed"
  icon-placement="end"
  size="m"
  tabindex="0"
>
  Label
</sbb-checkbox>
`;
/* end snapshot sbb-checkbox should render unchecked DOM */

snapshots["sbb-checkbox should render unchecked Shadow DOM"] = 
`<span class="sbb-checkbox-wrapper">
  <span class="sbb-checkbox">
    <span class="sbb-checkbox__inner">
      <span class="sbb-checkbox__aligner">
        <sbb-visual-checkbox>
        </sbb-visual-checkbox>
      </span>
      <span class="sbb-checkbox__label">
        <slot>
        </slot>
        <span class="sbb-checkbox__label--icon">
          <slot name="icon">
          </slot>
        </span>
        <slot name="suffix">
        </slot>
      </span>
    </span>
    <slot name="subtext">
    </slot>
    <sbb-screen-reader-only class="sbb-checkbox__expanded-label">
    </sbb-screen-reader-only>
  </span>
</span>
`;
/* end snapshot sbb-checkbox should render unchecked Shadow DOM */

snapshots["sbb-checkbox should render checked DOM"] = 
`<sbb-checkbox
  checked=""
  data-slot-names="unnamed"
  icon-placement="end"
  size="m"
  tabindex="0"
>
  Label
</sbb-checkbox>
`;
/* end snapshot sbb-checkbox should render checked DOM */

snapshots["sbb-checkbox should render checked Shadow DOM"] = 
`<span class="sbb-checkbox-wrapper">
  <span class="sbb-checkbox">
    <span class="sbb-checkbox__inner">
      <span class="sbb-checkbox__aligner">
        <sbb-visual-checkbox checked="">
        </sbb-visual-checkbox>
      </span>
      <span class="sbb-checkbox__label">
        <slot>
        </slot>
        <span class="sbb-checkbox__label--icon">
          <slot name="icon">
          </slot>
        </span>
        <slot name="suffix">
        </slot>
      </span>
    </span>
    <slot name="subtext">
    </slot>
    <sbb-screen-reader-only class="sbb-checkbox__expanded-label">
    </sbb-screen-reader-only>
  </span>
</span>
`;
/* end snapshot sbb-checkbox should render checked Shadow DOM */

snapshots["sbb-checkbox should render indeterminate DOM"] = 
`<sbb-checkbox
  data-slot-names="unnamed"
  icon-placement="end"
  indeterminate=""
  size="m"
  tabindex="0"
>
  Label
</sbb-checkbox>
`;
/* end snapshot sbb-checkbox should render indeterminate DOM */

snapshots["sbb-checkbox should render indeterminate Shadow DOM"] = 
`<span class="sbb-checkbox-wrapper">
  <span class="sbb-checkbox">
    <span class="sbb-checkbox__inner">
      <span class="sbb-checkbox__aligner">
        <sbb-visual-checkbox indeterminate="">
        </sbb-visual-checkbox>
      </span>
      <span class="sbb-checkbox__label">
        <slot>
        </slot>
        <span class="sbb-checkbox__label--icon">
          <slot name="icon">
          </slot>
        </span>
        <slot name="suffix">
        </slot>
      </span>
    </span>
    <slot name="subtext">
    </slot>
    <sbb-screen-reader-only class="sbb-checkbox__expanded-label">
    </sbb-screen-reader-only>
  </span>
</span>
`;
/* end snapshot sbb-checkbox should render indeterminate Shadow DOM */

snapshots["sbb-checkbox should render unchecked disabled DOM"] = 
`<sbb-checkbox
  data-slot-names="unnamed"
  disabled=""
  icon-placement="end"
  size="m"
  tabindex="0"
>
  Label
</sbb-checkbox>
`;
/* end snapshot sbb-checkbox should render unchecked disabled DOM */

snapshots["sbb-checkbox should render unchecked disabled Shadow DOM"] = 
`<span class="sbb-checkbox-wrapper">
  <span class="sbb-checkbox">
    <span class="sbb-checkbox__inner">
      <span class="sbb-checkbox__aligner">
        <sbb-visual-checkbox disabled="">
        </sbb-visual-checkbox>
      </span>
      <span class="sbb-checkbox__label">
        <slot>
        </slot>
        <span class="sbb-checkbox__label--icon">
          <slot name="icon">
          </slot>
        </span>
        <slot name="suffix">
        </slot>
      </span>
    </span>
    <slot name="subtext">
    </slot>
    <sbb-screen-reader-only class="sbb-checkbox__expanded-label">
    </sbb-screen-reader-only>
  </span>
</span>
`;
/* end snapshot sbb-checkbox should render unchecked disabled Shadow DOM */

snapshots["sbb-checkbox Unchecked - A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label",
      "checked": false
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox Unchecked - A11y tree Chrome */

snapshots["sbb-checkbox Checked - A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label",
      "checked": true
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox Checked - A11y tree Chrome */

snapshots["sbb-checkbox Unchecked - A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox Unchecked - A11y tree Firefox */

snapshots["sbb-checkbox Checked - A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label",
      "checked": true
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox Checked - A11y tree Firefox */

