The `sbb-datepicker` is a component which can be used together with a native `<input>` element
to display the typed value as a formatted date (default: `dd.MM.yyyy`).

The component allows the insertion of up to 10 numbers, possibly with separators like `.`, `-`, ` `, `,` or `/`,
then automatically formats the value as date and displays it.
It also allows to get / set the value formatted as Date.

The component and the native `input` can be connected using the `input` property,
which accepts the id of the native input, or directly its reference.

```html
<input id="datepicker-input" />
<sbb-datepicker input="datepicker-input" id="datepicker"></sbb-datepicker>
```

## In `sbb-form-field`

If the `sbb-datepicker` is used within a [sbb-form-field](/docs/components-sbb-form-field-sbb-form-field--docs) with a native input,
they are automatically linked; the component sets the input placeholder and the input's type as `text`,
then reads the `disabled`, `readonly`, `min` and `max` attributes from the input and emits then as payload of the `inputUpdated` event.

It's possible to remove unwanted dates from selection using the `dateFilter` function, however, this should **not**
be used as a replacement for the `min` and `max` properties will most likely result in a significant loss of performance.

It's also possible to display a two-months view using the `wide` property.

```html
<sbb-form-field>
  <input />
  <sbb-datepicker></sbb-datepicker>
</sbb-form-field>
```

```html
<!-- Component's usage with all the related components. -->
<sbb-form-field>
  <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
  <sbb-datepicker-toggle></sbb-datepicker-toggle>
  <input value="01.01.2023" min="1600000000" max="1700000000" />
  <sbb-datepicker></sbb-datepicker>
  <sbb-datepicker-next-day></sbb-datepicker-next-day>
</sbb-form-field>
```

## Events

If the input's value changes, it is formatted then a `change` event is emitted with the new value.
If it's an invalid date, the `data-sbb-invalid` attribute is added to the input.
The component also listens for changes in its two properties, `wide` and `dateFilter`, and emits a `datePickerUpdated` event when changed.

Consumers can listen to the native `change` and `input` events on the `sbb-datepicker` component to intercept date changes.
The `valueAsDate` property on the `sbb-datepicker` can be used to read the current value
(e.g. from `event.target.valueAsDate`) or to set the value programmatically.

Each time the user changes the date by using the calendar, or the next and previous day arrow, or by using the `valueAsDate` setter,
a `blur` event is fired on the input to ensure compatibility with any framework that relies on that event to update the current state.

## Custom date formats

Using a combination of the `dateParser` and `format` properties, it's possible to configure the datepicker
to accept date formats other than the default `EE, dd.mm.yyyy`.
In the following example the datepicker is set to accept dates in the format `yyyy-mm-dd`.
In particular, `dateParser` is the function that the component uses internally to decode strings and parse them into `Date` objects,
while the `format` function is the one that the component uses internally to display a given `Date` object as a string.

```ts
// datePicker is a SbbDatepickerElement element
datePicker.dateParser = (value: string) => {
  // You should implement some kind of input validation
  if (!value || !isValid(value)) {
    return undefined;
  }

  return new Date(value);
};

datePicker.format = (value: Date) => {
  if (!value) {
    return '';
  }

  const offset = value.getTimezoneOffset();
  value = new Date(yourDate.getTime() - offset * 60 * 1000);
  return yourDate.toISOString().split('T')[0];
};
```

Usually these functions need to be changed together, although in simple cases where the default `dateParser` might still work properly
(e.g., in case we wanted to accept the format `dd.mm.yyyy`), it's possible to provide just the `format` function.
For custom `format` functions is recommended to use the `Intl.DateTimeFormat` API, as it's done in the default implementation.

<!-- TODO: add date adapter configuration documentation -->

## Validation Change

Whenever the validation state changes (e.g., a valid value becomes invalid or vice-versa), the `validationChange` event is emitted.

## Testing

To specify a specific date for the current datetime, you can use the `data-now` attribute (timestamp in milliseconds).
This is helpful if you need a specific state of the component.

<!-- Auto Generated Below -->

## Properties

| Name          | Attribute     | Privacy | Type                                                | Default | Description                                                       |
| ------------- | ------------- | ------- | --------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| `wide`        | `wide`        | public  | `boolean`                                           | `false` | If set to true, two months are displayed.                         |
| `dateFilter`  | `date-filter` | public  | `(date: Date \| null) => boolean`                   |         | A function used to filter out dates.                              |
| `dateParser`  | `date-parser` | public  | `(value: string) => Date \| undefined \| undefined` |         | A function used to parse string value into dates.                 |
| `format`      | `format`      | public  | `(date: Date) => string \| undefined`               |         | A function used to format dates into the preferred string format. |
| `input`       | `input`       | public  | `string \| HTMLElement \| undefined`                |         | Reference of the native input connected to the datepicker.        |
| `valueAsDate` | -             | public  | `Date \| undefined`                                 |         | Formats the current input's value as date.                        |

## Events

| Name                | Type                                 | Description                                                                         | Inherited From |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- | -------------- |
| `didChange`         | `CustomEvent<void>`                  | Deprecated. used for React. Will probably be removed once React 19 is available.    |                |
| `change`            | `CustomEvent<void>`                  | Notifies that the connected input has changes.                                      |                |
| `inputUpdated`      | `CustomEvent<InputUpdateEvent>`      | Notifies that the attributes of the input connected to the datepicker have changes. |                |
| `datePickerUpdated` | `CustomEvent<void>`                  | Notifies that the attributes of the datepicker have changes.                        |                |
| `validationChange`  | `CustomEvent<ValidationChangeEvent>` | Emits whenever the internal validation state changes.                               |                |
