This component is the layout container for the disruption map, the level 3 navigation and the future ATLAS.

## Slots

It provides two slots: one unnamed slot for the sidebar content, and one named `map` for the map.

```html
<sbb-map-container>
  <div>Content</div>
  <div slot="map">Here comes the map.</div>
</sbb-map-container>
```

On mobile, the map is sticky above the sidebar, and the sidebar content is scrolling over the map.
On desktop, the sidebar and the map are shown in a two column layout side by side.

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute               | Privacy | Type      | Default | Description                                                          |
| -------------------- | ----------------------- | ------- | --------- | ------- | -------------------------------------------------------------------- |
| `hideScrollUpButton` | `hide-scroll-up-button` | public  | `boolean` | `false` | Flag to show/hide the scroll up button inside the sidebar on mobile. |

## CSS Properties

| Name                                | Default                             | Description                                                                                                                                                                 |
| ----------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sbb-map-container-margin-start`  | `var(--sbb-header-height)`          | The component comes along with a height calculation that subtracts the height of the header. For specific use cases, this variable can be used to modify the preset height. |
| `--sbb-map-container-sidebar-width` | `zero-large:400px;wide-ultra:480px` | Can be used to modify the width of the left sidebar.                                                                                                                        |

## Slots

| Name  | Description                                         |
| ----- | --------------------------------------------------- |
|       | Use the unnamed slot to add content to the sidebar. |
| `map` | Used for slotting the map.                          |
