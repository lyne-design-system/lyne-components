The `sbb-autocomplete-grid-row` is a wrapper for both [sbb-autocomplete-grid-option](/docs/elements-sbb-autocomplete-grid-sbb-autocomplete-grid-option--docs)
and [sbb-autocomplete-grid-cell](/docs/elements-sbb-autocomplete-grid-sbb-autocomplete-grid-cell--docs) within the
[sbb-autocomplete-grid](/docs/elements-sbb-autocomplete-sbb-autocomplete-grid--docs) component.

```html
<sbb-form-field label="Label">
  <input />
  <sbb-autocomplete-grid>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-cell>
        <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-cell>
    </sbb-autocomplete-grid-row>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="2">Option 2</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-cell>
        <sbb-autocomplete-grid-button icon-name="trash-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-cell>
    </sbb-autocomplete-grid-row>
  </sbb-autocomplete-grid>
</sbb-form-field>
```

## Slots

The component has an unnamed slot which is used to project `sbb-autocomplete-grid-option` and `sbb-autocomplete-grid-cell`.

## Accessibility

The `sbb-autocomplete-grid` follows the combobox `grid` pattern;
this means that the `sbb-autocomplete-grid-row` has a `row` role and its child would receive an `id` based on the `sbb-autocomplete-grid-row`'s `id`.

<!-- Auto Generated Below -->

## Slots

| Name | Description                                                                                                                                      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
|      | Use the unnamed slot to add a `sbb-autocomplete-grid-option` and a `sbb-autocomplete-grid-cell` with one or more `sbb-autocomplete-grid-button`. |
