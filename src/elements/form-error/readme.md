The `sbb-form-error` component can be used to provide an error message in inputs components like the
[sbb-checkbox-group](/docs/elements-sbb-checkbox-sbb-checkbox-group--docs) and
[sbb-radio-button-group](/docs/elements-sbb-radio-button-sbb-radio-button-group--docs),
or within the [sbb-form-field](/docs/elements-sbb-form-field-sbb-form-field--docs).

## Slots

It is possible to provide the error message via an unnamed slot;
the component displays an icon by default, that can be changed using the `icon` slot.

```html
<sbb-form-error> This is a required field. </sbb-form-error>

<sbb-form-error>
  <sbb-icon name="pie-small" slot="icon"></sbb-icon>
  This is a required field.
</sbb-form-error>
```

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute  | Privacy | Type      | Default | Description                     |
| ---------- | ---------- | ------- | --------- | ------- | ------------------------------- |
| `negative` | `negative` | public  | `boolean` | `false` | Negative coloring variant flag. |

## Slots

| Name   | Description                                       |
| ------ | ------------------------------------------------- |
|        | Use this slot to display the error message.       |
| `icon` | Use this slot to override the default error icon. |
