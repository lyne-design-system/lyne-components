The `sbb-autocomplete-grid-actions` component wraps one of more [sbb-autocomplete-grid-button](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-button--docs)
inside a [sbb-autocomplete-grid](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid--docs).
To properly work, it must be used within a [sbb-autocomplete-grid-row](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-row--docs).

```html
<sbb-form-field label="Label">
  <input />
  <sbb-autocomplete-grid>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-actions>
        <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-actions>
    </sbb-autocomplete-grid-row>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="2">Option 2</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-actions>
        <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
        <sbb-autocomplete-grid-button icon-name="trash-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-actions>
    </sbb-autocomplete-grid-row>
  </sbb-autocomplete-grid>
</sbb-form-field>
```

## Slots

The component has an unnamed slot which is used to project the `sbb-autocomplete-grid-buttons`.

## Accessibility

The `sbb-autocomplete-grid` follows the combobox `grid` pattern;
this means that the `sbb-autocomplete-grid-actions` has a `gridcell` role and its child would receive an `id`
based on the `sbb-autocomplete-grid-actions`'s `id`,
which is needed to correctly set the `aria-activedescendant` on the related `input`.

<!-- Auto Generated Below -->

## Slots

| Name | Description                                                          |
| ---- | -------------------------------------------------------------------- |
|      | Use the unnamed slot to add `sbb-autocomplete-grid-button` elements. |
