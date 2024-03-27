The `sbb-teaser-paid` is a component with a background image and a chip with a text.

```html
<sbb-teaser-paid>
  <sbb-chip slot="chip">Label</sbb-chip>
  <sbb-image slot="image" image-src="https://path-to-source" alt="SBB CFF FFS Employee"></sbb-image>
</sbb-teaser-paid>
```

## Slots

The `sbb-teaser-paid` component has two slots: the `image` slot, used to slot an `sbb-image` and the `chip` slot, used to slot an `sbb-chip`.

## Animation

Add the `sbb-disable-animation` class to disable animation and transition effects for the element and all its children.

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute  | Privacy | Type                                    | Default | Description                                                       |
| ---------- | ---------- | ------- | --------------------------------------- | ------- | ----------------------------------------------------------------- |
| `href`     | `href`     | public  | `string \| undefined`                   |         | The href value you want to link to.                               |
| `target`   | `target`   | public  | `LinkTargetType \| string \| undefined` |         | Where to display the linked URL.                                  |
| `rel`      | `rel`      | public  | `string \| undefined`                   |         | The relationship of the linked URL as space-separated link types. |
| `download` | `download` | public  | `boolean \| undefined`                  |         | Whether the browser will show the download dialog on click.       |

## Slots

| Name    | Description                                    |
| ------- | ---------------------------------------------- |
| `chip`  | Link content of the panel                      |
| `image` | The background image that can be a `sbb-image` |
