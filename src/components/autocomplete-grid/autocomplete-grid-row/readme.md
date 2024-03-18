The `sbb-autocomplete-grid-row` is a wrapper for both [sbb-autocomplete-grid-option](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-option--docs)
and [sbb-autocomplete-grid-actions](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-actions--docs) within the
[sbb-autocomplete-grid](/docs/components-sbb-autocomplete-sbb-autocomplete-grid--docs) component.

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
        <sbb-autocomplete-grid-button icon-name="trash-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-actions>
    </sbb-autocomplete-grid-row>
  </sbb-autocomplete-grid>
</sbb-form-field>
```

## Slots

The component has an unnamed slot which is used to project `sbb-autocomplete-grid-option` and `sbb-autocomplete-grid-actions`.

## Accessibility

The `sbb-autocomplete-grid` follows the combobox `grid` pattern;
this means that the `sbb-autocomplete-grid-row` has a `row` role and its child would receive an `id` based on the `sbb-autocomplete-grid-row`'s `id`.

<!-- Auto Generated Below -->
