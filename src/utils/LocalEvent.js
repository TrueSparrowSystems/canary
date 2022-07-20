import EventEmitter from 'eventemitter3';

export const LocalEvent = new EventEmitter();

export const EventTypes = {
  SwitchToHomeStack: 'event_types_switch_to_home_stack',
  BottomSheets: {
    CloseBottomSheet: 'event_types_bottom_sheets_close_bottom_sheet',
  },
  Internet: {
    Connected: 'event_types_internet_connected',
    Disconnected: 'event_types_internet_disconnected',
  },
  ShowAddCollectionModal: 'show_add_collection_modal',
};
