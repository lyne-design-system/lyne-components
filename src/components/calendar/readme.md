The `sbb-calendar` component displays a calendar that allows the user to select a date.

While being deeply linked to the implementation of the [sbb-datepicker-toggle](/docs/components-sbb-datepicker-sbb-datepicker-toggle--docs) component,
it can be used on its own.

```html
<sbb-calendar></sbb-calendar>
```

It's possible to set a date using the `dateSelected` property. Also, it's possible to place limits on the selection
using the two properties named `min` and `max`. For these three properties, the accepted formats are:

- Date objects
- ISO String
- Unix Timestamp (number of seconds since Jan 1, 1970)

It's recommended to set the time to 00:00:00.

```html
<sbb-calendar min="1600000000" max="1700000000" selected="1650000000"></sbb-calendar>
```

## Style

The component displays one month by default; two months can be displayed setting the `wide` property to `true`.

```html
<sbb-calendar wide="true" selected="1650000000"></sbb-calendar>
```

It's also possible to filter out unwanted date using the `dateFilter` function property.
Note that using the `dateFilter` function as a replacement for the `min` and `max` properties will most likely result in a significant loss of performance.

## Events

Consumers can listen to the `dateSelected` event on the `sbb-calendar` component to intercept the selected date
which can be read from `event.detail`.

## Keyboard interaction

It's possible to move within the component using the keyboard.

| Keyboard               | Action                                                        |
| ---------------------- | ------------------------------------------------------------- |
| <kbd>Left Arrow</kbd>  | Go to previous day.                                           |
| <kbd>Right Arrow</kbd> | Go to next day.                                               |
| <kbd>Up Arrow</kbd>    | Go to the same day in the previous week.                      |
| <kbd>Down Arrow</kbd>  | Go to the same day in the next week.                          |
| <kbd>Home</kbd>        | Go to the first day of the month.                             |
| <kbd>End</kbd>         | Go to the last day of the month.                              |
| <kbd>Page Up</kbd>     | Go to the top of the column of the currently selected day.    |
| <kbd>Page Down</kbd>   | Go to the bottom of the column of the currently selected day. |

## Accessibility

For accessibility purposes, the component is rendered as a native table element and each day is a button.

## Testing

To specify a specific date for the current datetime, you can use the `data-now` attribute (timestamp in milliseconds).
This is helpful if you need a specific state of the component.

## Animation

Add the `sbb-disable-animation` class to disable animation and transition effects for the element and all its children.

<!-- Auto Generated Below -->

## Properties

| Name         | Attribute     | Privacy | Type                                        | Default | Description                                                                                                  |
| ------------ | ------------- | ------- | ------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `wide`       | `wide`        | public  | `boolean`                                   | `false` | If set to true, two months are displayed                                                                     |
| `min`        | `min`         | public  | `T \| null`                                 |         | The minimum valid date. Takes T Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970). |
| `max`        | `max`         | public  | `T \| null`                                 |         | The maximum valid date. Takes T Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970). |
| `selected`   | `selected`    | public  | `T \| null`                                 |         | The selected date. Takes T Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970).      |
| `dateFilter` | `date-filter` | public  | `(date: T \| null) => boolean \| undefined` |         | A function used to filter out dates.                                                                         |

## Methods

| Name            | Privacy | Description                                                         | Parameters | Return | Inherited From |
| --------------- | ------- | ------------------------------------------------------------------- | ---------- | ------ | -------------- |
| `resetPosition` | public  | Resets the active month according to the new state of the calendar. |            | `void` |                |

## Events

| Name           | Type             | Description                      | Inherited From |
| -------------- | ---------------- | -------------------------------- | -------------- |
| `dateSelected` | `CustomEvent<T>` | Event emitted on date selection. |                |
