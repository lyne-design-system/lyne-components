The `sbb-tab-title` is a component which is meant to be used in combination with the
[sbb-tab-group](/docs/elements-sbb-tab-sbb-tab-group--docs) component
in order to display a tab label within the tab bar.

```html
<sbb-tab-title>Tab Label</sbb-tab-title>
```

## Slots

It is possible to provide a label via an unnamed slot; the component can optionally display a `sbb-icon`
at the component start using the `iconName` property or via custom content using the `icon` slot.

It's also possible to display a numeric amount at the component's end using the `amount` property or slot.

The label's heading tag can be changed using the `level` property.

```html
<sbb-tab-title icon-name="app-icon-small" amount="123"> Tab Label </sbb-tab-title>

<sbb-tab-title>
  <sbb-icon slot="icon" name="circle-information-small"></sbb-icon>
  Tab Label
  <span slot="amount">123</span>
</sbb-tab-title>
```

## States

It is possible to display the component in `disabled` state by using the self-named property.

```html
<sbb-tab-title disabled> Tab Label </sbb-tab-title>
```

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute   | Privacy | Type                   | Default | Description                                                                                                                                                   |
| ---------- | ----------- | ------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `active`   | `active`    | public  | `boolean \| undefined` |         | Active tab state                                                                                                                                              |
| `amount`   | `amount`    | public  | `string \| undefined`  |         | Amount displayed inside the tab.                                                                                                                              |
| `disabled` | `disabled`  | public  | `boolean`              | `false` | Whether the component is disabled.                                                                                                                            |
| `iconName` | `icon-name` | public  | `string \| undefined`  |         | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch.                              |
| `level`    | `level`     | public  | `SbbTitleLevel`        | `'1'`   | The level will correspond to the heading tag generated in the title. Use this property to generate the appropriate header tag, taking SEO into consideration. |

## Slots

| Name     | Description                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------- |
|          | Use the unnamed slot to add content to the tab title.                                             |
| `amount` | Provide a number to show an amount to the right of the title.                                     |
| `icon`   | Use this slot to display an icon to the left of the title, by providing the `sbb-icon` component. |
