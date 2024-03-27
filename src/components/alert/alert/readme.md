The `sbb-alert` is a component which should be used to display important messages to a client.

Multiple instances of this component can be used within
the [sbb-alert-group](/docs/components-sbb-alert-sbb-alert-group--docs) component.

## Slots

The text content is projected using and unnamed slot, while the title uses the slot named `title` or alternatively the `titleContent` property.
The component can optionally display a `sbb-icon` at the component start using the `iconName` property or via custom content using the `icon` slot.

```html
<sbb-alert title-content="Interruption between Berne and Olten" icon-name="disruption">
  Between Bern and Olten from 03.11.2021 to 05.12.2022 each time from 22:30 to 06:00 o'clock
  construction work will take place. You have to expect changed travel times and changed
  connections.
</sbb-alert>

<sbb-alert>
  <span slot="title">Interruption between Berne and Olten</span>
  <sbb-icon slot="icon" name="disruption"></sbb-icon>
  Between Bern and Olten from 03.11.2021 to 05.12.2022 each time from 22:30 to 06:00 o'clock
  construction work will take place. You have to expect changed travel times and changed
  connections.
</sbb-alert>
```

## Interactions

It's possible to place an action, which by clicking navigates somewhere to display more information.
This can be done using the `linkContent` property combined with the `href` one.
The `target` and `rel` properties are also configurable via the self-named properties.

```html
<sbb-alert
  title-content="Interruption"
  link-content="Show more"
  href="https://www.sbb.ch"
  target="_blank"
>
  ...
</sbb-alert>
```

The `sbb-alert` can optionally be hidden by a user, if the `readonly` prop is not set.
Please note that clicking on the close button does not remove it from the DOM, this would be the responsibility
of the library consumer to do it by reacting to the specific event.
See also the [sbb-alert-group](/docs/components-sbb-alert-sbb-alert-group--docs)
which automatically removes an alert after clicking the close button.

```html
<sbb-alert title-content="Interruption between Berne and Olten" readonly>
  Between Bern and Olten from 03.11.2021 to 05.12.2022 each time from 22:30 to 06:00 o'clock
  construction work will take place. You have to expect changed travel times and changed
  connections.
</sbb-alert>
```

## Style

Users can choose between two `size`, `m` (default) and `l`.

```html
<sbb-alert size="l"> ... </sbb-alert>
```

## Accessibility

Accessibility is mainly done by wrapping the alerts into the `sbb-alert-group`.

The description text is wrapped into an `<p>` element to guarantee the semantic meaning.

Avoid slotting block elements (e.g. `<div>`) as this violates semantic rules and can have negative effects on screen readers.

## Animation

By default, the `sbb-alert` does not have an open animation. Add the `.sbb-animate` class to the element to enable a fade-in animation.

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute             | Privacy | Type                                    | Default  | Description                                                                                                                                                      |
| -------------------- | --------------------- | ------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readonly`           | `readonly`            | public  | `boolean`                               | `false`  | Whether the alert is readonly. In readonly mode, there is no dismiss button offered to the user.                                                                 |
| `size`               | `size`                | public  | `'m' \| 'l'`                            | `'m'`    | You can choose between `m` or `l` size.                                                                                                                          |
| `iconName`           | `icon-name`           | public  | `string \| undefined`                   | `'info'` | Name of the icon which will be forward to the nested `sbb-icon`. Choose the icons from https://icons.app.sbb.ch. Styling is optimized for icons of type HIM-CUS. |
| `titleContent`       | `title-content`       | public  | `string \| undefined`                   |          | Content of title.                                                                                                                                                |
| `titleLevel`         | `title-level`         | public  | `SbbTitleLevel`                         | `'3'`    | Level of title, will be rendered as heading tag (e.g. h3). Defaults to level 3.                                                                                  |
| `linkContent`        | `link-content`        | public  | `string \| undefined`                   |          | Content of the link.                                                                                                                                             |
| `href`               | `href`                | public  | `string \| undefined`                   |          | The href value you want to link to.                                                                                                                              |
| `target`             | `target`              | public  | `LinkTargetType \| string \| undefined` |          | Where to display the linked URL.                                                                                                                                 |
| `rel`                | `rel`                 | public  | `string \| undefined`                   |          | The relationship of the linked URL as space-separated link types.                                                                                                |
| `accessibilityLabel` | `accessibility-label` | public  | `string \| undefined`                   |          | This will be forwarded as aria-label to the relevant nested element.                                                                                             |

## Methods

| Name               | Privacy | Description                      | Parameters | Return | Inherited From |
| ------------------ | ------- | -------------------------------- | ---------- | ------ | -------------- |
| `requestDismissal` | public  | Requests dismissal of the alert. |            | `void` |                |

## Events

| Name                 | Type                | Description                                                        | Inherited From |
| -------------------- | ------------------- | ------------------------------------------------------------------ | -------------- |
| `willOpen`           | `CustomEvent<void>` | Emits when the fade in animation starts.                           |                |
| `didOpen`            | `CustomEvent<void>` | Emits when the fade in animation ends and the button is displayed. |                |
| `dismissalRequested` | `CustomEvent<void>` | Emits when dismissal of an alert was requested.                    |                |

## Slots

| Name    | Description                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------ |
|         | Use the unnamed slot to add content to the `sbb-alert`.                                                      |
| `icon`  | Should be a `sbb-icon` which is displayed next to the title. Styling is optimized for icons of type HIM-CUS. |
| `title` | Title content.                                                                                               |
