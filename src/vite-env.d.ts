/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

declare module '*?lit&inline' {
  const src: import('lit').CSSResult;
  export default src;
}

declare namespace JSX {
  type Element = jsxDom.JSX.Element;
  type SbbAccordion = import('./components/accordion').SbbAccordion;
  type SbbActionGroup = import('./components/action-group').SbbActionGroup;
  type SbbAlert = import('./components/alert').SbbAlert;
  type SbbAlertGroup = import('./components/alert').SbbAlertGroup;
  type SbbAutocomplete = import('./components/autocomplete').SbbAutocomplete;
  type SbbBreadcrumb = import('./components/breadcrumb').SbbBreadcrumb;
  type SbbBreadcrumbGroup = import('./components/breadcrumb').SbbBreadcrumbGroup;
  type SbbButton = import('./components/button').SbbButton;
  type SbbCalendar = import('./components/calendar').SbbCalendar;
  type SbbCard = import('./components/card').SbbCard;
  type SbbCardAction = import('./components/card').SbbCardAction;
  type SbbCardBadge = import('./components/card').SbbCardBadge;
  type SbbCheckbox = import('./components/checkbox').SbbCheckbox;
  type SbbCheckboxGroup = import('./components/checkbox').SbbCheckboxGroup;
  type SbbChip = import('./components/chip').SbbChip;
  type SbbClock = import('./components/clock').SbbClock;
  type SbbDatepicker = import('./components/datepicker').SbbDatepicker;
  type SbbDatepickerNextDay = import('./components/datepicker').SbbDatepickerNextDay;
  type SbbDatepickerPreviousDay = import('./components/datepicker').SbbDatepickerPreviousDay;
  type SbbDatepickerToggle = import('./components/datepicker').SbbDatepickerToggle;
  type SbbDialog = import('./components/dialog').SbbDialog;
  type SbbDivider = import('./components/divider/').SbbDivider;
  type SbbExpansionPanel = import('./components/expansion-panel').SbbExpansionPanel;
  type SbbExpansionPanelContent = import('./components/expansion-panel').SbbExpansionPanelContent;
  type SbbExpansionPanelHeader = import('./components/expansion-panel').SbbExpansionPanelHeader;
  type SbbFileSelector = import('./components/file-selector').SbbFileSelector;
  type SbbFooter = import('./components/footer').SbbFooter;
  type SbbFormError = import('./components/form-error').SbbFormError;
  type SbbFormField = import('./components/form-field').SbbFormField;
  type SbbFormFieldClear = import('./components/form-field').SbbFormFieldClear;
  type SbbHeader = import('./components/header').SbbHeader;
  type SbbHeaderAction = import('./components/header').SbbHeaderAction;
  type SbbIcon = import('./components/icon').SbbIcon;
  type SbbImage = import('./components/image').SbbImage;
  type SbbJourneyHeader = import('./components/journey-header').SbbJourneyHeader;
  type SbbJourneySummary = import('./components/journey-summary').SbbJourneySummary;
  type SbbLink = import('./components/link').SbbLink;
  type SbbLinkList = import('./components/link-list').SbbLinkList;
  type SbbLoadingIndicator = import('./components/loading-indicator').SbbLoadingIndicator;
  type SbbLogo = import('./components/logo').SbbLogo;
  type SbbMapContainer = import('./components/map-container').SbbMapContainer;
  type SbbMenu = import('./components/menu').SbbMenu;
  type SbbMenuAction = import('./components/menu').SbbMenuAction;
  type SbbMessage = import('./components/message').SbbMessage;
  type SbbNavigation = import('./components/navigation').SbbNavigation;
  type SbbNavigationAction = import('./components/navigation').SbbNavigationAction;
  type SbbNavigationList = import('./components/navigation').SbbNavigationList;
  type SbbNavigationMarker = import('./components/navigation').SbbNavigationMarker;
  type SbbNavigationSection = import('./components/navigation').SbbNavigationSection;
  type SbbNotification = import('./components/notification').SbbNotification;
  type SbbOptGroup = import('./components/option').SbbOptGroup;
  type SbbOption = import('./components/option').SbbOption;
  type SbbPearlChain = import('./components/pearl-chain').SbbPearlChain;
  type SbbPearlChainTime = import('./components/pearl-chain-time').SbbPearlChainTime;
  type SbbPearlChainVertical = import('./components/pearl-chain-vertical').SbbPearlChainVertical;
  type SbbPearlChainVerticalItem =
    import('./components/pearl-chain-vertical-item').SbbPearlChainVerticalItem;
  type SbbRadioButton = import('./components/radio-button').SbbRadioButton;
  type SbbRadioButtonGroup = import('./components/radio-button').SbbRadioButtonGroup;
  type SbbSelect = import('./components/select').SbbSelect;
  type SbbSelectionPanel = import('./components/selection-panel').SbbSelectionPanel;
  type SbbSignet = import('./components/signet').SbbSignet;
  type SbbSkiplinkList = import('./components/skiplink-list').SbbSkiplinkList;
  type SbbSlider = import('./components/slider').SbbSlider;
  type SbbTabGroup = import('./components/tabs/tab-group').SbbTabGroup;
  type SbbTabTitle = import('./components/tabs/tab-title').SbbTabTitle;
  type SbbTag = import('./components/tag').SbbTag;
  type SbbTagGroup = import('./components/tag').SbbTagGroup;
  type SbbTeaser = import('./components/teaser').SbbTeaser;
  type SbbTeaserHero = import('./components/teaser-hero').SbbTeaserHero;
  type SbbTimeInput = import('./components/time-input').SbbTimeInput;
  type SbbTimetableBarrierFree =
    import('./components/timetable-barrier-free').SbbTimetableBarrierFree;
  type SbbTimetableDuration = import('./components/timetable-duration').SbbTimetableDuration;
  type SbbTimetableOccupancy = import('./components/timetable-occupancy').SbbTimetableOccupancy;
  type SbbTimetableParkAndRail =
    import('./components/timetable-park-and-rail').SbbTimetableParkAndRail;
  type SbbTimetableRow = import('./components/timetable-row').SbbTimetableRow;
  type SbbTimetableRowColumnHeaders =
    import('./components/timetable-row-column-headers').SbbTimetableRowColumnHeaders;
  type SbbTimetableRowDayChange =
    import('./components/timetable-row-day-change').SbbTimetableRowDayChange;
  type SbbTimetableRowHeader = import('./components/timetable-row-header').SbbTimetableRowHeader;
  type SbbTimetableTransportationNumber =
    import('./components/timetable-transportation-number').SbbTimetableTransportationNumber;
  type SbbTimetableTransportationTime =
    import('./components/timetable-transportation-time').SbbTimetableTransportationTime;
  type SbbTimetableTravelHints =
    import('./components/timetable-travel-hints').SbbTimetableTravelHints;
  type SbbTitle = import('./components/title').SbbTitle;
  type SbbToast = import('./components/toast').SbbToast;
  type SbbToggle = import('./components/toggle').SbbToggle;
  type SbbToggleCheck = import('./components/toggle-check').SbbToggleCheck;
  type SbbToggleOption = import('./components/toggle').SbbToggleOption;
  type SbbTooltip = import('./components/tooltip').SbbTooltip;
  type SbbTooltipTrigger = import('./components/tooltip').SbbTooltipTrigger;
  type SbbTrain = import('./components/train').SbbTrain;
  type SbbTrainBlockedPassage = import('./components/train').SbbTrainBlockedPassage;
  type SbbTrainFormation = import('./components/train').SbbTrainFormation;
  type SbbTrainWagon = import('./components/train').SbbTrainWagon;
  type SbbVisualCheckbox = import('./components/visual-checkbox').SbbVisualCheckbox;

  interface IntrinsicElements {
    'sbb-accordion': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbAccordion>, SbbAccordion>;
    'sbb-action-group': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbActionGroup>,
      SbbActionGroup
    >;
    'sbb-alert': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbAlert>, SbbAlert>;
    'sbb-alert-group': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbAlertGroup>,
      SbbAlertGroup
    >;
    'sbb-autocomplete': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbAutocomplete>,
      SbbAutocomplete
    >;
    'sbb-breadcrumb': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbBreadcrumb>, SbbBreadcrumb>;
    'sbb-breadcrumb-group': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbBreadcrumbGroup>,
      SbbBreadcrumbGroup
    >;
    'sbb-button': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbButton>, SbbButton>;
    'sbb-calendar': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbCalendar>, SbbCalendar>;
    'sbb-card': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbCard>, SbbCard>;
    'sbb-card-action': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbCardAction>,
      SbbCardAction
    >;
    'sbb-card-badge': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbCardBadge>, SbbCardBadge>;
    'sbb-checkbox': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbCheckbox>, SbbCheckbox>;
    'sbb-checkbox-group': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbCheckboxGroup>,
      SbbCheckboxGroup
    >;
    'sbb-chip': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbChip>, SbbChip>;
    'sbb-clock': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbClock>, SbbClock>;
    'sbb-datepicker': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbDatepicker>, SbbDatepicker>;
    'sbb-datepicker-next-day': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbDatepickerNextDay>,
      SbbDatepickerNextDay
    >;
    'sbb-datepicker-previous-day': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbDatepickerPreviousDay>,
      SbbDatepickerPreviousDay
    >;
    'sbb-datepicker-toggle': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbDatepickerToggle>,
      SbbDatepickerToggle
    >;
    'sbb-dialog': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbDialog>, SbbDialog>;
    'sbb-divider': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbDivider>, SbbDivider>;
    'sbb-expansion-panel': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbExpansionPanel>,
      SbbExpansionPanel
    >;
    'sbb-expansion-panel-content': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbExpansionPanelContent>,
      SbbExpansionPanelContent
    >;
    'sbb-expansion-panel-header': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbExpansionPanelHeader>,
      SbbExpansionPanelHeader
    >;
    'sbb-file-selector': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbFileSelector>,
      SbbFileSelector
    >;
    'sbb-footer': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbFooter>, SbbFooter>;
    'sbb-form-error': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbFormError>, SbbFormError>;
    'sbb-form-field': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbFormField>, SbbFormField>;
    'sbb-form-field-clear': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbFormFieldClear>,
      SbbFormFieldClear
    >;
    'sbb-header': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbHeader>, SbbHeader>;
    'sbb-header-action': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbHeaderAction>,
      SbbHeaderAction
    >;
    'sbb-icon': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbIcon>, SbbIcon>;
    'sbb-image': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbImage>, SbbImage>;
    'sbb-journey-header': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbJourneyHeader>,
      SbbJourneyHeader
    >;
    'sbb-journey-summary': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbJourneySummary>,
      SbbJourneySummary
    >;
    'sbb-link': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbLink>, SbbLink>;
    'sbb-link-list': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbLinkList>, SbbLinkList>;
    'sbb-loading-indicator': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbLoadingIndicator>,
      SbbLoadingIndicator
    >;
    'sbb-logo': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbLogo>, SbbLogo>;
    'sbb-map-container': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbMapContainer>,
      SbbMapContainer
    >;
    'sbb-menu': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbMenu>, SbbMenu>;
    'sbb-menu-action': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbMenuAction>,
      SbbMenuAction
    >;
    'sbb-message': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbMessage>, SbbMessage>;
    'sbb-navigation': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbNavigation>, SbbNavigation>;
    'sbb-navigation-action': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbNavigationAction>,
      SbbNavigationAction
    >;
    'sbb-navigation-list': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbNavigationList>,
      SbbNavigationList
    >;
    'sbb-navigation-marker': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbNavigationMarker>,
      SbbNavigationMarker
    >;
    'sbb-navigation-section': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbNavigationSection>,
      SbbNavigationSection
    >;
    'sbb-notification': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbNotification>,
      SbbNotification
    >;
    'sbb-optgroup': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbOptGroup>, SbbOptGroup>;
    'sbb-option': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbOption>, SbbOption>;
    'sbb-pearl-chain': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbPearlChain>,
      SbbPearlChain
    >;
    'sbb-pearl-chain-time': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbPearlChainTime>,
      SbbPearlChainTime
    >;
    'sbb-pearl-chain-vertical': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbPearlChainVertical>,
      SbbPearlChainVertical
    >;
    'sbb-pearl-chain-vertical-item': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbPearlChainVerticalItem>,
      SbbPearlChainVerticalItem
    >;
    'sbb-radio-button': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbRadioButton>,
      SbbRadioButton
    >;
    'sbb-radio-button-group': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbRadioButtonGroup>,
      SbbRadioButtonGroup
    >;
    'sbb-select': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbSelect>, SbbSelect>;
    'sbb-selection-panel': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbSelectionPanel>,
      SbbSelectionPanel
    >;
    'sbb-signet': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbSignet>, SbbSignet>;
    'sbb-skiplink-list': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbSkiplinkList>,
      SbbSkiplinkList
    >;
    'sbb-slider': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbSlider>, SbbSlider>;
    'sbb-tab-group': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTabGroup>, SbbTabGroup>;
    'sbb-tab-title': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTabTitle>, SbbTabTitle>;
    'sbb-tag': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTag>, SbbTag>;
    'sbb-tag-group': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTagGroup>, SbbTagGroup>;
    'sbb-teaser': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTeaser>, SbbTeaser>;
    'sbb-teaser-hero': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTeaserHero>,
      SbbTeaserHero
    >;
    'sbb-time-input': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTimeInput>, SbbTimeInput>;
    'sbb-timetable-barrier-free': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableBarrierFree>,
      SbbTimetableBarrierFree
    >;
    'sbb-timetable-duration': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableDuration>,
      SbbTimetableDuration
    >;
    'sbb-timetable-occupancy': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableOccupancy>,
      SbbTimetableOccupancy
    >;
    'sbb-timetable-park-and-rail': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableParkAndRail>,
      SbbTimetableParkAndRail
    >;
    'sbb-timetable-row': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableRow>,
      SbbTimetableRow
    >;
    'sbb-timetable-row-column-headers': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableRowColumnHeaders>,
      SbbTimetableRowColumnHeaders
    >;
    'sbb-timetable-row-day-change': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableRowDayChange>,
      SbbTimetableRowDayChange
    >;
    'sbb-timetable-row-header': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableRowHeader>,
      SbbTimetableRowHeader
    >;
    'sbb-timetable-transportation-number': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableTransportationNumber>,
      SbbTimetableTransportationNumber
    >;
    'sbb-timetable-transportation-time': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableTransportationTime>,
      SbbTimetableTransportationTime
    >;
    'sbb-timetable-travel-hints': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTimetableTravelHints>,
      SbbTimetableTravelHints
    >;
    'sbb-title': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTitle>, SbbTitle>;
    'sbb-toast': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbToast>, SbbToast>;
    'sbb-toggle': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbToggle>, SbbToggle>;
    'sbb-toggle-check': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbToggleCheck>,
      SbbToggleCheck
    >;
    'sbb-toggle-option': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbToggleOption>,
      SbbToggleOption
    >;
    'sbb-tooltip': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTooltip>, SbbTooltip>;
    'sbb-tooltip-trigger': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTooltipTrigger>,
      SbbTooltipTrigger
    >;
    'sbb-train': jsxDom.DetailedHTMLProps<jsxDom.HTMLAttributes<SbbTrain>, SbbTrain>;
    'sbb-train-blocked-passage': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTrainBlockedPassage>,
      SbbTrainBlockedPassage
    >;
    'sbb-train-formation': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTrainFormation>,
      SbbTrainFormation
    >;
    'sbb-train-wagon': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbTrainWagon>,
      SbbTrainWagon
    >;
    'sbb-visual-checkbox': jsxDom.DetailedHTMLProps<
      jsxDom.HTMLAttributes<SbbVisualCheckbox>,
      SbbVisualCheckbox
    >;
  }
}
