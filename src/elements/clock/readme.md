The `sbb-clock` component displays an analog clock face in the style of the classic SBB station clock.

It mimics its behavior too, completing a rotation in approximately 58.5 seconds,
then it briefly pauses at the clock top before starting a new rotation.

```html
<sbb-clock></sbb-clock>
```

To simulate the current time, you can use the `now` property
which accepts a time string like `HH:MM:SS`.
This is helpful if you need a specific state of the component.

```html
<sbb-clock now="23:23:00"></sbb-clock>
```

<!-- Auto Generated Below -->

## Properties

| Name  | Attribute | Privacy | Type              | Default | Description                                                    |
| ----- | --------- | ------- | ----------------- | ------- | -------------------------------------------------------------- |
| `now` | `now`     | public  | `SbbTime \| null` | `null`  | Define a specific time which the clock should show statically. |
