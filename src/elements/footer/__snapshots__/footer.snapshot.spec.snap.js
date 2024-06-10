/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-footer renders"] = 
`<footer class="sbb-footer">
  <div class="sbb-footer-wrapper">
    <h1 class="sbb-footer__title">
      Footer
    </h1>
    <slot>
    </slot>
  </div>
</footer>
`;
/* end snapshot sbb-footer renders */

snapshots["sbb-footer A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Footer",
      "level": 1
    }
  ]
}
</p>
`;
/* end snapshot sbb-footer A11y tree Chrome */

snapshots["sbb-footer A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Footer",
      "level": 1
    }
  ]
}
</p>
`;
/* end snapshot sbb-footer A11y tree Firefox */

