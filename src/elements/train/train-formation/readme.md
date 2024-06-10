The `sbb-train-formation` is a component used as a top container element
for wrapping [sbb-train](/docs/timetable-sbb-train--docs)s.

## Style

It has no properties, and it applies the possible scrollable-width to every given `sbb-train`
as CSS variable (`--sbb-train-direction-width`) initially and on resize.

```html
<sbb-train-formation>
  <sbb-train
    direction-label="Direction of travel"
    station="Bern"
    direction="left"
    accessibility-label="The top of the train is in Sector A. The train leaves the station in this direction"
  >
    <sbb-train-wagon
      sector="A"
      type="locomotive"
      additional-accessibility-text="Top of the train"
    ></sbb-train-wagon>
    <sbb-train-wagon sector="A" type="closed"> </sbb-train-wagon>
    <sbb-train-blocked-passage></sbb-train-blocked-passage>
    <sbb-train-wagon
      sector="A"
      type="wagon"
      label="38"
      occupancy="low"
      wagon-class="1"
      blocked-passage="previous"
    >
      <sbb-icon aria-hidden="false" aria-label="wheelchair space" name="sa-rs"></sbb-icon>
      <sbb-icon aria-hidden="false" aria-label="low-floor entry" name="sa-nf"></sbb-icon>
      <sbb-icon
        aria-hidden="false"
        aria-label="Business zone in 1st class: Reservation possible"
        name="sa-bz"
      ></sbb-icon>
    </sbb-train-wagon>
    ...
  </sbb-train>
  <sbb-train
    direction-label="Direction of travel"
    station="Luzern"
    direction="left"
    accessibility-label="The top of the train is in Sector E. The train leaves the station in this direction"
  >
    ...
  </sbb-train>
</sbb-train-formation>
```

<!-- Auto Generated Below -->

## Properties

| Name             | Attribute          | Privacy | Type      | Default | Description                      |
| ---------------- | ------------------ | ------- | --------- | ------- | -------------------------------- |
| `hideWagonLabel` | `hide-wagon-label` | public  | `boolean` | `false` | Option to hide all wagon labels. |

## Slots

| Name | Description                                                                    |
| ---- | ------------------------------------------------------------------------------ |
|      | Use the unnamed slot to add 'sbb-train' elements to the `sbb-train-formation`. |
